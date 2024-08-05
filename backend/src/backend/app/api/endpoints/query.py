import torch
import numpy as np
import pandas as pd
from typing import List, Literal
from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.model import pipe
from backend.app.services.chromadb import chroma_collection
from backend.app.common.utils import clean_text

router = APIRouter()


class QueryItem(BaseModel):
    role: Literal["user", "system"]
    content: str


class QueryParams(BaseModel):
    query: List[QueryItem]


def craft_prompt(query: str, df: pd.DataFrame, chroma_collection, min_ref_docs: int = 2, distance_threshold = 0.1) -> str:

    """
    min_ref_docs : minimum number of documents we want the RAG model to reference.
    """
    
    results = chroma_collection.query(
        query_texts = [query],  # Chroma will embed this for you
        n_results = 10,  # How many results to return
    )

    reference_ids: List[str] = results['ids'][0]
    print(df, df["node_id"], df[df.node_id == "MDU6SXNzdWU1ODQxNzMx"].shape)
    filtered_result = df[df["node_id"].isin(reference_ids)]

    # Get values that deviate less than 0.1 distance away
    documents = np.array(filtered_result['cleaned_body'].to_list())
    distances = np.array(results["distances"][0])

    distance_ids = {k: v for k,v in zip(reference_ids, distances)}

    relevant_documents = documents[distances < min(distances) + distance_threshold]

    if len(relevant_documents) < min_ref_docs:
        relevant_documents = documents[:min_ref_docs]
    
    if len(relevant_documents) == 0:
        relevant_documents = documents[:1]  # At least take the top result if none within the threshold

    # Join results with new lines for the context
    context = "\n".join(relevant_documents) 

    return [
        {"role": "system", "content": "You are a helpful AI assistant that answers questions from a database of GitHub issues."},
        {
            "role": "user",
            "content": (
                "Answer the following question using only the provided context. Do not assume or add information beyond what is in the context. \n"
                "If the context does not contain sufficient information to answer the question, explicitly state that the context is insufficient and provide your own suggestions with a clear warning. \n"
                "The context are entries in a database, so your answer should say instead that you had referenced the database. \n"
                "Context:\n"
                "{context}\n\n"
                "Question: {query}\n\n"
                "Here are the entries in the database that might be relevant to your query:\n"
                "{entries}"
            ).format(context=context, query=query, entries="".join([f'- {entry}\n' for entry in relevant_documents]))
        }
    ], distance_ids


@router.post("/query")
def search_term(params: QueryParams):

    generation_args = {
        "max_new_tokens": 500,
        "return_full_text": False,
        "temperature": 0.0,
        "do_sample": False,
    }

    query = [q.model_dump(mode = "json") for q in params.query]
    df = pd.read_csv("/home/yikuang/workspace/defectsearch/backend/data/202407251532-pandas-cleaned.csv")
    df = df.dropna(subset = ['body'])
    df["cleaned_body"] = df["body"].apply(clean_text)

    torch.cuda.empty_cache()

    prompt, reference_ids = craft_prompt(query[-1]["content"], df, chroma_collection)
    output = pipe(prompt, **generation_args)

    output_text = output[0]['generated_text']
    query.append({"role": "system", "content": output_text})
    
    return {
        "query": query, 
        "reference_ids": reference_ids
    }
