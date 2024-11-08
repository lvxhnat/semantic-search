import os
from typing import List
from pathlib import Path
from fastapi import HTTPException, APIRouter
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

tag = "chat"
router = APIRouter(tags=[tag], prefix=f"/{tag}")
root_path = Path(__file__).parents[3]

class ChatBoxType(BaseModel):
    role: str
    content: str
    reference_ids: Optional[Dict[str, Any]] = {}

class Conversation(BaseModel):
    conversation_id: str
    chat_history: List[ChatBoxType]

conversations = {}

@router.get("/{conversation_id}")
async def get_conversation(conversation_id: str):
    if conversation_id not in conversations:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversations[conversation_id]

@router.post("")
async def insert_conversation(conversation: Conversation):
    conversations[conversation.conversation_id] = conversation.dict()
    return {"status": "success", "conversation_id": conversation.conversation_id}
