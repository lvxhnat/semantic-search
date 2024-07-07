import cuml
import numpy as np


def umap(
    embedding_arr: np.ndarray,
    *,
    n_components: int = None,
    n_neighbors: int = 25,
    viz: bool = False,
) -> np.ndarray:
    """Reduce the dimensions of the nested vectors in the embeddings array"""

    n_components: int = (
        (2 if viz else 50) if n_components is None else n_components
    )

    umap_embedding_arr: np.ndarray = cuml.UMAP(
        n_neighbors=n_neighbors,
        n_components=n_components,
        verbose=True,
        random_state=42,
    ).fit_transform(embedding_arr)

    return umap_embedding_arr
