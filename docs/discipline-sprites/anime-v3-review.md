# Discipline — tenues OVA et proportions visibles, v3

**6 nouveaux PNG** : cinq tenues OVA indépendantes et une correction ciblée de Takurou. Les 154 versions précédentes sont conservées.

| Personnage | Type | Tenue et limites |
| --- | --- | --- |
| Saori Otokawa | Nouvelle tenue OVA | Tenue tactique reprise des captures de l’OVA : casquette S.A.D, blouson gris, haut blanc, short à revers, gants et genouillère. Proportions visibles du visage, du cou et du torse suivies ; la pose debout et les chaussures hors champ sont reconstituées. Fidélité intégrale 1:1 non certifiée. |
| Ruri Nonomiya | Nouvelle tenue OVA | Tenue tactique reprise des captures de l’OVA : casque marine, gilet bleu, haut crème, pantalon cargo, brassard et pied-de-biche allongé après comparaison. Rapport tête/épaules et silhouette du torse et des jambes contrôlés visuellement ; chaussures hors champ et pose du bras reconstituées. Fidélité intégrale 1:1 non certifiée. |
| Takurou Hayami | Correction ciblée des proportions visibles | Correction ciblée d’après le portrait OVA : ovale du visage moins compact et cou légèrement allongé, vêtements conservés. La petite référence ne montre pas le bas du corps ; pantalon, chaussures et pose sont conservés de l’ancienne version. Fidélité intégrale 1:1 non certifiée. |
| Yuuki Miyagishi | Nouvelle tenue OVA | Tenue OVA avec débardeur kaki, pantalon cargo brun, brassard rouge, gants, protections, pendentif et camouflage du visage. Cou, épaules, bras et proportions visibles du torse suivis ; la pose debout et les détails des bottes partiellement visibles restent reconstitués. Fidélité intégrale 1:1 non certifiée. |
| Maiko Kaneda | Nouvelle tenue OVA | Tenue OVA avec casque audio clair, lunettes orange, haut gris à col haut, bretelles claires, montre verte et ordinateur violet. La source montre une pose accroupie : la posture debout, le bas du pantalon et les chaussures restent reconstitués. Fidélité intégrale 1:1 non certifiée. |
| Madoka Araki | Nouvelle tenue OVA | Tenue utilitaire bleue de l’OVA avec gilet à poches sombre, manches à revers clairs, gants noirs et boucle de ceinture argentée. Visage, cou, épaules et silhouette du gilet suivis ; les bottes hors cadre restent reconstituées. Fidélité intégrale 1:1 non certifiée. |

## Provenance

Les tenues sont fondées sur les captures OVA fournies. Les anciens sprites JGSDF servent uniquement de référence de technique pixel art ; leurs costumes restent disponibles et ne sont pas renommés comme costumes de l’animé. Le contrôle de Madoka utilise aussi une référence de jeu uniquement pour confirmer l’identité, sans en reprendre les vêtements ni les proportions.

Les sources recadrées ou en perspective n’établissent pas toutes les proportions du corps. La correction de Takurou porte sur le visage et le cou visibles, pas sur une reconstruction complète du corps. Les détails hors champ restent déclarés dans chaque entrée du manifeste.

## Accessoire de Ruri

Un premier brouillon avait un pied-de-biche trop court. Le PNG installé utilise la retouche allongeant la barre et resserrant son crochet. Les deux prompts et leurs statuts sont conservés dans l’historique de génération ; seul le résultat accepté est ajouté au catalogue.

## Références non attribuées

Les autres captures de robes et de tenues d’officières ne permettent pas une identification nominative suffisamment sûre. Aucun nom ni costume supplémentaire n’a été inventé pour compléter ces références.

## Conservation et consultation

Le point de conservation est le commit `58ca23d7bc226330bb5082cc1ba49aeadafc5de6`. Les 154 entrées antérieures du catalogue et du manifeste, leurs PNG, identifiants et sélections restent inchangés.

Galerie : `/reviews/discipline/index.html`, filtre « Tenues de l’animé ». Le champ `variantOf` de Takurou permet de comparer sa correction à l’ancienne version. Les autres ajouts sont des tenues indépendantes.

## Vérification du lot final

Le contrôle automatisé compare les 154 entrées antérieures du catalogue et du manifeste au point de conservation et vérifie les empreintes des 160 PNG. Le test des tenues OVA indépendantes confirme que leur source de style ne devient ni une ancienne version du costume ni une étape du repli de chargement. `npm run test:discipline` et `npx vite build` ont réussi sur le contenu final sous Node 24.22.1. Le build signale les gros chunks existants ; le cycle complet de médias du projet reste à vérifier par la CI sous Node 22.

Le contrôle navigateur réel affiche 160 cartes, 5 nouvelles tenues, 7 entrées au filtre OVA et 23 versions corrigées. Les 6 nouveaux PNG se chargent. La comparaison Takurou est lisible sur ordinateur et à 390 px, sans débordement horizontal ; les notes de Maiko sont accessibles. Aucune erreur JavaScript n’a été observée.

Saori et Ruri en tenue tactique et Takurou corrigé ont été sélectionnés dans le vrai vestiaire. Le canvas dessine le cadre complet 1254 × 1254 ; les trois choix persistent après rechargement et l’ancienne sélection v2 reste valide. Voir [le rapport navigateur v3](anime-v3-browser-qa-report.json).
