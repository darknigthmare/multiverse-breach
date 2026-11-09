# Application des guides — audio et démarrage des sauvegardes

## Point de départ et critères joueur

Cette continuation part de `3b0d6fe1190b79b05988c61f962fdb48f9af77ee`,
sur la PR #15. Elle applique les guides épinglés
[audio-design](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/audio-design/SKILL.md)
et [save-systems](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/19d93f97c9c1ea0f8b306e77aa81e0d3e352d3e9/skills/disciplines/save-systems/SKILL.md)
au moteur Web Audio et aux fonctions de persistance existants. Aucun installateur
amont n'est exécuté et aucune dépendance n'est ajoutée.

Critères annoncés avant les modifications :

- Une musique explicitement arrêtée ne revient ni au prochain effet sonore, ni
  au premier déverrouillage audio, ni après une séquence sourdine/reprise.
- La sourdine ordinaire conserve l'intention musicale ; si la scène change
  pendant la sourdine, la reprise joue la dernière scène demandée.
- Une progression écrite par une autre fenêtre après le chargement initial reste
  intacte. Le garde compare le stockage aux octets effectivement chargés.
- Une lecture initiale échouée ne transforme jamais les valeurs par défaut en
  remplacement automatique d'une sauvegarde existante. Le rechargement ou
  l'import explicite doit permettre de récupérer une session utilisable.

## Audio : distinguer arrêt explicite et interruption temporaire

`stopBgm()` arrêtait les sources suivies et l'intervalle, mais conservait
`bgmRequest`, `bgmTheme` et `currentMusicPlan`. `playSfx()` appelle
`unlockFromGesture()` ; celui-ci pouvait alors réactiver la demande conservée.
Les appels de fin de scène et de nettoyage utilisaient pourtant cet arrêt public.

La correction annule les trois références dans `stopBgm()`. Le nettoyage interne
`stopBgmPlayback()` conserve l'intention et sert aux deux interruptions
temporaires : mise en sourdine et remplacement d'un plan musical. Les effets
sonores, les volumes séparés et les compositions restent dans leurs interfaces
existantes.

| Parcours | Source initiale | Source corrigée |
| --- | --- | --- |
| Musique active → arrêt → effet sonore | Ancienne scène relancée | Effet sonore sans reprise musicale |
| Demande avant interaction → arrêt → premier geste | Ancienne scène démarrée | Demande annulée, aucun ordonnanceur musical |
| Musique active → arrêt → sourdine/reprise | Ancienne scène relancée | Musique toujours arrêtée |
| Musique active → sourdine/reprise | Scène conservée | Comportement conservé |
| Scène B demandée pendant la sourdine de A | B doit reprendre | B reprend ; A ne revient pas |

Les douze tests de `audioLifecycle.test.mjs` exécutent le vrai moteur, avec les
API Web Audio et les intervalles remplacés pour contrôler leur cycle de vie.
Ils couvrent aussi la libération des anciennes sources, la déconnexion du bus
musical remplacé, l'absence de double intervalle et le maintien du bus SFX.
La même suite donne **7 réussites et 5 échecs avant**, puis **12 réussites après**.

La fixture navigateur utilise le vrai singleton, ses nœuds Web Audio, ses
intervalles et le composant `AudioControl`. Le scénario de demande annulée avant
le premier geste échoue sur la source initiale : l'ordonnanceur et les sources
de l'ancienne scène réapparaissent. Les **sept parcours passent après correction**
dans Chromium 153.0.8010.0, avec un contexte neuf par parcours et aucune erreur
de page. Il s'agit de preuves de demandes, de sources suivies et de programmation
audio, sans écoute critique, mesure de niveau ni validation du mixage.

## Sauvegarde : rattacher le garde au chargement réel

L'application chargeait sa progression, puis `createLocalSaveGuard(storage, key)`
lisait une seconde fois le stockage pour créer sa référence. Une autre fenêtre
pouvait écrire entre les deux lectures. Le garde adoptait alors les nouveaux
octets, alors que la progression en mémoire provenait encore des anciens.

Deux cas destructifs ont été reproduits avec les fonctions réelles d'`App` :

| Entrelacement contrôlé | Avant | Après |
| --- | --- | --- |
| Chargement de 100 pièces ; autre fenêtre écrit 250 avant le garde | Écriture acceptée : 250 devient 100 | `save-conflict` ; les octets de 250 restent intacts |
| Première lecture échouée ; accès rétabli avant le garde ; disque à 250 | Valeurs par défaut écrites : 250 devient 0 | `persistence-failed` ; les octets de 250 restent intacts |
| Emplacement vide chargé ; autre fenêtre crée une sauvegarde | Nouvelle sauvegarde écrasée | Création détectée et conservée |
| Sauvegarde chargée ; autre fenêtre la supprime | Ancienne progression recréée | Suppression détectée et conservée |

