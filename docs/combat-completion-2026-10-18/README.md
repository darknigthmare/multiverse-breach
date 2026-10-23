# Complément des capacités, entités et ambiances

Les trois lots demandés sont intégrés ensemble. La vérification a aussi révélé 191 capacités « decisive action », reprises dans deux lots supplémentaires.

| Manque mesuré | Avant | Après |
| --- | ---: | ---: |
| Supers génériques du lot initial | 1 089 | 0 |
| Autres supers génériques trouvés pendant la revue | 191 | 0 |
| Profils sans asset de l’entité appelée | 82 | 0 |
| Univers sans ambiance par défaut | 255 | 0 |

Le moteur résout **1 911 supers dans 525 univers**. Les 1 280 corrections ont des identifiants, actions, œuvres et références explicites ; les règles numériques partagées ne choisissent aucune identité. Les soins, gardes, améliorations, purifications et résurrections conservent leurs cibles et leur nature. Le RPG et son interface utilisent les mêmes capacités effectives.

Les 82 profils utilisent **28 planches transparentes, soit 112 poses distinctes**. Les entités se dessinent avec leur propre image, dans le bon sens pour chaque camp. Les huit sources PNG natives sont archivées : quatre atlas, trois corrections utilisées et une tentative rejetée avec son motif. Les prompts, empreintes, coordonnées et normalisations figurent dans [la provenance](entity-assets-provenance.json). Aucune identité d’un autre univers ne sert de remplacement.

Les 255 ambiances ajoutées précisent chacune lieu, référence, motif, couleur et placement. **525/525 univers** ont désormais une résolution sans nom de scène. Une scène concrète conserve la priorité ; les effets restent décoratifs et suivent la pause et le mouvement réduit.

La fidélité canonique 1:1 n’est pas certifiée. Les techniques nommées, rôles adaptés et créations du projet sont distingués. Les visuels sont générés ; les séquences et règles restent des adaptations au moteur, et les références aux œuvres ne sont pas déclarées vérifiées sur le réseau.

## Contrôles reproductibles

- `npm run test:combat-presentation` : **89 tests** de catalogue, couvertures indépendantes, PNG réels, ciblage, coûts, pauses, interruptions, effets et résultats de manche, suivis du contrôle de fraîcheur de l’audit.
- `node scripts/combatCompletionAudit.mjs --check` : [état des 1 911 personnages et 525 univers](coverage.json), avec baselines conservées avant correction.
- `node scripts/buildCombatEntityAssets.mjs --check` : intégrité des PNG, sources, transparence, dimensions et marges.
- `npm run lint` et `git diff --check`.
- `npm run build` : prébuild complet et compilation Vite réussis ; les 28 PNG copiés dans le résultat compilé ont aussi leurs empreintes vérifiées.

Dans Chromium, les 28 entités ont été chargées et rendues sur les deux camps : **56 scènes, 224 poses affichées**, avec orientation et pause contrôlées, sans erreur JavaScript. Le vrai composant GameCanvas a aussi passé le parcours invocation FFVII, annulation gratuite, clavier, confirmation, coût, impact unique, retour et usage unique. Le parcours Fighter a passé intro, première manche, reprise, finale, victoire et sortie avec résultat unique. Ces parcours utilisent un contexte de test isolé et des jauges préparées.

Les [montages des 28 entités](entity-assets-contact-sheet.png) ont été revus visuellement ; la validation de lisibilité et d’identité adaptée ne vaut pas certification des dessins originaux.

Le super d’Uzi a également été vérifié dans le vrai GameCanvas de mêlée : nom du railgun au panneau, rayon vert, activation clavier L, charge de 100 à 0, premier impact après `hitAt` et aucun second dégât. Aucune erreur JavaScript locale ; le chargement externe de Google Fonts reste bloqué par le proxy de cet environnement.
