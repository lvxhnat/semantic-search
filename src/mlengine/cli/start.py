import click


@click.command()
@click.option(
    "-v",
    "--verbose",
    default=False,
    is_flag=True,
    help="",
)
def start(verbose):
    pass
