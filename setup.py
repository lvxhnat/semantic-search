import pathlib
import re

from setuptools import find_packages, setup

name: str = "mlengine"

here = pathlib.Path.absolute(pathlib.Path(__file__).resolve().parent)

# get package version
with open(
    pathlib.Path(here, f"src/{name}/__init__.py"), encoding="utf-8"
) as f:
    result = re.search(r'__version__ = ["\']([^"\']+)', f.read())

    if not result:
        raise ValueError("Can't find the version in src/__init__.py")

    version = result.group(1)


def get_long_description():
    with open("README.md", "r", encoding="utf-8") as fh:
        return fh.read()


base_requirements = {
    "pip==22.3.1",
    "tqdm==4.64.0",
    "python-dotenv==0.20.0",
    "pydantic==1.9.2",
    "more-itertools==8.14.0",
}

model_requirements = {
    "emoji==1.7.0",
    "fasttext==0.9.2",
    "multi-rake==0.0.2",
    "numpy==1.21.6",
    "sentence-transformers==2.2.2",
    "spacy==3.4.4",
}

infra_requirements = {
    "pandas-gbq",
    "gcsfs==2022.11.0",
    "google-api-core==2.8.2",
    "google-auth==2.11.0",
    "google-auth-oauthlib==0.5.2",
    "google-cloud-core==2.3.2",
    "google-cloud-storage==2.5.0",
    "pyarrow==9.0.0",
    "celery[redis]==5.2.7",
    "elasticsearch==8.4.0",
    "sqlalchemy==1.4.45",
    "psycopg2-binary==2.9.3",
    "asyncpg==0.26.0",
    "kombu==5.2.4",
    "slack-sdk==3.19.4",
}

dev_requirements = {
    "black==22.10.0",
    "pip-chill==1.0.1",
    "pre-commit==2.20.0",
    "coverage>=5.1",
    "flake8>=3.8.3",
    "flake8-tidy-imports>=4.3.0",
    "isort>=5.7.0",
    "mypy==0.991",
    "pytest>=6.2.2",
    "pytest-xdist==3.1.0",
    "pytest-cov==4.0.0",
    "pytest-testmon==1.4.2",
    "pytest-asyncio==0.20.3",
    "vulture==2.7",
}

setup(
    name=name,
    version=version,
    author="Infiniwell",
    description="Topic model for theme coding",
    long_description=get_long_description(),
    long_description_content_type="text/markdown",
    package_dir={"": "src"},
    packages=find_packages("src", exclude=["*tests"]),
    package_data={
        name: ["*.txt", "*.json", "*.preamble", "*.sql", "py.typed"]
    },
    entry_points={
        "console_scripts": [f"{name} = {name}.entrypoints:main"],
    },
    python_requires=">=3.8",
    install_requires=list(
        base_requirements | model_requirements | infra_requirements
    ),
    extras_require={
        "dev": list(dev_requirements),
    },
)
