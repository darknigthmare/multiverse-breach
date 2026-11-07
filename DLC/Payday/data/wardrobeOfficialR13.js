// Payday — definitions consumed by src/game/wardrobeOfficialR13.js.
// Shared source records and builders are supplied by the aggregate.

export function createWearers() {
  return Object.freeze(['dallas','wolf_pd','hoxton','chains_pd','houston_pd','clover_pd']);
}

const item=(slug,name,component)=>Object.freeze({slug,name,component});

export function createNamedPacks() {
  return Object.freeze([
   Object.freeze({id:'pd2-lawless-named-components',sourceId:'starbreeze-lawless',work:'PAYDAY 2 — Lawless Tailor Pack (2023)',acquisition:'PAID_DLC_IN_SOURCE',items:Object.freeze([
    item('wild-bunch','Wild Bunch','outfit-only'),item('train-robber','Train Robber','outfit-only'),item('jailbreaker','Jailbreaker','outfit-only'),item('bushwacker','Bushwacker','outfit-only'),
    item('butch','Butch','head-mask'),item('sam','Sam','head-mask'),item('billy','Billy','head-mask'),item('jesse','Jesse','head-mask'),
    item('gambler','Gambler','hands-gloves'),item('cowpuncher','Cowpuncher','hands-gloves'),item('call-spades','Call Spades','hands-gloves'),item('easy-rider','Easy Rider','hands-gloves')])}),
   Object.freeze({id:'pd2-megacity-paid-named-components',sourceId:'starbreeze-megacity',work:'PAYDAY 2 — Mega City Tailor Pack (2021)',acquisition:'PAID_DLC_IN_SOURCE',items:Object.freeze([
    item('cyberhoodie-black','Cyberhoodie Black','outfit-only'),item('cyberhoodie-red','Cyberhoodie Red','outfit-only'),item('cyberhoodie-yellow','Cyberhoodie Yellow','outfit-only'),item('cyberhoodie-green','Cyberhoodie Green','outfit-only'),
    item('cybertrench-monochrome','Cybertrench Monochrome','outfit-only'),item('cybertrench-red-pinstripe','Cybertrench Red Pinstripe','outfit-only'),item('cybertrench-yellow','Cybertrench Yellow','outfit-only'),item('cybertrench-green','Cybertrench Green','outfit-only'),
    item('cyber-monkey','Cyber Monkey','head-mask'),item('robo-mantis','Robo Mantis','head-mask'),item('electro-tiger','Electro Tiger','head-mask'),item('viper-cyberjack','Viper Cyberjack','head-mask'),
    item('padded-monkey','Padded Monkey','hands-gloves'),item('padded-mantis','Padded Mantis','hands-gloves'),item('padded-tiger','Padded Tiger','hands-gloves'),item('padded-viper','Padded Viper','hands-gloves')])}),
   Object.freeze({id:'pd2-megacity-free-update',sourceId:'starbreeze-megacity',work:'PAYDAY 2 — Mega City update: free content (2021)',acquisition:'FREE_UPDATE_IN_SOURCE',items:Object.freeze([
    item('dragon-bomber-red','Dragon Bomber Red','outfit-only')])})
  ]);
}

export function createCostumes({ L, make, PAYDAY_NAMED_PACKS_R13, PAYDAY_WEARERS_R13 }) {
  const focus={
   'outfit-only':L('Comparer coupe, couches, ourlets, motifs et occultations sur le corps de chaque braqueur ; conserver tête et masque choisis, sans inclure automatiquement gants ou masque du pack.','Compare cut, layers, hems, patterns and occlusion on each heister body; keep the selected head and mask, without automatically including the pack gloves or mask.'),
   'head-mask':L('Masque seul : relever volume, ouvertures, attaches et visibilité des yeux ; conserver le corps, les vêtements et la voix du porteur. Ne pas transformer le nom du masque en nouveau personnage.','Mask only: record volume, openings, straps and eye visibility; retain wearer body, clothing and voice. The mask name is not a new character identity.'),
   'hands-gloves':L('Gants seuls : relever revers, paume, doigts et raccord au poignet ; vérifier prise des armes et mains FPS séparément, sans nouvelle arme ni tenue de corps.','Gloves only: record cuffs, palms, fingers and wrist fit; check weapon grip and first-person hands separately, without a new weapon or body outfit.')
  };
  return PAYDAY_NAMED_PACKS_R13.flatMap(pack=>pack.items.map(entry=>make('Payday',PAYDAY_WEARERS_R13,
   `r13-${pack.id}-${entry.slug}`,entry.name,pack.sourceId,pack.id,pack.work,entry.component==='outfit-only'?'official-costume':'official-accessory',entry.component,
   `Élément source « ${entry.name} ». ${focus[entry.component].fr} Six adaptations graphiques restent à vérifier : Dallas, Wolf, Hoxton, Chains, Houston et Clover. Bain et les adversaires sont exclus. Ne pas déduire les couleurs ou la géométrie du seul nom ; comparer les vues de ce modèle précis.`,
   `Source item ${entry.name}. ${focus[entry.component].en} Six wearer-specific visual fits remain to review: Dallas, Wolf, Hoxton, Chains, Houston and Clover. Bain and enemies are excluded. Do not infer color or geometry from the name alone; compare this exact model's views.`,
   {sourceAcquisition:pack.acquisition,sourceGameplayTransferred:false})));
}

export function createSourceRequirements({ PAYDAY_NAMED_PACKS_R13, PAYDAY_WEARERS_R13 }) {
  return PAYDAY_NAMED_PACKS_R13.map(p=>({id:p.id,sourceId:p.sourceId,work:p.work,universe:'Payday',actorIds:PAYDAY_WEARERS_R13,
    items:p.items.map(i=>({key:`r13-${p.id}-${i.slug}`,name:i.name,nature:i.component==='outfit-only'?'official-costume':'official-accessory',component:i.component,sourceMode:'PAYDAY2_PC_SHARED_COSMETIC'}))}));
}

export function createResearch({ L, sources, PAYDAY_WEARERS_R13 }) {
  return PAYDAY_WEARERS_R13.map(id=>Object.freeze({universe:'Payday',id,key:'r13-payday-wearer-fit',sourceUrl:sources.get('starbreeze-megacity').url,status:'PER_WEARER_VISUAL_REFERENCE_REQUIRED',
    question:L('Capturer les 29 composants sur ce braqueur exact ; inventorier ensuite ses autres tenues et masques sans confondre les packs.', 'Capture all 29 components on this exact heister; then inventory other outfits and masks without conflating packs.'),note:'Shared cosmetic mapping, not 29 completed drawings or a source showing every recipient.'}));
}
