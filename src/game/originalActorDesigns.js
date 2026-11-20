import { getNexusActorDesign } from './nexusActorDesigns.js';
import { getOriginalMachineActorDesign } from './originalMachineActorDesigns.js';
import { getOriginalTideActorDesign } from './originalTideActorDesigns.js';
import { getOriginalCampaignActorDesign } from './originalCampaignActorDesigns.js';

export function getOriginalActorDesign(actor) {
  return getNexusActorDesign(actor) || getOriginalMachineActorDesign(actor) || getOriginalTideActorDesign(actor)
    || getOriginalCampaignActorDesign(actor);
}

export function resolveOriginalRpgSpecial(actor, supplied) {
  // A localized design description is not an action. Only replace the exact
  // reviewed prose and retain already-supplied custom or encounter actions.
  if (!supplied || typeof supplied !== 'object' || Object.keys(supplied).length !== 2) return null;
  const move = getOriginalActorDesign(actor)?.rpgMove;
  if (!move || supplied.fr !== move.description || supplied.en !== move.description) return null;
  const result = { ...supplied, name: move.name };
  if (move.targeting) {
    result.type = move.type || move.targeting.delivery;
    result.targeting = { ...move.targeting };
  }
  if (Number.isFinite(move.dmg)) result.dmg = move.dmg;
  return result;
}
