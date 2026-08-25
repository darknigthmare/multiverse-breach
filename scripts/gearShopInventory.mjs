// Shared inventory for the seven Gear Shop prototypes authored directly in
// HubScreen. Keeping the audit and production-batch builder on this registry
// prevents their definitions from drifting apart.
export const STATIC_GEAR_SHOP_ITEMS = Object.freeze([
  Object.freeze({ id: 'millennium_puzzle', universe: 'Yu-Gi-Oh', name: Object.freeze({ en: 'Millennium Puzzle', fr: 'Puzzle du Millenium' }) }),
  Object.freeze({ id: 'bandana_infinite', universe: 'Metal Gear', name: Object.freeze({ en: 'Infinite Bandana', fr: 'Bandana Infini' }) }),
  Object.freeze({ id: 'crucible_guard', universe: 'Doom', name: Object.freeze({ en: 'Crucible Hilt', fr: 'Creuset de Chasse' }) }),
  Object.freeze({ id: 'udamage_power', universe: 'Unreal', name: Object.freeze({ en: 'U-Damage Amplifier', fr: 'Double Degats U-Damage' }) }),
  Object.freeze({ id: 'evt_fo_nuke', universe: 'Fallout', name: Object.freeze({ en: 'Fat Man Nuke Launcher', fr: 'Fat Man Lance-Nuke' }) }),
  Object.freeze({ id: 'evt_doom_quad', universe: 'Doom', name: Object.freeze({ en: 'Quad Damage Powerup', fr: 'Multiplicateur Quad Damage' }) }),
  Object.freeze({
    id: 'evt_ut_redeemer',
    universe: 'Unreal',
    name: Object.freeze({ en: 'Redeemer Missile Targeter', fr: 'Viseur de Missile Redempteur' }),
    audit: 'legacy-project-art',
    provenance: 'Pre-existing project asset; no OpenAI generation record is available.'
  })
]);
