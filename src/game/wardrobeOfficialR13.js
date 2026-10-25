// R13: source-named shared cosmetics. Exact project wearers are an explicit allowlist,
// NOT evidence that the publisher illustrated every wearer/item combination.
const L=(fr,en)=>Object.freeze({fr,en});
const checkedOn='2026-10-25';
export const WARDROBE_SOURCES_R13=Object.freeze([
 {id:'starbreeze-lawless',publisher:'Starbreeze / OVERKILL',url:'https://store.steampowered.com/app/2352300/',consultedUrl:'https://store.steampowered.com/app/2352300/PAYDAY_2_Lawless_Tailor_Pack/?curator_clanid=4458711&snr=1_16_16_18_curator-tabs',scope:'Publisher names four suits, four masks and four gloves. Shared heister cosmetics; each recipient still needs source-game fit evidence.'},
 {id:'starbreeze-megacity',publisher:'Starbreeze / OVERKILL',url:'https://store.steampowered.com/app/1778791/',consultedUrl:'https://store.steampowered.com/app/1778791/PAYDAY_2_Mega_City_Tailor_Pack/',scope:'Eight named variants across two outfits, four masks and four gloves; Dragon Bomber Red is separately listed as free content, not part of the paid sixteen.'},
 {id:'paradox-gamer',publisher:'Paradox Interactive / Arrowhead',url:'https://store.steampowered.com/app/73057/',consultedUrl:'https://store.steampowered.com/app/73057/Magicka_Gamer_Bundle/',scope:'Three named robes for player wizards. Only appearance is catalogued here; source weapons, resistances, speed and tactics are not replicated by a cosmetic entitlement.'},
 {id:'paradox-survival',publisher:'Paradox Interactive / Arrowhead',url:'https://store.steampowered.com/app/73030/',consultedUrl:'https://store.steampowered.com/app/73030/Magicka_Wizards_Survival_Kit/',scope:'Wizard’s Hat is a wearable item. Sharp Sword, Staff +1 and Meteor Shower are explicitly excluded from costume rewards.'},
 {id:'paradox-villains-research',publisher:'Paradox Interactive / Pieces Interactive',url:'https://store.steampowered.com/app/73095/',scope:'Coldarr, Flamos and Electrobe are described as distinct wizards with personalities, not silently assigned to the existing color archetypes.'},
 {id:'bandai-hokage-research',publisher:'Bandai Namco',url:'https://store.steampowered.com/app/416420/',scope:'Shikamaru’s Tale names Naruto (7th Hokage). The existing young/war-era Naruto actors are not silently aged or replaced.'}
].map(s=>Object.freeze({...s,checkedOn})));
const sources=new Map(WARDROBE_SOURCES_R13.map(s=>[s.id,s]));
export const PAYDAY_WEARERS_R13=Object.freeze(['dallas','wolf_pd','hoxton','chains_pd','houston_pd','clover_pd']);
export const MAGICKA_WEARERS_R13=Object.freeze(['magicka_blue_wizard_foudre','magicka_red_wizard_feu','magicka_yellow_wizard_froid']);
const make=(universe,actorIds,key,name,sourceId,scopeId,work,nature,component,fr,en,extra={})=>{
 const source=sources.get(sourceId);if(!source)throw new Error(`Unknown R13 source ${sourceId}`);
 return Object.freeze({universe,actorIds,key,name:L(name,name),sourceId,sourceUrl:source.url,sourceWork:work,targetIncarnation:work,
  coverageScopeId:scopeId,checkedOn,nature,component,sourceMode:universe==='Payday'?'PAYDAY2_PC_SHARED_COSMETIC':'MAGICKA1_PC_PLAYER_ROBE',
  sourceEvidence:'PUBLISHER_NAMED_SHARED_COSMETIC',wearerBinding:'EXPLICIT_PLAYABLE_AVATAR_ALLOWLIST',
  wearerEvidence:'PER_WEARER_VISUAL_REFERENCE_REQUIRED',brief:L(fr,en),
  note:'Nom et composant documentés. Affectation aux avatars jouables présents, sans prétendre que la source montre chaque combinaison. Ajustement par porteur à vérifier. Aucun objet, pouvoir ou bonus transféré.',
  artworkStatus:'NOT_PRODUCED',artApproval:'NOT_REVIEWED',visualEvidence:'NOT_INSPECTED',modelChange:'UNASSESSED',equippable:false,...extra});
};
const item=(slug,name,component)=>Object.freeze({slug,name,component});
export const PAYDAY_NAMED_PACKS_R13=Object.freeze([
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
const focus={
 'outfit-only':L('Comparer coupe, couches, ourlets, motifs et occultations sur le corps de chaque braqueur ; conserver tête et masque choisis, sans inclure automatiquement gants ou masque du pack.','Compare cut, layers, hems, patterns and occlusion on each heister body; keep the selected head and mask, without automatically including the pack gloves or mask.'),
 'head-mask':L('Masque seul : relever volume, ouvertures, attaches et visibilité des yeux ; conserver le corps, les vêtements et la voix du porteur. Ne pas transformer le nom du masque en nouveau personnage.','Mask only: record volume, openings, straps and eye visibility; retain wearer body, clothing and voice. The mask name is not a new character identity.'),
 'hands-gloves':L('Gants seuls : relever revers, paume, doigts et raccord au poignet ; vérifier prise des armes et mains FPS séparément, sans nouvelle arme ni tenue de corps.','Gloves only: record cuffs, palms, fingers and wrist fit; check weapon grip and first-person hands separately, without a new weapon or body outfit.')
};
const payday=PAYDAY_NAMED_PACKS_R13.flatMap(pack=>pack.items.map(entry=>make('Payday',PAYDAY_WEARERS_R13,
 `r13-${pack.id}-${entry.slug}`,entry.name,pack.sourceId,pack.id,pack.work,entry.component==='outfit-only'?'official-costume':'official-accessory',entry.component,
 `Élément source « ${entry.name} ». ${focus[entry.component].fr} Six adaptations graphiques restent à vérifier : Dallas, Wolf, Hoxton, Chains, Houston et Clover. Bain et les adversaires sont exclus. Ne pas déduire les couleurs ou la géométrie du seul nom ; comparer les vues de ce modèle précis.`,
 `Source item ${entry.name}. ${focus[entry.component].en} Six wearer-specific visual fits remain to review: Dallas, Wolf, Hoxton, Chains, Houston and Clover. Bain and enemies are excluded. Do not infer color or geometry from the name alone; compare this exact model's views.`,
 {sourceAcquisition:pack.acquisition,sourceGameplayTransferred:false})));
const magicka=[
 ['zombie','Zombie Robe','official-model','robe-model','Le parasite et l’aspect de robe Zombie doivent venir du modèle Magicka, pas du Headcrab de Freeman. Conserver l’avatar sélectionné, documenter ses poses adaptées ; ne transférer ni pied-de-biche, résistance ni ralentissement.','The parasite and Zombie robe appearance must come from the Magicka model, not Freeman’s Headcrab. Retain the selected avatar and document its adapted poses; grant no crowbar, resistance or slowdown.'],
 ['tentacle','Tentacle Robe','official-model','robe-model','Robe de cosplay du sorcier Magicka : relever le costume source et ses volumes plutôt que substituer Purple Tentacle comme acteur. Aucun Ray-Gun ni attaque empruntée ; poses et visibilité des mains à vérifier.','The Magicka wizard cosplay robe: record the source costume and its volumes rather than replacing the actor with Purple Tentacle. No Ray-Gun or borrowed attack; review poses and hand visibility.'],
 ['epic','Epic Robe','official-costume','outfit-only','Vêtement/armure de l’Epic Robe du sorcier : relever les plaques et couches réelles sur le modèle source. Ni monture, ni épée, ni statistiques du pack ; préserver les couleurs de joueur seulement là où la source le permet.','The wizard’s Epic Robe clothing/armor: record actual panels and layers from the source model. No mount, sword or pack statistics; preserve player colors only where supported by the source.']
].map(([slug,name,nature,component,fr,en])=>make('Magicka',MAGICKA_WEARERS_R13,`r13-magicka-gamer-${slug}`,name,'paradox-gamer','magicka-gamer-named-robes',
 'Magicka (2011) — Gamer Bundle',nature,component,fr,en,{sourceAcquisition:'PAID_DLC_IN_SOURCE',sourceGameplayTransferred:false}));
magicka.push(make('Magicka',MAGICKA_WEARERS_R13,'r13-magicka-survival-hat',"Wizard's Hat",'paradox-survival','magicka-survival-wearable-only',
 "Magicka (2011) — Wizard's Survival Kit",'official-accessory','headwear',
 'Chapeau seulement. Relever sa silhouette, sa base et ses occultations sur les trois avatars ; ne pas distribuer Sharp Sword, Staff +1 ou Meteor Shower avec ce droit. La source liste un objet équipable, pas une tenue complète.',
 'Hat only. Record its silhouette, base and occlusion on all three avatars; do not distribute Sharp Sword, Staff +1 or Meteor Shower with this right. The source lists a wearable item, not a full outfit.',
 {sourceAcquisition:'PAID_DLC_IN_SOURCE',sourceGameplayTransferred:false}));
export const OFFICIAL_COSTUMES_R13=Object.freeze([...payday,...magicka]);
// Every source scope declares a boundary; completion never means the entire wardrobe is known.
export const WARDROBE_SOURCE_SCOPES_R13=Object.freeze([
 ...PAYDAY_NAMED_PACKS_R13.map(p=>({id:p.id,sourceId:p.sourceId,work:p.work,universe:'Payday',actorIds:PAYDAY_WEARERS_R13})),
 {id:'magicka-gamer-named-robes',sourceId:'paradox-gamer',work:'Magicka (2011) — Gamer Bundle',universe:'Magicka',actorIds:MAGICKA_WEARERS_R13},
 {id:'magicka-survival-wearable-only',sourceId:'paradox-survival',work:"Magicka (2011) — Wizard's Survival Kit",universe:'Magicka',actorIds:MAGICKA_WEARERS_R13}
].flatMap(s=>s.actorIds.map(actorId=>Object.freeze({id:s.id,universe:s.universe,actorId,sourceUrl:sources.get(s.sourceId).url,checkedOn,
 boundary:'Named cosmetic components in this exact source only; wearer-specific imagery and whole-character wardrobe completeness remain unverified.',
 expectedItems:Object.freeze(OFFICIAL_COSTUMES_R13.filter(e=>e.coverageScopeId===s.id).map(e=>Object.freeze({key:e.key,name:e.name.en,nature:e.nature,component:e.component,sourceWork:e.sourceWork,sourceMode:e.sourceMode})))
}))));
export const WARDROBE_RESEARCH_R13=Object.freeze([
 ...PAYDAY_WEARERS_R13.map(id=>Object.freeze({universe:'Payday',id,key:'r13-payday-wearer-fit',sourceUrl:sources.get('starbreeze-megacity').url,status:'PER_WEARER_VISUAL_REFERENCE_REQUIRED',
  question:L('Capturer les 29 composants sur ce braqueur exact ; inventorier ensuite ses autres tenues et masques sans confondre les packs.', 'Capture all 29 components on this exact heister; then inventory other outfits and masks without conflating packs.'),note:'Shared cosmetic mapping, not 29 completed drawings or a source showing every recipient.'})),
 ...MAGICKA_WEARERS_R13.map(id=>Object.freeze({universe:'Magicka',id,key:'r13-magicka-gameplay-separation',sourceUrl:sources.get('paradox-gamer').url,status:'COSMETIC_ONLY_SOURCE_GAMEPLAY_DIFFERENCES',
  question:L('Comparer chaque robe sur cet avatar. Documenter séparément les animations et les différences de gameplay source ; le droit cosmétique n’en importe aucune.', 'Compare each robe on this avatar. Separately document source animation and gameplay differences; the cosmetic entitlement imports none.'),note:'Source costume behavior is not reproduced by granting its appearance.'}))
]);
export const UNBOUND_COSTUME_RESEARCH_R13=Object.freeze([
 ...[['Coldarr','Coldarr Robe'],['Flamos','Flamos Robe'],['Electrobe','Electrobe']].map(([actorName,costume])=>({actorName,costume,universe:'Magicka',sourceWork:'Magicka — Mega Villain Robes (2012)',sourceId:'paradox-villains-research',status:'DISTINCT_IDENTITY_BINDING_REQUIRED'})),
 {actorName:'Naruto Uzumaki — 7th Hokage',costume:'Naruto (7th Hokage)',universe:'Boruto: Naruto Next Generations',sourceWork:'Naruto Shippuden: Ultimate Ninja STORM 4 — Shikamaru’s Tale',sourceId:'bandai-hokage-research',status:'ADULT_INCARNATION_BINDING_REQUIRED'}
].map(r=>Object.freeze({...r,sourceUrl:sources.get(r.sourceId).url,sourceEvidence:'PUBLISHER_NAMED_VARIANT',equippable:false,note:'No exact compatible actor linked; never substitute a nearby name, color archetype or younger incarnation.'})));
