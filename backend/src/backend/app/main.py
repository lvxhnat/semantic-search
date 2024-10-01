import asyncio
import uvicorn
import subprocess
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.websockets import WebSocketDisconnect
from backend.app.api import api_router

app = FastAPI()

# Function to get GPU memory usage by running 'nvidia-smi'
def get_gpu_usage():
    result = subprocess.run(['nvidia-smi', '--query-gpu=memory.used,memory.total', '--format=csv,nounits,noheader'], 
                            stdout=subprocess.PIPE, 
                            stderr=subprocess.PIPE, 
                            text=True)
    return result.stdout.strip()

# WebSocket connection handler
@app.websocket("/ws/gpu-usage")
async def gpu_usage_websocket(websocket: WebSocket):
    await websocket.accept()  # Accept the WebSocket connection
    try:
        while True:
            gpu_usage = get_gpu_usage()  # Get GPU usage
            await websocket.send_text(gpu_usage)  # Send it over WebSocket
            await asyncio.sleep(2)  # Adjust the interval as needed
    except WebSocketDisconnect:
        print("WebSocket connection closed.")

def create_app() -> FastAPI:

    app: FastAPI = FastAPI(
        title="backend",
        description="",
        version="1.0.0.",
        contact={"name": "Yi Kuang", "email": "yikuang5@gmail.com"},
    )

    origins = [
        "http://localhost:*",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://frontend:3000",
        "http://frontend:*",
    ]

    app.include_router(api_router)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app


app: FastAPI = create_app()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=1237, reload=True)
