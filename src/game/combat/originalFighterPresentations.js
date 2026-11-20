import { getHeroSpriteSheetSrc, getSpriteSheetLayout } from '../spriteAssets.js';

// Each sequence addresses the 16 existing poses of this body. Only the
// movement, timing and overlays belong to the duel presentation.
const pose = (at, state, frame, x = 0, y = 0, opacity = 1) => ({ at, state, frame, x, y, scale: 1, opacity });
const idle = (at, frame, x, y, opacity) => pose(at, 'idle', frame, x, y, opacity);
const run = (at, frame, x, y, opacity) => pose(at, 'run', frame, x, y, opacity);
const attack = (at, frame, x, y, opacity) => pose(at, 'attack', frame, x, y, opacity);
const hit = (at, frame, x, y, opacity) => pose(at, 'hit', frame, x, y, opacity);
const scene = (name, duration, beats, effectWindow = null) => ({ name, duration, beats, effectWindow });

const englishCaptions = {
  neris_vale: {
    intro: 'Surveying the abyssal chart', roundVictory: 'Neris confirms the survey',
    roundDefeat: 'Neris buckles under pressure', fatality: 'True Name',
    victory: 'The chart of names is safe', defeat: 'Neris falls to one knee',
    outro: 'Neris follows the return current'
  },
  kael_venn: {
    intro: 'Kael arrives between two seconds', roundVictory: 'Kael counts one more second',
    roundDefeat: 'A setback stops Kael', fatality: 'Full Refund',
    victory: 'Kael puts away his blades', defeat: 'Kael loses his final moment',
    outro: 'Kael makes off with the returned seconds'
  },
  eira_solenne: {
    intro: 'Eira tends the photosphere', roundVictory: 'The star seed lights up again',
    roundDefeat: 'Eira leans on her staff', fatality: 'Shared Light',
    victory: 'Eira protects the young star', defeat: 'The botanist holds on to her photosphere',
    outro: 'Eira brings the seed back to the garden'
  },
  nyra_vale: {
    intro: 'Nyra opens a Ghostline connection', roundVictory: 'Nyra locks down her connection',
    roundDefeat: 'Nyra loses the Ghostline signal', fatality: 'Accès Racine Nadir',
    victory: 'The memory keys are secure', defeat: 'Nyra stays down, her link cut',
    outro: 'Nyra disconnects and disappears'
  },
  thaleia_naxos: {
    intro: 'Thaleia follows the first thread', roundVictory: 'The passage is clear',
    roundDefeat: 'Thaleia drops to one knee', fatality: 'Path out of the Labyrinth',
    victory: 'Thaleia keeps the way open', defeat: 'Thaleia braces on one knee',
    outro: 'Thaleia follows the thread home'
  },
  rei_kagetsu: {
    intro: 'Rei reads the paper seals', roundVictory: 'Rei shelters the names',
    roundDefeat: 'Rei lowers the talisman', fatality: 'Calendar of a Hundred Spirits',
    victory: 'The spirits keep their names', defeat: 'Rei holds the last seal',
    outro: 'Rei gathers the scattered seals'
  },
  lin_yue: {
    intro: 'Lin reads the sky map', roundVictory: 'Lin corrects the decree',
    roundDefeat: 'Lin braces with the brush', fatality: 'Map of the Nine Heavens',
    victory: 'The stars return to their places', defeat: 'Lin shields the ink',
    outro: 'Lin rolls up the star chart'
  },
  seyra_tal: {
    intro: 'Seyra balances the masses', roundVictory: 'The lance reaches equilibrium',
    roundDefeat: 'Seyra absorbs the recoil', fatality: 'Resonance of the Five Peoples',
    victory: 'The five masses resonate', defeat: 'Seyra braces the lance',
    outro: 'Seyra gathers the orbiting masses'
  },
  eira_hrafnsdottir: {
    intro: 'Eira sets her shield', roundVictory: 'The shield line holds',
    roundDefeat: 'Eira leans into her shield', fatality: 'Last Line of Midgard',
    victory: 'Eira keeps watch', defeat: 'Eira lowers to the ground',
    outro: 'Eira leaves with her shield'
  },
  lyra_hexwind: {
    intro: 'Lyra measures the seven laws', roundVictory: 'Lyra closes the circuit',
    roundDefeat: 'Lyra braces on her focus', fatality: 'Seven Laws, One Exception',
    victory: 'The exception holds', defeat: 'Lyra holds on to her focus',
    outro: 'Lyra dismisses the circuit'
  },
  mercy_ash: {
    intro: 'Mercy checks the chain', roundVictory: 'A link gives way',
    roundDefeat: 'Mercy kneels under the chain', fatality: 'Amnesty of the Unbound',
    victory: 'The contract is broken', defeat: 'Mercy keeps hold of the chain',
    outro: 'Mercy walks away from the contract'
  },
  elise_varenne: {
    intro: 'Elise calibrates her instruments', roundVictory: 'Elise confirms the signal',
    roundDefeat: 'Elise catches her breath', fatality: 'Four Capitals, One Signal',
    victory: 'All four replies are received', defeat: 'Elise steadies her breathing',
    outro: 'Elise disconnects from the signal'
  }
};

