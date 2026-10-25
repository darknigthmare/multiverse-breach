# Suivi Multiverse Breach — R13, 25 octobre 2026

## Version actuelle et périmètre

Le code R13 `4aa64f4540e245bf8306ffdb7beaeedaa72873ba` part de la tête exacte `e09265fa5a6b75caa8b66b6784629ea69cd0da8a` et préserve les travaux R12 et les corrections de combat intervenues depuis.

- [Rapport R13, sources et limites](COSTUMES_MANQUANTS_R13_2026-10-25.md)
- [Preuves et empreintes R13](evidence/wardrobe-R13.json)
- [Catalogue des composants R13](../../src/game/wardrobeOfficialR13.js)
- [Export des manquants de chaque acteur](../../scripts/exportActorFidelityBacklog.mjs)
- [Export des costumes](../../scripts/exportWardrobe.mjs)
- [Export des correspondances boosters](../../scripts/exportWardrobeBoosters.mjs)

**33 composants officiels documentés ajoutés**, soit 186 associations sur neuf identités : PAYDAY 2 (Lawless, Mega City et mise à jour gratuite) et Magicka (Gamer Bundle et chapeau Survival Kit). Tenues, variantes de modèle, masques, gants et chapeaux sont distingués. Chaque adaptation sur le porteur reste à vérifier visuellement.

Le contrôle des listes de source tient maintenant compte des composants et éditions exigés, pas seulement du nom. Compléter un pack ne termine pas la garde-robe complète d'un personnage.

**Aucun nouveau PNG, costume équipable ou certification artistique 1:1 dans R13.** Une acquisition est un droit conservé, pas une preuve de production graphique.

## Compteurs de la version R13

4 936 acteurs / 525 univers / 3 206 stages conservés. 176 définitions officielles, 335 associations sur 54 identités ; 60 concepts personnalisés et quatre collections communes. 20 139 droits, tous rattachés aux 530 routes de boosters. Les 19 953 anciens identifiants sont préservés.

Le registre contient 30 721 actions ouvertes (17 328 P1 / 13 393 P2 de travail). Les 22 P0 visuels historiques sont séparés et restent ouverts. 1 477 acteurs ont toujours au moins un raster résolu absent dans l'arbre contrôlé.

312 identités sont explicitement originales. Parmi les 4 624 identités externes ou non résolues, 4 570 n'ont pas encore de variante officielle documentée. **Le recensement de toutes les tenues et des personnages absents des franchises n'est pas terminé.**

## Vérifications de R13

[Run dédié 40165144880](https://github.com/darknigthmare/multiverse-breach/actions/runs/40165144880) réussi : 1 204 tests vestiaire/boosters/fidélité/scènes, 1 027 contrôles de combat dans une suite séparée, lint ciblé sans erreur/avertissement et compilation Vite des sources réussie. Les mêmes tests locaux ne sont pas additionnés une seconde fois.

Quatorze fichiers source/tests publiés correspondent aux empreintes locales et à l'arbre reconstruit. Aucun prébuild complet des bitmaps, nouveau parcours navigateur ou contrôle Vercel n'est revendiqué. Les images et costumes n'ont pas été validés par ces tests.

## Classeurs et exports

Le classeur R13 livré dans la conversation contient onze onglets : synthèse, acteurs, synthèse des manquants, officiels, ajouts R13, boosters, recherches, originaux, périmètres, modèle de revue et sources. **Le CSV joint contient les 30 721 actions détaillées**, sans les présenter comme autant de défauts graphiques observés manuellement.

**Le binaire XLSX R13 n'est pas publié dans le dépôt.** Les anciens XLSX sont préservés, ne reflètent pas les derniers compteurs et ne doivent pas être présentés comme actualisés. Le code, les rapports, les preuves et les exporteurs sont publiés.

- [Audit fidélité — binaire R1 historique](Multiverse_Breach_Audit_Fidelite_1a1_Priorites.xlsx)
- [Suivi combats RECONSTITUÉ — binaire R1 historique](Multiverse_Breach_Suivi_Combats_RECONSTITUE.xlsx)
- [Archive du premier audit](archives/Audit_Fidelite_ancien_6fd4fd24_OBSOLETE.xlsx)

Le catalogue historique original perdu n'est pas présenté comme restauré.

## Historique conservé

[R12](COSTUMES_MANQUANTS_R12_2026-10-25.md) · [R11](COSTUMES_FIDELITE_R11_2026-10-25.md) · [R10](COSTUMES_FIDELITE_R10_2026-10-25.md) · [R9](MANQUANTS_PERSONNAGES_R9_2026-10-24.md).

[R8](BOOSTERS_COSTUMES_R8_2026-10-24.md) : déblocages par booster exact, cinq cartes/prix/garanties inchangés, bonus gratuit non possédé, pas de personnage ni pouvoir accordé.

[R7](COSTUMES_R7_2026-10-24.md) · [R6](COSTUMES_R6_2026-10-24.md) · [R5](COSTUMES_R5_2026-10-24.md) : vestiaire, concepts, sources et revue de fidélité sur preuves. Les trois effets au sol ne sont pas des costumes.

[R4](STAGES_JOUABLES_R4_2026-10-24.md) : Sulaco, Narcissus et Blast Pit jouables avec objectifs et verrouillages ; graphismes, architecture et chorégraphies encore partiels.

Les audits R1–R3 et les preuves de production historiques restent conservés, sans prétendre les avoir rejoués. Aucun merge ni déploiement de production effectué par R13.
