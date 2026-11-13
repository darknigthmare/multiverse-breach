// Hellraiser — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('joey_summerskill', 'Joey Summerskill', 'horror', '#bfc9ca', 'puzzlebox', 'Dream Investigate Pulse', 'Lament Seal Twist', 'Reporter Resolve Guard', 'Boone Prophecy Break'),
    hero('riley_mckendry', 'Riley McKendry', 'horror', '#8f765f', 'puzzlebox', 'Configuration Blade Feint', 'Six-Phase Solve', 'Addiction Recovery Guard', 'Choose Lament'),
    hero('the_priest_2022', 'The Priest (2022)', 'horror', '#ddd2c2', 'chains', 'Pearl-Pin Chain', 'Configuration Sentence', 'Labyrinth Procession', 'Leviathan Audience')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('chains', 'Needle Chain Lash', 'Labyrinth Hook Snare', 'Cenobite Pain Guard', 'Order of the Gash', '#b2bec3'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('hook', 'Butcher Hook Hit', 'Cenobite Drag', 'Flesh Apron Guard', 'Labyrinth Appetite', '#636e72'));
}

export function createLoreAccurateHeroOverrides3({ loadout }) {
  return (loadout('chains', 'Hook Chain Lash', 'Hell Priest Sentence', 'Pain Theology Ward', 'Lament Configuration Verdict', '#17202a'));
}

export function createLoreAccurateHeroOverrides4({ loadout }) {
  return (loadout('claws', 'Chattering Bite', 'Chain Hook Drag', 'Cenobite Flesh Guard', 'Labyrinth Hunger', '#d0d3d4'));
}

export function createLoreAccurateHeroOverrides5({ loadout }) {
  return (loadout('knife', 'Cotton House Lure', 'Blood Resurrection Pact', 'Human Betrayal Guard', 'Labyrinth Consort Return', '#8b0000'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('The Gasp (2022)', 132, 17, 6, '#d9c8ba', 'throat_hooks'),
      monster('The Weeper (2022)', 118, 16, 7, '#c8b7aa', 'tear_blades'),
      monster('The Asphyx (2022)', 148, 18, 4, '#cfbcae', 'airway_collar'),
      monster('The Mother (2022)', 166, 19, 3, '#d7c2b5', 'maternal_claws'),
      monster('The Masque (2022)', 124, 17, 7, '#d8c9bd', 'face_mask_lash'),
      monster('Chatterer (2022)', 178, 20, 6, '#d6c4b4', 'chattering_maw'),
      monster('Pistonhead Cenobite', 126, 16, 5, '#6f625d', 'piston_ram'),
      monster('Camerahead Cenobite', 112, 15, 6, '#81746d', 'camera_lens'),
      monster('CD Cenobite', 118, 17, 7, '#5e5962', 'disc_blades'),
      monster('Barbie Cenobite', 146, 18, 4, '#5f5149', 'flame_nozzle'),
      monster('Dreamer Cenobite', 108, 15, 7, '#8a6d63', 'smoke_breath'),
      monster('Chatterer II', 152, 19, 6, '#bca993', 'chattering_bite'),
      monster('Chatterer III', 158, 19, 6, '#b79a82', 'pendulum_hook_bite'),
      monster('Chatterer Beast', 184, 21, 7, '#7d6556', 'beast_charge'),
      monster('Bloodline Twins', 176, 20, 5, '#bca794', 'twin_chain'),
      monster('Wire Twins', 142, 18, 7, '#b7a59b', 'wire_hooks'),
      monster('Torso Cenobite', 132, 18, 5, '#a89484', 'floor_lunge'),
      monster('Stitch Cenobite', 136, 17, 5, '#9f8b80', 'stitch_hooks'),
      monster('Bound Cenobites', 164, 19, 4, '#97857c', 'bound_chain'),
      monster('Surgeon Cenobite', 154, 19, 5, '#a9988d', 'surgical_tools'),
      monster('Little Sister Cenobite', 134, 17, 7, '#b8aaa1', 'facial_wire_chain'),
      monster('Bound II Cenobite', 172, 20, 4, '#8f8179', 'pendulum_blade_crank'),
      monster('Female Chatterer', 156, 19, 7, '#b59c8d', 'wire_ponytail_hooks'),
      monster('Stitch Twins', 182, 20, 6, '#aa9187', 'twin_ribbon_chains'),
      monster('Pseudo-Pinhead', 148, 18, 5, '#b5a18e', 'nail_grid'),
      monster('The Auditor (Judgment)', 138, 16, 5, '#7d5f45', 'flesh_typewriter', {
        special: 'Stygian Sin Audit'
      }),
      monster('The Assessor (Judgment)', 172, 17, 3, '#7a604e', 'flesh_pages', {
        special: 'Rancid Verdict Process'
      }),
      monster('The Jury (Judgment)', 156, 18, 6, '#8f625b', 'collective_verdict', {
        special: 'Threefold Guilty Verdict'
      }),
      monster('The Cleaners (Judgment)', 164, 16, 5, '#81756a', 'cleansing_grapple', {
        special: 'Stygian Cleansing Process'
      })
    ],
    bosses: [
      boss('The Priest (2022)', 720, 27, 6, '#ded2c2', 'pearl_pin_chains', 'Leviathan Audience', {
        spriteSource: '/sprites/generated/heroes/hellraiser/the-priest-2022.png'
      }),
      boss('Roland Voight - Leviathan Transformation', 760, 29, 3, '#d8c0ae', 'leviathan_suspension', 'Power Configuration Reward'),
      boss('Angelique Cenobite', 660, 25, 7, '#c4b2a1', 'wire_blades', 'Princess of Torment'),
      boss('The Butcher (Judgment)', 740, 28, 3, '#5f473c', 'giant_cleaver', 'Stygian Butchery Sentence'),
      boss('The Surgeon (Judgment)', 680, 26, 8, '#69635f', 'surgical_rig', 'Stygian Surgical Judgment')
    ]
  });
}
