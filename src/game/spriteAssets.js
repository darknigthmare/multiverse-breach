import { DISCIPLINE_SPRITE_LAYOUTS, getDisciplineSpriteLayout, getDisciplineSpriteSources } from './disciplineSprites.js';
import { getCloudMeadowSpriteLayout, getCloudMeadowSpriteSrc } from './cloudMeadowCharacters.js';
import {
  getMeleeAnimationFrame,
  getMeleeAnimationManifest,
  getMeleeAnimationSheetSources,
  getMeleeSheetLayout
} from './melee/meleeAnimationManifest.js';

export const SPRITE_SHEET_META = {
  frameWidth: 256,
  frameHeight: 256,
  columns: 4,
  rows: ['idle', 'run', 'attack', 'hit']
};

export const slugifyAsset = (value) => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

export const MIRELLE_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-mirelle-complete';
export const BASTION_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-bastion-complete';
export const NOVA_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-nova-complete';
export const MARROW_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/nexus-de-convergence/arca-marrow-complete';
export const SERJ_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/system-of-a-down/serj-tankian-complete';
export const BUCKET_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/buckhead/bucket-guitar-echo-complete';
export const ARTHUR_COMPLETE_SPRITE_BASE = '/sprites/generated/heroes/kaamelott/arthur-kaamelott-complete';
export const HALO_COMPLETE_SPRITE_BASES = {
  masterchief: '/sprites/generated/heroes/halo/master-chief-complete',
  arbiter: '/sprites/generated/heroes/halo/arbiter-complete',
  johnson: '/sprites/generated/heroes/halo/avery-johnson-complete'
};

export const ROI_BURGONDE_BOSS_SPRITE = '/sprites/generated/bosses/kaamelott/roi-burgonde.png';

// Reviewed sprite corrections have their own audited sheets. Historical PNGs
// remain available with their original provenance and as documented variants.
export const CORRECTED_CANON_HERO_SPRITES = Object.freeze({
  ripley: "/sprites/generated/heroes/alien/ripley-v2-fidelity-wave12-2026-11-01.png",
  predator: "/sprites/generated/heroes/predator/predator-v2-fidelity-wave12-2026-11-01.png",
  greyback_yautja: "/sprites/generated/heroes/predator/greyback-yautja-v2-fidelity-wave12-2026-11-01.png",
  bishop: "/sprites/generated/heroes/alien/bishop-v2-fidelity-wave12-2026-11-01.png",
  nyme_first_song: "/sprites/generated/heroes/mythos-primordia/nyme-first-song-v2-fidelity-wave11-2026-10-26.png",
  oona_vell: "/sprites/generated/heroes/the-drowned-testament/oona-vell-v2-fidelity-wave11-2026-10-28.png",
  rumi_illa: "/sprites/generated/heroes/tawantinsuyu-the-split-sun/rumi-illa-v2-fidelity-wave11-2026-10-26.png",
  melantho_seer: "/sprites/generated/heroes/aegea-war-of-the-moirai/melantho-seer-v2-fidelity-wave11-2026-10-26.png",
  daichi_kurogane: "/sprites/generated/heroes/yomi-no-kage/daichi-kurogane-v2-fidelity-wave11-2026-10-26.png",
  nova_bell: "/sprites/generated/heroes/helios-56/nova-bell-v2-fidelity-wave11-2026-10-26.png",
  wei_long: "/sprites/generated/heroes/mandate-of-nine-heavens/wei-long-v2-fidelity-wave11-2026-10-26.png",
  sten_ulfsson: "/sprites/generated/heroes/nine-realms-last-twilight/sten-ulfsson-v2-fidelity-wave11-2026-10-26.png",
  aura_7: "/sprites/generated/heroes/helios-56/aura-7-v2-fidelity-wave11-2026-10-26.png",
  numa_corvinus: "/sprites/generated/heroes/imperium-aeternum/numa-corvinus-v2-fidelity-wave11-2026-10-26.png",
  merek_flint: "/sprites/generated/heroes/the-aether-crown/merek-flint-v2-fidelity-wave11-2026-10-26.png",
  taset_lioness: "/sprites/generated/heroes/kemet-the-devoured-sun/taset-lioness-v2-fidelity-wave11-2026-10-26.png",
  brother_ors: "/sprites/generated/heroes/meridian-clockwork/brother-ors-v2-fidelity-wave11-2026-10-26.png",
  cassian_varro: '/sprites/generated/heroes/imperium-aeternum/cassian-varro-v2-fidelity-wave11-2026-10-26.png',
  ilya_cross: '/sprites/generated/heroes/iron-tempest/ilya-cross-v2-fidelity-wave11-2026-10-26.png',
  thaleia_naxos: '/sprites/generated/heroes/aegea-war-of-the-moirai/thaleia-naxos-v2-fidelity-wave10-2026-10-25.png',
  mei_zhen: '/sprites/generated/heroes/mandate-of-nine-heavens/mei-zhen-v2-fidelity-wave10-2026-10-25.png',
  yrsa_rune_binder: '/sprites/generated/heroes/nine-realms-last-twilight/yrsa-rune-binder-v2-fidelity-wave10-2026-10-25.png',
  sumaq_khipu: '/sprites/generated/heroes/tawantinsuyu-the-split-sun/sumaq-khipu-v2-fidelity-wave10-2026-10-25.png',
  rei_kagetsu: '/sprites/generated/heroes/yomi-no-kage/rei-kagetsu-v2-fidelity-wave10-2026-10-25.png',
  doros_bronzehand: '/sprites/generated/heroes/aegea-war-of-the-moirai/doros-bronzehand-v2-fidelity-wave9-2026-10-25.png',
  lin_yue: '/sprites/generated/heroes/mandate-of-nine-heavens/lin-yue-v2-fidelity-wave9-2026-10-25.png',
  eira_hrafnsdottir: '/sprites/generated/heroes/nine-realms-last-twilight/eira-hrafnsdottir-v2-fidelity-wave9-2026-10-25.png',
  killa_mayu: '/sprites/generated/heroes/tawantinsuyu-the-split-sun/killa-mayu-v2-fidelity-wave9-2026-10-25.png',
  aoi_mikazuki: '/sprites/generated/heroes/yomi-no-kage/aoi-mikazuki-v2-fidelity-wave9-2026-10-25.png',
  imani_quell: '/sprites/generated/heroes/neon-requiem/imani-quell-v2-fidelity-wave8-2026-10-24.png',
  bram_quill: '/sprites/generated/heroes/the-aether-crown/bram-quill-v2-fidelity-wave8-2026-10-24.png',
  lio_ferrante: '/sprites/generated/heroes/meridian-clockwork/lio-ferrante-v2-fidelity-wave8-2026-10-24.png',
  anton_rook: '/sprites/generated/heroes/iron-tempest/anton-rook-v2-fidelity-wave8-2026-10-24.png',
  khepri_sen: '/sprites/generated/heroes/kemet-the-devoured-sun/khepri-sen-v2-fidelity-wave8-2026-10-24.png',
  nessa_vire: '/sprites/generated/heroes/aetherion-seven-laws-of-magic/nessa-vire-v2-fidelity-wave7-2026-10-23.png',
  aelwen_starbough: '/sprites/generated/heroes/valedor-the-shattered-crown/aelwen-starbough-v2-fidelity-wave7-2026-10-23.png',
  ysara_flint: '/sprites/generated/heroes/the-crownless-sea/ysara-flint-v2-fidelity-wave7-2026-10-23.png',
  aurelia_marcellina: '/sprites/generated/heroes/imperium-aeternum/aurelia-marcellina-v2-fidelity-wave7-2026-10-23.png',
  seyra_tal: '/sprites/generated/heroes/ilyr-concordat/seyra-tal-v2-fidelity-wave7-2026-10-23.png',
  brann_crow: '/sprites/generated/heroes/the-crownless-sea/brann-crow-v2-fidelity-wave6-2026-10-23.png',
  lyra_hexwind: '/sprites/generated/heroes/aetherion-seven-laws-of-magic/lyra-hexwind-v2-fidelity-wave6-2026-10-23.png',
  mercy_ash: '/sprites/generated/heroes/infernum-nine-pits/mercy-ash-v2-fidelity-wave6-2026-10-23.png',
  mara_ell: '/sprites/generated/heroes/the-drowned-testament/mara-ell-v2-fidelity-wave6-2026-10-23.png',
  orin_vale: '/sprites/generated/heroes/aetherion-seven-laws-of-magic/orin-vale-v2-fidelity-wave6-2026-10-23.png',
  crash_bandicoot: '/sprites/generated/heroes/crash-bandicoot/crash-bandicoot-crash4-fidelity-wave5-2026-10-22.png',
  jax_rook: '/sprites/generated/heroes/neon-requiem/jax-rook-v2-fidelity-wave5-2026-10-22.png',
  seraphine_meridius: '/sprites/generated/heroes/meridian-clockwork/seraphine-meridius-v2-fidelity-wave5-2026-10-22.png',
  mara_veylan: '/sprites/generated/heroes/iron-tempest/mara-veylan-v2-fidelity-wave5-2026-10-22.png',
  celeste_ray: '/sprites/generated/heroes/helios-56/celeste-ray-v2-fidelity-wave5-2026-10-22.png',
  nefra_balance: '/sprites/generated/heroes/kemet-the-devoured-sun/nefra-balance-v2-fidelity-wave5-2026-10-22.png',
  arca_elyra: '/sprites/generated/heroes/nexus-de-convergence/arca-elyra-frame-packing-2026-10-20.png',
  chris_redfield: '/sprites/generated/heroes/resident-evil/chris-redfield-re1-1996-fidelity-2026-10-18.png',
  devil_may_cry_dante: '/sprites/generated/heroes/devil-may-cry/dante-dmc5-2019-fidelity-2026-10-18.png',
  doomslayer: '/sprites/generated/heroes/doom/doomslayer-eternal-2020-fidelity-2026-10-18.png',
  elara_voss: '/sprites/generated/heroes/the-aether-crown/elara-voss-v2-fidelity-wave4-2026-10-20.png',
  liquid_snake: '/sprites/generated/heroes/metal-gear/liquid-snake-mgs-1998-final-web.png',
  mistral_mgr: '/sprites/generated/heroes/metal-gear-rising/mistral-revengeance-2013-fidelity-2026-10-18.png',
  nyra_vale: '/sprites/generated/heroes/neon-requiem/nyra-vale-v2-fidelity-wave4-2026-10-20.png',
  saturnin_duck: '/sprites/generated/heroes/les-aventures-de-saturnin/saturnin-ortf-web.png',
  true_ogre_tekken: '/sprites/generated/heroes/tekken/true-ogre-tekken-3-fidelity-2026-10-18.png'
});

