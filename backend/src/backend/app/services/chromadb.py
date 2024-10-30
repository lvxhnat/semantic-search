import os
import chromadb
from pathlib import Path
from dotenv import load_dotenv

env_loaded = load_dotenv()

BACKEND_CHROMADB_COLLECTION_NAME="chromadb-main"
root_path: str = Path(__file__).parents[4]
BACKEND_CHROMADB_PATH = str(root_path / "data" / "chromadb")
os.makedirs(str(BACKEND_CHROMADB_PATH), exist_ok = True)
print(f"Chromadb Loaded from path {BACKEND_CHROMADB_PATH}")

chroma_client = chromadb.PersistentClient(path=BACKEND_CHROMADB_PATH)
chroma_collection = chroma_client.get_or_create_collection(name=BACKEND_CHROMADB_COLLECTION_NAME)

get_sample_data = os.environ.get("SAMPLE_DATA")

