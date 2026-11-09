# Corrections du réaudit — 19 octobre 2026

Base : `c4ea0b8867439bb1e01e2462fb6d36517d0b13f3` (fusion de la PR 3).
Les arbres source `src` et `scripts` ont été reconstitués depuis les sources de
la conversation, puis contrôlés contre les arbres Git du commit :
`d286f44fd16cb11f2bd75b189a376821a2cddb35` et
`27ec5a88b5cb7411a6b4b5a109b302cc28902585`. Les arbres API et Supabase sont inchangés.
Aucune écriture de compte, sauvegarde réelle, SQL, secret ou paramètre de production.

## Défauts traités

| Audit | Correction | Preuve / limite |
| --- | --- | --- |
| A01 | Le prébuild vérifie le vrai répartiteur Tactics : face, flanc, dos, aperçu, PV retirés et texte de combat, pour huit orientations. | `tacticsFacingRuntime.test.mjs`. L'ancienne recherche d'une instruction disparue n'est plus une condition de publication. Aucun contrôle d'assets supprimé. |
| A02 | Nouveau workflow `Full production build` : checkout complet avec LFS, `npm ci`, puis **`npm run build`**, pas seulement Vite. | Le résultat de cette CI fait foi pour le prébuild intégral ; le checkout local ne possède pas toutes les images. |
| A03 | `engines.node = 22.x` dans le package et le lockfile ; `.nvmrc` 22 ; CI sur Node 22. | Alignement de la version majeure. Les versions mineures gérées par les fournisseurs ne sont pas figées à l'identique. |
| A04 | Identifiant de build repliable sur l'écran titre, également dans `dist/build-info.json`. | Même donnée compilée pour le JSON et l'interface. Aucune variable d'environnement complète ni donnée privée exportée. La protection administrative de master n'est pas modifiée par une PR. |
| A05 | Le super du Medic dans Fighter active une protection personnelle à l'impact de l'action, au lieu de frapper. | Un seul acteur actif par camp : **soi uniquement**, aucune protection des réservistes. 100 points ; huit secondes de jeu actif. |
| A06 | Le Medic dispose d'un soutien tactique ciblé : soi et au plus un patient, trois cases Manhattan, ligne de vue. | Coût de spéciale et sélection natifs préservés. Aperçu offensif à zéro, cible ennemie refusée, durée en secondes actives et non en tours. |
| A07 | Les commandes RPG déclarées des univers originaux sont alignées sur l'économie réellement livrée : une jauge pleine de 100 ATB. | Règle centralisée. Les anciens 35/65/45 et promesses de durées en tours ne sont plus annoncés comme appliqués. **Aucun rééquilibrage vers des coûts fractionnaires n'est revendiqué.** |
| A08 | Correspondance explicite entre contrat, moteur et test dans ce rapport. | Les autres blocs de production restent à intégrer : cette PR ne marque pas les combos, hitboxes ou phases non consommées comme terminés. |
| A09 | Notification immédiate du KO au contrôleur de soutien avant une résurrection possible. | Lanceur et patient, RPG/Smash/Tactics. Deux Medics conservent des liens indépendants. Aucun effet ancien ne revient après résurrection. |
| A10 | Les étapes actives sont comptées individuellement avant chaque update du lot. | Gels de cinématique, pause, ciblage, introduction et fin exclus. Apparitions et charge de super de terrain suivent les étapes actives ; présentation indépendante. |
| A11 | Un identifiant de héros erroné fait échouer la fixture du codex ; les tests vérifient l'identité demandée/résolue. | Le défaut Cloud n'existe que lorsque le paramètre est réellement omis. Une capture échouée ne masque plus l'erreur initiale du scénario. |

## Règles du Medic préservées

Le contrôleur existant est réutilisé, avec géométrie de grille injectée dans
Tactics et les listes de combattants de Fighter. Ni soin, ni résurrection,
ni bonus critique, ni immunité aux sources environnementales inconnues ne sont
ajoutés. La projection/pression subie reste possible dans Fighter.

Attaquer rompt la protection du lanceur, sans retirer celle d'un second Medic.
En Tactics, sortir de portée ou perdre la ligne de vue déconnecte le patient,
sans le remplacer et sans le reconnecter silencieusement. Le lanceur conserve
sa protection jusqu'à expiration, attaque ou KO. Dans Fighter, un changement de
personnage termine la protection : la réserve ne conserve pas une armure gratuite.
Les armes Kritzkrieg, Quick-Fix et Vaccinator ne reçoivent ni cette invulnérabilité,
ni une attaque offensive de secours sous le nom ÜberCharge. Leur adaptation reste
à produire. Les contrats personnalisés propres au mode ne sont pas remplacés.

## Contrat → moteur → preuve

| Contrat | Consommateur | Test |
| --- | --- | --- |
| Orientation sur huit directions | `EngineTactics.getDamageModifiers/applyDamage/getDamagePreview` | `tacticsFacingRuntime.test.mjs` |
| Mort du lanceur/patient | `signatureDirector.applyDamage`, `EngineTactics.invalidateActorActions` | `reauditCombat.test.mjs` |
| Uber personnelle Fighter | `tryAction/updateActions/applyHit/requestTag/finish` | P1, P2, variantes, interruption, changement de personnage, fin |
| Uber tactique | `tacticsSupport`, ciblage natif, répartiteur, aperçu et dessin du lien | Cible ennemie, patient, tiers, ligne de vue, pause et expiration |
| Coût ATB livré | `RPG_ACTION_ATB_COST`, `EngineRpg.canUseAction`, commandes OC | Nyra : refus sous le seuil, acceptation à 100, dépense à zéro |
| Temps de jeu actif | `combatActivity`, boucle à pas fixe de `GameCanvas` | Lot traversant le début et la fin d'un gel, sans rattrapage fictif |
| Version affichée / JSON | Configuration Vite et `BuildIdentity` | SHA valide, entrée malformée, absence Git, absence de fuite de secrets |

## Validation

Exécuter :

```sh
npm ci
npm run test:reaudit
node --test --test-concurrency=1 scripts/signature*.test.mjs
npm run build
```

Les nouveaux tests de réaudit font partie de la CI de fiabilité **et** du
prébuild de publication. Les suites historiques restent conservées. Les groupes
se recouvrent : ne pas les additionner comme un nombre unique de cas.
Le workflow intégral archive son journal, son commit et son identifiant de build.
Aucune nouvelle sortie n'est déclarée publiée tant que Vercel ne l'a pas confirmée.

Les scénarios utilisent les vrais moteurs avec des états préparés et des
particules sans rendu dans les tests Node. Ils ne sont pas une campagne entière,
ni une validation artistique ou un test sur appareil physique. Les validations
locales utilisant des fichiers d'images non rapatriés ne certifient pas le
prébuild intégral. Le résultat de `Full production build` doit être vérifié.

## Toujours ouverts

A04 : rendre le contrôle de livraison obligatoire requiert une configuration
GitHub séparée. A08 : intégration complète des spécifications de mouvements et
phases. A12–A20 : assets, fidélité et signatures restantes, variantes du Medic,
Gestalt, Nihilanth et finale du Sulaco. A21–A22 : premier parcours pédagogique
complet et lieux individualisés de la Cité. A23 : découpage et mesures de
performances sur appareils cibles. A24 : parcours continus et comptes de test
réels, emails et synchronisation entre appareils.

Aucun nouveau bitmap, moveset complet, profil supplémentaire parmi les 4 650
signatures absentes ou validation 1:1 n'est revendiqué. Le classeur original
non retrouvé n'est pas remplacé par des lignes inventées.
