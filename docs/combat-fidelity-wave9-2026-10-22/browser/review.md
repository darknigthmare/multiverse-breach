Les deux parcours navigateur W9 sont PASS sur le serveur existant `http://127.0.0.1:5188/`, avec le véritable renderer chargé par les URL compilées de GameCanvas. Aucun fichier de production n’a été modifié pendant cette validation.

| Parcours | Couverture observée | Conservation historique |
| --- | --- | --- |
| Présentations | 117 entrées : 116 atlas complets de 32 poses et le partiel Beast Boy de 8 poses ; 930 phases, 7 440 sélections/dessins P1 et P2 | 97 anciennes entrées et leurs PNG inchangés ; 6 160 géométries de dessin identiques |
| Repli Beast Boy | 48 dessins de gorille pour les six phases absentes ; les 24 dessins humains non retenus restent inaccessibles au runtime | Partiel strict limité à `fatality` et `super` |
| Bases | 64 personnages : 20 nouveaux et 44 anciens ; 2 048 dessins des quatre états sur les deux côtés | 44 anciens PNG et 1 408 géométries de dessin conservés |

Les rectangles source couvrent les cellules entières de 256 × 256. Les 57 bases calibrées utilisent la baseline 244 et leurs facteurs de rangée ; les sept bases antérieures à W6 gardent leur ancienne géométrie à baseline 232. Les miroirs P2, les identités/univers stricts, les facteurs de stature et les acteurs/registries/layouts non mutés passent. Les 7 anciens manifestes mêlée et les 11 anciens assets d’invocation sont conservés parmi les 8 manifestes et 15 invocations actuels.

Quarante captures individuelles et huit planches réunissant les deux camps ont été inspectées. Les cinq Gears gardent leurs silhouettes GoW2 : bandana de Marcus, désignateur distinct du Lancer, Gnasher physique de Dom, Lancer de Cole, Baird jeune blond avec lunettes et maintenance de matériel, commandement de Hoffman. Les personnages Mass Effect, Ghost in the Shell et Resident Evil restent visuellement distincts, avec corps et équipements entiers. Aucun nouveau défaut de coupe ou d’identité croisée n’a été observé sur ces planches.

Le lot A figé contient 10 PNG et 240 cellules RGBA visibles distinctes. Ses 16 fichiers de livraison gardent exactement les SHA archivés. La table d’ancres finale utilise des objets `{x,y}` et des valeurs `null` au retour, conformément au helper ; le correctif de structure a conservé les mesures et les PNG. Onze images natives sont archivées : dix sources initiales et une correction nécessaire du canon coupé de Hoffman ; l’original non retenu reste conservé.

Les seuls échecs réseau concernent la feuille Google Fonts (`ERR_TUNNEL_CONNECTION_FAILED`). Aucun module ni sprite local n’a échoué. Le contrôle du progrès autoritaire figé porte sur le rendu ; les dégâts, collisions et pauses de simulation sont couverts par les autres contrôles W9. Les trois manques natifs historiques Robin/Raven/Starfire et les six phases humaines non retenues de Beast Boy restent explicitement manquants. Aucune fidélité visuelle ou animation officielle 1:1 n’est certifiée.

Les anciens rapports W8 ont été lus uniquement : leurs SHA restent identiques, aucun ancien rapport n’a été remplacé. Le lint ciblé des deux harnesses est PASS, sans avertissement.

Reproduction avec le serveur de validation déjà démarré :

```sh
node docs/combat-fidelity-wave9-2026-10-22/browser/native-presentations.mjs
node docs/combat-fidelity-wave9-2026-10-22/browser/base-corrections.mjs
npm run lint -- docs/combat-fidelity-wave9-2026-10-22/browser/native-presentations.mjs docs/combat-fidelity-wave9-2026-10-22/browser/base-corrections.mjs
```

Résultats détaillés : [evidence.json](./evidence.json), [native-presentations.json](./native-presentations.json), [base-corrections.json](./base-corrections.json). Les traces contiennent les vrais appels `drawImage`, rectangles et transformations ; les captures restent complètes.
