import os
import pandas as pd
from dotenv import load_dotenv
from backend.app.common.utils import clean_text

load_dotenv()

SOURCE = os.getenv("BACKEND_DATA_SOURCE")
SOURCE_PATH = os.getenv("BACKEND_DATA_SOURCE_PATH")

if SOURCE is None or SOURCE_PATH is None: 
    raise ValueError(f"Source or Source Path should not be none. Please specify.")

if SOURCE == "csv":
    df = (
        pd.read_csv(SOURCE_PATH)
        .dropna(subset = ['body'])
        .assign(cleaned_body = lambda d: d["body"].apply(clean_text))
    )