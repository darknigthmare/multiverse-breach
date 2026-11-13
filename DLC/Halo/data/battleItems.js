// Halo — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Bulle de bouclier deployable', 'Deployable Bubble Shield', 'Generateur UNSC de campagne: en melee il cree une fenetre de survie courte, en tactique il securise une case contre le tir Covenant.'],
      ['Grenade plasma Covenant', 'Covenant Plasma Grenade', 'Explosif adhesif de technologie Covenant: colle une cible prioritaire, punit les groupes serres et rappelle le danger des lignes Elites/Grunts.'],
      ['Batterie de bouclier MJOLNIR', 'MJOLNIR Shield Cell', 'Cellule energetique compatible Spartan: recharge une partie du bouclier, accelere la reprise d assaut et stabilise le porteur sous feu nourri.']
    ],
    summon: ['Pelican Echo 419', 'Echo 419 Pelican', 'Invocation temporaire UNSC: Foehammer ouvre une passe de soutien, depose des munitions et mitraille les signatures Covenant les plus proches.'],
    ultimate: ['Tir MAC orbital', 'Orbital MAC Strike', 'Attaque ultime UNSC: une solution de tir Magnetic Accelerator Cannon traverse la breche et frappe la ligne ennemie comme une frappe anti-capital ship miniaturisee.']
  });
}
