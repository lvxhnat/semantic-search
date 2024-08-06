import pandas as pd
from backend.app.common.utils import clean_text

df = (
    pd.read_csv("/home/yikuang/workspace/defectsearch/backend/data/202407251532-pandas-cleaned.csv")
    .dropna(subset = ['body'])
    .assign(cleaned_body = lambda d: d["body"].apply(clean_text))
)