import { getHeroSpriteSheetSrc, getSpriteSheetLayout } from '../spriteAssets.js';

// Each sequence addresses the 16 existing poses of this body. Only the
// movement, timing and overlays belong to the duel presentation.
const pose = (at, state, frame, x = 0, y = 0, opacity = 1) => ({ at, state, frame, x, y, scale: 1, opacity });
const idle = (at, frame, x, y, opacity) => pose(at, 'idle', frame, x, y, opacity);
const run = (at, frame, x, y, opacity) => pose(at, 'run', frame, x, y, opacity);
const attack = (at, frame, x, y, opacity) => pose(at, 'attack', frame, x, y, opacity);
const hit = (at, frame, x, y, opacity) => pose(at, 'hit', frame, x, y, opacity);
const scene = (name, duration, beats, effectWindow = null) => ({ name, duration, beats, effectWindow });

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
