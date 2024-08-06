from pydantic import BaseModel
from typing import List, Literal

class QueryItem_(BaseModel):
    role: Literal["user", "system"]
    content: str

class QueryParams(BaseModel):
    query: List[QueryItem_]

class DBEntryParams(BaseModel):
    uuids: List[str]