# Visuels OpenAI Image v2 des univers OC

Date de production : 2026-07-28.

## Contrat livré

- 20 univers et 25 images distinctes par univers, soit 500 PNG.
- Génération individuelle avec l'interface OpenAI intégrée `image_gen`.
- Un prompt unique par image, dérivé de `src/game/originalUniversesManifest.json`.
- Un chemin runtime v2 unique et une entrée de provenance JSON par image.
- Aucun ancien SVG n'est référencé par le contrat audiovisuel runtime des univers OC.

Répartition : 20 boosters, 20 décors, 60 stages, 60 héros, 100 ennemis,
60 boss, 20 world boss, 60 équipements et 100 objets de combat.

## Sources vérifiables

- Plan et prompts :
  `docs/original-universes/openai-image-v2-plan.json`
  (SHA-256 `38e5b69fb230ccf6b59e94199bde1520fbc603d30d98dbf9ba4050468025137b`)
- Revue culturelle et garde-fous ciblés :
  `docs/original-universes/cultural-remediation-v3.json`
- Sidecars de provenance :
  `docs/original-universes/openai-image-v2-ledger/entries/`
- Images finales :
  `public/boosters/original-worlds/v2/` et
  `public/images/oc-worlds/v2/`
- Contrat runtime :
  `src/game/originalUniverseProduction.js`
- Audit strict :
  `node scripts/originalUniverseImageV2Audit.mjs`

L'audit vérifie la parité exacte entre le manifeste, le plan et le runtime, les
500 signatures PNG, leurs CRC, leurs dimensions et ratios, l'unicité des
contenus encodés et décodés, ainsi que les hashes des 500 sidecars.

## Fidélité et sensibilité

Les prompts reprennent les descriptions du monde, le conflit central, la
direction visuelle, la palette et les faits propres à chaque personnage,
menace, lieu ou objet. Les 38 notes de sensibilité du manifeste sont injectées
textuellement dans les 375 prompts concernés.

Une revue documentaire ciblée a renforcé exactement 27 prompts : 15 pour
Kemet et 12 pour Tawantinsuyu. Les 473 autres prompts et les 500 destinations
runtime restent inchangés. Le détail des constats, sources et corrections est
conservé dans `CULTURAL_REVIEW_KEMET_TAWANTINSUYU.md`.

Ces garde-fous écrits ne constituent pas une consultation humaine. En
particulier, la revue spécialisée en égyptologie demandée pour Kemet et la
relecture compétente demandée pour Tawantinsuyu restent des validations
humaines distinctes à organiser avant de revendiquer cette approbation.
