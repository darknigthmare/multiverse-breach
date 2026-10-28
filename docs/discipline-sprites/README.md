# Sprites et tenues Discipline

## Livraison

**160 PNG individuels pour 30 personnages**, dont les 154 versions précédentes conservées, 5 nouvelles tenues OVA et une correction ciblée de Takurou. Images entières, fond transparent réel, pose statique en trois quarts vers la droite. Les 17 anciens portraits recadrés sont exclus.

44 sprites sont basés sur des références de personnages et costumes. 116 sont des adaptations identifiées. Aucun rendu n’est certifié 1:1 : les références partielles imposaient de reconstituer les parties hors cadre.

## Examiner les images

Depuis le serveur du jeu : /reviews/discipline/index.html. La galerie filtre par personnage, tenue et provenance et permet de changer le fond de contrôle. Les PNG restent consultables individuellement dans public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/.

## Tenues de l’animé et proportions visibles — v3

Les **6 ajouts v3** comprennent les tenues tactiques OVA de Saori, Ruri, Yuuki, Maiko et Madoka, ainsi qu’une correction ciblée du visage et du cou de Takurou en tenue orange. Les **154 entrées et PNG précédents sont conservés à l’identique**.

Les cinq costumes tactiques sont de nouvelles tenues issues des captures OVA. Ils ne remplacent pas les variantes JGSDF et ne portent aucun `variantOf` vers celles-ci. Les sprites JGSDF servent uniquement de référence de technique graphique. Takurou reste une correction de sa tenue OVA orange précédente.

Le filtre **« Tenues de l’animé »** affiche les six ajouts et l’ancienne tenue orange de Takurou, déjà identifiée OVA, sans modifier son entrée. Les filtres **« Nouvelles tenues »** et **« Versions corrigées »** distinguent les deux types d’ajouts. Les nouvelles cartes donnent leurs notes de proportions et de limites. Voir [la revue OVA v3](anime-v3-review.md).

Les proportions suivies sont celles effectivement visibles dans les sources. Pour Maiko accroupie, la station debout, le bas du pantalon et les chaussures restent reconstitués. Les captures ne certifient pas les pieds, les tailles relatives complètes ou toutes les longueurs cachées. Les références de robes et de tenues d’officières restent sans attribution nominative fiable ; aucun sprite supplémentaire ne leur est attribué.

## Variantes de fidélité v2

Les **22 nouvelles variantes** sont ajoutées séparément. Les **132 PNG précédents**, leurs identifiants, leurs sélections et leurs tenues par défaut restent inchangés. La galerie propose un filtre « Versions corrigées » et une comparaison côte à côte avec l'ancienne image.

La correction porte principalement sur les coiffures et les visages. Les vêtements créés pour le jeu restent des adaptations, avec le libellé « identité v2 ». Les détails hors champ restent reconstitués ; aucune fidélité intégrale 1:1 n'est certifiée. Voir le [détail des corrections et limites](reference-v2-review.md).

En cas d'échec d'une variante corrigée : nouvelle variante → ancienne tenue correspondante → tenue par défaut du personnage → ancien sprite. L'ancienne sélection sauvegardée demeure valable.

## Couverture

R = modèle basé sur référence ; A = adaptation créée pour ce projet ; R + A = les deux provenances sont disponibles ; — = en attente. Une lettre ne certifie pas une fidélité canonique complète.

| Personnage | Uniforme | Civil | Militaire | Natation | Total |
| --- | --- | --- | --- | --- | ---: |
| Akane | A | A | A | A | 5 |
| Eikichi Ogiwara | A | R | A | A | 4 |
| Kanae | R | A | A | A | 4 |
| Kaori Matsuno | A | R | A | A | 8 |
| Kaoru Itou | R | A | A | A | 5 |
| Karen Himeki | R | A | A | A | 8 |
| Katsuo Isobe | A | A | A | A | 5 |
| Kawahara | A | A | A | A | 5 |
| Kouzou Machida | A | R | A | A | 4 |
| Kumi Yamanaka | A | A | A | A | 5 |
| Leona Morimoto | R | A | A | A | 5 |
| Linda Hamilton | A | A | A | A | 4 |
| Madoka Araki | R | A | R + A | A | 5 |
| Maiko Kaneda | R | R | R + A | A | 6 |
| Mami Nakai | R | A | A | A | 4 |
| Manami | R | A | A | A | 4 |
| Maya | A | A | A | A | 5 |
| Momoe Endou | R | A | A | A | 4 |
| Momone Nishizaki | R | A | A | A | 4 |
| Nanase Fujiwara | R | A | A | A | 4 |
| Reina Morimoto | A | R | A | A | 4 |
| Ruri Nonomiya | A | R | R + A | A | 9 |
| Saki Yamagata | A | A | A | A | 4 |
| Saori Otokawa | R | R | R + A | A | 13 |
| Sudou | R | A | A | A | 4 |
| Takurou Hayami | A | R | A | A | 5 |
| Tooru Satou | R | A | A | A | 4 |
| Yuri Nishizaki | R | A | A | A | 8 |
| Yuuji Takigawa | R | A | A | A | 4 |
| Yuuki Miyagishi | A | A | R + A | A | 7 |

