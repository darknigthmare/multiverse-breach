import fs from 'node:fs/promises';
import path from 'node:path';
import { REQUESTED_UNIVERSE_WAVE } from '../src/game/requestedUniverseWave.js';

const root = process.cwd();
const outputDir = path.join(root, 'public', 'textures', 'recent-universes');
const referenceDir = path.join(root, 'tmp', 'imagegen', 'recent-universe-level-textures', 'references');
const promptPath = path.join(outputDir, 'openai-level-texture-prompts.jsonl');
const sourcePath = path.join(outputDir, 'openai-level-texture-sources.json');
const FETCH_TIMEOUT_MS = 15000;

const SOURCE_LOCKS = {
  'Chainsaw Man': {
    sourcePage: 'https://chainsawman.dog/tvseries/introduction/',
    visualAnchor: 'Public Safety Tokyo concrete, fluorescent hotel corridors folded by the Eternity Devil, dirty snow and distant urban devastation',
    medium: 'gritty modern horror-anime pixel art, restrained ochre and blood-red accents, harsh fluorescent light, heavy black shadows'
  },
  'Cyberpunk: Edgerunners': {
    sourcePage: 'https://www.cyberpunk.net/en/edgerunners',
    visualAnchor: 'Night City asphalt, Arasaka corporate alloy, Santo Domingo highway paint, holographic cyan and acidic yellow reflections',
    medium: 'high-contrast anime cyberpunk pixel art, saturated neon over grimy concrete, chromatic aberration translated into crisp pixel clusters'
  },
  'Demon Slayer': {
    sourcePage: 'https://kimetsu.com/anime/mugenjyohen_movie/',
    visualAnchor: 'Infinity Castle lacquered wood and impossible tatami geometry, Mount Natagumo moss and silk, Entertainment District roof tiles',
    medium: 'Taisho-era Japanese fantasy anime pixel art, patterned surfaces, deep indigo shadows, warm lantern light and precise wood grain'
  },
  Parasyte: {
    sourcePage: 'https://www.vap.co.jp/kiseiju/intro/',
    visualAnchor: 'ordinary Japanese school and city-hall surfaces invaded by wet alien tissue, forest soil scorched during the Gotou pursuit',
    medium: 'cold biological horror anime pixel art, mundane gray architecture interrupted by subtle ivory, olive and crimson organic forms'
  },
  'Steins;Gate': {
    sourcePage: 'https://steinsgate.tv/',
    referencePage: 'https://en.wikipedia.org/wiki/Steins;Gate_(TV_series)',
    visualAnchor: 'Future Gadget Lab worn floor, Akihabara electronics, Radio Kaikan rooftop concrete, amber cathode glow and divergence-meter circuitry',
    medium: 'late-2000s science-fiction anime pixel art, sun-bleached sepia, cyan electronics, dense improvised laboratory detail'
  },
  'Zero Escape: The Nonary Games': {
    sourcePage: 'https://www.spike-chunsoft.com/games/zero-escape-nonary-games/',
    visualAnchor: 'Gigantic ocean-liner steel decks, numbered-door mechanisms without readable numerals, AB lunar facility alloy and Decision Game bunker concrete',
    medium: 'tense visual-novel escape-room pixel art, cold steel blue, emergency red, sharp industrial seams and puzzle-device geometry'
  },
  "JoJo's Bizarre Adventure": {
    sourcePage: 'https://jojo-portal.com/en/anime/sc/',
    visualAnchor: 'DIO mansion terracotta and Fatimid Cairo stone, Battle Tendency volcanic rock, Rome Colosseum marble under supernatural color shifts',
    medium: 'bold JoJo anime pixel art, theatrical complementary colors, graphic ink-like shadows, sculptural stone and flamboyant perspective'
  },
  'Rurouni Kenshin': {
    sourcePage: 'https://rurouni-kenshin.com/',
    visualAnchor: 'Meiji Kyoto timber streets, Kamiya dojo floorboards and tatami, Shishio ironclad deck charred by heat and oil',
    medium: 'historical Japanese anime pixel art, weathered wood, muted indigo and vermilion, soft daylight with sharp sword-era silhouettes'
  },
  'Tokyo Ghoul': {
    sourcePage: 'https://tokyoghoul-anime10th.jp/',
    visualAnchor: 'Anteiku cafe wood and tile, Cochlea prison concrete, rain-dark Tokyo rooftop surfaces with restrained kagune-red reflections',
    medium: 'urban dark-fantasy anime pixel art, desaturated charcoal city materials, red-violet highlights and wet reflective surfaces'
  },
  'Cowboy Bebop': {
    sourcePage: 'https://www.cowboy-bebop.net/',
    visualAnchor: 'Mars syndicate streets, Bebop hangar steel, cathedral stone and stained-glass color, worn retro-future machinery',
    medium: '1990s space-western anime pixel art, cinematic jazz-noir lighting, warm rust, faded teal and practical industrial texture'
  },
  'Dragon Ball Z': {
    sourcePage: 'https://en.dragon-ball-official.com/news/01_1258.html',
    visualAnchor: 'Cell Games square stone tiles in a barren plain, fractured Namek ground and water, Hyperbolic Time Chamber white ceramic floor',
    medium: 'faithful 1990s shonen anime pixel art, bright clean colors, strong cel-shaded rock forms and readable impact cracks'
  },
  'Elfen Lied': {
    sourcePage: 'https://www.vap.co.jp/elfenlied/',
    referencePage: 'https://en.wikipedia.org/wiki/Elfen_Lied',
    visualAnchor: 'Kamakura coastal concrete, sterile Diclonius containment facility, Kaede house wood and research-island steel',
    medium: 'melancholic early-2000s horror-anime pixel art, pale coastal light, sterile gray-green laboratories and restrained crimson traces'
  },
  'Fullmetal Alchemist': {
    sourcePage: 'https://fullmetalalchemistusa.com/introduction/',
    referencePage: 'https://thevictorvoice.com/3292/arts-entertainment/the-anime-that-transmuted-the-world/',
    visualAnchor: 'Central Command stone and military tile, Laboratory Five alchemy floor, Briggs fortress steel and snow',
    medium: 'industrial European-fantasy anime pixel art, military green, weathered limestone, iron seams and precise transmutation geometry'
  },
  Gantz: {
    sourcePage: 'https://www.gonzo.co.jp/works/gantz/index.html',
    referencePage: 'https://en.wikipedia.org/wiki/Gantz',
    visualAnchor: 'Tokyo apartment black-sphere room, Osaka night streets slick with rain, Rome marble statues and alien black technology',
    medium: 'bleak science-fiction anime pixel art, glossy black machinery, sodium-lit concrete and high-contrast urban night materials'
  },
  'Psycho-Pass': {
    sourcePage: 'https://psycho-pass.com/',
    referencePage: 'https://en.wikipedia.org/wiki/Psycho-Pass',
    visualAnchor: 'Public Safety Bureau glass and alloy, holographic Tokyo streets, Hyper-Oats industrial farm and SEAUn institutional concrete',
    medium: 'clean dystopian cyber-thriller pixel art, cold cyan glass, gunmetal surfaces, magenta scanner accents and severe perspective'
  },
  Mashle: {
    sourcePage: 'https://mashle.pw/',
    visualAnchor: 'Easton Magic Academy stone halls, Magia Lupus maze masonry and Divine Visionary arena tiles with subtle magic-line damage',
    medium: 'bright comic fantasy-anime pixel art, Hogwarts-like carved stone filtered through bold shonen color and deadpan visual clarity'
  },
  'Solo Leveling': {
    sourcePage: 'https://sololeveling-anime.net/',
    visualAnchor: 'Cartenon double-dungeon stone and blue flame, Jeju ant-nest basalt, Seoul invasion asphalt under violet shadow energy',
    medium: 'dark Korean dungeon-fantasy anime pixel art, black-blue stone, electric violet aura reflections and monumental carved geometry'
  },
  'Frieren: Beyond Journeys End': {
    sourcePage: 'https://frieren-anime.jp/',
    referencePage: 'https://en.wikipedia.org/wiki/Frieren',
    visualAnchor: 'Northern Plateau grass and old stone, mage-exam ruins, El Dorado gold-transmuted masonry and quiet medieval roads',
    medium: 'gentle high-fantasy anime pixel art, natural greens, weathered gray stone, soft overcast light and precise magical residue'
  },
  'Deadman Wonderland': {
    sourcePage: 'https://www.viz.com/deadman-wonderland',
    visualAnchor: 'G Ward industrial prison, Dog Race carnival arena, Mother Goose chamber alloy and blood-weapon scoring',
    medium: 'brutal prison-horror anime pixel art, dirty white concrete, hazard red, rusted machinery and oppressive amusement-park color'
  },
  Devilman: {
    sourcePage: 'https://devilman-crybaby.com/',
    visualAnchor: 'Tokyo apocalypse asphalt, Sabbath nightclub floor and Armageddon rubble with demonic silhouettes excluded from the texture itself',
    medium: 'expressionistic modern anime pixel art, acid nightclub color, deep black-red destruction and angular hand-drawn energy'
  },
  'Neon Genesis Evangelion': {
    sourcePage: 'https://www.evangelion.jp/',
    visualAnchor: 'Tokyo-3 armored streets, Geofront hexagonal alloy, Ramiel operation road plating and Terminal Dogma white-red industrial floor',
    medium: 'faithful 1990s mecha-anime pixel art, NERV industrial geometry, warning orange, deep violet, green instrumentation and colossal scale cues'
  },
  Naruto: {
    sourcePage: 'https://naruto-official.com/en/anime/naruto1',
    visualAnchor: 'Forest of Death roots and moss, Konoha rooftop tile, Valley of the End wet stone and river-worn combat ground',
    medium: 'early-2000s ninja anime pixel art, warm earth, moss green, weathered stone and hand-painted cel-animation texture'
  },
  'Naruto Shippuden': {
    sourcePage: 'https://naruto-official.com/en/anime/naruto2',
    visualAnchor: 'Fourth Shinobi War blasted earth, Amegakure rain-soaked metal, Kamui dimension gray blocks and red-black chakra damage',
    medium: 'mature ninja-war anime pixel art, storm gray, desaturated earth, blood-red clouds and high-impact cracked terrain'
  },
  'Boruto: Naruto Next Generations': {
    sourcePage: 'https://naruto-official.com/en/anime/boruto',
    visualAnchor: 'modern Konoha Chunin arena, clean village concrete and rail technology, Kara chamber black alloy and Isshiki invasion fractures',
    medium: 'bright modern ninja-anime pixel art, clean urban surfaces mixed with ancient chakra motifs and restrained cyan technology'
  },
  'Boruto: Two Blue Vortex': {
    sourcePage: 'https://naruto-official.com/en/special/tbv',
    visualAnchor: 'damaged modern Konoha, Claw Grime black-red marks, Ten-Tails pocket dimension pale stone and Divine Tree root networks',
    medium: 'high-contrast manga-informed ninja pixel art, ink-black roots, crimson claw marks, pale alien stone and severe mature lighting'
  },
  'One Punch Man': {
    sourcePage: 'https://onepunchman-anime.net/',
    visualAnchor: 'City A association plaza, Monster Association subterranean concrete and Boros ship alien alloy over a devastated metropolis',
    medium: 'clean explosive superhero-anime pixel art, readable concrete destruction, metallic alien panels and punch-impact fissures'
  },
  'Sword Art Online: Gun Gale Online': {
    sourcePage: 'https://gungale-onlineusa.com/1st/story/',
    visualAnchor: 'Bullet of Bullets desert ruins, Squad Jam abandoned city concrete, game-world steel cover and vivid pink scan accents',
    medium: 'tactical VR-anime pixel art, dusty tan, military gray, neon-pink interface glow baked only as environmental light, sharp cover materials'
  },
  'Sword Art Online': {
    sourcePage: 'https://www.swordart-online.net/aincrad/story/',
    visualAnchor: 'Aincrad Floor 1 medieval plaza stone, Floor 74 labyrinth masonry and Floor 75 boss-chamber obsidian tile',
    medium: 'polished fantasy-VR anime pixel art, carved stone, blue system-light reflections, warm medieval materials and monumental dungeon scale'
  },
  'Les Aventures de Saturnin': {
    sourcePage: 'https://fr.wikipedia.org/wiki/Les_Aventures_de_Saturnin',
    visualAnchor: '1960s live-animal miniature village, painted workshop floor for Professor Popof, tiny roads, alpine ski-set snow and handcrafted props',
    medium: 'faithful 1960s French miniature television set translated into charming detailed pixel art, practical model textures and warm film color'
  },
  'MagiC JacK': {
    sourcePage: 'https://www.magicjackofficial.com/',
    referencePage: 'https://www.senscritique.com/serie/Magic_Jack_Production/33807941',
    referenceImage: 'https://media.senscritique.com/media/000017798021/0/Magic_Jack_Production.jpg',
    visualAnchor: 'Minute Sapiens tribunal set, stark social-mirror studio, rough Max Rage concert stage and handmade satirical props',
    medium: 'dark French satirical live-action imagery translated into gritty pixel art, theatrical spotlights, black-red stage fabric and practical set texture'
  },
  'Teen Titans': {
    sourcePage: 'https://www.dc.com/tv/teen-titans-2003-2005',
    visualAnchor: '2003 animated Titans Tower alloy and glass, HIVE Academy training floor and Azarath stone under a violet eclipse',
    medium: 'faithful 2003 western-anime hybrid pixel art, bold flat color, thick graphic shadows, cyan technology, violet magic and clean silhouettes'
  },
  Godzilla: {
    sourcePage: 'https://godzilla.com/blogs/movies',
    visualAnchor: 'Tokyo asphalt crushed at kaiju scale, Shin Godzilla evacuation-grid roads, Lake Ashinoko biological roots and burned reinforced concrete',
    medium: 'detailed Japanese tokusatsu disaster pixel art, charcoal rubble, radioactive blue-green reflections, emergency red and massive practical-effects material scale'
  }
};

