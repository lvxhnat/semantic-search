import torch
from transformers import AutoModelForCausalLM, AutoTokenizer,AutoModelForSequenceClassification,  pipeline

torch.random.manual_seed(0)

model = AutoModelForCausalLM.from_pretrained(
    "microsoft/Phi-3-mini-128k-instruct",
    device_map="cuda",
    torch_dtype=torch.float16, # Reduce memory usage
    trust_remote_code=True, 
    low_cpu_mem_usage=True
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