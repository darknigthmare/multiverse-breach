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
  (SHA-256 `0724b99934c91f54dc5c3e3510835dcc7c9364875a844b194c3ef14e158f9998`)
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

Ces garde-fous écrits ne constituent pas une consultation humaine. En
particulier, la revue spécialisée en égyptologie demandée pour Kemet et la
relecture compétente demandée pour Tawantinsuyu restent des validations
humaines distinctes à organiser avant de revendiquer cette approbation.
