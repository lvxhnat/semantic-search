import os
import chromadb
from dotenv import load_dotenv

load_dotenv()

chroma_client = chromadb.PersistentClient(path=os.environ["BACKEND_CHROMADB_PATH"])
chroma_collection = chroma_client.get_collection(name=os.environ["BACKEND_CHROMADB_COLLECTION_NAME"])

