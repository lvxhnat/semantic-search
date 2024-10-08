import sqlite3
import warnings
from pathlib import Path
from dotenv import load_dotenv
from backend.app.configs.base import base_configs

env_loaded = load_dotenv()
root_path = Path(__file__).parents[2]

if not base_configs.CONVERSATIONAL_DATABASE_PATH:
    CONVERSATIONAL_DATABASE_PATH = root_path / "tmp.sqlite3"
    warnings.warn(f"No CONVERSATIONAL_DATABASE_PATH found in env file. Defaulting to sqlite creation at 'backend/database/'")
    if not base_configs.CONVERSATIONAL_DATABASE_TYPE:
        db = sqlite3.connect(CONVERSATIONAL_DATABASE_PATH)
        db.execute('CREATE TABLE IF NOT EXISTS TableName (id INTEGER PRIMARY KEY, quantity INTEGER)')