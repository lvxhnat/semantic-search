import numpy as np
from sentence_transformers import SentenceTransformer

def sbert(corpus_arr: np.ndarray, *, language: str = "en") -> np.ndarray:
    """Turn an array of documents into vector embeddings
    Language Code references here -> https://www.loc.gov/standards/iso639-2/php/code_list.php
    List of supported languages for each model here -> https://www.sbert.net/docs/pretrained_models.html

    To Implement
    ---------------
    Idempotency checks for if model has ran this process before if pipeline has failed.

    """
    language: str = language.lower()

    if language == "en":
        model = SentenceTransformer("all-MiniLM-L12-v2")
    else:
        model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")

    embeddings: np.ndarray = model.encode(corpus_arr, show_progress_bar=True)

    del model

    return embeddings
