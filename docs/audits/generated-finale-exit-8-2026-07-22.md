# Exit 8 - kit de finale OpenAI

Date : 2026-07-22

## Asset livre

- Chemin runtime : `/sprites/generated/finals/exit-8/noncombatfinal.png`
- Format : 1024 x 1024, RGBA, grille 4 x 4
- Politique : `nonCombatFinal`

## Direction lore

La finale reste un parcours d'observation et de boucle, pas un combat. Les captures officielles PLAYISM ont servi a verrouiller les carreaux blancs, le plafond gris, les neons, la bande podotactile jaune, les portes metalliques, les affiches encadrees et les cameras.

Reference primaire : <https://playism.com/en/game/the-exit-8/>

## Contenu

- Ligne 1 : quatre etats complets du couloir.
- Ligne 2 : anomalies modulaires de mur, portes, neons et cameras.
- Ligne 3 : inondation progressive, eclairage de progression et silhouette lointaine.
- Ligne 4 : sortie correcte, mauvais embranchement, restauration du couloir et props interchangeables.

## QA

- Generation et retouche ciblee effectuees avec OpenAI ImageGen.
- Recalage technique en 16 cellules de 256 x 256.
- Fond chroma magenta supprime localement.
- Les cellules de couloir sont volontairement plein cadre pour produire un
  raccord sans marge; les cellules d'overlay gardent leur fond transparent.
- Aucun RGB cache sous alpha 0.
- Les groupes proches du bord droit ont ete recentres pour eviter le clipping runtime.
- Inspection visuelle finale effectuee.
