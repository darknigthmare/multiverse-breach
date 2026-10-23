# Lot 11 — 40 personnages, 23 octobre 2026

Le lot sélectionne Buffy saison 7, Harry Potter et le Prince de sang-mêlé, Stargate Atlantis saison 3, Stargate Universe saison 1, Borderlands 2009, Mad Max: Fury Road 2015, Le Cinquième Élément 1997 et Kaamelott Livre III. La [sélection préédition](batch-plan-before.json) conserve les quarante identités et leurs actions initiales.

- A : Buffy Summers, Willow Rosenberg, Rupert Giles, Xander Harris, Spike, Harry Potter, Hermione Granger, Ron Weasley, Albus Dumbledore, Severus Snape.
- B : John Sheppard, Rodney McKay, Teyla Emmagan, Ronon Dex, Elizabeth Weir, Nicholas Rush, Everett Young, Ronald Greer, Chloe Armstrong, Matthew Scott.
- C : Lilith, Mordecai, Roland, Brick, Claptrap, Mad Max, Furiosa, Nux, Toast the Knowing, Capable.
- D : Korben Dallas, Leeloo, Ruby Rhod, Jean-Baptiste Emanuel Zorg, Vito Cornelius, Arthur Pendragon, Perceval, Karadoc, Leodagan, Lancelot.

Livraison réellement enregistrée : **37 atlas complets de 32 poses**, **37 bases de 16 poses**, **2 manifestes Mêlée de 45 états** et **7 renforts de 16 poses**. Les nouveaux atlas partiels sont suivis séparément : 0. Ces fichiers représentent **2248 poses natives dans 93 nouveaux PNG**. Les images refusées, les captures de contrôle et les poses anciennes adaptées sont exclues de ce total. Les quarante recettes couvrent chacune sept phases de présentation ; elles ne signifient pas quarante corps natifs nouveaux.

Harry, Hermione et Rogue ont reçu des refus de génération explicites. Aucun nouvel atlas32 ou base16 n’est livré pour eux. Le renfort d’Hermione conserve un repli accepté existant, sans nouveau16 ni geste défensif natif inventé. Ses poses anciennes adaptées et celles de Rogue gardent une calibration déclarée ; la taille de leur rendu ne crée aucune nouvelle pose. Rogue réutilise une seule ancienne cellule neutre : les sept phases de sa recette ne constituent pas sept gestes nouveaux. Les anciens refus Luke, Vader, Obi-Wan, Leia base et Teen Titans restent distincts et ne deviennent pas livrés. [Refus et incidents A](part-a-request-failures.json) · [Calibration des replis](blocked-support-reuse-calibration.json).

Les bases de seize poses couvrent quatre états généraux ; elles ne constituent pas une planche propre à chaque capacité. Les quarante supers distinguent 23 effets offensifs et 17 soutiens, dont les instructions, diagnostics et protections n’infligent pas de dommages. Les treize projectiles incluent douze origines natives visées et l’origine historique de Harry, suivie séparément. Les impacts, protections, coûts et décisions de cible appartiennent au moteur ; les projections visuelles n’ajoutent aucun dégât. Ces proportions décrivent les profils, pas un résultat de test non exécuté.

Les deux nouvelles couvertures complètes45 concernent Buffy et Arthur : leurs 180 cellules par héros servent les états physiques, avec prises de rebord et pauses vérifiées dans leurs preuves. Les mains, équipements et versions doivent rester ceux de la source choisie : Buffy garde son pieu et Spike son combat physique sans amulette finale ; les sorciers ne récupèrent pas les armes arbitraires de vieux dessins ; Roland et Claptrap restent ceux du premier Borderlands, sans transférer VaultHunter.EXE ; Toast et Capable soutiennent sans pouvoirs inventés ; Korben emploie son pistolet et Zorg son ZF-1 ; les paroles et rations de Kaamelott restent des soutiens. Les limites de source, de version et d’adaptation sont conservées dans les provenances.

| Couverture cumulative | Mesure réelle |
| --- | --- |
| Actions simples, secondaires et défenses explicites | 1491 héros, 4369 actions |
| Libellés strictement génériques effectifs | 0 |
| Présentations natives complètes32 | 192/1911 ; 1719 manquants |
| Présentations partielles | 2, 32 poses, exclues des complets |
| Mêlée complète45 | 12/1911 ; 1899 manquants |
| Bases corrigées16 | 140 héros |
| Recettes | 203 héros, 1421 paires héros/phase |
| Invocations et renforts natifs16 | 30 atlas |
| Décors | 401 mécanismes dans 204/525 univers |
| Univers avec ambiance seule | 321 |
| PNG suivis | 465 fichiers dans 93 registres |

Les sept nouveaux renforts natifs sont Spike, Ronon, Greer, Roland, Furiosa, Korben et Lancelot ; Hermione reste le huitième partenaire réel en repli explicite. Ils appartiennent à l’univers de l’appelant. Le rendu doit distinguer sept atlas nouveaux112 poses et les anciennes cellules adaptées d’Hermione ; seize parcours J1/J2 ne signifient ni128 poses nouvelles ni seize impacts offensifs. Les 28 entités historiques et les anciens atlas natifs restent contrôlés. [Sources des partenaires](summon-provenance.json) · [Parcours RPG](browser/summon-wave11-result.json).

Les [décors](stage-coverage.md) ajoutent 80 mécanismes à 40 univers auparavant limités à une ambiance. Les 321 anciennes définitions et 642 signatures Canvas restent égales ; 525 ambiances sont conservées. Ce sont des études architecturales et cycles naturels adaptés, sans corps, arme ou véhicule procédural, sans effet sur PV/collisions et sans frame officielle.

Les sources originales, prompts exacts, résultats, corrections et refus restent archivés dans les provenances [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) et [D](part-d-provenance.json), ainsi que les [preuves de Buffy](browser/buffy-evidence.json) et [d’Arthur](browser/arthur-evidence.json). Les anciens rapports W10 demeurent immuables. **Les dessins générés, interprétations de capacités et mécaniques sont des adaptations : aucune fidélité source 1:1 n’est certifiée.**

Build complet réussi (code 0), 1446 tests dans 17 groupes, aucun échec. [Journal du build](build.log) · [Validation](validation.json) · [Preuves navigateur](browser-checks.json).

[Mesures](current.json) · [Couverture des 1911 héros](coverage.csv) · [Fichiers livrés](deliverables.json) · [Preuves navigateur](browser-checks.json) · [Revue indépendante](independent-review.json) · [État W10 conservé](baseline.json).

Reproduire après gel : `node scripts/combatFidelityAudit.mjs --check`, puis `node docs/combat-fidelity-wave11-2026-10-23/build-coverage.mjs`. Le paragraphe de validation ne passe au succès que si validation.json contient un build réel code0, zéro test échoué et passed=true.

La clôture utilise `node scripts/finalizeCombatFidelityWave11.mjs --after-build-exit-0` après le build réel et sa preuve HTTP. Cet outil ajouté après compilation adapte uniquement la lecture du gel Rift en deux temps : références figées, puis présentation finale figée avant les écritures. Le vérificateur original, les 1742 entrées auditées, le reçu du build et la preuve HTTP restent identiques. La validation enregistre le SHA de cet adaptateur et des deux preuves de gel ; sa revue indépendante et le dernier contrôle d’audit passent.
