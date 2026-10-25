// Only describe measured assets. The build paragraph requires a real validation.
export function wave12Readme({ current, baseline, newNative, newPartial, newBases, newFull, newSummons, newSheets, poses, validationText, batch }) {
  const parts = Object.entries(batch.parts).map(([part, ids]) => `- ${part} : ${ids.map(id => batch.heroes.find(row => row.hero.id === id)?.hero.name || id).join(', ')}.`).join('\n');
  return `# Lot 12 — 40 personnages

Ce lot reprend Silent Hill 1/2/3 originaux, Dino Crisis 1/2, Predator et ses films sélectionnés, Evil Dead, Dead Space, Futurama et Rick & Morty. Les œuvres, périodes, équipements et actions sont consignés dans les quatre définitions de source et la [sélection préédition](batch-plan-before.json).

${parts}

Livraison enregistrée : **${newNative.length} planches complètes de 32 poses**, **${newBases.length} bases de 16 poses**, **${newFull.length} manifeste Mêlée de 45 états** et **${newSummons.length} partenaires RPG de 16 poses**. Les nouvelles planches partielles sont suivies séparément : ${newPartial.length}. Ces ressources représentent **${poses} poses natives dans ${newSheets.size} nouveaux PNG** ; les captures, variantes de rendu et poses historiques réutilisées en sont exclues.

Les 40 personnages ont un kit documenté : 19 nouvelles identités dans le catalogue de capacités et 21 révisions de version. Leurs supers comprennent 24 actions offensives (10 au contact, 14 projectiles) et 16 soutiens. Les instructions, soins et protections n'inventent pas de pouvoirs offensifs. Les 40 recettes possèdent chacune sept phases de présentation ; les planches complètes possèdent aussi quatre poses de super. Une base16 ne représente pas un dessin unique pour chaque capacité.

**Morty reste sans nouveau dessin.** Sa demande a reçu un refus explicite, conservé dans [les incidents D](part-d-request-failures.json). Aucune nouvelle planche32 ou base16 n'est comptée pour lui. Son soutien et ses présentations réutilisent une cellule calme existante, avec calibration déclarée dans [la preuve de repli](part-d-blocked-support-reuse.json). Les refus historiques restent distincts et leurs fichiers sont préservés.

Isaac reçoit 45 états physiques et 180 poses, en tenue d'ingénieur de Dead Space 2008. Les armes, coups, gestes de rebord et mouvements ont leurs sources natives ; le dessin ne déplace pas les collisions. Les sept nouveaux partenaires sont Cybil, Regina, Dutch, Ash, Isaac, Leela et Birdperson. Les partenaires sont du même univers que leur appelant ; cette adaptation de gameplay ne certifie aucune alliance narrative. Birdperson effectue un soutien défensif, sans dégât. [Sources RPG](summon-provenance.json) · [Preuves Mêlée Isaac](isaac-sources/browser/isaac-evidence.json).

| Couverture cumulative | Mesure |
| --- | --- |
| Catalogue | ${current.scope.heroes} personnages, ${current.scope.universes} univers |
| Capacités rédigées | ${current.abilities.authoredHeroes} personnages, ${current.abilities.authoredSlots} actions simples/secondaires/défenses |
| Présentations complètes32 | ${current.meleeBindings.nativePresentationHeroes} ; ${current.meleeBindings.heroesWithoutDedicatedPresentationAtlas} personnages sans cette couverture |
| Présentations partielles | ${current.meleeBindings.nativePartialPresentationHeroes}, exclues des complètes |
| Mêlée complète45 | ${current.meleeBindings.fullDetailedMeleeManifestHeroes.length} ; ${current.meleeBindings.heroesWithoutFullDetailedMeleeManifest} personnages sans cette couverture |
| Bases corrigées16 | ${current.baseSpriteCorrections.heroes} |
| Recettes de présentation | ${current.presentations.scriptedHeroes} personnages, ${current.presentations.scriptedPairs} associations personnage/phase |
| Invocations et renforts natifs16 | ${current.entities.nativeAnimationAtlases} |
| Décors | ${current.stages.sceneMechanismDefinitions} mécanismes dans ${current.stages.rosterUniversesWithSceneMechanismDefinition} univers |
| Univers avec ambiance seule | ${current.stages.rosterUniversesWithoutSpecificSceneMechanism} |
| Inventaire combat suivi | ${current.assetInventory.deliveredUniquePngFiles} PNG, ${current.assetInventory.registryFiles} registres |

Les ${current.stages.sceneMechanismDefinitions - baseline.stages.sceneMechanismDefinitions} nouveaux mécanismes concernent des scènes précises de sept univers déjà couverts. Leurs anciens réglages par défaut restent identiques. Ce sont des études de structures et de cycles naturels, sans frame officielle ni modification des collisions, du terrain ou des PV.

Le [guide Tactics](../tactics-terrain-verticality.md) décrit comment passer du plateau XY actuel à des surfaces identifiées en XYZ : dessus, flancs, dessous, raccords de matériaux, escaliers, ponts et passages inférieurs. Le [démonstrateur interactif](../tactics-terrain-demo.html) permet d'explorer les niveaux, matériaux, chemins et sélections. **Cette proposition et ce prototype documentaire n'intègrent pas encore la verticalité au moteur Tactics.**

${validationText}

Les costumes, versions et équipements sont revus, mais les dessins générés et mécaniques adaptées ne constituent pas une fidélité source 1:1 certifiée. Les provenances [A](part-a-provenance.json), [B](part-b-provenance.json), [C](part-c-provenance.json) et [D](part-d-provenance.json) conservent les sources, corrections et exclusions.

[Couverture des 1 911 personnages](coverage.csv) · [Audit](current.json) · [Livraisons](deliverables.json) · [Contrôles navigateur](browser-checks.json) · [Revue indépendante](independent-review.json) · [État précédent conservé](baseline.json).
`;
}
