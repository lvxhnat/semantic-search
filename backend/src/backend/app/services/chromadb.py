import os
import chromadb
from dotenv import load_dotenv

load_dotenv()

chroma_client = chromadb.PersistentClient(path=os.environ["CHROMADB_PATH"])
chroma_collection = chroma_client.get_collection(name="np2024-dataset")