function archivePhases({ names, entrance, strike, departure, lowPose, finale }) {
  const [intro, roundVictory, roundDefeat, fatality, victory, defeat, outro] = names;
  return {
    intro: scene(intro, entrance, [run(0, 0, -54), run(.18, 1, -36), run(.36, 2, -18),
      idle(.54, 0), idle(.76, 1), idle(1, 2)], [.48, .94]),
    roundVictory: scene(roundVictory, 1.25, [idle(0, 2), idle(.42, 1), idle(1, 0)], [.18, .86]),
    roundDefeat: scene(roundDefeat, 1.25, [hit(0, 0), hit(.41, lowPose, -9), hit(1, lowPose, -9)]),
    fatality: scene(fatality, strike, finale, [.26, .91]),
    victory: scene(victory, 1.8, [idle(0, 2), idle(.28, 1), idle(.64, 3), idle(1, 0)], [.21, .9]),
    defeat: scene(defeat, 1.8, [hit(0, 0), hit(.46, lowPose, -13), hit(1, lowPose, -13)]),
    outro: scene(outro, departure, [idle(0, 0), idle(.2, 1), run(.38, 0, -7), run(.53, 1, -39),
      run(.68, 2, -72), run(.84, 3, -100, 0, .62), run(1, 0, -130, 0, .16)])
  };
}

