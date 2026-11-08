# Des chemins parcourus pour la Cité — 8 novembre 2026

## Résultat attendu dans le jeu

Une demande de reconnaissance doit conduire le joueur sur le terrain. L’ouverture
du carnet, le choix d’une route ou une interaction au dernier panneau ne doivent
pas inventer le trajet. Les quatre nouvelles aventures associent une demande
personnelle, un objet réellement transporté, des repères à rejoindre dans l’ordre
et une conversation de retour.

| Personnage | Aventure ajoutée | Travail dans la scène | Retour |
| --- | --- | --- | --- |
| Ancre | Une place dans le faisceau | Séparer le départ de l’accueil, porter sa lampe, parcourir le bord est ou le détour de la réserve et orienter le dernier repère. | Mirelle garde une seconde lumière qui n’emprunte pas l’identité de l’Ancre. |
| Bastion Korr | La relève du Rempart | Porter et poser deux étais distincts, découvrir le siège fendu, appuyer le second sur la traverse intacte, parcourir le chemin de relève. | Bastion peut desserrer la main ; la dixième route demeure fermée. |
| Nova Vey | Le battement d’aujourd’hui | Porter la sonde basse du côté stable et effectuer un aller-retour par la rue choisie. | Nova distingue ce retour à pied d’une traversée de la faille et d’une prédiction. |
| Sable Orison | Une nuit sans panneaux | Rabattre la flèche devenue trompeuse, éclairer le carrefour, rejoindre les quatre repères avant de fixer le dernier panneau. | Sable assume le chemin parcouru aujourd’hui, en conservant les anciennes cartes. |

Ces épisodes sont des créations du Nexus fondées sur `characterPlaques.js`,
`heroes.js`, `lore.js` et `ocCampaign.js`. Ils prolongent les premières aventures
de ces quatre personnages. Le choix hérité modifie la première intervention ;
les deux choix présents conduisent à des parcours différents. Les quatre anciens
épisodes de transport et les 28 contrats précédents gardent leurs identifiants,
leur ordre et leurs textes.

## Ce que fait le joueur

Chaque nouveau parcours contient quatre repères. Le carnet indique le nombre
déjà rejoint et le prochain lieu. Le marqueur de la scène se déplace vers ce
prochain lieu uniquement après l’arrivée effective du joueur. Le bouton
d’approche suit les repères avec le pathfinding ordinaire ; le joueur peut aussi
marcher au clavier ou au tactile. La marche manuelle ne crée aucun trajet
automatique lorsqu’un repère est atteint.

Le compteur est alimenté juste après `advanceMosaicPlayer`. Un repère nécessite
un déplacement positif, une durée active comprise dans la limite habituelle de
50 ms et une arrivée à 64 unités du lieu demandé. Le déplacement doit respecter
le budget de la vitesse réelle du joueur. Un seul repère peut être reçu sur une
image ; deux repères consécutifs doivent être distants de plus de 128 unités.
Atteindre un lieu futur avant son tour ne donne rien.

Un clic sur le repère et **REJOINDRE** depuis le carnet utilisent le même
planificateur d'approche. Une reprise déjà au pied du repère demande un petit
déplacement distinct dans sa portée, sans replacer le joueur. Le carnet attend
sa fermeture avant de lancer cette marche. Un passage fermé donne un retour
local et ne crée aucun reçu ; les vitesses, les obstacles et les 64 unités
requises restent inchangés.

Le dernier repère ne termine pas l’étape. L’interaction physique finale, à la
portée normale de la Cité, fixe le panneau et produit son reçu d’opération. Le
choix, le carnet et les observations du rendu n’attribuent aucun objet, aucune
réparation ou récompense.

## Sauvegarde et reprise

`walkReceipts[stepId]` conserve les points reçus, dans l’ordre, avec leur identité,
leurs coordonnées et l’échantillon de mouvement qui les a atteints. Le reçu
appartient au contrat, au quartier, à l’univers, à l’origine héritée et à la
branche choisie. Une déclaration de parcours modifiée ou un reçu incompatible
ne donne aucun point. Les champs inconnus, notamment ceux d’un pack absent,
restent conservés dans la sauvegarde.

