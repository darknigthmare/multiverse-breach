// Current game sheets compared against the source scopes in the historical P0 review.
// These records explain the runtime fallback while the original bytes remain archived.
export const HISTORICAL_DC_P0_SPRITE_QUARANTINES = Object.freeze([
  Object.freeze({
    actorId: 'batman_n52',
    universe: 'Joker New 52',
    incarnation: 'Batman: Endgame (The New 52, Batman #35-40, 2014-2015) - Bruce Wayne',
    asset: '/sprites/generated/heroes/joker-new-52/batman-n52.png',
    sha256: '22bbec0e8a7a286ccfa413bbaa357973df05154a5354df4791aa03177c61d0d1',
    reason: 'WRONG_GOGGLED_CIVILIAN_NO_BATSUIT'
  }),
  Object.freeze({
    actorId: 'harley_n52',
    universe: 'Joker New 52',
    incarnation: 'Suicide Squad (The New 52, volume 4 #1, 2011) - Harley Quinn',
    asset: '/sprites/generated/heroes/joker-new-52/harley-n52.png',
    sha256: 'ce8fa44d90a8476b902d0b8743c45459e3f77022fd54d465a3d6069e47a86b87',
    reason: 'WRONG_TECH_ARMOUR_AND_BLOND_PONYTAIL'
  }),
  Object.freeze({
    actorId: 'joker_n52',
    universe: 'Joker New 52',
    incarnation: 'Batman: Endgame (The New 52, Batman #35-40, 2014-2015) - the Joker',
    asset: '/sprites/generated/heroes/joker-new-52/joker-n52.png',
    sha256: '257d80c9ec0b67bfec6af226adac703a4288ccc8268f38720451308b8c9952e0',
    reason: 'WRONG_CARD_MAGE_NO_RESTORED_ENDGAME_FACE'
  }),
  Object.freeze({
    actorId: 'grim_knight',
    universe: 'The Batman Who Laughs',
    incarnation: 'The Batman Who Laughs: The Grim Knight #1 (2019) - armed Dark Multiverse Bruce Wayne',
    asset: '/sprites/generated/heroes/the-batman-who-laughs/grim-knight.png',
    sha256: '9eac899dcacd731592c4d90d967c257f56ada3b7f05214433c43a5e889875285',
    reason: 'WRONG_HOODED_LANTERN_BEARER_NO_BAT_COWL_OR_FIREARMS'
  }),
  Object.freeze({
    actorId: 'raven_tt',
    universe: 'Teen Titans',
    incarnation: 'Teen Titans (2003-2006 animated series) - original Jump City team',
    asset: '/sprites/generated/heroes/teen-titans/raven-tt.png',
    sha256: 'f7e41b655e3e6a3110aef1231c2917400729eb27b381d25ca8eb3323e8c7ffce',
    reason: 'WRONG_ARMOURED_ROBES_AND_LANTERN_FOR_2003_COSTUME'
  }),
  Object.freeze({
    actorId: 'starfire_tt',
    universe: 'Teen Titans',
    incarnation: 'Teen Titans (2003-2006 animated series) - original Jump City team',
    asset: '/sprites/generated/heroes/teen-titans/starfire-tt.png',
    sha256: '1f90eff8352ce94ccf4d569728e9bfbe357f96a07e8c94c8bc4f68363361115d',
    reason: 'WRONG_ORNATE_COAT_AND_LEG_ARMOUR_FOR_2003_COSTUME'
  })
]);

// The W16 reinforcement depicts the 2003 design and has a neutral recovery cell.
// Only the crop of that cell is reused. The movement and hit sheets stay pending.
const STARFIRE_REVIEWED_BUST = Object.freeze({
  sheet: '/sprites/generated/summon-animations-wave16/starfire.png',
  sha256: '372875c8973133979dc0cf22b6f289330b80ee0e9b8ff3bcfec2b96f47176780',
  width: 2048,
  height: 1024,
  crop: Object.freeze({ x: 1226, y: 782, width: 76, height: 80 })
});

export function getReviewedDcP0Bust(actor, quarantine) {
  const sourceId = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  if (quarantine?.actorId !== 'starfire_tt' || sourceId !== 'starfire_tt'
    || [actor?.sourceHeroId, actor?.sourceId].some(id => id !== undefined && id !== '' && id !== 'starfire_tt')) return null;
  return STARFIRE_REVIEWED_BUST;
}
