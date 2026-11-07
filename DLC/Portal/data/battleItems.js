// Portal — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Cube de voyage', 'Companion Cube', 'Bloque et absorbe une partie des degats.'],
      ['Gel repulsif', 'Repulsion Gel', 'Accelere le tempo du heros actif.'],
      ['Noyau PotatOS', 'PotatOS Core', 'Charge speciale et glitch defensif.']
    ],
    summon: ['Tourelle Aperture', 'Aperture Turret', 'Une tourelle temporaire arrose la zone.'],
    ultimate: ['Double portail terminal', 'Terminal Portal Loop', 'Les ennemis sont tires dans une boucle de chute infinie.']
  });
}
