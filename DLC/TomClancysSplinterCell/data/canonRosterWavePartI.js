// Tom Clancy’s Splinter Cell — definitions consumed by src/game/canonRosterWavePartI.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPartI() {
  return ({
    key: 'splinter_cell', universe: 'Tom Clancy’s Splinter Cell', aliases: ['Splinter Cell'],
    continuity: 'Main Splinter Cell game continuity through Blacklist',
    adaptationRule: 'Use stealth, gadgets and light/shadow language. Grim’s role is non-combat intelligence; civilians and hostages are failure-state protected subjects. No actor likeness.',
    visualAnchor: 'Near-black infiltration spaces, green tri-lens goggles, blue security light, fiber-optic cameras and restrained tactical silhouettes.',
    referenceUrl: 'https://www.ubisoft.com/en-us/company/about-us/our-brands/tom-clancy-s-splinter-cell', colors: ['#1e3029', '#050807', '#5ee48f'], motif: 'tri-goggles', faction: 'stealth', mode: 'Tactics', difficulty: 'Expert',
    heroes: [
      { id: 'sam_fisher', name: 'Sam Fisher', role: 'tactical', weapon: 'SC pistol', weaponType: 'gun', visualAnchor: 'Veteran covert operative in black tactical suit with three green goggle lenses, compact pistol and original non-actor face.' },
      { id: 'anna_grim', name: 'Anna “Grim” Grímsdóttir', nonCombat: true, objective: 'Decrypt the intelligence feed and route the team around civilian zones.', visualAnchor: 'Operations specialist in dark professional fieldwear with green-lit tablet and original face.' },
      { id: 'isaac_briggs', name: 'Isaac Briggs', role: 'tactical', weapon: 'SC4000 carbine', weaponType: 'gun', visualAnchor: 'Fourth Echelon operative in black-gray body armor, green optic and compact carbine; original face.' }
    ],
    enemies: ['Mercenary Rifleman', 'Blacklist Engineer', 'Displace Operative'], bosses: ['Kombayn Nikoladze', 'Douglas Shetland', 'Emile Dufraisne'],
    worldBoss: { id: 'majid_sadiq', name: 'Majid Sadiq', visualAnchor: 'Fictional Blacklist leader in dark tactical coat within a green-lit Site F corridor; original face.' },
    gear: ['Tri-Rotor Drone', 'Sticky Camera', 'SC-20K'], stages: ['Georgian Defense Ministry', 'Bathhouse Shadows', 'Site F Blacklist Finale'],
    event: { id: 'lights_out', name: 'Lights Out', frName: 'Extinction des lumières' }
  });
}
