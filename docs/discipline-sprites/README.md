# Sprites et tenues Discipline

**195 PNG individuels pour 35 identités graphiques.** La dernière passe ajoute **30 variantes de fidélité — une par personnage existant — et 5 figures anonymes de l’OVA**. Les **160 versions précédentes sont conservées à l’identique**.

Le catalogue comprend 74 rendus basés sur références et 121 adaptations identifiées. Les références partielles ne certifient pas les détails hors cadre ni une reproduction corporelle intégrale 1:1.

## Examiner les versions

Ouvrir `/reviews/discipline/index.html` depuis le serveur du jeu. Le filtre **« Dernières variantes · v4 »** affiche les 35 ajouts. Le filtre **« Versions corrigées »** montre toutes les révisions. Une comparaison côte à côte reste disponible avec la version précédente. Les filtres de provenance et de support distinguent les costumes sur références des adaptations.

Les PNG sont installés dans `public/sprites/generated/heroes/discipline-the-record-of-a-crusade/costumes/`. Chaque fichier est une image en pied statique sur fond transparent, **1 colonne × 1 ligne**, en trois quarts vers la droite. Ce format de cadre ne signifie pas une fidélité visuelle 1:1 et aucune animation n’est revendiquée.

## Livraison v4

Les nouvelles variantes suivent les formes visibles des références : visage, cou, coiffure et proportions documentées. Les parties non montrées conservent l’interprétation précédente, avec une note par personnage. Les nouvelles figures des captures sont un garde roux, deux officières distinctes, une domestique au chignon brun et une invitée en robe jaune. Leur identité nominative n’est pas inventée.

La recherche a couvert les 30 personnages et trouvé de nouvelles pistes : tenues civiles, robes de soirée, costume western et tenue infirmière. Certaines restent non livrées faute de références utilisables suffisantes ; la génération de la robe de Reina a été bloquée. La revue donne l’état exact, y compris les limites des rendus terminés.

- [Revue v4 et tableau des 30 variantes](reference-v4-review.md)
- [Recherche des références et tenues manquantes](reference-v4-research.json)
- [Manifeste : prompts, références, provenance et empreintes](manifest.json)
- [Validation navigateur v4](reference-v4-browser-qa-report.json)
- [Validation technique v4](reference-v4-validation.json)

## Couverture du catalogue

R = basé sur une référence ; A = adaptation ; R + A = les deux provenances. Une lettre ne certifie pas un costume complet canonique. Les lignes anonymes ne revendiquent que les tenues effectivement illustrées.

| Personnage | Uniforme | Civil | Militaire | Natation | Autres / sport | Total |
| --- | --- | --- | --- | --- | --- | ---: |
| Akane | A | A | A | A | A | 6 |
| Eikichi Ogiwara | A | R | A | A | — | 5 |
| Kanae | R | A | A | A | — | 5 |
| Kaori Matsuno | A | R | A | A | — | 9 |
| Kaoru Itou | R | A | A | A | — | 6 |
| Karen Himeki | R | A | A | A | — | 9 |
| Katsuo Isobe | A | A | A | A | R | 6 |
| Kawahara | A | A | A | A | A | 6 |
| Kouzou Machida | A | R | A | A | — | 5 |
| Kumi Yamanaka | A | A | A | A | R | 6 |
| Leona Morimoto | R | A | A | A | R | 6 |
| Linda Hamilton | A | A | A | A | — | 5 |
| Madoka Araki | R | A | R + A | A | — | 6 |
| Maiko Kaneda | R | R | R + A | A | R | 7 |
| Mami Nakai | R | A | A | A | — | 5 |
| Manami | R | A | A | A | — | 5 |
| Maya | A | A | A | A | A | 6 |
| Momoe Endou | R | A | A | A | — | 5 |
| Momone Nishizaki | R | A | A | A | — | 5 |
| Nanase Fujiwara | R | A | A | A | — | 5 |
| Domestique OVA — chignon brun | R | — | — | — | — | 1 |
| Invitée OVA — robe jaune | — | R | — | — | — | 1 |
| Officière OVA — carré châtain | R | — | — | — | — | 1 |
| Officière OVA — cheveux tirés | R | — | — | — | — | 1 |
| Reina Morimoto | A | R | A | A | — | 5 |
| Ruri Nonomiya | A | R | R + A | A | — | 10 |
| Saki Yamagata | A | A | A | A | — | 5 |
| Saori Otokawa | R | R | R + A | A | R + A | 14 |
| Garde de sécurité OVA — roux | — | — | R | — | — | 1 |
| Sudou | R | A | A | A | — | 5 |
| Takurou Hayami | A | R | A | A | — | 6 |
| Tooru Satou | R | A | A | A | — | 5 |
| Yuri Nishizaki | R | A | A | A | — | 9 |
| Yuuji Takigawa | R | A | A | A | — | 5 |
| Yuuki Miyagishi | A | A | R + A | A | R + A | 8 |

## Intégration au moteur

Le vestiaire est relié aux trois héros existants : Saori Otokawa, Ruri Nonomiya et Takurou Hayami. Les autres identités disposent de leurs images et du registre ; aucun nouveau héros jouable ni statistique n’est créé. Les choix sont enregistrés dans `heroSkins`. Sans sélection explicite, l’apparence antérieure est conservée ; les scènes à incarnation verrouillée restent respectées.

En cas d’échec de chargement d’une révision : nouvelle variante → version précédente correspondante → tenue par défaut du même personnage → ancien sprite. Les références de technique graphique ne modifient pas cette chaîne.

## Versions précédentes

- V3 : cinq tenues tactiques OVA indépendantes et une correction de Takurou, portant le catalogue à 160 images. [Revue v3](anime-v3-review.md).
- V2 : 22 variantes de coiffures et d’identité, ajoutées aux 132 PNG d’origine. [Revue v2](reference-v2-review.md).

Les tenues JGSDF utilisent un [vêtement réel documenté](https://www.mod.go.jp/gsdf/equipment/qe/index.html) comme source ; leur attribution aux personnages reste une adaptation. Les créations de sport aquatique et les uniformes sans référence individuelle gardent également leur provenance adaptée.

## Références et limites

Les identités proches restent distinctes : **Yuuji / Yuuki**, **Kaori / Kaoru**, **Momone / Momoe**. Les supports VN et OVA sont séparés. Miyuki Umezaki reste sans sprite faute de référence de tenue exploitable. Le garde OVA, précédemment en attente, est maintenant présent sous un nom descriptif.

Aucun fichier antérieur n’est supprimé ou remplacé. Les contrôles d’alpha mesurent la silhouette avec alpha > 8/255 ; de faibles résidus presque transparents peuvent exister en dehors. Les PNG finaux ne sont pas retouchés par script.
