import cuml
import numpy as np

def umap(
    embedding_arr: np.ndarray,
    *,
    n_components: int = None,
    n_neighbors: int = 25,
) -> np.ndarray:
    """Reduce the dimensions of the nested vectors in the embeddings array"""

    if not n_components:
        n_components = 50

    umap_embedding_arr: np.ndarray = cuml.UMAP(
        n_neighbors=n_neighbors,
        n_components=n_components,
        verbose=True,
        random_state=42,
    ).fit_transform(embedding_arr)

    return umap_embedding_arr
