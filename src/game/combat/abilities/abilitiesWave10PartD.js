import { buff, defend, guard } from './rules.js';

const superAction = ability => ({ ...ability, color: '#b2c9b0', animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });

export const ABILITIES_WAVE10_PART_D = Object.freeze({
  janine_gb: {
    sourceHeroId: 'janine_gb', universe: 'Ghostbusters', sourceWork: 'Ghostbusters (1984)',
    sourceReference: 'In the1984 film Janine Melnitz receives calls and handles the firehouse reception. Passing a call and recording a dispatch help the team coordinate; these authored support effects do not shoot telephones, summon armed personnel, capture people or grant paranormal powers.',
    identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false, gameplayAdaptation: true,
    simple: buff('Prise d’appel de Janine', { duration: 2.5, buffMultiplier: 1.1 }),
    secondary: { cd: 6, ...guard('Transmission de l’alerte par Janine', { duration: 2.5, reduce: 0.25 }) },
    defense: defend('Abri derrière le comptoir de Janine', 0.5, { duration: 1.5 }),
    special: superAction(buff('Coordination de la caserne par Janine', { duration: 4, buffMultiplier: 1.25 }))
  }
});

const version = (universe, sourceWork, versionNote) => ({ universe, sourceWork, versionNote });
export const ABILITY_REVISIONS_WAVE10_PART_D = Object.freeze({
  venkman_gb: version('Ghostbusters', 'Ghostbusters (1984)', '1984 Peter Venkman wears the tan field jumpsuit and carries a real proton pack and connected neutrona wand. Existing beams are technological equipment adapted to cross-universe combat, not personal magic or a claim that all opponents are ghosts.'),
  stantz_gb: version('Ghostbusters', 'Ghostbusters (1984)', '1984 Ray Stantz uses proton equipment and the wired ghost trap. The existing trap secondary/super remain allied guard adaptations: placement, a safe-position signal and foot-pedal handling, without forcibly capturing or possessing arbitrary non-ghost opponents.'),
  zeddemore_gb: version('Ghostbusters', 'Ghostbusters (1984)', '1984 Winston Zeddemore has short dark hair and moustache, tan field jumpsuit, proton pack and connected neutrona wand. Existing support fire is equipment-based; no spectral body transformation or magical ammunition is introduced.'),
  spengler_gb: version('Ghostbusters', 'Ghostbusters (1984)', '1984 Egon Spengler has dark hair and glasses, a tan jumpsuit and the handheld PKE Meter with folding antenna arms. His selected simple/secondary/super stay informational buffs, with no attack from the scanner, jet propulsion or paranormal personal power.'),
  bill_l4d: version('Left 4 Dead', 'Left 4 Dead (2008)', 'Original-game Bill is the grey-bearded veteran in green beret, olive field jacket and dark boots. The selected ordinary loadout is the available M16 assault rifle. His existing coverage super protects allies through an authored regroup/cover adaptation and adds no new damaging volley.'),
  ellis_l4d: version('Left 4 Dead', 'Left 4 Dead 2 (2009)', 'Ellis wears the blue/white baseball cap, yellow mechanic T-shirt and blue jeans. His selected basic loadout is an available compact SMG; checking tools and equipment supplies the existing allied buff, not a cannon, invented vehicle summon or supernatural repair power.'),
  coach_l4d: version('Left 4 Dead', 'Left 4 Dead 2 (2009)', 'Coach is the bald heavyset Black survivor in the purple/yellow polo and tan trousers. The selected ordinary firearm is an available pump shotgun. His existing super is a zero-damage team instruction buff; no chainsaw attack, magical healing or additional damaging burst replaces that support role.'),
  rochelle_l4d: version('Left 4 Dead', 'Left 4 Dead 2 (2009)', 'Rochelle wears her pink band T-shirt, dark jeans, hoop earrings and tied-back dark hair. Her basic loadout is an available conventional pistol, while observation and signalling the extraction route preserve the existing allied guard super. No axe action or psychic route projection is introduced.'),
  nick_l4d: version('Left 4 Dead', 'Left 4 Dead 2 (2009)', 'Nick wears a light suit over an open blue shirt, with dark slicked-back hair and stubble. His simple uses one physical semi-auto pistol; secondary/super use the available dual-pistol loadout, represented by a P220-style pistol and a shorter Glock-style offhand pistol. The engine condenses the depicted sequence into one accepted impact, without innate power or additional simulated bullets.')
});
