// Absolver: Downfall — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'absolver_downfall', universe: 'Absolver: Downfall', aliases: ['Absolver Downfall', 'Absolver'],
    continuity: 'Sloclap’s Absolver base journey and free Downfall expansion in the Mines of Adal.',
    adaptationRule: 'Masked Prospects use learnable martial styles; Downfall enemies are Arcell-corrupted combatants, not ordinary inhabitants.',
    visualAnchor: 'Muted stone ruins, ochre cloth, smooth masks, martial stances and pale Gleam crystals in Adal.',
    referenceUrl: 'https://absolvergame.com/news/absolver-downfall', referenceUrls: ['https://absolvergame.com/news/absolver-downfall'],
    heroes: [hero('windfall', 'Windfall Prospect', 'Masked martial artist in layered ochre cloth and light leather, hands raised to evade.', 'Windfall Strikes', 'Avoid Counter', { role: 'slayer' }), hero('khalt', 'Kahlt Prospect', 'Broad masked fighter in dark layered cloth with grounded absorbing stance.', 'Kahlt Blows', 'Absorb Counter', { role: 'marine' }), hero('forsaken', 'Forsaken Prospect', 'Masked fighter in blue-gray wraps with precise defensive posture.', 'Forsaken Combo', 'Parry Counter', { role: 'tactical' })],
    enemies: [threat('corrupted_prospect', 'Arcell-Corrupted Prospect', 'Masked fighter with pale Gleam veins across otherwise practical robes.', 'Corrupted Combo', 'Gleam Burst'), threat('fold_guardian', 'Fold Guardian', 'Heavy masked temple defender in layered stone-colored armor.', 'Guard Break', 'Temple Stance'), threat('gleam_echo', 'Gleam Echo', 'Abstract humanoid martial afterimage made of white-blue crystal light.', 'Echo Strike', 'Mirrored Sequence')],
    bosses: [threat('kuretz', 'Kuretz', 'Masked arena champion with muscular bare arms, heavy belt and disciplined combat pose.', 'Boxing Combination', 'Arena Pressure'), threat('cargal_kilnor', 'Cargal & Kilnor', 'Two masked martial masters, one tall and one broad, in contrasting layered robes.', 'Twin Combination', 'Alternating Stances'), threat('dormek', 'Dormek', 'Towering masked Downfall guardian in heavy pale armor with powerful kicking stance.', 'Heavy Kick', 'Gleam Shockwave')],
    worldBoss: threat('arcell', 'Arcell', 'Tall Etheran figure framed by white Gleam crystals and the broken Fold containment.', 'Etheran Strikes', 'Fold Rupture'),
    gear: [gear('prospect_mask', 'Prospect Mask', 'Smooth ivory martial mask with narrow eye slits.', { atk: 0, def: 4, spd: 2 }), gear('gleam_shard', 'Gleam Shard', 'Angular white-blue crystal emitting pale mist.', { atk: 3, def: 2, spd: 1 }), gear('combat_deck', 'Combat Deck', 'Stack of abstract stance cards without readable writing.', { atk: 2, def: 2, spd: 3 })],
    stages: [stage('Guidance Bridge', 'Weathered stone bridge linking Adal ruins under warm haze.'), stage('Mines of Adal', 'Dark mine passages lit by pale Gleam growths and masked patrols.'), stage('Fold Temple', 'Circular stone sanctuary broken by an Etheran crystal rupture.')],
    event: event('downfall_run', 'Downfall Gleam Run', 'A procedural path branches through mines and temples toward three escalating encounters.')
  });
}
