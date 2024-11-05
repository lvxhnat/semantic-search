import uvicorn
from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from backend.app.api import api_router
from backend.app.services.entrydb import df
from backend.app.services.chromadb import chroma_collection

app = FastAPI()

@asynccontextmanager
async def startup_event(app: FastAPI):
    if chroma_collection.count() == 0:
        print("ChromaDB is empty. Starting embedding process...")
        i, chunk_size = 0, 1_000
        for _ in df.itertuples():
            # Insert the embedded sentences into the database on every chunk_size chunk
            if i % chunk_size == 0 and i != 0:        
                chunk_df = df.iloc[i - chunk_size: i]
                chroma_collection.upsert(
                    documents = chunk_df["cleaned_body"].to_list(), 
                    ids = chunk_df["node_id"].to_list()
                )
            i += 1
            
        chroma_collection.upsert(
            documents = df.iloc[i - chunk_size:]['cleaned_body'].to_list(), 
            ids = df.iloc[i - chunk_size:]["node_id"].to_list()
        )
    print("Startup tasks completed.")
    yield

def create_app() -> FastAPI:

    app: FastAPI = FastAPI(
        title="backend",
        description="",
        version="1.0.0.",
        contact={"name": "Yi Kuang", "email": "yikuang5@gmail.com"},
        lifespan=startup_event
    )

    app.include_router(api_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["Content-Disposition"]
    )

    return app


app: FastAPI = create_app()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=1236, reload=True)
