import { buff, defend, guard, hit, shot } from './rules.js';

const superAction = (action, color, animationDuration = 1.1, hitAt = 0.451) => ({
  ...action, color, animationDuration, hitAt, meterCost: 100
});
const kit = (sourceHeroId, universe, sourceWork, sourceReference, sourceUrl, simple, secondary, defense, special) => ({
  sourceHeroId, universe, sourceWork, sourceReference, sourceUrl,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense, special
});

// The selected versions are Half-Life 2 (2004) and Fallout 4 (2015).
// Names describe real equipment or roles. Compact timing, damage and support
// ratios are adaptations, rather than claims of source-game moves or frames.
export const ABILITIES_WAVE10_PART_B = Object.freeze({
  freeman: kit('freeman', 'Half-Life', 'Half-Life 2 (2004), Citadel supercharged Gravity Gun',
    'Gordon wears the orange-and-charcoal Mark V HEV suit and uses a crowbar. The ordinary orange Gravity Gun punts a real small metal crate. In the Citadel its blue supercharged version can capture and redirect Combine energy balls; the selected super represents one captured ball released from the actual three-pronged tool. One bounded projectile impact replaces source-game lethality. No Half-Life 1 Gluon Gun, continuous emitted laser, invented minigun or projected human body. HEV protection is personal guard without healing.',
    'https://combineoverwiki.net/wiki/Zero_Point_Energy_Field_Manipulator',
    hit('Coup de pied-de-biche de Freeman', 1.1, { range: 100 }),
    shot('Projection au pistolet antigravité', 1.8, { range: 550 }),
    defend('Protection de la combinaison HEV', 0.45),
    superAction(shot('Pistolet antigravité surchargé', 4.8, { range: 640 }), '#8edaff')),
  barney: kit('barney', 'Half-Life', 'Half-Life 2 (2004), unmasked undercover Civil Protection and Resistance leader',
    'The Half-Life 2 Barney wears Civil Protection clothing and chest armor, with his uncovered graying-haired head, and uses a captured AR2 pulse rifle. The basic and super are finite rifle shots at one target. His directions to the Resistance provide a bounded allied coordination buff; cover is personal. No Black Mesa blue security-guard uniform, police helmet or summoned evacuation damage.',
    'https://combineoverwiki.net/wiki/Barney_Calhoun',
    shot('Tir de l’AR2 de Barney', 1, { range: 640 }),
    buff('Barney guide la Résistance', { duration: 3, buffMultiplier: 1.12 }),
    defend('Couvert de Barney', 0.45),
    superAction(shot('Tir de couverture à l’AR2', 4.1, { range: 640 }), '#e4c18b')),
  alyx_vance: kit('alyx_vance', 'Half-Life', 'Half-Life 2 (2004)',
    'Alyx uses her own compact automatic pistol and her physical multitool to operate Combine electronics. The basic and super are single-target pistol shots. Opening a passage is adapted as short allied protection, without offensive hacking damage. Her brown jacket, white hood, headband and jeans are the original Half-Life 2 appearance. No Half-Life: Alyx gravity gloves, holographic dog or invented robot strike.',
    'https://combineoverwiki.net/wiki/Alyx%27s_Gun',
    shot('Tir du pistolet d’Alyx', 1, { range: 600 }),
    guard('Ouverture du passage au multitool', { duration: 2, reduce: 0.3 }),
    defend('Couvert d’Alyx', 0.45),
    superAction(shot('Tir de précision d’Alyx', 4.5, { range: 600 }), '#edc388')),
  paladin: kit('paladin', 'Fallout', 'Fallout 4 (2015), Brotherhood T-60b Paladin Danse',
    'Danse uses Brotherhood T-60 power armor and a laser rifle. The selected presentation keeps his head uncovered and the actual rifle in both hands. The laser is condensed to one finite single-target shot, without penetration or an area explosion. A braced armor stance is personal guard; he does not summon Liberty Prime, heal companions or fire from empty armored hands.',
    'https://gamevoyagers.com/do-companions-use-ammo-in-fallout-4/',
    shot('Tir du fusil laser de Danse', 1, { range: 640 }),
    defend('Ancrage de l’armure T-60 de Danse', 0.4, { duration: 2 }),
    defend('Protection T-60 de Danse', 0.45),
    superAction(shot('Salve du fusil laser de Danse', 4.6, { range: 640 }), '#f5887a')),
  nick_v: kit('nick_v', 'Fallout', 'Fallout 4 (2015), Nick Valentine',
    'Nick is the damaged synth detective in a worn fedora and faded trench coat, with a pipe revolver pistol as his default weapon. Both attacks use that visible handmade revolver, without falsely identifying it as the ordinary .44 weapon. His detective case work is adapted as allied information support, never an offensive clue scan, electronic magic, healing or a summoned case-file explosion.',
    'https://gamevoyagers.com/do-companions-use-ammo-in-fallout-4/',
    shot('Tir du revolver artisanal de Nick', 1, { range: 560 }),
    buff('Nick recoupe les indices de l’enquête', { duration: 3, buffMultiplier: 1.12 }),
    defend('Couvert du détective Valentine', 0.45),
    superAction(shot('Tir précis du revolver artisanal de Nick', 4.6, { range: 560 }), '#ddc18d'))
});

