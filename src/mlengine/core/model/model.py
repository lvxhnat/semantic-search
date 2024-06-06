from typing import List
from sentence_transformers import SentenceTransformer


def train_embedding_model():
    embedder = SentenceTransformer("all-MiniLM-L6-v2")
    return embedder


def get_corpus_embeddings(embedder, corpus: List[str]):
    return embedder.encode(corpus)
