import numpy as np
from typing import List, Literal
from fastapi import APIRouter
from pydantic import BaseModel
from transformers import pipeline
from backend.app.services.model import tokenizer, model
from backend.app.services.chromadb import msr_

router = APIRouter()


class QueryItem(BaseModel):
    role: Literal["user", "system"]
    content: str


class QueryParams(BaseModel):
    query: List[QueryItem]


def craft_prompt(query: str) -> str:

    msr_query = msr_.query(
        query_texts=[query],  # Chroma will embed this for you
        n_results=10,  # How many results to return
    )

    # Get values that deviate less than 0.1 distance away
    documents = np.array(msr_query["documents"][0])
    distances = np.array(msr_query["distances"][0])

    query_results = documents[distances < (distances[0] + 0.1)].tolist()

    # Join results with new lines for the context
    context = "\n".join(query_results)

    return {
        "role": "user",
        "content": f"""
        Answer the question as truthfully as possible using the provided text, and if the answer is not contained within the text below, 
        respond with "There are some partial information contained within the database." followed by your suggestions.
        The context given to you is from a list of possible related defects as found in a database of defect entries.
        End off the answer by listing the context that I have provided you with, with the headline, "Here are the most relevant entries in the database: "
        
        >>CONTEXT<<
        {context}\n
        >>QUESTION<< {query}\n
        """,
    }


@router.post("/query")
def search_term(params: QueryParams):

    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
    )

    generation_args = {
        "max_new_tokens": 500,
        "return_full_text": False,
        "temperature": 0.0,
        "do_sample": False,
    }

    query = params.query

    if (
        query[0].role != "system"
        and query[0].content
        != "You are a helpful AI assistant that is answering questions from a database."
    ):
        query = [
            {
                "role": "system",
                "content": "You are a helpful AI assistant that is answering questions from a database.",
            }
        ] + query

    prompt = craft_prompt(query[-1].content)
    query[-1] = prompt
    output = pipe(query, **generation_args)
    # Add the query
    query.append({"role": "system", "content": output[0]["generated_text"]})
    return query
