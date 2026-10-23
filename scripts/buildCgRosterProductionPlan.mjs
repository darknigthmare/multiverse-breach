import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';
import { CG_GALLERY_CATALOG } from '../src/game/cg/cgRosterCatalog.js';
import { createCgRevisionRegistry, resolveCgVersions } from '../src/game/cg/cgRevisions.js';
import { buildCgId, buildCgPaths } from '../src/game/cg/cgSchema.js';
import { STAGE_LORE_PROFILES } from '../src/game/stageLoreProfiles.js';
import { loadQualifiedCgIdentityLocks } from './cgSourceEvidence.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const JSON_OUTPUT = 'docs/cg/roster-production-2026-10-18.json';
const REPORT_OUTPUT = 'docs/cg/roster-production-2026-10-18.md';
const GENERATED_REGISTRY = 'src/game/cg/cgRosterArtwork.generated.json';
const REVISION_REGISTRY = 'src/game/cg/cgRevisions.generated.json';
const BACKGROUND_BRIEFS = 'docs/cg/roster-background-briefs.json';
const P0_AUDIT = 'docs/audits/fidelity-p0-wave4-2026-10-01.json';
const readJson = name => JSON.parse(readFileSync(path.join(ROOT, name), 'utf8'));
const unique = values => [...new Set(values.filter(Boolean))];
const slug = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const text = value => typeof value === 'string' ? value : value?.fr || value?.en || '';
const deliveredTheme = entry => {
  const brief = text(entry.themeBrief || entry.promptSummary);
  if (brief.length >= 20) return brief;
  const detail = text(entry.promptSummary);
  // A short heading such as "Victoire" is not a complete production brief.
  // Retain its meaning through the actual documented prompt, not filler text.
  return detail.includes(brief) ? detail : unique([brief, detail]).join(' — ');
};
const digest = value => createHash('sha256').update(value).digest('hex');
const publicFile = name => path.join(ROOT, 'public', name.replace(/^\//, ''));

// Fifteen documented slots, not nineteen mandatory CGs per hero. Slots 13 and
// 15 deliberately retain their mutually exclusive alternatives.
export const ROSTER_CG_SLOTS = Object.freeze([
  ['CG01', ['characterSolo']], ['CG02', ['weaponSolo']], ['CG03', ['decorSolo']],
  ['CG04', ['coherentScene']], ['CG05', ['actionScene']], ['CG06', ['introPose']],
  ['CG07', ['victoryPose']], ['CG08', ['defeatPose']], ['CG09', ['beachFamily']],
  ['CG10', ['maidService']], ['CG11', ['goofy']], ['CG12', ['alignmentSwap']],
  ['CG13', ['genderSwap', 'iconicOutfitSwap']], ['CG14', ['zombieVersion']],
  ['CG15', ['firstStep', 'futureExperienced']]
].map(([slot, types]) => ({ slot, types })));

const SLOT_POSE_BRIEFS = Object.freeze({
  CG01: 'Portrait entier en trois quarts, appui calme, silhouette dégagée et équipement complet; attitude de référence sans attaque.',
  CG02: 'Arme ou équipement signature seul, entièrement visible en diagonale sur un support; aucun corps ni membre coupé.',
  CG03: 'Décor seul en vue d’ensemble avec premier plan bas et profondeur ouverte; aucun personnage dominant et donc aucune pose humaine.',
  CG04: 'Interaction calme avec un élément source validé, buste ou axe du corps légèrement incliné, attention orientée vers cet élément.',
  CG05: 'Mouvement d’action asymétrique et dirigé, appui décalé et trajectoire de technique source lisible; anatomie et équipement verrouillés.',
  CG06: 'Franchissement du seuil d’arrivée, un appui en avant et regard vers la route; équipement porté sans déclencher une attaque.',
  CG07: 'Victoire contenue, axe du corps redressé et ouvert, équipement abaissé en sécurité; aucune pose de conquête humiliante.',
  CG08: 'Repli défensif bas vers un abri, appuis rapprochés et axe protégé; vivant et digne, sans blessure graphique.',
  CG09: 'Pause de loisir assise ou flottante selon l’anatomie, orientation latérale et membres relâchés; applicabilité et tenue à vérifier.',
  CG10: 'Geste de service en déplacement court, objet de service tenu seulement si l’anatomie le permet; applicabilité à vérifier, aucune soumission.',
  CG11: 'Déséquilibre comique contrôlé, axe du corps déporté et geste de rattrapage; ni chute grave ni humiliation.',
  CG12: 'Posture de faction alternative vue de trois quarts arrière, tête ou regard revenu vers le spectateur; opposition morale What If à sourcer.',
  CG13: 'Présentation latérale de la seule transformation retenue, silhouette déployée et appui extérieur; choisir genre OU tenue iconique, jamais les fusionner.',
  CG14: 'Posture de corruption contenue, axe penché et mouvement interrompu, membres source lisibles; aucun gore ni ajout anatomique non validé.',
  CG15: 'Pose temporelle en transition de profil, appui arrière quittant le sol ou équivalent anatomique; époque initiale OU expérimentée à sourcer.'
});

const SLOT_THEME_TEMPLATES = Object.freeze({
  CG01: 'Personnage de référence dans une incarnation source précise, sans transformation.',
  CG02: 'Arme ou équipement signature confirmé pour cette incarnation; N/A si aucun équipement distinct cohérent.',
  CG03: 'Lieu de l’univers source, fidèle à l’époque et à la continuité retenues.',
  CG04: 'Scène cohérente avec le rôle et les objets documentés de cette incarnation.',
  CG05: 'Action Nexus utilisant une technique documentée ou une adaptation de jeu explicitement identifiée.',
  CG06: 'Arrivée du personnage dans le lieu retenu, identité et équipement source conservés.',
  CG07: 'Victoire sobre cohérente avec la personnalité et la source.',
  CG08: 'Repli vivant, digne et non graphique, cohérent avec la source.',
  CG09: 'Beach/family : déclinaison de loisir familiale uniquement si anatomie, âge et identité rendent le thème cohérent.',
  CG10: 'Maid/service : déclinaison de service familiale applicable seulement après validation du personnage et de la tenue.',
  CG11: 'Goofy : mésaventure comique originale cohérente avec la personnalité, sans altérer l’identité.',
  CG12: 'Alignment swap : faction ou alignement inversé What If; thème précis à résoudre dans les références.',
  CG13: 'Une seule variante : gender swap OU iconic outfit swap; source et thème exacts à choisir séparément.',
  CG14: 'Zombie/corruption What If : mécanisme et motifs compatibles avec l’univers, sans gore.',
  CG15: 'Une seule époque : first step OU future experienced; continuité et thème temporels à documenter.'
});

const themeSourceForSlot = slot => ['CG09', 'CG10', 'CG11', 'CG12', 'CG13', 'CG14', 'CG15'].includes(slot)
  ? 'docs/cg/CG_VARIANT_WAVE_AUDIT.md'
  : 'docs/cg/CG_PILOT_REFERENCE_AUDIT.md';

export function rosterDefinitionsForHero(hero, existing, generated) {
  const foundation = {
    id: buildCgId({ universeKey: slug(hero.universe), characterKey: slug(hero.id), type: 'characterSolo' }),
    type: 'characterSolo',
    ...buildCgPaths({ universeKey: slug(hero.universe), characterKey: slug(hero.id), type: 'characterSolo' })
  };
  const definitions = [...existing];
  if (!definitions.some(entry => entry.type === 'characterSolo')) definitions.push(generated.find(entry => entry.type === 'characterSolo') || foundation);
  for (const entry of generated) if (!definitions.some(definition => definition.id === entry.id)) definitions.push(entry);
  const usedSlots = new Set();
  for (const entry of definitions) {
    const slot = ROSTER_CG_SLOTS.find(slot => slot.types.includes(entry.type));
    assert.ok(slot, `Unsupported roster CG type: ${entry.type}`);
    assert.equal(usedSlots.has(slot.slot), false, `${hero.id}: more than one CG selected for ${slot.slot}`);
    usedSlots.add(slot.slot);
  }
  return definitions.sort((a, b) => ROSTER_CG_SLOTS.findIndex(slot => slot.types.includes(a.type)) - ROSTER_CG_SLOTS.findIndex(slot => slot.types.includes(b.type)));
}

const TYPE_ENVIRONMENTS = {
  characterSolo: ['repère personnel', 'Sol dégagé bordé de deux masses asymétriques; passage latéral ouvert et lointain à trois profondeurs.'],
  weaponSolo: ['atelier d’équipement', 'Établi bas dans une niche de maintenance; rangement fermé sur la gauche et cloison ajourée en fond.'],
  decorSolo: ['belvédère du territoire', 'Large panorama vide avec une faille de terrain au premier plan, une voie courbe médiane et un repère lointain.'],
  coherentScene: ['poste de veille', 'Aire de travail abritée; console ou mobilier de la source en bordure, circulation centrale et ouverture arrière.'],
  actionScene: ['front de brèche Nexus', 'Deux niveaux de terrain disjoints séparés par une rupture causale; débris sur les côtés et ligne de traversée centrale.'],
  introPose: ['voie d’accès', 'Seuil entre une arrivée étroite et une aire ouverte; contre-forts latéraux et chemin encore visible au loin.'],
  victoryPose: ['zone sécurisée', 'Plateau haut après engagement, couverture basse à droite et relief apaisé derrière une ouverture large.'],
  defeatPose: ['abri de repli', 'Recoin protégé au pied d’une structure intacte, trace de retraite sinueuse et front distant masqué.'],
  beachFamily: ['halte côtière', 'Plage de loisir isolée, rochers bas côté terre, baie calme et ponton éloigné; tenue et ton familiaux.'],
  maidService: ['salon de service', 'Pièce de réception originale avec desserte, table vide, baie latérale et corridor de service au fond.'],
  goofy: ['cour de pause', 'Cour basse aménagée pour une mésaventure comique, objets posés en équilibre et issue bien dégagée.'],
  alignmentSwap: ['poste de faction alternative', 'Salle de contrôle de faction What If, estrade désaxée, cloisons verticales et large porte arrière.'],
  genderSwap: ['annexe de portrait What If', 'Annexe calme avec niche verticale, séparation vitrée latérale et petit jardin ou patio hors foyer.'],
  iconicOutfitSwap: ['vestiaire croisé What If', 'Atelier de changement de tenue avec casier fermé, support vide et grille de passage donnant sur un autre volume.'],
  zombieVersion: ['périmètre de contamination What If', 'Zone isolée par deux barrières inégales, végétation ou matière contaminée limitée aux bords et échappée lointaine.'],
  firstStep: ['point de départ temporel', 'Petit seuil de première mission, matériel encore rangé, départ de voie et horizon non encombré.'],
  futureExperienced: ['poste de commandement futur', 'Terrasse de commandement à deux plans avec poste de transmission bas et horizon traversé de voies lointaines.']
};

// These are physical scene proposals, not official locations or automatically
// approved fidelity references. Reusing a location never means reusing an image.
const GROUND_PLANS = [
  ['seuil bifurqué', 'un seuil encaissé débouchant sur deux chemins séparés par un massif bas'],
  ['cour à gradins', 'une cour sur trois terrasses décalées reliées par une rampe courbe'],
  ['traversée en lacet', 'une traversée étroite en lacet entre deux masses de hauteurs inégales'],
  ['lisière abritée', 'une lisière abritée avec un renfoncement ouvert et un passage latéral profond'],
  ['promontoire fendu', 'un promontoire dont le bord fendu surplombe un niveau secondaire dégagé'],
  ['embranchement bas', 'un embranchement bas en Y contournant une aire centrale laissée vide'],
  ['couloir traversant', 'un passage traversant sous une longue masse en surplomb, ouvert aux deux extrémités'],
  ['recoin surélevé', 'un recoin surélevé bordé d’une paroi courbe et d’une descente étroite'],
  ['anneau interrompu', 'une aire annulaire interrompue par une échancrure et prolongée par un accès droit'],
  ['bordure en cascade', 'une bordure sur deux niveaux avec un décrochement en cascade sur le côté gauche'],
  ['esplanade fractionnée', 'une esplanade fractionnée en trois îlots reliés autour d’un vide central'],
  ['vallon protégé', 'un vallon peu profond avec deux hauteurs protectrices et une sortie en diagonale'],
  ['alcôve en retrait', 'une alcôve profonde en retrait d’une voie ouverte, séparée par un décrochement bas'],
  ['passerelle désaxée', 'une traversée désaxée au-dessus d’un creux peu profond, avec un palier latéral'],
  ['clairière oblique', 'une clairière oblique délimitée par une masse haute à droite et trois reliefs bas à gauche'],
  ['resserrement central', 'deux aires ouvertes reliées par un resserrement central et un détour périphérique'],
  ['gradin de veille', 'un gradin de veille dominant un accès étroit suivi d’une large échappée arrière'],
  ['enclos ouvert', 'un enclos incomplet dont un côté ouvert donne sur deux voies divergentes'],
  ['palier suspendu', 'un palier en avancée au-dessus du niveau inférieur, avec une seule jonction arrière'],
  ['couronne décentrée', 'une couronne de petites masses autour d’un espace décentré relié à une voie étroite'],
  ['pente double', 'deux pentes opposées séparées par une surface plane et une longue bordure basse'],
  ['repli diagonal', 'un abri diagonal au pied d’une masse haute, prolongé par une voie fuyante à gauche'],
  ['croisement asymétrique', 'un croisement asymétrique dont trois branches ont des largeurs et des niveaux distincts'],
  ['bordure percée', 'une bordure haute percée d’une ouverture basse donnant sur une aire intérieure dégagée'],
  ['cuvette ouverte', 'une cuvette peu profonde ouverte sur l’horizon, avec un accès supérieur en arrière'],
  ['plateau d’angle', 'un plateau d’angle limité par deux écrans latéraux et un passage frontal brisé']
];

async function loadArcs() {
  const vite = await createServer({ root: ROOT, appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  try {
    return (await vite.ssrLoadModule('/src/game/narrativeSystems.js?cg-roster-production')).CHARACTER_NARRATIVE_ARCS;
  } finally {
    await vite.close();
  }
}

function evidenceForSubject(hero, dossier, pilot, p0, imageEvidence, qualified) {
  const lock = dossier?.verrouSourcePersonnage || (hero.incarnation && hero.visualAnchor ? hero : null);
  const incarnation = qualified?.incarnation || pilot?.continuityId || lock?.incarnation || null;
  const sourceRefs = qualified
    ? unique([...qualified.sourceEvidenceFiles, ...qualified.referenceUrls])
    : unique([...(pilot?.sourceRefs || []), ...(lock?.referenceUrls || []), ...(hero.referenceUrls || []), hero.referenceUrl, ...(dossier?.referenceUrls || [])]);
  const localCandidates = unique([...(dossier?.candidatsReferencesLocalesAudit || []), ...(dossier?.referencesLocalesOpenAI || [])])
    .map(referencePath => ({ path: referencePath, exists: existsSync(publicFile(referencePath)), role: 'historical-project-image-not-source-fidelity-approval' }));
  const missing = [];
  if (!incarnation) missing.push('Choisir l’incarnation précise et sa continuité.');
  if (qualified) missing.push('Comparer chaque nouvelle image à la référence inspectée, sur les huit axes visuels; la cible sourcée ne certifie pas automatiquement les productions.');
  else if (!pilot) missing.push('Ouvrir une référence visuelle source correspondant à cette incarnation et valider silhouette, visage ou anatomie, tenue et équipement.');
  if (!sourceRefs.length) missing.push('Renseigner une source d’identité vérifiable.');
  if (p0) missing.push('Les anciennes substitutions P0 ne constituent pas une référence fidèle; réviser explicitement leur ressemblance.');
  return {
    incarnation,
    identityLock: qualified?.visualAnchor || (pilot ? text(pilot.promptSummary) : lock?.visualAnchor || null),
    equipment: qualified?.equipment || lock?.equipment || hero.equipment || [],
    sourceRefs,
    localCandidates,
    historicalWebImageEvidence: imageEvidence || [],
    evidenceStatus: qualified?.evidenceStatus || (pilot ? 'approved-pilot-reference' : 'needs-reference'),
    ...(qualified ? { sourceEvidenceFiles: qualified.sourceEvidenceFiles, identityVisualReferences: qualified.identityVisualReferences } : {}),
    missing,
    visualFidelityApproved: false,
    identityRule: 'Conserver la même incarnation, silhouette, proportions, anatomie, visage, tenue et équipement. Le décor peut changer. Ne pas remplacer un personnage par un original ressemblant à sa classe de jeu.',
    adaptationNote: hero.canonStatus || null
  };
}

function loadImageEvidence() {
  const result = new Map();
  for (let wave = 1; wave <= 5; wave++) {
    const filename = `docs/audits/web-referenced-character-png-wave-${wave}-2026-10-03.json`;
    if (!existsSync(path.join(ROOT, filename))) continue;
    for (const entry of readJson(filename).entries || []) {
      if (!HEROES_DB.some(hero => hero.id === entry.id)) continue;
      const refs = (entry.references || []).map(ref => ({ url: ref.finalUrl || ref.url, sha256: ref.sha256, incarnation: ref.incarnation || null, viewedHistorically: ref.viewed === true, currentlyLoaded: false, evidenceFile: filename }));
      result.set(entry.id, [...(result.get(entry.id) || []), ...refs]);
    }
  }
  return result;
}

function loadPendingCharacterBriefs() {
  const result = new Map();
  const sources = [
    ['batman_tdk', 'docs/cg/batman-tdk-complete-2026-10-18.json', 'docs/cg/batman-tdk-complete-2026-10-18.json'],
    ['mistral_mgr', 'docs/cg/mistral-complete-plan-2026-10-18.json', 'docs/cg/mistral-complete-2026-10-18.json'],
    ['vader', 'docs/cg/vader-complete-plan-2026-10-18.json', 'docs/cg/vader-complete-2026-10-18.json']
  ];
  // New artist plans retain real unpublished briefs and service outcomes too.
  // A plan is documentary evidence, never a delivered image or an N/A decision.
  for (const name of readdirSync(path.join(ROOT, 'docs/cg')).filter(name => /-(?:wave\d+-plan|complete-plan)-\d{4}-\d{2}-\d{2}\.json$/.test(name))) {
    const planFile = `docs/cg/${name}`;
    const document = readJson(planFile);
    const characterId = document.characterId || document.heroId;
    if (!characterId || !Array.isArray(document.slots || document.productionPlan)) continue;
    const receiptFile = document.receiptFile || planFile.replace('-plan-', '-');
    if (!sources.some(source => source[1] === planFile)) sources.push([characterId, planFile, receiptFile]);
  }
  sources.sort((a, b) => (a[1].match(/\d{4}-\d{2}-\d{2}/)?.[0] || '').localeCompare(b[1].match(/\d{4}-\d{2}-\d{2}/)?.[0] || '') || a[1].localeCompare(b[1]));
  const slotOf = value => {
    const supplied = value && typeof value === 'object' ? value.slot : value;
    return typeof supplied === 'number' || /^\d+$/.test(String(supplied)) ? `CG${String(supplied).padStart(2, '0')}` : supplied;
  };
  for (const [characterId, planFile, receiptFile] of sources) {
    const document = readJson(planFile);
    const receiptExists = existsSync(path.join(ROOT, receiptFile));
    const receipt = receiptExists ? readJson(receiptFile) : {};
    for (const brief of document.slots || document.productionPlan) {
      const slot = slotOf(brief);
      assert.ok(ROSTER_CG_SLOTS.find(definition => definition.slot === slot)?.types.includes(brief.type));
      const blockage = [...(receipt.blockages || []), ...(receipt.toolFailures || []), ...(receipt.blockedSlots || []).filter(row => row && typeof row === 'object')]
        .find(row => row.type === brief.type || slotOf(row) === slot);
      const blocked = blockage || (receipt.blockedSlots || []).some(row => slotOf(row) === slot);
      const unattempted = (receipt.unattemptedSlots || []).some(row => slotOf(row) === slot);
      const generationStatus = blockage?.status || (blocked ? 'blocked-by-provider' : unattempted
        ? brief.status?.startsWith('not-attempted') ? brief.status : 'not-attempted-after-provider-blocks'
        : brief.status || 'planned-not-generated');
      const key = `${characterId}/${slot}`;
      const previous = result.get(key);
      // A batch that did not retry this slot cannot supersede its actual
      // historical refusal. Keep the newer brief and both evidence records.
      const retainRefusal = !blocked && unattempted && /^blocked/.test(previous?.generationStatus || '');
      result.set(key, {
        ...brief, slot, authoredBriefFile: planFile, generationEvidenceFile: receiptExists ? receiptFile : null,
        incarnation: document.incarnation,
        themeBrief: `${slot} — ${text(brief.themeBrief || brief.title)}`,
        backgroundBrief: brief.backgroundBrief || brief.backgroundDescription || brief.background?.location,
        sourceRefs: unique([planFile, ...(brief.sourceRefs || []), previous?.authoredBriefFile, ...(retainRefusal ? [previous.generationEvidenceFile, receiptFile] : [])]),
        generationStatus: retainRefusal ? previous.generationStatus : generationStatus,
        ...(retainRefusal ? { generationEvidenceFile: previous.generationEvidenceFile } : {})
      });
    }
  }
  return result;
}

function makeBackground({ hero, type, universeRank, dossier, researched, authored, pilot }) {
  const profile = STAGE_LORE_PROFILES[hero.universe];
  const sourceSetting = authored?.location || researched?.canonicalLocationOrMotif || profile?.canonicalName
    || `${hero.universe} — localisation précise à vérifier dans la source`;
  const anchors = authored?.sourceContext || researched?.visualAnchor || profile?.visualAnchor || dossier?.ancragesVisuels || [];
  const [niche, groundPlan] = GROUND_PLANS[universeRank % GROUND_PLANS.length];
  const [typePlace, typePhysical] = TYPE_ENVIRONMENTS[type];
  const originalScene = authored && type === 'characterSolo'
    ? {
        location: authored.location,
        foreground: authored.foreground,
        midground: authored.midground,
        background: authored.background,
        lighting: authored.lighting
      }
    : {
        location: `${sourceSetting} — ${typePlace}, ${niche}`,
        foreground: `${typePhysical} Organisation spatiale propre à ce sujet : ${groundPlan}.`,
        midground: `Matériaux, végétation, objets fixes et échelle à dériver exclusivement des ancrages de ${hero.universe}; garder la silhouette du personnage entièrement lisible.`,
        background: `Profondeur originale du lieu source : ${sourceSetting}. Aucun fond uni, aucun motif de portail utilisé par défaut.`,
        lighting: 'Lumière cohérente avec les matériaux et l’époque de la source; décision finale après lecture de la référence.'
      };
  return {
    id: `cg-bg-${slug(hero.universe)}-${slug(hero.id)}-${slug(type)}`,
    characterId: hero.id,
    type,
    sourceSetting,
    sourceContext: anchors,
    characterContext: hero.incarnation || pilot?.continuityId || text(dossier?.nom),
    originalScene,
    sceneIsOriginal: true,
    status: 'proposed-needs-source-and-visual-review',
    description: Object.values(originalScene).join(' '),
    currentImageUsesThisBackground: false
  };
}

export async function buildCgRosterProductionPlan() {
  const arcs = await loadArcs();
  const arcByHero = new Map(arcs.map(arc => [arc.heroId, arc]));
  const dossierById = new Map(readJson('docs/rift-dossiers/catalog.json').entrees.filter(entry => entry.famille === 'arc-personnage').map(entry => [entry.id, entry]));
  const p0Entries = readJson(P0_AUDIT).entries;
  const p0ByHero = new Map(p0Entries.map(entry => [entry.id, entry]));
  const authored = readJson(BACKGROUND_BRIEFS);
  const references = ['franchises-a.json', 'franchises-b.json', 'franchises-c.json', 'original-universes.json'].flatMap(name => {
    const doc = readJson(`docs/rift-dossiers/references/${name}`);
    return Array.isArray(doc) ? doc : doc.entries;
  });
  const referencesByUniverse = new Map(references.map(ref => [ref.universe, ref]));
  const imageEvidence = loadImageEvidence();
  const qualifiedIdentityLocks = loadQualifiedCgIdentityLocks(ROOT);
  const pendingCharacterBriefs = loadPendingCharacterBriefs();
  const pilotSoloByHero = new Map(CG_CATALOG.filter(cg => cg.type === 'characterSolo').map(cg => [cg.characterId, cg]));
  const manifest = readJson('public/cg/cg-manifest.json');
  const deliveredById = new Map(manifest.entries.map(entry => [entry.id, entry]));
  const generated = readJson(GENERATED_REGISTRY);
  assert.equal(generated.schemaVersion, 1);
  assert.ok(Array.isArray(generated.entries));
  const generatedById = new Map(generated.entries.map(entry => [entry.id, entry]));
  assert.equal(generatedById.size, generated.entries.length, 'Duplicate generated roster CG ID');
  const revisionManifest = readJson(REVISION_REGISTRY);
  const revisionRegistry = createCgRevisionRegistry(revisionManifest);
  const revisionsByKey = new Map(revisionManifest.revisions.map(revision => [`${revision.cgId}/${revision.revisionId}`, revision]));
  const currentVersions = new Map(CG_GALLERY_CATALOG.map(definition => [definition.id,
    resolveCgVersions(definition, { unlockedHeroes: [definition.characterId] }, revisionRegistry)[0]
  ]));
  const applicability = generated.applicability || [];
  const reviewedNotApplicable = new Map();
  for (const cell of applicability) {
    assert.equal(cell.status, 'not-applicable');
    assert.ok(ROSTER_CG_SLOTS.some(slot => slot.slot === cell.slot));
    assert.ok(cell.characterId && cell.reason?.length > 20 && cell.sourceRefs?.length, 'A reviewed N/A requires a character, reason and source');
    const key = `${cell.characterId}/${cell.slot}`;
    assert.equal(reviewedNotApplicable.has(key), false, `Duplicate applicability record: ${key}`);
    reviewedNotApplicable.set(key, cell);
  }
  const heroes = [{ id: 'player_anchor', name: 'L’Ancre', universe: 'Nexus de Convergence' }, ...HEROES_DB];
  assert.equal(new Set(heroes.map(hero => hero.id)).size, heroes.length, 'Ancre must be counted exactly once.');
  const byUniverseRank = new Map();
  const subjects = [];
  const backgrounds = [];
  const entries = [];
  for (const hero of heroes) {
    const pilot = pilotSoloByHero.get(hero.id);
    const arc = arcByHero.get(hero.id);
    assert.ok(arc, `Missing character arc for ${hero.id}`);
    const dossier = dossierById.get(arc.stageId);
    assert.ok(dossier, `Missing character dossier for ${hero.id}`);
    const p0 = p0ByHero.get(hero.id);
    const rank = byUniverseRank.get(hero.universe) || 0;
    byUniverseRank.set(hero.universe, rank + 1);
    const identity = evidenceForSubject(hero, dossier, pilot, p0, imageEvidence.get(hero.id), qualifiedIdentityLocks.get(hero.id));
    const existing = CG_CATALOG.filter(cg => cg.characterId === hero.id);
    const definitions = rosterDefinitionsForHero(hero, existing, generated.entries.filter(entry => entry.characterId === hero.id));
    const subjectEntryIds = [];
    for (const definition of definitions) {
      const background = makeBackground({ hero, type: definition.type, universeRank: rank, dossier, researched: referencesByUniverse.get(hero.universe), authored: authored.p0?.[hero.id], pilot: definition });
      const delivered = deliveredById.get(definition.id);
      const newlyGenerated = generatedById.get(definition.id);
      const currentVersion = currentVersions.get(definition.id);
      const currentRevision = currentVersion?.revisionId !== 'catalog-original'
        ? revisionsByKey.get(`${definition.id}/${currentVersion?.revisionId}`) : null;
      const currentDelivery = currentRevision || newlyGenerated;
      let artwork = delivered || newlyGenerated;
      const slot = ROSTER_CG_SLOTS.find(slot => slot.types.includes(definition.type)).slot;
      const pendingBrief = !artwork && pendingCharacterBriefs.get(`${hero.id}/${slot}`);
      if (pendingBrief?.backgroundBrief) {
        background.originalScene.location = pendingBrief.backgroundBrief;
        background.description = Object.values(background.originalScene).join(' ');
        background.authoredBriefFile = pendingBrief.authoredBriefFile;
      }
      if (artwork) {
        for (const asset of Object.values(artwork.assets || {})) assert.ok(existsSync(publicFile(asset.path)), `Missing generated CG asset: ${asset.path}`);
        assert.equal(Object.keys(artwork.assets || {}).length, 3, `Three delivered assets required for ${definition.id}`);
      }
      if (newlyGenerated) {
        assert.equal(newlyGenerated.characterId, hero.id);
        assert.equal(newlyGenerated.type, definition.type);
        assert.equal(newlyGenerated.source, 'openai');
        assert.equal(newlyGenerated.generationMode, 'openai-imagegen-built-in');
        assert.ok(newlyGenerated.promptId && newlyGenerated.promptFile && newlyGenerated.referenceReviewFile);
        assert.ok(existsSync(path.join(ROOT, newlyGenerated.promptFile)), 'Missing generated CG prompt evidence');
        assert.ok(existsSync(path.join(ROOT, newlyGenerated.referenceReviewFile)), 'Missing generated CG visual-review evidence');
        const fingerprints = [];
        for (const [variant, asset] of Object.entries(newlyGenerated.assets)) {
          const bytes = readFileSync(publicFile(asset.path));
          assert.equal(digest(bytes), asset.sha256, `Generated CG fingerprint mismatch: ${asset.path}`);
          assert.equal(bytes.length, asset.bytes);
          const metadata = await sharp(bytes).metadata();
          assert.equal(metadata.channels, 3);
          assert.equal(metadata.hasAlpha, false);
          assert.equal(metadata.width, asset.width);
          assert.equal(metadata.height, asset.height);
          if (variant === 'source') {
            assert.equal(metadata.format, 'png');
            assert.equal(metadata.width * 4, metadata.height * 3);
            assert.ok(metadata.width >= 1000 && metadata.height >= 1300);
          } else {
            assert.equal(metadata.format, 'webp');
            assert.equal(metadata.width, variant === 'master' ? 1536 : 384);
            assert.equal(metadata.height, variant === 'master' ? 2048 : 512);
          }
          fingerprints.push(asset.sha256);
        }
        assert.equal(new Set(fingerprints).size, 3, 'CG source, master and thumbnail bytes must differ');
      }
      if (currentRevision) {
        // Older revision records predate asset fingerprints. Inspect the media
        // actually selected by the gallery rather than borrowing v1 metadata.
        const assets = {};
        for (const [variant, assetPath] of Object.entries({ source: currentVersion.sourcePath, master: currentVersion.imagePath, thumbnail: currentVersion.thumbnailPath })) {
          const bytes = readFileSync(publicFile(assetPath));
          const metadata = await sharp(bytes).metadata();
          assert.equal(metadata.channels, 3);
          assert.equal(metadata.hasAlpha, false);
          assert.equal(metadata.format, variant === 'source' ? 'png' : 'webp');
          assert.equal(metadata.width * 4, metadata.height * 3);
          if (variant === 'source') assert.ok(metadata.width >= 1000 && metadata.height >= 1300);
          else assert.deepEqual([metadata.width, metadata.height], variant === 'master' ? [1536, 2048] : [384, 512]);
          assets[variant] = { path: assetPath, sha256: digest(bytes), bytes: bytes.length, width: metadata.width, height: metadata.height, format: metadata.format, channels: metadata.channels };
          const recorded = currentRevision.assets?.[variant];
          if (recorded) {
            for (const field of ['path', 'sha256', 'bytes', 'width', 'height']) assert.equal(assets[variant][field], recorded[field], `Current revision ${variant}.${field} mismatch for ${definition.id}`);
          }
        }
        artwork = { ...currentRevision, assets };
        background.id = currentRevision.backgroundId || background.id;
        background.currentRevisionId = currentRevision.revisionId;
        background.currentImageBrief = currentRevision.backgroundDescription || text(currentRevision.promptSummary);
      }
      if (currentDelivery?.background) {
        for (const field of ['location', 'foreground', 'midground', 'background', 'lighting']) assert.ok(currentDelivery.background[field], `Missing delivered background ${field}`);
        assert.ok(currentDelivery.backgroundId, 'Delivered CG requires its distinct backgroundId');
        background.id = currentDelivery.backgroundId;
        background.sourceSetting = currentDelivery.background.location;
        background.originalScene = currentDelivery.background;
        background.description = Object.values(currentDelivery.background).join(' ');
        background.status = 'delivered-and-visually-reviewed';
        background.currentImageUsesThisBackground = true;
        background.reviewEvidence = currentDelivery.referenceReviewFile || REVISION_REGISTRY;
      }
      backgrounds.push(background);
      const status = artwork ? 'generated' : 'needs-reference';
      entries.push({
        id: definition.id,
        characterId: hero.id,
        type: definition.type,
        priority: p0 ? 'P0' : pilot ? 'pilot-existing' : 'P1',
        productionOrder: p0 ? p0Entries.findIndex(entry => entry.id === hero.id) : 25 + subjects.length,
        status,
        phase: pilot ? 'reuse-published-pilot' : definition.type === 'characterSolo' ? 'roster-character-solo' : 'roster-complete-series',
        backgroundId: background.id,
        backgroundVerifiedInCurrentImage: background.currentImageUsesThisBackground,
        poseId: currentDelivery?.poseId || `cg-pose-${slug(hero.id)}-${slot.toLowerCase()}${currentRevision ? `-${currentRevision.revisionId}` : ''}`,
        poseBrief: currentDelivery?.poseBrief || currentDelivery?.poseDescription || pendingBrief?.poseBrief || SLOT_POSE_BRIEFS[slot],
        poseStatus: currentDelivery?.poseBrief || currentDelivery?.poseDescription ? 'delivered-and-visually-reviewed' : 'proposed-pending-visual-check',
        themeBrief: currentRevision ? text(currentRevision.themeBrief || currentRevision.promptSummary) : pilot ? text(definition.promptSummary) : newlyGenerated ? deliveredTheme(newlyGenerated) : pendingBrief?.themeBrief || SLOT_THEME_TEMPLATES[slot],
        themeSource: currentRevision ? unique([REVISION_REGISTRY, ...(Array.isArray(currentRevision.themeSource) ? currentRevision.themeSource : [currentRevision.themeSource]), ...(currentRevision.sourceRefs || [])]) : pilot ? ['src/game/cg/cgCatalog.js', themeSourceForSlot(slot)] : newlyGenerated ? [newlyGenerated.referenceReviewFile, ...(newlyGenerated.sourceRefs || [])] : pendingBrief?.sourceRefs || unique([...identity.sourceRefs, themeSourceForSlot(slot)]),
        themeStatus: currentRevision ? 'documented-current-revision-theme' : pilot ? 'documented-pilot-theme' : newlyGenerated ? 'documented-delivered-roster-theme' : pendingBrief ? 'documented-character-brief-not-generated' : 'needs-reference',
        themeContinuity: currentDelivery?.continuityId || definition.continuityId || pendingBrief?.incarnation || identity.incarnation,
        ...(pendingBrief ? { backgroundBrief: pendingBrief.backgroundBrief, authoredBriefFile: pendingBrief.authoredBriefFile, generationEvidenceFile: pendingBrief.generationEvidenceFile, generationStatus: pendingBrief.generationStatus } : {}),
        currentAssets: artwork?.assets || null,
        currentRevisionId: currentVersion?.revisionId || null,
        plannedAssets: artwork ? null : { source: definition.imagePath.replace(/\.webp$/, '.png'), master: definition.imagePath, thumbnail: definition.thumbnailPath },
        galleryRegistered: Boolean(artwork),
        publishedPilotCatalog: Boolean(delivered),
        sourceEvidence: currentRevision ? REVISION_REGISTRY : delivered ? 'public/cg/cg-manifest.json' : newlyGenerated ? GENERATED_REGISTRY : null,
        promptBrief: currentRevision ? text(currentRevision.promptSummary) : pilot ? text(definition.promptSummary) : newlyGenerated ? text(newlyGenerated.promptSummary) : `${slot} ${definition.type} de ${hero.name}, ${hero.universe}. ${SLOT_THEME_TEMPLATES[slot]} Reproduire l’identité et les éléments de source après résolution des manques de référence. Décor propre : ${background.originalScene.location}. Source OpenAI, pixel-art 32-bit, ratio exact 3:4, une seule scène.`,
        fidelityReview: 'pending-new-1-to-1-review',
        missing: artwork ? [] : identity.missing,
        generatedImageCount: artwork ? 1 : 0
      });
      subjectEntryIds.push(definition.id);
    }
    const matrix = Object.fromEntries(ROSTER_CG_SLOTS.map(({ slot, types }) => {
      const matching = entries.find(entry => entry.characterId === hero.id && types.includes(entry.type));
      const foundationBackground = backgrounds.find(background => background.characterId === hero.id && background.type === 'characterSolo');
      const notApplicable = reviewedNotApplicable.get(`${hero.id}/${slot}`);
      const pendingBrief = (!matching || matching.status !== 'generated') && pendingCharacterBriefs.get(`${hero.id}/${slot}`);
      assert.ok(!(matching && notApplicable), `${hero.id}/${slot}: a delivered CG cannot also be N/A`);
      return [slot, matching ? {
        status: matching.status, type: matching.type, entryId: matching.id,
        generatedImageCount: matching.generatedImageCount,
        poseBrief: matching.poseBrief, themeBrief: matching.themeBrief,
        themeStatus: matching.themeStatus, themeSource: matching.themeSource,
        backgroundId: matching.backgroundId,
        ...(pendingBrief ? { backgroundBrief: pendingBrief.backgroundBrief, authoredBriefFile: pendingBrief.authoredBriefFile, generationEvidenceFile: pendingBrief.generationEvidenceFile, generationStatus: pendingBrief.generationStatus } : {})
      }
        : notApplicable ? { status: 'not-applicable-source-reviewed', selectedType: null, reason: notApplicable.reason, sourceRefs: notApplicable.sourceRefs }
          : pilot ? { status: 'not-applicable-in-published-pilot', selectedType: null, source: 'docs/cg/CG_VARIANT_WAVE_AUDIT.md' }
          : {
              status: 'needs-theme/reference', selectedType: pendingBrief?.type || null, typeOptions: types,
              poseBrief: pendingBrief?.poseBrief || SLOT_POSE_BRIEFS[slot],
              themeBrief: pendingBrief?.themeBrief || SLOT_THEME_TEMPLATES[slot],
              themeStatus: pendingBrief ? 'documented-character-brief-not-generated' : 'documented-template-character-theme-unresolved',
              themeSource: pendingBrief?.sourceRefs || [themeSourceForSlot(slot)],
              ...(pendingBrief ? { backgroundBrief: pendingBrief.backgroundBrief, authoredBriefFile: pendingBrief.authoredBriefFile, generationEvidenceFile: pendingBrief.generationEvidenceFile, generationStatus: pendingBrief.generationStatus } : {}),
              backgroundId: `cg-bg-${slug(hero.universe)}-${slug(hero.id)}-${slot.toLowerCase()}`,
              backgroundTemplateId: slot,
              environmentSourceId: foundationBackground.id,
              applicability: 'requires-source-and-character-review',
              generatedImageCount: 0
            }];
    }));
    subjects.push({
      characterId: hero.id,
      characterName: hero.name,
      universe: hero.universe,
      universeKey: slug(hero.universe),
      inHeroesDb: hero.id !== 'player_anchor',
      characterArcStageId: arc.stageId,
      priority: p0 ? 'P0' : pilot ? 'pilot-existing' : 'P1',
      p0Reason: p0?.reason || null,
      identity,
      entryIds: subjectEntryIds,
      matrix
    });
  }
  assert.equal(subjects.filter(subject => subject.priority === 'P0').length, 25);
  assert.equal(new Set(entries.map(entry => entry.id)).size, entries.length, 'CG ID collision');
  assert.equal(new Set(backgrounds.map(background => background.id)).size, backgrounds.length, 'Background ID collision');
  assert.equal(new Set(backgrounds.map(background => background.description)).size, backgrounds.length, 'Background scene descriptions must differ');
  assert.ok(generated.entries.every(entry => entries.some(expected => expected.id === entry.id)), 'Generated registry includes unknown or out-of-scope CG');
  assert.ok(applicability.every(cell => subjects.some(subject => subject.characterId === cell.characterId)), 'Applicability includes an unknown hero');
  const allCells = subjects.flatMap(subject => Object.values(subject.matrix));
  const notApplicableCount = allCells.filter(cell => cell.status.startsWith('not-applicable')).length;
  const summary = {
    heroesDbCount: HEROES_DB.length,
    anchorOutsideHeroesDb: true,
    totalSubjects: subjects.length,
    universes: new Set(heroes.map(hero => hero.universe)).size,
    p0Subjects: 25,
    publishedPilotSubjects: pilotSoloByHero.size,
    reusedPublishedCg: CG_CATALOG.length,
    additionalCharacterSoloTargets: subjects.length - pilotSoloByHero.size,
    additionalCharacterSoloGenerated: generated.entries.filter(entry => entry.type === 'characterSolo').length,
    additionalSeriesCgGenerated: generated.entries.filter(entry => entry.type !== 'characterSolo').length,
    totalProductionEntries: entries.length,
    generated: entries.filter(entry => entry.status === 'generated').length,
    ready: entries.filter(entry => entry.status === 'ready').length,
    needsReference: entries.filter(entry => entry.status === 'needs-reference').length,
    distinctBackgroundProposals: backgrounds.length,
    deliveredBackgroundsVisuallyReviewed: backgrounds.filter(background => background.currentImageUsesThisBackground).length,
    documentedSlotsPerSubject: 15,
    matrixCells: subjects.length * 15,
    matrixNotApplicablePilot: subjects.flatMap(subject => Object.values(subject.matrix)).filter(cell => cell.status === 'not-applicable-in-published-pilot').length,
    matrixNotApplicableSourceReviewed: reviewedNotApplicable.size,
    matrixNotApplicableTotal: notApplicableCount,
    matrixExtensionsAwaitingThemeReference: subjects.flatMap(subject => Object.values(subject.matrix)).filter(cell => cell.status === 'needs-theme/reference').length,
    totalRequestedSlotsNotProduced: subjects.length * 15 - notApplicableCount - entries.filter(entry => entry.status === 'generated').length
  };
  return {
    schemaVersion: 1,
    date: '2026-10-18',
    generator: 'scripts/buildCgRosterProductionPlan.mjs',
    scope: 'All HEROES_DB characters plus the separate player_anchor, all fifteen documented slots including their special themes and distinct poses. Reuse the 83 published pilot CGs; deliver each additional characterSolo first, then each applicable documented slot. Unresolved extension themes remain explicit needs-theme/reference targets, not omitted work or finished images.',
    statusDefinitions: {
      generated: 'Three real delivered files exist; existing images still require the newly requested 1:1 and distinct-background visual review.',
      ready: 'Reserved for a source-locked, visually reviewed reference and approved scene brief. No new hero is automatically ready from an old generated sprite or a historical web URL.',
      'needs-reference': 'No finished CG claimed; incarnation and visual source, then scene fidelity, must be closed before generation.'
    },
    rules: {
      preservePreviousArtworkAsVariants: true,
      oldSpritePresenceIsNotFidelityApproval: true,
      backgroundBriefIsNotAnExistingImage: true,
      delivery: 'One distinct built-in ImageGen call per accepted CG; inspect original resolution; PNG source exact 3:4, RGB WebP 1536×2048 and thumbnail 384×512.',
      extensionPolicy: 'All CG02–CG15 are requested and tracked with pose, thematic template, source and background identifiers. Resolve each character-specific theme and applicability from source after CG01; needs-theme/reference is outstanding production work, not completion. Respect anatomy, age and coherence; never merge mutually exclusive variants.',
      standaloneRosterRegister: GENERATED_REGISTRY
    },
    summary,
    slots: ROSTER_CG_SLOTS,
    extensionTemplates: ROSTER_CG_SLOTS.map(({ slot, types }) => ({
      id: slot,
      typeOptions: types,
      poseBrief: SLOT_POSE_BRIEFS[slot],
      themeBrief: SLOT_THEME_TEMPLATES[slot],
      themeSource: themeSourceForSlot(slot),
      backgroundOptions: types.map(type => ({ type, locationRole: TYPE_ENVIRONMENTS[type][0], physicalBrief: TYPE_ENVIRONMENTS[type][1] })),
      resolutionRule: 'Combine this physical scene template with the subject environmentSourceId and source-locked character; source and theme review must resolve an exact scene before generation. The template is not a canonical character-specific theme.'
    })),
    subjects,
    entries,
    backgrounds
  };
}

export function buildCgRosterProductionReport(plan) {
  const s = plan.summary;
  return `# Production CG — roster complet, 18 octobre 2026\n\nPérimètre : **${s.heroesDbCount} héros de HEROES_DB + l’Ancre séparée = ${s.totalSubjects} sujets**, répartis dans ${s.universes} univers. Les six personnages du pilote sont inclus. Aucun boss non jouable n’est ajouté.\n\n- ${s.reusedPublishedCg} CG publiées réutilisées pour les six sujets pilotes. Leur existence ne valide pas automatiquement la nouvelle demande de fidélité 1:1 ou de décor distinct.\n- ${s.additionalCharacterSoloTargets} nouveaux CG01 characterSolo constituent le socle du reste du roster; ${s.additionalCharacterSoloGenerated} CG01 et ${s.additionalSeriesCgGenerated} CG de séries supplémentaires sont réellement livrées dans le registre dédié.\n- Statuts : **${s.generated} generated, ${s.ready} ready, ${s.needsReference} needs-reference**. Aucun ancien sprite, numéro de décor, URL historique ou miniature de dossier n’est déclaré nouvelle CG terminée.\n- ${s.distinctBackgroundProposals} décors distincts associés, chacun avec backgroundId et description spatiale explicite; ${s.deliveredBackgroundsVisuallyReviewed} sont déjà liés à une nouvelle image livrée et revue. Les autres restent des propositions à confronter aux références puis à l’image finale, sans affirmation de nouveaux lieux canoniques.\n- Les **25 P0** de l’audit Wave4 passent en tête de production. Leurs substitutions historiques ne constituent pas une référence fidèle.\n- Matrice conservée : 15 emplacements × ${s.totalSubjects} sujets = **${s.matrixCells} cellules**; ${s.matrixExtensionsAwaitingThemeReference} extensions restent en needs-theme/reference et ${s.matrixNotApplicableTotal} N/A sont documentés (${s.matrixNotApplicablePilot} du pilote et ${s.matrixNotApplicableSourceReviewed} issus de la revue source du roster). Les choix CG13 et CG15 restent alternatifs. Chaque cellule applicable porte une pose distincte, un thème ou template documenté, sa source et un backgroundId. Les décors d’extension combinent leur template physique et environmentSourceId; ils attendent la résolution d’un thème propre au personnage avant génération. Au total, ${s.totalRequestedSlotsNotProduced} emplacements demandés restent non produits; le socle CG01 ne réduit pas ce périmètre.\n\nLes incarnations, équipements verrouillés, sources publiques, candidats visuels historiques, manques de référence et identifiants de dossier figurent par sujet dans [le manifeste JSON](./roster-production-2026-10-18.json). Les thèmes spéciaux du pilote restent ceux de leurs prompts documentés. Les thèmes livrés des nouveaux personnages portent leur source et leur statut Canon, Fan Art ou What If; les autres restent des propositions à résoudre; un template ne devient pas un thème canonique. Les poses proposées ne prétendent pas modifier une image déjà livrée. Les références distantes historiques ne sont ni téléchargées ni présentées comme images actuellement chargées. Les métadonnées de qualité bitmap ne certifient pas la ressemblance.\n\n## Ordre P0\n\n| Personnage | Univers | Incarnation | État CG01 |\n|---|---|---|---|\n${plan.subjects.filter(subject => subject.priority === 'P0').sort((a, b) => plan.entries.find(e => e.characterId === a.characterId).productionOrder - plan.entries.find(e => e.characterId === b.characterId).productionOrder).map(subject => `| ${subject.characterName} | ${subject.universe} | ${subject.identity.incarnation || 'À choisir dans la source'} | ${subject.matrix.CG01.status} |`).join('\n')}\n\n## Reproduction\n\n\`node scripts/buildCgRosterProductionPlan.mjs\` produit JSON et rapport.\n\`node scripts/buildCgRosterProductionPlan.mjs --check\` vérifie leur synchronisation.\n\`node --test scripts/cgRosterProductionPlan.test.mjs\` vérifie couverture, matrice, priorités, décors et absence de fausses livraisons.\n\nLe registre [cgRosterArtwork.generated.json](../../src/game/cg/cgRosterArtwork.generated.json) n’accepte que des CG réellement générées avec trois fichiers existants, empreintes SHA-256, prompt et compte rendu de référence. La galerie et le catalogue des 83 CG restent gérés séparément.\n`;
}

// Keep one complete subject/CG/background per line. The full roster is large;
// this is reviewable and avoids hundreds of thousands of matrix-only lines.
export function serializeCgRosterProductionPlan(plan) {
  const { subjects, entries, backgrounds, ...header } = plan;
  return `${JSON.stringify(header, null, 2).slice(0, -2)},\n${[
    ['subjects', subjects], ['entries', entries], ['backgrounds', backgrounds]
  ].map(([key, rows]) => `  "${key}": [\n${rows.map(row => `    ${JSON.stringify(row)}`).join(',\n')}\n  ]`).join(',\n')}\n}\n`;
}

async function main() {
  const plan = await buildCgRosterProductionPlan();
  const files = [[JSON_OUTPUT, serializeCgRosterProductionPlan(plan)], [REPORT_OUTPUT, buildCgRosterProductionReport(plan)]];
  for (const [name, content] of files) {
    if (process.argv.includes('--check')) assert.equal(readFileSync(path.join(ROOT, name), 'utf8'), content, `${name} is stale; run node scripts/buildCgRosterProductionPlan.mjs`);
    else writeFileSync(path.join(ROOT, name), content);
  }
  console.log(JSON.stringify(plan.summary, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
