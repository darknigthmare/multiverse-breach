import fs from 'node:fs/promises';
import path from 'node:path';
import {
  FEATURED_BACKDROPS,
  FEATURED_STAGE_LORE,
  FEATURED_UNIVERSE_ICONS,
  FEATURED_UNIVERSE_KEYS
} from '../src/game/featuredUniversePacks.js';

const root = process.cwd();
const outDir = path.join(root, 'public', 'images', 'generated');
const outJsonl = path.join(outDir, 'featured-openai-visual-prompts.jsonl');
const outManifest = path.join(outDir, 'featured-visual-manifest.json');

const VISUAL_LOCKS = {
  Tomba: {
    medium: 'bright late-1990s PlayStation fantasy pixel art with hand-painted color blocks, crisp clusters, playful proportions, and no modern realism',
    icon: 'the golden bracelet, a red Evil Pig Bag, a small pink grappling-hook curl, and seven distinct curse marks',
    RPG: 'Mushroom Forest shifting between its laughing and crying states, giant mushrooms, branching wooden paths, a distant Village of All Beginnings, and one dormant Evil Pig Bag altar',
    Tactics: 'Phoenix Mountain cliffs, strong wind currents marked by leaves and pennants, grapple points, Needlegator ridges, and protected mountain routes',
    Smash: 'the seven Evil Pig Bag sanctuary, seven differently colored sealed apertures, curse-themed terrain zones, and a final central sealing pedestal'
  },
  Woodruff: {
    medium: 'faithful hand-painted 1990s French point-and-click pixel art inspired by the original Gobliins-era production, angular caricature, dense whimsical machinery, and earthy color',
    icon: 'Woodruffs Tobozon handset, three engraved syllable stones, a Transportozon ring, and a small green Boozook ear motif',
    RPG: 'the lower levels of the vertical city Vlurxtrznbnaxl, stacked dwellings, Transportozon booths, odd signs without readable text, pipes, suspended walkways, and the divide between human authority and Boozook life',
    Tactics: 'the Administration permit counters, factory gate, inspection barriers, pneumatic tubes, absurd bureaucracy, and a route leading toward the Boozook temple',
    Smash: 'Bigwigs lavish apartment during the finale, Ceedeerom player, magnetic-card console, Viblefrotzer apparatus, chewing-gum Schprotznog trap, and the Captive Beasts broken containment'
  },
  Hellraiser: {
    medium: 'dark late-1980s practical-effects horror rendered as intricate retro pixel art, cold stone, tarnished brass, black leather, severe geometric perspective, restrained blood, and no generic fire-and-brimstone imagery',
    icon: 'the closed Lament Configuration, a black Leviathan diamond above it, four fine chain hooks, and severe Labyrinth geometry',
    RPG: 'the endless Labyrinth under Leviathans black light, geometric stone corridors, rotating brass puzzle forms, distant chain hooks, and a ceremonial threshold governed by the Lament Configuration',
    Tactics: 'the Cotton house attic during Franks blood resurrection, floorboards, bare mattress, candles, hidden body traces, Julias prepared route, and the puzzle box positioned as a bargaining objective',
    Smash: 'the Leviathan black-light Labyrinth, monumental diamond overhead, rotating Lemarchand-like platforms, chain apertures in walls, and a vast geometric abyss'
  },
  'A Nightmare on Elm Street': {
    medium: 'faithful 1980s supernatural slasher imagery rendered as gritty high-detail retro pixel art, dirty boiler metal, red-green accents, dream distortion, practical-effects texture, and theatrical shadows',
    icon: 'Freddy Kruegers four-bladed glove, fedora silhouette, red-and-green sweater stripes, and a round boiler pressure gauge',
    RPG: '1428 Elm Street blending a teenage bedroom, basement stairs, and the Springwood boiler room through impossible dream transitions, with alarm clocks and Nancys household traps marking the waking route',
    Tactics: 'Westin Hills psychiatric ward transformed into a shared Dream Warriors space, branching patient rooms, Hypnocil station, Kristen dream portals, and distinct safe wake-up points',
    Smash: 'the Springwood boiler room nightmare with furnaces, pipes, catwalks, a mirror route, and environmental traces of Freddys serpent, marionette, television, and soul-chest transformations without showing Freddy himself'
  },
  'The Ring': {
    medium: 'cold early-2000s Pacific Northwest supernatural horror rendered as desaturated cinematic pixel art, damp surfaces, analog VHS noise, green-gray light, and photographic realism translated into crisp pixels',
    icon: 'an unlabeled black VHS cassette, the white ring of the stone well, a small CRT static flare, and seven subtle tally marks',
    RPG: 'Shelter Mountain Cabin 12 with CRT television, VCR, rain-streaked windows, rough floorboards directly above the sealed stone well, and evidence from the cursed tape arranged without readable writing',
    Tactics: 'Morgan Ranch joined to Noahs darkroom as an evidence field, horse stall, mirror, ladder, lone tree motif, hanging distorted photographs, red darkroom lamps, and a visible analog timecode device with no readable numbers',
    Smash: 'the stone well opening into a dark television room, multiple CRT thresholds, wet stone, reflected static, and seven narrowing rings showing Samaras approach without depicting her body'
  },
  'The Grudge': {
    medium: 'faithful Japanese domestic supernatural horror rendered as stark desaturated retro pixel art, ordinary Tokyo interiors, fluorescent gray light, deep black hair-like shadows, and oppressive negative space',
    icon: 'the Saeki staircase, a coil of black hair, a small white cat paw trace for Mar, and a pale house key',
    RPG: 'the Saeki house care visit route with entrance genkan, central staircase, sealed closet, bathroom, attic hatch, family photograph area, and subtle contact traces that make the normal home feel inescapable',
    Tactics: 'Detective Nakagawas investigation board spatially connected to the office security-camera corridor, photographs, tape recorder, mapped visits, doors, and rooms forming a Ju-On contact chain without readable labels',
    Smash: 'the Saeki staircase and attic folded into one impossible vertical arena, bathtub room below, black-cat traces, spreading black hair, and a short firelit exit that does not imply the curse is destroyed'
  }
};

