// R14: named cosmetics backed by publisher text. No artwork, actor or gameplay grant.
const L=(fr,en)=>Object.freeze({fr,en});
const checkedOn='2026-10-25';
export const WARDROBE_SOURCES_R14=Object.freeze([
 ['ioi-splitter','IO Interactive','https://store.steampowered.com/app/3254350/','One named suit; weapons, arcade access and safehouse items excluded.'],
 ['ioi-drop','IO Interactive','https://store.steampowered.com/app/3110360/','One named suit; the target identity, audio, gadgets and mission are not included.'],
 ['ioi-banker','IO Interactive','https://store.steampowered.com/app/3711140/','One named suit; chip, weapons, arcade contract and furniture excluded.'],
 ['ioi-wizard','IO Interactive','https://store.steampowered.com/app/4621250/','Named suit in the June 2026 pack; this is clothing for 47, not a new fighter.'],
 ['ioi-champions','IO Interactive','https://store.steampowered.com/app/4542910/','Three named outfits; sports gear, medals, weapons and locker-room decor excluded.'],
 ['ioi-getaway','IO Interactive','https://store.steampowered.com/app/4944070/','Three named outfits in the August 2026 pack; sun-related gadgets and croquet items excluded.'],
 ['ioi-herbalist','IO Interactive','https://store.steampowered.com/app/4911210/','Two named garments; celebrity likeness, voice, mission access and other pack items excluded.'],
 ['ioi-greed','IO Interactive','https://ioi.dk/hitman/news/2021/seven-deadly-sins','Act 1 Rapacious Suit is named. The article does not name all seven suits; no full-collection completeness claim.'],
 ['nacon-damaged','Nacon','https://www.nacongaming.com/en-US/robocop-rogue-city','Publisher names the Damaged skin inspired by the first film. Prototype Auto-9 is a weapon skin, not a body costume. Edition storefront labels are inconsistent: no purchase/availability claim.'],
 ['ioi-patient-research','IO Interactive','https://store.steampowered.com/app/4328240/','Breach Response Gear is named; garment boundaries and model must be inspected before classification in this catalogue.'],
 ['nacon-vanguard-research','Nacon','https://store.steampowered.com/app/2436840/','Product title inspected only; detailed skin list and visual edition are not established by this record.'],
 ['sega-legends-research','SEGA','https://store.steampowered.com/dlc/1235140/','Catalogue advertises eight Legends costumes; individual names and exact recipient-specific appearance remain unresolved.']
].map(([id,publisher,url,scope])=>Object.freeze({id,publisher,url,scope,checkedOn})));
const sources=new Map(WARDROBE_SOURCES_R14.map(s=>[s.id,s]));
const H='HITMAN — World of Assassination',A='hitman_woa_agent_47';
const pack=(slug,sourceId,work,items)=>Object.freeze({id:`r14-${slug}`,sourceId,sourceWork:work,universe:H,actorId:A,
 sourceMode:'HITMAN_WOA_AGENT47_COSMETIC',items:Object.freeze(items.map(([key,name,focusFr,focusEn])=>Object.freeze({key:`r14-${key}`,name,nature:'official-costume',component:'outfit-only',focus:L(focusFr,focusEn)})))});
