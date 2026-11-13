# Répertoire des missions — parcours repris

Le répertoire d’une route, distinct de la bibliothèque des actes OC déjà remaniée, utilise maintenant un composant dédié. Le cadre A.R.C.A. et les illustrations de mission existantes sont conservés. Les transmissions longues s’ouvrent au clavier ; menace, récompenses, état et commandes restent directement accessibles. Aucun média n’est créé et aucune certification AAA ou fidélité artistique 1:1 n’est déduite de cette refonte.

Deux défauts sont reproduits avant modification dans le vrai Hub : les textes de mission restent à **10 px**, même avec le facteur de lecture à 150 % ou 200 %, et les raisons de blocage sont présentes uniquement dans le `title` d’un bouton désactivé. [Huit captures avant](./before/report.json) et le [contrat de source](./before-source-contract.json) les documentent. Le bundle préexistant correspond exactement au Hub `b9e616b` ; la fonction MissionDirectory y possède le même SHA que la source au début de ce chantier. Ce bundle n’est pas présenté comme le reste du Hub courant.

Le corps de transmission atteint désormais **15 / 22,5 / 30 px** à 100 / 150 / 200 %. Les raisons exactes fournies par le résolveur de déploiement sont affichées dans chaque dossier bloqué, avec un lien `aria-describedby`. Les contrôles mesurent au moins 44 px de haut ; leurs libellés se replient. Recherche sans accents, noms français/anglais, univers, menace, mode et numéro fonctionnent sur toute la source avant pagination. Les routes longues affichent douze missions par page, dans l’ordre initial ; le changement de page annonce la plage et rend son focus visible.

L’extraction du Hub se limite à l’import du composant, la suppression de l’ancienne fonction et deux props transportant les aides de présentation existantes. En rétablissant ces trois modifications, le fichier complet reproduit exactement les octets du Hub de référence : [extraction-contract.json](./extraction-contract.json). Les callbacks de briefing et de lancement, les prérequis, les IDs, le calcul des récompenses et les sauvegardes ne sont pas réécrits. Un briefing verrouillé reste consultable ; son déploiement reste interdit.

## Vérifications exécutées

| Contrôle | Résultat borné |
|---|---|
| Projection pure | [6/6 tests](./unit-tests.tap) : source complète avant pagination, recherche bilingue sans accents, ordre et identité des objets, états/compteurs, achèvement conservé malgré verrouillage, messages réels et cas vides. |
| Vrai Hub en Chromium | [10/10 cas](./after/report.json) : français/anglais, desktop 1440×1000 et mobile 390×844 à 100/150/200 %, puis deux parcours de pagination sur la route réelle de 60 missions. |
| Actions | Dans les huit parcours principaux, ouverture au clavier du briefing verrouillé `47003`, déploiement désactivé, retour aux missions, recherche/réinitialisation, transmission ouverte/fermée par Entrée, puis callback ordinaire de lancement de `47001`. Le modèle parent, les ressources, la cellule et les complétions restent identiques. |
| Pagination réelle | Douze IDs initiaux, douze IDs distincts en page 2, retour exact aux douze premiers. Aucun lancement, changement de progression ou modification du modèle parent. |
| Texte et focus | Tailles calculées 15/22,5/30 px, absence de débordement horizontal, focus de réinitialisation/page visible en cinq points à l’intérieur du contrôle. |
| Erreurs navigateur | Aucune erreur JavaScript ni réponse HTTP en échec dans les huit parcours principaux. Les deux parcours supplémentaires contrôlent les erreurs JavaScript et la pagination. |
| Compilation | Un seul bundle de fixture du vrai Hub, réutilisé après les corrections décrites ci-dessous. Dernière compilation Vite directe réussie, sortie sous `/tmp`, sans copie de `public/`, prébuild ou export média. |
| Lint | Zéro erreur ; un avertissement Fast Refresh concerne seulement le point d’entrée de fixture. Aucun changement de package ou de dépendance. |

Le premier contrôle à 200 % a révélé un libellé de sélection coupé : il a été raccourci sans changer la valeur du filtre. Le retour de focus au centre pouvait également passer sous l’en-tête agrandi ; il utilise maintenant le bas de la zone visible. La revue visuelle a ensuite montré que le badge fixe « Directive » pouvait recouvrir le bord gauche d’un champ : une marge locale de défilement de 64 px garde ce champ au-dessus du badge. Le premier passage fonctionnel à dix cas est conservé dans `intermediate/browser-before-scroll-margin.json`, avec l’image montrant cette limite ; le passage final contrôle les bords et le centre du focus. Les recompilations du même bundle répondent à ces défauts réels ; elles ne constituent pas trois éditions ou trois builds de production.

Les captures finales du composant se trouvent dans [after](./after/). À 200 %, le cadre global du Hub occupe toujours une grande partie du haut de l’écran ; ce chantier vérifie l’accès par défilement aux contrôles du répertoire. Il ne certifie pas l’ensemble du Hub à cette taille. Le réglage stocké du jeu s’arrête à 150 % ; 200 % est un stress de lecture explicite appliqué au même facteur CSS. Les polices Google sont bloquées dans la fixture : le navigateur utilise la police de repli. Aucun contrôle matériel de manette n’est revendiqué.

L’état parent est préparé avant montage. La fixture utilise les vrais catalogues et la vraie transformation de profil DLC complet ; le callback externe de lancement est enregistré, sans monter de combat. Elle n’exécute ni campagne complète, ni victoire, ni écriture réelle de sauvegarde. Le `missionSeed` initial du Hub reste celui de son horloge : les aperçus de récompenses peuvent donc différer entre captures selon le modificateur existant. Leur formule est inchangée, comme le prouve la reconstruction exacte du fichier Hub ; une égalité numérique entre deux images n’est pas revendiquée.

## Reproduction

```sh
node --test scripts/missionDirectoryView.test.mjs
node --max-old-space-size=4096 scripts/buildMissionDirectoryFixture.mjs
python scripts/serveSourceSceneArtFixture.py --port 4196 --build-dir /tmp/multiverse-mission-directory
python scripts/browserMissionDirectory.py --base-url http://127.0.0.1:4196 --out /tmp/mission-directory-browser
```

Les commandes de compilation ont été exécutées avec Node 22 sur CPU 2–3. Les sources du composant, du helper et de la fixture sont épinglées dans le rapport de compilation puis comparées après le parcours navigateur. Les fichiers CG, les acteurs et leurs compteurs P0/P1/P2 ne font pas partie de ce lot.
