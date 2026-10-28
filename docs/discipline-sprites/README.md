# Sprites et tenues Discipline

**197 PNG individuels pour 36 identités graphiques.** La v5 ajoute deux études monochromes tirées de feuilles OVA en pied : Leona avec brassard 風紀 et un membre anonyme du club de diffusion. Les 195 objets et images antérieurs sont conservés intégralement.

Le catalogue comprend 76 rendus basés sur références et 121 adaptations identifiées. La provenance sur référence ne certifie pas les couleurs ou les proportions non établies.

## Examiner les versions

Ouvrir `/reviews/discipline/index.html` depuis le serveur du jeu. Le filtre **« Études monochromes · v5 »** affiche les deux ajouts et leurs liens vers les planches. **« Variantes · v4 »** conserve les 35 ajouts précédents ; **« Versions corrigées »** rassemble les révisions avec leur comparaison côte à côte. Les filtres de provenance et de support distinguent les costumes du jeu, les modèles OVA et les adaptations.

Les PNG sont installés dans `public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/`. Ils sont en pied, transparents et statiques : **1 colonne × 1 ligne**. Les études v5 reprennent l’orientation des poses des planches. Les dimensions natives peuvent varier ; un cadre unique n’est pas une garantie de fidélité visuelle 1:1. Aucune animation n’est revendiquée.

## Livraison v5

Les deux études utilisent seulement leurs planches OVA. Aucun lien d’ascendance avec une tenue VN/JGSDF ni référence de style non utilisée n’est ajouté. Le monochrome ne détermine pas la palette canonique.

- [Revue v5 et limites des proportions](reference-v5-review.md)
- [Recherche v5 et références manquantes](reference-v5-research.json)
- [Conservation des 195 images et objets](reference-v5-preservation.json)
- [Manifeste : prompts, sources et SHA-256](manifest.json)
- [Validation technique v5](reference-v5-validation.json) et [contrôle navigateur v5](reference-v5-browser-qa-report.json)

## Couverture du catalogue

R = basé sur une référence ; A = adaptation ; R + A = les deux. Ces indications ne certifient pas une tenue canonique complète.

| Personnage | Uniforme | Civil | Militaire | Natation | Autres / sport | Total |
| --- | --- | --- | --- | --- | --- | ---: |
| Akane | A | A | A | A | A | 6 |
| Domestique OVA — chignon brun | R | — | — | — | — | 1 |
| Eikichi Ogiwara | A | R | A | A | — | 5 |
| Garde de sécurité OVA — roux | — | — | R | — | — | 1 |
| Invitée OVA — robe jaune | — | R | — | — | — | 1 |
| Kanae | R | A | A | A | — | 5 |
| Kaori Matsuno | A | R | A | A | — | 9 |
| Kaoru Itou | R | A | A | A | — | 6 |
| Karen Himeki | R | A | A | A | — | 9 |
| Katsuo Isobe | A | A | A | A | R | 6 |
| Kawahara | A | A | A | A | A | 6 |
| Kouzou Machida | A | R | A | A | — | 5 |
| Kumi Yamanaka | A | A | A | A | R | 6 |
| Leona Morimoto | R | A | A | A | R | 7 |
| Linda Hamilton | A | A | A | A | — | 5 |
| Madoka Araki | R | A | R + A | A | — | 6 |
| Maiko Kaneda | R | R | R + A | A | R | 7 |
| Mami Nakai | R | A | A | A | — | 5 |
| Manami | R | A | A | A | — | 5 |
| Maya | A | A | A | A | A | 6 |
| Membre OVA — club de diffusion | R | — | — | — | — | 1 |
| Momoe Endou | R | A | A | A | — | 5 |
| Momone Nishizaki | R | A | A | A | — | 5 |
| Nanase Fujiwara | R | A | A | A | — | 5 |
| Officière OVA — carré châtain | R | — | — | — | — | 1 |
| Officière OVA — cheveux tirés | R | — | — | — | — | 1 |
| Reina Morimoto | A | R | A | A | — | 5 |
| Ruri Nonomiya | A | R | R + A | A | — | 10 |
| Saki Yamagata | A | A | A | A | — | 5 |
| Saori Otokawa | R | R | R + A | A | R + A | 14 |
| Sudou | R | A | A | A | — | 5 |
| Takurou Hayami | A | R | A | A | — | 6 |
| Tooru Satou | R | A | A | A | — | 5 |
| Yuri Nishizaki | R | A | A | A | — | 9 |
| Yuuji Takigawa | R | A | A | A | — | 5 |
| Yuuki Miyagishi | A | A | R + A | A | R + A | 8 |

## Intégration au moteur

Le vestiaire reste relié aux trois héros existants : Saori Otokawa, Ruri Nonomiya et Takurou Hayami. Les autres identités sont des entrées graphiques, sans nouveau héros jouable ni statistiques. Les choix sont enregistrés dans `heroSkins` ; sans sélection explicite, les apparences antérieures sont préservées. Les scènes à incarnation verrouillée restent respectées.

En cas d’échec de chargement d’une révision : nouvelle variante → version précédente correspondante → tenue par défaut du même personnage → ancien sprite. Les références de technique graphique ne modifient pas cette chaîne. Les deux études v5 n’inventent aucun lien d’ascendance avec une ancienne tenue.

## Versions précédentes

- [V4 : 30 variantes et 5 figures OVA](reference-v4-review.md) — 195 PNG.
- [V3 : tenues tactiques OVA et Takurou](anime-v3-review.md) — 160 PNG.
- [V2 : identité et coiffures](reference-v2-review.md) — 154 PNG.

La [validation technique v4](reference-v4-validation.json) et la [validation navigateur v4](reference-v4-browser-qa-report.json) conservent leurs résultats historiques ; les validations v5 sont distinctes.

Les tenues JGSDF utilisent un [vêtement réel documenté](https://www.mod.go.jp/gsdf/equipment/qe/index.html) comme source ; leur attribution aux personnages reste une adaptation. Les créations de sport aquatique et les uniformes sans référence individuelle gardent également leur provenance adaptée.

## Références et limites

Miyuki reste en attente. Les identités proches restent distinctes : **Yuuji / Yuuki**, **Kaori / Kaoru**, **Momone / Momoe**, ainsi que les supports VN/OVA. Les figures anonymes ne reçoivent aucun nom inventé. Les parties non documentées, les différences de proportions et les palettes inconnues sont signalées individuellement.

Aucun PNG antérieur n’est remplacé. Les mesures alpha utilisent le seuil > 8/255 ; des résidus presque transparents peuvent exister en dehors de la silhouette mesurée. Les PNG finaux ne sont pas retouchés par script.