const fileExists = async filePath => {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
};

const readMetaImage = html => {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1].replace(/&amp;/g, '&');
  }
  return null;
};

const extensionFor = (contentType, url) => {
  if (/png/i.test(contentType || '')) return '.png';
  if (/webp/i.test(contentType || '')) return '.webp';
  if (/gif/i.test(contentType || '')) return '.gif';
  const urlExtension = path.extname(new URL(url).pathname).toLowerCase();
  return ['.png', '.webp', '.gif', '.jpg', '.jpeg'].includes(urlExtension) ? urlExtension : '.jpg';
};

const assertImageResponse = response => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().startsWith('image/')) {
    throw new Error(`invalid image content-type ${contentType || 'unknown'}`);
  }
};

const fetchReferenceResource = (url) => fetch(url, {
  headers: { 'user-agent': 'Mozilla/5.0 MultiverseBreachReferenceAudit/1.0' },
  redirect: 'follow',
  signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
});

const downloadReference = async entry => {
  const lock = SOURCE_LOCKS[entry.universe];
  const referencePage = lock.referencePage || lock.sourcePage;
  if (lock.referenceImage) {
    const imageResponse = await fetchReferenceResource(lock.referenceImage);
    if (!imageResponse.ok) throw new Error(`image HTTP ${imageResponse.status}`);
    assertImageResponse(imageResponse);
    const extension = extensionFor(imageResponse.headers.get('content-type'), imageResponse.url);
    const output = path.join(referenceDir, `${entry.key}${extension}`);
    await fs.writeFile(output, Buffer.from(await imageResponse.arrayBuffer()));
    return { imageUrl: imageResponse.url, localReference: output };
  }
  const htmlResponse = await fetchReferenceResource(referencePage);
  if (!htmlResponse.ok) throw new Error(`source HTTP ${htmlResponse.status}`);
  const html = await htmlResponse.text();
  const metaImage = readMetaImage(html);
  if (!metaImage) throw new Error('no og:image or twitter:image');
  const imageUrl = new URL(metaImage, htmlResponse.url).href;
  const imageResponse = await fetchReferenceResource(imageUrl);
  if (!imageResponse.ok) throw new Error(`image HTTP ${imageResponse.status}`);
  assertImageResponse(imageResponse);
  const extension = extensionFor(imageResponse.headers.get('content-type'), imageResponse.url);
  const output = path.join(referenceDir, `${entry.key}${extension}`);
  await fs.writeFile(output, Buffer.from(await imageResponse.arrayBuffer()));
  return { imageUrl: imageResponse.url, localReference: output };
};

