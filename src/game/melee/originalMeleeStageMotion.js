const TAU = Math.PI * 2;

const line = (ctx, points) => {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.stroke();
};

const ellipse = (ctx, x, y, rx, ry, fill = false) => {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
  if (fill) ctx.fill();
  else ctx.stroke();
};

function airshipSilhouettes(ctx, width, height, phase) {
  for (let index = 0; index < 3; index++) {
    const center = (index % 2 ? .8 : .17 + index * .24) * width;
    const x = center + Math.sin(phase + index * 1.8) * width * .034;
    const y = height * (.19 + index * .064);
    const span = width * (.068 - index * .009);
    ctx.globalAlpha = .16 + index * .025;
    ellipse(ctx, x, y, span, height * .027, true);
    ctx.globalAlpha = .28;
    line(ctx, [[x - span * .55, y + height * .01], [x - span * .28, y + height * .044],
      [x + span * .3, y + height * .044], [x + span * .58, y + height * .006]]);
    ellipse(ctx, x, y + height * .045, span * .35, height * .008, true);
  }
}

function remoteClockfaces(ctx, width, height, phase) {
  const radius = Math.min(width * .073, height * .09);
  for (const [index, u] of [.19, .54, .83].entries()) {
    const x = width * u, y = height * (.215 + index % 2 * .074);
    ctx.globalAlpha = .16;
    ellipse(ctx, x, y, radius, radius);
    ellipse(ctx, x, y, radius * .82, radius * .82);
    for (let mark = 0; mark < 12; mark++) {
      const angle = mark * TAU / 12;
      const dx = Math.sin(angle) * radius, dy = Math.cos(angle) * radius;
      line(ctx, [[x + dx * .71, y - dy * .71], [x + dx * .81, y - dy * .81]]);
    }
    ctx.globalAlpha = .35;
    const angle = phase * (index === 1 ? -1 : 1) + index * 1.1;
    line(ctx, [[x, y], [x + Math.sin(angle) * radius * .72, y - Math.cos(angle) * radius * .72]]);
    line(ctx, [[x, y], [x + Math.sin(index + .75) * radius * .53, y - Math.cos(index + .75) * radius * .53]]);
  }
}

function distantWindsocks(ctx, width, height, phase) {
  for (const [index, u] of [.12, .86].entries()) {
    const x = width * u, y = height * (.2 + index * .045);
    const span = width * .076;
    ctx.globalAlpha = .22;
    line(ctx, [[x, y + height * .15], [x, y], [x + width * .01, y + height * .004]]);
    for (let stripe = 0; stripe < 5; stripe++) {
      const from = stripe / 5, to = (stripe + 1) / 5;
      const flutter = u => Math.sin(phase * 2 + index + u * 6) * height * .017 * u;
      const xf = x + span * from, xt = x + span * to;
      const yf = y + flutter(from), yt = y + flutter(to);
      ctx.globalAlpha = stripe % 2 ? .18 : .33;
      ctx.beginPath();
      ctx.moveTo(xf, yf);
      ctx.lineTo(xt, yt);
      ctx.lineTo(xt, yt + height * (.027 - to * .018));
      ctx.lineTo(xf, yf + height * (.027 - from * .018));
      ctx.closePath();
      ctx.fill();
    }
  }
}

function expositionOrbits(ctx, width, height, phase) {
  for (const [index, u] of [.2, .53, .84].entries()) {
    const x = width * u, y = height * (.22 + index % 2 * .08);
    const radius = Math.min(width * .054, height * .082);
    ctx.globalAlpha = .2;
    ellipse(ctx, x, y, radius * 1.36, radius);
    ellipse(ctx, x, y, radius, radius * .4);
    ellipse(ctx, x, y, radius * .4, radius);
    ctx.globalAlpha = .34;
    const step = phase + index * 1.3;
    ellipse(ctx, x + Math.cos(step) * radius, y + Math.sin(step) * radius * .4, radius * .08, radius * .08, true);
    line(ctx, [[x - radius * 1.15, y + radius * 1.2], [x + radius * 1.2, y + radius * 1.2]]);
  }
}

function shorelessReflections(ctx, width, height, phase) {
  for (let index = 0; index < 5; index++) {
    const x = width * (.09 + index * .2);
    const y = height * (.37 + index % 2 * .042);
    const crest = Math.sin(phase + index * .75);
    ctx.globalAlpha = .12 + (crest + 1) * .07;
    line(ctx, [[x - width * .06, y], [x - width * .026, y - height * (.036 + crest * .01)],
      [x + width * .005, y - height * (.056 + crest * .023)], [x + width * .055, y]]);
    for (let ripple = 0; ripple < 3; ripple++) {
      ctx.globalAlpha = .09 - ripple * .022;
      ellipse(ctx, x - width * crest * .011, y + height * (.009 + ripple * .017),
        width * (.027 + ripple * .009), height * .0038);
    }
  }
}

