import re
import tempfile
from pdf2image import convert_from_path
from transformers import AutoModel, AutoTokenizer, QuantoConfig

def image_to_text(file_path: str):
    ocr_model_id = 'ucaslcl/GOT-OCR2_0'

    tokenizer = AutoTokenizer.from_pretrained(ocr_model_id, trust_remote_code=True)

    model = AutoModel.from_pretrained(
        ocr_model_id, 
        trust_remote_code=True, 
        low_cpu_mem_usage=True, 
        device_map='cuda', 
        use_safetensors=True, 
        pad_token_id=tokenizer.eos_token_id,
        quantization_config=QuantoConfig(weights="int8"),
    )
    model = model.eval().cuda()

    images = convert_from_path(file_path)

    pdf_data = []
    for image in images:
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as temp_file:
            # Save your image to this temporary file
            temp_file_path = temp_file.name
            image.save(temp_file_path)
            res = model.chat(tokenizer, temp_file_path, ocr_type='format')
            pdf_data.append(res)
    
    document_content = "\n".join(pdf_data)
    document_content = re.sub(
        r'\\\((.*?)\\\)',
        '', 
        document_content.replace("\n", " ")
)
    return document_content