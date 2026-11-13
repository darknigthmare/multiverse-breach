# Alien vs Predator tactics tiles diagnostic

Read-only diagnosis at frozen source revision `3fb49277809f28d11d4886c847558fca6ee91f21`. The active batch provider and decoder were not changed.

- Source: `DLC/AlienVsPredator/assets/backgrounds/lore-stages/alien-vs-predator/tactics-tiles.webp`
- Expected and verified Git blob: `ebfe774bdeff72e25da750999fd58ce1694b9fdc`
- Canonical payload: 1706428 bytes, SHA-256 `7129d8da0a2d8859b7aa228def32d33624171b45ef563a2ca8dd81ab4fd552d1`
- First 16 bytes: `89504e470d0a1a0a0000000d49484452` (PNG signature).
- Sharp actual format: **png**, 1024 × 1024, 4 channels, alpha: true.
- Frozen decoder: **DLC_BATCH_DECODE_FAILED**, stable reason **extension-format-mismatch**.
- Native Sharp metadata/stats: **PASSED**; raw pixel decode: **PASSED**. Raw pixel SHA-256: `44beb133be7df97560f5104d3f6727fdb265cd86277714d82cd52483bd093204`.

This is an extension/format mismatch: the .webp path carries a valid PNG payload. Successful native pixel decoding provides no evidence of compressed-payload corruption in this run. The image is below the unchanged 33,554,432-pixel limit. The frozen decoder rejects the format before its stats stage, so the existing rejection must remain visible.

Provider/decoder SHA-256 before and after: `79645ac90b77ef99001df2410a2af9b8a890e7bba0ff74e637c9735d5dad3aa9` / `40de8891a4281a317fb84180bd4e252b39dc817d9acc690840d35b63bd3cf472`; both unchanged: true. Canonical checkout fingerprint and Git index unchanged: true / true. Core LFS file-count/byte summary unchanged: true; no LFS fetch was allowed. These are scoped observations, not a claim that every Git object was hashed.

Temporary payload verified before and after decode, cleaned via the frozen provider: 1 receipt; close succeeded: true; owned root removed: true. Observed owned temporary bytes at payload peak: 1706551, below the 64 MiB allocation. Raw pixels remained in process memory; no PNG, converted artwork or raw pixel buffer was written into the repository.

For a later correction, prefer matching the extension and references to the actual PNG format while retaining these exact bytes. Check all references before any rename. A separately scoped lossless delivery conversion would need explicit pixel, alpha and dimensions comparisons and cannot preserve the canonical-byte hash. Do not loosen the frozen decoder or rewrite active receipts.

Technical decode evidence only. No visual inspection, native-scale in-game review or 1:1 fidelity certification was performed.
