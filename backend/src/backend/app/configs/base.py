from pathlib import Path
from typing import Optional, Literal
from pydantic_settings import BaseSettings, SettingsConfigDict

class BaseConfigs(BaseSettings):
    
    CONVERSATIONAL_DATABASE_PATH: str = '' 
    CONVERSATIONAL_DATABASE_TYPE: Optional[Literal["postgresql"]] = None

    model_config = SettingsConfigDict(
        env_prefix='SEMANTIC_SEARCH_',
        env_file=Path(__file__).parents[4] / '.env',
        env_file_encoding='utf-8',
        extra='allow'
    )

base_configs = BaseConfigs()