export const ABILITY_REVISIONS_WAVE10_PART_B = Object.freeze({
  eli_vance: {
    universe: 'Half-Life', sourceWork: 'Half-Life 2 (2004), Black Mesa East',
    sourceUrl: 'https://combineoverwiki.net/wiki/Eli_Vance',
    versionNote: 'Eli is a Resistance scientist and coordinator, with a left below-knee prosthetic leg. His briefing, data comparison and preparations remain support at zero damage. No invented handheld laser gun, offensive ray, heal or combat teleporter. The four-second attack bonus is an explicit adaptation of coordination, not a named supernatural power.',
    special: superAction(buff('Coordination de Black Mesa East', { duration: 4, buffMultiplier: 1.2 }), '#b9c8ae', 1.1, 0.45)
  },
  kleiner: {
    universe: 'Half-Life', sourceWork: 'Half-Life 2 (2004), Kleiner’s laboratory',
    sourceUrl: 'https://combineoverwiki.net/wiki/Isaac_Kleiner',
    versionNote: 'Kleiner is the lab-coated Resistance scientist who operates the local teleportation laboratory. The selected kit represents checking physical relays and preparing a safe transfer; its allied guard is a bounded support adaptation, not a weapon, healing field, magical shield emitter or enemy teleportation attack. No invented oversized laser rifle.',
    special: superAction(guard('Calibration du téléporteur', { duration: 4, reduce: 0.5 }), '#a8ddeb', 1.1, 0.45)
  },
  dogmeat: {
    universe: 'Fallout', sourceWork: 'Fallout 4 (2015), German Shepherd companion',
    sourceUrl: 'https://fallout.fandom.com/wiki/Dogmeat_(Fallout_4)',
    versionNote: 'Fallout 4 Dogmeat is a real four-legged German Shepherd who bites and can restrain hostile targets. His special remains one close single-target bite-and-hold, with actual canine head, torso, four paws and tail. No humanoid hands, held weapon, sword slash, energy claw or magic; vigilance remains protective support. His standing canine height is calibrated independently from biped BODY190.',
    special: superAction(hit('Prise de Dogmeat', 3.6, { range: 125 }), '#ad8b5e', 1.25, 0.5)
  },
  piper_wright: {
    universe: 'Fallout', sourceWork: 'Fallout 4 (2015), Publick Occurrences journalist',
    sourceUrl: 'https://gamevoyagers.com/do-companions-use-ammo-in-fallout-4/',
    versionNote: 'Piper wears her red leather coat and press cap, carries the actual 10mm pistol, and publishes Publick Occurrences. Her basic remains a physical pistol shot. The super preserves the existing zero-damage allied information buff, an adaptation of reporting rather than the source companion perk’s experience gain. The newspaper is paper, not a projectile, spell, healing item or energy weapon.',
    special: superAction(buff('Publick Occurrences — vérité publiée', { range: 1200, duration: 5, buffMultiplier: 1.27 }), '#c45c54', 1.35, 0.55)
  },
  preston_garvey: {
    universe: 'Fallout', sourceWork: 'Fallout 4 (2015), Commonwealth Minutemen',
    sourceUrl: 'https://gamevoyagers.com/do-companions-use-ammo-in-fallout-4/',
    versionNote: 'Preston wears the colonial duster and Minuteman hat and uses a crank-charged laser musket. The shot leaves that musket’s actual barrel and affects one selected target. The previous penetrating line shape is corrected to an ordinary finite projectile. No automatic modern rifle, invented golden aura, artillery summon, environmental instant kill or beam through multiple enemies.',
    special: superAction(shot('Mousquet laser des Minutemen', 4, { range: 760 }), '#e97e73', 1.25, 0.5)
  }
});
