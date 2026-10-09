#!/usr/bin/env bash
set -euo pipefail

# Image generation is performed with image_gen before this command. This script
# inventories, validates and installs the supplied PNGs; Bash does not generate
# the character artwork or certify its fidelity.
script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repository_root="$(cd -- "$script_directory/.." && pwd)"
private_plan=''
public_manifest=''
inventory_directory=''
component_layout=0

usage() {
  cat <<'HELP'
Usage: bash scripts/install-missing-character-images.sh \
  --manifest /ABSOLUTE/PRIVATE/plan.json \
  --public-manifest docs/audits/NEW-character-png-wave.json \
  --inventory-dir /ABSOLUTE/PRIVATE/results [--component-layout]

The plan supplies PNGs already generated with image_gen, their existing PNG
references and input hashes. This command does not generate images, replace
existing PNGs or historical ledgers, or certify 1:1 character fidelity.
HELP
}

while (($#)); do
  case "$1" in
    --manifest|--public-manifest|--inventory-dir)
      if (($# < 2)); then usage >&2; exit 2; fi
      case "$1" in
        --manifest) private_plan="$2" ;;
        --public-manifest) public_manifest="$2" ;;
        --inventory-dir) inventory_directory="$2" ;;
      esac
      shift 2
      ;;
    --component-layout) component_layout=1; shift ;;
    --help|-h) usage; exit 0 ;;
    *) usage >&2; exit 2 ;;
  esac
done

if [[ -z "$private_plan" || -z "$public_manifest" || -z "$inventory_directory" ]]; then
  usage >&2
  exit 2
fi
if [[ "$private_plan" != /* || "$inventory_directory" != /* ]]; then
  echo 'Private plan and inventory directory must use absolute local paths.' >&2
  exit 2
fi
case "$inventory_directory/" in
  "$repository_root/"*) echo 'Keep input/output inventory evidence outside the public repository.' >&2; exit 2 ;;
esac
mkdir -p -- "$inventory_directory"

node "$script_directory/missingCharacterImageInventory.mjs" \
  --root "$repository_root" --output "$inventory_directory/before.json" \
  > "$inventory_directory/before-summary.json"

installation_args=(--root "$repository_root" --manifest "$private_plan" --public-manifest "$public_manifest")
if ((component_layout)); then installation_args+=(--component-layout); fi
node "$script_directory/installReferencedCharacterImages.mjs" "${installation_args[@]}" \
  > "$inventory_directory/install-summary.json"

node "$script_directory/installReferencedCharacterImages.mjs" \
  --root "$repository_root" --audit "$public_manifest" \
  > "$inventory_directory/audit-summary.json"

node "$script_directory/missingCharacterImageInventory.mjs" \
  --root "$repository_root" --output "$inventory_directory/after.json" \
  > "$inventory_directory/after-summary.json"

echo "PNG installation and geometry audit completed. Evidence: $inventory_directory"
echo 'Visual review remains separate; no 1:1 fidelity certificate was issued.'
