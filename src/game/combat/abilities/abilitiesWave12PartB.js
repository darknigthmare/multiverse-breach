import { buff, defend, guard, hit, shot } from './rules.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE12_PART_B as DEFINITIONS } from '../combatSourceDefinitionsWave12PartB.js';

const kit = (id, simple, secondary, defense, special, sourceReference) => ({
  sourceHeroId: id, universe: DEFINITIONS[id].universe, sourceWork: DEFINITIONS[id].sourceWork,
  sourceReference, sourceUrl: DEFINITIONS[id].sourceReference, identityBasis: 'canonical-role',
  canonicalVerified: false, networkVerified: false, source1to1Verified: false, gameplayAdaptation: true,
  simple, secondary: { ...secondary, cd: 6 }, defense,
  special: { ...special, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 }
});

export const ABILITIES_WAVE12_PART_B = Object.freeze({
  predator: kit('predator', hit('Taille des lames de poignet du Jungle Hunter', 1.2), hit('Estoc rapproché du Jungle Hunter', 1.9, { range: 110 }),
    defend('Parade des lames de poignet du Jungle Hunter', 0.55), hit(DEFINITIONS.predator.name, 4.8, { range: 170 }),
    'The Jungle Hunter is the hunter of Predator1987. His two wrist blades and shoulder plasma caster belong to that film. This selected kit uses physical wrist-blade cuts and a finite close thrust; the smart disc and combi-stick of City Hunter are not transferred to him. Camouflage and the self-destruct device are not made into a damaging fog trial or an arena-wide explosion.'),
  city_hunter: kit('city_hunter', hit('Taille de la combi-stick du City Hunter', 1.2, { range: 100 }), hit('Allonge de la combi-stick du City Hunter', 1.9, { range: 130 }),
    defend('Parade à la combi-stick du City Hunter', 0.55), hit(DEFINITIONS.city_hunter.name, 4.8, { range: 190 }),
    'City Hunter in Predator2 1990 carries the telescoping combi-stick and the smart disc. The chosen native sequence is a physical combi-stick thrust with an existing held spear, not a supernatural trophy hunt, light beam, invented returning disc flight or summoned alien weapon. All three selected attacks preserve the same held spear.'),
  dutch: kit('dutch', shot('Tir au M16 de Dutch', 1.15), shot('Tir ajusté au M16 de Dutch', 1.85, { range: 570 }),
    defend('Mise à couvert de Dutch', 0.5), shot(DEFINITIONS.dutch.name, 4.7, { range: 650 }),
    'Dutch Schaefer in Predator1987 uses an M16A1 with an M203 underbarrel launcher. The chosen kit keeps the ordinary rifle and its conventional ballistic shots. Blain carries the minigun; Dutch does not receive it. Get to the chopper is a command rather than a damaging power, and no helicopter body, giant explosion, mud teleport or alien plasma caster is created.'),
  anna_predator: kit('anna_predator', guard('Repérage du passage par Anna', { duration: 2, reduce: 0.2 }), buff('Signal de regroupement d’Anna', { duration: 2.5, buffMultiplier: 1.12 }),
    defend('Repli prudent d’Anna', 0.45), guard(DEFINITIONS.anna_predator.name, { duration: 4, reduce: 0.4 }),
    'Anna Gonsalves in Predator1987 is the rescued human who observes, warns and follows an escape route. The selected protective kit adapts visible pointing and regrouping as bounded zero-damage support. She carries no invented gun, knife, alien weapon, force field or magical healing item; her speech and gestures do not hurt enemies.'),
  billy_predator: kit('billy_predator', hit('Taille de machette de Billy', 1.15), hit('Coupe contrôlée de la machette de Billy', 1.85, { range: 110 }),
    defend('Garde à la machette de Billy', 0.55), hit(DEFINITIONS.billy_predator.name, 4.7, { range: 175 }),
    'Billy Sole in Predator1987 is a human tracker carrying a large machete. The selected version retains his field gear before the bridge scene. His cuts are physical and the finishing presentation is a solo controlled swing. No self-cutting, blood ritual, spiritual attack, supernatural awareness damage or opponent execution is depicted or calculated.'),
  mac_predator: kit('mac_predator', shot('Tir au M60 de Mac', 1.2), shot('Rafale maîtrisée au M60 de Mac', 1.9, { range: 590 }),
    defend('Mise à couvert avec le M60 de Mac', 0.5), shot(DEFINITIONS.mac_predator.name, 4.8, { range: 670 }),
    'Mac Eliot in Predator1987 uses the conventional belt-fed M60 machine gun. Its stock, barrel and ammunition belt stay physical; the super adapts a controlled burst to one accepted simulated projectile impact. It does not hand him Blain’s minigun, an alien laser, explosive rage or a remote jungle-wide strike.'),
  harrigan_predator: kit('harrigan_predator', shot('Tir du pistolet de Harrigan', 1.1), shot('Visée contrôlée du pistolet de Harrigan', 1.8, { range: 540 }),
    defend('Mise à couvert de Harrigan', 0.5), shot(DEFINITIONS.harrigan_predator.name, 4.6, { range: 630 }),
    'Mike Harrigan in Predator2 1990 is an LAPD human detective using an ordinary handgun. This version keeps his pale short-sleeved shirt, trousers and holster. The selected attack is a deliberate ballistic shot, not the City Hunter’s disc, a trophy-hunt area effect, a futuristic rifle or a police command turned into damage.'),
  greyback_yautja: kit('greyback_yautja', hit('Geste de griffe de Greyback', 1.0), guard('Évaluation prudente de Greyback', { duration: 2.5, reduce: 0.25 }),
    defend('Garde de l’Ancien Greyback', 0.55), guard(DEFINITIONS.greyback_yautja.name, { duration: 4, reduce: 0.4 }),
    'Greyback Elder appears at the end of Predator2 1990 and offers Harrigan the Raphael Adolini1715 flintlock pistol as a trophy. His presentation preserves an unfired antique and a composed recognition gesture. The secondary and super are bounded support adaptations, not a magical elder aura, plasma cannon, automatic rifle or invented discharge of the trophy pistol. A basic claw motion remains separate.'),
  naru: kit('naru', hit('Taille du tomahawk de Naru', 1.1), hit('Reprise du tomahawk à corde de Naru', 1.8, { range: 110 }),
    defend('Esquive et garde de Naru', 0.5), hit(DEFINITIONS.naru.name, 4.7, { range: 175 }),
    'Naru in Prey2022 is an adult Comanche human hunter. Her practical deerskin clothing and rope-tethered tomahawk remain human equipment. The selected sequence is a short hatchet cut and rope retrieval rather than a supernatural hunt reversal, an alien weapon, magical rope, dog summon or distant axe flight. Her old erroneous alien silhouette is excluded from image-generation reference inputs.'),
  royce_predators_core: kit('royce_predators_core', shot('Tir de l’AA-12 de Royce', 1.2), shot('Tir ajusté de l’AA-12 de Royce', 1.9, { range: 550 }),
    defend('Mise à couvert de Royce', 0.5), shot(DEFINITIONS.royce_predators_core.name, 4.8, { range: 630 }),
    'Royce in Predators2010 carries the conventional AA-12 automatic shotgun with its drum magazine. This selected shot keeps that practical firearm and human tactical gear. He does not gain the Yautja’s plasma caster, a supernatural Super Predator ambush, an M60 belt feed, a world-sized explosion or an invented summoned hunter.')
});
