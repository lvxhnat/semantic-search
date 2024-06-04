import concurrent.futures
import os
from inspect import stack
from typing import List, Tuple

import cudf

from mlengine.core.postprocessing.teardowns import (
    generate_distinct_topic_keywords,
    generate_keyword_matrix,
    generate_topic_count_metrics,
)
from mlengine.core.postprocessing.hierarchy import generate_topic_hierarchy
from mlengine.core.postprocessing.tokenizer import get_top_keywords
from mlengine.services.storage.gcs_service import gcs_client
from mlengine.utils.generators import StringGen


def postprocess_dataframe(
    df: cudf.DataFrame,
    *,
    language: str,
    elastic_index,
    post_content_column_name: str,
    task_id: str,
    dataset_id: str,
) -> Tuple[
    cudf.DataFrame,
    cudf.DataFrame,
    cudf.DataFrame,
    cudf.DataFrame,
    Tuple[cudf.DataFrame, cudf.DataFrame],
]:
    """Run Post Processing on df

    Args:
        df (_type_): _description_
        language (str): _description_
        post_content_column_name (str): _description_

    Returns:
        Tuple[cudf.DataFrame]: _description_
    """

    top_keywords: List[List[str]] = get_top_keywords(
        df[f"cleaned_{post_content_column_name}"].to_numpy(), language=language
    )
    df: cudf.DataFrame = (
        df.assign(keywords=top_keywords)
        .rename(columns={"cluster": "cluster_number"})
        .assign(
            post_uuid=[
                StringGen(16).generate("strong") for _ in range(len(df))
            ]
        )
    )
    keyword_matrix: cudf.DataFrame = generate_keyword_matrix(
        df[df.cluster_number > -1].reset_index(drop=True, inplace=False)
    )

    distinct_topic_keywords: cudf.DataFrame = generate_distinct_topic_keywords(
        keyword_matrix
    )
    topic_count_metrics: cudf.DataFrame = generate_topic_count_metrics(df)

    topic_hierarchy, topic_hierarchy_alias = generate_topic_hierarchy(
        keyword_matrix=keyword_matrix, topic_count_metrics=topic_count_metrics
    )

    # To get posts tagged to each cluster_uuid than cluster_number
    df: cudf.DataFrame = df.merge(
        topic_count_metrics.drop(columns=["docs_count", "docs_pct"]),
        on="cluster_number",
    )

    # write out posts out
    storage_url: str = gcs_client.create_project_path(
        task_id=task_id,
        dataset_id=dataset_id,
        func_name=stack()[0].function,
    )
    # Write our post processed dataframe into GCS for usage
    with concurrent.futures.ThreadPoolExecutor(
        max_workers=max(os.cpu_count(), 5)
    ) as executor:
        tasks = [
            executor.submit(
                gcs_client.write_dataframe,
                path=f"{storage_url}/df/df.parquet",
                df=df,
                format="parquet",
            ),
            executor.submit(
                gcs_client.write_dataframe,
                path=f"{storage_url}/topic_count_metrics/topic_count_metrics.parquet",
                df=topic_count_metrics,
                format="parquet",
            ),
            executor.submit(
                gcs_client.write_dataframe,
                path=f"{storage_url}/distinct_topic_keywords/distinct_topic_keywords.parquet",
                df=distinct_topic_keywords,
                format="parquet",
            ),
            executor.submit(
                gcs_client.write_dataframe,
                path=f"{storage_url}/keyword_matrix/keyword_matrix.parquet",
                df=keyword_matrix,
                format="parquet",
            ),
            executor.submit(
                gcs_client.write_dataframe,
                path=f"{storage_url}/topic_hierarchy/topic_hierarchy.parquet",
                df=topic_hierarchy,
                format="parquet",
            ),
        ]
        for future in concurrent.futures.as_completed(tasks):
            future.result()

    return cast_post_process_dfs(
        df,
        topic_count_metrics=topic_count_metrics,
        distinct_topic_keywords=distinct_topic_keywords,
        topic_hierarchy=(topic_hierarchy, topic_hierarchy_alias),
        elastic_index=elastic_index,
        task_id=task_id,
    )


def cast_post_process_dfs(
    df: cudf.DataFrame,
    topic_count_metrics: cudf.DataFrame,
    distinct_topic_keywords: cudf.DataFrame,
    topic_hierarchy: Tuple[cudf.DataFrame, List[int]],
    elastic_index: str,
    task_id: str,
) -> Tuple[
    cudf.DataFrame,
    cudf.DataFrame,
    cudf.DataFrame,
    cudf.DataFrame,
    Tuple[cudf.DataFrame, cudf.DataFrame],
]:

    cluster_keyword_df = (
        topic_count_metrics.merge(distinct_topic_keywords, on="cluster_number")
        .rename(columns={"keyword_uuid": "cluster_keyword_uuid"})
        .assign(task_uuid=task_id)
    )

    keyword_to_post_df = (
        df[df["cluster_number"] != -1][
            ["post_uuid", "keywords", "cluster_number"]
        ]
        .explode("keywords")
        .dropna()
        .reset_index(drop=True)
        .rename(
            columns={"keywords": "keyword", "post_uuid": "tagged_post_uuid"}
        )
    ).merge(cluster_keyword_df, on=["keyword", "cluster_number"])

    topic_count_metrics = topic_count_metrics.rename(
        columns={
            "cluster_uuid": "uuid",
            "cluster_number": "topic_name",
        }
    ).assign(task_uuid=task_id)

    cluster_keyword_df = cluster_keyword_df.rename(
        columns={
            "cluster_keyword_uuid": "uuid",
        }
    )
    df = (
        df.rename(
            columns={
                "post_uuid": "uuid",
            }
        )
        .assign(
            keywords=df.keywords.to_pandas().apply(
                lambda s: ",".join(map(str, s))
            )
        )
        .assign(elastic_index=elastic_index)
    )

    return (
        df,
        topic_count_metrics,
        cluster_keyword_df,
        keyword_to_post_df,
        (topic_hierarchy[0].assign(task_uuid=task_id), topic_hierarchy[1]),
    )
