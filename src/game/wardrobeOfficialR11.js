// R11: publisher-confirmed appearances, never completed art or an equipment/stat grant.
const L = (fr, en) => Object.freeze({ fr, en });
export const WARDROBE_SOURCES_R11 = Object.freeze([
  Object.freeze({ id:'sega-superstars', publisher:'SEGA / Sonic Team', url:'https://store.steampowered.com/dlc/2022670/', checkedOn:'2026-10-25', scope:'Publisher descriptions name Rabbit, Shadow-for-Sonic, Holiday and the three LEGO wearers. Existence and recipient, not a reviewed turnaround.' }),
  Object.freeze({ id:'sega-generations', publisher:'SEGA / Sonic Team', url:'https://store.steampowered.com/dlc/2513280/', checkedOn:'2026-10-25', scope:'Publisher explicitly distinguishes the Modern Sonic Adventure model, Classic Sonic Jam model and Shadow content.' }),
  Object.freeze({ id:'sega-adventure-model', publisher:'SEGA / Sonic Team', url:'https://store.steampowered.com/app/2909780/', checkedOn:'2026-10-25', scope:'Publisher product description: Sonic Adventure Legacy Skin is for Modern Sonic in Sonic X Shadow Generations, not Frontiers shoes.' }),
  Object.freeze({ id:'bethesda-doomicorn', publisher:'Bethesda Softworks / id Software', url:'https://store.steampowered.com/app/1460021/Pakiet_drobiazgw_kolekcji_mistrza_DOOMoroec/?curator_clanid=11909469&l=dutch', checkedOn:'2026-10-25', scope:'Indexed excerpt of the Dutch publisher description names DOOMicorn, Purple Pony and Night-mare. Direct opening leads to an age gate; full-page text and graphics were not inspected. Variant geometry and colors remain unreviewed.' }),
  Object.freeze({ id:'square-ffxv-research', publisher:'Square Enix', url:'https://store.steampowered.com/api/appdetails?appids=637650', checkedOn:'2026-10-25', scope:'Public publisher description names Royal Raiment, but this source alone does not provide its wearer-specific turnaround. Research only in R11.' })
]);
const sourceById = new Map(WARDROBE_SOURCES_R11.map(row => [row.id,row]));
function outfit(actorId,key,name,work,sourceId,nature,component,sourceMode,briefFr,briefEn,relatedDesignKey='') {
  const source=sourceById.get(sourceId);
  if(!source)throw new Error(`Unknown R11 source: ${sourceId}`);
  return Object.freeze({ universe:actorId==='doomslayer'?'Doom':'Sonic',actorIds:Object.freeze([actorId]),key,
    name:L(name,name),sourceWork:work,targetIncarnation:work,sourceMode,
    sourceId,sourceUrl:source.url,sourceEvidence:sourceId==='bethesda-doomicorn'?'PUBLISHER_INDEXED_DESCRIPTION':'PUBLISHER_NAMED_VARIANT_AND_WEARER',checkedOn:source.checkedOn,
    nature,component,relatedDesignKey,brief:L(briefFr,briefEn),
    note:'Variante officielle documentée, pas tenue narrative certifiée ni sprite produit. Verrouiller édition, mode et modèle ; aucune arme, capacité ou récompense annexe transférée.',
    artworkStatus:'NOT_PRODUCED',artApproval:'NOT_REVIEWED',equippable:false });
}
const superstars='Sonic Superstars (2023)';
const generations='Sonic X Shadow Generations (2024)';
export const OFFICIAL_COSTUMES_R11 = Object.freeze([
  outfit('sonic_hedgehog','superstars-rabbit','Sonic Rabbit Skin',`${superstars} — Extra Content Pack`,'sega-superstars','official-model','full-model','SUPERSTARS_SONIC',
    'Reproduire le modèle Rabbit de Sonic Superstars, pas un lapin générique ni une recoloration. Relever oreilles, tête, gants, chaussures et proportions sur le modèle du DLC. Le porteur reste Sonic ; ne pas lui donner une nouvelle identité ou modifier sa collision. Ne pas importer Mech Sonic, le mode Battle ou les fonds du pack.',
    'Reproduce the Superstars Rabbit model, not a generic rabbit or recolor. Record ears, head, gloves, shoes and proportions from the DLC model. The wearer remains Sonic; do not create an identity or alter collision. Exclude Mech Sonic, Battle Mode and pack wallpapers.'),
  outfit('sonic_hedgehog','superstars-shadow-costume','Shadow Costume for Sonic',`${superstars} — Shadow Costume`,'sega-superstars','official-costume','outfit-only','SUPERSTARS_SONIC',
    'Cible : Sonic portant son déguisement Shadow dans Superstars. Capturer la tenue de ce DLC, sans substituer le personnage Shadow, ses pouvoirs ou ses animations de Generations. Vérifier les volumes, l’emplacement des motifs et les poses de Sonic ; aucune palette approximative approuvée.',
    'Target Sonic wearing the Superstars Shadow costume. Capture this DLC outfit without substituting Shadow, his powers or Generations animations. Check volumes, pattern placement and Sonic poses; no approximate palette is approved.'),
  outfit('sonic_hedgehog','superstars-holiday','Sonic Holiday Costume',`${superstars} — Holiday Costume`,'sega-superstars','official-costume','outfit-only','SUPERSTARS_SONIC',
    'Tenue de fête de Superstars, distincte du Holiday Cheer Suit de Frontiers déjà recensé. Relever les couches, les accessoires et la silhouette du modèle Classic de cette édition. Ne pas réutiliser la planche Frontiers ni transférer sa morphologie Modern.',
    'The Superstars holiday outfit, separate from the already listed Frontiers Holiday Cheer Suit. Record layers, accessories and the Classic silhouette for this edition. Do not reuse the Frontiers sheet or transfer its Modern proportions.'),
  outfit('sonic_hedgehog','superstars-lego-sonic','LEGO Sonic Skin',`${superstars} — LEGO Sonic Skin`,'sega-superstars','official-model','full-model','SUPERSTARS_SONIC',
    'Modèle LEGO de Sonic : relever tête, torse, articulations, mains et jambes du skin officiel. Conserver son langage de figurine sans le remplacer par un simple Sonic lisse recoloré. Les poses restent compatibles avec le moteur ; aucune compétence, taille de collision ou scène LEGO accordée.',
    'Sonic LEGO model: record the official head, torso, joints, hands and legs. Preserve its minifigure design instead of recoloring a smooth Sonic. Poses must fit the engine; no ability, collision-size change or LEGO stage is granted.'),
  outfit('miles_tails_prower','superstars-lego-tails','LEGO Tails Skin',`${superstars} — LEGO Fun Pack`,'sega-superstars','official-model','full-model','SUPERSTARS_TAILS',
    'Utiliser le modèle LEGO de Tails, non celui de Sonic. Relever les deux queues, leurs attaches, la tête et les articulations de la figurine ; vérifier marche, vol et lisibilité arrière. Les queues ne sont pas une nouvelle capacité et les stages du pack ne sont pas débloqués.',
    'Use Tails’ LEGO model, not Sonic’s. Record both tails and their attachments, the head and minifigure joints; check walking, flight and rear readability. The tails add no ability and pack stages are not unlocked.'),
  outfit('knuckles_echidna','superstars-lego-knuckles','LEGO Knuckles Skin',`${superstars} — LEGO Fun Pack`,'sega-superstars','official-model','full-model','SUPERSTARS_KNUCKLES',
    'Modèle LEGO de Knuckles, avec tête, gants et articulation propres au skin source. Relever la forme réelle des poings et les volumes des mèches au lieu de recolorer Tails. Préserver les capacités et hitboxes du porteur, sans ajouter les stages Battle du pack.',
    'Knuckles LEGO model, with the source skin’s head, gloves and articulation. Record the actual fist shapes and quill volumes rather than recoloring Tails. Keep the wearer’s abilities and hitboxes; exclude the pack’s Battle stages.'),
  outfit('sonic_hedgehog','generations-adventure-legacy','Sonic Adventure Legacy Skin',`${generations} — Sonic Adventure Legacy Skin`,'sega-adventure-model','official-model','full-model','GENERATIONS_MODERN_SONIC',
    'Modèle destiné à Modern Sonic dans Sonic X Shadow Generations, inspiré de Sonic Adventure. Relever proportions, expression, gants et chaussures sur ce modèle précis ; ne pas confondre avec les chaussures SA2 de Frontiers ou le modèle Classic Sonic Jam.',
    'A model for Modern Sonic in Sonic X Shadow Generations inspired by Sonic Adventure. Record proportions, expression, gloves and shoes from this exact model; do not confuse it with Frontiers SA2 shoes or the Classic Sonic Jam model.'),
  outfit('sonic_hedgehog','generations-jam-legacy','Sonic Jam Legacy Skin',`${generations} — Sonic Jam Legacy Skin`,'sega-generations','official-model','full-model','GENERATIONS_CLASSIC_SONIC',
    'Modèle destiné à Classic Sonic dans Sonic X Shadow Generations, inspiré de Sonic Jam. Verrouiller proportions et style de ce DLC ; ne pas lui donner les jambes ou poses du modèle Modern sans adaptation graphique documentée. Ce n’est pas une simple palette de Sonic Adventure.',
    'A model for Classic Sonic in Sonic X Shadow Generations inspired by Sonic Jam. Lock this DLC’s proportions and style; do not give it Modern legs or poses without a documented visual adaptation. It is not a Sonic Adventure recolor.'),
  outfit('doomslayer','eternal-doomicorn','DOOMicorn', 'DOOM Eternal (2020) — DOOMicorn Master Collection','bethesda-doomicorn','official-costume','outfit-only','ETERNAL_SLAYER_COSMETIC',
    'Tenue DOOMicorn portée par le Slayer dans DOOM Eternal. Relever tête, ornements, revêtements et membres sur le skin source sans inventer de pouvoir magique. Conserver l’identité Doom Slayer ; ne pas attribuer ce modèle au Marine classique, à Hayden ou à un démon. Podiums et animations du pack restent des éléments distincts.',
    'The DOOMicorn outfit worn by the Slayer in DOOM Eternal. Record head, ornaments, coverings and limbs from the source skin without inventing magic powers. Keep Doom Slayer’s identity; do not assign this model to Classic Marine, Hayden or a demon. Pack podiums and animations remain separate items.'),
  outfit('doomslayer','eternal-doomicorn-purple-pony','Purple Pony', 'DOOM Eternal (2020) — DOOMicorn Master Collection','bethesda-doomicorn','official-skin','skin-variant','ETERNAL_SLAYER_COSMETIC',
    'Variante nommée Purple Pony du set DOOMicorn. La source atteste un skin variant, pas que seule sa couleur change : comparer géométrie, matières et palette au skin parent avant de fabriquer. Droit distinct, aucune attribution automatique de la tenue parente ou d’autres objets du pack.',
    'Named Purple Pony variant of the DOOMicorn set. The source confirms a skin variant, not that only its color changes: compare geometry, materials and palette against the parent before production. Separate entitlement; no automatic grant of the parent or other pack items.', 'eternal-doomicorn'),
  outfit('doomslayer','eternal-doomicorn-night-mare','Night-mare', 'DOOM Eternal (2020) — DOOMicorn Master Collection','bethesda-doomicorn','official-skin','skin-variant','ETERNAL_SLAYER_COSMETIC',
    'Variante Night-mare du set DOOMicorn, à distinguer de Purple Pony. Relever toutes les différences visibles au lieu de supposer une recoloration noire uniforme. Respecter les attaches et occultations dans les poses ; pas de podium, animation de victoire ou bonus attribué avec ce droit.',
    'Night-mare variant of the DOOMicorn set, distinct from Purple Pony. Record every visible difference rather than assuming a uniform black tint. Respect attachments and occlusion in all poses; this right grants no podium, victory animation or bonus.', 'eternal-doomicorn')
]);
export const UNBOUND_COSTUME_RESEARCH_R11 = Object.freeze([
  ['Amy Rose','Modern Amy Costume','Sonic',`${superstars} — Modern Amy Costume`,'sega-superstars','Classic Superstars Amy wearing the dress of Modern Amy; no substitution onto Sonic or Tails.'],
  ['Amy Rose','Retro Diner Style Amy Costume','Sonic',`${superstars} — Retro Diner Style`,'sega-superstars','Named publisher costume; obtain this exact wearer before creating a reward.'],
  ['Amy Rose','LEGO Amy Skin','Sonic',`${superstars} — LEGO Fun Pack`,'sega-superstars','LEGO Amy, not a fourth skin for Tails or Knuckles.'],
  ['Shadow the Hedgehog','Terios Skin','Sonic',`${generations} — Extra Content Pack`,'sega-generations','Terios is named in the publisher pack list. Exact Shadow wearer and model reference still need documenting; never reinterpret as Sonic wearing Shadow’s outfit.'],
  ['Shadow the Hedgehog','Sonic the Hedgehog 3 Movie Pack — Shadow skin','Sonic',`${generations} — Movie Pack`,'sega-generations','Publisher confirms an additional Shadow skin and level; exact model comparison remains pending, level excluded.']
].map(([actorName,costume,universe,sourceWork,sourceId,note])=>Object.freeze({actorName,costume,universe,sourceWork,sourceId,
  sourceUrl:sourceById.get(sourceId).url,sourceEvidence:'PUBLISHER_NAMED_VARIANT',status:'ACTOR_BINDING_MISSING',equippable:false,note})));
export const WARDROBE_RESEARCH_R11 = Object.freeze([
  Object.freeze({universe:'Sonic',id:'sonic_hedgehog',key:'superstars-mech-battle',sourceUrl:sourceById.get('sega-superstars').url,
    question:L('Mech Sonic : définir le porteur et la portée Battle Mode avant tout droit de tenue.','Mech Sonic: establish the wearer and Battle Mode scope before defining a costume right.'),
    status:'SOURCE_MODE_BINDING_UNRESOLVED',note:'Named mode-specific pack content. Not automatically a Sonic outfit or a Metal Sonic boss skin.'}),
  Object.freeze({universe:'Final Fantasy XV',id:'noctis_ff15',key:'ffxv-royal-raiment-reference',sourceUrl:sourceById.get('square-ffxv-research').url,
    question:L('Royal Raiment : compléter la preuve du porteur exact et ses vues dans cette édition.','Royal Raiment: complete exact-wearer evidence and views for this edition.'),
    status:'WEARER_AND_TURNAROUND_REVIEW',note:'Outfit existence documented; do not infer a complete wearer reference from the pack list alone.'})
]);
