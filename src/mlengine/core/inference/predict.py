import torch
from typing import List, Tuple


def get_top_queries(
    query: str, embedder, corpus: List[str], corpus_embeddings, top_k: int = 5
) -> Tuple[List[str, float]]:
    q_embeddings = embedder.encode(query, convert_to_tensor=True)
    similarity_scores = embedder.similarity(q_embeddings, corpus_embeddings)[0]
    scores, indices = torch.topk(similarity_scores, k=top_k)
    return [(corpus[idx], float(score)) for score, idx in zip(scores, indices)]