const presentations = {
  neris_vale: {
    universe: 'Thalassa Mnémique', weapon: 'mnemonic_sonar', pack: 'oc-dlc-drowned-dawn',
    sheet: '/sprites/generated/heroes/thalassa-mnemique/neris-vale.png', footAnchor: 244,
    sourceReference: 'DLC/ThalassaMnemique/data/ocDlcPacks.js — cartographe abyssale, harpon mnémique et Nom véritable.',
    effect: 'mnemonic-sonar',
    phases: {
      intro: scene('Relevé de la carte abyssale', 1.8, [run(0, 0, -42), run(.18, 1, -29), run(.36, 2, -16), idle(.57, 0), idle(.8, 2), idle(1, 3)], [.48, .94]),
      roundVictory: scene('Neris confirme le relevé', 1.25, [idle(0, 2), idle(.45, 1), idle(1, 0)], [.22, .9]),
      roundDefeat: scene('Neris plie sous la pression', 1.25, [hit(0, 0), hit(.26, 1, -7), hit(.57, 2, -12), hit(1, 2, -12)]),
      fatality: scene('Nom véritable', 2.4, [idle(0, 3), attack(.25, 0), attack(.43, 1, 3), attack(.58, 2, 5), attack(.72, 3, 5), idle(.92, 1), idle(1, 0)], [.37, .92]),
      victory: scene('La carte des noms est préservée', 1.8, [idle(0, 3), idle(.32, 2), idle(.64, 1), idle(1, 0)], [.27, .88]),
      defeat: scene('Neris retombe à genou', 1.8, [hit(0, 0), hit(.23, 1, -8), hit(.47, 2, -15), hit(1, 2, -15)]),
      outro: scene('Neris suit le courant de retour', 2.0, [idle(0, 0), idle(.23, 1), run(.4, 0, -4), run(.55, 1, -32), run(.7, 2, -62), run(.85, 3, -92, 0, .6), run(1, 0, -115, 0, .16)])
    }
  },
  kael_venn: {
    universe: 'Méridien Creux', weapon: 'minute_blades', pack: 'oc-dlc-borrowed-hours',
    sheet: '/sprites/generated/heroes/meridien-creux/kael-venn.png', footAnchor: 244,
    sourceReference: 'DLC/MeridienCreux/data/ocDlcPacks.js — contrebandier de minutes, deux lames et Remboursement total.',
    effect: 'refunded-seconds',
    phases: {
      intro: scene('Kael arrive entre deux secondes', 1.55, [run(0, 0, -82), run(.14, 1, -62), run(.24, 2, -43), run(.34, 3, -17), idle(.44, 0), idle(.72, 2), idle(1, 1)], [.29, .71]),
      roundVictory: scene('Kael compte une seconde de plus', 1.2, [idle(0, 1), idle(.46, 2), idle(1, 0)], [.16, .78]),
      roundDefeat: scene('Le contretemps arrête Kael', 1.2, [hit(0, 0), hit(.23, 1, -9), hit(.53, 2, -14), hit(1, 2, -14)]),
      fatality: scene('Remboursement total', 2.3, [idle(0, 2), run(.2, 0, -14), attack(.34, 0, 8), attack(.46, 1, 28), attack(.57, 2, 52), attack(.7, 3, 66), idle(.85, 2, 63), idle(1, 0, 63)], [.25, .86]),
      victory: scene('Kael range ses deux lames', 1.65, [idle(0, 3, 6), idle(.25, 2, 2), idle(.52, 1), idle(1, 0)], [.12, .7]),
      defeat: scene('Kael perd son dernier instant', 1.65, [hit(0, 0), hit(.22, 1, -16), hit(.42, 2, -21), hit(1, 2, -21)]),
      outro: scene('Kael file avec les secondes rendues', 1.65, [idle(0, 1), idle(.2, 3), run(.37, 0, -14), run(.48, 1, -44), run(.59, 2, -78), run(.77, 3, -121, 0, .65), run(1, 0, -154, 0, .1)])
    }
  },
  eira_solenne: {
    universe: 'Viridienne Ultime', weapon: 'photosphere_staff', pack: 'oc-dlc-star-garden',
    sheet: '/sprites/generated/heroes/viridienne-ultime/eira-solenne.png', footAnchor: 244,
    sourceReference: 'DLC/ViridienneUltime/data/ocDlcPacks.js — botaniste stellaire, bâton photosphérique et Lumière partagée.',
    effect: 'shared-photosphere',
    phases: {
      intro: scene('Eira veille sur la photosphère', 1.95, [run(0, 0, -35), run(.19, 1, -26), run(.39, 2, -17), idle(.58, 0), idle(.79, 1), idle(1, 2)], [.5, .98]),
      roundVictory: scene('La graine stellaire reprend lumière', 1.35, [idle(0, 1), idle(.42, 3), idle(1, 0)], [.18, .91]),
      roundDefeat: scene('Eira s’appuie sur son bâton', 1.35, [hit(0, 0), hit(.22, 1, -4), hit(.55, 2, -6), hit(1, 2, -6)]),
      fatality: scene('Lumière partagée', 2.55, [idle(0, 0), attack(.22, 0), attack(.38, 1), attack(.56, 2), attack(.76, 3), idle(.92, 3), idle(1, 0)], [.23, .96]),
      victory: scene('Eira protège la jeune étoile', 1.95, [idle(0, 2), idle(.31, 3), idle(.7, 1), idle(1, 0)], [.2, .95]),
      defeat: scene('La botaniste retient sa photosphère', 1.95, [hit(0, 0), hit(.28, 1, -5), hit(.52, 2, -9), hit(1, 2, -9)]),
      outro: scene('Eira ramène la graine au jardin', 2.1, [idle(0, 0), idle(.23, 2), run(.43, 0, -8), run(.62, 1, -39), run(.77, 2, -72), run(.9, 3, -97, 0, .67), run(1, 0, -112, 0, .22)])
    }
  },
  nyra_vale: {
    universe: 'Neon Requiem', weapon: 'cyberdeck', sourceType: 'original',
    sheet: '/sprites/generated/heroes/neon-requiem/nyra-vale-v2-fidelity-wave4-2026-10-20.png', footAnchor: 240,
    sourceReference: 'src/game/originalUniversesManifest.json — Ghostline, cyberdeck et Accès Racine Nadir.',
    effect: 'nadir-lattice',
    phases: {
      intro: scene('Nyra ouvre une liaison Ghostline', 1.65, [run(0, 0, -57), run(.21, 1, -34), run(.4, 2, -12), idle(.53, 1), idle(.72, 3), idle(1, 0)], [.48, .9]),
      roundVictory: scene('Nyra verrouille sa liaison', 1.25, [idle(0, 3), idle(.48, 1), idle(1, 0)], [.08, .74]),
      roundDefeat: scene('Nyra perd la ligne Ghostline', 1.25, [hit(0, 0), hit(.33, 1, -4), hit(.61, 2, -9), hit(1, 2, -9)]),
      fatality: scene('Accès Racine Nadir', 2.35, [idle(0, 1), attack(.19, 0), attack(.37, 1, 4), attack(.55, 2, 10), attack(.7, 3, 10), idle(.91, 3), idle(1, 0)], [.18, .94]),
      victory: scene('Les clés mémorielles sont sécurisées', 1.75, [idle(0, 3), idle(.37, 2), idle(.69, 1), idle(1, 0)], [.11, .87]),
      defeat: scene('Nyra reste au sol, liaison coupée', 1.75, [hit(0, 0), hit(.29, 1, -7), hit(.51, 2, -14), hit(1, 2, -14)]),
      outro: scene('Nyra coupe sa liaison et disparaît', 1.8, [idle(0, 3), idle(.22, 1), run(.39, 0, -6), run(.56, 1, -42), run(.73, 2, -80, 0, .76), run(.86, 3, -108, 0, .44), run(1, 0, -131, 0, .12)])
    }
  },
  thaleia_naxos: {
    universe: 'Aegea: War of the Moirai', weapon: 'xiphos', sourceType: 'original',
    sheet: '/sprites/generated/heroes/aegea-war-of-the-moirai/thaleia-naxos-v2-fidelity-wave10-2026-10-25.png', footAnchor: 242,
    sourceReference: 'src/game/originalUniversesManifest.json — navigatrice au xiphos et Chemin hors du Labyrinthe.',
    effect: 'labyrinth-thread',
    phases: archivePhases({
      names: ['Thaleia suit le premier fil', 'Le passage est dégagé', 'Thaleia pose un genou',
        'Chemin hors du Labyrinthe', 'Thaleia garde le chemin ouvert', 'Thaleia reste à genou', 'Thaleia reprend le fil du retour'],
      entrance: 1.65, strike: 2.25, departure: 1.75, lowPose: 1,
      finale: [idle(0, 0), attack(.21, 0), attack(.38, 1, 13), attack(.55, 2, 24),
        attack(.72, 3, 28), idle(.9, 2, 24), idle(1, 0, 24)]
    })
  },
  rei_kagetsu: {
    universe: 'Yomi no Kage', weapon: 'ofuda', sourceType: 'original',
    sheet: '/sprites/generated/heroes/yomi-no-kage/rei-kagetsu-v2-fidelity-wave10-2026-10-25.png', footAnchor: 242,
    sourceReference: 'src/game/originalUniversesManifest.json — enquête par ofuda et Calendrier des Cent Esprits.',
    effect: 'ofuda-calendar',
    phases: archivePhases({
      names: ['Rei lit les sceaux de papier', 'Rei met les noms à l’abri', 'Rei abaisse le talisman',
        'Calendrier des Cent Esprits', 'Les esprits gardent leurs noms', 'Rei retient le dernier sceau', 'Rei rassemble les sceaux dispersés'],
      entrance: 1.8, strike: 2.45, departure: 1.9, lowPose: 1,
      finale: [idle(0, 1), attack(.24, 0), attack(.42, 1), attack(.59, 2),
        attack(.76, 3), idle(.92, 2), idle(1, 0)]
    })
  },
  lin_yue: {
    universe: 'Mandate of Nine Heavens', weapon: 'talisman_brush', sourceType: 'original',
    sheet: '/sprites/generated/heroes/mandate-of-nine-heavens/lin-yue-v2-fidelity-wave9-2026-10-25.png', footAnchor: 242,
    sourceReference: 'src/game/originalUniversesManifest.json — Bureau des Constellations, pinceau et Carte des Neuf Cieux.',
    effect: 'nine-heavens-chart',
    phases: archivePhases({
      names: ['Lin relève le ciel', 'Lin corrige le décret', 'Lin prend appui sur le pinceau',
        'Carte des Neuf Cieux', 'Les astres reprennent leur place', 'Lin protège son encre', 'Lin roule la carte céleste'],
      entrance: 1.95, strike: 2.5, departure: 2.05, lowPose: 2,
      finale: [idle(0, 0), attack(.17, 0), attack(.32, 1, 2), attack(.51, 2, 4),
        attack(.73, 3), idle(.92, 1), idle(1, 0)]
    })
  },
  seyra_tal: {
    universe: 'Ilyr Concordat', weapon: 'gravity_lance', sourceType: 'original',
    sheet: '/sprites/generated/heroes/ilyr-concordat/seyra-tal-v2-fidelity-wave7-2026-10-23.png', footAnchor: 242,
    sourceReference: 'src/game/originalUniversesManifest.json — Auralith, lance gravitationnelle et Résonance des Cinq Peuples.',
    effect: 'five-mass-concordance',
    phases: archivePhases({
      names: ['Seyra équilibre les masses', 'La lance retrouve son équilibre', 'Seyra absorbe le recul',
        'Résonance des Cinq Peuples', 'Les cinq masses résonnent', 'Seyra retient sa lance', 'Seyra rassemble les masses en orbite'],
      entrance: 1.7, strike: 2.35, departure: 1.85, lowPose: 1,
      finale: [idle(0, 1), attack(.2, 0), attack(.38, 1, 8), attack(.56, 2, 11),
        attack(.77, 3, 5), idle(.91, 1), idle(1, 0)]
    })
  },
  eira_hrafnsdottir: {
    universe: 'Nine Realms: Last Twilight', weapon: 'axe', sourceType: 'original',
    sheet: '/sprites/generated/heroes/nine-realms-last-twilight/eira-hrafnsdottir-v2-fidelity-wave9-2026-10-25.png', footAnchor: 243,
    sourceReference: 'src/game/originalUniversesManifest.json — hache, bouclier et Dernière Ligne de Midgard.',
    effect: 'midgard-shield-line',
    phases: archivePhases({
      names: ['Eira place son bouclier', 'La ligne de boucliers tient', 'Eira prend appui sur son bouclier',
        'Dernière Ligne de Midgard', 'Eira monte la garde', 'Eira met genou à terre', 'Eira repart avec son bouclier'],
      entrance: 1.8, strike: 2.3, departure: 1.95, lowPose: 1,
      finale: [idle(0, 0), attack(.18, 0), attack(.39, 1), attack(.58, 2, 12),
        attack(.78, 3, 20), idle(.91, 1, 16), idle(1, 0, 16)]
    })
  },
  lyra_hexwind: {
    universe: 'Aetherion: Seven Laws of Magic', weapon: 'spell_focus', sourceType: 'original',
    sheet: '/sprites/generated/heroes/aetherion-seven-laws-of-magic/lyra-hexwind-v2-fidelity-wave6-2026-10-23.png', footAnchor: 239,
    sourceReference: 'src/game/originalUniversesManifest.json — catalyseur de sort et Sept Lois, Une Exception.',
    effect: 'seven-laws-circuit',
    phases: archivePhases({
      names: ['Lyra mesure les sept lois', 'Lyra referme le circuit', 'Lyra s’appuie sur son catalyseur',
        'Sept Lois, Une Exception', 'L’exception tient', 'Lyra retient son catalyseur', 'Lyra dissipe le circuit'],
      entrance: 1.9, strike: 2.5, departure: 2.05, lowPose: 1,
      finale: [idle(0, 3), attack(.21, 0), attack(.42, 1), attack(.6, 2),
        attack(.76, 3), idle(.91, 3), idle(1, 0)]
    })
  },
  mercy_ash: {
    universe: 'Infernum: Nine Pits', weapon: 'chain_sickle', sourceType: 'original',
    sheet: '/sprites/generated/heroes/infernum-nine-pits/mercy-ash-v2-fidelity-wave6-2026-10-23.png', footAnchor: 241,
    sourceReference: 'src/game/originalUniversesManifest.json — faucille à chaîne et Amnistie des Sans-Contrat.',
    effect: 'amnesty-chain',
    phases: archivePhases({
      names: ['Mercy vérifie la chaîne', 'Un maillon cède', 'Mercy ploie sous la chaîne',
        'Amnistie des Sans-Contrat', 'Le contrat est rompu', 'Mercy retient la chaîne', 'Mercy laisse le contrat derrière elle'],
      entrance: 1.75, strike: 2.45, departure: 1.85, lowPose: 2,
      finale: [idle(0, 1), attack(.22, 0), attack(.4, 1, 5), attack(.61, 2, 16),
        attack(.79, 3, 14), idle(.92, 1, 10), idle(1, 0, 10)]
    })
  },
  elise_varenne: {
    universe: 'Aevum Fracture', weapon: 'chronal_pistol', sourceType: 'original',
    sheet: '/sprites/generated/heroes/aevum-fracture/elise-varenne.png', footAnchor: 244,
    sourceReference: 'src/game/originalUniversesManifest.json — instrumentation temporelle et Quatre Capitales, Un Signal.',
    effect: 'four-capitals-signal',
    phases: archivePhases({
      names: ['Élise règle ses instruments', 'Élise confirme le signal', 'Élise reprend son souffle',
        'Quatre Capitales, Un Signal', 'Les quatre réponses sont reçues', 'Élise stabilise sa respiration', 'Élise coupe le signal'],
      entrance: 1.7, strike: 2.35, departure: 1.9, lowPose: 2,
      finale: [idle(0, 1), attack(.21, 0), attack(.39, 1), attack(.56, 2),
        attack(.76, 3), idle(.9, 1), idle(1, 0)]
    })
  }
};

