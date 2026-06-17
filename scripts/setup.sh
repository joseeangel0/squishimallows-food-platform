#!/bin/bash
# Creates venv, installs dependencies, and runs seed + export scripts.
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV_DIR="$SCRIPT_DIR/../.venv"

echo "Setting up Squishimallows scripts..."

if [ ! -d "$VENV_DIR" ]; then
  echo "Creating virtual environment..."
  python3 -m venv "$VENV_DIR"
fi

echo "Installing dependencies..."
"$VENV_DIR/bin/pip" install -q --upgrade pip
"$VENV_DIR/bin/pip" install -q -r "$SCRIPT_DIR/requirements.txt"

echo "Running seed..."
"$VENV_DIR/bin/python" "$SCRIPT_DIR/seed.py"

echo "Exporting sample data..."
"$VENV_DIR/bin/python" "$SCRIPT_DIR/export.py"

echo "Done."
