import { buff, defend, guard, hit, shot } from './rules.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE11 as DEFINITIONS } from '../combatSourceDefinitionsWave11.js';

const superAction = ability => ({ ...ability, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });
const secondary = ability => ({ ...ability, cd: 6 });
const kit = (id, simple, second, defense, special, sourceReference) => ({
  sourceHeroId: id, universe: DEFINITIONS[id].universe, sourceWork: DEFINITIONS[id].sourceWork,
  sourceReference, sourceUrl: DEFINITIONS[id].sourceReference, identityBasis: 'canonical-role',
  canonicalVerified: false, networkVerified: false, source1to1Verified: false, gameplayAdaptation: true,
  simple, secondary: secondary(second), defense, special: superAction(special)
});

export const ABILITIES_WAVE11_PART_D = Object.freeze({
  korben: kit('korben', shot('Tir du pistolet de Korben', 1.1), shot('Tir ajusté du pistolet de Korben', 1.8, { range: 560 }),
    defend('Mise à couvert de Korben', 0.5), shot('Rafale du pistolet de Korben', 4.6, { range: 640 }),
    'Korben Dallas, film1997, fights with an ordinary handheld pistol and his physical training. The ZF-1 demonstration belongs to Zorg; no rocket launcher, taxi door, explosion power or summoned vehicle is assigned to Korben.'),
  leeloo: kit('leeloo', hit('Coup de poing de Leeloo', 1.05), hit('Coup de pied de Leeloo', 1.8, { range: 100 }),
    defend('Esquive et garde de Leeloo', 0.5), hit('Enchaînement de Leeloo', 4.6, { range: 170 }),
    'Leeloo uses physical punches and kicks in the1997 film. This version selects the orange suspenders, white shirt and gold trousers. The final ritual needs the four activated stones and love: none of that context is supplied here, so no autonomous fifth-element beam, divine-language explosion or body light is invented.'),
  ruby_rhod: kit('ruby_rhod', buff('Prise de micro de Ruby Rhod', { buffMultiplier: 1.1 }), buff('Relais des informations en direct', { buffMultiplier: 1.14 }),
    defend('Mise à couvert de Ruby Rhod', 0.45), buff('Relais radio de Ruby Rhod', { duration: 4, buffMultiplier: 1.25 }),
    'Ruby Rhod is the human broadcast host of the1997 film, with his actual microphone and production communications. Passing information is an authored team buff. His voice does not cause physical damage, sonic attacks, explosions, healing or magical morale rays.'),
  zorg: kit('zorg', shot('Tir du canon du ZF-1', 1.25, { range: 520 }), shot('Roquette intégrée du ZF-1', 1.9, { shape: 'area', range: 560, areaRadius: 80 }),
    defend('Mise à couvert avec le ZF-1', 0.5), shot('Rafale du ZF-1 de Zorg', 4.8, { range: 680 }),
    'Jean-Baptiste Emanuel Zorg demonstrates the physical multifunction ZF-1 in the1997 film. Its barrel and integrated rocket equipment are portable gun components, not powers or a pistol assigned to Korben. The selected super is a conventional burst from the ZF-1, condensed to one accepted simulated projectile impact.'),
  cornelius: kit('cornelius', buff('Lecture des consignes des gardiens', { buffMultiplier: 1.1 }), guard('Indication du passage sûr par Cornelius', { reduce: 0.25 }),
    defend('Repli de Cornelius', 0.45), guard('Consignes des gardiens de Cornelius', { duration: 4, reduce: 0.4 }),
    'Vito Cornelius, film1997, is the priest who knows and explains the guardians and elemental ritual. His selected actions communicate instructions and safe movement. No activated stones, staff attack, healing miracle, elemental shield or fifth-element beam is created by his gestures.'),
  arthur_kaamelott: kit('arthur_kaamelott', hit('Taille physique d’Excalibur', 1.15), hit('Estoc d’Excalibur', 1.85, { range: 100 }),
    defend('Parade d’Excalibur', 0.55), hit('Passe d’armes à Excalibur', 4.7, { range: 170 }),
    'Arthur Pendragon in Kaamelott LivreIII2005 is a trained human king and swordsman. Excalibur is held, parried and swung physically. This authored sequence does not turn royal instructions, the Grail quest, sword light or weariness into a damaging area power.'),
  perceval_kaamelott: kit('perceval_kaamelott', guard('Garde prudente de Perceval', { duration: 2, reduce: 0.2 }), guard('Appel au regroupement de Perceval', { duration: 2.5, reduce: 0.25 }),
    defend('Repli de Perceval', 0.45), guard('Garde de Perceval', { duration: 4, reduce: 0.4 }),
    'Perceval in Kaamelott LivreIII2005 is a human knight. This selected supporting role uses a cautious physical guard and a regrouping signal, with equipment held safely. Confused rules, catchphrases, luck and misunderstandings do not strike enemies or create magical protection.'),
  karadoc_kaamelott: kit('karadoc_kaamelott', buff('Vérification des réserves de Karadoc', { buffMultiplier: 1.08 }), buff('Répartition des provisions de Karadoc', { duration: 3, buffMultiplier: 1.14 }),
    defend('Repli prudent de Karadoc', 0.45), buff('Distribution des rations de Karadoc', { duration: 4, buffMultiplier: 1.25 }),
    'Karadoc in Kaamelott LivreIII2005 carries, checks and shares ordinary provisions. These zero-damage coordination buffs adapt his concern for food and logistics. Eating is not instantaneous magical HP restoration, an offensive feast, a summoned table or supernatural nourishment.'),
  leodagan_kaamelott: kit('leodagan_kaamelott', hit('Frappe de Léodagan', 1.15), buff('Ordre de tenir la ligne de Léodagan', { buffMultiplier: 1.14 }),
    defend('Parade de Léodagan', 0.55), hit('Charge de Léodagan', 4.8, { range: 170 }),
    'Léodagan in Kaamelott LivreIII2005 is the human warrior king of Carmélide. The selected charge and sword cut are physical. Orders support the team without harming through words; no firearm, crossbow cannon, magical fortification or beam belongs to this equipment.'),
  lancelot_kaamelott: kit('lancelot_kaamelott', hit('Taille de l’épée de Lancelot', 1.1), hit('Estoc du chevalier du Lac', 1.8, { range: 100 }),
    defend('Parade de Lancelot', 0.55), hit('Passe d’armes de Lancelot', 4.7, { range: 170 }),
    'Lancelot in Kaamelott LivreIII2005 wears his pale knightly tunic and brown leather harness, with fair nape-length hair and a physical straight sword. These attacks and parries stay within that period, before later dark armour, masks, faction costume or invented holy projectiles.')
});
