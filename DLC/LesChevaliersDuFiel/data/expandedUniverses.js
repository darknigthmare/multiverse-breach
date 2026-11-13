// Les Chevaliers du Fiel — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Les Chevaliers du Fiel',
    mediaType: 'series',
    faction: 'arcane',
    stageName: 'Municipaux Town Hall Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Municipal Paperwork Titan',
    title: { en: 'Les Chevaliers du Fiel - Les Municipaux', fr: 'Les Chevaliers du Fiel - Les Municipaux' },
    desc: { en: 'Municipal comedy turns paperwork, local authority, and exaggerated laziness into a bureaucratic breach.', fr: 'La comedie municipale transforme paperasse, autorite locale et flemme exageree en breche bureaucratique.' },
    hero: { id: 'municipal_agent_fiel', name: 'Agent Municipal', cat: 'tactical', color: '#4f6f4f' },
    allies: [{ id: 'brigadier_fiel', name: 'Brigadier Municipal', cat: 'marine', color: '#6b7d5f' }, { id: 'mairie_fiel', name: 'Mairie Clerk', cat: 'hacker', color: '#c7b37a' }],
    monsters: ['Paperwork Stack', 'Town Hall Queue', 'Broken Service Van'],
    bosses: ['Overtime Refusal', 'Mayor Complaint Desk'],
    worldBoss: 'Municipal Paperwork Titan',
    gear: [['fiel_stamp', 'Municipal Stamp', 'Tampon municipal', { atk: 6, def: 4 }], ['fiel_vest', 'Service Vest', 'Gilet de service', { hp: 70 }], ['fiel_clipboard', 'Inspection Clipboard', 'Planchette inspection', { spd: 1, def: 5 }]],
    event: ['evt_fiel_arrete', 'Municipal Decree', 'Arrete municipal', 'A town decree slows all enemies and raises defense.', 'Un arrete ralentit tous les ennemis et augmente la defense.'],
    decor: { sky: ['#242b22', '#050705'], floor: 'rgba(150, 132, 76, 0.15)', grid: 'rgba(210, 200, 120, 0.24)', motif: 'arcanecity', accent: '#d2c878' }
  });
}
