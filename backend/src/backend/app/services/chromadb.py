import os
import chromadb
from dotenv import load_dotenv

load_dotenv()

chroma_client = chromadb.PersistentClient(path=os.environ["CHROMADB_PATH"])
msr_ = chroma_client.get_collection(name="msr2013-query")
