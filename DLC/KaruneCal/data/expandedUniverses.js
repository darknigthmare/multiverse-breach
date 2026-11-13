// Karune Cal — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  return ({
      key: 'karune_cal',
      universe: 'Karune Cal',
      mediaType: 'music',
      faction: 'horror',
      mode: 'RPG',
      difficulty: 'Very Hard',
      title: 'Calne Ca (Karune Ca)',
      titleFr: 'Calne Ca (Karune Ca)',
      stage: 'Bacterial Contamination Machine Archive',
      boss: 'Calne Ca Mechanized Casing',
      hero: ['karune_cal_avatar', 'Calne Ca', 'horror'],
      allies: [['calcium_endoskeleton', 'Calcium Endoskeleton', 'slayer'], ['chibi_cal_san', 'Chibi Cal-san', 'hacker']],
      monsters: ['Magnesium Six-Legged Form', 'Isopod Head Parasite', 'Bacterial Contamination Husk'],
      bosses: ['Saikin Osen Organic Form', 'Calcium Exposed Endoskeleton'],
      gear: [['calne_isopod', 'Calne Ca Head Isopod', 'Isopode cranien de Calne Ca', { atk: 8, def: 6 }], ['calcium_tendon', 'Calcium Metal Tendon', 'Tendon metallique de Calcium', { atk: 10, spd: 1 }], ['miku_casing_fragment', 'Miku-Shaped Casing Fragment', 'Fragment de carapace en forme de Miku', { hp: 65, def: 5 }]],
      event: ['evt_calne_casing_split', 'Mechanized Casing Split', 'Ouverture de la carapace mecanisee', 'Calne Ca opens the humanoid casing and exposes Calcium for a precise mechanical strike.', 'Calne Ca ouvre sa carapace humanoide et expose Calcium pour une frappe mecanique precise.'],
      theme: 'Deinos Calne Ca derivative, a Miku-shaped casing around Calcium, exposed machine tendons, isopods, and bacterial contamination body horror',
      motif: 'facility',
      colors: ['#171a22', '#030304', '#65d6e8']
    });
}
