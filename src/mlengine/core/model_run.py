import pandas as pd

from mlengine.core.inference.predict import get_top_queries
from mlengine.core.model import train_embedding_model, get_corpus_embeddings


def run() -> pd.DataFrame:
    corpus = [
        "A man is eating food.",
        "A man is eating a piece of bread.",
        "The girl is carrying a baby.",
        "A man is riding a horse.",
        "A woman is playing violin.",
        "Two men pushed carts through the woods.",
        "A man is riding a white horse on an enclosed ground.",
        "A monkey is playing drums.",
        "A cheetah is running behind its prey.",
    ]
    queries = [
        "A man is eating pasta.",
        "Someone in a gorilla costume is playing a set of drums.",
        "A cheetah chases prey on across a field.",
    ]
    model = train_embedding_model()
    corpus_embeddings = get_corpus_embeddings(model, corpus)
    return get_top_queries(queries[0], model, corpus, corpus_embeddings)


if __name__ == "__main__":
    print(run())
