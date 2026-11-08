import { normalizeArchiveLivingWorld } from '../../src/game/universeArchiveView.js';

// Deliberately synthetic records exercise catalogue density and long text.
// These are verification data, not new characters, missions, rewards or artwork.
const localized = (fr, en) => ({ fr, en });
const records = create => Array.from({ length: 61 }, (_, index) => create(index + 1));
export const archiveUniverse = 'QA — Univers des archives';
export const emptyUniverse = 'QA — Univers sans catalogue';
export const fixturePortrait = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="84" height="96"><rect width="84" height="96" fill="#134054"/><path d="M42 10 72 48 42 86 12 48Z" fill="#73d4c7"/><text x="42" y="53" text-anchor="middle" font-size="14" fill="#07121c">QA</text></svg>');
export const denseArchive = {
  universe: archiveUniverse,
  lore: { title: localized('Archives des voyageurs de la Convergence — catalogue de vérification à intitulé long', 'Archives of travellers through the Convergence — verification catalogue with a long title'), mediaType: 'game', isOriginal: true },
  loreBrief: 'QA — ' + 'Contexte de vérification / verification background. '.repeat(28),
  cleared: false, hidden: false,
  heroes: records(n => ({ id: `qa-hero-${n}`, name: `QA Personnage / Character ${n}`, universe: archiveUniverse, category: 'tactical', primaryColor: '#79dfd1', portrait: fixturePortrait, hp: 100 + n, atk: 20 + n, def: 10 + n, loreLocalized: localized(`Notice source numéro ${n}. Le témoignage traverse les archives sans modifier le statut de recrutement.`, `Source entry number ${n}. The account crosses the archive without changing recruitment status.`) })),
  allEnemies: records(n => ({ id: `qa-enemy-${n}`, name: `QA Menace / Threat ${n}`, universe: archiveUniverse, color: '#ffa89c', hp: 200 + n, atk: 15 + n, spd: 3, special: { name: localized(`Pouvoir ${n}`, `Ability ${n}`) }, lore: localized(`Menace de vérification ${n}`, `Verification threat ${n}`) })),
  relics: records(n => ({ id: `qa-relic-${n}`, universe: archiveUniverse, name: localized(`Relique ${n}`, `Relic ${n}`), desc: localized(`Histoire de la relique ${n}`, `Relic history ${n}`), boost: { atk: n } })),
  eventItem: { id: 'qa-event-item', name: localized('Témoin événementiel', 'Event witness'), desc: localized('Mémoire de l’événement préservée.', 'Preserved event memory.'), universe: archiveUniverse },
  battleItems: records(n => ({ id: `qa-battle-${n}`, universe: archiveUniverse, name: localized(`Artefact ${n}`, `Artifact ${n}`), desc: localized(`Description tactique ${n}`, `Tactical description ${n}`), role: 'support', tier: n % 3 ? 'gear' : 'ultimate', color: '#f9df83' })),
  worldItems: records(n => ({ id: `qa-world-${n}`, name: localized(`Objet local ${n}`, `Local item ${n}`), desc: localized(`Description du commerce local ${n}`, `Local trade description ${n}`), type: 'archive', rarityId: 'rare', acquisition: 'QA catalogue' })),
  stages: records(n => ({ id: `qa-mission-${n}`, name: `QA Mission ${n}`, displayName: localized(`Mission de vérification ${n}`, `Verification mission ${n}`), mode: n % 2 ? 'rpg' : 'tactics', bossName: `QA Menace / Threat ${n}`, brief: localized(`Objectif documenté ${n}. Aucun lancement de combat depuis ce lecteur.`, `Recorded objective ${n}. This reader does not start combat.`), nonCombat: n === 61 })),
  universeArcs: records(n => ({ id: `qa-arc-${n}`, title: localized(`Arc de l’univers ${n}`, `Universe arc ${n}`), intro: localized(`Introduction narrative ${n}`, `Narrative introduction ${n}`) })),
  characterArcs: [{ id: 'qa-character-arc', title: localized('Arc du personnage', 'Character arc'), reward: localized('Récompense documentée', 'Recorded reward') }],
  franchiseCollections: records(n => ({ id: `qa-collection-${n}`, title: localized(`Collection ${n}`, `Collection ${n}`), complete: n % 2 === 0, completed: n % 2 === 0 ? 3 : 1, total: 3, bonus: localized(`Bonus préservé ${n}`, `Preserved bonus ${n}`) })),
  livingWorld: normalizeArchiveLivingWorld({
    locations: [{ id: 'qa-place', name: localized('Passage des archives', 'Archive passage'), type: 'QA route', dailyUse: localized('Retrouver les témoignages.', 'Recover testimonies.'), connectedTo: 'QA Atrium' }],
    population: { inhabitants: ['QA habitants'], leaders: ['QA conseil'], supportNpcs: [{ id: 'qa-npc', role: 'QA archiviste', name: 'QA témoin' }], neutralCreatures: ['QA faune neutre'] },
    society: { minorFactions: ['QA cercle'], beliefs: ['QA mémoire'], professions: ['QA scribes'], resources: ['QA papier'], food: ['QA repas'], vehicles: ['QA chariot'], architecture: 'QA galeries', economy: { currency: 'QA jetons', exports: ['QA dossiers'], imports: ['QA encres'] } },
    ecology: { flora: ['QA mousse'], fauna: ['QA oiseaux'], threats: ['QA orages'] },
    dialogues: [{ id: 'qa-dialogue', speaker: 'QA témoin', location: 'QA passage', line: 'QA témoignage conservé.' }],
    heroRelationships: [{ id: 'qa-relationship', bond: 'QA entraide', gameplayBonus: { assistChargePercent: 5 } }],
    sideQuests: [{ id: 'qa-quest', title: localized('Retrouver le registre', 'Recover the ledger'), giver: 'QA archiviste', objective: 'QA lire le registre.' }],
    randomEvents: [{ id: 'qa-event', chance: .25, effect: 'QA passage ouvert.' }],
    codexEntries: [{ id: 'qa-codex', title: localized('Note de continuité', 'Continuity note'), body: localized('Dernière notice du monde vivant.', 'Last living-world record.') }]
  })
};
export const emptyArchive = { ...denseArchive, universe: emptyUniverse, lore: { title: localized('Univers sans entrées', 'Universe without entries'), isOriginal: false }, loreBrief: 'QA empty source catalogue.', heroes: [], allEnemies: [], relics: [], eventItem: null, battleItems: [], worldItems: [], stages: [], universeArcs: [], characterArcs: [], franchiseCollections: [], livingWorld: null };
export const archiveProgress = { gold: 9876, shards: 123, unlockedHeroes: ['qa-hero-2'], heroLevels: { 'qa-hero-2': 8 }, completedStages: ['qa-mission-2'], inventory: ['qa-relic-2', 'qa-absent-dlc-entitlement'], selectedCosmetics: { 'qa-enemy-1': 'qa-preserved-style' } };
const text = (entry, lang) => typeof entry === 'string' ? entry : entry?.[lang] || entry?.fr || '';
export const archivePresentation = (lang = 'fr') => ({
  getHeroStats: hero => ({ hp: hero.hp, atk: hero.atk, def: hero.def }),
  getEnemySpriteInfo: () => ({ src: null, ready: false }),
  formatBoostText: boost => `ATK +${boost.atk || 0}`,
  getGearLore: item => text(item.desc, lang), getEventLore: item => text(item.desc, lang),
  getNonCombatStageDetails: stage => stage.nonCombat ? { title: lang === 'fr' ? 'Lecture du registre' : 'Read the ledger' } : null,
  getRiftDossierArtSrc: () => null,
  getRichBreachBrief: stage => text(stage.brief, lang),
  iconSrc: fixturePortrait, mediaLabel: lang === 'fr' ? 'Vérification' : 'Verification', isOriginal: true
});
