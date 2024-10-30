import torch
from transformers import AutoModelForCausalLM, AutoTokenizer,AutoModelForSequenceClassification,  pipeline, QuantoConfig, AutoModel

torch.random.manual_seed(0)

quantization_config = QuantoConfig(weights="int8")

model = AutoModelForCausalLM.from_pretrained(
    "microsoft/Phi-3-mini-128k-instruct",
    device_map="cuda",
    torch_dtype=torch.bfloat16, # Reduce memory usage
    trust_remote_code=True, 
    low_cpu_mem_usage=True, 
    quantization_config=quantization_config
)

model.gradient_checkpointing_enable()

tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-128k-instruct", torch_dtype=torch.float16, model_max_length=256)

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    torch_dtype=torch.float16,
)

# Load pre-trained model and tokenizer
reranker_model = AutoModelForSequenceClassification.from_pretrained('BAAI/bge-reranker-v2-m3')
reranker_tokenizer = AutoTokenizer.from_pretrained('BAAI/bge-reranker-v2-m3')


ocr_model_id = 'ucaslcl/GOT-OCR2_0'

ocr_tokenizer = AutoTokenizer.from_pretrained(ocr_model_id, trust_remote_code=True)

ocr_model = AutoModel.from_pretrained(
    ocr_model_id, 
    trust_remote_code=True, 
    low_cpu_mem_usage=True, 
    device_map='cuda', 
    use_safetensors=True, 
    pad_token_id=tokenizer.eos_token_id,
    quantization_config=QuantoConfig(weights="int8"),
)
ocr_model = model.eval().cuda()