# Sprites et tenues Discipline

## Livraison

**132 PNG individuels pour 30 personnages**. Images entières, fond transparent réel, pose statique en trois quarts vers la droite. Les 17 anciens portraits recadrés sont exclus.

31 sprites sont basés sur des références de personnages et costumes. 101 sont des adaptations identifiées. Aucun rendu n’est certifié 1:1 : les références partielles imposaient de reconstituer les parties hors cadre.

## Examiner les images

Depuis le serveur du jeu : /reviews/discipline/. La galerie filtre par personnage, tenue et provenance et permet de changer le fond de contrôle. Les PNG restent consultables individuellement dans public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/.

## Couverture

R = modèle basé sur référence ; A = adaptation créée pour ce projet ; — = en attente. Une lettre ne certifie pas une fidélité canonique complète.

| Personnage | Uniforme | Civil | Militaire | Natation | Total |
| --- | --- | --- | --- | --- | ---: |
| Akane | A | A | A | A | 5 |
| Eikichi Ogiwara | A | R | A | A | 4 |
| Kanae | R | A | A | A | 4 |
| Kaori Matsuno | A | R | A | A | 4 |
| Kaoru Itou | R | A | A | A | 5 |
| Karen Himeki | R | A | A | A | 4 |
| Katsuo Isobe | A | A | A | A | 5 |
| Kawahara | A | A | A | A | 5 |
| Kouzou Machida | A | R | A | A | 4 |
| Kumi Yamanaka | A | A | A | A | 5 |
| Leona Morimoto | R | A | A | A | 5 |
| Linda Hamilton | A | A | A | A | 4 |
| Madoka Araki | R | A | A | A | 4 |
| Maiko Kaneda | R | R | A | A | 5 |
| Mami Nakai | R | A | A | A | 4 |
| Manami | R | A | A | A | 4 |
| Maya | A | A | A | A | 5 |
| Momoe Endou | R | A | A | A | 4 |
| Momone Nishizaki | R | A | A | A | 4 |
| Nanase Fujiwara | R | A | A | A | 4 |
| Reina Morimoto | A | R | A | A | 4 |
| Ruri Nonomiya | A | R | A | A | 4 |
| Saki Yamagata | A | A | A | A | 4 |
| Saori Otokawa | R | R | A | A | 6 |
| Sudou | R | A | A | A | 4 |
| Takurou Hayami | A | R | A | A | 4 |
| Tooru Satou | R | A | A | A | 4 |
| Yuri Nishizaki | R | A | A | A | 4 |
| Yuuji Takigawa | R | A | A | A | 4 |
| Yuuki Miyagishi | A | A | A | A | 6 |

## Intégration au moteur

- Le catalogue couvre tous les personnages dessinés. Le vestiaire est raccordé aux trois héros qui existent déjà dans HEROES_DB : discipline_saori_otokawa, discipline_ruri_nonomiya, discipline_takurou_hayami.
- Les tenues sont sélectionnées via heroSkins, sauvegardé par le jeu. Les statistiques, les déblocages et le statut nonCombat restent ceux du roster existant.
- Chaque PNG est enregistré en **1 colonne × 1 ligne** pour tous les états. Aucun découpage 4×4 et aucune animation ne sont revendiqués.
- En cas d’échec de chargement : costume choisi → tenue par défaut du même personnage → ancien sprite. Le choix sauvegardé est conservé.
- Sans sélection explicite, le sprite antérieur est utilisé. Les scènes à incarnation verrouillée gardent leur apparence de source.
- Les autres personnages disposent des images et du registre ; cette PR ne crée pas de statistiques ni de personnages jouables supplémentaires.

## Références et limites

Les noms proches restent distincts : **Yuuji / Yuuki**, **Kaori / Kaoru**, **Momone / Momoe**. Les sources détaillées, identifiants de génération, empreintes SHA-256, dimensions et limites sont dans [manifest.json](manifest.json). Les prompts disponibles de cette livraison sont enregistrés verbatim ; ceux des anciens tours qui ne sont plus disponibles sont signalés comme tels.

Les variantes militaires reprennent la tenue de terrain illustrée sur la [page officielle JGSDF des équipements](https://www.mod.go.jp/gsdf/equipment/qe/index.html) ([photo](https://www.mod.go.jp/gsdf/assets/images/equipment/qe/pic07_modal.png)). Il s’agit de l’adaptation d’un vêtement réel, pas d’un costume officiel de Discipline.

Les nouvelles variantes de natation utilisent des vêtements de sport aquatique opaques (haut de protection, short ou pantalon selon la variante). Les uniformes académiques ajoutés sans source individuelle sont également des adaptations identifiées.

**Restent sans sprite : Miyuki Umezaki et le garde anonyme de l’OVA**, faute de référence neutre exploitable. Aucun fichier fictif ou entrée disponible ne remplace ces références manquantes.

## Contrôles

La commande npm run test:discipline vérifie le registre, les fichiers réels, la sauvegarde, les identités, le respect des scènes verrouillées, le rendu intégral et les solutions de secours.

Les originaux PNG sont copiés sans retouche ni redimensionnement. Le manifeste mesure la silhouette avec alpha > 8/255 : de faibles résidus presque transparents peuvent exister à l’extérieur. Les marges de la silhouette visible sont conservées.
