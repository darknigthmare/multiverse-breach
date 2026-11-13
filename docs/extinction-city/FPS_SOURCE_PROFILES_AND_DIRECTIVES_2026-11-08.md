# Profils FPS et directives de terrain — 8 novembre 2026

## Critères visibles

Chaque combattant possédé conserve son identité et ses quatre actions du catalogue.
La préparation indique l’équipement déclaré, la vue disponible et le fonctionnement
de l’action principale. La mêlée exige le contact ; les contrôles ralentissent sans
infliger de dégâts ; les tirs, projectiles, soutiens et défenses ont des effets
exécutables. Après un ramassage, **V** restitue le kit personnel avec le stock qu’il
avait au moment de l’échange, sans recharge gratuite.

La recharge personnelle conserve une échéance en ticks actifs : une reprise
immédiate attend encore son délai, une reprise après quelques ticks attend le
reste, et une recharge déjà achevée ne repart pas du début. Le temps en pause
ne l’écoule pas. Un tir ramassé refusé par le noyau protégé du Champion garde
le message de refus et ne produit aucun faux marqueur d’impact.

Les trois profils Happy Wheels à déplacement, buff et garde reçoivent une
voie de charge adaptée : leur déplacement principal rapporte 20 points si
une menace est à trois unités maximum, si le trajet réel fait au moins une
unité et si la distance à la menace la plus proche augmente d’au moins une
unité. Cinq esquives réussies permettent l’ultime depuis zéro. Une action à
vide, un déplacement bloqué, un rapprochement ou une pause ne rapporte rien.
Les autres kits conservent leur voie de charge. Le briefing FR/EN et l’export
`ultimateCharge.rule` expliquent ce fonctionnement.

Une variante facultative de terrain accompagne chacun des quatre modes. Les
objectifs sont annoncés avant le départ et suivis dans le HUD. Une directive
incomplète ne produit aucune victoire. Les réglages de récompense, la réception
unique de run, les sauvegardes, la possession et les progressions DLC restent sur
leurs chemins existants.

## Couverture des profils

`getExtinctionFighterProfile(hero)` dans `src/game/extinctionFighterProfiles.js`
expose des données sérialisables, utilisées par la scène et le classeur du PR.

| État du catalogue | Nombre | Portée réelle |
| --- | ---: | --- |
| Personnages, Ancre comprise | 1 912 | Inventaire source actuel |
| Combattants admissibles | 1 811 | Possession toujours exigée par le sélecteur |
| Personnages hors combat | 101 | Aucun protocole FPS attribué |
| Kits Nexus spécifiques conservés | 12 | Les 48 actions de `getExtinctionSignature` gardent la priorité |
| Autres profils adaptés | 1 799 | Adaptation déterministe des noms et types source |
| Profils comportant une source générique | 1 633 | Mécanique partagée jouable ; recherche et chorégraphie personnelles ouvertes |
| Autres profils à types source nommés | 166 | Adaptation de jeu ; aucune validation canonique ou artistique déduite |
| Actions source raccordées | 7 244 | Quatre actions par combattant |
| Vues personnelles liées à leur propriétaire | 3 | Mirelle, Arthur et Serj ; planches partielles existantes |

Le profil garde l’incarnation, les références déclarées, les équipements, le type
de ressource, la description visuelle source et leur provenance. Il ne déduit
aucune anatomie à partir d’un nom. Une morphologie absente reste à documenter.
L’ancien pack de Bucket Guitar Echo n’est pas réaffecté à Buckethead Persona.

Le champ d’action `reach` distingue déplacement, portée visée, contact, rayon,
effet personnel et déploiement. Le même getter fournit les distances au runtime,
au briefing et à l’export : dash 2,4, téléportation 3, soutien 8, mine posée à
2 avec un rayon d’effet de 2,5. Les objets des kits Nexus gardent leur ancien
champ brut `range` ; `reach` expose leur distance effective sans les réécrire.
Une tenue non liée ou une arme ramassée ne réutilise pas des mains d’un autre kit.

Les nouveaux schémas sont des glyphes de fonctionnement, sans mains humaines
inventées pour les créatures. Une frappe utilise un arc ; un effet non balistique,
un repère abstrait ; les armes ramassées conservent leur schéma distinct. Le mouvement
de frappe d’Arthur utilise la rangée d’attaque déjà déclarée, sans faux flash de tir.
**Aucune nouvelle planche personnelle, tenue ou animation fidèle n’est produite par
ce lot.** La présence et le découpage d’une planche ne certifient pas son art.

## Adaptations exécutables

- Les types source explicites produisent contact, balayage, tir instantané,
  dispersion, rayon, projectile à collision balayée, cône, zone, mine ou effet ciblé.
- Les contrôles et distractions appliquent un ralentissement temporaire au bon
  propriétaire de run. Ils chargent l’ultime seulement lorsqu’une cible est atteinte.
- Les soutiens soignent/protègent le joueur dans la simulation solo. Les invocations
  partagées utilisent une balise stationnaire, une portée et une durée bornées,
  puis le même calcul central de dégâts que les autres attaques. Elles ne prétendent
  pas dessiner ou reproduire un allié canonique.
- Les défenses génériques adaptent l’esquive ou le camouflage en fenêtre de
  réduction de dégâts ; elles ne créent pas un système d’invisibilité spécifique.
- Les primaires balistiques adaptées consomment le stock existant. Les autres
  primaires adaptées utilisent leur récupération et n’introduisent pas de chargeur
  balistique. Les ressources des douze kits déjà écrits restent inchangées.
- Un futur type source inconnu reste explicitement non pris en charge. Il n’est
  pas transformé silencieusement en arme générique ou en action sans effet.

