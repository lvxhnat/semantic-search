import os
import json
import itertools
from pathlib import Path


def __load_json_dataset(path):
    with open(path) as f:
        return json.load(f)


def __flatten_entry(data_entry):
    result = []
    for data in data_entry:
        what = data["what"]
        if what.strip() != "":
            result.append(what)
    return result


def load_msr_dataset(save: bool = True):

    data_save_path: str = Path(__file__).parents[4] / "data"
    os.makedirs(data_save_path, exist_ok=True)
    msr_data_root: str = data_save_path / "msr2013-bug_dataset"

    eclipse_dataset = __load_json_dataset(
        str(msr_data_root / "data/v02/eclipse/short_desc.json")
    )
    mozilla_dataset = __load_json_dataset(
        str(msr_data_root / "data/v02/mozilla/short_desc.json")
    )

    c_mozilla_dataset = [
        *itertools.chain.from_iterable(
            map(__flatten_entry, mozilla_dataset["short_desc"].values())
        )
    ]
    c_eclipse_dataset = [
        *itertools.chain.from_iterable(
            map(__flatten_entry, eclipse_dataset["short_desc"].values())
        )
    ]
    dataset = list(set(c_mozilla_dataset + c_eclipse_dataset))

    if save:
        with open(str(data_save_path / "train.txt"), "w") as f:
            for line in dataset[:10]:
                f.write(f"{line}\n")

    return dataset
