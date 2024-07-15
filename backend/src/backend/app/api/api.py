from fastapi import APIRouter
from backend.app.api.endpoints.query import router as query_router


api_router = APIRouter()

api_router.include_router(query_router)
