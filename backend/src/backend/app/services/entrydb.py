import os
import re
import pandas as pd
from pathlib import Path
from sqlalchemy import engine
from dotenv import load_dotenv
from backend.app.common.utils import clean_text

env_loaded = load_dotenv()
root_path: str = Path(__file__).parents[4]

SOURCE = "csv"
SOURCE_PATH='https://drive.google.com/uc?id=' + os.environ["SAMPLE_DATA"].split('/')[-2]

if SOURCE is None or SOURCE_PATH is None: 
    raise ValueError(f"Source or Source Path should not be none. Please specify.")

df = pd.DataFrame()
if SOURCE == "csv":
    df = (
        pd.read_csv(SOURCE_PATH)
        .dropna(subset = ['body'])
        .assign(cleaned_body = lambda d: d["body"].apply(clean_text))
    )
    print(f"CSV Loaded from path {SOURCE_PATH}")
elif SOURCE == "postgres":
    engine = engine.create_engine(SOURCE_PATH, echo=False)
    SOURCE_TABLE = os.getenv("BACKEND_DATA_SOURCE_TABLE")
    df = pd.read_sql(f"SELECT * FROM {SOURCE_TABLE}", engine)
else: 
    raise ValueError(f"Source or Source Path not recognised. Please specify postgres or csv.")