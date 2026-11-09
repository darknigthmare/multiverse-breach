// Explicit movie/game identities. These are gameplay adaptations, not 1:1 art.
export const SIGNATURE_WAVE4_REFERENCES = Object.freeze({
  'p2-disc': 'https://store.necaonline.com/products/predator-2-city-hunter-predator-with-led-lights-quarter-scale-action-figure',
  'pred-berserker': 'https://www.sideshow.com/collectibles/predator-berserker-predator-prime-1-studio-912621',
  'pred-falconer': 'https://necaonline.com/2012/11/closer-look-predators-series-7-camo-cloaked-falconer-predator/',
  'pred-fugitive': 'https://necaonline.com/2018/06/predator-2018-7-scale-action-figure-ultimate-predator/',
  'pred-assassin': 'https://necaonline.com/2021/03/predator-2018-7-scale-action-figure-deluxe-ultimate-assassin-predator-unarmored/',
  'pred-feral': 'https://www.sideshow.com/collectibles/predator-feral-predator-prime-1-studio-914062',
  'halo-arbiter': 'https://www.halowaypoint.com/news/canon-fodder-coming-of-age',
  'halo-linda': 'https://www.halowaypoint.com/en-us/news/inside-infinite-january-2021',
  'halo-weapons': 'https://support.halowaypoint.com/hc/en-us/articles/50948184078228-Weapons-Vehicles-in-Halo-Campaign-Evolved'
});
const hero = (universe, actorId, legacyName, name, style, range, source, extra = {}) => ({
  key: actorId, universe, actorId, legacyName, name, style, range, source, wave: 4, ...extra
});
const enemy = (universe, enemyName, legacyName, name, style, range, source, extra = {}) => ({
  key: `${universe}::${enemyName}`, universe, enemyName, legacyName, name, style, range, source, wave: 4, ...extra
});
const disc = {
  projectile: 'returning-disc', hits: 1, shape: 'single', delivery: 'ranged',
  note: 'Predator 2 throwing-disc equipment. Smash has a swept outbound flight and a harmless return to its owner; one confirmed target, no target substitution or repeated damage. Flight speed, range, hit radius and auto-return are Nexus rules, not a movie trajectory or Hunting Grounds remote-control recreation. RPG retains an abstract single contact.'
};
const blade = { hits: 2, note: 'Personal wrist-blade combination using the depicted weapon. No decapitation, summon, healing, automatic cloak or transformation. Two contacts are a shared Nexus damage budget, not a source combo certification.' };
const halo = 'Weapon-family adaptation for the existing Halo roster. No Campaign Evolved-exclusive traits, automatic shield stripping, headshot instant kill, recharge battery or source-specific ammunition rules are granted.';
export const SIGNATURE_WAVE4_ROWS = Object.freeze([
  hero('Predator', 'city_hunter', 'Los Angeles Trophy Hunt', 'City Hunter — Smart Disc', 'barrage', 360, 'p2-disc', disc),
  hero('Predator 2', 'city_hunter_p2', 'City Hunter Origin Burst', 'City Hunter — Smart Disc', 'barrage', 360, 'p2-disc', disc),
  enemy('Predator', 'City Hunter Predator', 'Smart Disc Throw', 'City Hunter — Smart Disc', 'barrage', 360, 'p2-disc', disc),
  hero('Predators', 'berserker_predator', 'Berserker Predator Origin Burst', 'Berserker — Wrist Blade Assault', 'slash', 95, 'pred-berserker', blade),
  enemy('Predator', 'Berserker Predator', 'Berserk Rage Slash', 'Berserker — Wrist Blade Assault', 'slash', 95, 'pred-berserker', blade),
  enemy('Predators', 'Berserker Predator / Mr. Black', 'Decapitation tell', 'Berserker — Wrist Blade Assault', 'slash', 95, 'pred-berserker', blade),
  enemy('Predators', 'Falconer Predator', 'Falconer Predator Breach Pattern', 'Falconer — Wrist Blade Duel', 'slash', 92, 'pred-falconer', blade),
  hero('The Predator', 'fugitive_predator', 'Fugitive Predator Origin Burst', 'Fugitive — Wrist Blade Combination', 'slash', 92, 'pred-fugitive', blade),
  enemy('The Predator', 'Fugitive Predator', 'Fugitive Predator Breach Pattern', 'Fugitive — Wrist Blade Combination', 'slash', 92, 'pred-fugitive', blade),
  enemy('The Predator', 'Assassin Predator / Upgrade Predator', 'Extraction denial', 'Assassin — Wrist Cannon', 'barrage', 340, 'pred-assassin', { note: 'Wrist-mounted cannon from the licensed film representation; no regeneration, armored-phase switch or whole-map attack.' }),
  enemy('Predator', 'Feral Predator', 'Bone Mask Shield Slam', 'Feral — Wrist Shield Strike', 'slash', 88, 'pred-feral', { note: 'Deployed wrist shield used at contact range. No plasma caster, force field, automatic reflection or ranged damage is added.' }),
  hero('Halo', 'arbiter', 'Great Schism Strike', 'Arbiter — Energy Sword Strike', 'slash', 94, 'halo-arbiter', { color: '#8fcaff', note: 'Halo 2 Great Schism energy-sword family, not the orange Prophets Bane or Killer Instinct guest moveset. No free cloak or lunge teleport.' }),
  hero('Halo', 'linda_058', 'Linda-058 Origin Burst', 'Linda-058 — Nornfang Precision Shot', 'beam', 430, 'halo-linda', { note: 'Linda personal sniper weapon. One effective shot; no Warzone damage boost, explosive area damage, guaranteed headshot or instant kill.' }),
  enemy('Halo', 'Covenant Grunt', null, 'Grunt — Plasma Pistol Burst', 'barrage', 260, 'halo-weapons', { hits: 3, color: '#95ed65', note: halo }),
  enemy('Halo', 'Elite Minor', null, 'Elite — Plasma Rifle Burst', 'barrage', 320, 'halo-weapons', { hits: 4, color: '#88d2ff', note: halo }),
  enemy('Halo', 'Jackal Sniper', null, 'Jackal — Beam Rifle Shot', 'beam', 410, 'halo-weapons', { color: '#c8a6ff', note: halo })
]);
