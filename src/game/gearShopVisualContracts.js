import {
  GEAR_SHOP_VISUAL_CONTRACTS_FIRST40
} from './gearShopVisualContractsFirst40.js';
import {
  GEAR_SHOP_VISUAL_CONTRACTS_REMAINING47
} from './gearShopVisualContractsRemaining47.js';

export const GEAR_SHOP_VISUAL_CONTRACTS = Object.freeze({
  ...GEAR_SHOP_VISUAL_CONTRACTS_FIRST40,
  ...GEAR_SHOP_VISUAL_CONTRACTS_REMAINING47
});

const slugifyAsset = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const buildIconPrompt = ({ referenceUrl, visualAnchor }) => [
  'Use case: production-ready transparent Gear Shop icon for a 2D multiverse game.',
  `Canonical reference to inspect before rendering: ${referenceUrl}`,
  `Primary request: ${visualAnchor}`,
  'Fidelity: preserve the referenced silhouette, proportions, palette, materials and franchise-specific details; do not substitute a generic or invented object.',
  'Style: original fan-made high-detail 32-bit pixel art, crisp deliberate clusters, readable at small UI size.',
  'Composition: exactly the isolated subject or single assembly specified by the visual anchor, centered with generous padding; show a complete physical item only when the cited reference actually exposes it, and never complete hidden geometry by invention.',
  'Background: perfectly flat solid #00ff00 chroma key, no floor, no cast shadow, no border.',
  'Constraints: no duplicate item, caption, readable text, logo or watermark unless the visual anchor explicitly requires one canonical symbol or numeral.'
].join('\n');

export const getGearShopVisualMetadata = ({
  id,
  universe,
  metadata = {}
}) => {
  const contract = GEAR_SHOP_VISUAL_CONTRACTS[id];
  if (!contract) return metadata;

  return {
    ...metadata,
    icon: metadata.icon || `/sprites/generated/items/${slugifyAsset(universe)}/${slugifyAsset(id)}.png`,
    iconPrompt: buildIconPrompt(contract),
    referenceUrl: contract.referenceUrl,
    visualAnchor: contract.visualAnchor,
    audit: metadata.audit || 'canon-reference'
  };
};