`createLocalSaveGuard` accepte désormais une référence initiale facultative.
`App` lui passe `initialLoad.raw`, y compris `null` pour une lecture réussie d'un
emplacement vide. Les appels existants à deux arguments continuent de lire le
stockage lors de leur création. Le garde d'`App` bloque aussi l'état initial
`persistence-failed`, en plus des quarantaines déjà prévues pour une sauvegarde
invalide ou un échec de sauvegarde de secours.

Les deux lignes d'intégration dans `App` préservent les chemins de récupération :
rechargement explicite, import avec sauvegarde préalable, réinitialisation et
nouvelle trace. L'import et la réinitialisation utilisent le `rebase()` existant
après la décision explicite ; aucune résolution silencieuse d'un conflit n'est
ajoutée. Les schémas, identifiants et migrations du jeu ne changent pas.

Les douze tests de `localSaveInitialization.test.mjs` extraient les véritables
fonctions de chargement, d'initialisation, de persistance, d'import et de
réinitialisation d'`App`. Seuls le suivi React, la navigation et la normalisation
du catalogue sont remplacés. Ils passent de **5 réussites et 7 échecs avant** à
**12 réussites après**. Le contrôle de migration utilise une normalisation de
test ; il prouve la conservation des octets et de leur sauvegarde de secours,
sans revendiquer une validation de toutes les migrations du catalogue.

La fixture Vite extrait ces mêmes fonctions à la compilation, avec des bornes
qui font échouer le build si leur emplacement change. Deux pages de même origine
partagent le véritable `localStorage` de Chromium. La pause entre chargement et
initialisation est contrôlée ; le scénario d'erreur remplace `getItem` pour une
seule lecture, puis restaure immédiatement la méthode native.

Sur les trois scénarios navigateur, la source initiale réussit seulement le
chargement stable ; les deux écrasements sont reproduits. La source corrigée
réussit les **trois scénarios**, sans erreur de page :

- Progression stable de 100 à 125 et rechargement conservant 125.
- Deuxième page à 250 protégée contre les écritures périmées répétées ; import
  explicite de 900 avec sauvegarde exacte des octets de 250.
- Lecture initiale échouée et valeurs par défaut bloquées ; rechargement de 250,
  puis progression normale jusqu'à 275.

Le garde reste un contrôle optimiste synchrone. Cette correction ferme l'écart
entre chargement et initialisation ; elle ne rend pas atomiques deux opérations
de comparaison/écriture réellement simultanées entre processus. La fixture ne
monte pas l'App complète et n'accède à aucun compte ni service de sauvegarde.

## Vérifications et intégration continue

Le workflow `Gamedev display browser` compile désormais cinq fixtures. Les trois
fixtures préexistantes ont été rejouées après les changements : affichage et
préférences de mouvement, stockage normal/refusé, puis les dix-huit parcours de
commandes. Elles passent sans erreur de page, comme les deux nouvelles fixtures.

`npm run test:gamedev` inclut les 24 nouvelles régressions. Le cycle audio rejoint
aussi `test:polish`, et l'initialisation des sauvegardes rejoint
`test:audit-reliability` ; ces deux commandes font déjà partie du `prebuild`.
Les journaux des cinq fixtures sont conservés dans l'artefact du workflow.

Commandes principales :

```sh
npm run test:gamedev
npm run build:gamedev:fixture
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:audio-browser
PLAYWRIGHT_FIXTURE_DIR=.tmp/gamedev-display npm run test:gamedev:save-browser
node --test scripts/audioPreferences.test.mjs scripts/soundEngineGesture.test.mjs scripts/audioStorageFallback.test.mjs scripts/audioLifecycle.test.mjs
node --test scripts/localSaveGuard.test.mjs scripts/localSaveInitialization.test.mjs scripts/auditSaveCalendar.test.mjs scripts/auditApplicationIntegration.test.mjs scripts/cloudReconciliationRace.test.mjs
node scripts/checkGamedevGuidance.mjs
```

La compilation locale directe avec `node node_modules/vite/bin/vite.js build`
vérifie les modules de l'application. Le checkout local ne contient pas toute
la médiathèque ; le `npm run build` complet et ses audits d'assets doivent être
lus dans les validations GitHub du commit publié. La description de la PR donne
les résultats et liens correspondant à sa dernière révision.
