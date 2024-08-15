from pydantic import BaseModel
from typing import List, Literal, Dict, Optional

class QueryItem_(BaseModel):
    role: Literal["user", "system"]
    content: str
    reference_ids: Optional[Dict[str, float]] = None

class QueryParams(BaseModel):
    query: List[QueryItem_]

class DBEntryParams(BaseModel):
    uuids: List[str]