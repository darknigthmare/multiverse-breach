# Capacités et animations de combat

Cette reprise étend les supers et les entités du [lot précédent](../combat-completion-2026-10-18/README.md) aux attaques simples, secondaires et défenses. Les 4 134 libellés strictement génériques de l’inventaire initial ont une résolution propre au personnage. Les 1 365 kits complets, les 72 corrections résiduelles et le correctif de Mei Zhen représentent 4 210 actions explicites pour 1 438 personnages. Les noms concrets déjà présents restent conservés ; leur seule présence ne certifie pas leur fidélité à une œuvre.

Les trois moteurs utilisent les effets déclarés : les civils et musiciens restent en soutien, les armes à feu utilisent leur portée, les soins choisissent leurs alliés admissibles et respectent leurs restrictions. Leo ne se soigne pas lui-même. « Pas de l’Ancêtre » de Mei Zhen guide les alliés sans attaquer, conformément au lore du projet. Les actions suivent les ticks de simulation, leur temps de préparation, leur impact unique et leur interruption.

Huit personnages disposent de véritables planches transparentes supplémentaires : Cloud, Tifa, Aerith, Barret, Goku, Vegeta, Naruto Six Paths et Sasuke Rinnegan. Chacun reçoit huit séquences de quatre poses : intro, outro, résultat de manche gagné/perdu, finale, victoire, défaite et super. Les 256 poses sont distinctes et les sources natives, références, prompts et empreintes sont archivés. Aria dispose séparément de 16 poses de base corrigées à la dague. Catastrophe de Barret s’exécute en vol avec un rayon descendant, puis un atterrissage visuel, sans déplacement artificiel de sa position physique.

Les présentations propres à 41 héros couvrent 287 paires personnage/phase, auxquelles s’ajoutent sept scènes de l’avatar Ancre. Les 28 entités possèdent chacune une chorégraphie, et 17 mécanismes de décor couvrent des scènes de 12 univers. Les 525 ambiances de base restent disponibles, y compris en dehors d’un lieu précisément nommé.

Le [rapport reproductible](current.md) indique les manques restants : 1 903 héros sans nouvel atlas dédié de présentation, aucun manifeste illustré complet couvrant les 45 états de Mêlée, et 513 univers sans ces mécanismes de décor spécifiques. Les poses existantes réutilisées, les nouvelles illustrations et les séquences sources certifiées sont comptées séparément. **La fidélité visuelle et mécanique 1:1 aux œuvres n’est pas certifiée.**

## Vérification

- `npm run test:combat-fidelity` contrôle les inventaires indépendants, les actions réelles, les pixels, les rectangles de rendu, les trajectoires et l’intégrité des nouvelles planches.
- `npm run test:combat-presentation` vérifie les supers, invocations, ciblages, coûts, pauses, interruptions et résultats de manche.
- `node scripts/combatFidelityAudit.mjs --check` contrôle la fraîcheur du [rapport détaillé](current.json) et ses empreintes de sources.
- `npm run build` exécute les suites et audits du projet avant la compilation Vite ; `npm run lint` et `git diff --check` complètent ces contrôles.

Les [résultats Chromium](browser-validation.json) couvrent 512 rendus de poses dédiées, 32 rendus d’Aria, le vrai composant de Mêlée avec Omnislash et Catastrophe, l’invocation RPG avec annulation gratuite et pause, puis le combat en deux manches jusqu’au résultat unique. Les jauges et PV sont préparés dans des scènes de test isolées ; aucune sauvegarde de production n’est modifiée. La capture de [Catastrophe](barret-catastrophe-browser.png) montre le rendu réellement observé. L’unique ressource externe bloquée est la requête Google Fonts du projet.

La [validation finale](validation.json) relève **803 tests réussis dans 17 suites**, dont 50 tests du nouveau lot et 92 tests de présentation de combat. Le lint et les audits passent. Après adaptation du dernier contrôle textuel d’orientation au nouvel acteur de présentation RPG, la compilation `npm exec vite build` réussit ; les 37 planches d’entités et de personnages copiées dans `dist` ont les mêmes SHA-256 que leurs sources. Le bundle conserve l’avertissement Vite sur la taille de certains chunks.

Le changement de planche d’Aria requiert aussi le renouvellement du catalogue des dossiers et de son audit technique de références. Les bitmaps et journaux de génération historiques restent conservés ; la nouvelle référence est évaluée sur ses propres pixels.
