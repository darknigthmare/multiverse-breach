# Présentation — reprise d’un lot de 40, Revan KOTOR I

Les [40 identités réservées](reserved-actors.json) gardent leurs tâches ouvertes. Ce chantier corrige la présentation de **Revan KOTOR I** ; les 39 autres acteurs ne reçoivent aucun clip nouveau. Aucun PNG, costume, kit, chiffre de combat ou identifiant de sauvegarde n’est remplacé. Aucun dossier entier ni constat global `ANIMATION_AND_VISUAL_REVIEW` n’est déclaré terminé.

## Défauts reproduits et comportement livré

Le catalogue W13 crée ses scènes dynamiquement depuis `COMBAT_SOURCE_DEFINITIONS_WAVE13`. Son ancien sampler sélectionnait l’atlas de phases W13 de **32 cellules, quatre colonnes et huit rangées**. Le renderer refusait cet atlas pour le Revan courant et dessinait à sa place le correctif autorisé de **16 cellules, quatre rangées**. La victoire demandait alors la rangée 5, ramenée à 3 : Revan prenait une pose de réaction au coup, sans son sabre visible, pendant sa victoire. Les [échantillons Git 9899](validation/baseline-samples.json) et les vrais appels `drawImage` du navigateur reproduisent ce raccord incorrect. L’ancienne famille de mouvements mêlée à 48 cellules est une autre famille ; elle n’est pas l’atlas W13 de huit rangées.

Trois clips utilisent maintenant exclusivement les quatre rangées réellement autorisées :

| Phase | Mouvement réellement joué | Moteurs raccordés |
| --- | --- | --- |
| Entrée | Les quatre poses de déplacement accompagnent une avancée de 28 pixels, puis Revan reprend sa garde, sabre rouge abaissé. | Fighter et Smash, deux camps |
| Victoire | Les quatre poses de garde sont sélectionnées explicitement sur la rangée idle ; aucune pose hit ou nouvelle attaque. | Fighter et Smash, deux camps |
| Sortie | Revan se tourne, s’éloigne horizontalement et sort progressivement du cadre. | Fighter, deux camps |

Ce sont des déplacements et transitions écrits pour le moteur sur des images déjà livrées. Ils ne constituent ni un nouvel atlas de phases ni une reproduction du montage de KOTOR. Les phases sans dessin dédié reviennent au rendu ordinaire ; aucune finale, fatalité, défaite ou pose de manche native n’est ajoutée en renommant idle. Les [échantillons courants](validation/current-samples.json) distinguent ces trois clips des phases non livrées.

La garde de sélection vérifie **l’acteur original avant toute normalisation d’ID**. Un clone technique tel que `combat:revan:2` / `sourceHeroId:darth_revan`, une incarnation divergente ou des alias contradictoires ne peuvent pas obtenir les nouveaux clips. Un acteur toujours en quarantaine sans correctif autorisé ne reçoit aucun script ni échantillon qui pourrait rétablir son corps par normalisation. La projection P2 légitime de Smash utilise le même acteur visuel canonique que son renderer ; l’API publique du catalogue reste stricte.

Un second défaut concernait la sortie du match : un adversaire à zéro HP recevait lui aussi `outro` et pouvait repartir en courant. Il conserve désormais sa défaite. Son horloge de pose reste à la fin du clip de défaite, partagée par le snapshot et le dessin : il ne se relève pas pour rejouer sa chute. Un adversaire vivant après expiration du temps conserve sa sortie normale. Les dégâts, ressources, résultats et récompenses ne sont pas recalculés par ces présentations.

## Images, références et limites

Le seul bitmap Revan sélectionné reste `/sprites/generated/combat-character-corrections-wave13-part-b/darth_revan.png`, SHA-256 `c9f46d3fc0e0144afab53632c1be6d07508975645b2b2bfff30478e5e5fb1fbf`, 1024 × 1024, baseline 244. Ses octets, sa provenance et ses règles de quarantaine sont ceux de la [revue précédente](../../p0-p1-p2-continuation-2026-11-13/p0-lot-004/README.md). Le navigateur reçoit ces mêmes octets, et les captures du corps utilisent le vrai renderer.