const buildPrompt = (entry, lock) => {
  const stageCues = [entry.stage, ...(entry.stageVariants || []).map(variant => Array.isArray(variant) ? variant[1] : variant.name)].join('; ');
  return [
    'Use case: stylized-concept',
    `Asset type: 2x2 pixel-art gameplay texture atlas for the browser game Multiverse Breach, universe ${entry.universe}`,
    'Input image: use the supplied canonical reference only for source-world palette, materials, architecture and lighting. Do not copy characters, logos or text.',
    `Primary request: create one lore-faithful 1024x1024 atlas inspired by ${lock.visualAnchor}.`,
    `Canon stage cues: ${stageCues}.`,
    `Style/medium: ${lock.medium}; highly detailed 16-bit/32-bit cinematic pixel art with crisp nearest-neighbor clusters and no painterly blur.`,
    'Composition/framing: exactly four equal 512x512 quadrants, edge to edge, aligned to the exact image center, with no gutters, borders, labels or frames.',
    'Top-left quadrant - COMBAT: flat side-view duel arena floor material with a broad readable ground plane and subtle rearward perspective.',
    'Top-right quadrant - MELEE: seamless horizontal platform top plus matching vertical platform edge material; no baked playable platform shape.',
    'Bottom-left quadrant - RPG: perspective floor plane for a side-view party battle, with clear depth lines and an unobstructed center.',
    'Bottom-right quadrant - TACTICS: seamless top-down square tile material with even lighting; no baked grid lines, coordinate labels or units.',
    'Constraints: environment and material only; no person, creature, character, face, body, vehicle, weapon, readable text, letter, number, logo, HUD, icon, watermark or crossover element.'
  ].join('\n');
};

