import torch
from transformers import AutoModelForCausalLM, AutoTokenizer,AutoModelForSequenceClassification,  pipeline

torch.random.manual_seed(0)

model = AutoModelForCausalLM.from_pretrained(
    "microsoft/Phi-3-mini-128k-instruct",
    device_map="cuda",
    torch_dtype=torch.float16, # Reduce memory usage
    trust_remote_code=True,
)

tokenizer = AutoTokenizer.from_pretrained("microsoft/Phi-3-mini-128k-instruct", torch_dtype=torch.float16)

pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
    )

# Load pre-trained model and tokenizer
reranker_model = AutoModelForSequenceClassification.from_pretrained('BAAI/bge-reranker-v2-m3')
reranker_tokenizer = AutoTokenizer.from_pretrained('BAAI/bge-reranker-v2-m3')