# Annulation et reprise des commandes de mêlée — 29 octobre 2026

## Objectif et point de départ

Ce lot poursuit la [PR nº 15](https://github.com/darknigthmare/multiverse-breach/pull/15)
à partir de `eac87718f0e3f951f19197370d5f5ba9d31bbd89`.
Il applique les contrats du [guide du projet](GAMEDEV_GUIDE.md) et du guide
amont `input-systems`, à la révision épinglée
`19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9`.

Le joueur doit pouvoir interrompre une commande sans déclencher une attaque.
La disparition d'une source ne doit pas effacer une commande encore maintenue
par une autre source. Après une pause ou une perte de focus, une nouvelle
pression doit être utilisable dès la première image de reprise.

## Régressions reproduites avant correction

| Situation | Comportement précédent | Comportement attendu |
| --- | --- | --- |
| Manette retirée ou API indisponible pendant une charge | Le front de relâchement lançait le coup chargé. | Annuler la charge si aucune autre source ne la maintient. |
| Dernier contact de charge annulé par le navigateur | `cancel` suivait le même chemin que `up` et lançait le coup. | Annuler uniquement la charge appartenant au contact supprimé. |
| Touche maintenue après nettoyage des commandes | La répétition pouvait recréer une charge ; le relâchement lançait ensuite le coup. | Attendre une nouvelle pression physique. |
| Nouvel appui avant la première image suivant le nettoyage | Le verrou commun attendait un état neutre de toutes les commandes et bloquait aussi l'appui neuf. | Accepter immédiatement le clavier et le tactile ; attendre le repos seulement pour la manette concernée. |

## Contrats appliqués

La composition des commandes conserve la provenance nécessaire pour distinguer
un relâchement volontaire d'une interruption. Une annulation de charge efface
seulement l'état de charge ; elle ne réinitialise pas le bouclier, les autres
commandes ou les actions déjà engagées.

Chaque joueur possède son suivi de manette. Les emplacements du tableau natif
restent associés aux mêmes joueurs. Une manette perdue, remplacée ou nettoyée
doit repasser au repos avant de produire une nouvelle commande. Le premier
branchement d'une session conserve le comportement existant. Le signal natif
de déconnexion complète l'observation des lectures de l'API.

Une annulation tactile ne compte que si la source possédait encore la commande.
Un `lostpointercapture` tardif après un relâchement ne doit ni rejouer le coup ni
annuler le contact suivant. Les autres doigts et les commandes clavier ou
manette encore maintenues conservent leur action.

Le filtre des répétitions concerne le mode Smash. Les contrats existants des
autres modes et les affectations enregistrées restent utilisés.

L'ordre de deux propriétaires tactiles reste pris en compte, même entre deux
images : annuler A puis relâcher volontairement B produit un coup ; relâcher A
puis annuler B n'en produit aucun. Si une interruption et le relâchement d'un
autre type de périphérique arrivent entre les mêmes lectures sans état
intermédiaire observable, l'annulation est prioritaire. L'ordre physique d'un
événement tactile et d'un état de manette échantillonné ne peut pas être reconstruit.

## Vérification

Les vérifications locales suivantes ont réussi sur Node 24.22.1 et Chromium
153.0.8010.0. Le lancement initial du lot navigateur avait un nom de variable
incorrect pour le chemin de Chromium et s'arrêtait avant les scénarios ; le
chemin a été corrigé, puis les six fixtures ont réussi.

| Vérification | Résultat |
| --- | --- |
| Annulations et coexistence des sources | 30/30 nouveaux cas ; vrais callbacks, lecteur, dispatcher, méthodes du moteur et runtime des acteurs. |
| Répétitions et reprise clavier | 11/11 nouveaux cas ; vrais gestionnaires et dispatcher, registre effacé préparé par la fixture. |
| `npm run test:gamedev` | Réussite des 16 fichiers de tests ; ce rapporteur local présente les fichiers, pas le détail de chaque cas. |
| `npm run test:melee` | Réussite des 11 fichiers de tests, dont les règles du runtime, les objectifs et la fixture utilisant `EngineSmash`. |
| Six fixtures compilées ensemble | 55 modules ; affichage, stockage, boutons, audio, sauvegardes et manettes réussis. |
| Scénarios navigateur concernés | 24 commandes, 17 accès manette/cycle des entrées, 7 audio et 3 sauvegardes ; aucune erreur de page. |
| Compilation directe de l'application | 316 modules ; Vite seul, sans `prebuild` ni copie de la bibliothèque de médias. |
| Contrôles statiques | Oxlint ciblé sur 13 fichiers JS/MJS/JSX ; intégrité des 23 fichiers amont. |

Les suites se recoupent : leurs nombres ne doivent pas être additionnés.
Le build de production complet et les autres workflows sont exécutés par
GitHub Actions sur le commit publié ; leurs statuts et artefacts sont liés
dans la PR. La compilation directe locale ne remplace pas cette validation.

### Comparaisons avec le code de départ

Les mêmes 17 scénarios navigateur donnent **9 réussites et 8 échecs** avec
le lecteur, le dispatcher et les méthodes du moteur de `eac87718`, puis
**17 réussites** avec les corrections. Les échecs sont des assertions de
comportement, sans erreur de page.

La nouvelle suite clavier donnait **2 réussites et 9 échecs**, puis **11/11**.
Les 26 premiers cas de la suite d'annulation donnaient **10 réussites et
16 échecs** avant les modifications de production. Quatre cas ont été ajoutés
pendant la revue, notamment la déconnexion entre deux lectures et le dernier
propriétaire tactile ; la suite finale passe **30/30**.

La relecture indépendante a rejoué les 41 nouveaux cas et les trois ordres
tactiles : annulation A puis relâchement B, relâchement A puis annulation B,
annulation des deux. Le test du premier ordre avait reproduit l'annulation
incorrecte du coup avant l'ajustement final.

### Portée

Les tests de navigateur utilisent le vrai gestionnaire de bouton, les chemins
d'entrée extraits de `GameCanvas` et les méthodes de charge/bouclier du moteur.
Les données de manette et les événements de déconnexion sont contrôlés par la
fixture. Ils ne constituent pas un essai avec un périphérique physique ni un
combat complet. Les tests existants de refus natif de l'API par
`Permissions-Policy` restent distincts de ces simulations.
