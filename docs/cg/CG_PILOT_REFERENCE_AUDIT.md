# Audit des références CG — pilote

Date de l’audit : 2026-08-01
Périmètre : socle CG 01–08 (`characterSolo`, `weaponSolo`, `decorSolo`, `coherentScene`, `actionScene`, `introPose`, `victoryPose`, `defeatPose`).

## Verdict

Les spécifications décrivent un plafond éditorial, pas un ordre de génération massive : **802 fiches personnages × 15 emplacements de cartes/CG = 12 030 CG potentielles**. Ce chiffre ne constitue ni un minimum de production ni une autorisation de lancer 12 030 images. Plusieurs variantes sont explicitement `NON APPLICABLE` selon le personnage, l’âge, le consentement, le lore ou les droits.

La tranche sûre du pilote est donc volontairement limitée à six dossiers déjà enrichis : **Ancre, Master Chief, Thel ’Vadam / Arbiter, Albert Wesker, Jill Valentine et Leon S. Kennedy**. « Sûre » signifie ici « assez documentée pour une revue fermée du pilote »; cela ne signifie ni visuel officiel, ni approbation automatique de toutes les futures CG.

Cette tranche est livrée : **48 CG sources OpenAI** (six personnages × huit types), chacune déclinée en master et miniature, soit **144 fichiers image de production**. Les CG 01–04 et 06–08 forment 42 entrées `Canon`; les six CG 05, fondées sur des capacités propres à *Multiverse Breach*, sont classées `Nexus` et ne sont jamais présentées comme canon Halo ou Resident Evil.

## Source des chiffres et portée réelle des specs

Le paquet source indique :

- `13_MANIFESTES/STATISTIQUES.txt` : 802 fiches personnages;
- `04_CG/01_CATALOGUE_CG.txt` et les fiches personnages : une famille pouvant aller jusqu’à 15 cartes/CG;
- `12_IMPLEMENTATION/06_STRATEGIE_DE_GENERATION_MASSIVE.txt` : plus de 12 000 images possibles et interdiction de tout lancer en une fois;
- le paquet n’embarque aucune image : les textes décrivent le lore et les intentions, mais ne prouvent pas à eux seuls un visage, une morphologie, un costume ou un équipement.

Le calcul exact est `802 × 15 = 12 030`. Il faut conserver cette distinction entre **capacité théorique** et **assets réellement référencés, approuvés puis produits**.

## Vague pilote et gates

La vague source est formulée de manière trop générale : « 3 personnages Nexus, Halo, Resident Evil, un nouvel univers ». Elle ne fixe ni les noms, ni la répartition exacte entre univers, ni les versions de continuité, ni une référence visuelle exploitable pour le nouvel univers. Cette phrase ne suffit donc pas à ouvrir la génération d’un nouveau personnage.

Les gates des specs restent obligatoires et séquentiels :

1. dossier de références approuvé;
2. référence personnage (`characterReference`) approuvée;
3. prompt linté, sans texte, logo, copie d’affiche ou likeness réel;
4. génération OpenAI;
5. QA de composition, anatomie, équipement et transparence/alpha lorsqu’elle s’applique;
6. revue lore et continuité;
7. publication seulement après validation.

Une image rejetée ne reçoit jamais de chemin de production. Le signal utilisateur `Continue` a approuvé les six CG 01; leurs chemins et empreintes exactes sont consignés dans `docs/cg/character-reference-approvals.json`. Les rendus rejetés pendant CG 02–05 sont documentés dans les registres de prompts et absents de `public/cg/`.

## Pourquoi seulement ces six dossiers

Ces six entrées disposent ensemble d’un nom non générique, d’un `continuityId` précis, d’un verrou écrit de silhouette/costume/équipement, d’une référence locale de projet, d’un prompt traçable et, pour les franchises tierces, de faits recoupés sur une source officielle. Elles couvrent trois cas utiles au pilote : personnage original intégralement maîtrisé, identité casquée/non humaine, et personnages humains dont il faut exclure toute ressemblance d’acteur ou de scan-model.

Le contrôle bitmap existant ne doit toutefois pas être confondu avec une approbation lore : Ancre, Chief, Arbiter, Jill et Leon disposaient d’une référence locale techniquement détaillée; l’ancien sprite Wesker était classé comme placeholder plat et ne pouvait pas faire autorité. Pour Wesker, le verrou écrit Capcom et la QA humaine ont primé; sa CG 01 humaine pré-Uroboros est désormais la référence approuvée utilisée par les CG 02–05. Toute tenue locale en conflit avec le verrou écrit reste ignorée.

