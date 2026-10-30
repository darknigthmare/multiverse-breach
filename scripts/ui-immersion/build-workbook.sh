#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd -- "$SCRIPT_DIR/../.." && pwd)"
RUNTIME_NODE="${CODEX_PRIMARY_RUNTIME_NODE:-}"
RUNTIME_MODULES="${CODEX_PRIMARY_RUNTIME_NODE_MODULES:-}"
RUNTIME_PYTHON="${CODEX_PRIMARY_RUNTIME_PYTHON:-python3}"

if [[ -z "$RUNTIME_NODE" || -z "$RUNTIME_MODULES" ]]; then
  echo 'Set CODEX_PRIMARY_RUNTIME_NODE and CODEX_PRIMARY_RUNTIME_NODE_MODULES to the installed artifact runtime.' >&2
  exit 1
fi

BUILD_DIR="$(mktemp -d "${TMPDIR:-/tmp}/multiverse-ui-workbook.XXXXXX")"
trap 'rm -f -- "$BUILD_DIR/build-workbook.mjs" "$BUILD_DIR/node_modules"; rmdir -- "$BUILD_DIR" 2>/dev/null || true' EXIT
ln -s -- "$RUNTIME_MODULES" "$BUILD_DIR/node_modules"
cp -- "$SCRIPT_DIR/build-workbook.mjs" "$BUILD_DIR/build-workbook.mjs"
"$RUNTIME_NODE" "$BUILD_DIR/build-workbook.mjs" --repo "$REPO_DIR" "$@"

WORKBOOK_OUTPUT="$REPO_DIR/docs/excel/Multiverse_Breach_UI_Immersion.xlsx"
WORKBOOK_QA="$REPO_DIR/docs/excel/qa"
EXTRA_ARGS=("$@")
for ((i = 0; i < ${#EXTRA_ARGS[@]}; i++)); do
  case "${EXTRA_ARGS[$i]}" in
    --output) WORKBOOK_OUTPUT="${EXTRA_ARGS[$((i + 1))]}" ;;
    --qa-dir) WORKBOOK_QA="${EXTRA_ARGS[$((i + 1))]}" ;;
  esac
done
"$RUNTIME_PYTHON" "$SCRIPT_DIR/verify-workbook.py" "$WORKBOOK_OUTPUT" --report "$WORKBOOK_QA/export-verification.json"
