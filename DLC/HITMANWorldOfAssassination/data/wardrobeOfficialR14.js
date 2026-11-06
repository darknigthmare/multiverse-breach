// HITMAN — World of Assassination — definitions consumed by src/game/wardrobeOfficialR14.js.
// Source requirements stay independent from delivered wardrobe entries.

const H='HITMAN — World of Assassination',A='hitman_woa_agent_47';

export function createWardrobeNamedPacksR14({ L }) {
  const pack=(slug,sourceId,work,items)=>Object.freeze({id:`r14-${slug}`,sourceId,sourceWork:work,universe:H,actorId:A,
   sourceMode:'HITMAN_WOA_AGENT47_COSMETIC',items:Object.freeze(items.map(([key,name,focusFr,focusEn])=>Object.freeze({key:`r14-${key}`,name,nature:'official-costume',component:'outfit-only',focus:L(focusFr,focusEn)})))});
  return [
   pack('splitter-wearable','ioi-splitter','HITMAN World of Assassination — The Splitter Pack (2024)',[
    ['splitter-boxer','The Splitter Boxer Suit','Comparer ce vêtement de boxeur sur Agent 47, les raccords des bras et les poses à mains libres ; ne pas substituer le visage ou le corps de la cible.','Compare this boxer outfit on Agent 47, arm seams and unarmed poses; do not substitute the target face or body.']]),
   pack('drop-wearable','ioi-drop','HITMAN World of Assassination — The Drop Pack (2024)',[
    ['club-boom','The Club Boom DJ Suit','Relever les couches, fermetures et accessoires réellement intégrés au vêtement ; conserver la tête de 47, sans casque audio ou accessoire déduit du seul nom DJ.','Record layers, closures and accessories actually integrated into the outfit; keep 47’s head, without inferring headphones or equipment from the DJ name.']]),
   pack('banker-wearable','ioi-banker','HITMAN World of Assassination — The Banker Pack (2025)',[
    ['banker-cards','The Banker King of Cards Suit','Relever coupe, motifs, revers et raccords du modèle exact, sans transformer les cartes ou le jeton du pack en arme ou décor du costume.','Record cut, patterns, lapels and joins from the exact model; pack cards/chips do not become a costume weapon or prop.']]),
   pack('wizard-wearable','ioi-wizard','HITMAN World of Assassination — The Wizard Pack (2026)',[
    ['zig-zag','The Zig-Zag Suit','Vérifier les motifs et leur continuité dans les poses debout, accroupies et de course ; aucune aptitude de combat ni apparence de la cible importée.','Check patterns and their continuity in standing, crouching and running poses; import no target fighting ability or appearance.']]),
   pack('champions-wearables','ioi-champions','HITMAN World of Assassination — World Champions Pack (2026)',[
    ['mvp-coach','MVP Coach Tracksuit','Contrôler coupe et superposition du survêtement, col et poignets ; ne pas ajouter une médaille ou un objet sportif absent du vêtement source.','Check tracksuit fit/layers, collar and cuffs; add no medal or sports item absent from the source outfit.'],
    ['home-kit','Home Kit','Traiter la tenue domicile comme variante séparée de Away Kit : relever les motifs et marquages dans le jeu, sans choisir une équipe réelle au hasard.','Treat the home kit separately from Away Kit; record in-game patterns and markings, without choosing an arbitrary real team.'],
    ['away-kit','Away Kit','Relever ce modèle extérieur indépendamment du Home Kit, y compris dos et accessoires attachés ; ni simple teinte inventée ni personnage supplémentaire.','Record this away model independently of Home Kit, including back and attached accessories; neither an invented tint nor an additional character.']]),
   pack('getaway-wearables','ioi-getaway','HITMAN World of Assassination — The Getaway Pack (2026)',[
    ['blue-lagoon','The Blue Lagoon Suit','Comparer le modèle exact de la tenue : le nom ne suffit pas à fixer le matériau, les couleurs ou les accessoires. Conserver silhouette et identité de 47.','Compare the exact outfit model: the name alone does not establish material, colors or accessories. Keep 47’s silhouette and identity.'],
    ['sundown-casual','The Sundown Casual Suit','Relever chaque couche et ses raccords, puis contrôler leur lisibilité en petits sprites et en course ; ne pas inventer de gadgets de vacances.','Record each layer and its seams, then check readability in small sprites and running; do not invent holiday gadgets.'],
    ['riviera-retro','The Riviera Retro Suit','Verrouiller les références de cette variante rétro avant dessin ; vérifier profil, chaussures et raccords de pose, sans reprendre une autre tenue Riviera supposée.','Lock references for this exact retro variant before drawing; check profiles, shoes and pose joins, without borrowing a presumed alternate Riviera outfit.']]),
   pack('herbalist-wearables','ioi-herbalist','HITMAN World of Assassination — The Herbalist Pack (2026)',[
    ['entrepreneur-fur','The Entrepreneur Fur Coat','Manteau sur Agent 47 : relever volume, col et ourlets du modèle, garder son visage et sa voix. Aucun visage de célébrité, objet ou bonus du pack attribué.','Coat on Agent 47: record the model’s volume, collar and hems; keep his face and voice. No celebrity face, item or pack bonus is assigned.'],
    ['hustler-track','The Hustler Tracksuit','Relever le survêtement précis et ses motifs à partir des vues du jeu ; garder l’avatar 47 et vérifier les articulations, sans substituer l’identité de la cible.','Record the exact tracksuit and patterns from in-game views; keep the 47 avatar and check joints, without substituting the target identity.']]),
   pack('greed-act1-wearable','ioi-greed','HITMAN 3 — Seven Deadly Sins: Act 1 Greed (2021)',[
    ['rapacious','Rapacious Suit','Relever la tenue Rapacious de l’acte Greed et ses détails dans l’édition source. Les six autres actes ne sont pas validés par ce seul article. Pièce et canne exclues.','Record the Rapacious outfit from Act 1 Greed and its details in the source edition. This article alone does not verify the six other acts. Coin and cane are excluded.']]),
  ];
}

export function createWardrobeResearchR14({ research }) {
  return [
   research(H,A,'r14-other-six-sins','ioi-greed','INDIVIDUAL_SOURCE_NAMES_REQUIRED','Identifier les six autres tenues des péchés dans leurs sources propres ; ne pas déduire leurs noms du seul nombre de packs.','Identify the six other sin outfits in their own sources; do not infer names from the pack count.'),
   research(H,A,'r14-breach-response','ioi-patient-research','WEARABLE_COMPONENT_REFERENCE_REQUIRED','Breach Response Gear est nommé : vérifier précisément le modèle vestimentaire et ses parties avant son entrée dans les droits, sans transférer le scénario ni ses objets.','Breach Response Gear is named: verify its exact wearable model and parts before registering rights, without transferring the scenario or items.'),
  ];
}
