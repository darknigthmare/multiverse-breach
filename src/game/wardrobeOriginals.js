// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcAlien from '../../DLC/Alien/data/wardrobeOriginals.js';
import * as dlcAliens from '../../DLC/Aliens/data/wardrobeOriginals.js';
import * as dlcHalo from '../../DLC/Halo/data/wardrobeOriginals.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/wardrobeOriginals.js';
import * as dlcPortal from '../../DLC/Portal/data/wardrobeOriginals.js';
import * as dlcPredator from '../../DLC/Predator/data/wardrobeOriginals.js';
import * as dlcResidentEvil from '../../DLC/ResidentEvil/data/wardrobeOriginals.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/wardrobeOriginals.js';
import * as dlcDeadSpace from '../../DLC/DeadSpace/data/wardrobeOriginals.js';
import * as dlcDoom from '../../DLC/Doom/data/wardrobeOriginals.js';
import * as dlcStarWars from '../../DLC/StarWars/data/wardrobeOriginals.js';
import * as dlcNieR from '../../DLC/NieR/data/wardrobeOriginals.js';
import * as dlcFinalFantasyVII from '../../DLC/FinalFantasyVII/data/wardrobeOriginals.js';
import * as dlcTombRaider from '../../DLC/TombRaider/data/wardrobeOriginals.js';

// Original design briefs, NOT PNGs. Never change an identity, age, anatomy or moveset.
const L = (fr, en) => Object.freeze({fr, en});
export const ORIGINAL_COLLECTIONS = Object.freeze([
  Object.freeze({key:'convergence',name:L('Convergence — uniforme Nexus','Convergence — Nexus uniform'),
    brief:L('Graphite, ivoire et liseré cyan ; anneau Nexus brisé. Adapter les panneaux aux vêtements ou surfaces existants, visage et silhouette lisibles.',
      'Graphite, ivory and a cyan seam; broken Nexus-ring badge. Fit panels to existing clothes or surfaces; keep face and silhouette readable.')}),
  Object.freeze({key:'expedition',name:L('Expédition des Failles','Rift Expedition'),
    brief:L('Textiles techniques et renforts amovibles, marquages ambre, accessoires de terrain compatibles avec la morphologie. Ne jamais ajouter de membre ou d’arme.',
      'Technical fabric and removable reinforcement, amber wayfinding, field accessories fitted to the anatomy. Never add limbs or weapons.')}),
  Object.freeze({key:'nocturne',name:L('Nocturne — gala des mondes','Nocturne — gala of worlds'),
    brief:L('Matières mates, accents améthyste et argent. Tenue cérémonielle ou finition de surface selon le corps, sans changer l’âge ni sexualiser le personnage.',
      'Matte materials, amethyst and silver accents. Ceremonial clothing or surface finish as the body permits; no age change or sexualization.')})
]);
// Bespoke concepts complement, rather than replace, the shared collections.
// Explicit universe + exact id: never transfer a design to a namesake.
const p = (universe,id,fr,en,briefFr,briefEn) => Object.freeze({universe,id,name:L(fr,en),brief:L(briefFr,briefEn)});
export const SIGNATURE_DESIGNS = Object.freeze([
 dlcAlien.createSignatureDesigns({ p }),
 dlcAliens.createSignatureDesigns({ p }),
 dlcHalo.createSignatureDesigns({ p }),
 dlcHalo.createSignatureDesigns2({ p }),
 dlcHalfLife.createSignatureDesigns({ p }),
 dlcPortal.createSignatureDesigns({ p }),
 dlcPortal.createSignatureDesigns2({ p }),
 dlcPredator.createSignatureDesigns({ p }),
 dlcResidentEvil.createSignatureDesigns({ p }),
 dlcResidentEvil.createSignatureDesigns2({ p }),
 dlcResidentEvil.createSignatureDesigns3({ p }),
 dlcMetalGear.createSignatureDesigns({ p }),
 dlcMetalGear.createSignatureDesigns2({ p }),
 dlcDeadSpace.createSignatureDesigns({ p }),
 dlcDoom.createSignatureDesigns({ p }),
 dlcStarWars.createSignatureDesigns({ p }),
 dlcStarWars.createSignatureDesigns2({ p }),
 dlcStarWars.createSignatureDesigns3({ p }),
 dlcNieR.createSignatureDesigns({ p }),
 dlcNieR.createSignatureDesigns2({ p }),
 dlcNieR.createSignatureDesigns3({ p }),
 dlcFinalFantasyVII.createSignatureDesigns({ p }),
 dlcFinalFantasyVII.createSignatureDesigns2({ p }),
 dlcTombRaider.createSignatureDesigns({ p })
]);
