# Combats et animations — vague 2 du 18 octobre 2026

Cette vague ajoute **452 poses actives utilisées dans 15 PNG livrés**, cinq scripts de présentation FFVIII et 24 mécanismes de décor. Le [rapport actuel](current.md) et son [inventaire JSON](current.json) comparent les résultats à la [référence avant intégration](baseline.json).

| Ajout | Contenu livré |
| --- | --- |
| Présentations FFVIII | 8 atlas × 32 poses = **256 poses** pour Squall, Rinoa, Quistis, Seifer, Laguna, Zell, Selphie et Irvine. Chaque atlas couvre sept phases de présentation et le super, avec quatre poses par séquence. |
| Mêlée de Cloud | **45 états × 4 poses = 180 poses**, réparties dans six atlas : déplacements, sauts, défenses, attaques, charges et accroche au rebord. Les rangées transparentes inutilisées sont exclues du compte. |
| Sprite de base de Seifer | **16 poses corrigées** dans un PNG distinct, avec son manteau clair et Hyperion. Cette correction de base est comptée séparément de son atlas de présentation. |
| Scripts FFVIII | **5 personnages × 7 phases = 35 nouvelles paires personnage/phase** : Seifer, Laguna, Zell, Selphie et Irvine. |
| Décors | **24 mécanismes supplémentaires dans 12 univers** ; total : **41 mécanismes pour 24 univers**. Les 17 précédents sont conservés. |

Les décors ajoutent notamment le tram de Black Mesa, le treuil de bathysphère de Rapture, le carrousel de Lakeside, les relais du Nostromo et le palan de Fiorina. Cette vague utilise de la géométrie animée et cinq régions de fonds statiques compositées ; elle n’ajoute aucune séquence de frames officielle. Le [rapport des décors](../audits/stage-animation-mechanisms-2026-10-18.md) détaille les scènes, sources et résultats par mode pour les 525 univers. Les lieux précis priment sur les défauts, avec prise en charge de la pause et du mouvement réduit, sans nouveaux dégâts ni collisions.

## Sources et traçabilité

Les illustrations sont des créations OpenAI produites avec `image_gen`, puis découpées, normalisées et assemblées. Les références locales inspectées, prompts, images brutes, corrections retenues ou écartées, rangées utilisées et empreintes SHA-256 sont archivés :

- [Provenance FFVIII, partie A](part-a-provenance.json) : Squall, Rinoa, Quistis et Seifer ; sources et références dans [part-a-sources](part-a-sources/).
- [Provenance FFVIII, partie B](part-b-provenance.json) : Laguna, Zell, Selphie et Irvine ; [prompts](part-b-prompts/), [références](part-b-references/) et [sources](part-b-sources/), dont la correction de Laguna.
- [Provenance du sprite de base de Seifer](seifer-base-provenance.json) : ancienne référence, nouvelle identité et source générée conservées dans [seifer-base-sources](seifer-base-sources/).
- Cloud : [provenance des mouvements et défenses](cloud-sources/provenance.json), [archive des sources et prompts de combat](cloud-sources/source-archive-manifest.json), [revue technique](cloud-sources/technical-review.json) et [notes de reconstruction](cloud-sources/README.md). Les manifestes [mouvements](../../src/game/combat/cloudMeleeMotion.generated.json) et [combat](../../src/game/combat/cloudMeleeCombat.generated.json) relient les six atlas aux états réellement utilisés.

Les identifiants de modèle ou de génération non fournis par l’outil restent nuls. La [vérification ponctuelle des sources FFVIII](ff8-source-facts.json) confirme que Hyper Shot utilise les Pulse Ammo et vise une cible ; elle ne valide pas les poses, les timings ou l’ensemble du jeu à l’identique.

**La fidélité visuelle et mécanique 1:1 aux œuvres reste non certifiée.** Les dessins, trajectoires, durées et valeurs du moteur sont des adaptations documentées. Une illustration distincte, un script sourcé ou un test réussi ne constitue pas une comparaison validée avec les animations originales.

## Couverture restante et vérification

Sur les 1 911 héros, **1 895 restent sans atlas dédié de présentation** et **1 910 sans manifeste illustré complet des 45 états de Mêlée**. Sur les 525 univers, **501 restent sans mécanisme de décor ciblé** et conservent leur ambiance de base. Ces manques d’assets sont distincts de l’absence de certification 1:1.

La QA ciblée de cette vague rapporte **38 tests réussis**. Les contrôles portent notamment sur les cellules et empreintes, les rangées effectivement choisies par le renderer, les armes et ciblages FFVIII, les phases, les horloges, les miroirs, les ancrages de Cloud sur les plateformes fixes et mobiles, et la conservation des 17 anciens mécanismes. Les rendus navigateur des personnages passent ; le [contrôle Chromium des décors](../audits/stage-animation-wave2-browser-2026-10-18.json) vérifie les 24 ajouts et les cinq régions statiques, avec une [planche de rendu](../audits/stage-animation-wave2-browser-2026-10-18.png).

Les suites concernées incluent [combatFidelityWave2.test.mjs](../../scripts/combatFidelityWave2.test.mjs), [ff8SuperRuntimeWave2.test.mjs](../../scripts/ff8SuperRuntimeWave2.test.mjs) et [stageAnimationCatalog.test.mjs](../../scripts/stageAnimationCatalog.test.mjs). La [validation complète](validation.json) rapporte **836 tests réussis dans 17 suites**, aucun échec, ainsi qu’un lint et une compilation `npm run build` réussis. Les 52 images gérées sont présentes dans la version compilée avec les empreintes attendues ; le contrôle de chargement en production les affiche toutes sans erreur JavaScript. Le [journal complet](build.log) conserve les avertissements Vite sur la taille des bundles et le temps de préparation du dossier de sortie.

Les [résultats navigateur](browser-checks.json) conservent 1 024 dessins de présentation, 360 dessins des états de Cloud, huit ancrages de mains et 32 dessins du sprite de base de Seifer. Ils incluent les vrais parcours GameCanvas pour Omnislash, Desperado, l’invocation Ifrit et le combat en deux manches, ainsi que le clavier de Cloud pendant le saut, la chute, l’atterrissage et le demi-tour. Les [harness, captures et traces](browser/) sont archivés ; les modules de développement proviennent du serveur local sur le port 5188. Aucune erreur JavaScript n’a été relevée ; la requête externe Google Fonts bloquée par le proxy est consignée séparément.
