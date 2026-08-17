import { freezeCanonRosterPart } from './canonRosterPackFactory.js';

const r = (key, universe, referenceUrl, heroes, enemies, bosses, worldBoss, gear, stages, options = {}) => ({
  key, universe, referenceUrl, heroes, enemies, bosses, worldBoss, gear, stages,
  aliases: options.aliases || [], continuity: options.continuity || `${universe} primary continuity`,
  adaptationRule: options.rule || `Preserve ${universe}'s canon while using original fan-made art; no copied official art, logos, gore or actor likeness.`,
  visualAnchor: options.anchor || `${universe} signature setting, palette, silhouettes and props recreated as original fan art.`,
  mediaType: options.mediaType || 'film', faction: options.faction || 'horror', mode: options.mode || 'Trial', difficulty: options.difficulty || 'Hard',
  colors: options.colors || ['#3b3130', '#090a0b', '#bc553f'], motif: options.motif || 'pursuit', allNonCombat: options.allNonCombat === true,
  event: { id: 'breach_event', name: `${universe} Breach`, frName: `Brèche ${universe}` }
});

const rows = [
  r('texas_chain_saw', 'The Texas Chain Saw Massacre', 'https://www.thetexaschainsawmassacre.com/',
    ['Sally Hardesty', { id: 'franklin', name: 'Franklin Hardesty', nonCombat: true, objective: 'Signal the safe route and unlock the roadside exit.' }, 'Jerry'],
    ['Farmhouse Pursuit', 'Generator Trap Route', 'Bone-Room Alarm'], ['The Hitchhiker', 'The Cook', 'Leatherface'],
    { id: 'family_house', name: 'Family House Escape Network', nonCombat: true, objective: 'Open the exits and evacuate every survivor without attacking the family.', visualAnchor: 'Sun-baked farmhouse, generator cables and three locked exits; no gore or person as target.' },
    ['Flash Camera', 'Fuel Can', 'Exit Fuse'], ['Texas Back Road', 'Family Farmhouse Escape', 'Dawn Highway Run'],
    { aliases: ['Leatherface', 'Texas Chainsaw Massacre'], continuity: 'The Texas Chain Saw Massacre (1974) film continuity', rule: 'No actor likeness, gore, dismemberment or torture imagery. Survivors navigate escape Trials; Leatherface retains the fictional mask and apron silhouette without blood.', anchor: 'Sun-bleached rural Texas, weathered farmhouse, rusted generators and clean horror silhouettes.' }),

  r('friday_13th', 'Friday the 13th', 'https://www.paramountpictures.com/movies/friday-the-13th',
    ['Alice Hardy', 'Tommy Jarvis', { id: 'ginny', name: 'Ginny Field', nonCombat: true, objective: 'Decode the cabin map and coordinate every counselor evacuation.' }],
    ['Cabin Power Failure', 'Forest Snare Route', 'Lake Fog Pursuit'], ['Pamela Voorhees', 'Jason — Sack Mask', 'Jason — Hockey Mask'],
    { id: 'camp_lockdown', name: 'Camp Crystal Lake Lockdown', nonCombat: true, objective: 'Repair the car, call for help and evacuate the camp.', visualAnchor: 'Moonlit camp map, radio tower, repaired car and safe evacuation indicators.' },
    ['Counselor Radio', 'Car Battery', 'Cabin Map'], ['Camp Crystal Lake Cabins', 'Pine Forest Escape', 'Lake Road Evacuation'],
    { aliases: ['Vendredi 13', 'Jason Voorhees'], continuity: 'Friday the 13th film-series continuity', rule: 'No actor likeness, gore or graphic injury. Young counselors are fully clothed escape participants; Jason is a clean fictional silhouette and never shown harming anyone.', anchor: 'Moonlit summer camp, pine fog, wooden cabins, lake reflections and masked slasher silhouette.' }),

  r('nightmare_elm_street', 'A Nightmare on Elm Street', 'https://www.warnerbros.com/movies/nightmare-elm-street',
    ['Nancy Thompson', 'Kristen Parker', { id: 'glen', name: 'Glen Lantz', nonCombat: true, objective: 'Maintain the wake timer and guide the group out of the dream maze.' }],
    ['Boiler-Room Steam Gate', 'Dream Staircase Loop', 'Sleep Timer'], ['Freddy Dream Shadow', 'Boiler Room Labyrinth', 'Freddy Krueger'],
    { id: 'dream_nexus', name: 'Elm Street Dream Nexus', nonCombat: true, objective: 'Break the nightmare anchors and wake every sleeper safely.', visualAnchor: 'Abstract red-green dream clock, boiler pipes and four collapsing nightmare doors; no injured person.' },
    ['Wake-Up Alarm', 'Dream Journal', 'Protective Talisman'], ['1428 Elm Street', 'Boiler Room Dream', 'Dream Nexus Wake Route'],
    { aliases: ['Elm Street Freddy', 'Freddy Krueger'], continuity: 'Original A Nightmare on Elm Street film-series continuity', rule: 'No actor likeness, gore, burns detail or child harm. Freddy uses the fictional hat, striped sweater and claw silhouette; encounters focus on dream puzzles and escape.', anchor: 'Surreal Elm Street suburb, red-green dream light, boiler pipes, long shadows and impossible stairs.' }),

  r('truman_show', 'The Truman Show', 'https://www.paramountpictures.com/movies/the-truman-show',
    ['Truman Burbank', 'Sylvia / Lauren Garland', 'Marlon'], ['Continuity Error', 'Hidden Camera Blind Spot', 'Scripted Traffic Loop'], ['Radio Tracking Puzzle', 'Seahaven Exit Blockade', 'Studio Storm Sequence'],
    { id: 'christof_control', name: 'Christof’s Control Room', nonCombat: true, objective: 'Expose the broadcast controls, cross the studio sea and reach the exit door.', visualAnchor: 'Moon-shaped studio control room overlooking the artificial ocean and exit staircase; original faces only.' },
    ['Sailboat Compass', 'Hidden Camera Map', 'Exit Door Key'], ['Seahaven Morning Loop', 'Mococoa Broadcast Set', 'Studio Ocean Exit'],
    { aliases: ['Truman show'], continuity: 'The Truman Show (1998) film continuity', allNonCombat: true, faction: 'drama', difficulty: 'Normal', rule: 'Investigation, observation, sailing and exit Trials only. No actor likeness, combat, stalking mechanics or invasion of private real-person data.', anchor: 'Pastel Seahaven streets, concealed studio cameras, artificial horizon, sailboat and black exit doorway.' }),

  r('torbahead', 'Torbahead', 'https://linktr.ee/torbahead',
    ['Torbahead Reel Persona', 'Daily Greeting Caption', 'Community Remix Curator'], ['Missed Beat Marker', 'Caption Timing Drift', 'Loop Transition Error'], ['Wednesday Reel Sequence', 'Pa-Parla Americano Sync', 'Good Day Loop'],
    { id: 'reel_marathon', name: 'Torbahead Reel Marathon', nonCombat: true, objective: 'Synchronize greetings, audio cues and loop transitions without identifying or depicting the account owner.', visualAnchor: 'Abstract vertical-video frames, waveform bars and greeting cards; no face, body or private information.' },
    ['Greeting Card', 'Audio Sync Meter', 'Loop Marker'], ['Daily Greeting Reel', 'Music Sync Timeline', 'Community Loop Showcase'],
    { aliases: ['Torbahead Instagram'], continuity: 'Public Torbahead social-media persona and published reel format only', allNonCombat: true, mediaType: 'social-media', faction: 'absurd', difficulty: 'Normal', rule: 'Use only the public persona, recurring greeting, audio timing, captions and reel accessories. Do not research, infer or depict identity, face, body, location, private life or personal data.', anchor: 'Abstract vertical reels, simple greeting cards, music waveforms and loop controls; no supposed likeness.' })
];

export const CANON_ROSTER_WAVE_PART_M = freezeCanonRosterPart(rows);