export function resolveOriginalFighterPresentation(actor, phase) {
  const record = Object.hasOwn(presentations, actor?.id) ? presentations[actor.id] : null;
  if (!record || actor.originalContent !== true || actor.universe !== record.universe || actor.weaponType !== record.weapon) return null;
  if ([actor.sourceHeroId, actor.sourceId].some(id => id != null && id !== actor.id)) return null;
  if (record.pack ? actor.contentPackId !== record.pack || actor.contentOrigin !== 'oc' : actor.sourceType !== record.sourceType) return null;
  const clip = Object.hasOwn(record.phases, phase) ? record.phases[phase] : null;
  if (!clip) return null;
  // An equipped skin, a future native sheet or another layout must keep its
  // own pose selection. The indices below were inspected on these four files.
  const layout = getSpriteSheetLayout(record.sheet);
  if (layout.columns !== 4 || layout.rows !== 4 || layout.rowByState || layout.trim ||
      clip.beats.some(({ state }) => getHeroSpriteSheetSrc({ ...actor, state }, 'melee') !== record.sheet)) return null;
  const [startsAt, endsAt] = clip.effectWindow || [0, 1];
  return {
    id: `${actor.id}:${phase}:original-duel`, heroId: actor.id, universe: actor.universe,
    phase, name: clip.name, sourceAction: clip.name, sourceReference: record.sourceReference,
    nameLocalized: { fr: clip.name, en: englishCaptions[actor.id][phase] },
    sourceAsset: { sheet: record.sheet, footAnchor: record.footAnchor },
    duration: clip.duration, beats: clip.beats.map(beat => ({ ...beat })),
    effect: { kind: clip.effectWindow ? record.effect : 'none', startsAt, endsAt },
    missingAssets: ['Dedicated phase drawings remain open. This scene reuses the ordinary body atlas.'],
    provenance: { kind: 'original-duel-presentation', canonicalSequence: false, dedicatedPhaseArtwork: false,
      visualFidelity: 'existing-original-body-and-duel-choreography' },
    actor: { ...actor }
  };
}

