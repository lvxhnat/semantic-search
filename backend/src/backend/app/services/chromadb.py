import chromadb

chroma_client = chromadb.PersistentClient(path="./data/chromadb/")
msr_ = chroma_client.get_collection(name="msr2013-query")
