const DAY_MS = 24 * 60 * 60 * 1000;

const freezeLocalized = value => Object.freeze(value);

const makeRewardItem = ({ id, universe, name, desc, boost }) => Object.freeze({
  id,
  universe,
  name: freezeLocalized(name),
  desc: freezeLocalized(desc),
  boost: Object.freeze(boost),
  seasonalReward: true,
  rewardOnly: true
});

export const SPECIAL_EVENT_REWARD_ITEMS = Object.freeze([
  makeRewardItem({
    id: 'season_thousand_portals_fractured_veil',
    universe: 'Nexus de Convergence',
    name: { fr: 'Apparence Voile Fissure', en: 'Fractured Veil Appearance' },
    desc: {
      fr: 'Un manteau de signature tisse dans les routes de secours des Mille Portails. Son voile stabilise le porteur contre les reecritures brutales.',
      en: 'A signature mantle woven through the Thousand Portals emergency routes. Its veil stabilizes the wearer against violent rewrites.'
    },
    boost: { hp: 60, def: 5 }
  }),
  makeRewardItem({
    id: 'season_zone_404_firewall_relic',
    universe: 'The Matrix',
    name: { fr: 'Relique Pare-feu Zone 404', en: 'Zone 404 Firewall Relic' },
    desc: {
      fr: 'Une permission A.R.C.A. isole les injections hostiles et accelere les reactions du porteur dans les Trames cyber.',
      en: 'An A.R.C.A. permission isolates hostile injections and accelerates the wearer inside cyber Threads.'
    },
    boost: { def: 5, spd: 4 }
  }),
  makeRewardItem({
    id: 'season_yautja_hunter_mark',
    universe: 'Predator',
    name: { fr: 'Marque du Traqueur', en: 'Hunter Mark' },
    desc: {
      fr: 'Une marque gagnee selon le code du duel Yautja. Elle renforce la precision offensive et la poursuite sans cautionner la chasse aux civils.',
      en: 'A mark earned under the Yautja duel code. It sharpens offense and pursuit without endorsing the hunt of civilians.'
    },
    boost: { atk: 12, spd: 2 }
  })
]);

const SPECIAL_EVENT_REWARD_BY_ID = new Map(
  SPECIAL_EVENT_REWARD_ITEMS.map(item => [item.id, item])
);

export const getSpecialEventRewardById = rewardItemId => (
  SPECIAL_EVENT_REWARD_BY_ID.get(String(rewardItemId || '').trim()) || null
);

const makeEvent = ({ id, title, reward, schedule, stage }) => Object.freeze({
  id,
  title: freezeLocalized(title),
  reward: freezeLocalized(reward),
  schedule: Object.freeze({
    start: Object.freeze(schedule.start),
    end: Object.freeze(schedule.end)
  }),
  stage: Object.freeze({
    ...stage,
    displayName: freezeLocalized(stage.displayName),
    intro: freezeLocalized(stage.intro),
    outro: freezeLocalized(stage.outro),
    rewardItemName: freezeLocalized(stage.rewardItemName),
    sourceUniverses: Object.freeze(stage.sourceUniverses || [stage.universe])
  })
});