const MODE_COMPOSITIONS = {
  RPG: 'wide 16:9 gameplay backdrop, three-quarter side view, layered depth, a broad readable walkable lower foreground, and clear silhouettes for live sprites',
  Tactics: 'wide 16:9 gameplay backdrop, elevated three-quarter view, readable lanes and cover landmarks, an unobstructed central combat surface, and no baked grid',
  Smash: 'wide 16:9 side-view arena backdrop, broad central fighting space, strong upper and lower depth landmarks, and no collision-critical platforms painted over the live engine geometry'
};

const fileExists = async (output) => {
  const localPath = path.join(root, 'public', output.replace(/^\//, ''));
  try {
    const stat = await fs.stat(localPath);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
};

const buildIconPrompt = (universe, lock) => [
  'Use case: stylized-concept',
  'Asset type: square universe icon for the Multiverse Breach archive and portal selector',
  `Primary request: create one unmistakable lore-faithful emblem for ${universe} using ${lock.icon}.`,
  `Style/medium: ${lock.medium}.`,
  'Composition/framing: exact 1:1 square, one centered compact emblem, bold readable silhouette, generous safe padding, designed to remain legible at 64 pixels.',
  'Background: dark neutral square field with a clean outer edge; no scenery beyond the emblem.',
  'Constraints: no character portrait, no franchise logo, no title, no letters, no numbers, no UI mockup, no border text, no watermark, no unrelated crossover motif.'
].join('\n');

const buildBackdropPrompt = (universe, mode, lock) => [
  'Use case: stylized-concept',
  `Asset type: ${mode} combat-stage backdrop for the browser game Multiverse Breach`,
  `Primary request: create a lore-faithful ${universe} environment showing ${lock[mode]}.`,
  `Canon context: ${FEATURED_STAGE_LORE[universe][mode].en}`,
  `Style/medium: ${lock.medium}.`,
  `Composition/framing: ${MODE_COMPOSITIONS[mode]}.`,
  'Lighting/mood: preserve the source worlds own lighting and emotional tone; the Breach may appear only as restrained turquoise scanline fractures at the far edges.',
  'Constraints: environment only, no playable hero, no enemy, no boss, no crowd, no text, no logo, no HUD, no health bar, no watermark, no frame, no modern generic sci-fi portal in the center.'
].join('\n');

const main = async () => {
  const entries = [];
  for (const universe of FEATURED_UNIVERSE_KEYS) {
    const lock = VISUAL_LOCKS[universe];
    entries.push({
      kind: 'universe-icon',
      universe,
      mode: null,
      output: FEATURED_UNIVERSE_ICONS[universe],
      ratio: '1:1',
      prompt: buildIconPrompt(universe, lock)
    });
    for (const mode of ['RPG', 'Tactics', 'Smash']) {
      entries.push({
        kind: 'stage-backdrop',
        universe,
        mode,
        output: FEATURED_BACKDROPS[universe][mode],
        ratio: '16:9',
        prompt: buildBackdropPrompt(universe, mode, lock)
      });
    }
  }

  const manifestEntries = await Promise.all(entries.map(async entry => ({
    ...entry,
    available: await fileExists(entry.output),
    source: await fileExists(entry.output) ? 'openai' : null
  })));
  const missingEntries = manifestEntries.filter(entry => !entry.available);

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outJsonl, missingEntries.map(entry => JSON.stringify(entry)).join('\n') + '\n', 'utf8');
  await fs.writeFile(outManifest, JSON.stringify({
    generatedAt: new Date().toISOString(),
    counts: {
      icons: manifestEntries.filter(entry => entry.kind === 'universe-icon').length,
      backdrops: manifestEntries.filter(entry => entry.kind === 'stage-backdrop').length,
      total: manifestEntries.length,
      available: manifestEntries.filter(entry => entry.available).length,
      missing: missingEntries.length
    },
    entries: manifestEntries.map(({ prompt: _prompt, ...entry }) => entry)
  }, null, 2), 'utf8');

  console.log(`Wrote ${missingEntries.length} missing visual prompts for ${FEATURED_UNIVERSE_KEYS.length} featured universes.`);
  console.log(outJsonl);
  console.log(outManifest);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
