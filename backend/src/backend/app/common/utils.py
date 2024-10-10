import re
import torch
import numpy as np
import pandas as pd
from typing import List
from backend.app.services.model import reranker_tokenizer, reranker_model

def clean_text(text: str):
    pattern = re.compile(r'### Pandas version checks.*?### Reproducible Example', re.DOTALL)
    # Replace the matched section with '### Reproducible Example'
    cleaned_text = re.sub(pattern, '### Reproducible Example', text)
    # Regex to match the ### Installed Versions section and its content
    pattern = re.compile(r'### Installed Versions.*?(</details>|$)', re.DOTALL)
    # Replace the matched section with an empty string
    cleaned_text = re.sub(pattern, '', cleaned_text)
    cleaned_text = cleaned_text.strip().lower().replace("###", "")
    cleaned_text = re.sub(r'\n\s*\n+', ' ', cleaned_text)
    return cleaned_text


def query_chroma_collection(df: pd.DataFrame, query: str, chroma_collection, min_ref_docs: int = 2, distance_threshold = 0.1) -> List[str]:

    results = chroma_collection.query(
        query_texts = [query],  # Chroma will embed this for you
        n_results = 10,  # How many results to return
    )

    reference_ids: List[str] = results['ids'][0]
    filtered_result = df[df["node_id"].isin(reference_ids)]

    # Get values that deviate less than 0.1 distance away
    documents = np.array(filtered_result['cleaned_body'].to_list())
    distances = np.array(results["distances"][0])
    ids = np.array(reference_ids)

    # Impose a minimum distance filter right now to check for relevance 
    distance_filter = ((distances < min(distances) + distance_threshold) | (distances < 1)) & (distances < 1.2)
    relevant_documents = documents[distance_filter]
    relevant_ids = ids[distance_filter]
    relevant_distances = distances[distance_filter]

    distance_ids = {k: v for k,v in zip(relevant_ids, relevant_distances)}

    if len(relevant_documents) < min_ref_docs:
        relevant_documents = documents[:min_ref_docs]
    
    if len(relevant_documents) == 0:
        relevant_documents = documents[:1]  # At least take the top result if none within the threshold

    return distance_ids, relevant_documents

def rerank_documents(query, relevant_documents: List[str]) -> List[str]:
    pairs = [[query, passage] for passage in relevant_documents]
    # We add torch no grad to prevent gradient from being calculated unecessarily which will lead to OOM error
    with torch.no_grad():
        inputs = reranker_tokenizer(pairs, padding=True, truncation=True, return_tensors='pt', max_length=512)
        outputs = reranker_model(**inputs, return_dict=True)
        scores = outputs.logits.squeeze().float()  # Adjust based on model output shape
    torch.cuda.empty_cache()
    # Pair the scores with the other list
    paired_list = list(zip(scores, relevant_documents))
    # Sort the pairs based on the scores in descending order
    sorted_pairs = sorted(paired_list, key=lambda x: x[0], reverse=True)
    # Separate the sorted pairs back into two lists
    _, l = zip(*sorted_pairs)
    return l

def craft_prompt(query: str, df: pd.DataFrame, chroma_collection, min_ref_docs: int = 2, distance_threshold = 0.1, context: str = None):

    """
    min_ref_docs : minimum number of documents we want the RAG model to reference.
    """
    distance_ids = {}
    if not context:
        distance_ids, relevant_documents = query_chroma_collection(df, query, chroma_collection, min_ref_docs, distance_threshold)
        relevant_documents = rerank_documents(query, relevant_documents)
        context = "\n".join(relevant_documents)

    return [
        {"role": "system", "content": "You are a helpful AI assistant."},
        {
            "role": "user",
            "content": (
                "Answer the following question using only the provided context and do not assume or add your own information. \n"
                "If the context does not contain sufficient information to answer the question or no context is provided at all, provide your own suggestions with a clear warning. \n"
                "The context are sorted in descending relevance. \n"
                "If the description of the issue is vague, ask for clarifications \n"
                f"Question: {query}\n\n"
                "Here is the relevant relevant:\n"
                f"{context}"
            )
        }
    ], distance_ids
