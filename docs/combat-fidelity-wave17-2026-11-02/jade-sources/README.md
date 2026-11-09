# Jade — animations et actions de combat W17

Jade est fixée à **Beyond Good & Evil (2003)**, après l’obtention du Daï-Jo et du gant Gyrodisk. Le [manuel Ubisoft diffusé sur Steam](https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/15130/manuals/manual_english.pdf?t=1718743204) décrit les déplacements, esquives et prises de rebord p. 7, la photographie p. 8, le combat et la charge du Daï-Jo p. 10, et le gant Gyrodisk p. 13. Le manuel et quatre captures officielles de l’application Steam 15130 ont été lus et archivés sous `research/`.

Les captures montrent le **bandeau vert**, les cheveux noirs courts découverts, la veste verte et le pantalon vert/bleu-vert. L’erratum antérieur à la première génération remplace les indications héritées erronées « bonnet/pantalon beige » ; le premier plan reste archivé.

## Livraison effective

| Ensemble | PNG de production | Registres | Dessins natifs retenus |
|---|---:|---:|---:|
| 45 états de mêlée, quatre poses par état | 6 | 2 | 180 |
| Action Gyrodisk, quatre phases de quatre poses | 1 | 1 | 16 |
| Total de ce dossier | 7 | 3 | 196 |

Les 180 dessins des45 états sont liés dans `src/game/melee/jadeMeleeManifest.js`. Les PNG sont dans `public/sprites/generated/jade-melee-wave17/`. Le gant utilise séparément `public/sprites/generated/jade-action-wave17/gyrodisk.png`. Ces dessins ne réutilisent aucune cellule des48 poses du lotA ni des16 poses de l’invocation RPG de Jade. Les miroirs à l’exécution et les trois lignes transparentes inutilisées des atlas ne sont pas comptés comme dessins nouveaux.

Douze appels réels ont fourni232 dessins candidats :196 retenus et36 exclus. Pour les45 états, deux demandes de32 figures ont renvoyé seulement28 figures chacune ; la photo tronquée et les états absents ont été remplacés par des dessins natifs correctifs. Vingt dessins sont exclus de cet ensemble, dont16 études réservées. Pour le Gyrodisk, les16 figures du premier retour portaient un dispositif trop semblable à une caméra au poignet ; elles sont toutes exclues. Les16 figures correctives montrent une main gantée et la caméra séparée à la hanche. Sources brutes, arguments exacts, reçus, frontières d’import et exclusions restent disponibles.

## Comportement réellement branché

- Les attaques physiques du Daï-Jo possèdent **neuf segments de bâton mesurés**, soit18 extrémités, dans les cellules de contact. Smash et Fighter demandent un chevauchement entre leur capsule et la vraie boîte de collision adverse avant d’appliquer les dégâts. Une grande portée déclarée n’autorise pas un coup sans contact. Les mesures excluent le croissant d’énergie et la caméra.
- La charge de Jade utilise le **Daï-Jo simple**, conserve le temps de charge et son multiplicateur, et ne se transforme pas en Gyrodisk. Dans Fighter, l’attaque lourde suit ce même choix ; l’action spéciale secondaire reste le projectile du gant.
- Le Gyrodisk utilise16 poses distinctes, avec départ à la **colonne2 de la ligne2**, exactement au temps de libération. L’émetteur est mesuré sur les doigts/le bord du gant : source(810,775), cellule(152,177). Le projectile ne part pas de la caméra. Les grosses sphères génériques ont été remplacées par un petit disque aplati dans Smash et Fighter.
- Le super personnel « Jade photographie les preuves » révèle une cible pendant3 secondes, avec **zéro dégât et zéro augmentation d’attaque**. La photo a son animation informative propre.
- Douze paumes et douze poignets mesurés donnent11 contacts de rebord. Le dernier dessin de montée libère la prise. Les ancres suivent les vrais pixels sans déplacer le corps physique dans le renderer.

Les45 états sont des illustrations et adaptations jouables. Le système de garde continue, les fenêtres de parade parfaite, les attaques aériennes de jeu de plateforme, les valeurs de puissance et les délais restent adaptés au moteur. L’original 2003 emploie notamment l’esquive. Les orientations opposées utilisent le miroir du renderer ; l’exactitude anatomique du côté de la main n’est pas certifiée. **`source1to1Verified` reste `false`** : ce travail ne prétend pas livrer des images officielles ni certifier une reproduction intégrale image par image.

## Import et preuves

L’import suit des régions géométriques avec coutures ne traversant aucun pixel visible au seuil de mesure. **Chaque valeur RGBA retenue est copiée telle quelle**, y compris les pixels d’antialias dont l’alpha est compris entre1 et 23. Seuls l’extraction, le redimensionnement au voisin le plus proche, l’ancrage des pieds et le rangement des cellules sont appliqués. Une stature effective commune de190 pixels relie toutes les sources ; les corps accroupis, suspendus et couchés gardent leur projection naturellement plus basse.

Les vérifications ciblées couvrent les196 cellules, les sept PNG, les45 états, les reçus, la conservation exacte des pixels, les ancres et les actions dans les deux camps de Smash/Fighter :

```sh
node --test --test-concurrency=1 scripts/jadeNativeAssetsWave17.test.mjs scripts/jadeStaffContactWave17.test.mjs scripts/jadeMeleeWave17.test.mjs
node docs/combat-fidelity-wave17-2026-11-02/jade-sources/build-native-jade-atlases.mjs --config docs/combat-fidelity-wave17-2026-11-02/jade-sources/packing-plan.json --check
node docs/combat-fidelity-wave17-2026-11-02/jade-sources/measure-jade-native-hands.mjs --check
node docs/combat-fidelity-wave17-2026-11-02/jade-sources/measure-jade-native-staff.mjs --check
node docs/combat-fidelity-wave17-2026-11-02/jade-sources/build-jade-gyrodisk-action.mjs --check
```

Les scripts navigateur de `browser/` exécutent six types de commandes clavier dans chacun des deux camps : déplacement, attaque légère, garde, charge, photo et Gyrodisk. Les12 flux GameCanvas sont distincts des deux études contrôlées du renderer et des rebords. Ces dernières vérifient360 dessins de cellules,8 prises dessinées et20 situations de rebord avec28 dessins attachés ; ce dernier nombre est dérivé des prises natives de Jade, dont la dernière pose de montée relâche la main.

Les tentatives préliminaires, y compris l’échec initial du compteur hérité de32 prises, restent sous `browser/attempts/`. Une preuve finale doit être exécutée **après le gel de production**, avec des empreintes d’entrée identiques avant et après, puis revue visuellement. Les résultats préliminaires ne valent pas validation finale de la vague.

```sh
node docs/combat-fidelity-wave17-2026-11-02/jade-sources/browser/start-jade-server.mjs
node docs/combat-fidelity-wave17-2026-11-02/jade-sources/browser/run-jade-browser-checks.mjs --after-production-freeze
```

Le premier plan Gyrodisk local est antérieur à son premier appel. L’annexe globale 2 a été enregistrée1,152seconde après le cliché des arguments de cet appel rejeté. Cette différence est explicitée dans `gyrodisk-correction-plan-before-generation.json` ; aucune date n’a été réécrite. Le plan correctif et l’art accepté sont postérieurs à l’annexe globale et conservent leurs véritables reçus.
