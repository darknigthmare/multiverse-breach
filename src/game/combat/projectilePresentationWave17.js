// The source emitter is measured from the retained drawing. These finite
// impact/flight markers never paint a weapon, limb, companion or accepted hit.
// Entries are explicit identities, independent of genre or palette inference.
const ballistic = Object.freeze({ shape: 'ballistic', color: '#ffe2a2' });
const electricity = Object.freeze({ shape: 'spark', color: '#9ddfff' });
const entries = {
  thomas_rogan_hotd: ballistic, g_hotd: ballistic, james_taylor_hotd2: ballistic,
  gary_stewart_hotd2: ballistic, amy_crystal_hotd2: ballistic,
  lisa_rogan_hotd3: ballistic, g_hotd3: ballistic, dan_taylor_hotd3: ballistic,
  counter_strike_sas: ballistic, counter_strike_gign: ballistic, counter_strike_fbi: ballistic,
  team_fortress_2_scout: ballistic,
  team_fortress_2_soldier: { shape: 'rocket-marker', color: '#e9b982' },
  sanctum_skye_autumn: ballistic, sanctum_sweet_autumn: { shape: 'rocket-marker', color: '#ffb46b' },
  sanctum_simo: ballistic, hotline_miami_richter: ballistic,
  nemesis_awaken_realms_soldier: ballistic, atomic_heart_granny_zina: ballistic,
  bioshock_rapture_jack: electricity, atomic_heart_p3: electricity,
  spyro_hunter: { shape: 'arrow', color: '#c9a66b' },
  prey_2006_tommy_tawodi: { shape: 'spark', color: '#83d0ab' },
  metal_hellsinger_paz: { shape: 'spark', color: '#ff895f' },
  shadow_man_michael_leroi: { shape: 'orb', color: '#a27adc' },
  heart_of_darkness_andy: { shape: 'spark', color: '#a4f0ff' },
  redneck_rampage_leonard: { shape: 'ballistic', color: '#f8cc7f' },
  rival_schools_batsu: { shape: 'orb', color: '#ffdf75' },
  rival_schools_kyosuke: { shape: 'cross', color: '#8dcbff' },
  kaiba: { shape: 'beam', color: '#d8f0ff' }, joey: { shape: 'orb', color: '#ff9a3d' },
  pegasus_ygo: { shape: 'orb', color: '#bde8ff' }, atem: { shape: 'orb', color: '#d79fff' },
  taichi: { shape: 'orb', color: '#ffa34e' }, matt: { shape: 'orb', color: '#9acfff' },
  izzy: { shape: 'spark', color: '#ffd64d' }, sora_biyomon: { shape: 'orb', color: '#8ad993' },
  mimi_palmon: { shape: 'spark', color: '#9aca78' }, joe_gomamon: { shape: 'native-fish-region', color: '#9bdbfa' },
  tk_patamon: { shape: 'orb', color: '#dbefff' },
  korvo_solar: { shape: 'beam', color: '#9bff50' }
};
export const PROJECTILE_PRESENTATION_WAVE17 = Object.freeze(Object.fromEntries(
  Object.entries(entries).map(([id, entry]) => [id, Object.freeze(entry)])));
export const getProjectilePresentationWave17 = heroId => PROJECTILE_PRESENTATION_WAVE17[heroId] || ballistic;
