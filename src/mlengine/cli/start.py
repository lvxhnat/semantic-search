import os

import click

from mlengine.worker.worker import app


@click.command()
@click.option(
    "-v",
    "--verbose",
    default=False,
    is_flag=True,
    help="Whether to run celery worker in detached mode.",
)
def start(verbose):
    try:
        argv = [
            "worker",
            "--without-gossip",
            "--without-mingle",
            "--without-heartbeat",
            "--pool=solo",
            "--concurrency=1",
            "--queues=discovery_queue",
            "--loglevel=info",
            "--hostname=ml_engine_worker",
            "--max-tasks-per-child=1",
            "-Ofair",
        ]
        if not verbose:
            argv += ["--detach"]

        app.worker_main(argv)
    except KeyboardInterrupt:
        os.system(
            "for pid in `ps -ef | grep 'mlengine.worker.worker.app worker' | awk '{print $2}'` ; do kill -9 $pid ; done"
        )


@click.command()
def kill():
    os.system(
        "for pid in `ps -ef | grep 'mlengine.worker.worker.app worker' | awk '{print $2}'` ; do kill -9 $pid ; done"
    )
