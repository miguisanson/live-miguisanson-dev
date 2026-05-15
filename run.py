#!/usr/bin/env python3
from __future__ import annotations

import argparse
import os
import platform
import shutil
import socket
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)


def command_exists(command: str) -> bool:
    return shutil.which(command) is not None


def default_host() -> str:
    if "HUGO_BIND" in os.environ:
        return os.environ["HUGO_BIND"]
    return "127.0.0.1" if platform.system().lower() == "windows" else "0.0.0.0"


def guess_lan_ip() -> str:
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]
    except OSError:
        return "localhost"
    finally:
        sock.close()


def default_base_url(host: str, port: str) -> str:
    if "HUGO_BASEURL" in os.environ:
        return os.environ["HUGO_BASEURL"]
    if host in {"0.0.0.0", "::"}:
        return f"http://{guess_lan_ip()}:{port}/"
    return f"http://localhost:{port}/"


def run(command: list[str]) -> int:
    print("+ " + " ".join(command))
    try:
        return subprocess.call(command, cwd=ROOT)
    except KeyboardInterrupt:
        return 130


def build_site(base_url: str | None, minify: bool) -> int:
    command = ["hugo", "--gc", "--noBuildLock"]
    if minify:
        command.append("--minify")
    if base_url:
        command.extend(["--baseURL", base_url])
    return run(command)


def serve_site(host: str, port: str, base_url: str, drafts: bool) -> int:
    command = [
        "hugo",
        "server",
        "--bind",
        host,
        "--port",
        port,
        "--baseURL",
        base_url,
        "--disableFastRender",
    ]
    if drafts:
        command.append("--buildDrafts")

    print(f"Serving on {base_url}")
    if host == "0.0.0.0":
        print("The site is bound to all network interfaces for server testing.")
    return run(command)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Build or run the Hugo portfolio site.")
    parser.add_argument(
        "--build",
        action="store_true",
        help="Build the static site into public/ instead of starting the dev server.",
    )
    parser.add_argument(
        "--host",
        default=default_host(),
        help="Host/interface for hugo server. Defaults to localhost on Windows and 0.0.0.0 on Linux.",
    )
    parser.add_argument(
        "--port",
        default=os.environ.get("HUGO_PORT", "1313"),
        help="Port for hugo server.",
    )
    parser.add_argument(
        "--base-url",
        default=None,
        help="Override the base URL. Can also be set with HUGO_BASEURL.",
    )
    parser.add_argument(
        "--drafts",
        action="store_true",
        help="Include draft content while serving.",
    )
    parser.add_argument(
        "--minify",
        action="store_true",
        help="Minify static files when used with --build.",
    )
    return parser.parse_args()


def main() -> int:
    if not command_exists("hugo"):
        print("Hugo is not installed or not on PATH. Run setup first: python setup.py")
        return 1

    args = parse_args()
    base_url = args.base_url or default_base_url(args.host, args.port)

    if args.build:
        return build_site(args.base_url or os.environ.get("HUGO_BASEURL"), args.minify)

    return serve_site(args.host, str(args.port), base_url, args.drafts)


if __name__ == "__main__":
    raise SystemExit(main())