La [référence 501st](https://crls.501st.com/tfe/darth-revan-kotor-i-and-ii) appuie le sabre rouge unique et les grandes composantes du costume KOTOR I ; elle ne prouve ni le mouvement original, ni les durées, ni tous les détails du masque. Les verrous de costume, les animations complètes de mêlée, les autres directions et les états non dessinés restent à revoir. Toutes les approbations 1:1 restent fausses.

La [planche de diagnostic](diagnostic-current-poses.png), avec son [inventaire d’entrées](diagnostic-current-poses.json), conserve les premières cellules effectivement inspectées pour choisir un acteur utilisable. Elle montre aussi pourquoi le bitmap civil de Batman TDK n’a pas été animé. Sa mise en quarantaine est un chantier distinct piloté par l’agent principal ; elle n’est pas comptée comme une image livrée ici.

## Vérification exécutée

| Contrôle | Résultat et portée |
| --- | --- |
| Régression avant | **0/5** sur les trois vrais modules Git `98991b161`, avec le même code de test final : raccord des trois clips, garde d’identité et K.O./sortie. [TAP](validation/baseline-final-tests.tap), [loader conservant les URL de modules](baseline_presentation_loader.mjs). Ces échecs sont attendus sur les sources précédentes. |
| Tests courants | **17/17** : clips, source exacte, alias refusés jusqu’au sampler, horloge/pause, deux camps Fighter et Smash, première manche sans récompense, timeout vivant, K.O. maintenu, retour unique et destruction du moteur, plus les cinq tests historiques du correctif/quarantaine. [TAP](validation/final-runtime-tests.tap). |
| Régressions Fighter existantes | **7/7** avec leur vrai chargement Vite SSR : introductions, manches, reprise, finale/résultat/sortie et soutien. [TAP](validation/fighter-presentation-regressions.tap). |
| Navigateurs | **10/10**, 27 captures finales : Fighter et Smash, Revan joueur et adversaire, desktop et viewport 390, pause/reprise, K.O. et callback unique, puis clone technique avant/après. Zéro erreur HTTP/page dans ces cas. [Résultats et appels bitmap](validation/browser/results.json). |
| Compilations de fixture | Avant et après compilent les vrais moteurs, sans copie de `public` ni prébuild global. Trois modules de présentation Git sont substitués dans le seul build avant ; il ne s’agit pas d’une application historique complète. [Pins avant](validation/before-bundle.json), [pins après](validation/after-bundle.json). |
| Lint | Sortie 0, aucun diagnostic sur les sept fichiers de code/test/harness concernés. [Log](validation/lint.log). |

Le navigateur prépare les issues du duel et avance le vrai moteur à pas fixe ; ce n’est pas une partie de campagne entièrement jouée. Les captures mobile montrent ce harness Canvas dans un viewport de 390 pixels, sans certifier toute l’interface mobile du jeu. Les premiers TAP, l’erreur de fixture qui passait un tableau au lieu de `customRoster`, et l’étape avant maintien de la pose K.O. restent archivés. Ils ne sont pas ajoutés aux résultats finaux.

Les constats globaux de l’acteur restent suivis dans la réservation. Le correctif de raccord de présentation et le défaut de sortie K.O. sont des changements runtime vérifiés ; ils ne retirent pas à eux seuls la revue artistique P2 de tout le personnage.

## Reproduire

Sous Node 22 :

```sh
node --max-old-space-size=2048 --loader ./scripts/sourceSceneTestLoader.mjs --test --test-concurrency=1 scripts/reviewedRevanPresentation20261113.test.mjs scripts/reviewedRevanPresentationRuntime20261113.test.mjs scripts/reviewedRevanSprite.test.mjs
node --max-old-space-size=4096 docs/assets/p0-p1-p2-continuation-02-2026-11-13/presentation-040/build_fixture.mjs --baseline
node --max-old-space-size=4096 docs/assets/p0-p1-p2-continuation-02-2026-11-13/presentation-040/build_fixture.mjs
python scripts/serveSourceSceneArtFixture.py --port 4204 --build-dir /tmp/multiverse-revan-presentation-before
python scripts/serveSourceSceneArtFixture.py --port 4205 --build-dir /tmp/multiverse-revan-presentation-after
python docs/assets/p0-p1-p2-continuation-02-2026-11-13/presentation-040/browser_revan.py
```

Les deux serveurs de fixture sont à lancer dans des terminaux distincts avant le navigateur. Ils servent les PNG canoniques physiques ou les vrais blobs Git, sans hydrater un export massif.
