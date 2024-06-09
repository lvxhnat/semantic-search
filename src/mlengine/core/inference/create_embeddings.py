import torch
from tqdm import tqdm
from transformers import AutoModelForMaskedLM, AutoTokenizer


def create_embeddings(corpus, model_artifact_path: str):
    tokenizer = AutoTokenizer.from_pretrained(model_artifact_path)
    model = AutoModelForMaskedLM.from_pretrained(
        model_artifact_path, output_hidden_states=True
    )

    corpus_embeddings = []
    for doc in tqdm(corpus):
        encoded_input = tokenizer(
            doc,
            padding=True,
            truncation=True,
            max_length=128,
            return_tensors="pt",
        )
        with torch.no_grad():
            output = model(**encoded_input)
            embeddings = output.hidden_states[-1].mean(
                dim=1
            )  # Using mean pooling
        corpus_embeddings.append(embeddings)
    corpus_embeddings = torch.cat(corpus_embeddings)

    return
