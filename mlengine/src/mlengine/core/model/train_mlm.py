import gzip
from datetime import datetime

from transformers import (
    AutoModelForMaskedLM,
    AutoTokenizer,
    DataCollatorForLanguageModeling,
    DataCollatorForWholeWordMask,
    Trainer,
    TrainingArguments,
)


def train_mlm(
    model_name: str,
    train_path: str,
) -> str:
    """Tune the pre-trained model using masked language Modeling (MLM).
    This work by masking a portion of the input tokens in a sentence at random and then asking the model to predict the masked tokens.
    The hugging face library provides an out of the box implementation for MLM.

    ### Returns
    Output directory of model artifacts
    """

    per_device_train_batch_size = 64

    save_steps = 1000  # Save model every 1k steps
    num_train_epochs = 3  # Number of epochs
    use_fp16 = False  # Set to True, if your GPU supports FP16 operations
    max_length = 100  # Max length for a text input
    do_whole_word_mask = True  # If set to true, whole words are masked
    mlm_prob = 0.15  # Probability that a word is replaced by a [MASK] token

    # Load the model
    model = AutoModelForMaskedLM.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    output_dir = "output/{}-{}".format(
        model_name.replace("/", "_"),
        datetime.now().strftime("%Y-%m-%d_%H-%M-%S"),
    )
    print("Save checkpoints to:", output_dir)

    ##### Load our training datasets

    train_sentences = []
    with (
        gzip.open(train_path, "rt", encoding="utf8")
        if train_path.endswith(".gz")
        else open(train_path, "r", encoding="utf8")
    ) as fIn:
        for line in fIn:
            line = line.strip()
            if len(line) >= 10:
                train_sentences.append(line)

    print("Train sentences:", len(train_sentences))

    # A dataset wrapper, that tokenizes our data on-the-fly
    class TokenizedSentencesDataset:
        def __init__(
            self, sentences, tokenizer, max_length, cache_tokenization=False
        ):
            self.tokenizer = tokenizer
            self.sentences = sentences
            self.max_length = max_length
            self.cache_tokenization = cache_tokenization

        def __getitem__(self, item):
            if not self.cache_tokenization:
                return self.tokenizer(
                    self.sentences[item],
                    add_special_tokens=True,
                    truncation=True,
                    max_length=self.max_length,
                    return_special_tokens_mask=True,
                )

            if isinstance(self.sentences[item], str):
                self.sentences[item] = self.tokenizer(
                    self.sentences[item],
                    add_special_tokens=True,
                    truncation=True,
                    max_length=self.max_length,
                    return_special_tokens_mask=True,
                )
            return self.sentences[item]

        def __len__(self):
            return len(self.sentences)

    train_dataset = TokenizedSentencesDataset(
        train_sentences, tokenizer, max_length
    )

    if do_whole_word_mask:
        data_collator = DataCollatorForWholeWordMask(
            tokenizer=tokenizer, mlm=True, mlm_probability=mlm_prob
        )
    else:
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=tokenizer, mlm=True, mlm_probability=mlm_prob
        )

    training_args = TrainingArguments(
        output_dir=output_dir,
        overwrite_output_dir=True,
        num_train_epochs=num_train_epochs,
        evaluation_strategy="no",
        per_device_train_batch_size=per_device_train_batch_size,
        eval_steps=save_steps,
        save_steps=save_steps,
        logging_steps=save_steps,
        save_total_limit=1,
        prediction_loss_only=True,
        fp16=use_fp16,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        data_collator=data_collator,
        train_dataset=train_dataset,
        eval_dataset=None,
    )

    tokenizer.save_pretrained(output_dir)
    trainer.train()

    model.save_pretrained(output_dir)

    print("Training Complete. Tokenizer and model saved to:", output_dir)

    return output_dir
