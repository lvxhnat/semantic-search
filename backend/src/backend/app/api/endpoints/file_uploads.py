import os
import shutil
from glob import glob
from typing import List
from pathlib import Path
from fastapi.responses import FileResponse
from fastapi import APIRouter, File, UploadFile, Form, HTTPException

tag = "upload"
router = APIRouter(tags=[tag], prefix=f"/{tag}")
root_path = Path(__file__).parents[3]

@router.post("/pdf")
async def upload_pdf(files: List[UploadFile] = File(...), conversation_id: str = Form(...)):
    upload_file_path: str = root_path / "uploaded_files" / conversation_id
    if os.path.isdir(upload_file_path):
        shutil.rmtree(upload_file_path, ignore_errors=True) # Remove any existing uploads
    os.makedirs(upload_file_path)
    for file in files:
        with open(f"{upload_file_path}/{file.filename}", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    return  

@router.get("/pdf/{uuid}")
async def get_pdf(uuid: str):
    upload_dir = root_path / "uploaded_files" / uuid
    if not upload_dir.exists():
        raise HTTPException(status_code=404, detail="Directory not found")

    pdf_files = list(upload_dir.glob("*.pdf"))
    if not pdf_files:
        raise HTTPException(status_code=404, detail="PDF file not found")

    pdf_file_path = pdf_files[0]
    filename = pdf_file_path.name
    headers = {'Content-Disposition': f'attachment; filename="{filename}"'}
    print(f"PDF File found for {uuid}. Streaming...")

    response = FileResponse(
        path=str(pdf_file_path),
        media_type='application/pdf',
        headers=headers
    )
    response.headers['Access-Control-Expose-Headers'] = 'Content-Disposition'

    return response