const stroke = (ctx, points) => {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.stroke();
};

const paintMotif = {
  'mnemonic-sonar'(ctx, p, size) {
    ctx.strokeStyle = '#78f0e2';
    for (let index = 0; index < 3; index++) {
      const span = size * (24 + index * 16 + p * 46);
      ctx.beginPath();
      ctx.ellipse(18 * size, 0, span, span * .52, -.27, -.9, .85);
      ctx.stroke();
    }
    ctx.strokeStyle = '#e9c592';
    stroke(ctx, [[-16 * size, 8], [28 * size, -21], [82 * size, -15]]);
    ctx.strokeRect(28 * size - 3, -24, 6, 6);
  },
  'refunded-seconds'(ctx, p, size) {
    ctx.strokeStyle = '#ffc573';
    for (let index = 0; index < 9; index++) {
      const angle = index * Math.PI / 6 - Math.PI * (1 + p);
      const [x, y] = [Math.cos(angle), Math.sin(angle)];
      stroke(ctx, [[x * 57 * size, y * 57 * size], [x * 68 * size, y * 68 * size]]);
    }
    ctx.beginPath();
    ctx.arc(0, 0, 59 * size, -2.7 - p, .35 - p);
    ctx.stroke();
    stroke(ctx, [[0, 0], [Math.cos(p * 5) * 46 * size, Math.sin(p * 5) * 46 * size]]);
  },
  'shared-photosphere'(ctx, p, size) {
    ctx.strokeStyle = '#b1e2a0';
    ctx.fillStyle = '#ffe487';
    const reach = (19 + 30 * p) * size;
    for (let petal = 0; petal < 5; petal++) {
      const angle = petal * Math.PI * 2 / 5 + p * .5;
      ctx.beginPath();
      ctx.ellipse(Math.cos(angle) * reach * .72, Math.sin(angle) * reach * .72,
        reach * .55, reach * .24, angle, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(0, 0, (5 + p * 8) * size, 0, Math.PI * 2);
    ctx.fill();
  },
  'nadir-lattice'(ctx, p, size) {
    const step = (24 + p * 19) * size;
    for (let row = 0; row < 3; row++) {
      const top = (row - 1) * step * .67;
      ctx.strokeStyle = row % 2 ? '#ff57db' : '#6af7e8';
      stroke(ctx, [[-step, top], [-step * .5, top], [-step * .19, top - step * .25],
        [step * .57, top - step * .25], [step, top - step * .55]]);
      ctx.strokeRect(step - 2, top - step * .55 - 2, 4, 4);
    }
  },
  'labyrinth-thread'(ctx, p, size) {
    const edge = (26 + 18 * p) * size;
    ctx.strokeStyle = '#b9d6fd';
    ctx.strokeRect(-edge, -edge, edge * 2, edge * 2);
    ctx.strokeStyle = '#ffc979';
    stroke(ctx, [[-edge, edge * .55], [-edge * .3, edge * .55], [-edge * .3, -edge * .5],
      [edge * .42, -edge * .5], [edge * .42, edge * .22], [edge * (1 + p * .65), edge * .22]]);
  },
  'ofuda-calendar'(ctx, p, size) {
    ctx.strokeStyle = '#91f0e6';
    for (let index = 0; index < 6; index++) {
      const angle = index * Math.PI / 3 + p * .46;
      const x = Math.cos(angle) * (30 + p * 18) * size;
      const y = Math.sin(angle) * (20 + p * 14) * size;
      ctx.strokeRect(x - 4 * size, y - 8 * size, 8 * size, 16 * size);
      stroke(ctx, [[x, y - 4 * size], [x, y + 4 * size]]);
    }
  },
  'nine-heavens-chart'(ctx, p, size) {
    const axis = (12 + p * 21) * size;
    ctx.strokeStyle = '#f4ce84';
    stroke(ctx, [[-axis, -axis], [axis, -axis], [axis, 0], [-axis, 0], [-axis, axis], [axis, axis]]);
    ctx.fillStyle = '#8bf2ff';
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) ctx.fillRect(x * axis - 2, y * axis - 2, 4, 4);
    }
  },
  'five-mass-concordance'(ctx, p, size) {
    const reach = (22 + p * 33) * size;
    ctx.strokeStyle = '#9fbcff';
    ctx.beginPath();
    ctx.ellipse(0, 0, reach, reach * .5, -.4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#b1f5ff';
    for (let index = 0; index < 5; index++) {
      const angle = index * Math.PI * 2 / 5 + p * 1.2;
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * reach, Math.sin(angle) * reach * .45, (2.5 + index * .45) * size, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  'midgard-shield-line'(ctx, p, size) {
    ctx.strokeStyle = '#b5d8f3';
    for (let index = 0; index < 3; index++) {
      const x = (index - 1) * (25 + p * 9) * size;
      const width = (12 + p * 5) * size;
      const height = (24 + p * 11) * size;
      stroke(ctx, [[x - width, -height / 2], [x + width, -height / 2],
        [x + width, height * .2], [x, height * .52], [x - width, height * .2], [x - width, -height / 2]]);
    }
  },
  'seven-laws-circuit'(ctx, p, size) {
    ctx.strokeStyle = '#d8b0ff';
    for (let index = 0; index < 7; index++) {
      const angle = index * Math.PI * 2 / 7 + p;
      const length = (17 + p * 18) * size;
      ctx.beginPath();
      ctx.arc(0, 0, length + (index === 6 ? 7 * size : 0), angle, angle + .54);
      ctx.stroke();
    }
  },
  'amnesty-chain'(ctx, p, size) {
    ctx.strokeStyle = '#ffc378';
    for (let index = 0; index < 5; index++) {
      const x = (index - 2) * (15 + p * 6) * size;
      const separation = Math.sign(x) * (p > .45 ? (p - .45) * 24 : 0) * size;
      ctx.beginPath();
      ctx.ellipse(x + separation, Math.sin(p * 4 + index) * 6 * size, 9 * size, 5 * size,
        index % 2 ? .55 : -.4, 0, index === 2 ? Math.PI * 1.5 : Math.PI * 2);
      ctx.stroke();
    }
  },
  'four-capitals-signal'(ctx, p, size) {
    ctx.strokeStyle = '#a5e7f8';
    const distance = (21 + p * 25) * size;
    for (const [x, y] of [[-distance, 0], [0, -distance * .7], [distance, 0], [0, distance * .7]]) {
      stroke(ctx, [[0, 0], [x * .6, y * .6], [x, y]]);
      ctx.strokeRect(x - 3, y - 3, 6, 6);
    }
    ctx.strokeRect(-4, -4, 8, 8);
  }
};

export function drawOriginalFighterPresentationEffect(ctx, sample, { x, feetY, facing, phase, reducedMotion }) {
  if (!Object.hasOwn(paintMotif, sample.effect.kind)) return false;
  if (reducedMotion || !sample.effect.active) return true;
  const progress = sample.effect.progress;
  const final = phase === 'fatality';
  ctx.save();
  ctx.translate(x + facing * (final ? 58 : 37), feetY - (final ? 108 : 88));
  ctx.scale(facing, 1);
  ctx.globalAlpha *= Math.sin(progress * Math.PI) * (final ? .78 : .47);
  ctx.lineWidth = final ? 2.5 : 1.5;
  paintMotif[sample.effect.kind](ctx, progress, final ? 1 : .65);
  ctx.restore();
  return true;
}
