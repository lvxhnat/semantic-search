import os
from typing import List, Tuple

import cudf
import fasttext
import numpy as np
from dotenv import load_dotenv

from mlengine.exceptions.model.processing_exceptions import FilterError
from mlengine.services.storage.gcs_service import gcs_client

env_loaded = load_dotenv()
__language_model = gcs_client.read_binaries(
    os.environ["FASTTEXT_GCS_PATH"], fasttext.load_model
)


def predict_language(
    text: List[str],
) -> List[str]:

    # Example return type of top probability language
    # ([['__label__en'], ['__label__en']], [array([0.25001], dtype=float32), array([0.25001], dtype=float32)])
    preds: Tuple[List[List[str]], List[np.ndarray]] = __language_model.predict(
        text, k=1
    )

    # Unpack this as we only need the language: __label__en
    raw_language_labels: List[str] = [*map(lambda x: x[0], preds[0])]
    # Get ISO two letter language code
    languages: List[str] = [
        *map(lambda x: x.replace("__label__", ""), raw_language_labels)
    ]

    return languages


def detect_language(
    df: cudf.DataFrame, post_content_column_name: str
) -> cudf.DataFrame:

    """Predict the language with the highest probability according to fasttext.
    Model loading syntax: https://fasttext.cc/docs/en/python-module.html
    Model installation: https://fasttext.cc/docs/en/language-identification.html

    Args:
        df (pd.DataFrame): _description_
        post_content_column_name (str): df column containing the text corpus

    Returns:
        pd.DataFrame: _description_
    """

    df["post_language"] = predict_language(
        df[f"cleaned_{post_content_column_name}"].to_arrow().to_pylist()
    )

    return df


def filter_language(df: cudf.DataFrame, language: str) -> cudf.DataFrame:

    if language not in df["post_language"].unique().to_arrow().to_pylist():
        raise FilterError(exception_type="language")

    df: cudf.DataFrame = df[df.post_language == language].reset_index(
        drop=True
    )

    return df
