# Publication de la continuation Cite / Extinction — 27 octobre 2026

## Reprise et integration

Les deux classeurs et les correctifs ci-dessous sont les neuf blobs Git exacts verifies dans [EC verified workbook delivery, run 40525781811](https://github.com/darknigthmare/multiverse-breach/actions/runs/40525781811), puis relus dans [40581236973](https://github.com/darknigthmare/multiverse-breach/actions/runs/40581236973). Le run de livraison avait uniquement stocke les blobs : il ne les avait pas encore integres a la branche. Cette publication termine cette integration et retire les dix fichiers et workflows temporaires de transport/lecture.

## Correctifs finalises

- Le controle de progression ne demande plus la constante Mirelle directement dans HubScreen : il verifie le raccordement du resolveur au personnage selectionne et les references des images de mains et d'effet. Le contrat executable de recadrage/rechargement/rapport d'aspect demeure actif.
- Six tests de raccordement supplementaires acceptent le personnage selectionne et rejettent une proprietaire forcee, des mains empruntees, une reference de mains detachee, un effet emprunte ou une reference d'effet detachee.
- Le catalogue et son test acceptent une sortie Git plus grande (tampon borne a 32 Mio), adaptee a l'inventaire du depot. Les libelles et suivis des habitants/FPS sont mis a jour sans declarer de nouveaux assets artistiques.

## Classeurs distincts

`docs/excel/Multiverse_Breach_Extinction_Cite_Production.xlsx` : 21 feuilles, 20 tableaux, 17 732 lignes de catalogue, 210 518 cellules comparees au catalogue, 14 formules et aucune erreur de formule en cache. SHA-256 : `1623737ccc9388424bcbd866e72e98454b4b90af28064eba26f8f25c882682e6`.

`docs/excel/Multiverse_Breach_UI_Immersion.xlsx` : 5 feuilles, 4 tableaux, suivi de 40 ecrans, 39 lots d'actions et 156 lignes de verification, dont les 144 lignes historiques conservees. Aucune erreur de formule en cache. SHA-256 : `aed63e1b72072b1b702516469bf38ec081f9880ed720e14948968034f8473e06`.

Le catalogue est trace au commit source `dc95aec15309fb2f9a23e36971b30db46197f9a6`, avec l'empreinte de donnees `8f81d4806e8cc3d2cbc54e8e0026c32ab28d3fad63a29ecf3dce874ec961dddb`. Ce sont des lignes d'inventaire et de production, pas 17 732 nouveaux elements jouables realises.

## Preuves et limites

- Run de livraison : 127/127 tests unitaires cibles et 6/6 tests de catalogue reussis, verification des deux classeurs reussie. Ces tests portent sur les blobs publies, pas sur une nouvelle revue artistique.
- Validation navigateur anterieure du code resident/FPS : voir `residents-fps-ci-receipt-2026-10-27.json` et le run 40508601682. Elle ne certifie ni comptes reels, ni materiel physique, ni quarante ecrans parcourus manuellement.
- Le build complet 40525796147 echouait sur l'ancienne assertion de raccordement FPS (160/161 controles de progression). Il utilisait encore les fichiers precedents, avant cette publication. Les checks du commit integrant cette livraison doivent etre lus separement ; aucun succes du build complet n'est revendique par ce document.
- Aucun nouveau dessin de mains, ennemi, boss, zone ou accessoire ; aucune implementation massive des actions FPS individuelles. Les liaisons personnelles FPS restent partielles (trois personnages raccordes).
- Aucun merge dans master, aucune promotion de production, aucune modification des PR equipement nº 10 ou Fighter nº 7.