function riggingLanterns(ctx, width, height, phase) {
  for (const [index, u] of [.09, .26, .73, .91].entries()) {
    const origin = width * u, top = height * (.083 + index % 2 * .04);
    const y = top + height * (.1 + index % 3 * .04);
    const x = origin + Math.sin(phase + index * 1.3) * width * .011;
    const half = width * .008;
    ctx.globalAlpha = .24;
    line(ctx, [[origin, top], [x, y]]);
    line(ctx, [[x - half, y + height * .008], [x, y],
      [x + half, y + height * .008], [x + half, y + height * .032],
      [x - half, y + height * .032], [x - half, y + height * .008]]);
    ctx.globalAlpha = .19;
    ellipse(ctx, x, y + height * .02, half * .7, height * .011, true);
  }
}

function harbourBackwash(ctx, width, height, phase) {
  for (let index = 0; index < 6; index++) {
    const x = width * (.044 + index * .177);
    const y = height * (.36 + index % 3 * .041);
    const time = phase + index * 1.25;
    ctx.globalAlpha = .12;
    const points = Array.from({ length: 10 }, (_, step) => [x + width * step * .012,
      y + Math.sin(time + step * .65) * height * .008]);
    line(ctx, points);
    ctx.globalAlpha = .06 + (Math.sin(time) + 1) * .025;
    ellipse(ctx, x + width * .048, y - height * .045, width * .06, height * .013, true);
  }
}

function peakCloudbanks(ctx, width, height, phase) {
  for (let index = 0; index < 5; index++) {
    const x = width * (.07 + index * .19 + Math.sin(phase + index * .65) * .047);
    const y = height * (.185 + index % 3 * .072);
    for (let bank = 0; bank < 3; bank++) {
      ctx.globalAlpha = .09 + bank * .018;
      ellipse(ctx, x + width * bank * .028, y + Math.sin(bank * 1.6 + phase) * height * .016,
        width * (.044 + bank * .014), height * (.011 + bank * .004), true);
    }
  }
}

const motion = (universe, effect, color, periodSeconds, description, draw) =>
  Object.freeze({ universe, effect, color, periodSeconds, description, draw });

const stageMotions = Object.freeze({
  aether_coppermarket: motion('The Aether Crown', 'coppermarket-airships', '#9bb2bd', 19,
    'Silhouettes de dirigeables qui dérivent derrière le pont suspendu.', airshipSilhouettes),
  meridian_thousand_dials: motion('Meridian Clockwork', 'meridian-remote-clockfaces', '#c7a474', 22,
    'Aiguilles des cadrans éloignés de la place.', remoteClockfaces),
  iron_zephyr_airfield: motion('Iron Tempest', 'zephyr-windsocks', '#c9b180', 13,
    'Manches à air aux extrémités de l’aérodrome, loin des impacts.', distantWindsocks),
  helios_tomorrowville_expo: motion('Helios 56', 'helios-exposition-orbits', '#91d8cb', 12,
    'Motifs atomiques dans les enseignes des pavillons rétrofuturistes.', expositionOrbits),
  primordia_shoreless_sea: motion('Mythos Primordia', 'primordia-shoreless-reflections', '#a7b2da', 17,
    'Silhouettes et reflets des îles au rythme du Premier Chant.', shorelessReflections),
  pirate_port_no_flag: motion('The Crownless Sea', 'crownless-rigging-lanterns', '#d3b47d', 10,
    'Lanternes suspendues aux gréements du port sans pavillons.', riggingLanterns),
  lovecraft_greywake_harbor: motion('The Drowned Testament', 'greywake-harbour-backwash', '#9dbbba', 14,
    'Remous et brume du port à marée basse, derrière les quais.', harbourBackwash),
  fantasy_hollow_peak: motion('Valedor: The Shattered Crown', 'valedor-peak-cloudbanks', '#b9c8dd', 18,
    'Nuages derrière les corniches du Pic Creux.', peakCloudbanks)
});

export function getOriginalMeleeStageMotion(stage) {
  if (!['Smash', 'Melee'].includes(stage.mode) || stage.forceBaseArena || stage.dlcSuppressedArena) return null;
  const key = stage.contentStageId ?? stage.stageKey;
  if (stage.contentStageId && stage.stageKey && stage.contentStageId !== stage.stageKey) return null;
  const profile = Object.hasOwn(stageMotions, key) ? stageMotions[key] : null;
  return profile?.universe === stage.universe ? profile : null;
}

export function drawOriginalMeleeStageMotion(ctx, profile, width, height, elapsedSeconds) {
  const phase = (elapsedSeconds % profile.periodSeconds) / profile.periodSeconds * TAU;
  profile.draw(ctx, width, height, phase);
}