## Continuités exactes retenues

| Personnage | `continuityId` | Verrou de continuité du pilote |
|---|---|---|
| Ancre | `project-canon` | Ancre vivante du Nexus, anonyme, armure segmentée charbon/noire, casque intégral à fine visière jaune, longs pans fendus, bottes lourdes et gantelet d’énergie cyan sur le bras avant/droit. Aucun visage inventé, aucune arme ajoutée. |
| Master Chief | `halo-infinite-gen3` | John-117 dans *Halo Infinite*, casque fermé, MJOLNIR Mark VI [GEN3] olive usée, sous-combinaison sombre, visière or et proportions Spartan-II; un fusil d’assaut MA40 complet. Aucun mélange Mark V, GEN2 ou série télévisée. |
| Thel ’Vadam / Arbiter | `halo-2-anniversary-classic` | Thel ’Vadam dans son apparence classique de *Halo 2: Anniversary*, anatomie Sangheili digitigrade et mandibules en quatre parties, harnais d’Arbiter principalement argenté/gunmetal avec de fins liserés or, et une seule épée à énergie cyan complète. Aucune fusion avec la livrée Kaidon de *Halo 5*. |
| Albert Wesker | `resident-evil-5-human` | *Resident Evil 5*, forme humaine pré-Uroboros : cheveux blonds plaqués, lunettes noires opaques, long manteau tactique noir, gants et un seul pistolet Samurai Edge. Aucun tentacule, organisme Uroboros ou mutation. |
| Jill Valentine | `resident-evil-1-hd-stars` | *Resident Evil* original / HD Remaster, S.T.A.R.S. Alpha : béret bleu, cheveux bruns courts, uniforme tactique bleu-gris, épaulières, ceinture, holster et un seul pistolet. Aucune tenue débardeur de *Resident Evil 3*, aucun visage d’actrice ou de modèle. |
| Leon S. Kennedy | `resident-evil-2-1998` | *Resident Evil 2* en 1998, jeune policier rookie lors de son premier jour à Raccoon City : cheveux blond cendré, uniforme tactique marine, sous-haut gris, protections, holster et Matilda/pistolet de service d’époque. Aucun mélange avec l’agent expérimenté de *Resident Evil 4*, aucun marquage R.P.D. lisible. |

## Références web primaires officielles

Seules les sources officielles Halo Waypoint et Capcom ci-dessous servent à vérifier les faits. Elles ne servent jamais de banque de pixels.

