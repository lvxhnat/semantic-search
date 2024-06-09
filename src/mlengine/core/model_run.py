import pandas as pd
from typing import List
from mlengine.core.inference.predict import get_top_queries
from mlengine.core.model import (
    train_embedding_model,
    get_corpus_embeddings,
    save_model,
)


def run():
    df = pd.read_csv(
        "/Users/lohyikuang/Downloads/infiniwell_projects/semantic-search/data/bugzilla/fix.csv",
    )
    corpus: List[str] = df["Description"].tolist()
    print(f"Training on {len(corpus)} samples")
    model = train_embedding_model(corpus)
    save_model(model)
    corpus_embeddings = get_corpus_embeddings(model, corpus)
    queries = [
        "A man is eating pasta.",
        "Someone in a gorilla costume is playing a set of drums.",
        "A cheetah chases prey on across a field.",
    ]
    return get_top_queries(queries[0], model, corpus, corpus_embeddings)


if __name__ == "__main__":
    print(run())
