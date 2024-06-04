from typing import Pattern

import cudf
import emoji  # # Version 1.7.0


def __strip_regex(series: cudf.Series, language: str) -> cudf.Series:

    if language == "ja":
        # \u2150—\u218F     fractions and roman numerals
        # \u2190—\u21FF     arrows (e.g. ←↑→↓↔↕)
        # \u2460-\u24FF     enclosed numbers (e.g. ②③④)
        # \u2500-\u257F     Box Drawing
        # \u25A0-\u26FF     shapes (e.g. ◉▶◩◿) and misc symbols (e.g. ♪)
        # \u3003-\u300B     〃〄々〆〇〈〉《》
        # \u300E-\u301B     『』【】〒〓〔〕〖〗〘〙〚〛
        # \u301D-\u303F     〝〞〟〠〡〢〣〤〥〦〧〨〩〪〭〮〯〫〬〰〱〲〳〴〵〶〷〸〹〺〻〼〽〾〿
        # \u3000-\u303F     Japanese CJK Symbols and Punctuation Block https://www.compart.com/en/unicode/block/U+3000
        # \u3130-\u318F     Japanese Hangul Compatibility Jamo Block https://www.compart.com/en/unicode/block/U+3130
        # \uFE30-\uFE4F     Japanese CJK Compatibility Forms https://www.compart.com/en/unicode/block/U+FE30
        return (
            series.str.replace("[\u3000-\u303F]+", " ", regex=True)
            .str.replace("[\u3130-\u318F]+", " ", regex=True)
            .str.replace(
                "[\uFE30-\uFE4F\u2150-\u218F\u2190-\u21FF\u2460-\u26FF\u3003-\u300B\u300E-\u301B\u301D-\u303F]",
                "",
                regex=True,
            )
        )

    return series


def clean_post_content(
    df: cudf.DataFrame, post_content_column_name: str, language: str
) -> cudf.DataFrame:

    """Cleans post content column of dataframe of emojis, delimiters, handles into clean coherent text.
    Benchmarks: 2032949 Rows - cuDF [1min34s] | pandas with multiprocessing on 8 workers [19min38s]

    Args:
        df: Either a cudf or pandas dataframe depending on the preset environment
        post_content_column_name (str): df column containing the text corpus

    Returns:
        pd.DataFrame: _description_
    """

    emoji_regex: Pattern = emoji.get_emoji_regexp()

    if post_content_column_name not in df.columns:
        raise ValueError(
            f"Column {post_content_column_name} does not exist on df"
        )

    # Remove any missing rows to avoid string replace errors
    df: cudf.DataFrame = df.dropna()

    if not isinstance(df, cudf.DataFrame):
        df: cudf.DataFrame = cudf.DataFrame(df)

    # Get the emoji pattern and slice away "(" and ")", to just use pure replace instead of regex.
    # We use this instead of regex as cuDF currently doesnt support many escape characters, including those in unicode
    emoji_replace_pattern: cudf.Series = cudf.Series(
        emoji_regex.pattern[1:-1].split("|")
    )
    # We want to replace every emoji with an empty string
    emoji_replace_item: cudf.Series = cudf.Series(
        [""] * len(emoji_replace_pattern)
    )
    # Remove delimiters, hyperlinks, handles, multiple whitespaces, head punctuation and emojis
    # Turn off regex as we are replacing emoji string using cuDF series

    # \u2600-\u26FF     Miscellaneous Symbols https://www.compart.com/en/unicode/block/U+2600
    # \u0080-\u00BE     Truncated Latin 1 Supplement https://www.compart.com/en/unicode/block/U+0080

    df[f"cleaned_{post_content_column_name}"] = __strip_regex(
        df[post_content_column_name], language=language
    )

    df[f"cleaned_{post_content_column_name}"] = (
        df[f"cleaned_{post_content_column_name}"]
        .str.lower()
        .str.replace(r"\n|\t|\\|&amp;", "", regex=True)
        .str.replace(r"\S*https?:\S*", "", regex=True)
        .str.replace(r"(@\S+)", "", regex=True)
        .str.replace(emoji_replace_pattern, emoji_replace_item, regex=False)
        .str.replace(r"^[^\w]+", "", regex=True)
        .str.replace(" +", " ", regex=True)
        .str.replace("\u2600-\u26FF\u0080-\u00BE", "", regex=True)
    )
    # None if the string is empty or less than 4 characters.
    # As it is a user-defined function (UDF), .apply pandas syntax is not supported. Calculation done in intermediate steps.
    min_character_count: int = min(
        10, df[f"cleaned_{post_content_column_name}"].str.len().quantile(0.2)
    )

    df: cudf.DataFrame = (
        df[
            df[f"cleaned_{post_content_column_name}"].str.len()
            > min_character_count
        ]
        .drop_duplicates(subset=[f"cleaned_{post_content_column_name}"])
        .dropna(subset=[f"cleaned_{post_content_column_name}"])
        .reset_index(drop=True)
    )

    return df