const main = async () => {
  const shouldDownload = process.argv.includes('--download-references');
  await fs.mkdir(outputDir, { recursive: true });
  if (shouldDownload) await fs.mkdir(referenceDir, { recursive: true });

  let previousSource = null;
  try {
    previousSource = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
  } catch {
    previousSource = null;
  }
  const previousEntries = new Map((previousSource?.entries || []).map(entry => [entry.universe, entry]));

  const entries = await Promise.all(REQUESTED_UNIVERSE_WAVE.map(async entry => {
    const lock = SOURCE_LOCKS[entry.universe];
    if (!lock) throw new Error(`Missing source lock for ${entry.universe}`);
    const atlasPath = `/textures/recent-universes/${entry.key}-openai-atlas.webp`;
    let reference = { imageUrl: null, localReference: null };
    let referenceError = null;
    if (shouldDownload) {
      try {
        reference = await downloadReference(entry);
      } catch (error) {
        referenceError = error.message;
      }
    } else {
      const previous = previousEntries.get(entry.universe);
      reference.imageUrl = previous?.referenceImage || lock.referenceImage || null;
    }
    return {
      universe: entry.universe,
      key: entry.key,
      sourcePage: lock.sourcePage,
      referencePage: lock.referencePage || lock.sourcePage,
      referenceImage: reference.imageUrl,
      localReference: reference.localReference,
      referenceError,
      atlasPath,
      available: await fileExists(path.join(root, 'public', atlasPath.slice(1))),
      quadrants: {
        Combat: { x: 0, y: 0, width: 0.5, height: 0.5 },
        Melee: { x: 0.5, y: 0, width: 0.5, height: 0.5 },
        RPG: { x: 0, y: 0.5, width: 0.5, height: 0.5 },
        Tactics: { x: 0.5, y: 0.5, width: 0.5, height: 0.5 }
      },
      visualAnchor: lock.visualAnchor,
      prompt: buildPrompt(entry, lock)
    };
  }));

  await fs.writeFile(promptPath, entries.map(entry => JSON.stringify(entry)).join('\n') + '\n', 'utf8');
  await fs.writeFile(sourcePath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    generator: 'OpenAI ImageGen',
    atlasLayout: '2x2, 512px logical quadrants in a 1024px square atlas',
    counts: {
      universes: entries.length,
      available: entries.filter(entry => entry.available).length,
      referencesDownloaded: shouldDownload
        ? entries.filter(entry => entry.localReference).length
        : previousSource?.counts?.referencesDownloaded || entries.filter(entry => entry.referenceImage).length,
      referenceErrors: entries.filter(entry => entry.referenceError).length
    },
    entries: entries.map(({ prompt: _prompt, localReference, ...entry }) => ({
      ...entry,
      localReference: localReference ? path.relative(root, localReference).replaceAll('\\', '/') : null
    }))
  }, null, 2), 'utf8');

  console.log(`Wrote ${entries.length} lore-locked OpenAI texture prompts.`);
  if (shouldDownload) {
    console.log(`Downloaded ${entries.filter(entry => entry.localReference).length} references; ${entries.filter(entry => entry.referenceError).length} failed.`);
    entries.filter(entry => entry.referenceError).forEach(entry => console.log(`- ${entry.universe}: ${entry.referenceError}`));
  }
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
