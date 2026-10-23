import { buff, defend, guard, hit, shot } from './rules.js';

const finale = (action, color, animationDuration = 1.1, hitAt = 0.45) => ({
  ...action, color, animationDuration, hitAt, meterCost: 100
});
const kit = (sourceHeroId, universe, sourceWork, sourceReference, sourceUrl, simple, secondary, defense, special) => ({
  sourceHeroId, universe, sourceWork, sourceReference, sourceUrl,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense, special
});
const atlantis = 'Stargate Atlantis saison3 (2006–2007), avant les nanites et la fin de Weir';
const destiny = 'Stargate Universe saison1 (2009–2010), personnages humains et équipement de cette saison';
const sateda = 'https://www.stargate-fusion.com/series/2-stargate-atlantis/14-saison-3/264-face-a-face/transcript-vo.html';
const universeWeapons = 'https://www.imfdb.org/wiki/SGU_Stargate_Universe';
const air = 'https://stargate.hypnoweb.net/stargate-universe/episode.177.2/S01E02-air-23-9447.html';

// Explicit four-slot revisions of the ten existing catalog identities. Damage,
// timing and guard/buff ratios adapt their physical equipment or human roles;
// they do not claim named source-game attacks or frame-exact choreography.
export const ABILITIES_WAVE11_PART_B = Object.freeze({
  sheppard_sga: kit('sheppard_sga', 'Stargate Atlantis', atlantis,
    'Sheppard carries a real FN P90 during Atlantis field missions; Sateda depicts him firing that weapon. Route calls coordinate allies and cover is personal protection. The super is one finite P90 shot at the selected target, not a ship laser, mental ray or Puddle Jumper summon.', sateda,
    shot('Rafale du P90 de Sheppard', 1.1, { range: 600 }),
    buff('Annoncer la route à l’équipe Atlantis', { range: 1200, duration: 3, buffMultiplier: 1.12 }),
    defend('Couvert du chef de terrain Atlantis', 0.45),
    finale(shot('Rafale au P90 de Sheppard', 4.5, { range: 640 }), '#d7b36d')),
  mckay_sga: kit('mckay_sga', 'Stargate Atlantis', atlantis,
    'McKay diagnoses Ancient technology through real consoles and portable computing equipment. The selected tablet readout and protective guidance adapt that technical role; they neither emit offensive energy nor heal biological injuries. Other scenes may arm McKay, but these selected actions remain technical support.', sateda,
    buff('McKay lit la console ancienne', { duration: 3, buffMultiplier: 1.1 }),
    guard('Calculer un réglage sûr avec McKay', { duration: 3, reduce: 0.3 }),
    defend('Se mettre derrière le pupitre de McKay', 0.45),
    finale(guard('Diagnostic de terrain de McKay', { range: 1200, duration: 4, reduce: 0.5 }), '#82b6d6')),
  teyla_sga: kit('teyla_sga', 'Stargate Atlantis', atlantis,
    'Teyla practises Athosian bantos fighting with one or two wooden rods; the name is used in season3 Sunday. The chosen two-stick physical combination has a single close-range gameplay impact. The rods do not become swords, laser blades or ranged spells.', 'https://stargate.fandom.com/wiki/Bantos_fighting',
    hit('Premier bâton bantos de Teyla', 1.1, { range: 100 }),
    hit('Enchaînement aux deux bantos', 1.9, { range: 110 }),
    defend('Parade athosienne de Teyla', 0.5),
    finale(hit('Enchaînement athosien de Teyla', 4.7, { range: 170 }), '#ba9764')),
  ronon_dex: kit('ronon_dex', 'Stargate Atlantis', atlantis,
    'Ronon uses a compact Satedan particle-magnum sidearm and physical close combat. Sateda shows him firing energy pistols and Progeny shows his blaster being drawn, set and holstered. The finite red bolt leaves the actual gun opening; no Wraith power, giant revolver, body mutation or area blast is added.', sateda,
    shot('Tir du pistolet satedan de Ronon', 1.2, { range: 560 }),
    hit('Coup rapproché du Satedan', 1.9, { range: 105 }),
    defend('Esquive du Runner Ronon', 0.45),
    finale(shot('Tir du pistolet satedan de Ronon', 4.8, { range: 640 }), '#ec7766')),
  elizabeth_weir: kit('elizabeth_weir', 'Stargate Atlantis', atlantis,
    'Weir leads and coordinates the human Atlantis expedition before her later nanite fate. The radio carries spoken protective instructions and diplomatic planning. No gun is fired by radio, no nanite attack is granted, and no healing or magical shield projectile is invented.', 'https://www.gateworld.net/atlantis/s3/progeny/transcript/',
    buff('Weir transmet les consignes de l’expédition', { duration: 3, buffMultiplier: 1.1 }),
    guard('Weir organise le repli de l’équipe', { duration: 3, reduce: 0.35 }),
    defend('Abri du poste de commandement de Weir', 0.45),
    finale(guard('Coordination de l’expédition par Weir', { range: 1200, duration: 4, reduce: 0.5 }), '#d47b7b')),
  rush_sgu: kit('rush_sgu', 'Stargate Universe', destiny,
    'Rush studies Destiny interfaces and computes the ship systems using real controls and notes. Air shows his database work during the life-support crisis. The information advantage is a bounded allied buff, without personal Ancient beams, forced ship fire, clock manipulation or healing.', air,
    buff('Rush lit la console ancienne', { duration: 3, buffMultiplier: 1.1 }),
    buff('Calculer le prochain réglage du Destiny', { duration: 3, buffMultiplier: 1.15 }),
    defend('Abri au poste des Anciens', 0.45),
    finale(buff('Lecture des systèmes par Rush', { range: 1200, duration: 4, buffMultiplier: 1.25 }), '#b7b296')),
  young_sgu: kit('young_sgu', 'Stargate Universe', destiny,
    'Young commands the stranded crew and assigns field missions. His selected radio instructions protect real allied targets; other scenes with weapons do not turn this support profile into a shooting action. Protective orders are bounded guard without HP restoration or a ship weapon.', air,
    buff('Young vérifie la position de l’équipe', { duration: 3, buffMultiplier: 1.1 }),
    guard('Ordre de regroupement du Destiny', { duration: 3, reduce: 0.35 }),
    defend('Couvert du commandant Young', 0.45),
    finale(guard('Ordres de couverture de Young', { range: 1200, duration: 4, reduce: 0.5 }), '#99aaa5')),
  greer_sgu: kit('greer_sgu', 'Stargate Universe', destiny,
    'Greer is a Black US Marine using physical firearms in season1. Both G36K and M4 are documented; this presentation selects his black M4A1 carbine, matching the scene in which he shows Eli the rifle. His finite bullet and cover orders do not create laser beams, grenades or Kino ammunition.', universeWeapons,
    shot('Fusil du sergent Greer', 1.2, { range: 600 }),
    guard('Couvrir la retraite du Destiny', { duration: 3, reduce: 0.3 }),
    defend('Couvert du Marine Greer', 0.45),
    finale(shot('Rafale de couverture de Greer', 4.6, { range: 640 }), '#d9b06b')),
  chloe_sgu: kit('chloe_sgu', 'Stargate Universe', destiny,
    'Chloe is a human civilian during the selected season1 role. She listens and relays practical instructions through an ordinary radio, guiding companions to cover. No later alien mutation, offensive data burst, telepathy, weapon or medical power is transferred into this kit.', air,
    buff('Chloe relaie les informations de l’équipe', { duration: 3, buffMultiplier: 1.1 }),
    guard('Chloe indique un passage à couvert', { duration: 3, reduce: 0.3 }),
    defend('Abri du couloir du Destiny', 0.45),
    finale(guard('Relais des consignes par Chloe', { range: 1200, duration: 4, reduce: 0.5 }), '#baa2bf')),
  matt_scott_sgu: kit('matt_scott_sgu', 'Stargate Universe', destiny,
    'Lieutenant Scott carries a black HK G36K with an integrated carry-handle optic during season1 field missions. This is distinct from the UMP he also uses in Water. Rifle fire remains one finite selected-target impact, and reconnaissance is an information buff, never a Kino fired as a projectile.', universeWeapons,
    shot('Tir du G36K de Scott', 1.1, { range: 600 }),
    buff('Scott annonce la route de reconnaissance', { duration: 3, buffMultiplier: 1.12 }),
    defend('Couvert de la mission de Scott', 0.45),
    finale(shot('Tir de couverture de Scott', 4.5, { range: 640 }), '#d6b274'))
});
