// Teen Titans — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('starfire_tt', 'Starfire', 'slayer', '#ff7a24', 'starbolts', 'Starbolt Volley', 'Tamaranean Flight Kick', 'Alien Resilience Guard', 'Nova Starburst'),
    hero('beast_boy_tt', 'Beast Boy', 'horror', '#2ecc71', 'shapeshift', 'Gorilla Slam', 'Pterodactyl Dive', 'Mouse Escape Guard', 'T-Rex Morph Rampage')
  ]);
}
