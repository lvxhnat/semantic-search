import re
import tempfile
from pathlib import Path
from pdf2image import convert_from_path
from backend.app.services.model import ocr_model, ocr_tokenizer

def image_to_text(file_path: str):
    txt_file_path = file_path.replace("pdf", "txt")
    if Path(txt_file_path).is_file():
        with open(txt_file_path, "r") as f:
            return f.read()

    images = convert_from_path(file_path)

    pdf_data = []
    for image in images:
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
            # Save your image to this temporary file
            temp_file_path = temp_file.name
            image.save(temp_file_path)
            res = ocr_model.chat(ocr_tokenizer, temp_file_path, ocr_type='format')
            pdf_data.append(res)
    
    document_content = "\n".join(pdf_data)
    document_content = re.sub(
        r'\\\((.*?)\\\)',
        '', 
        document_content.replace("\n", " ")
    )
    
    # Cache the document if it has already been converted into text
    with open(txt_file_path, "w") as text_file:
        text_file.write(document_content)
    
    return document_content