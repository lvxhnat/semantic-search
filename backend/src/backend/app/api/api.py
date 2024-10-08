from fastapi import APIRouter
from backend.app.api.endpoints.model_query import router as query_router
from backend.app.api.endpoints.system_resources import router as system_router
from backend.app.api.endpoints.file_uploads import router as upload_router

api_router = APIRouter()

api_router.include_router(query_router)
api_router.include_router(system_router)
api_router.include_router(upload_router)
