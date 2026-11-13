// Magicka — definitions consumed by src/game/wardrobeOfficialR13.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSourceRequirements({ MAGICKA_WEARERS_R13 }) {
  return ({id:'magicka-gamer-named-robes',sourceId:'paradox-gamer',work:'Magicka (2011) — Gamer Bundle',universe:'Magicka',actorIds:MAGICKA_WEARERS_R13,
  items:[{key:'r13-magicka-gamer-zombie',name:'Zombie Robe',nature:'official-model',component:'robe-model'},
   {key:'r13-magicka-gamer-tentacle',name:'Tentacle Robe',nature:'official-model',component:'robe-model'},
   {key:'r13-magicka-gamer-epic',name:'Epic Robe',nature:'official-costume',component:'outfit-only'}].map(i=>({...i,sourceMode:'MAGICKA1_PC_PLAYER_ROBE'}))});
}

export function createSourceRequirements2({ MAGICKA_WEARERS_R13 }) {
  return ({id:'magicka-survival-wearable-only',sourceId:'paradox-survival',work:"Magicka (2011) — Wizard's Survival Kit",universe:'Magicka',actorIds:MAGICKA_WEARERS_R13,
  items:[{key:'r13-magicka-survival-hat',name:"Wizard's Hat",nature:'official-accessory',component:'headwear',sourceMode:'MAGICKA1_PC_PLAYER_ROBE'}]});
}

export function createWearers() {
  return Object.freeze(['magicka_blue_wizard_foudre','magicka_red_wizard_feu','magicka_yellow_wizard_froid']);
}

export function createCostumes({ make, MAGICKA_WEARERS_R13 }) {
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
  return magicka;
}

export function createResearch({ L, sources, MAGICKA_WEARERS_R13 }) {
  return MAGICKA_WEARERS_R13.map(id=>Object.freeze({universe:'Magicka',id,key:'r13-magicka-gameplay-separation',sourceUrl:sources.get('paradox-gamer').url,status:'COSMETIC_ONLY_SOURCE_GAMEPLAY_DIFFERENCES',
    question:L('Comparer chaque robe sur cet avatar. Documenter séparément les animations et les différences de gameplay source ; le droit cosmétique n’en importe aucune.', 'Compare each robe on this avatar. Separately document source animation and gameplay differences; the cosmetic entitlement imports none.'),note:'Source costume behavior is not reproduced by granting its appearance.'}));
}
