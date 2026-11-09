// Silent Hill — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Radio parasite', 'Static Radio', 'Alerte de survie Silent Hill: en melee elle gronde quand une menace approche, en tactique elle revele une case ennemie cachee par le brouillard.'],
      ['Ampoule de soin', 'Health Drink', 'Ressource fragile de survie: soigne peu mais vite, utile quand l Otherworld force a avancer sans station sure.'],
      ['Carte griffonnee de South Vale', 'Marked South Vale Map', 'Carte qui se corrige pendant la mission: indique une sortie, marque les portes condamnees et reduit le risque de tourner en boucle dans la ville.']
    ],
    summon: ['Echo de Harry Mason', 'Harry Mason Echo', 'Invocation temporaire: une trace de Harry traverse le brouillard, guide Heather/James vers une sortie et repousse les monstres symboliques sans briser le ton survival.'],
    ultimate: ['Sirene Otherworld', 'Otherworld Siren', 'Attaque ultime: la sirene retentit, les murs deviennent rouille et la ville juge les ennemis; les cibles sont ralenties, marquees et frappees par leurs propres symboles.']
  });
}