export const SPECIAL_EVENTS = Object.freeze([
  makeEvent({
    id: 'thousand_portals',
    title: { fr: 'Nuit des Mille Portails', en: 'Night of a Thousand Portals' },
    reward: { fr: 'Jetons evenement + apparence Voile Fissure', en: 'Event tokens + Fractured Veil appearance' },
    schedule: { start: { month: 10, day: 24 }, end: { month: 11, day: 7 } },
    stage: {
      stageId: 42001,
      displayName: { fr: 'Operation - Mille Issues', en: 'Operation - Thousand Exits' },
      universe: 'Nexus de Convergence',
      sourceUniverses: ['Nexus de Convergence'],
      mode: 'RPG',
      difficulty: 'Evenement',
      bossName: 'Cartographe des Mille Issues',
      goldPrize: 520,
      shardPrize: 125,
      tokenPrize: 12,
      rewardItemId: 'season_thousand_portals_fractured_veil',
      rewardItemName: getSpecialEventRewardById('season_thousand_portals_fractured_veil').name,
      intro: { fr: 'Mille sorties s ouvrent au-dessus de la Cite-Mosaique. A.R.C.A. doit identifier la seule porte qui ramene chaque signature dans sa propre Trame.', en: 'A thousand exits open above Mosaic City. A.R.C.A. must identify the one door returning each signature to its own Thread.' },
      outro: { fr: 'Les portes parasites sont classees et la Cite-Mosaique conserve une route de secours annuelle.', en: 'The parasite doors are indexed and Mosaic City retains an annual emergency route.' }
    }
  }),
  makeEvent({
    id: 'zone_404_week',
    title: { fr: 'Semaine Zone 404', en: 'Zone 404 Week' },
    reward: { fr: 'Relique Pare-feu et bonus vitesse cyber', en: 'Firewall relic and cyber speed bonus' },
    schedule: { start: { month: 3, day: 30 }, end: { month: 4, day: 6 } },
    stage: {
      stageId: 42002,
      displayName: { fr: 'Operation - Pare-feu narratif', en: 'Operation - Narrative Firewall' },
      universe: 'The Matrix',
      sourceUniverses: ['The Matrix', 'Ghost in the Shell', 'Portal'],
      mode: 'Tactics',
      difficulty: 'Evenement',
      bossName: 'Noyau d Intrusion Zone 404',
      goldPrize: 465,
      shardPrize: 145,
      tokenPrize: 10,
      rewardItemId: 'season_zone_404_firewall_relic',
      rewardItemName: getSpecialEventRewardById('season_zone_404_firewall_relic').name,
      intro: { fr: 'Une permission volee ouvre les archives cyber du Nexus. La cellule doit isoler les droits administrateur avant qu ils ne reecrivent les souvenirs.', en: 'A stolen permission opens the Nexus cyber archives. The cell must isolate administrator rights before they rewrite memories.' },
      outro: { fr: 'Le pare-feu conserve les copies sans leur retirer le droit de choisir leur sortie.', en: 'The firewall preserves copies without removing their right to choose an exit.' }
    }
  }),
  makeEvent({
    id: 'yautja_hunt',
    title: { fr: 'Chasse Yautja', en: 'Yautja Hunt' },
    reward: { fr: 'Trophees, plasma et apparence traqueur', en: 'Trophies, plasma, and hunter appearance' },
    schedule: { start: { month: 8, day: 15 }, end: { month: 8, day: 31 } },
    stage: {
      stageId: 42003,
      displayName: { fr: 'Operation - Epreuve du Traqueur', en: 'Operation - Hunter Trial' },
      universe: 'Predator',
      sourceUniverses: ['Predator', 'Alien'],
      mode: 'Smash',
      difficulty: 'Evenement',
      bossName: 'Maitre de Chasse Yautja de Rupture',
      goldPrize: 500,
      shardPrize: 120,
      tokenPrize: 14,
      rewardItemId: 'season_yautja_hunter_mark',
      rewardItemName: getSpecialEventRewardById('season_yautja_hunter_mark').name,
      intro: { fr: 'Une reserve de chasse traverse le Voile. L Ancre doit respecter le code du duel, liberer les proies non combattantes et vaincre le Maitre de Chasse.', en: 'A hunting preserve crosses the Veil. The Anchor must respect the duel code, free non-combatant prey, and defeat the Hunt Master.' },
      outro: { fr: 'La chasse reste un duel consenti et les civils quittent la reserve avant sa fermeture.', en: 'The hunt remains a consensual duel and civilians leave the preserve before it closes.' }
    }
  })
]);

const buildUtcDate = (year, point) => new Date(Date.UTC(year, point.month - 1, point.day));

export const getSpecialEventWindow = (event, year) => {
  if (!event?.schedule || !Number.isInteger(year)) return null;
  const start = buildUtcDate(year, event.schedule.start);
  let endExclusive = new Date(buildUtcDate(year, event.schedule.end).getTime() + DAY_MS);
  if (endExclusive <= start) {
    endExclusive = new Date(buildUtcDate(year + 1, event.schedule.end).getTime() + DAY_MS);
  }
  return Object.freeze({
    eventId: event.id,
    seasonYear: start.getUTCFullYear(),
    seasonKey: `${event.id}:${start.getUTCFullYear()}`,
    start,
    endExclusive
  });
};

