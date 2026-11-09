// Metal Gear Rising — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterExtraPatch() {
  return ([
    { id: 'armstrong_mgr', name: 'Senator Armstrong', cat: 'marine', color: '#c0392b', simpleName: 'Nanomachine Punch', secondaryName: 'Football Charge', defenseName: 'Hardened Skin', specialName: 'Making the Mother of All Omelettes' },
    { id: 'blade_wolf_mgr', name: 'Blade Wolf', cat: 'slayer', color: '#95a5a6', simpleName: 'HF Chainsaw Bite', secondaryName: 'Stealth Pounce', defenseName: 'AI Evasion', specialName: 'LQ-84i Freedom Run' },
    { id: 'mistral_mgr', name: 'Mistral', cat: 'horror', color: '#8e44ad', simpleName: 'Dwarf Gekko Polearm', secondaryName: 'Tripod Arm Sweep', defenseName: 'Magnetic Guard', specialName: 'Winds of Destruction Spiral' },
    { id: 'monsoon_mgr', name: 'Monsoon', cat: 'hacker', color: '#9b59b6', simpleName: 'Magnetic Sai Cut', secondaryName: 'Dystopia Pincer Sweep', defenseName: 'Segmented Body Dodge', specialName: 'Memes of Destruction' }
  ]);
}
