// F.E.A.R. — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'fear', universe: 'F.E.A.R.', aliases: ['FEAR', 'F.E.A.R. First Encounter Assault Recon'],
    continuity: 'F.E.A.R. (2005), the original Monolith continuity',
    adaptationRule: 'Use the first game only. Alma is represented as a psychic environmental event: her child appearance is never a fighter, target or injured subject. Reduce gore and preserve the industrial paranormal tone.',
    visualAnchor: 'Cold Armacham offices, concrete service tunnels, orange industrial light, black tactical armor and blue-white psychic distortions.',
    referenceUrl: 'https://store.steampowered.com/app/21090/FEAR/',
    referenceUrls: ['https://store.steampowered.com/app/21090/FEAR/'],
    colors: ['#27313a', '#08090b', '#e36e32'], motif: 'reflex', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
    heroes: [
      { id: 'point_man', name: 'Point Man', role: 'marine', weapon: 'RPL Sub-Machinegun', weaponType: 'gun', special: 'Reflex Time', visualAnchor: 'Anonymous F.E.A.R. operative in dark gray tactical armor, compact SMG and deliberately unseen face.' },
      { id: 'jin_sun_kwon', name: 'Jin Sun-Kwon', nonCombat: true, objective: 'Read psychic residue and relay the safe route through Armacham.', visualAnchor: 'F.E.A.R. technical officer in gray field jacket with medical-psychic scanner and original non-actor face.' },
      { id: 'douglas_holiday', name: 'Douglas Holiday', role: 'tactical', weapon: 'G2A2 assault rifle', weaponType: 'gun', visualAnchor: 'Delta Force sergeant in olive-black tactical kit, helmet, goggles and rifle; original face.' }
    ],
    enemies: [
      { id: 'replica_soldier', name: 'Replica Soldier', weapon: 'G2A2 rifle', special: 'Coordinated flank', visualAnchor: 'Masked clone infantry in black segmented armor with red optics and compact rifle.' },
      { id: 'atc_assassin', name: 'ATC Assassin', weapon: 'Claw strike', special: 'Optical camouflage', visualAnchor: 'Lean black-armored ATC infiltrator with translucent camouflage shimmer and clawed gloves.' },
      { id: 'heavy_armor', name: 'Heavy Armor', weapon: 'Heavy cannon', special: 'Armored advance', visualAnchor: 'Broad Replica heavy unit in bulky gray-black powered armor with enclosed helmet and rotary cannon.' }
    ],
    bosses: [
      { id: 'paxton_fettel', name: 'Paxton Fettel', weapon: 'Psychic command', special: 'Replica synchronization', visualAnchor: 'Pale psychic commander in dark suit and long coat, surrounded by red-black signal echoes; original face.' },
      { id: 'rev6_power_armor', name: 'REV6 Power Armor', weapon: 'Twin cannons', special: 'Powered stomp', visualAnchor: 'Tall enclosed gray military exoskeleton with squared cockpit, twin arm cannons and orange warning lights.' },
      { id: 'atc_heavy_mech', name: 'ATC Heavy Mech', weapon: 'Rocket pods', special: 'Facility lockdown', visualAnchor: 'Blocky ATC combat mech in dirty white-gray plating, red sensors and shoulder rocket racks.' }
    ],
    worldBoss: { id: 'alma_psychic_event', name: 'Alma’s Psychic Event', nonCombat: true, objective: 'Seal the psychic breach and escape the collapsing Origin facility without targeting Alma.', visualAnchor: 'A corridor-scale red psychic wave, floating debris and adult shadow silhouette far beyond the route; no child body, injury or target reticle.' },
    gear: ['RPL Sub-Machinegun', 'Type-7 Particle Weapon', 'Reflex Booster'],
    stages: [
      { name: 'Armacham Technology Corporation', visualAnchor: 'Abandoned corporate floors opening into industrial laboratories and Replica ambush routes.' },
      { name: 'Interval 07 — Urban Decay', visualAnchor: 'Ruined city blocks, subway works and orange utility lamps.' },
      { name: 'Origin Facility Evacuation', nonCombat: true, objective: 'Reach the blast-safe route while sealing psychic relays.', visualAnchor: 'Underground vault collapsing beneath a red-white psychic shockwave.' }
    ],
    event: { id: 'first_encounter', name: 'First Encounter', frName: 'Premier contact', visualAnchor: 'F.E.A.R. squad lights crossing a psychic distortion inside Armacham.' }
  });
}
