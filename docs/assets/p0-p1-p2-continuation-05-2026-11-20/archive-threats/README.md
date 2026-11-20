# Rang des menaces dans le Codex

Le lecteur de dossier traitait la dernière menace visible comme le noyau final. Il présentait les autres entrées comme des menaces de terrain, y compris les champions. Quand un réglage administrateur masquait le noyau, le dernier champion en héritait.

Le dossier reprend désormais le rang sous lequel chaque menace est inscrite dans le registre de son univers. La carte, sa notice et la recherche emploient ce même rang en français et en anglais. Sur le registre brut, 1 114 des 3 025 entrées issues de 525 listes changent de rang par rapport à l’ancienne règle. Le registre comprend 129 listes sans noyau final. [Projection](../../../../src/game/universeArchiveView.js) · [Lecteur](../../../../src/components/UniverseArchiveReader.jsx)

## Vérification Chromium

Le parcours part du hub et ouvre **Codex → Dossiers des univers → Nexus de Convergence → Personnages et menaces**. Les deux écrans utilisent le réglage de texte du jeu à 150 % et le mouvement réduit.

| Situation | Avant | Après | Recherche après correction |
| --- | --- | --- | --- |
| Bureau FR, 1280 × 900, registre complet | Greffier du Voile, menace de terrain | Greffier du Voile, champion de faille | 9 champions, 1 noyau final |
| Mobile EN, 390 × 844, Moteur de Convergence Instable masqué | Arbitre de la Cause Unique, local final core | Arbitre de la Cause Unique, breach champion | 9 champions, 0 noyau final |

Échap restaure le focus sur le bouton d’ouverture dans les deux parcours. Les fiches et le panneau n’ont aucun débordement horizontal. Aucune erreur JavaScript ou HTTP et aucune écriture de progression ni lancement de combat sur les parcours mesurés. Les captures sont des écrans Chromium locaux sur les médias servis depuis le dépôt. [Mobile avant](mobile-before.jpg) · [Mobile après](mobile-after.jpg)

Les tests couvrent également le registre vide, le registre sans noyau, deux acteurs distincts qui partagent leur nom, le masquage du noyau et les libellés français et anglais. [Projection](../../../../scripts/universeArchiveView.test.mjs) · [Rendu](../../../../scripts/universeArchiveReader.test.mjs)
