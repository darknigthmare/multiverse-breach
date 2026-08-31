import { HEROES_DB } from './heroes.js';
import { getHeroSpriteSheetSrc, getSpriteSheetLayout } from './spriteAssets.js';

const localized = (value, fallback) => {
  if (typeof value === 'string' && value.trim()) return { fr: value.trim(), en: value.trim() };
  if (value && typeof value === 'object') return {
    fr: value.fr || value.en || fallback.fr,
    en: value.en || value.fr || fallback.en
  };
  return { ...fallback };
};

// These are original mission roles, never newly invented official characters.
// Until a mission supplies an exact identity, existing art is visibly marked
// as a provisional representation rather than relabelled as a canonical NPC.
const ROLE_PROFILES = [
  { match: /half-life|black mesa/i, role: { fr: 'Scientifique a evacuer', en: 'Scientist to evacuate' }, preferred: /kleiner|eli.vance|gordon/i },
  { match: /portal|aperture/i, role: { fr: 'Sujet de test a evacuer', en: 'Test subject to evacuate' }, preferred: /chell/i },
  { match: /stargate/i, role: { fr: 'Specialiste scientifique a evacuer', en: 'Scientific specialist to evacuate' }, preferred: /daniel.jackson|samantha.carter|carter/i },
  { match: /^halo$/i, role: { fr: 'Personnel civil a evacuer', en: 'Civilian personnel to evacuate' }, preferred: /halsey|lasky|johnson/i },
  { match: /star wars/i, role: { fr: 'Civil galactique a evacuer', en: 'Galactic civilian to evacuate' }, preferred: /leia|padme|luke/i },
  { match: /resident evil|silent hill|left.?4.?dead|walking dead|evil dead|dead space|the last of us|fallout/i, role: { fr: 'Survivant a evacuer', en: 'Survivor to evacuate' }, preferred: /claire|rebecca|jill|alyx|ellie/i },
  { match: /harry potter|discworld|elder scrolls|final fantasy|zelda|baldur/i, role: { fr: 'Voyageur a proteger', en: 'Traveller to protect' }, preferred: /hermione|aerith|yuna|zelda/i },
  { match: /nexus de convergence/i, role: { fr: 'Temoin de faille a evacuer', en: 'Breach witness to evacuate' }, preferred: /arca_mirelle/i }
];

export const resolveTacticsEscort = (stage = {}, roster = HEROES_DB) => {
  const authored = stage.escort && typeof stage.escort === 'object' ? stage.escort : {};
  const universe = authored.universe || stage.universe || 'Nexus de Convergence';
  const profile = ROLE_PROFILES.find(entry => entry.match.test(universe));
  const role = localized(authored.role, profile?.role || { fr: 'Personne a evacuer', en: 'Person to evacuate' });
  const explicitHero = roster.find(hero => hero.id === authored.heroId);
  const universeRoster = roster.filter(hero => hero.universe === universe);
  const spriteHero = explicitHero
    || universeRoster.find(hero => profile?.preferred.test(`${hero.id} ${hero.name}`))
    || universeRoster[0]
    || roster.find(hero => hero.id === 'arca_mirelle')
    || HEROES_DB.find(hero => hero.id === 'arca_mirelle');
  const name = localized(authored.name, explicitHero ? { fr: explicitHero.name, en: explicitHero.name } : role);
  const provisional = !explicitHero || name.fr !== explicitHero.name || name.en !== explicitHero.name;
  const representation = provisional
    ? {
        fr: `Representation provisoire : sprite de ${spriteHero.name} (${spriteHero.universe}).`,
        en: `Provisional representation: ${spriteHero.name} sprite (${spriteHero.universe}).`
      }
    : { fr: `Personnage designe par la mission : ${spriteHero.name}.`, en: `Mission-designated character: ${spriteHero.name}.` };
  return {
    id: authored.id || `escort:${stage.id || universe}`,
    universe,
    name,
    role,
    provisional,
    identitySource: explicitHero ? 'mission' : authored.name ? 'mission-role' : 'universe-role',
    sourceHeroId: spriteHero.id,
    sourceHeroName: spriteHero.name,
    sourceUniverse: spriteHero.universe,
    spritePath: getHeroSpriteSheetSrc(spriteHero, 'tactics'),
    representation,
    spriteHero
  };
};

export const getTacticsEscortBriefing = (stage = {}, lang = 'fr') => {
  const identity = resolveTacticsEscort(stage);
  const locale = lang === 'en' ? 'en' : 'fr';
  return `${identity.name[locale]} | ${identity.universe} | ${identity.role[locale]}. ${identity.representation[locale]}`;
};

export const getTacticsEscortPose = escort => {
  if (!escort?.extracted) return escort?.state || 'idle';
  const layout = getSpriteSheetLayout(getHeroSpriteSheetSrc(escort, 'tactics'));
  if (Number.isInteger(layout?.rowByState?.extract)) return 'extract';
  if (Number.isInteger(layout?.rowByState?.victory)) return 'victory';
  return 'idle';
};
