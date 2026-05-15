#!/usr/bin/env python3
from __future__ import annotations

import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parent

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(line_buffering=True)


def run(command: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    print("+ " + " ".join(command))
    return subprocess.run(command, cwd=ROOT, check=check, text=True)


def capture(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        cwd=ROOT,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )


def command_exists(command: str) -> bool:
    return shutil.which(command) is not None


def sudo_prefix() -> list[str] | None:
    if hasattr(os, "geteuid") and os.geteuid() == 0:
        return []
    if command_exists("sudo"):
        return ["sudo"]
    return None


def print_hugo_version() -> bool:
    if not command_exists("hugo"):
        return False

    result = capture(["hugo", "version"])
    if result.returncode == 0:
        print(result.stdout.strip())
        return True

    return False


def install_hugo_windows() -> bool:
    installers = [
        (
            "winget",
            [
                "winget",
                "install",
                "--id",
                "Hugo.Hugo.Extended",
                "--exact",
                "--accept-package-agreements",
                "--accept-source-agreements",
            ],
        ),
        ("choco", ["choco", "install", "hugo-extended", "-y"]),
        ("scoop", ["scoop", "install", "hugo-extended"]),
    ]

    for name, command in installers:
        if not command_exists(name):
            continue

        print(f"Hugo was not found. Trying {name}...")
        run(command, check=False)
        if print_hugo_version():
            return True

    return False


def install_hugo_linux() -> bool:
    sudo = sudo_prefix()

    if command_exists("snap") and sudo is not None:
        print("Hugo was not found. Trying snap...")
        run([*sudo, "snap", "install", "hugo"], check=False)
        if print_hugo_version():
            return True

    if command_exists("apt-get") and sudo is not None:
        print("Hugo was not found. Trying apt...")
        run([*sudo, "apt-get", "update"], check=False)
        run([*sudo, "apt-get", "install", "-y", "hugo"], check=False)
        if print_hugo_version():
            return True

    if sudo is None:
        print("No sudo command is available, so automatic Hugo install was skipped.")

    return False


def install_hugo_macos() -> bool:
    if not command_exists("brew"):
        return False

    print("Hugo was not found. Trying Homebrew...")
    run(["brew", "install", "hugo"], check=False)
    return print_hugo_version()


def ensure_hugo() -> bool:
    if print_hugo_version():
        return True

    system = platform.system().lower()
    if system == "windows":
        installed = install_hugo_windows()
    elif system == "linux":
        installed = install_hugo_linux()
    elif system == "darwin":
        installed = install_hugo_macos()
    else:
        installed = False

    if installed:
        return True

    print()
    print("Hugo is required but could not be installed automatically.")
    print("Install Hugo Extended, then run this setup script again.")
    print("Windows: winget install Hugo.Hugo.Extended")
    print("Ubuntu:  sudo snap install hugo  OR  sudo apt-get install hugo")
    return False


def main() -> int:
    print("Setting up Miguel Joaquin A. Sanson's Hugo site...")

    if not command_exists("git"):
        print("Git is required for the PaperMod theme submodule.")
        return 1

    run(["git", "submodule", "update", "--init", "--recursive"])

    if not ensure_hugo():
        return 1

    print("Verifying the Hugo build...")
    result = run(["hugo", "--gc", "--noBuildLock"], check=False)
    if result.returncode != 0:
        print("Setup finished dependencies, but the Hugo build failed.")
        return result.returncode

    print("Setup complete. Start the site with: python run.py")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
