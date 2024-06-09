from typing import List
from sentence_transformers import (
    models,
    SentenceTransformer,
    losses,
    InputExample,
)
from torch.utils.data import DataLoader
from datasets import Dataset  # Import Dataset


def __get_embedding_model():
    model_name = "distilroberta-base"
    word_embedding_model = models.Transformer(model_name, max_seq_length=32)
    pooling_model = models.Pooling(
        word_embedding_model.get_word_embedding_dimension()
    )
    model = SentenceTransformer(modules=[word_embedding_model, pooling_model])
    return model


def __generate_train_dataset(corpus: List[str]) -> DataLoader:
    train_data = [InputExample(texts=[s, s]) for s in corpus]
    train_dataloader = DataLoader(train_data, batch_size=128, shuffle=True)
    return train_dataloader


def get_corpus_embeddings(model, corpus: List[str]):
    return model.encode(corpus)