| Personnage | Faits contrôlés | Source officielle |
|---|---|---|
| Master Chief | John-117, variantes MJOLNIR, Mark VI [GEN3] de *Halo Infinite*, arme MA40 et M6 cross-era réservé à la scène Nexus. | [Halo Waypoint — Master Class](https://www.halowaypoint.com/news/master-class) · [Halo Support — Spring Update 2025](https://support.halowaypoint.com/hc/en-us/articles/34335369079700-Halo-Infinite-Spring-Update-2025-Patch-Notes) · [Halo Waypoint — Vertical Umbrage](https://www.halowaypoint.com/news/halo-4-vertical-umbrage) |
| Thel ’Vadam / Arbiter | Apparence classique de Thel dans *Halo 2: Anniversary*, harnais Sangheili et épée à énergie, distingués de la livrée Kaidon de *Halo 5*. | [Halo Waypoint — Canon Fodder: Fighting Words](https://www.halowaypoint.com/news/canon-fodder-fighting-words) · [Halo Waypoint — Halo 2: Twentieth Anniversary](https://www.halowaypoint.com/news/halo-2-twentieth-anniversary) |
| Albert Wesker | Continuité RE5, lunettes, cheveux blonds coiffés en arrière, vêtements sombres et évolution de sa tenue noire. | [Capcom Resident Evil Portal — Albert Wesker (RE5)](https://game.capcom.com/residentevil/uk/exfile-2-9.html) · [Capcom News — The Evolution of Wesker](https://news.capcomusa.com/lets/browse/resident-evil-20th-anniversary-the-evolution-of-wesker) |
| Jill Valentine | S.T.A.R.S. Alpha, incident du manoir et présence dans *Resident Evil HD Remaster*. | [Capcom Resident Evil Portal — Jill Valentine: Famed Operator, Storied Survivor](https://game.capcom.com/residentevil/en/umbrella-20240607180000.html) · [Capcom — manuel officiel Resident Evil HD Remaster](https://game.capcom.com/manual/bio1/) |
| Leon S. Kennedy | Première apparition dans *Resident Evil 2* en 1998, statut de jeune policier rookie avant sa carrière d’agent. | [Capcom Resident Evil Portal — Leon S. Kennedy: Ass-kicking Agent Extraordinaire](https://game.capcom.com/residentevil/en/umbrella-20230324110000.html) · [Capcom — RE History](https://game.capcom.com/residentevil/it/re-history.html) |

Vérification du 2026-08-01 : les pages Halo Waypoint ont été ouvertes et lues directement. Les pages Capcom ci-dessus ont été retrouvées dans l’index récent de leurs sites officiels; `game.capcom.com` renvoie parfois un `403 Forbidden` au lecteur automatisé. Cette protection anti-bot n’est pas interprétée comme une URL morte, mais impose une dernière ouverture manuelle avant publication finale.

Ancre n’a aucune référence web tierce : son autorité est le canon local du projet (`src/game/ocCampaign.js` et les références visuelles internes approuvées).

## Droits et méthode visuelle

- Aucun visuel officiel Halo ou Resident Evil n’a été copié, téléchargé, recadré, tracé, installé dans le projet ou utilisé comme composition à reproduire.
- Les pages officielles servent uniquement à verrouiller les faits de continuité.
- Les bitmaps du pilote sont des **fan-arts originaux non officiels créés avec OpenAI**; Ancre reste une illustration originale du projet.
- Les références locales servent uniquement à l’identité, la silhouette, le costume et l’équipement. La pose, le cadrage, l’éclairage et le décor sont de nouvelles compositions.
- Sont interdits : affiche ou screenshot recréé, logo, texte ou insigne lisible, watermark, likeness d’acteur/personne réelle et présentation laissant croire à un asset officiel.

## Blocage des nouveaux univers

Toute CG personnage d’un nouvel univers reste bloquée (`generationAllowed = false`) si les sources approuvées ne révèlent ou ne définissent pas clairement :

- l’identité visuelle du visage **ou** le masque/casque canonique qui doit le cacher;
- la morphologie et les proportions du corps entier;
- le costume de la continuité choisie;
- l’équipement exact et sa manière plausible d’être porté.

Une fiche textuelle générique, un nom, une catégorie de gameplay ou une palette ne suffisent pas. Pour une identité canoniquement masquée comme Ancre ou Chief, il est interdit d’inventer un visage : le casque fermé devient le verrou d’identité. Pour une personne réelle, un musicien ou un personnage incarné, aucune biométrie de l’interprète n’est générée; il faut une Persona de Résonance originale ou une référence fictive explicitement validée.

## Gates CG 02 à 08 — ouvertes et terminées

Le premier signal `Continue` a ouvert CG 02–05 après approbation formelle des six CG 01. Le signal `Continue` suivant a approuvé le manifeste exact de 30 entrées comme baseline et ouvert uniquement CG 06–08; cette décision est consignée dans `docs/cg/wave-approvals.json`. Chaque dossier a conservé la même continuité, le même `characterReferenceId` et la même source PNG CG 01 pour les éléments suivants :

1. CG 02 — `weaponSolo` / Signature Weapon;
2. CG 03 — `decorSolo` / Decor;
3. CG 04 — `coherentScene` / Coherent Scene;
4. CG 05 — `actionScene` / Action Scene.
5. CG 06 — `introPose` / arrivée in-lore;
6. CG 07 — `victoryPose` / victoire in-lore;
7. CG 08 — `defeatPose` / défaite ou repli in-lore, digne et non humiliant.

Les 42 nouvelles sources produites après CG 01 sont toutes des PNG RGB natifs 1086×1448 au ratio exact 3:4. Les masters 1536×2048, miniatures 384×512, hashes, prompts exacts et QA sont vérifiés par le manifeste et les tests CG. Pour CG 08, aucun personnage n’est représenté mort, démembré, sexualisé ou humilié : le langage visuel reste celui d’un regroupement ou d’un repli plausible dans sa continuité.

## Ouverture séparée CG09–CG15

Le nouveau signal `Continue` a approuvé séparément la baseline exacte CG01–CG08 et ouvert **35 variantes applicables** CG09–CG15. Sept cellules restent `N/A` pour cohérence, âge ou identité. La matrice, la validation manuelle du contenu, les références temporelles et les exclusions sont consignées dans [`variant-wave-approvals.json`](./variant-wave-approvals.json) et [`CG_VARIANT_WAVE_AUDIT.md`](./CG_VARIANT_WAVE_AUDIT.md). Tout nouvel univers demeure exclu.
