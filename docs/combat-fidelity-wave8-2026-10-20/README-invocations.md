# Renforts du roster — vague 8, 20 octobre 2026

Quatre partenaires réels du roster disposent de 16 nouvelles poses chacun : **64 poses et 4 PNG**, répartis en arrivée, préparation, attaque et retrait. Le catalogue détaillé atteint 11 atlas de 16 poses, soit 176 poses. Les sept anciennes entrées natives et les 28 feuilles historiques à quatre poses restent préservées.

| Appelant réellement testé | Partenaire et action | Version choisie | Type |
| --- | --- | --- | --- |
| Robin (`robin_tt`) | Cyborg (`cyborg_tt`) — Sonic Cannon de Cyborg | Teen Titans, série animée de 2003 | Renfort |
| Majima (`majima_yakuza`) | Kazuma Kiryu (`kiryu_yakuza`) — Coup du Dragon de Dojima | Yakuza Kiwami, 2016, combat à mains nues | Renfort |
| Blade Wolf (`blade_wolf_mgr`) | Raiden (`raiden_mgr`) — Mode lame — Zandatsu | Metal Gear Rising: Revengeance, 2013, corps amélioré après le prologue et lame HF personnelle | Renfort |
| Marcille (`marcille_meshi`) | Laios Touden (`laios_meshi`) — Coupe de Kensuke | Dungeon Meshi, anime de 2024, équipe d’exploration humaine | Renfort |

Il s’agit de partenaires physiques. Cyborg utilise son propre canon intégré ; Kiryu ne manifeste aucun dragon littéral ; Raiden ne reçoit ni Murasama, ni extraction, ni soin, ni arrêt du temps ; Laios utilise Kensuke sans projectile alimentaire ou rayon magique. Chaque appelant conserve sa propre identité et appelle un autre personnage : Cyborg lui-même n’appelle pas une seconde copie de Cyborg.

**La fidélité visuelle 1:1 n’est pas certifiée.** Les [références consultées](summon-sources/source-access.txt), [prompts et originaux](summon-sources/), [enregistrements de génération](summon-generation-records.json) et [provenance](summon-provenance.json) documentent les quatre générations natives et leurs limites. Les sources officielles ouvertes étayent certains rôles et versions ; les détails de canon, armure et proportions ne sont pas certifiés par une simple référence. L’accès à la page officielle Dungeon Meshi a été bloqué ; un extrait indexé n’est pas présenté comme une page complète lue. Les images sont des adaptations nouvelles, sans frame officielle importée.

Les feuilles RGBA font 2048 × 1024 et contiennent quatre rangées de quatre **cellules 512 × 256**. Le format large conserve la portée des épées avec un corps de référence de 190 pixels, une ligne de base 244, des marges transparentes de dix pixels et une même échelle dans les quatre phases. Les 64 cellules réellement décodées ont des empreintes distinctes et concordantes. Le rendu conserve le rapport 2:1 ; les poses accroupies ne sont pas agrandies séparément. Les quatre planches ont été inspectées : [Cyborg](summon-cyborg-contact.png), [Kiryu](summon-kiryu-contact.png), [Raiden](summon-raiden-contact.png), [Laios](summon-laios-contact.png).

Les **10 tests W8** couvrent les quatre identités, les clés univers/partenaire/action, le type `reinforcement`, le rôle du partenaire et la concordance de `performer`, `sourceHeroId` et `action.sourceHeroId`. Ils rejettent les identités croisées, sources étrangères, mauvais univers, fausses actions, mauvais rôles et substitutions d’asset d’entité. Un identifiant de combat préfixé reste accepté uniquement avec l’identifiant source exact. Ces partenaires ne nécessitent aucun `entityRender.asset`. Si leur feuille native n’est pas prête, le moteur dessine leur véritable sprite du roster ; le test compare les chemins effectivement enregistrés, sans emprunter le corps de l’appelant ou d’une autre entité.

