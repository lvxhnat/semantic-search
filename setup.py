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
    "pip",
    "tqdm",
    "python-dotenv",
    "pydantic",
    "more-itertools",
}

model_requirements = {
    "emoji",
    "numpy",
    "spacy",
    "sentence-transformers",
}

dev_requirements = {
    "black",
    "pip-chill",
    "pre-commit",
    "coverage>=5.1",
    "flake8>=3.8.3",
    "flake8-tidy-imports>=4.3.0",
    "isort>=5.7.0",
    "mypy",
    "pytest>=6.2.2",
    "pytest-xdist",
    "pytest-cov",
    "pytest-testmon",
    "pytest-asyncio",
    "vulture",
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
        base_requirements | model_requirements
    ),
    extras_require={
        "dev": list(dev_requirements),
    },
)
