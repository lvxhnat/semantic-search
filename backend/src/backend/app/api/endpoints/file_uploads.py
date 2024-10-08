import os
import shutil
from typing import List
from pathlib import Path
from fastapi import APIRouter, File, UploadFile, Form

tag = "upload"
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.post("/pdf")
async def upload_pdf(files: List[UploadFile] = File(...), conversation_id: str = Form(...)):
    root_path = Path(__file__).parents[3]
    upload_file_path: str = root_path / "uploaded_files" / conversation_id
    os.makedirs(upload_file_path, exist_ok = True)
    for file in files:
        with open(f"{upload_file_path}/{file.filename}", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    return  