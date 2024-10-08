from fastapi import APIRouter, File, UploadFile
import shutil

tag = "files"
router = APIRouter(tags=[tag], prefix=f"/{tag}")

@router.post("/upload-pdf/")
async def upload_pdf(file: UploadFile = File(...)):
    with open(f"uploaded_files/{file.filename}", "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename}