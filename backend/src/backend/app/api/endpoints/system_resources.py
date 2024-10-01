import asyncio
import subprocess
from fastapi import WebSocket, APIRouter
from fastapi.websockets import WebSocketDisconnect

router = APIRouter()

# Function to get GPU memory usage by running 'nvidia-smi'
def get_gpu_usage():
    result = subprocess.run(['nvidia-smi', '--query-gpu=memory.used,memory.total', '--format=csv,nounits,noheader'], 
                            stdout=subprocess.PIPE, 
                            stderr=subprocess.PIPE, 
                            text=True)
    return result.stdout.strip()

# WebSocket connection handler
@router.websocket("/ws/gpu-usage")
async def gpu_usage_websocket(websocket: WebSocket):
    await websocket.accept()  # Accept the WebSocket connection
    try:
        while True:
            gpu_usage = get_gpu_usage()  # Get GPU usage
            await websocket.send_text(gpu_usage)  # Send it over WebSocket
            await asyncio.sleep(2)  # Adjust the interval as needed
    except WebSocketDisconnect:
        print("WebSocket connection closed.")