export const getSpecialEventWindowForDate = (event, date = new Date()) => {
  const instant = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(instant.getTime())) return null;
  const year = instant.getUTCFullYear();
  const candidates = [getSpecialEventWindow(event, year - 1), getSpecialEventWindow(event, year)];
  return candidates.find(window => instant >= window.start && instant < window.endExclusive)
    || getSpecialEventWindow(event, year);
};

export const isSpecialEventActive = (event, date = new Date()) => {
  const instant = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(instant.getTime())) return false;
  const year = instant.getUTCFullYear();
  return [getSpecialEventWindow(event, year - 1), getSpecialEventWindow(event, year)]
    .some(window => instant >= window.start && instant < window.endExclusive);
};

export const getActiveSpecialEvents = (date = new Date()) => SPECIAL_EVENTS
  .filter(event => isSpecialEventActive(event, date));

export const formatSpecialEventWindow = (event, lang = 'fr', year = new Date().getUTCFullYear()) => {
  const window = getSpecialEventWindow(event, year);
  if (!window) return '';
  const locale = lang === 'en' ? 'en-GB' : 'fr-FR';
  const formatter = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: 'UTC' });
  const end = new Date(window.endExclusive.getTime() - DAY_MS);
  return `${formatter.format(window.start)} - ${formatter.format(end)}`;
};

export const buildSpecialEventStage = (event, date = new Date()) => {
  if (!event?.stage) return null;
  const active = isSpecialEventActive(event, date);
  const window = getSpecialEventWindowForDate(event, date);
  const seasonYear = window?.seasonYear || new Date(date).getUTCFullYear();
  return {
    ...event.stage,
    id: `special:${event.id}:${seasonYear}`,
    catalogStageId: event.stage.stageId,
    specialEventId: event.id,
    eventSeasonKey: `${event.id}:${seasonYear}`,
    seasonalEvent: true,
    countsTowardCampaign: true,
    missionDeployment: {
      allowed: active,
      reasonCode: active ? null : 'eventWindowClosed'
    }
  };
};

export const normalizeSpecialEventProgress = (progress = {}) => Object.fromEntries(
  Object.entries(progress || {})
    .filter(([seasonKey, entry]) => seasonKey.includes(':') && entry && typeof entry === 'object')
    .map(([seasonKey, entry]) => [seasonKey, {
      attempts: Math.max(0, Math.floor(Number(entry.attempts) || 0)),
      victories: Math.max(0, Math.floor(Number(entry.victories) || 0)),
      firstClearedAt: typeof entry.firstClearedAt === 'string' ? entry.firstClearedAt : null,
      bestGrade: typeof entry.bestGrade === 'string' ? entry.bestGrade : null
    }])
);

export const recordSpecialEventResult = (progress, stage, { result, grade, at = new Date().toISOString() } = {}) => {
  const next = normalizeSpecialEventProgress(progress);
  const seasonKey = String(stage?.eventSeasonKey || '').trim();
  if (!stage?.seasonalEvent || !seasonKey) return next;
  const previous = next[seasonKey] || { attempts: 0, victories: 0, firstClearedAt: null, bestGrade: null };
  const victory = result === 'victory';
  const gradeOrder = ['S', 'A', 'B', 'C', 'D'];
  const previousGradeIndex = gradeOrder.indexOf(previous.bestGrade);
  const nextGradeIndex = gradeOrder.indexOf(grade);
  const bestGrade = nextGradeIndex >= 0 && (previousGradeIndex < 0 || nextGradeIndex < previousGradeIndex)
    ? grade
    : previous.bestGrade;
  next[seasonKey] = {
    attempts: previous.attempts + 1,
    victories: previous.victories + (victory ? 1 : 0),
    firstClearedAt: victory && !previous.firstClearedAt ? at : previous.firstClearedAt,
    bestGrade: bestGrade || null
  };
  return next;
};