Dans les deux camps, les tests dessinent les seize cellules sur la vraie horloge du moteur, sans mutation de l’état de combat. La colonne 2 de la rangée d’attaque, index 10, commence exactement au tick d’impact ; les colonnes 0 et 1 le précèdent. Sélectionner puis annuler reste gratuit. Confirmer consomme une fois 100 ATB et 100 de charge, puis interdit une nouvelle utilisation dans le combat. Pause et file d’actions sont figées ; les cibles engagées ne sont pas remplacées après leur mort. Aucun impact tardif ne survient après `dispose`, fin de scène, défaite, retrait ou mort de l’appelant.

Les ancres du canon de Cyborg sont projetées depuis les pixels de chaque phase et colonne, dans les deux orientations. Le sampler de simulation reste intact ; une cellule sans ancre ne reçoit pas de fausse charge ou origine de rayon. Les captures J1 et J2 montrent le rayon partant du canon. Les trajectoires des **28 anciennes chorégraphies et leurs 280 échantillons**, leurs noms de parcours, références et types d’effets sont identiques à la baseline. Les sept anciennes métadonnées natives complètes, PNG, originaux, références, registres W5/W6/W7 et provenances sont comparés aux empreintes capturées. Les 15 tests historiques W6/W7 restent verts avec les 10 W8 : **25 tests, aucun échec**.

Le [harness Chromium reproductible](browser/summon-wave8-browser.mjs) monte le **vrai GameCanvas huit fois**, quatre partenaires × deux camps. Chaque parcours utilise bouton → annulation gratuite → touche U en J1 ou PavNum 5 en J2 → confirmation des cibles → pause via `sessionPaused` → progression réelle → reprise → commande désactivée après utilisation. Le harness réutilise les URL Vite exactes de React et du moteur. Il suspend la simulation à la confirmation pour ne manquer aucune cellule, puis appelle les vraies mises à jour ; il ne remplace ni calcul de dégâts, ni coûts, ni sélection de cibles.

Le [résultat navigateur](browser/summon-wave8-result.json) observe **64 cellules en J1 et 64 en J2**, chacune dans le bon sens et au format 2:1. Les 64 cellules sources donnent 128 vérifications miroir RGBA exécutées, une fois par parcours de chaque camp : ce chiffre ne représente pas 128 nouvelles poses. Les huit parcours n’ont qu’un changement de PV, au tick 99 et à la colonne d’impact, et aucune erreur JavaScript de page.

| Partenaire | Capture J1 | Capture J2 |
| --- | --- | --- |
| Cyborg | [Impact J1](browser/summon-wave8-cyborg-player-impact.png) | [Impact J2](browser/summon-wave8-cyborg-enemy-impact.png) |
| Kiryu | [Impact J1](browser/summon-wave8-kiryu-player-impact.png) | [Impact J2](browser/summon-wave8-kiryu-enemy-impact.png) |
| Raiden | [Impact J1](browser/summon-wave8-raiden-player-impact.png) | [Impact J2](browser/summon-wave8-raiden-enemy-impact.png) |
| Laios | [Impact J1](browser/summon-wave8-laios-player-impact.png) | [Impact J2](browser/summon-wave8-laios-enemy-impact.png) |

Le builder `--check` reconstruit exactement les quatre feuilles et le registre. Lint ciblé passé. [Validation ciblée](browser/summon-wave8-validation.json). La compilation et la validation globale sont consignées séparément par l’intégration principale.

Commandes depuis la racine du dépôt :

```sh
node scripts/buildSummonAnimationsWave8.mjs --check
node --test scripts/summonAnimationWave8.test.mjs scripts/summonAnimationWave7.test.mjs scripts/summonAnimationWave6.test.mjs
node docs/combat-fidelity-wave8-2026-10-20/browser/summon-wave8-browser.mjs
npx oxlint scripts/summonAnimationWave8.test.mjs docs/combat-fidelity-wave8-2026-10-20/browser/summon-wave8-browser.mjs
```

Le navigateur utilise le serveur local 5188 ; `SUMMON_ANIMATION_REVIEW_URL` peut choisir une autre URL. Aucun fichier de production n’a été modifié par ce lot de QA.
