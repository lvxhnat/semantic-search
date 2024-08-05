import re

def clean_text(text: str):
    pattern = re.compile(r'### Pandas version checks.*?### Reproducible Example', re.DOTALL)
    # Replace the matched section with '### Reproducible Example'
    cleaned_text = re.sub(pattern, '### Reproducible Example', text)
    # Regex to match the ### Installed Versions section and its content
    pattern = re.compile(r'### Installed Versions.*?(</details>|$)', re.DOTALL)
    # Replace the matched section with an empty string
    cleaned_text = re.sub(pattern, '', cleaned_text)
    cleaned_text = cleaned_text.strip().lower().replace("###", "")
    cleaned_text = re.sub(r'\n\s*\n+', ' ', cleaned_text)
    return cleaned_text