// Source manifest is independent of the delivered catalogue. Never derive expected items
// by filtering OFFICIAL_COSTUMES_R14: an omitted delivery must remain an unmet requirement.
export const WARDROBE_NAMED_PACKS_R14=Object.freeze([
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
 Object.freeze({id:'r14-robocop-damaged-body',sourceId:'nacon-damaged',sourceWork:'RoboCop: Rogue City (2023) — Damaged skin',universe:'RoboCop',actorId:'alex_murphy_robocop',sourceMode:'ROGUE_CITY_MURPHY_FILM1987_INSPIRED',
 items:Object.freeze([Object.freeze({key:'r14-robocop-damaged',name:'Damaged',nature:'official-model',component:'body-model',focus:L('Aspect endommagé inspiré de la fin du film de 1987 : relever casque, visage visible, impacts et panneaux sur le modèle Rogue City. Ne pas supposer de nouvelles blessures ni confondre avec l’armure bleue du deuxième film.','Damaged appearance inspired by the 1987 film ending: record helmet, exposed face, impacts and panels on the Rogue City model. Do not invent wounds or conflate the second film’s blue armor.')})])})
]);
export const OFFICIAL_COSTUMES_R14=Object.freeze(WARDROBE_NAMED_PACKS_R14.flatMap(p=>p.items.map(i=>Object.freeze({
 universe:p.universe,actorIds:Object.freeze([p.actorId]),key:i.key,name:L(i.name,i.name),sourceId:p.sourceId,sourceUrl:sources.get(p.sourceId).url,
 sourceWork:p.sourceWork,targetIncarnation:p.sourceWork,sourceMode:p.sourceMode,coverageScopeId:p.id,checkedOn,
 nature:i.nature,component:i.component,sourceEvidence:'PUBLISHER_NAMED_COSMETIC',sourceGameplayTransferred:false,
 wearerEvidence:'IN_GAME_WEARER_VIEWS_REQUIRED',visualEvidence:'NOT_INSPECTED',modelChange:'UNASSESSED',
 brief:L(`${i.focus.fr} Collecter face, dos, profils et détail puis vérifier toutes les poses réellement utilisées. Aucun changement de stats, pouvoir, arme ou identité.`,`${i.focus.en} Collect front, back, sides and detail views, then check every used pose. No stat, power, weapon or identity change.`),
 note:'Nom et provenance documentés ; modèle, planches et animations à produire. Une liste de pack complète ne constitue pas une validation 1:1.',
 artworkStatus:'NOT_PRODUCED',artApproval:'NOT_REVIEWED',equippable:false
}))));
export const WARDROBE_SOURCE_SCOPES_R14=Object.freeze(WARDROBE_NAMED_PACKS_R14.map(p=>Object.freeze({
 id:p.id,universe:p.universe,actorId:p.actorId,sourceUrl:sources.get(p.sourceId).url,checkedOn,
 boundary:'Only the named wearable subset of this exact publisher source. Excludes other packs, weapons, source gameplay, complete character wardrobe and artwork approval.',
 expectedItems:Object.freeze(p.items.map(i=>Object.freeze({key:i.key,name:i.name,nature:i.nature,component:i.component,sourceWork:p.sourceWork,sourceMode:p.sourceMode})))
})));
const research=(universe,id,key,sourceId,status,fr,en)=>Object.freeze({universe,id,key,sourceUrl:sources.get(sourceId).url,status,question:L(fr,en),note:'Research only: no costume reward, art approval or equipment grant.'});
export const WARDROBE_RESEARCH_R14=Object.freeze([
 research(H,A,'r14-other-six-sins','ioi-greed','INDIVIDUAL_SOURCE_NAMES_REQUIRED','Identifier les six autres tenues des péchés dans leurs sources propres ; ne pas déduire leurs noms du seul nombre de packs.','Identify the six other sin outfits in their own sources; do not infer names from the pack count.'),
 research(H,A,'r14-breach-response','ioi-patient-research','WEARABLE_COMPONENT_REFERENCE_REQUIRED','Breach Response Gear est nommé : vérifier précisément le modèle vestimentaire et ses parties avant son entrée dans les droits, sans transférer le scénario ni ses objets.','Breach Response Gear is named: verify its exact wearable model and parts before registering rights, without transferring the scenario or items.'),
 research('RoboCop','alex_murphy_robocop','r14-vanguard-components','nacon-vanguard-research','SOURCE_DETAILS_NOT_VERIFIED','La fiche Vanguard est identifiée par son titre : rechercher sa liste et ses vues pour distinguer armure, palette et finition de l’Auto-9.','The Vanguard listing is identified by title; obtain its item list and views to distinguish armor, palette and Auto-9 finish.'),
 research('Like a Dragon','like_a_dragon_ichiban_kasuga','r14-legends-names','sega-legends-research','EXACT_ITEM_AND_WEARER_REQUIRED','Le catalogue annonce huit costumes Legends : identifier chacun, son porteur et son modèle, sans transformer Ichiban en Kiryu ou Daigo.','The catalogue advertises eight Legends costumes: identify each one, its wearer and model, without transforming Ichiban into Kiryu or Daigo.')
]);
