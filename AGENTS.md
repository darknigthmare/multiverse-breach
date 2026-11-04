# Multiverse Breach — development instructions

## Game-development workflow

For gameplay, HUD/menu, controls, assets, audio, save or performance work, read
[the project guide](docs/development/GAMEDEV_GUIDE.md), then only the relevant
vendored `SKILL.md` and its needed references. The selection and upstream
revision are recorded in [the manifest](vendor/gamedev-skills/UPSTREAM.json).

- Keep the existing React/Vite application and custom Canvas 2D engines. Verify
  the target module and dependency lock before choosing APIs. Godot/Unity/etc.
  snippets in upstream guides illustrate concepts; bind them to the existing
  JavaScript interfaces.
- Start with the current repository code and tests. Uploaded snapshots and old
  audit reports may predate fixes.
- State the player-visible acceptance criteria before editing. Follow one
  feature through input, simulation, presentation and cleanup as applicable.
- Use stable content IDs and preserve save migrations, rewards, roster entries
  and cosmetic variants when changing shared systems.
- For a sprite family, retain source references and the established visual
  direction. Check dimensions, alpha, ground anchor, frame stability and actual
  game-scale rendering. Mark visual fidelity as unverified until reviewed.
- For performance, reproduce and measure a representative workload. Report the
  measured property and its limits; fewer state updates alone do not prove an
  FPS gain.
- Reuse the existing test and asset-audit entry points. Add focused regression
  coverage for behavior changed; distinguish source assertions, runtime unit
  tests, browser playthroughs and visual review.

## Verification and reporting

Use the commands mapped to each subsystem in the project guide. Run
`node scripts/checkGamedevGuidance.mjs` after touching this guidance or its
vendor snapshot. It verifies file integrity without downloading or executing
upstream installers.

`npm run build` includes the repository's `prebuild` checks. A direct Vite
compilation is a narrower check and must be reported as such. An incomplete
asset checkout is not evidence that production assets are missing.

Summarize the change, tests actually run, relevant observations and remaining
limits. Keep vendored upstream files unchanged; put Multiverse-specific
adaptations in the project guide and update the snapshot deliberately with
its provenance.

<!-- BEGIN:shared-ai-tooling -->
## Outils de développement IA

Ce dépôt peut utiliser [Spec Kit](https://github.com/github/spec-kit),
[Superpowers](https://github.com/obra/superpowers) et, avec Claude Code,
[Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios).

Lire le [guide d'intégration](.ai-tools/README.md) et les
[révisions de référence](.ai-tools/sources.json) avant leur première utilisation.

- **Spec Kit** : cadrer une fonctionnalité ou une évolution importante en
  spécification, plan et tâches ; réutiliser les documents et le suivi existants.
- **Superpowers** : choisir les pratiques pertinentes pour l'implémentation,
  le diagnostic, la revue et la vérification. Garder un seul plan de travail.
- **Claude Code Game Studios** : utiliser les agents spécialisés dans les
  sessions Claude Code pour les tâches de jeu concernées. Pour un autre type de
  projet, conserver cette possibilité sans imposer une organisation de studio.
- Adapter ces outils à la demande en cours et aux contrats du projet. Préserver
  l'architecture, les conventions, les consignes et les autorisations existantes.
- Vérifier leur disponibilité réelle avant d'annoncer une commande ou un plugin
  comme installé. Le guide fournit les étapes d'activation et un diagnostic local.

Ces consignes ajoutent des outils au projet ; leurs références externes ne
constituent pas une autorisation de modifier les permissions ou de publier.
<!-- END:shared-ai-tooling -->
