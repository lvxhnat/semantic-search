import torch
from glob import glob
from pathlib import Path
from fastapi import APIRouter
from backend.app.services.entrydb import df
from backend.app.services.model import pipe
from backend.app.common.utils import craft_prompt
from backend.app.services.chromadb import chroma_collection
from backend.app.api.endpoints.params import QueryParams, DBEntryParams
from backend.app.pipeline.optical_character_recognition import image_to_text

router = APIRouter()

@router.post("/query")
def search_term(params: QueryParams):
    
    conversation_id = params.conversationId
    context = None
    
    generation_args = {
        "max_new_tokens": 500,
        "return_full_text": False,
        "temperature": 0.0,
        "output_scores": True, 
        "do_sample": False,
    }
    uploaded_file_root_path: Path = Path(__file__).parents[3] / "uploaded_files"
    print(f"Running query for conversation id {conversation_id}. Finding PDF in {uploaded_file_root_path}")
    if f"{uploaded_file_root_path}/{conversation_id}" in glob(str(uploaded_file_root_path / "*")):
        print(f"Uploaded PDF found, running OCR for conversation id {conversation_id}...")
        pdf_files = glob(str(uploaded_file_root_path / conversation_id / "*"))
        context = image_to_text(pdf_files[0])
        print(f"Retrieved document of length {len(context)}")

    query = [q.model_dump(mode = "json") for q in params.query]

    with torch.no_grad():
        prompt, reference_ids = craft_prompt(query[-1]["content"], df, chroma_collection, context = context)
        output = pipe(prompt, **generation_args)
        
    torch.cuda.empty_cache()
    output_text = output[0]['generated_text']
    query.append({"role": "system", "content": output_text, "reference_ids": reference_ids})
    return query

@router.post("/db-entries")
def search_uuids(params: DBEntryParams):
    relevant_columns = ["node_id", "title", "state", "url", "body", "created_at"]
    return df[df["node_id"].isin(params.uuids)][relevant_columns].to_dict("records")