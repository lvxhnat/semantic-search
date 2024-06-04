from inspect import stack

import cudf

from mlengine.core.preprocessing.cleaning import clean_post_content
from mlengine.core.preprocessing.lang_detect import (
    detect_language,
    filter_language,
)
from mlengine.services.storage.gcs_service import gcs_client


def preprocess_dataframe(
    df: cudf.DataFrame,
    *,
    language: str,
    post_content_column_name: str,
    task_id: str,
    dataset_id: str,
) -> cudf.DataFrame:

    stage_metadata = {
        "language_picked": language,
        "original_size": df.shape[0],
        "clean_post_content": None,
        "filter_language": None,
        "languages_detected": None,
    }

    df = clean_post_content(
        df,
        post_content_column_name=post_content_column_name,
        language=language,
    )
    stage_metadata["clean_post_content"] = df.shape[0]

    df = detect_language(df, post_content_column_name=post_content_column_name)
    stage_metadata["languages_detected"] = (
        df["post_language"].unique().to_arrow().to_pylist()
    )

    df = filter_language(df, language=language)
    stage_metadata["filter_language"] = df.shape[0]

    func_name: str = stack()[0].function
    storage_url: str = gcs_client.create_project_path(
        task_id=task_id,
        dataset_id=dataset_id,
        func_name=func_name,
    )
    gcs_client.write_json(
        path=rf"{storage_url}/{func_name}.json", data=stage_metadata
    )
    gcs_client.write_dataframe(
        path=rf"{storage_url}/{func_name}.parquet",
        df=df,
        format="parquet",
    )

    return df
