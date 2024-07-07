import cudf
import cuml
import numpy as np


def hdbscan(
    umap_embeddings: np.ndarray,
    df,
    *,
    min_samples: int = 8,
    cluster_size_multiplier: float = 0.1,
    cluster_selection_method: str = "leaf",
) -> cudf.DataFrame:
    # Documentation here https://docs.rapids.ai/api/cuml/nightly/api.html
    # See hyperparameter selection here https://hdbscan.readthedocs.io/en/latest/parameter_selection.html
    min_cluster_size: int = max(
        10, int((len(umap_embeddings) / 100) * cluster_size_multiplier)
    )

    fitted_model = cuml.cluster.HDBSCAN(
        min_samples=min_samples,
        min_cluster_size=min_cluster_size,
        cluster_selection_method=cluster_selection_method,
    ).fit(umap_embeddings)

    df["cluster"] = fitted_model.labels_

    return df
