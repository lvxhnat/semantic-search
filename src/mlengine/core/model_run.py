from inspect import stack

import cudf
import numpy as np

from mlengine.core.model.dimensionality_reduction import umap
from mlengine.core.model.hierarchical_clustering import hdbscan
from mlengine.core.model.sentence_embeddings import sbert
from mlengine.services.storage.gcs_service import gcs_client


def model_run(
    df: cudf.DataFrame,
    *,
    language: str,
    post_content_column_name: str,
) -> cudf.DataFrame:

    embeddings: np.ndarray = sbert(
        df[f"cleaned_{post_content_column_name}"].to_numpy(), language=language
    )
    return df
