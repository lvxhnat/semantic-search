import click

from mlengine import __version__ as version
from mlengine.cli.start import kill, start


@click.group(name="mlengine")
@click.version_option(version, "--version", "-v", help="Show version and exit")
def main():
    """MLEngine CLI entrypoint"""
    pass


@main.command()
def info():
    """Information about MLEngine"""
    LOGO_COLOR = "\033[91m"
    LOGO = rf"""
 _____ ______   ___       _______   ________   ________  ___  ________   _______
|\   _ \  _   \|\  \     |\  ___ \ |\   ___  \|\   ____\|\  \|\   ___  \|\  ___ \
\ \  \\\__\ \  \ \  \    \ \   __/|\ \  \\ \  \ \  \___|\ \  \ \  \\ \  \ \   __/|
 \ \  \\|__| \  \ \  \    \ \  \_|/_\ \  \\ \  \ \  \  __\ \  \ \  \\ \  \ \  \_|/__
  \ \  \    \ \  \ \  \____\ \  \_|\ \ \  \\ \  \ \  \|\  \ \  \ \  \\ \  \ \  \_|\ \
   \ \__\    \ \__\ \_______\ \_______\ \__\\ \__\ \_______\ \__\ \__\\ \__\ \_______\
    \|__|     \|__|\|_______|\|_______|\|__| \|__|\|_______|\|__|\|__| \|__|\|_______|

    v{version}
    """
    LOGO_FOOTNOTE = f"{click.style('Made by Yi Kuang 🐍💚📊', 'red')}\n"
    click.echo(f"{LOGO_COLOR}{LOGO}{LOGO_COLOR}")
    click.echo(LOGO_FOOTNOTE)


main.add_command(start)
main.add_command(kill)
