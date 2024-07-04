# Semantic Search

### Quick start

The current version of the semantic search code can be found on the ```model-inference.ipynb``` file. 

Further masked language modelling code can be found in the ```train_mlm.py``` file, which is used to tune the pre-trained model. 

To start off, install dependencies:
```bash
# In root
pip install -e .
```

Install the sample dataset [here](https://github.com/ansymo/msr2013-bug_dataset)
```bash 
mkdir data
git clone https://github.com/ansymo/msr2013-bug_dataset.git
```