export const CORRECTED_HERO_SPRITE_VARIANTS = Object.freeze({
  ripley: Object.freeze([
    Object.freeze({ id: "fidelity-wave12-2026-11-01", label: "Ripley — Nostromo 1979, tenue et équipement corrigés", src: CORRECTED_CANON_HERO_SPRITES.ripley, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/alien/ripley.png", current: false })
  ]),
  predator: Object.freeze([
    Object.freeze({ id: "fidelity-wave12-2026-11-01", label: "Jungle Hunter — Predator 1987, fidélité revue et 16 poses (2026-11-01)", src: CORRECTED_CANON_HERO_SPRITES.predator, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/predator/predator.png", current: false })
  ]),
  greyback_yautja: Object.freeze([
    Object.freeze({ id: "fidelity-wave12-2026-11-01", label: "Greyback — Predator 2, fidélité revue et 16 poses (2026-11-01)", src: CORRECTED_CANON_HERO_SPRITES.greyback_yautja, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/predator/greyback-yautja.png", current: false })
  ]),
  bishop: Object.freeze([
    Object.freeze({ id: "fidelity-wave12-2026-11-01", label: "Bishop — Aliens 1986, fidélité revue et 16 poses (2026-11-01)", src: CORRECTED_CANON_HERO_SPRITES.bishop, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/alien/bishop.png", current: false })
  ]),
  nyme_first_song: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Fidélité V2 — Nyme, 16 poses revues", src: CORRECTED_CANON_HERO_SPRITES.nyme_first_song, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/mythos-primordia/nyme-first-song.png", current: false })
  ]),
  oona_vell: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-28", label: "Fidélité V2 — Oona Vell, 16 poses revues", src: CORRECTED_CANON_HERO_SPRITES.oona_vell, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/the-drowned-testament/oona-vell.png", current: false })
  ]),
  rumi_illa: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Rumi Illa — référence V2, seize poses revues", src: CORRECTED_CANON_HERO_SPRITES.rumi_illa, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/tawantinsuyu-the-split-sun/rumi-illa.png", current: false })
  ]),
  melantho_seer: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Melantho — référence V2, seize poses revues", src: CORRECTED_CANON_HERO_SPRITES.melantho_seer, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/aegea-war-of-the-moirai/melantho-seer.png", current: false })
  ]),
  daichi_kurogane: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Daichi Kurogane — référence V2, seize poses revues", src: CORRECTED_CANON_HERO_SPRITES.daichi_kurogane, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/yomi-no-kage/daichi-kurogane.png", current: false })
  ]),
  nova_bell: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Nova Bell — référence V2, seize poses revues", src: CORRECTED_CANON_HERO_SPRITES.nova_bell, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/helios-56/nova-bell.png", current: false })
  ]),
  wei_long: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Wei Long — référence V2, seize poses revues", src: CORRECTED_CANON_HERO_SPRITES.wei_long, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/mandate-of-nine-heavens/wei-long.png", current: false })
  ]),
  sten_ulfsson: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Portrait V2 — fourrure grise, étoffes bleues et lance à deux pointes", src: CORRECTED_CANON_HERO_SPRITES.sten_ulfsson, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/nine-realms-last-twilight/sten-ulfsson.png", current: false })
  ]),
  aura_7: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Portrait V2 — robot ivoire et rouge, écran cyan, gantelet droit et bouclier gauche", src: CORRECTED_CANON_HERO_SPRITES.aura_7, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/helios-56/aura-7.png", current: false })
  ]),
  numa_corvinus: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Portrait V2 — robes bleu nuit et or, sandales et bâton d’augure droit", src: CORRECTED_CANON_HERO_SPRITES.numa_corvinus, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/imperium-aeternum/numa-corvinus.png", current: false })
  ]),
  merek_flint: Object.freeze([
    Object.freeze({ id: "v2-fidelity-wave11-2026-10-26", label: "Portrait V2 — armure acier et bronze, foyer orange et marteau à vapeur", src: CORRECTED_CANON_HERO_SPRITES.merek_flint, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/the-aether-crown/merek-flint.png", current: false })
  ]),
  taset_lioness: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave11-2026-10-26', label: "Portrait V2 — drapé ivoire, étoffe rouille, lance droite et bouclier gauche", src: CORRECTED_CANON_HERO_SPRITES.taset_lioness, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/kemet-the-devoured-sun/taset-lioness.png", current: false })
  ]),
  brother_ors: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave11-2026-10-26', label: "Portrait V2 — implants en laiton, robe ivoire, cape rouille et masse rigide", src: CORRECTED_CANON_HERO_SPRITES.brother_ors, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: "/sprites/generated/heroes/meridian-clockwork/brother-ors.png", current: false })
  ]),
  cassian_varro: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave11-2026-10-26', label: 'Portrait V2 — armure noire, cape rouge, gladius droit et scutum gauche', src: CORRECTED_CANON_HERO_SPRITES.cassian_varro, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/imperium-aeternum/cassian-varro.png', current: false })
  ]),
  ilya_cross: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave11-2026-10-26', label: 'Portrait V2 — cheveux noirs, écharpe ocre et lame à rotor gauche', src: CORRECTED_CANON_HERO_SPRITES.ilya_cross, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/iron-tempest/ilya-cross.png', current: false })
  ]),
  thaleia_naxos: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave10-2026-10-25', label: "Portrait V2 — drapés bleu/ivoire, épée droite et fils violets", src: CORRECTED_CANON_HERO_SPRITES.thaleia_naxos, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/aegea-war-of-the-moirai/thaleia-naxos.png', current: false })
  ]),
  mei_zhen: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave10-2026-10-25', label: "Portrait V2 — robe bordeaux/ivoire et épée à garde-cloche", src: CORRECTED_CANON_HERO_SPRITES.mei_zhen, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/mandate-of-nine-heavens/mei-zhen.png', current: false })
  ]),
  yrsa_rune_binder: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave10-2026-10-25', label: "Portrait V2 — manteau violet et bâton noueux à orbe", src: CORRECTED_CANON_HERO_SPRITES.yrsa_rune_binder, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/nine-realms-last-twilight/yrsa-rune-binder.png', current: false })
  ]),
  sumaq_khipu: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave10-2026-10-25', label: "Portrait V2 — longs textiles violets et cordons de khipu", src: CORRECTED_CANON_HERO_SPRITES.sumaq_khipu, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/tawantinsuyu-the-split-sun/sumaq-khipu.png', current: false })
  ]),
  rei_kagetsu: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave10-2026-10-25', label: "Portrait V2 — longue robe navy, talisman droit et éventail gauche", src: CORRECTED_CANON_HERO_SPRITES.rei_kagetsu, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/yomi-no-kage/rei-kagetsu.png', current: false })
  ]),
  doros_bronzehand: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave9-2026-10-25', label: "Portrait V2 — tablier brun, pans sarcelle et marteau droit", src: CORRECTED_CANON_HERO_SPRITES.doros_bronzehand, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/aegea-war-of-the-moirai/doros-bronzehand.png', current: false })
  ]),
  lin_yue: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave9-2026-10-25', label: "Portrait V2 — robes navy, pinceau droit et talismans", src: CORRECTED_CANON_HERO_SPRITES.lin_yue, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/mandate-of-nine-heavens/lin-yue.png', current: false })
  ]),
  eira_hrafnsdottir: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave9-2026-10-25', label: "Portrait V2 — long manteau bleu, hache droite et bouclier gauche", src: CORRECTED_CANON_HERO_SPRITES.eira_hrafnsdottir, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/nine-realms-last-twilight/eira-hrafnsdottir.png', current: false })
  ]),
  killa_mayu: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave9-2026-10-25', label: "Portrait V2 — poncho ocre/violet, fronde droite et khipu gauche", src: CORRECTED_CANON_HERO_SPRITES.killa_mayu, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/tawantinsuyu-the-split-sun/killa-mayu.png', current: false })
  ]),
  aoi_mikazuki: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave9-2026-10-25', label: "Portrait V2 — long kimono bordeaux/ivoire et katana cyan droit", src: CORRECTED_CANON_HERO_SPRITES.aoi_mikazuki, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/yomi-no-kage/aoi-mikazuki.png', current: false })
  ]),
  imani_quell: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave8-2026-10-24', label: "Portrait V2 — manteau médical jaune et drones cyan", src: CORRECTED_CANON_HERO_SPRITES.imani_quell, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/neon-requiem/imani-quell.png', current: false })
  ]),
  bram_quill: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave8-2026-10-24', label: "Portrait V2 — goggles cyan et clé gauche", src: CORRECTED_CANON_HERO_SPRITES.bram_quill, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/the-aether-crown/bram-quill.png', current: false })
  ]),
  lio_ferrante: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave8-2026-10-24', label: "Portrait V2 — canon droit et orbe gauche", src: CORRECTED_CANON_HERO_SPRITES.lio_ferrante, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/meridian-clockwork/lio-ferrante.png', current: false })
  ]),
  anton_rook: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave8-2026-10-24', label: "Portrait V2 — tablier et canon à deux mains", src: CORRECTED_CANON_HERO_SPRITES.anton_rook, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/iron-tempest/anton-rook.png', current: false })
  ]),
  khepri_sen: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave8-2026-10-24', label: "Portrait V2 — bâton gauche et montre droite", src: CORRECTED_CANON_HERO_SPRITES.khepri_sen, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/kemet-the-devoured-sun/khepri-sen.png', current: false })
  ]),
  nessa_vire: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave7-2026-10-23', label: "Portrait V2 — armure violette et lame droite", src: CORRECTED_CANON_HERO_SPRITES.nessa_vire, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/aetherion-seven-laws-of-magic/nessa-vire.png', current: false })
  ]),
  aelwen_starbough: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave7-2026-10-23', label: "Portrait V2 — cape verte et arc gauche", src: CORRECTED_CANON_HERO_SPRITES.aelwen_starbough, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/valedor-the-shattered-crown/aelwen-starbough.png', current: false })
  ]),
  ysara_flint: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave7-2026-10-23', label: "Portrait V2 — sabre droit et pistolet gauche", src: CORRECTED_CANON_HERO_SPRITES.ysara_flint, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/the-crownless-sea/ysara-flint.png', current: false })
  ]),
  aurelia_marcellina: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave7-2026-10-23', label: "Portrait V2 — voile ivoire, lance et coupe", src: CORRECTED_CANON_HERO_SPRITES.aurelia_marcellina, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/imperium-aeternum/aurelia-marcellina.png', current: false })
  ]),
  seyra_tal: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave7-2026-10-23', label: "Portrait V2 — Auralith cristalline et lance gauche", src: CORRECTED_CANON_HERO_SPRITES.seyra_tal, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/ilyr-concordat/seyra-tal.png', current: false })
  ]),
  brann_crow: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave6-2026-10-23', label: "Portrait V2 — barbe, tresses et hache gauche", src: CORRECTED_CANON_HERO_SPRITES.brann_crow, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/the-crownless-sea/brann-crow.png', current: false })
  ]),
  lyra_hexwind: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave6-2026-10-23', label: "Portrait V2 — focus gauche et trois fioles droites", src: CORRECTED_CANON_HERO_SPRITES.lyra_hexwind, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/aetherion-seven-laws-of-magic/lyra-hexwind.png', current: false })
  ]),
  mercy_ash: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave6-2026-10-23', label: "Portrait V2 — manteau prune et faucille à chaîne", src: CORRECTED_CANON_HERO_SPRITES.mercy_ash, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/infernum-nine-pits/mercy-ash.png', current: false })
  ]),
  mara_ell: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave6-2026-10-23', label: "Portrait V2 — lunettes cyan, lampe gauche et cristal", src: CORRECTED_CANON_HERO_SPRITES.mara_ell, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/the-drowned-testament/mara-ell.png', current: false })
  ]),
  orin_vale: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave6-2026-10-23', label: "Portrait V2 — manteau marine et gantelet droit", src: CORRECTED_CANON_HERO_SPRITES.orin_vale, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/aetherion-seven-laws-of-magic/orin-vale.png', current: false })
  ]),
  crash_bandicoot: Object.freeze([
    Object.freeze({ id: 'crash4-fidelity-wave5-2026-10-22', label: "Crash 4 (2020) — modèle référencé", src: CORRECTED_CANON_HERO_SPRITES.crash_bandicoot, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/crash-bandicoot/crash-bandicoot.png', current: false })
  ]),
  jax_rook: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave5-2026-10-22', label: "Portrait V2 — exosquelette graphite et monofilament", src: CORRECTED_CANON_HERO_SPRITES.jax_rook, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/neon-requiem/jax-rook.png', current: false })
  ]),
  seraphine_meridius: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave5-2026-10-22', label: "Portrait V2 — manteau bleu et rapière", src: CORRECTED_CANON_HERO_SPRITES.seraphine_meridius, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/meridian-clockwork/seraphine-meridius.png', current: false })
  ]),
  mara_veylan: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave5-2026-10-22', label: "Portrait V2 — uniforme olive et étoffe rouge", src: CORRECTED_CANON_HERO_SPRITES.mara_veylan, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/iron-tempest/mara-veylan.png', current: false })
  ]),
  celeste_ray: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave5-2026-10-22', label: "Portrait V2 — lunettes turquoise et émetteur", src: CORRECTED_CANON_HERO_SPRITES.celeste_ray, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/helios-56/celeste-ray.png', current: false })
  ]),
  nefra_balance: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave5-2026-10-22', label: "Portrait V2 — drapé ivoire et khopesh", src: CORRECTED_CANON_HERO_SPRITES.nefra_balance, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas du projet conservé', src: '/sprites/generated/heroes/kemet-the-devoured-sun/nefra-balance.png', current: false })
  ]),
  arca_elyra: Object.freeze([
    Object.freeze({ id: 'frame-packing-2026-10-20', label: 'Cadrage corrigé — 16 poses existantes complètes', src: CORRECTED_CANON_HERO_SPRITES.arca_elyra, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas — découpes initiales du projet', src: '/sprites/generated/heroes/nexus-de-convergence/arca-elyra.png', current: false })
  ]),
  chris_redfield: Object.freeze([
    Object.freeze({ id: 'fidelity-2026-10-18', label: 'RE1 1996 corrigé — gilet vert et manches blanches', src: CORRECTED_CANON_HERO_SPRITES.chris_redfield, current: true }),
    Object.freeze({ id: 'original', label: 'Ancienne variante — gilet MOLLE moderne', src: '/sprites/generated/heroes/resident-evil/chris-redfield.png', current: false })
  ]),
  devil_may_cry_dante: Object.freeze([
    Object.freeze({ id: 'fidelity-2026-10-18', label: 'DMC5 2019 corrigé — henley et équipement source', src: CORRECTED_CANON_HERO_SPRITES.devil_may_cry_dante, current: true }),
    Object.freeze({ id: 'original', label: 'Ancienne variante — chemise rouge du projet', src: '/sprites/generated/heroes/devil-may-cry/devil-may-cry-dante.png', current: false })
  ]),
  doomslayer: Object.freeze([
    Object.freeze({ id: 'fidelity-2026-10-18', label: 'Eternal 2020 corrigé — lame et lanceur à gauche', src: CORRECTED_CANON_HERO_SPRITES.doomslayer, current: true }),
    Object.freeze({ id: 'original', label: 'Ancienne variante Doom Slayer du projet', src: '/sprites/generated/heroes/doom/doomslayer.png', current: false })
  ]),
  elara_voss: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave4-2026-10-20', label: 'Portrait V2 — manteau bordeaux, rapière et pistolet', src: CORRECTED_CANON_HERO_SPRITES.elara_voss, current: true }),
    Object.freeze({ id: 'original', label: 'Ancienne variante — manteau bleu et queue de cheval', src: '/sprites/generated/heroes/the-aether-crown/elara-voss.png', current: false })
  ]),
  liquid_snake: Object.freeze([
    Object.freeze({ id: 'web-2026-10-03', label: 'Version courante — duel final MGS 1998', src: CORRECTED_CANON_HERO_SPRITES.liquid_snake, current: true }),
    Object.freeze({ id: 'mgs-1998-previous', label: 'Étude antérieure — duel final MGS 1998', src: '/sprites/generated/heroes/metal-gear/liquid-snake-mgs-1998-final.png', current: false }),
    Object.freeze({ id: 'original', label: 'Ancien atlas Liquid Snake du projet', src: '/sprites/generated/heroes/metal-gear/liquid-snake.png', current: false })
  ]),
  mistral_mgr: Object.freeze([
    Object.freeze({ id: 'fidelity-2026-10-18', label: 'Référence corrigée — jambe rouge et double lame', src: CORRECTED_CANON_HERO_SPRITES.mistral_mgr, current: true }),
    Object.freeze({ id: 'web-2026-10-03', label: 'Ancienne variante — modèle du 3 octobre', src: '/sprites/generated/heroes/metal-gear-rising/mistral-revengeance-2013-web.png', current: false }),
    Object.freeze({ id: 'original', label: 'Variante initiale du projet', src: '/sprites/generated/heroes/metal-gear-rising/mistral-mgr.png', current: false })
  ]),
  nyra_vale: Object.freeze([
    Object.freeze({ id: 'v2-fidelity-wave4-2026-10-20', label: 'Portrait V2 — cheveux turquoise et long manteau magenta', src: CORRECTED_CANON_HERO_SPRITES.nyra_vale, current: true }),
    Object.freeze({ id: 'original', label: 'Ancienne variante — cheveux violets et veste courte', src: '/sprites/generated/heroes/neon-requiem/nyra-vale.png', current: false })
  ]),
  saturnin_duck: Object.freeze([
    Object.freeze({ id: 'web-2026-10-03', label: 'Version courante — caneton ORTF', src: CORRECTED_CANON_HERO_SPRITES.saturnin_duck, current: true }),
    Object.freeze({ id: 'original', label: 'Ancien atlas Saturnin du projet', src: '/sprites/generated/heroes/les-aventures-de-saturnin/saturnin-duck.png', current: false })
  ]),
  true_ogre_tekken: Object.freeze([
    Object.freeze({ id: 'fidelity-2026-10-18', label: 'Anatomie corrigée — serpent droit et griffe gauche', src: CORRECTED_CANON_HERO_SPRITES.true_ogre_tekken, current: true }),
    Object.freeze({ id: 'web-2026-10-03', label: 'Ancienne variante web — modèle du 3 octobre', src: '/sprites/generated/heroes/tekken/true-ogre-tekken-3-web.png', current: false }),
    Object.freeze({ id: 'tekken-3-previous', label: 'Ancienne variante Tekken 3 du projet', src: '/sprites/generated/heroes/tekken/true-ogre-tekken-3.png', current: false }),
    Object.freeze({ id: 'original', label: 'Variante initiale du projet', src: '/sprites/generated/heroes/tekken/true-ogre-tekken.png', current: false })
  ])
});