## Intégration au moteur

- Le catalogue couvre tous les personnages dessinés. Le vestiaire est raccordé aux trois héros qui existent déjà dans HEROES_DB : discipline_saori_otokawa, discipline_ruri_nonomiya, discipline_takurou_hayami.
- Les tenues sont sélectionnées via heroSkins, sauvegardé par le jeu. Les statistiques, les déblocages et le statut nonCombat restent ceux du roster existant.
- Chaque PNG est enregistré en **1 colonne × 1 ligne** pour tous les états. Aucun découpage 4×4 et aucune animation ne sont revendiqués.
- En cas d’échec de chargement : costume choisi → tenue par défaut du même personnage → ancien sprite. Le choix sauvegardé est conservé.
- Sans sélection explicite, le sprite antérieur est utilisé. Les scènes à incarnation verrouillée gardent leur apparence de source.
- Les autres personnages disposent des images et du registre ; cette PR ne crée pas de statistiques ni de personnages jouables supplémentaires.

## Références et limites

Les noms proches restent distincts : **Yuuji / Yuuki**, **Kaori / Kaoru**, **Momone / Momoe**. Les sources détaillées, identifiants de génération, empreintes SHA-256, dimensions et limites sont dans [manifest.json](manifest.json). Les prompts disponibles de cette livraison sont enregistrés verbatim ; ceux des anciens tours qui ne sont plus disponibles sont signalés comme tels.

Les variantes JGSDF reprennent la tenue de terrain illustrée sur la [page officielle JGSDF des équipements](https://www.mod.go.jp/gsdf/equipment/qe/index.html) ([photo](https://www.mod.go.jp/gsdf/assets/images/equipment/qe/pic07_modal.png)). Il s’agit de l’adaptation d’un vêtement réel, pas d’un costume officiel de Discipline. Les cinq tenues tactiques OVA ont leurs propres sources de l’animé et leurs propres identifiants.

Les nouvelles variantes de natation utilisent des vêtements de sport aquatique opaques (haut de protection, short ou pantalon selon la variante). Les uniformes académiques ajoutés sans source individuelle sont également des adaptations identifiées.

**Miyuki Umezaki reste sans sprite** : une référence d’identité et de tenue exploitable manque encore. **Les gardes OVA anonymes disposent d’une référence partielle**, la capture utilisateur `image(20261028-060014).png`, où ils apparaissent roux et habillés. Ils ne sont pas intégrés dans cette passe consacrée aux tenues des 30 personnages existants ; leur identité individuelle et les détails du bas du corps hors champ restent à préciser.

## Contrôles

La commande npm run test:discipline vérifie le registre, les fichiers réels, la sauvegarde, les identités, le respect des scènes verrouillées, le rendu intégral et les solutions de secours.

Les originaux PNG sont copiés sans retouche ni redimensionnement. Le manifeste mesure la silhouette avec alpha > 8/255 : de faibles résidus presque transparents peuvent exister à l’extérieur. Les marges de la silhouette visible sont conservées.

## Vérification en navigateur du lot v3

Contrôle réalisé avec Chromium headless et Playwright sur le contenu final : **160 cartes**, **5 nouvelles tenues**, **7 entrées au filtre OVA**, **23 versions corrigées** et **6 PNG v3 chargés** à leur taille native de 1254 × 1254. La comparaison de Takurou fonctionne sur ordinateur et sur un écran de **390 px**, sans débordement horizontal ni erreur JavaScript. Les notes de proportions de Maiko sont consultables.

Les tenues OVA de **Saori et Ruri** et la correction de **Takurou** ont été équipées dans le vrai vestiaire. Le canvas du jeu dessine leur cadre entier ; les trois choix sont conservés après rechargement. L’ancienne sélection v2 reste valide. Le rapport détaillé est dans [anime-v3-browser-qa-report.json](anime-v3-browser-qa-report.json).

## Vérification en navigateur du lot v2

Contrôle réalisé avec Chromium headless et Playwright : **154 cartes**, **22 nouveaux PNG chargés** à leur taille native 1254 × 1254, comparaison sur ordinateur et sur un écran de **390 px**, sans débordement horizontal ni erreur JavaScript.

La sélection réelle des variantes de **Saori et Ruri** a été vérifiée dans le vestiaire du jeu. Le canvas du jeu dessine le cadre PNG entier ; le choix est conservé après rechargement. L'ancienne sélection reste valide. Le détail mesuré est dans [browser-qa-report.json](browser-qa-report.json).
