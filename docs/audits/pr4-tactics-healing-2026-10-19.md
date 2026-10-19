# PR 4 — Healing Wind tactique et cohérence du ciblage de soutien

Base exacte : `de00b8806f76b996f034f057afcb4642617bd05a`.
888 fichiers du snapshot local contrôlés contre leurs blobs Git ; lockfile
identique à celui des dépendances de test. Les bitmaps ne sont pas tous présents
localement. Les actifs du dépôt sont préservés par le patch.

## Défauts reproduits avant correction

Quatre tests échouent sur la base : sur chaque camp, Aerith a encore une spéciale
`origin_aoe` offensive dans Tactics et ne peut pas confirmer un soin sur ses alliés.
Le profil source `aerith_ff7` existe déjà pour RPG/Smash et Fighter : il ne faut pas
inventer une nouvelle attaque ou compter cette adaptation comme une nouvelle
signature du registre.

Deux autres tests reproduisent un défaut du soutien tactique ordinaire : après
sélection d'une compétence de soin, un allié nouvellement blessé apparaît dans
le panneau actualisé mais reste refusé au clic (`out-of-range`) à cause de
l'ancien cache des cases. La géométrie de soutien est maintenant recalculée lors
de la confirmation, avant toute dépense. Le comportement des attaques offensives
et le ciblage au sol des compétences de zone ordinaires sont conservés.

## Intégration

- Association exacte Aerith / Final Fantasy VII / capacité source existante.
  Les identités inconnues, variantes et profils tactiques personnalisés ne sont
  pas réécrits. La préparation ne modifie que les acteurs locaux au combat.
- Healing Wind soigne les alliés vivants admissibles, jusqu'à 50 % de leurs PV
  maximum, plafonné aux PV réellement récupérables. Portée : cinq cases Manhattan,
  ligne de vue obligatoire, les unités ne bloquent pas le soin mais les murs oui.
  Ces distances sont une adaptation de Multiverse Breach, pas une règle 1:1 FFVII.
- Aucun dégât ennemi, soin d'un mort, résurrection, purification, bonus de stats,
  score offensif ou nouvelle capacité d'invocation.
- La confirmation utilise un allié admissible : ni cible ennemie, ni case vide,
  ni ancienne cible déjà guérie devenue un prétexte pour soigner quelqu'un d'autre.
- Une seule dépense des 100 points de spéciale et une seule fin de tour ; la
  sélection, l'annulation, la pause et les confirmations refusées restent gratuites.
- Le chemin IA natif utilise les engagements différés existants : action,
  puissance, identité et générations de vie sont revalidées avant application.
  Une interruption ne substitue ni une nouvelle technique ni une nouvelle vie.
- Le panneau et le codex FR/EN affichent la portée, le soin de groupe et ses
  limites. Le feedback sonore est un soin. Les nombres affichés sont arrondis
  comme en Fighter, sans arrondir différemment les PV mécaniques.

## Validation locale terminée

- 54/54 nouveaux tests `scripts/reauditTacticsHealing.test.mjs`.
- 321/321 `npm run test:reaudit`.
- 940/940 groupe `scripts/signature*.test.mjs`.
- 116/116 `npm run test:audit-tactics`.
- Lint ciblé : aucune erreur, aucun avertissement.
- Compilation Vite des sources et compilation syntaxique du scénario Python : réussies.

Ces suites se recouvrent ; leurs résultats ne sont pas un nombre de cas unique
à additionner. Aucun test ignoré ni annulé dans ces commandes terminées.
La sélection de régressions élargie initiale a atteint sa limite d'exécution
locale ; elle n'est pas annoncée comme terminée. Les groupes ci-dessus ont
ensuite été exécutés séparément jusqu'à leur résultat final.

## Recettes navigateur ajoutées à la CI permanente

Quatre recettes emploient le vrai GameCanvas et EngineTactics, la vraie Aerith du
catalogue et les commandes de sélection/confirmation natives. État initial
synthétique, P1/P2, 1280/390 px, FR/EN : équipe pleine, mur, soins de groupe,
pause, double clic, radiations et allié mort, stockage inchangé et démontage sans
récompense. Le script observe les erreurs de rendu, conserve la première erreur
même si la capture échoue, et n'autorise que les adresses loopback.

Le Chromium local refuse les navigations (`ERR_BLOCKED_BY_ADMINISTRATOR`). Aucun
succès de parcours navigateur local n'est revendiqué. Les résultats GitHub du
commit publié font foi ; le workflow intégral `npm run build` est conservé.

## Limites

Pas de nouveau moveset ou bitmap, ni chorégraphie certifiée, nouvelle signature,
portage exhaustif de tous les supers ou campagne jouée de bout en bout. Le soin
Tactics est un effet natif de soutien, pas une nouvelle cinématique RPG. Les
transformations, Gestalt, autres boss, tutoriel, Cité et comptes réels restent
ouverts. Le classeur original inaccessible n'est pas prétendu intégré.
Aucune fusion dans master, promotion en production ou modification de compte,
secret, base de données, abonnement ou protection de branche n'est effectuée.
