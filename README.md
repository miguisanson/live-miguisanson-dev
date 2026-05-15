# Miguel Joaquin A. Sanson Portfolio

This is a Hugo portfolio site using the PaperMod theme.

## Quick Start

Run the same two scripts on Windows and Ubuntu.

Windows:

```powershell
py setup.py
py run.py
```

Ubuntu:

```bash
python3 setup.py
python3 run.py
```

`setup.py` initializes the PaperMod submodule, checks for Hugo, attempts to install it if it is missing, and verifies that the site builds.

`run.py` starts a Hugo development server. On Windows it binds to `127.0.0.1`. On Linux it binds to `0.0.0.0` so the site can be tested from another device or through a server firewall rule.

## Useful Commands

Build the production files into `public/`:

```bash
python3 run.py --build
```

Build and minify for production:

```bash
python3 run.py --build --minify
```

Run on a specific server domain or IP:

```bash
HUGO_BASEURL=http://your-server-ip:1313/ python3 run.py
```

Run on a custom port:

```bash
python3 run.py --port 8080
```

On Windows PowerShell, use `$env:HUGO_BASEURL = "http://localhost:1313/"` before running the script if you need to set environment variables.
