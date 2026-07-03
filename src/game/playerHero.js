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
    simple: {
      name: 'Frappe d Ancrage',
      type: 'melee',
      dmg: 1.0
    },
    secondary: {
      name: 'Impulsion Nexus',
      type: 'beam',
      cd: 7,
      dmg: 2.1
    },
    defense: {
      name: 'Stase du Voile',
      type: 'shield',
      dur: 2.2,
      reduce: 0.55
    },
    special: {
      name: 'Commandement d Ancrage',
      desc: 'Stabilise les signatures alliees, renforce les reliques equipees et resiste aux suppressions du Sans-Auteur.',
      type: 'nexus_aoe',
      dmg: 4.4,
      cooldown: 9
    },
    isPlayer: true
  };
};
