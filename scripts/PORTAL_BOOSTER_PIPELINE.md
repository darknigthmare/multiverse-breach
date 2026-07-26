# Portal booster generation pipeline

This workflow is designed for several Codex agents sharing one checkout. Image
generation uses the built-in `image_gen` tool, with one independent call per
universe. The scripts never call an image API and need no API key.

## 1. Build and initialize the missing-universe plan

```powershell
node scripts/buildPortalBoosterGenerationPlan.mjs
python scripts/portal_booster_pipeline.py init
python scripts/portal_booster_pipeline.py status
```

The plan is derived from the final runtime `HEROES_DB`, not from a source-text
regex. Universes that already have a catalogued asset of at least 50 KB are
excluded. `Nexus de Convergence` is excluded because its permanent mixed pack is
handled separately.

Pipeline state lives under `tmp/booster-generation/`:

- `jobs/`: immutable job and prompt records;
- `claims/`: atomic, exclusive agent claims;
- `results/`: successful validated publications;
- `events/`: one immutable event file per claim, failure, success or reclaim;
- `status.json`: regenerable status report;
- `ready/` and `sources/`: optional intermediates.

Do not commit this state directory. The final assets under `public/boosters/`
and the helper scripts are the durable project outputs.

## 2. Agent loop

Each agent uses a unique short identifier:

```powershell
python scripts/portal_booster_pipeline.py claim --agent booster-a --limit 1
```

The returned job includes the complete prompt. Pass that prompt unchanged to
one built-in `image_gen` call. This is a new image, so do not include a
reference image unless the task explicitly requires one. Copy or move the
selected generated PNG from the generated-images location into the workspace,
then ingest it:

```powershell
python scripts/portal_booster_pipeline.py ingest `
  --agent booster-a `
  --slug gears-of-war `
  --source C:\absolute\path\to\generated.png
```

Ingest rejects non-PNG sources, undersized images and ratios outside the 2:3
tolerance. It converts with Pillow to RGB WebP, exactly 640×960, quality 88,
LANCZOS resampling and method 6. The staged WebP is decoded and checked before
an atomic move into its unique `public/boosters/<slug>.webp` path. Valid output
must be 50–800 KB. The result stores source/output SHA-256 hashes, dimensions,
byte size, agent and completion time.

If image generation or visual review fails, journal it and release the job:

```powershell
python scripts/portal_booster_pipeline.py fail `
  --agent booster-a `
  --slug gears-of-war `
  --message "packet cropped at the top"
```

The next agent can claim it again. Successful jobs are never claimed or
regenerated on resume.

## 3. Recovery rules

- A claim is never stolen automatically.
- After confirming that an agent is gone, explicitly reclaim old claims:

```powershell
python scripts/portal_booster_pipeline.py reclaim-stale --older-than-hours 4
```

- If the process stopped after the atomic WebP publication but before writing
  its result, inspect the file and let the owning agent adopt it:

```powershell
python scripts/portal_booster_pipeline.py ingest `
  --agent booster-a `
  --slug gears-of-war `
  --source C:\absolute\path\to\generated.png `
  --adopt-existing
```

- Never use `--update-jobs` during an active run. It exists only for a reviewed
  plan correction and refuses to mutate completed jobs.
- `status` reopens and validates every completed WebP and checks its stored
  hash, so corrupted or manually replaced files become `invalid`.

## 4. Single-writer catalogue merge

Only after all jobs are complete:

```powershell
python scripts/portal_booster_pipeline.py export-catalog
node scripts/syncPortalBoosterCatalog.mjs
node scripts/syncPortalBoosterCatalog.mjs --write
npm.cmd run boosters:audit
npm.cmd run test:boosters
npm.cmd run lint
npm.cmd run build
```

`export-catalog` refuses partial state by default. The sync script first runs as
a dry check, rereads the current catalogue, validates every generated asset
against the manifest byte size and SHA-256, rejects universe/path collisions,
then deterministically replaces only `BOOSTER_ART_BY_UNIVERSE`. This final
single-writer step avoids hundreds of agents editing the same JavaScript file.

Use `--allow-partial` only for an intentional, reviewed partial publication and
pass it both when exporting and checking the merge.
