export const PLAYER_HERO_ID = 'player_anchor';

export const normalizePlayerName = (name) => {
  const cleaned = String(name || '').trim();
  return cleaned || 'Ancre';
};

export const createPlayerHero = (profile = {}) => {
  const name = normalizePlayerName(profile.name);
  return {
    id: PLAYER_HERO_ID,
    name,
    universe: 'Nexus de Convergence',
    category: 'tactical',
    primaryColor: '#39c5bb',
    secondaryColor: '#ffeb3b',
    weaponType: 'Signature d Ancre',
    stats: { hp: 175, atk: 20, def: 17, spd: 8 },
    special: {
      name: 'Commandement d Ancrage',
      desc: 'Stabilise les signatures alliees, renforce les reliques equipees et resiste aux suppressions du Sans-Auteur.',
      cooldown: 9
    },
    isPlayer: true
  };
};
