// Real roster partners, not replacement supernatural entities. Each native
// atlas has arrival, preparation, attack and recovery; all effects are cosmetic.
export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE8 = [
  { id: 'teen-titans-cyborg-native', universe: 'Teen Titans', entityName: 'Cyborg', actionName: 'Sonic Cannon de Cyborg',
    sourceReference: 'Teen Titans (2003 animated series): Cyborg plants his feet, levels his integrated forearm Sonic Cannon, fires and lowers it. No unrelated hero or live-action armor.',
    path: 'roster-cannon', arrival: 0.34, travelTicks: 20, holdTicks: 31, scale: 1, maxSize: 132, offsetX: 98,
    preparation: 'roster-sonic-align', attack: 'roster-sonic-beam', recovery: 'roster-cannon-lower', muzzle: [0.35, -0.45] },
  { id: 'yakuza-kiryu-native', universe: 'Yakuza', entityName: 'Kazuma Kiryu', actionName: 'Coup du Dragon de Dojima',
    sourceReference: 'Yakuza Kiwami (2016): Kiryu in his gray suit and burgundy shirt advances in unarmed Dragon of Dojima guard, performs a physical combo and returns. No literal dragon or weapon.',
    path: 'roster-ground-rush', arrival: 0.32, travelTicks: 25, holdTicks: 29, scale: 1, maxSize: 132, offsetX: 78,
    preparation: 'roster-fist-ready', attack: 'roster-physical-contact', recovery: 'roster-ground-return', muzzle: [0.25, -0.45] },
  { id: 'mgr-raiden-native', universe: 'Metal Gear Rising', entityName: 'Raiden', actionName: 'Mode lame — Zandatsu',
    sourceReference: 'Metal Gear Rising: Revengeance (2013), upgraded Raiden: his own silver high-frequency blade and black/silver cyborg body perform non-graphic precision cuts. No Murasama substitution, extraction, time-stop, healing or extra impact.',
    path: 'roster-blade-rush', arrival: 0.3, travelTicks: 23, holdTicks: 30, scale: 1, maxSize: 132, offsetX: 75,
    preparation: 'roster-hf-ready', attack: 'roster-blade-contact', recovery: 'roster-ground-return', muzzle: [0.28, -0.45] },
  { id: 'dungeon-meshi-laios-native', universe: 'Dungeon Meshi', entityName: 'Laios Touden', actionName: 'Coupe de Kensuke',
    sourceReference: 'Dungeon Meshi (2024 animated series), human exploration party: armored blond Laios uses Kensuke for a physical sword cut and returns. No ranged food gag or magical beam.',
    path: 'roster-sword-advance', arrival: 0.35, travelTicks: 27, holdTicks: 27, scale: 1, maxSize: 132, offsetX: 80,
    preparation: 'roster-kensuke-ready', attack: 'roster-blade-contact', recovery: 'roster-ground-return', muzzle: [0.3, -0.46] }
].map(entry => Object.freeze({ ...entry, fidelity: 'authored-native-roster-motion-adaptation', muzzle: Object.freeze(entry.muzzle) }));

// A render-only anchor correction. The sampled simulation choreography and all
// historical entries remain unchanged; packed native pixels determine muzzle.
export function projectNativeSummonEffectOrigin(choreography, asset, frame) {
  const anchor = asset?.effectAnchors?.[frame?.phase]?.[frame?.col];
  if (!choreography || !asset?.effectAnchors || !frame) return choreography;
  if (!anchor || !Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)) return { ...choreography,
    visuals: choreography.visuals.filter(visual => !visual.kind.startsWith('roster-sonic-')) };
  const { performer } = choreography;
  const dx = (anchor.x - asset.frameWidth / 2) / asset.frameHeight * performer.size * performer.facing;
  const dy = (anchor.y - (asset.normalization?.baseline || 244)) / asset.frameHeight * performer.size;
  const angle = performer.rotation || 0;
  return { ...choreography, origin: {
    x: performer.x + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: performer.y + dx * Math.sin(angle) + dy * Math.cos(angle)
  } };
}
