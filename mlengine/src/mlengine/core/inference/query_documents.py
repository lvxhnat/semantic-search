import torch
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


def query_documents(
    model,
    tokenizer,
    corpus,
    corpus_embeddings,
    query: str,
    top_k: int = 5,
):

    # Tokenize and encode the query into an embedding
    encoded_query = tokenizer(
        query,
        padding=True,
        truncation=True,
        max_length=128,
        return_tensors="pt",
    )
    with torch.no_grad():
        output = model(**encoded_query)
        query_embedding = output.hidden_states[-1].mean(
            dim=1
        )  # Using mean pooling

    similarities = cosine_similarity(query_embedding, corpus_embeddings)
    top_k_indices = np.argsort(similarities[0])[-top_k:][::-1]
    top_k_documents = [corpus[i] for i in top_k_indices]

    return top_k_documents
