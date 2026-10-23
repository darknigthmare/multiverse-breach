// Pure text helper. Validation is read by build-coverage; no success is inferred.
export function wave11Readme({current,baseline,newNative,newPartial,newBases,newFull,newSummons,newSheets,poses,validationText,batch}){
  const parts=Object.entries(batch.parts).map(([part,ids])=>`- ${part} : ${ids.map(id=>batch.heroes.find(h=>h.hero.id===id)?.hero.name||id).join(', ')}.`).join('\n');
  return `# Lot 11 — 40 personnages, 23 octobre 2026

Le lot sélectionne Buffy saison 7, Harry Potter et le Prince de sang-mêlé, Stargate Atlantis saison 3, Stargate Universe saison 1, Borderlands 2009, Mad Max: Fury Road 2015, Le Cinquième Élément 1997 et Kaamelott Livre III. La [sélection préédition](batch-plan-before.json) conserve les quarante identités et leurs actions initiales.

${parts}

Livraison réellement enregistrée : **${newNative.length} atlas complets de 32 poses**, **${newBases.length} bases de 16 poses**, **${newFull.length} manifestes Mêlée de 45 états** et **${newSummons.length} renforts de 16 poses**. Les nouveaux atlas partiels sont suivis séparément : ${newPartial.length}. Ces fichiers représentent **${poses} poses natives dans ${newSheets.size} nouveaux PNG**. Les images refusées, les captures de contrôle et les poses anciennes adaptées sont exclues de ce total. Les quarante recettes couvrent chacune sept phases de présentation ; elles ne signifient pas quarante corps natifs nouveaux.

Harry, Hermione et Rogue ont reçu des refus de génération explicites. Aucun nouvel atlas32 ou base16 n’est livré pour eux. Le renfort d’Hermione conserve un repli accepté existant, sans nouveau16 ni geste défensif natif inventé. Ses poses anciennes adaptées et celles de Rogue gardent une calibration déclarée ; la taille de leur rendu ne crée aucune nouvelle pose. Rogue réutilise une seule ancienne cellule neutre : les sept phases de sa recette ne constituent pas sept gestes nouveaux. Les anciens refus Luke, Vader, Obi-Wan, Leia base et Teen Titans restent distincts et ne deviennent pas livrés. [Refus et incidents A](part-a-request-failures.json) · [Calibration des replis](blocked-support-reuse-calibration.json).

Les bases de seize poses couvrent quatre états généraux ; elles ne constituent pas une planche propre à chaque capacité. Les quarante supers distinguent 23 effets offensifs et 17 soutiens, dont les instructions, diagnostics et protections n’infligent pas de dommages. Les treize projectiles incluent douze origines natives visées et l’origine historique de Harry, suivie séparément. Les impacts, protections, coûts et décisions de cible appartiennent au moteur ; les projections visuelles n’ajoutent aucun dégât. Ces proportions décrivent les profils, pas un résultat de test non exécuté.

Les deux nouvelles couvertures complètes45 concernent Buffy et Arthur : leurs 180 cellules par héros servent les états physiques, avec prises de rebord et pauses vérifiées dans leurs preuves. Les mains, équipements et versions doivent rester ceux de la source choisie : Buffy garde son pieu et Spike son combat physique sans amulette finale ; les sorciers ne récupèrent pas les armes arbitraires de vieux dessins ; Roland et Claptrap restent ceux du premier Borderlands, sans transférer VaultHunter.EXE ; Toast et Capable soutiennent sans pouvoirs inventés ; Korben emploie son pistolet et Zorg son ZF-1 ; les paroles et rations de Kaamelott restent des soutiens. Les limites de source, de version et d’adaptation sont conservées dans les provenances.

| Couverture cumulative | Mesure réelle |
| --- | --- |
| Actions simples, secondaires et défenses explicites | ${current.abilities.authoredHeroes} héros, ${current.abilities.authoredSlots} actions |
| Libellés strictement génériques effectifs | ${current.abilities.effectiveStrictGenericSlots} |
| Présentations natives complètes32 | ${current.meleeBindings.nativePresentationHeroes}/1911 ; ${current.meleeBindings.heroesWithoutDedicatedPresentationAtlas} manquants |
| Présentations partielles | ${current.meleeBindings.nativePartialPresentationHeroes}, ${current.meleeBindings.nativePartialPresentationPoses} poses, exclues des complets |
| Mêlée complète45 | ${current.meleeBindings.fullDetailedMeleeManifestHeroes.length}/1911 ; ${current.meleeBindings.heroesWithoutFullDetailedMeleeManifest} manquants |
| Bases corrigées16 | ${current.baseSpriteCorrections.heroes} héros |
| Recettes | ${current.presentations.scriptedHeroes} héros, ${current.presentations.scriptedPairs} paires héros/phase |
| Invocations et renforts natifs16 | ${current.entities.nativeAnimationAtlases} atlas |
| Décors | ${current.stages.sceneMechanismDefinitions} mécanismes dans ${current.stages.rosterUniversesWithSceneMechanismDefinition}/525 univers |
| Univers avec ambiance seule | ${current.stages.rosterUniversesWithoutSpecificSceneMechanism} |
| PNG suivis | ${current.assetInventory.deliveredUniquePngFiles} fichiers dans ${current.assetInventory.registryFiles} registres |

Les sept nouveaux renforts natifs sont Spike, Ronon, Greer, Roland, Furiosa, Korben et Lancelot ; Hermione reste le huitième partenaire réel en repli explicite. Ils appartiennent à l’univers de l’appelant. Le rendu doit distinguer sept atlas nouveaux112 poses et les anciennes cellules adaptées d’Hermione ; seize parcours J1/J2 ne signifient ni128 poses nouvelles ni seize impacts offensifs. Les 28 entités historiques et les anciens atlas natifs restent contrôlés. [Sources des partenaires](summon-provenance.json) · [Parcours RPG](browser/summon-wave11-result.json).

Les [décors](stage-coverage.md) ajoutent ${current.stages.sceneMechanismDefinitions-baseline.stages.sceneMechanismDefinitions} mécanismes à ${current.stages.rosterUniversesWithSceneMechanismDefinition-baseline.stages.rosterUniversesWithSceneMechanismDefinition} univers auparavant limités à une ambiance. Les 321 anciennes définitions et 642 signatures Canvas restent égales ; 525 ambiances sont conservées. Ce sont des études architecturales et cycles naturels adaptés, sans corps, arme ou véhicule procédural, sans effet sur PV/collisions et sans frame officielle.

Les sources originales, prompts exacts, résultats, corrections et refus restent archivés dans les provenances [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) et [D](part-d-provenance.json), ainsi que les [preuves de Buffy](browser/buffy-evidence.json) et [d’Arthur](browser/arthur-evidence.json). Les anciens rapports W10 demeurent immuables. **Les dessins générés, interprétations de capacités et mécaniques sont des adaptations : aucune fidélité source 1:1 n’est certifiée.**

${validationText}

[Mesures](current.json) · [Couverture des 1911 héros](coverage.csv) · [Fichiers livrés](deliverables.json) · [Preuves navigateur](browser-checks.json) · [Revue indépendante](independent-review.json) · [État W10 conservé](baseline.json).

Reproduire après gel : \`node scripts/combatFidelityAudit.mjs --check\`, puis \`node docs/combat-fidelity-wave11-2026-10-23/build-coverage.mjs\`. Le paragraphe de validation ne passe au succès que si validation.json contient un build réel code0, zéro test échoué et passed=true.
`;
}
