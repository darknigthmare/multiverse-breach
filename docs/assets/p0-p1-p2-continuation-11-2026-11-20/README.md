# Reprise des P0, de la Mêlée et des terrains Tactics

Les **20 dossiers artistiques P0** conservent leur statut. Les corrections de cette passe couvrent des actions, un terrain jouable, des animations et des contrôles de médias. [Registre historique des 22 décisions](../p0-p1-p2-continuation-09-2026-11-20/p0-status.json)

| Chantier | Résultat vérifié |
| --- | --- |
| Mêlée | **40 héros originaux** reçoivent des supers qui utilisent leurs portées, fenêtres d’impact et types d’effet. Le clavier vérifie le rempart de Doros et le tactile l’onde de Brokk. [Les 40 profils et parcours](roster/README.md) |
| Duel | Deux lancers de Starfire réutilisent les poses de préparation, émission et récupération de son atlas W16. Le projectile rejoint sa trajectoire de combat depuis la main. [Vérifications de Starfire](dc/README.md) |
| Bespin | Dans les combats Tactics à étages, les débris portent à trois cases et l’étranglement à cinq. Les effets prennent l’appui de la cible touchée. En Mêlée, l’absorption de tout le coup supprime l’effet d’étranglement. [Parcours J1 et J2](star-wars/README.md) |
| Carte Tactics | La Ligne-Cendre d’Iron Tempest propose trois radios à tenir, deux parcours d’ascension et un franchissement au-dessus du boyau. L’herbe, la boue, le gravier, le schiste et les planches suivent les surfaces du plateau. [Géométrie et essais de la carte](tactics/README.md) |
| RPG original | Les deux panneaux du Cuirassé Nul « Oblique » s’ouvrent à l’impact de sa garde, tiennent la position puis se replient. Le réglage de mouvement réduit revient au PNG fixe. [Déploiement et réduction de mouvement](motion/README.md) |
| Doom | **213 lots sur 317**, dont quatre nouveaux. Les 72 fichiers ajoutés comprennent 64 rasters décodés et huit autres médias vérifiés. Il reste 104 lots et 3,43 Go. [Reçus du plan gelé](dlc/README.md) |

Rift valide directement le catalogue et ses fichiers à partir d’une copie de médias. Les deux pointeurs Git LFS détectés lors de cet audit ont chacun un PNG vérifié dans la copie, qui complète les 58 fichiers récupérés lors de la passe précédente. Les illustrations historiques de Master Chief, Chell et Barney restent archivées. Leurs trois dossiers passent en attente car la génération correspond à une consigne de source antérieure. [Audit Rift et cas de corruption isolé](rift/README.md)

Des sorties Chromium reproductibles des passes précédentes ont libéré environ 162 Mio sous `/tmp`. Les scripts, captures et reçus ont été conservés. [Suites et compilations](validation/checks.json)
