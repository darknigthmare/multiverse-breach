# Invocations RPG et supers de mêlée — lot initial intégré

Base : PR #2, `2f2db5d1c193e0408881d5af99d94da405b7b24e`.
Les anciens correctifs tactiques restent sur la branche. Aucun compte, sauvegarde,
SQL, abonnement ou environnement de production n'est modifié.

## Ce qui est effectivement branché

Le GameCanvas installe un directeur **par instance** sur RPG et Smash. Il ne
modifie pas les prototypes, les catalogues d'origine ni les sauvegardes. Les
épreuves sans combat ne reçoivent aucune capacité offensive.

- Le bouton de l'artefact équipé reconnaît six contrats exacts : Chevaliers de la
  Table Ronde (FFVII), Rayon de l'Aube (Gears), Warthog (Halo), sentinelles
  (Aliens), snarks (Half-Life), cube protecteur (Portal).
- Le contrat exige simultanément ID d'objet, effet, univers et ID de porteur.
  Il ne déduit pas une affiliation à partir du nom. Les autres artefacts gardent
  le chemin existant, notamment l'impulsion A.R.C.A. du Nexus.
- Une invocation d'objet dépense une ATB pleine en RPG et utilise la limite
  d'artefact par combat déjà présente. Le moteur possède aussi son verrou
  immédiat anti-double déclenchement. Un refus avant engagement ne coûte rien.
- FFVII : **13 contacts séparés**, total de base 260 réparti entre les contacts,
  via le vrai répartiteur de dégâts. Ce n'est ni 13 fois 260, ni une soustraction
  directe contournant RAAM, la malédiction de Barbossa ou les boucliers.
- Les snarks conservent un risque de souffle final pour leurs alliés proches ;
  le cube protège avec le pool de bouclier existant et ne ressuscite personne.
- Les compétences RPG déjà typées `summon` passent par une préparation puis
  retrouvent leur action native : cible, soin/garde/dégâts, recharge et callback.
  Elles ne gagnent pas automatiquement de créature ou d'attaque inventée.
- Les supers Smash dotés d'un vrai profil spatial reçoivent une séquence, un
  bouton P1/P2, une réserve de 100 points et leur exécution native. Portée,
  direction, limites de cibles, armes et protections restent celles du kit.
  Les spéciales de mêlée à 30 points ne sont pas remplacées.
- Le compteur de séquence avance en ticks de simulation et respecte pause/x2.
  Les entrées concurrentes sont bloquées. KO, suppression du porteur, changement
  d'action et démontage interrompent la séquence ; une résurrection ne la relance
  pas. Les cibles confirmées ne sont pas remplacées silencieusement.
- Présentation : annonce FR/EN, progression, mise en scène Canvas utilisant le
  portrait existant et des effets abstraits. `prefers-reduced-motion` est respecté.
  Aucun nouveau sprite de créature ou chorégraphie source n'est inventé/certifié.

## Couverture mesurée et limites

`node scripts/signatureCoverage.mjs audit/signature-coverage.json` inspecte le
catalogue complet sans le modifier. Sur cette base : **525 univers / 4 936
entrées** (1 912 héros dont l'Ancre et 3 024 ennemis/boss). Il distingue :

- 10 porteurs d'une compétence RPG `summon` nommée et exécutable ;
- 31 liaisons porteur/artefact pour les six premières invocations ;
- 30 héros possédant déjà un super avec profil Smash explicite ;
- 101 entrées non combattantes préservées ;
- 4 765 entrées sans signature explicitement prise en charge par ce lot.

Ces catégories se recouvrent. L'inventaire comprend les définitions du catalogue,
pas toutes leurs transformations dans les rencontres. **Zéro certification 1:1** :
les valeurs, durées, formes de zone et effets de scène restent des adaptations.
La demande de couvrir chaque personnage et chaque boss n'est pas déclarée finie.

La priorité suivante est l'écriture des profils manquants, par incarnation et par
faction, avec sprites/chorégraphies réellement comparés aux sources. Ne pas
transformer les entrées non combattantes ou les noms de phases de boss en
combattants magiques pour faire artificiellement monter ce compteur.

## Sources et statut de fidélité

Les identités d'objets et kits sont celles de `heroes.js`, `expandedUniverses.js`,
`canonFollowupSourceKits.js` et `smashAbilityProfiles.js` sur la base ci-dessus.
Le contrat de l'objet FFVII existant indique treize Chevaliers. Il ne remplace
pas une validation vidéo de l'animation de 1997 ni les coûts MP d'origine.

Références primaires consultées pour délimiter, et non certifier, le chantier :
- Valve : https://github.com/ValveSoftware/halflife/blob/master/dlls/squeakgrenade.cpp
  (comportements du snark ; durées/dégâts Nexus distincts).
- Square Enix : https://na.finalfantasy.com/topics/207
  (invocations de **Remake**, non preuve des Chevaliers/animation de 1997).
- Yu-Gi-Oh! : https://www.yugioh.com/cards/swords-of-revealing-light
  (référence de carte ; aucune invocation supplémentaire n'est attribuée à tous
  les personnages Yu-Gi-Oh! dans ce lot).

## Recette

- `node --test scripts/signatureCombat.test.mjs` : tests réels des deux moteurs,
  des coûts, interruptions, doubles entrées, supers P2 et immunité de RAAM.
- `node scripts/signatureCoverage.mjs` : inventaire exhaustif des définitions.
- `scripts/browserSignatureCombat.py` : GameCanvas réel, fenêtres 1280/390,
  FR/EN, objet équipé et super Liquid Snake, pause/reprise, usage et démontage.
  Les états de départ sont synthétiques et uniquement dans une page de fixtures.
- `.github/workflows/signature-combat.yml` : CI permanente en lecture seule.

Le navigateur local refuse les navigations (`ERR_BLOCKED_BY_ADMINISTRATOR`). Les
captures locales en échec ne sont pas des preuves de gameplay. Les résultats de
la CI doivent être lus séparément avant de déclarer les parcours validés.
La compilation des sources ne remplace pas le prébuild intégral des bitmaps.