export const MIRELLE_COMPLETE_SPRITES = {
  rpg: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-rpg.png`,
  tactics: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-tactics.png`,
  meleeMovement: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-melee-movement.png`,
  meleeCombat: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-melee-combat.png`,
  nexusCollection: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-nexus-collection.png`,
  hudIcons: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-hud-icons.png`,
  hudAvatar: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-hud-avatar.png`,
  itemsVfx: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-items-vfx.png`,
  fpsHands: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-fps-hands.png`,
  fpsEffects: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-fps-effects.png`,
  fpsProjectile: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-fps-projectile.png`,
  kartDirections: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-directions.png`,
  kartActions: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-actions.png`,
  kartItems: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-items.png`,
  kartHudGarage: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-hud-garage.png`,
  kartTrackNexus: `${MIRELLE_COMPLETE_SPRITE_BASE}/arca-mirelle-kart-track-nexus.png`
};

export const MIRELLE_COMPLETE_SPRITE_PACK = [
  { id: 'rpg', label: 'RPG', src: MIRELLE_COMPLETE_SPRITES.rpg },
  { id: 'tactics', label: 'Tactics', src: MIRELLE_COMPLETE_SPRITES.tactics },
  { id: 'meleeMovement', label: 'Melee mouvement', src: MIRELLE_COMPLETE_SPRITES.meleeMovement },
  { id: 'meleeCombat', label: 'Melee combat', src: MIRELLE_COMPLETE_SPRITES.meleeCombat },
  { id: 'nexusCollection', label: 'Nexus / collection', src: MIRELLE_COMPLETE_SPRITES.nexusCollection },
  { id: 'hudIcons', label: 'HUD / icones', src: MIRELLE_COMPLETE_SPRITES.hudIcons },
  { id: 'hudAvatar', label: 'HUD avatar', src: MIRELLE_COMPLETE_SPRITES.hudAvatar },
  { id: 'itemsVfx', label: 'Objets / VFX', src: MIRELLE_COMPLETE_SPRITES.itemsVfx },
  { id: 'fpsHands', label: 'FPS mains', src: MIRELLE_COMPLETE_SPRITES.fpsHands },
  { id: 'fpsEffects', label: 'FPS profondeur / projectiles', src: MIRELLE_COMPLETE_SPRITES.fpsEffects },
  { id: 'fpsProjectile', label: 'FPS projectile recadre', src: MIRELLE_COMPLETE_SPRITES.fpsProjectile },
  { id: 'kartDirections', label: 'Kart directions', src: MIRELLE_COMPLETE_SPRITES.kartDirections },
  { id: 'kartActions', label: 'Kart actions', src: MIRELLE_COMPLETE_SPRITES.kartActions },
  { id: 'kartItems', label: 'Kart objets', src: MIRELLE_COMPLETE_SPRITES.kartItems },
  { id: 'kartHudGarage', label: 'Kart HUD / garage', src: MIRELLE_COMPLETE_SPRITES.kartHudGarage },
  { id: 'kartTrackNexus', label: 'Kart circuit Nexus', src: MIRELLE_COMPLETE_SPRITES.kartTrackNexus }
];

export const SERJ_COMPLETE_SPRITES = {
  rpg: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-rpg.png`,
  tactics: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-tactics.png`,
  meleeMovement: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-melee-movement.png`,
  meleeCombat: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-melee-combat.png`,
  nexusHud: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-nexus-hud.png`,
  fps: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-fps.png`,
  kart: `${SERJ_COMPLETE_SPRITE_BASE}/serj-tankian-kart.png`
};

export const SERJ_COMPLETE_SPRITE_PACK = [
  { id: 'rpg', label: 'RPG', src: SERJ_COMPLETE_SPRITES.rpg },
  { id: 'tactics', label: 'Tactics', src: SERJ_COMPLETE_SPRITES.tactics },
  { id: 'meleeMovement', label: 'Melee mouvement', src: SERJ_COMPLETE_SPRITES.meleeMovement },
  { id: 'meleeCombat', label: 'Melee combat', src: SERJ_COMPLETE_SPRITES.meleeCombat },
  { id: 'nexusHud', label: 'Nexus / HUD', src: SERJ_COMPLETE_SPRITES.nexusHud },
  { id: 'fps', label: 'FPS micro / effets', src: SERJ_COMPLETE_SPRITES.fps },
  { id: 'kart', label: 'Kart', src: SERJ_COMPLETE_SPRITES.kart }
];

export const BUCKET_COMPLETE_SPRITES = {
  rpg: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-rpg.png`,
  tactics: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-tactics.png`,
  meleeMovement: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-melee-movement.png`,
  meleeCombat: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-melee-combat.png`,
  nexusHud: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-nexus-hud.png`,
  fps: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-fps.png`,
  kart: `${BUCKET_COMPLETE_SPRITE_BASE}/bucket-guitar-echo-kart.png`
};

export const BUCKET_COMPLETE_SPRITE_PACK = [
  { id: 'rpg', label: 'RPG', src: BUCKET_COMPLETE_SPRITES.rpg },
  { id: 'tactics', label: 'Tactics', src: BUCKET_COMPLETE_SPRITES.tactics },
  { id: 'meleeMovement', label: 'Melee mouvement', src: BUCKET_COMPLETE_SPRITES.meleeMovement },
  { id: 'meleeCombat', label: 'Melee combat', src: BUCKET_COMPLETE_SPRITES.meleeCombat },
  { id: 'nexusHud', label: 'Nexus / HUD', src: BUCKET_COMPLETE_SPRITES.nexusHud },
  { id: 'fps', label: 'FPS guitare / effets', src: BUCKET_COMPLETE_SPRITES.fps },
  { id: 'kart', label: 'Kart', src: BUCKET_COMPLETE_SPRITES.kart }
];

export const ARTHUR_COMPLETE_SPRITES = {
  rpg: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-rpg.png`,
  tactics: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-tactics.png`,
  meleeMovement: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-melee-movement.png`,
  meleeCombat: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-melee-combat.png`,
  nexusHud: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-nexus-hud.png`,
  fps: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-fps.png`,
  kart: `${ARTHUR_COMPLETE_SPRITE_BASE}/arthur-kaamelott-kart.png`
};

export const ARTHUR_COMPLETE_SPRITE_PACK = [
  { id: 'rpg', label: 'RPG', src: ARTHUR_COMPLETE_SPRITES.rpg },
  { id: 'tactics', label: 'Tactics', src: ARTHUR_COMPLETE_SPRITES.tactics },
  { id: 'meleeMovement', label: 'Melee mouvement', src: ARTHUR_COMPLETE_SPRITES.meleeMovement },
  { id: 'meleeCombat', label: 'Melee combat', src: ARTHUR_COMPLETE_SPRITES.meleeCombat },
  { id: 'nexusHud', label: 'Nexus / HUD', src: ARTHUR_COMPLETE_SPRITES.nexusHud },
  { id: 'fps', label: 'FPS epee / effets', src: ARTHUR_COMPLETE_SPRITES.fps },
  { id: 'kart', label: 'Kart', src: ARTHUR_COMPLETE_SPRITES.kart }
];

export const BASTION_COMPLETE_SPRITES = {
  universal: `${BASTION_COMPLETE_SPRITE_BASE}/arca-bastion-universal-v1.png`
};

export const BASTION_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: BASTION_COMPLETE_SPRITES.universal }
];

export const NOVA_COMPLETE_SPRITES = {
  universal: `${NOVA_COMPLETE_SPRITE_BASE}/arca-nova-universal-v1.png`
};

export const NOVA_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: NOVA_COMPLETE_SPRITES.universal }
];

export const MARROW_COMPLETE_SPRITES = {
  universal: `${MARROW_COMPLETE_SPRITE_BASE}/arca-marrow-universal-v1.png`
};

export const MARROW_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: MARROW_COMPLETE_SPRITES.universal }
];

export const SABLE_COMPLETE_SPRITES = {
  universal: '/sprites/generated/heroes/nexus-de-convergence/arca-sable.png'
};

export const SABLE_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: SABLE_COMPLETE_SPRITES.universal }
];

export const LOOM_COMPLETE_SPRITES = {
  universal: '/sprites/generated/heroes/nexus-de-convergence/arca-loom.png'
};

export const LOOM_COMPLETE_SPRITE_PACK = [
  { id: 'universal', label: 'RPG / Tactics / Melee / Nexus', src: LOOM_COMPLETE_SPRITES.universal }
];

export const HALO_COMPLETE_SPRITES = {
  masterchief: `${HALO_COMPLETE_SPRITE_BASES.masterchief}/master-chief-universal.png`,
  arbiter: `${HALO_COMPLETE_SPRITE_BASES.arbiter}/arbiter-universal.png`,
  johnson: `${HALO_COMPLETE_SPRITE_BASES.johnson}/avery-johnson-universal.png`
};

export const HALO_COMPLETE_SPRITE_PACKS = {
  masterchief: [
    { id: 'universal', label: 'Halo / gameplay complet', src: HALO_COMPLETE_SPRITES.masterchief }
  ],
  arbiter: [
    { id: 'universal', label: 'Halo / gameplay complet', src: HALO_COMPLETE_SPRITES.arbiter }
  ],
  johnson: [
    { id: 'universal', label: 'Halo / gameplay complet', src: HALO_COMPLETE_SPRITES.johnson }
  ]
};

export const SPRITE_SHEET_LAYOUTS = {
  ...DISCIPLINE_SPRITE_LAYOUTS,
  '/sprites/generated/bosses/godzilla-the-animated-series/crustaceous-rex.png': {
    // One complete static figure. Movement/combat animation is not supplied.
    columns: 1,
    rows: 1,
    // Native 1254 px image: retain the silhouette and 24 px below its feet,
    // matching the generated-sprite renderer's source-space ground offset.
    trim: { bottom: 69 },
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/the-aether-crown/lord-pneuma.png': {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/the-aether-crown/aether-mite-swarm.png': {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/the-crownless-sea/kraken-sans-couronne.png': {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/valedor-the-shattered-crown/reine-des-ronces.png': {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/ilyr-concordat/cuirasse-nul-oblique.png': {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/meridian-clockwork/the-twelve-bell-judges.png': {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/valedor-the-shattered-crown/vaelgor-premier-wyrm.png': {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/the-drowned-testament/le-phare-qui-regarde.png': {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  '/sprites/generated/bosses/yomi-no-kage/amas-des-huit-orochi.png': {
    // One reviewed full-body image; animations remain pending in its asset manifest.
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, support: 0, special: 0, hit: 0, dead: 0 }
  },
  [BASTION_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 3, support: 4, special: 5, hit: 6, dead: 7 }
  },
  [NOVA_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 3, support: 4, special: 5, hit: 6, dead: 7 }
  },
  [MARROW_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 3, support: 4, special: 5, hit: 6, dead: 7 }
  },
  [SABLE_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 4,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, support: 2, special: 2, hit: 3, dead: 3 }
  },
  [LOOM_COMPLETE_SPRITES.universal]: {
    columns: 4,
    rows: 4,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, support: 2, special: 2, hit: 3, dead: 3 }
  },
  [MIRELLE_COMPLETE_SPRITES.rpg]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 10, dead: 11 }
  },
  [MIRELLE_COMPLETE_SPRITES.tactics]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 9, hit: 7, dead: 8 },
    trimByState: {
      idle: { bottom: 6 },
      run: { top: 6, bottom: 6 },
      attack: { top: 6, bottom: 6 },
      defense: { top: 6, bottom: 6 },
      hit: { top: 6, bottom: 6 },
      dead: { top: 6, bottom: 6 }
    }
  },
  [MIRELLE_COMPLETE_SPRITES.meleeMovement]: {
    columns: 4,
    rows: 6,
    rowByState: { idle: 0, run: 1, jump: 2, fall: 3, hit: 4, dead: 5 }
  },
  [MIRELLE_COMPLETE_SPRITES.meleeCombat]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 0, attack: 2, defense: 6, hit: 7, dead: 8 },
    trimByState: {
      idle: { bottom: 6 },
      attack: { top: 6, bottom: 6 },
      defense: { top: 6, bottom: 6 },
      hit: { top: 6, bottom: 6 },
      dead: { top: 6, bottom: 6 }
    }
  },
  [MIRELLE_COMPLETE_SPRITES.nexusCollection]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 4, defense: 5, hit: 8, dead: 9 },
    trimByState: {
      run: { top: 38 },
      attack: { top: 18, bottom: 8 },
      defense: { top: 16, bottom: 10 },
      hit: { top: 20, bottom: 10 },
      dead: { top: 18 }
    }
  },
  [MIRELLE_COMPLETE_SPRITES.fpsHands]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 8, hit: 9, dead: 9 },
    trimByState: {
      reload: { top: 40, bottom: 6 }
    }
  },
  [MIRELLE_COMPLETE_SPRITES.fpsEffects]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, attack: 2, hit: 7, dead: 9 }
  },
  [MIRELLE_COMPLETE_SPRITES.kartDirections]: {
    columns: 4,
    rows: 4,
    rowByState: { idle: 0, run: 1, attack: 2, hit: 3, dead: 3 }
  },
  [MIRELLE_COMPLETE_SPRITES.hudAvatar]: {
    columns: 1,
    rows: 1,
    rowByState: { idle: 0, run: 0, attack: 0, defense: 0, hit: 0, dead: 0 }
  },
  [SERJ_COMPLETE_SPRITES.rpg]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 11 }
  },
  [SERJ_COMPLETE_SPRITES.tactics]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 11 }
  },
  [SERJ_COMPLETE_SPRITES.meleeMovement]: {
    columns: 4,
    rows: 6,
    rowByState: { idle: 0, run: 1, jump: 2, fall: 3, hit: 4, dead: 5 }
  },
  [SERJ_COMPLETE_SPRITES.meleeCombat]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 0, attack: 3, defense: 6, hit: 8, dead: 11 }
  },
  [SERJ_COMPLETE_SPRITES.nexusHud]: {
    columns: 5,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, hit: 4, dead: 4 }
  },
  [SERJ_COMPLETE_SPRITES.fps]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 6, hit: 7, dead: 8 }
  },
  [SERJ_COMPLETE_SPRITES.kart]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 2, attack: 5, defense: 3, hit: 6, dead: 6 }
  },
  [BUCKET_COMPLETE_SPRITES.rpg]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 11 }
  },
  [BUCKET_COMPLETE_SPRITES.tactics]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 11 }
  },
  [BUCKET_COMPLETE_SPRITES.meleeMovement]: {
    columns: 4,
    rows: 6,
    rowByState: { idle: 0, run: 1, jump: 2, fall: 3, hit: 4, dead: 5 }
  },
  [BUCKET_COMPLETE_SPRITES.meleeCombat]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 0, attack: 3, defense: 6, hit: 8, dead: 11 }
  },
  [BUCKET_COMPLETE_SPRITES.nexusHud]: {
    columns: 5,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, hit: 4, dead: 4 }
  },
  [BUCKET_COMPLETE_SPRITES.fps]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 6, hit: 7, dead: 8 }
  },
  [BUCKET_COMPLETE_SPRITES.kart]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 2, attack: 5, defense: 3, hit: 6, dead: 6 }
  },
  [ARTHUR_COMPLETE_SPRITES.rpg]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 4, defense: 6, hit: 7, dead: 11 }
  },
  [ARTHUR_COMPLETE_SPRITES.tactics]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 5, hit: 7, dead: 8 }
  },
  [ARTHUR_COMPLETE_SPRITES.meleeMovement]: {
    columns: 4,
    rows: 6,
    rowByState: { idle: 0, run: 1, jump: 2, fall: 3, hit: 4, dead: 5 }
  },
  [ARTHUR_COMPLETE_SPRITES.meleeCombat]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 0, attack: 2, defense: 5, hit: 7, dead: 8 }
  },
  [ARTHUR_COMPLETE_SPRITES.nexusHud]: {
    columns: 5,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 2, hit: 4, dead: 4 }
  },
  [ARTHUR_COMPLETE_SPRITES.fps]: {
    columns: 4,
    rows: 10,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 6, hit: 7, dead: 8 }
  },
  [ARTHUR_COMPLETE_SPRITES.kart]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 2, attack: 3, defense: 5, hit: 6, dead: 6 }
  },
  [HALO_COMPLETE_SPRITES.masterchief]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 4, hit: 6, dead: 7 }
  },
  [HALO_COMPLETE_SPRITES.arbiter]: {
    columns: 4,
    rows: 8,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 4, hit: 6, dead: 7 }
  },
  [HALO_COMPLETE_SPRITES.johnson]: {
    columns: 4,
    rows: 4,
    rowByState: { idle: 0, run: 1, attack: 2, defense: 0, hit: 3, dead: 3 }
  },
  [ROI_BURGONDE_BOSS_SPRITE]: {
    columns: 4,
    rows: 12,
    rowByState: { idle: 0, run: 1, attack: 3, defense: 7, hit: 9, dead: 11 }
  }
};

export const getHeroCompleteSpritePack = (hero) => {
  if (CORRECTED_HERO_SPRITE_VARIANTS[hero?.id]) return CORRECTED_HERO_SPRITE_VARIANTS[hero.id];
  if (hero?.id === 'arca_mirelle') return MIRELLE_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_bastion') return BASTION_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_nova') return NOVA_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_marrow') return MARROW_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_sable') return SABLE_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arca_loom') return LOOM_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'serj_tankian') return SERJ_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'bucket_guitar_echo') return BUCKET_COMPLETE_SPRITE_PACK;
  if (hero?.id === 'arthur_kaamelott') return ARTHUR_COMPLETE_SPRITE_PACK;
  if (HALO_COMPLETE_SPRITE_PACKS[hero?.id]) return HALO_COMPLETE_SPRITE_PACKS[hero.id];
  return null;
};

const getHaloSpriteForContext = (hero) => HALO_COMPLETE_SPRITES[hero?.id] || null;

const getBastionSpriteForContext = (hero) => (
  hero?.id === 'arca_bastion' ? BASTION_COMPLETE_SPRITES.universal : null
);

const getOcUniversalSpriteForContext = (hero) => {
  if (hero?.id === 'arca_nova') return NOVA_COMPLETE_SPRITES.universal;
  if (hero?.id === 'arca_marrow') return MARROW_COMPLETE_SPRITES.universal;
  if (hero?.id === 'arca_sable') return SABLE_COMPLETE_SPRITES.universal;
  if (hero?.id === 'arca_loom') return LOOM_COMPLETE_SPRITES.universal;
  return null;
};

const getMirelleSpriteForContext = (hero, context = 'auto') => {
  if (hero?.id !== 'arca_mirelle') return null;
  if (context === 'tactics') return MIRELLE_COMPLETE_SPRITES.tactics;
  if (context === 'melee') {
    return ['run', 'jump', 'fall'].includes(hero?.state)
      ? MIRELLE_COMPLETE_SPRITES.meleeMovement
      : MIRELLE_COMPLETE_SPRITES.meleeCombat;
  }
  if (context === 'nexus' || context === 'collection') return MIRELLE_COMPLETE_SPRITES.nexusCollection;
  if (context === 'hud') return MIRELLE_COMPLETE_SPRITES.hudAvatar;
  if (context === 'fps') return MIRELLE_COMPLETE_SPRITES.fpsHands;
  return MIRELLE_COMPLETE_SPRITES.rpg;
};

const getSerjSpriteForContext = (hero, context = 'auto') => {
  if (hero?.id !== 'serj_tankian') return null;
  if (context === 'tactics') return SERJ_COMPLETE_SPRITES.tactics;
  if (context === 'melee') {
    return ['run', 'jump', 'fall'].includes(hero?.state)
      ? SERJ_COMPLETE_SPRITES.meleeMovement
      : SERJ_COMPLETE_SPRITES.meleeCombat;
  }
  if (context === 'nexus' || context === 'collection' || context === 'hud') return SERJ_COMPLETE_SPRITES.nexusHud;
  if (context === 'fps') return SERJ_COMPLETE_SPRITES.fps;
  if (context === 'kart' || context === 'race') return SERJ_COMPLETE_SPRITES.kart;
  return SERJ_COMPLETE_SPRITES.rpg;
};

const getBucketSpriteForContext = (hero, context = 'auto') => {
  if (hero?.id !== 'bucket_guitar_echo') return null;
  if (context === 'tactics') return BUCKET_COMPLETE_SPRITES.tactics;
  if (context === 'melee') {
    return ['run', 'jump', 'fall'].includes(hero?.state)
      ? BUCKET_COMPLETE_SPRITES.meleeMovement
      : BUCKET_COMPLETE_SPRITES.meleeCombat;
  }
  if (context === 'nexus' || context === 'collection' || context === 'hud') return BUCKET_COMPLETE_SPRITES.nexusHud;
  if (context === 'fps') return BUCKET_COMPLETE_SPRITES.fps;
  if (context === 'kart' || context === 'race') return BUCKET_COMPLETE_SPRITES.kart;
  return BUCKET_COMPLETE_SPRITES.rpg;
};

const getArthurSpriteForContext = (hero, context = 'auto') => {
  if (hero?.id !== 'arthur_kaamelott') return null;
  if (context === 'tactics') return ARTHUR_COMPLETE_SPRITES.tactics;
  if (context === 'melee') {
    return ['run', 'jump', 'fall'].includes(hero?.state)
      ? ARTHUR_COMPLETE_SPRITES.meleeMovement
      : ARTHUR_COMPLETE_SPRITES.meleeCombat;
  }
  if (context === 'nexus' || context === 'collection' || context === 'hud') return ARTHUR_COMPLETE_SPRITES.nexusHud;
  if (context === 'fps') return ARTHUR_COMPLETE_SPRITES.fps;
  if (context === 'kart' || context === 'race') return ARTHUR_COMPLETE_SPRITES.kart;
  return ARTHUR_COMPLETE_SPRITES.rpg;
};

const LEGACY_MELEE_STATE_ALIASES = Object.freeze({
  attack: 'attackLight1',
  defense: 'shieldHold',
  hit: 'hitStun',
  jump: 'jumpRise'
});

const normalizeHeroMeleeState = state => (
  LEGACY_MELEE_STATE_ALIASES[state] || state || 'idle'
);

export const getHeroMeleeAnimationFrame = (hero, elapsedMs = 0) => {
  const manifest = getMeleeAnimationManifest(hero?.id);
  if (!manifest) return null;
  const state = normalizeHeroMeleeState(hero?.state);
  const frame = getMeleeAnimationFrame(manifest, state, elapsedMs);
  return frame ? { manifest, state, ...frame } : null;
};

export const getHeroMeleeSpriteSheetSrcs = heroOrId => (
  getMeleeAnimationSheetSources(heroOrId)
);

const getOriginalHeroSpriteSheetSrc = (hero, context = 'auto') => {
  if (!hero?.id) return '';
  const cloudMeadowSprite = getCloudMeadowSpriteSrc(hero);
  if (cloudMeadowSprite) return cloudMeadowSprite;
  if (Object.hasOwn(CORRECTED_CANON_HERO_SPRITES, hero.id)) return CORRECTED_CANON_HERO_SPRITES[hero.id];
  if (context === 'melee') {
    const meleeFrame = getHeroMeleeAnimationFrame(hero);
    if (meleeFrame?.animation?.sheet) return meleeFrame.animation.sheet;
  }
  const completeSprite = getMirelleSpriteForContext(hero, context);
  if (completeSprite) return completeSprite;
  const bastionSprite = getBastionSpriteForContext(hero);
  if (bastionSprite) return bastionSprite;
  const ocUniversalSprite = getOcUniversalSpriteForContext(hero);
  if (ocUniversalSprite) return ocUniversalSprite;
  const serjSprite = getSerjSpriteForContext(hero, context);
  if (serjSprite) return serjSprite;
  const bucketSprite = getBucketSpriteForContext(hero, context);
  if (bucketSprite) return bucketSprite;
  const arthurSprite = getArthurSpriteForContext(hero, context);
  if (arthurSprite) return arthurSprite;
  const haloSprite = getHaloSpriteForContext(hero, context);
  if (haloSprite) return haloSprite;
  return `/sprites/generated/heroes/${slugifyAsset(hero.universe)}/${slugifyAsset(hero.id)}.png`;
};

export const getHeroSpriteSheetSources = (hero, context = 'auto') => [...new Set([
  ...getDisciplineSpriteSources(hero),
  getOriginalHeroSpriteSheetSrc(hero, context)
].filter(Boolean))];

export const getHeroSpriteSheetSrc = (hero, context = 'auto') => (
  getHeroSpriteSheetSources(hero, context)[0] || ''
);

export const getEnemySpriteSheetSrc = (enemy) => {
  if (!enemy?.name) return '';
  if (enemy.spriteSource) return enemy.spriteSource;
  const universe = enemy.universe || enemy.sourceUniverse || 'unknown';
  return `/sprites/generated/bosses/${slugifyAsset(universe)}/${slugifyAsset(enemy.name)}.png`;
};

const ITEM_SPRITE_ALIASES = Object.freeze({
  evt_shaun_dont_stop_me: '/sprites/generated/items/shaun-of-the-dead/vinyl-record.png',
  evt_spawn_legion: '/sprites/generated/items/spawn/necroplasm-chain.png',
  evt_evil_dead_army: '/sprites/generated/items/evil-dead/boomstick.png',
  evt_panic_event_horde: '/sprites/generated/items/left-4-dead/rescue-radio.png'
});

export const getItemSpriteSrc = (item) => {
  if (!item?.id) return '';
  if (item.icon) return item.icon;
  if (ITEM_SPRITE_ALIASES[item.id]) return ITEM_SPRITE_ALIASES[item.id];
  const universe = item.universe || item.sourceUniverse || 'unknown';
  const itemId = item.sourceItemId || item.id;
  return `/sprites/generated/items/${slugifyAsset(universe)}/${slugifyAsset(itemId)}.png`;
};

const animationRowForState = (state) => {
  if (state === 'run') return 1;
  if (state === 'attack') return 2;
  if (state === 'hit' || state === 'dead') return 3;
  return 0;
};

const normalizeSpriteSrc = (src) => {
  const value = String(src || '');
  if (!value) return '';
  if (value.startsWith('/')) return value;
  try {
    return new URL(value).pathname;
  } catch {
    const spriteIndex = value.indexOf('/sprites/');
    return spriteIndex >= 0 ? value.slice(spriteIndex) : value;
  }
};

export const getSpriteSheetLayout = (src) => (
  getDisciplineSpriteLayout(src)
  || getCloudMeadowSpriteLayout(src)
  || getMeleeSheetLayout(src)
  || SPRITE_SHEET_LAYOUTS[normalizeSpriteSrc(src)]
  || {
    columns: SPRITE_SHEET_META.columns,
    rows: SPRITE_SHEET_META.rows.length,
    rowByState: null
  }
);

const animationRowForLayout = (state, layout) => {
  if (layout?.rowByState && Object.prototype.hasOwnProperty.call(layout.rowByState, state)) {
    return layout.rowByState[state];
  }
  if (layout?.rowByState && state === 'dead' && Object.prototype.hasOwnProperty.call(layout.rowByState, 'hit')) {
    return layout.rowByState.hit;
  }
  return animationRowForState(state);
};

export const getSpriteFrameForLayout = (state, animTime, layout) => {
  const row = Math.max(0, Math.min((layout?.rows || SPRITE_SHEET_META.rows.length) - 1, animationRowForLayout(state, layout)));
  return {
    row,
    col: Math.floor(animTime / 10) % (layout?.columns || SPRITE_SHEET_META.columns),
    trim: layout?.trimByState?.[state] || layout?.trimByRow?.[row] || layout?.trim || null
  };
};

export const getSpriteFrame = (state, animTime) => ({
  row: animationRowForState(state),
  col: Math.floor(animTime / 10) % SPRITE_SHEET_META.columns
});

export const buildSpritePrompt = ({ kind, name, universe, role, weapon, color, special }) => {
  const subject = kind === 'hero'
    ? `${name}, playable ${role || 'fighter'} from ${universe}`
    : `${name}, ${role || 'boss'} from ${universe}`;
  return [
    'Use case: stylized-concept',
    'Asset type: transparent game sprite sheet for a 2D canvas battle game',
    `Primary request: create a detailed pixel-art animation sheet for ${subject}.`,
    'Style/medium: highly detailed dark fantasy pixel art, close to the provided vendor reference: ornate edges, hand-painted pixel texture, strong silhouette, readable at small size.',
    'Composition/framing: 4 columns x 4 rows sprite sheet, equal cells, full body, three-quarter side battle angle facing right, centered in every cell.',
    'Animation rows: row 1 idle breathing, row 2 run/walk cycle, row 3 attack using the signature weapon or power, row 4 hit/recoil.',
    `Lore details: preserve iconic silhouette, outfit, colors, and equipment for ${name}; use ${weapon || 'signature weapon/power'}; special motif ${special || 'none'}.`,
    `Palette anchor: ${color || 'use lore-accurate colors'} with black outline and gold/purple micro-detail only where it fits the character.`,
    'Background: perfectly flat solid #00ff00 chroma key, no shadow, no floor, no text, no watermark.',
    'Constraints: one character only, no UI labels, no cropped body, no extra characters, consistent proportions across all 16 frames.'
  ].join('\n');
};
