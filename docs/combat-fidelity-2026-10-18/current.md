# Mesures de fidélité des combats — 18 octobre 2026

Ce rapport compare le runtime à la référence immuable [baseline.json](baseline.json). Les mesures sont reproductibles avec `node scripts/combatFidelityAudit.mjs --write` ; `--check` contrôle ensuite le JSON. Les tests de `combatFidelity.test.mjs` vérifient les cellules RGBA, les rectangles effectivement sélectionnés par le renderer, les phases et la géométrie des scènes, la pause, le miroir P2 et l’impact unique.

| Domaine | Mesure actuelle | Limite de la preuve |
| --- | --- | --- |
| Capacités simples, secondaires et défenses | 1438 héros documentés, 4210 slots explicites ; 1365 kits complets et 73 correctifs partiels | Armes, techniques et soutiens choisis par personnage ; équilibre et timing adaptés. Les actions originales du catalogue sont conservées. |
| Libellés génériques stricts | 4134 dans la source brute ; 0 dans les capacités résolues | Le nom seul ne certifie pas une capacité fidèle. L’heuristique initiale plus large conserve 4252 candidats, dont 118 défenses concrètement nommées à examiner séparément. |
| Correction de lore séparée | 1 personnage, 1 slot | Pas de l’Ancêtre de Mei Zhen devient un bonus allié sans dégâts : le manifeste original interdit de transformer les morts en soldats. Cette correction d’une action déjà nommée est distincte des 72 héros et 114 slots de la référence résiduelle immuable. |
| États de Mêlée | 85995 associations ; 30510 adaptations utilisent encore une pose idle | Les alias donnent désormais une pose grossière explicite aux 45 états. Ils ne créent aucune image dédiée supplémentaire. |
| Animations natives dédiées | 8 héros, 64 séquences et 256 poses ; 1903 héros sans cet atlas dédié | Illustrations OpenAI locales pour sept présentations et un super ; aucun manifeste complet des 45 états n’est déduit de ces huit lignes. |
| Corrections des sprites de base | 1 personnage, 16 poses | Aria reçoit un sprite âgé à la dague, sans luth. Les quatre états de base ne sont pas comptés comme un atlas de présentation dédié supplémentaire. |
| Présentations scriptées | 41 héros du catalogue, 287 paires héros/phase ; 13090 paires restent sur les présentations communes | L’avatar player_anchor ajoute sept scènes hors catalogue. Les scripts combinent poses existantes, trajectoires et effets ; ils ne sont pas des cinématiques sources certifiées. |
| Invocations et déploiements | 28 atlas, 82 profils appelants, 28 chorégraphies, 28 trajectoires géométriques distinctes échantillonnées | Les quatre poses par entité, déplacements et effets sont des adaptations. L’impact de gameplay reste unique et piloté par la simulation. |
| Décors | 525 ambiances de base ; 17 mécanismes ciblés pour 12 univers du catalogue ; 4 atlas de portail locaux | Autres mécanismes dessinés ou régions de fonds statiques recomposées ; aucune animation officielle de scène n’est revendiquée. |
| Séquences sources validées 1:1 | 0 | Aucun nom, script, PNG, test ou compteur n’est interprété comme une comparaison visuelle validée avec l’œuvre. |

Les manques d’assets et l’absence de certification sont mesurés séparément : 1903 héros n’ont pas d’atlas dédié de présentation, mais les 1911 héros restent sans animation source certifiée 1:1, y compris les huit atlas ajoutés. Aucun des 1911 héros ne possède encore un manifeste illustré dédié couvrant les 45 états de Mêlée. Les 13377 paires de présentation, les 28 séquences d’entité et les 525 univers de décor demeurent non certifiés. Parmi les décors, 513 univers n’ont que l’ambiance de base et aucun des nouveaux mécanismes ciblés.

L’audit pixel initial indépendant a décodé 1914 feuilles, dont 1905 grilles entières comparées cellule par cellule. Il relève 0 feuilles avec des cellules RGBA exactement répétées et 9 images dont les dimensions ne donnent pas une grille entière. Ces neuf images constituent l’inventaire initial à examiner ; elles ne sont pas comptées comme absentes. La correction d’Aria est suivie séparément, sans réécrire cet historique ni le présenter comme un nouvel audit pixel intégral. Voir [character-animation-pixel-audit.json](character-animation-pixel-audit.json).

Les détails par identité, les slots encore candidats, les références, les poses et les trajectoires échantillonnées se trouvent dans [current.json](current.json). La validation source 1:1 demeure explicitement fausse.