Les portées, dégâts et délais sont des réglages de la simulation A.R.C.A. ; ce ne
sont pas des mesures issues des œuvres d’origine. Les profils dont le type source
est générique restent à revoir malgré leur exécution technique.

## Quatre modes

| Mode | Variante facultative | Effet et condition |
| --- | --- | --- |
| Solo Extraction | Relais sous pression, existant | Trois secondes actives dans le périmètre, puis E ; guidage des balises au radar ajouté. Les variantes de contestation et Retour des témoins restent compatibles. |
| Dernier Signal | Décryptage | Un terminal par vague, E puis deux secondes actives sans menace dans un rayon de 2,5 unités, puis E. Les quatre confirmations sont requises pour atteindre le Champion et la victoire reste liée au combat réel. |
| Infestation | Confinement | Trois évents s’ouvrent à 10, 25 et 40 secondes. E, deux secondes de maintien hors périmètre ennemi, puis E. Un évent scellé réduit à 65 % la vitesse des menaces à moins de quatre unités. Extraction après 60 secondes **et** trois scellements. |
| Chasse au Champion | Marquage | Viser le Champion à moins de douze unités puis T ouvre quatre secondes actives de vulnérabilité. L’expiration exige un nouveau marquage ; les drones protecteurs gardent leur priorité et leur bouclier. |

Les nouvelles directives sont locales à une run et sont désactivées par défaut.
Elles ne tirent aucun nombre aléatoire. Le radar place désormais les menaces et les
objectifs dans la même orientation : le haut correspond à la direction du regard.
Les objectifs distants restent indiqués au bord du radar.

## Cycle de vie et preuve

Les entrées clavier et boutons utilisent le même chemin de simulation. Les menus,
la pause, la perte de focus et la fin conservent les gardes existantes. La progression
des directives se fait au pas fixe, au plus une unité par appel sur un tick nouveau ;
un saut de temps ne produit pas de crédit rétroactif. La sortie du périmètre suspend
le maintien. Un run ID, un héros ou un mode étranger ne progresse pas la directive.
Fin, abandon et récupération nettoient les effets locaux et le kit temporairement
rangé. Le résultat reste reçu par le mécanisme unique existant.

Vérifications locales effectuées avec Node 22.23.4 :

- `extinctionFighterProfiles.test.mjs` et `extinctionFieldDirectives.test.mjs` :
  **30 tests**, dont l’exécution des 7 244 actions avec constat d’un effet de jeu,
  les refus de portée/propriétaire/pause, les vrais retours de kit et le callback
  `finishRun` extrait du composant courant.
  Les cinq régressions de relecture utilisent également le vrai tir ramassé,
  la chaîne recharge/ramassage/temps/reprise et cinq esquives utiles depuis
  zéro charge pour chacun des trois profils de mobilité.
  Trois autres tests confrontent les portées déclarées aux déplacements,
  soutiens et mines réellement exécutés.
- **76 contrats existants** de kits, sources, vues, relais et Retour des témoins.
- **47 régressions existantes** de temps, pause, commandes de scène et personnages
  hors combat. Les tests qui extraient le composant reçoivent les vrais nouveaux
  helpers, sans recopier sa simulation.
- Oxlint ciblé : zéro avertissement ; recette Python compilée syntaxiquement.

Ces preuves locales ne constituent pas une recette graphique complète. Chromium
local reste bloqué dans l’environnement ; aucune tentative de contournement n’est
effectuée. La recette native est fournie à la CI :

```sh
python scripts/browserExtinctionRosterDirectives.py \
  --url http://127.0.0.1:4173 --require-art \
  --evidence /tmp/extinction-roster-directives --replays 2
```

Elle utilise la fixture `scripts/fixtures/city-extinction.html?catalog=full` :
huit profils représentatifs en français/anglais, à 1280×900 ou 390×844, puis deux
parcours de chacune des quatre variantes dans des contextes frais, soit **16 cas**.
Les images personnelles doivent être réellement décodées et dessinées avec leur
rapport de forme. Les runs utilisent des entrées natives, des graines sémantiques
fixées avant START et une horloge virtuelle. Elles ne réécrivent ni les positions,
ni les PV, ni les ennemis, ni les objectifs. Les traces et captures sont conservées,
y compris en cas d’échec ; les deux digests de chaque mode doivent correspondre.
Les résultats effectifs de CI sont à joindre au PR sur sa révision finale.

## Export du classeur

```sh
node --no-warnings --loader ./scripts/sourceSceneTestLoader.mjs \
  scripts/extinctionFighterCatalog.mjs \
  --source-commit <revision-source-complete> --out <catalogue.json>
```

Le JSON conserve séparément `reviewStatus`, `kitStatus`, `view.artStatus`,
`source.morphologyStatus`, les ressources et la provenance de chaque action. La
description destinée au joueur reste concentrée sur ses choix et commandes ; les
besoins de production détaillés restent dans ce dossier et le classeur.

Restent ouverts : validation artistique et animations individuelles, traitement
spécifique des 1 633 profils à sources génériques, équilibrage par personnage et
mode, équipements complets par incarnation, contrôles sur appareils physiques et
mesures de performance représentatives. Ce lot ne revendique aucun gain de FPS
d’affichage ni des milliers de kits visuels personnalisés.

## Suite : portage d’une arme de terrain

Le complément [Kit personnel et arme de terrain portée](FIELD_EQUIPMENT_2026-11-08.md)
précise l’aller-retour V/B, les stocks et recharges séparés, le remplacement annoncé
du ramassage précédent et le nettoyage local. Il étend les cas de ramassage natifs
existants sans modifier les graines ni les seuils des huit parcours de victoire.
Il ne ferme pas les besoins de validation artistique, d’incarnation ou d’équilibrage
individuel indiqués ci-dessus.