Les repères déjà rejoints survivent au changement de mission, de quartier et au
chargement. Les pas entre deux repères ne sont pas écrits image par image. Un
menu, une pause ou une page masquée arrêtent la boucle avant la collecte ; la
première image de reprise ne rattrape pas le temps écoulé. Une reprise explicite
d’un ancien récit vide aussi ses reçus de marche, tout en conservant la visite
antérieure dans son archive.

Les reçus sont un contrat local de gameplay. Ils ne constituent pas un système
anti-triche ni une preuve de serveur pour une sauvegarde modifiée à la main.

## Objets et présentation

Les nouvelles aventures ajoutent cinq objets de quête et dix transferts : la
lampe de l’accueil, les deux étais de Bastion, la sonde basse de Nova et la lampe
du carrefour. Avec les quatre aventures de transport déjà présentes, huit
aventures utilisent dix objets et vingt transferts déclarés. Le joueur ne porte
qu’un objet à la fois ; la pièce précise doit arriver à sa propre destination.

L’étai possède une silhouette Canvas portée et un support posé distincts. Les
lampes et sondes réemploient les représentations existantes. Les objets achevés
restent dans le quartier avec leurs reçus. Le parcours utilise le cartouche
unique existant et la protection des limites de l’avatar et de l’objet porté.
Il n’ajoute pas de panneau permanent au HUD.

## Vérification de cette passe

- Matrice de **16 parcours de contrats** : quatre aventures × deux origines ×
  deux choix, jouées par le moteur réel de déplacement avec obstacles et PNJ.
  Chaque repère passe par la sauvegarde réelle et sa normalisation.
- Régressions de refus : repos, autre quartier, autre contrat actif, position
  lointaine, saut excessif, durée invalide, point futur, ordre inversé, origine,
  branche et géométrie incompatibles.
- Exécution du préfixe de la boucle de rendu de production : collecte après le
  mouvement, destination suivante sans déplacement instantané, marche manuelle,
  pause de scène, terminal, page masquée et reprise sans rattrapage.
- Les **177 tests Cité ciblés** passent sur le code local de cette passe. Les
  **10 contrôles Python de preuve de mouvement** incluent les nouveaux refus de
  reçus sans image native correspondante. Oxlint ciblé et compilation Python
  passent. Les commandes `prebuild` ne sont pas modifiées.

La recette native conserve les anciens scénarios et ajoute les deux langues,
deux origines et deux choix de chaque nouvelle aventure. Chaque point enregistré
doit correspondre à deux observations consécutives du vrai déplacement Canvas,
avec la même position, vitesse et durée. Les traces brutes sont conservées avant
les assertions. La matrice répartit les nouveaux cas dans huit jobs séparés,
avec les mêmes formats bureau, portrait et paysage et les mêmes seuils.

Le Chromium local a été retenté et échoue avant l’ouverture d’une page avec
`socket(): Operation not permitted`. Les parcours natifs, les distributions
autonomes et le build complet doivent être attribués à la révision publiée et
à ses propres artefacts GitHub Actions dans la description de PR. Les preuves
de `48197dc4` concernent uniquement la version précédente.

## Limites restant à développer

Ces scènes préparent des chemins et des installations dans le quartier Nexus
existant. Elles n’ajoutent pas de foule autonome, d’escorte d’arrivants, de blessé
transporté, de gabarit de chariot ni de physique du battant. La pose des étais
est une intervention enregistrée, pas un calcul structurel. L’aventure de Nova
laisse le raccord fermé : elle ne prétend pas implémenter une fenêtre de
traversée chronométrée. Ces parties des propositions initiales restent
explicitement ouvertes dans l’Excel.

La lecture de direction du FPS et les rubriques du terminal sont décrites dans
`docs/extinction-city/AIM_AND_ACTION_FEEDBACK_2026-11-08.md` et
`docs/development/CITY_POCKET_TERMINAL_2026-11-08.md`.
