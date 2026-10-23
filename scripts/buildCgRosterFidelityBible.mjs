import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEROES_DB } from '../src/game/heroes.js';
import { EXPANDED_UNIVERSES } from '../src/game/expandedUniverses.js';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';
import { STAGE_LORE_PROFILES } from '../src/game/stageLoreProfiles.js';
import { CORRECTED_HERO_SPRITE_VARIANTS, getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { discoverCgSourceEvidenceFiles, loadCgSourceEvidence, loadQualifiedCgIdentityLocks } from './cgSourceEvidence.mjs';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const OUTPUT = 'docs/cg/roster-fidelity-bible-2026-10-18.json';
const AUTHOR_FILE = 'docs/cg/roster-fidelity-authored-locks-2026-10-18.json';
const read = file => JSON.parse(readFileSync(path.resolve(ROOT, file), 'utf8'));
const optional = file => existsSync(path.resolve(ROOT, file)) ? read(file) : null;
const text = value => typeof value === 'string' ? value : value?.fr || value?.en || '';
const unique = values => [...new Set(values.filter(Boolean))];
const cgSlotKey = value => `CG${String(value).replace(/^CG/i, '').padStart(2, '0')}`;
const deliveredTheme = entry => {
 if (!entry?.themeBrief) return '';
 const brief = text(entry.themeBrief);
 if (brief.length >= 20) return brief;
 const detail = text(entry.promptSummary);
 return detail.includes(brief) ? detail : unique([brief, detail]).join(' — ');
};
const publicFile = value => path.resolve(ROOT, 'public', value.replace(/^\//, '').replace(/^public\//, ''));
const localFile = value => /^\/(?:sprites|cg|visuals|images)\//.test(value) ? publicFile(value) : path.isAbsolute(value) && existsSync(value) ? value : path.resolve(ROOT, value.replace(/^\//, ''));
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const generic = value => !value || /preserving the canonical silhouette, (palette|material language)/i.test(value) || /^(Lead character|Gameplay archetype|Signature weapon type|Primary costume|Secondary costume)/i.test(value);
const count = (values, key) => Object.fromEntries(unique(values.map(key)).sort().map(label => [label, values.filter(v => key(v) === label).length]));
const plan = read('docs/cg/roster-production-2026-10-18.json');
const authorDocument = read(AUTHOR_FILE);
const authored = authorDocument.characters;
const universeTargets = authorDocument.universeTargets || {};
const sourceRecords = read('public/sprites/generated/sprite-reference-sources.json').entries;
const manifest = read('public/sprites/generated/sprite-manifest.json').entries;
const originals = read('src/game/originalUniversesManifest.json').universes;
const revisions = read('src/game/cg/cgRevisions.generated.json');
const revisionRows = Array.isArray(revisions) ? revisions : revisions.revisions || revisions.entries || [];
const cgRows = read('src/game/cg/cgRosterArtwork.generated.json');
const rosterArt = Array.isArray(cgRows) ? cgRows : cgRows.entries || [];
const heroes = new Map(HEROES_DB.map(h => [h.id, h]));
const subjectsById = new Map(plan.subjects.map(subject => [subject.characterId, subject]));
const packs = new Map([...EXPANDED_UNIVERSES, ...CANON_ROSTER_WAVE].map(p => [p.universe, p]));
const manifestById = new Map(manifest.filter(row => row.kind === 'hero').map(row => [row.id, row]));
const refsByOutput = new Map(sourceRecords.map(row => [row.output, row]));
const originalByUniverse = new Map(originals.map(u => [u.universe, u]));
const specificReviews = new Map();
for (const name of ['liquid-snake', 'mistral-mgr', 'true-ogre-tekken', 'saturnin-duck']) {
 const file = `docs/cg/reviews/fidelity-2026-10-18/${name}.json`;
 const review = optional(file);
 if (review) specificReviews.set(review.heroId, { ...review, file });
}
const completionPlans = new Map();
for (const filename of readdirSync(path.resolve(ROOT, 'docs/cg')).filter(n => /(?:complete-plan|wave\d+-plan)-\d{4}-\d{2}-\d{2}\.json$/.test(n)).sort()) {
 const doc = read(`docs/cg/${filename}`);
 const id = doc.heroId || doc.characterId;
 if (id && Array.isArray(doc.slots)) completionPlans.set(id, { ...doc, file: `docs/cg/${filename}` });
}
const independentRefs = new Map();
const evidenceByHero = new Map([...loadCgSourceEvidence(ROOT)].filter(([id]) => subjectsById.has(id)));
const qualifiedIdentityLocks = loadQualifiedCgIdentityLocks(ROOT);
const selectedSpriteFindings = new Map();
for (const relative of readdirSync(path.resolve(ROOT, 'docs/cg/reviews'), { recursive: true }).filter(name => name.endsWith('selected-roster-visual-priorities.json')).sort()) {
 const file = `docs/cg/reviews/${relative}`;
 for (const finding of optional(file)?.findings || []) selectedSpriteFindings.set(finding.characterId, { ...finding, evidenceFile: file });
}
const correctedSpriteAudits = new Map();
for (const filename of readdirSync(path.resolve(ROOT, 'docs/audits')).filter(name => /-reference-sprite-fidelity-(?:wave\d+-)?\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort()) {
 const file = `docs/audits/${filename}`;
 for (const entry of read(file).entries || []) if (entry.kind === 'hero' && entry.id) correctedSpriteAudits.set(entry.id, [...(correctedSpriteAudits.get(entry.id) || []), { ...entry, file }]);
}
const technicalSpritePackings = new Map();
for (const filename of readdirSync(path.resolve(ROOT, 'docs/audits')).filter(name => /-frame-packing-runtime-\d{4}-\d{2}-\d{2}\.json$/.test(name)).sort()) {
 const file = `docs/audits/${filename}`;
 const receipt = read(file);
 const preparation = receipt.preparationReceipt?.path ? optional(receipt.preparationReceipt.path) : null;
 const review = receipt.independentReview?.path ? optional(receipt.independentReview.path) : null;
 const pinned = ref => ref?.path && ref.sha256 && existsSync(localFile(ref.path)) && hash(localFile(ref.path)) === ref.sha256;
 if (receipt.characterId && receipt.status === 'installed-after-independent-technical-review' && receipt.newImageGenerationUsed === false && receipt.semanticArtworkCreated === false && pinned(receipt.preparationReceipt) && pinned(receipt.independentReview) && pinned(preparation?.source) && pinned(preparation?.output) && /^accepted/.test(review?.status || '') && review.summary?.framesAccepted === 16 && review.summary?.openIssues === 0) {
  technicalSpritePackings.set(receipt.characterId, { ...receipt, file, preparation });
 }
}
function addIndependent(id, reference, file) {
 reference = { ...reference, path: reference.path || reference.localPath, url: reference.url || reference.imageUrl, viewed: reference.viewed === true || reference.visuallyInspected === true };
 if (reference.excluded === true || reference.excludedFromGeneration === true || !reference.path || !/\.(?:png|jpe?g|webp|gif|avif|svg|pdf)$/i.test(reference.path) || !existsSync(localFile(reference.path))) return;
 const rows = independentRefs.get(id) || [];
 const hasExternalSource = /^https?:/.test(reference.finalUrl || reference.url || '');
 const hero = heroes.get(id);
 const universe = hero?.universe || subjectsById.get(id)?.universe;
 const originalCharacter = originalByUniverse.has(universe) || hero?.originalContent === true || hero?.contentOrigin === 'oc' || hero?.sourceType === 'original' || hero?.sourceIdentityType === 'project-original-adaptation' || ['Nexus de Convergence', 'Michael Jackson'].includes(universe);
 const outfitOnly = reference.referenceScope === 'iconic-outfit-only' || reference.referencePurpose === 'costume-only' || /iconic.*outfit|outfit.*reference/.test(reference.role || '');
 const equipmentOnly = reference.referencePurpose === 'equipment-only';
 const environmentOnly = reference.referencePurpose === 'environment-only' || /location-art|environment-reference/.test(reference.role || '');
 const costumeSupport = reference.referencePurpose === 'body-costume-support';
 const derivedInspection = /derived.*inspection|inspection.*crop/i.test(reference.role || '');
 const canonicalOriginalReference = !hasExternalSource && originalCharacter && /canonical.*original.*(?:sprite|portrait)/i.test(reference.role || '');
 const canonicalOriginalEnvironment = !hasExternalSource && originalCharacter && environmentOnly && reference.role === 'original-project-environment-reference';
 const canonicalOriginalRole = /portrait/i.test(reference.role || '') ? 'canonical-original-project-portrait' : 'canonical-original-project-sprite-pack';
 const independentRole = outfitOnly ? 'independent-iconic-outfit-reference' : equipmentOnly ? 'independent-equipment-reference' : environmentOnly ? 'independent-environment-reference' : costumeSupport ? 'independent-costume-support-reference' : 'independent-canon-reference';
 rows.push({ path: reference.path, url: reference.finalUrl || reference.url || null,
  role: derivedInspection ? 'derived-source-inspection-crop' : hasExternalSource ? independentRole : canonicalOriginalReference ? canonicalOriginalRole : canonicalOriginalEnvironment ? 'original-project-environment-reference' : 'project-generated-art',
  referencePurpose: reference.referencePurpose || (outfitOnly ? 'costume-only' : equipmentOnly ? 'equipment-only' : environmentOnly ? 'environment-only' : reference.usedForIdentity === false ? 'historical-comparison-only' : 'identity'), referenceScope: reference.referenceScope || null, slot: reference.slot || null,
  referenceCharacter: reference.referenceCharacter || null,
  sourceReferenceRole: reference.role || null, canonicalProjectReference: canonicalOriginalReference || canonicalOriginalEnvironment, ...(canonicalOriginalEnvironment ? { sourceScope: 'original-project-canon' } : {}), exists: true,
  viewed: reference.viewed === true,
  status: derivedInspection ? 'derived-from-existing-reference-not-independent-source' : hasExternalSource ? reference.viewed === true ? 'historically-viewed-not-1to1-approval' : 'downloaded-needs-inspection' : canonicalOriginalReference ? 'original-project-canon-reference-not-independent-source' : canonicalOriginalEnvironment ? 'original-project-canon-environment-reference-not-independent-source' : 'generated-project-reference-not-independent-source', sourceFile: file,
  sha256: reference.sha256 || hash(localFile(reference.path)), limitations: reference.limitations || null });
 independentRefs.set(id, rows);
}
for (const [id, review] of specificReviews) for (const ref of review.references || []) addIndependent(id, ref, review.file);
// New series publish source receipts independently of the generated artwork.
// Excluded references (e.g. a Leia image in a Vader search) never qualify.
const additionalEvidenceFiles = discoverCgSourceEvidenceFiles(ROOT);
for (const [id, evidence] of evidenceByHero) {
 evidence.file ||= evidence.sourceEvidenceFiles.at(-1) || evidence.files.at(-1);
 for (const ref of evidence.references || []) addIndependent(id, ref, ref.sourceFile || evidence.file);
}
const workbookReferenceFile = 'docs/cg/workbook-visual-comparisons-2026-10-18.json';
for (const ref of optional(workbookReferenceFile)?.references || []) {
 if (subjectsById.has(ref.characterId)) addIndependent(ref.characterId, ref, workbookReferenceFile);
}
for (const revision of revisionRows) {
 const ref = revision.iconicOutfitReference;
 if (!ref) continue;
 const owner = rosterArt.find(entry => entry.id === revision.cgId) || plan.entries.find(entry => entry.id === revision.cgId);
 if (!owner?.characterId) continue;
 addIndependent(owner.characterId, { ...ref, path: ref.path || ref.localPath, url: ref.imageUrl || ref.url,
  referenceScope: 'iconic-outfit-only' }, 'src/game/cg/cgRevisions.generated.json');
}
const minionFile = '.tmp/fidelity-2026-10-18/minions/universal-reference-metadata.json';
for (const ref of optional(minionFile) || []) for (const id of ['bob_minions', 'kevin_minions', 'stuart_minions']) {
 addIndependent(id, { ...ref, path: `.tmp/fidelity-2026-10-18/minions/${ref.path}` }, minionFile);
}
const kellyFile = 'docs/audits/fidelity-spider-kelly-source-review-2026-10-18.json';
const kellyReview = optional(kellyFile);
for (const [index, ref] of (kellyReview?.references || []).entries()) addIndependent('cyber_spider_kelly', { ...ref, path: `.tmp/fidelity-spider-kelly-2026-10-18/references/${index ? 'body-gameplay.jpg' : 'body-cover.jpg'}`, limitations: 'Vue partielle, insuffisante pour le comptage des pattes, implant et Slasher.' }, kellyFile);

const visualMatchers = {
 silhouette: /lean|swift|silhouette|proportio|grand|petit|large|court|long|tall|short|round|slim|massif|forme|shape|body|corp|hologram|quadru|robot|plant|doll|caneton|spherical|cubiqu/i,
 anatomy: /humain|human|alien|sangheili|mandib|bras|arms|leg|jamb|main|hand|wing|ailes|queue|tail|patt|griff|claw|quadru|robot|cyborg|plant|doll|caneton|oeil|œil|eye|tête|head|memb|anthropo|cubiqu/i,
 costume: /pressure cloth|mantle|layers|cyborg body|tenue|costume|outfit|wear|armou?r|armure|suit|uniform|shirt|manteau|coat|boot|robe|dress|veste|jacket|jupe|skirt|gants|gloves|cape|treillis|casque|helmet|tunic|tablier|overall|salopette|écharpe|scarf/i,
 palette: /teal|amber|brass|couleur|color|palette|bleu|blue|rouge|red|vert|green|jaune|yellow|orange|noir|black|blanc|white|gris|gray|grey|olive|cyan|or |gold|rose|pink|violet|purple|brun|brown|blond|argent|silver|#\w{6}/i,
 face: /visage|face|cheveu|hair|œil|oeil|eye|bouche|mouth|barbe|beard|moustache|casque|helmet|vis[ièe]r|goggle|lunette|antenne|mandib|bec|beak|nez|nose|cicatrice|scar|bald|chauve|masque|mask|hair/i,
 distinguishingMarks: /cicatrice|scar|tattoo|tatouage|embl[eè]me|mark|proth[eè]se|prosthe|cache|œil|oeil|eye|corn|horn|antenn|bra[s ]droit|bra[s ]gauche|left|right|aile|wing|queue|tail|asym|bandana|bandeau|heterochrom/i
};
function splitDetails(anchor, key) {
 return unique(String(anchor || '').split(/(?<=[.!?;])\s+|\s*\|\s*/).filter(line => visualMatchers[key].test(line))).slice(0, 8);
}
function source(urlOrPath, role, file, status = 'historical-repo-record-not-reopened') {
 return /^https?:/.test(urlOrPath) ? { url: urlOrPath, role, sourceFile: file, status } : { path: urlOrPath, role, sourceFile: file, status };
}
const missingAxis = label => [`${label} : détail non établi dans les données de référence de ce personnage; comparer la cible à un visuel source indépendant avant validation.`];
const specialSlots = new Set(['CG09', 'CG10', 'CG11', 'CG12', 'CG13', 'CG14', 'CG15']);
const authoredBackground = cell => cell?.background && typeof cell.background === 'object'
 ? unique(['location', 'foreground', 'midground', 'background', 'lighting'].map(key => cell.background[key])).join(' ; ')
 : typeof cell?.background === 'string' ? cell.background : '';

const subjects = plan.subjects.map(subject => {
 const hero = heroes.get(subject.characterId) || { id: subject.characterId, name: subject.characterName, universe: subject.universe };
 const pack = packs.get(subject.universe);
 const originalRecord = originalByUniverse.get(subject.universe);
 const isProjectOriginal = !!originalRecord || hero.originalContent === true || hero.contentOrigin === 'oc' || hero.sourceType === 'original' || hero.sourceIdentityType === 'project-original-adaptation' || subject.universe === 'Nexus de Convergence' || subject.universe === 'Michael Jackson';
 const original = originalRecord || (isProjectOriginal ? { universe: subject.universe, heroes: [hero] } : null);
 const universeTarget = universeTargets[subject.universe];
 const originalHero = original?.heroes?.find(h => h.id === hero.id);
 const manifestRow = manifestById.get(hero.id);
 const refRecord = refsByOutput.get(manifestRow?.output);
 const dossierFile = `public/visuals/cosmetics/openai/universes/${subject.universeKey}/reference-dossier.json`;
 const dossier = optional(dossierFile);
 const dossierIsThisHero = !!dossier && [hero.name, subject.characterName].includes(dossier.leadHeroName);
 const proposal = authored[hero.id];
 const sourceEvidence = evidenceByHero.get(hero.id);
 const qualifiedSource = qualifiedIdentityLocks.get(hero.id);
 const review = specificReviews.get(hero.id);
 const pilot = subject.priority === 'pilot-existing';
 const sourceAnchor = generic(hero.visualAnchor) ? '' : hero.visualAnchor;
 const proposalAnchor = sourceEvidence?.incarnation && Object.keys(sourceEvidence.visualLocks || {}).length ? '' : proposal?.identityLock || '';
 const dossierAnchors = dossierIsThisHero ? (dossier.heroAnchors || []).filter(a => !generic(a) && !/^Approved local/.test(a)) : [];
 const sourceIncarnation = sourceEvidence?.incarnation || hero.incarnation || (refRecord?.incarnation && !/preserving the canonical/.test(refRecord.incarnation) ? refRecord.incarnation : '') || pack?.continuity || '';
 const pilotIncarnation = pilot ? subject.identity?.incarnation : '';
 let incarnationLabel = pilotIncarnation || sourceIncarnation || proposal?.incarnation || (universeTarget ? `${hero.name} — ${universeTarget.sourceWork}` : '') || (dossierIsThisHero ? dossier.continuityId || dossier.installment : '') || '';
 let incarnationStatus = pilotIncarnation ? 'published-pilot-target-not-perfect-fidelity-approval' : sourceIncarnation ? 'documented-in-project-source-record' : proposal?.incarnation ? 'proposed-production-incarnation' : incarnationLabel ? 'lead-dossier-incarnation-candidate' : original ? 'original-project-canon' : 'source-work-known-incarnation-to-resolve';
 if (universeTarget && !pilotIncarnation && !sourceIncarnation && !proposal?.incarnation) incarnationStatus = 'proposed-universe-scope-needs-character-incarnation-check';
 if (original) { incarnationLabel = sourceEvidence?.incarnation || `${original.universe} — ${hero.name}, canon original du projet (2026)`; incarnationStatus = 'original-project-canon'; }
 if (!incarnationLabel) incarnationLabel = `${subject.characterName} — ${subject.universe}; époque et version précises à fixer`;
 if (hero.id === 'saturnin_duck') { incarnationLabel = 'Les Aventures de Saturnin, RTF/ORTF 1965–1970 — vrai caneton filmé en décors miniatures'; incarnationStatus = 'primary-ina-source-identity-record'; }
 const originalSpriteAnchor = isProjectOriginal && hero.spritePrompt ? hero.spritePrompt.replace(/^Entirely original character for Multiverse Breach, no existing franchise reference\.\s*/i, '').split(/Complete 4 by 4|No text|No copied|exact 4x4|Full 4x4/i)[0].trim() : '';
 const evidenceVisualLocks = sourceEvidence?.visualLocks || {};
 const authoritativeVisualEvidence = sourceEvidence?.incarnation && Object.keys(evidenceVisualLocks).length;
 const anchorParts = unique([...(authoritativeVisualEvidence ? [] : [sourceAnchor, proposalAnchor, originalSpriteAnchor]), ...Object.values(evidenceVisualLocks).flat(), ...dossierAnchors, originalHero?.loreRole, ...(!authoritativeVisualEvidence && subject.identity?.identityLock && !generic(subject.identity.identityLock) ? [subject.identity.identityLock] : [])]);
 if (hero.id === 'player_anchor') anchorParts.unshift('Humanoïde original adulte à deux bras et deux jambes, visage entièrement couvert par casque fermé sombre à visière jaune étroite; armure charbon et manteau à longs pans fendus. Gantelet mécanique cyan A.R.C.A. sur le bras anatomique gauche, conformément au visuel projet comparé le18octobre2026.');
 if (hero.id === 'mistral_mgr') anchorParts.unshift('Mistral Revengeance2013 : jambe anatomique droite rouge (à gauche pour le spectateur de face), jambe gauche noire, corps cyborg asymétrique et deux lames argent étroites pour L’Étranger; bras DwarfGekko surnuméraires en couronne, nombre/configuration à comparer au rendu officiel miroir.');
 const identityLock = anchorParts.join(' ');
 const detailText = anchorParts.join(' | ');
 const visual = {};
 for (const key of Object.keys(visualMatchers)) visual[key] = splitDetails(detailText, key);
 for (const key of Object.keys(visualMatchers)) if (evidenceVisualLocks[key]) visual[key].unshift(...[evidenceVisualLocks[key]].flat());
 const explicitEquipment = hero.id === 'player_anchor' ? ['Gantelet mécanique cyan A.R.C.A. sur le bras anatomique gauche; accessoire isolé complet pour CG02, sans main ni avant-bras coupé.'] : qualifiedSource?.equipment?.length ? qualifiedSource.equipment : hero.equipment || subject.identity?.equipment || [];
 visual.equipment = explicitEquipment.length ? [...explicitEquipment] : unique(detailText.split(/(?<=[.!?;])\s+|\s*\|\s*/).filter(a => /MA40|MA5C|M392|ASHPD|Nornfang|Oathsworn|Dominator|Gunblade|shuriken|fouet|harpoon|sonar|gantelet|gauntlet|arme|gun|pistol|rifle|fusil|sabre|sword|épée|bâton|staff|weapon|bouclier|shield|lance|polearm|micro|blaster|knife|blade|launcher|couteau|cyberdeck|\bbow\b|spear|\bFocus\b|\barc\b/i.test(a)));
 const pilotEquipment = { masterchief: ['Fusil d’assaut MA40 (HaloInfinite) ; pas le MA5C du vieux manifeste Halo3.'], arbiter: ['Épée à énergie Sangheili bleue, deux lames et poignée alien; doigts et proportions de ThelVadam.'], leon: ['Pistolet VP70 de Leon RE2original1998, holster et ceinturon de recrue RPD.'], jill: ['Pistolet SamuraiEdge de Jill S.T.A.R.S., holster et équipement RE1HD.'], wesker: ['Pistolet SamuraiEdge de Wesker RE5 humain, lunettes noires et gants noirs.'] };
 if (pilotEquipment[hero.id]) visual.equipment = pilotEquipment[hero.id];
 if (evidenceVisualLocks.equipment) visual.equipment = [evidenceVisualLocks.equipment].flat();
 const forbiddenSentences = detailText.split(/(?<=[.!?;])\s+|\s*\|\s*/).filter(a => /\b(ne pas|aucun|pas |never|without|not |no |ni |exclude|excluding)\b/i.test(a));
 visual.forbiddenMixes = unique([...(hero.prohibitedConcepts || []), ...forbiddenSentences, ...(pack?.fidelityNotes ? [pack.fidelityNotes] : []),
  `Ne pas fusionner plusieurs continuités ou variantes de ${subject.characterName}; toute transformation spéciale garde son étiquette WhatIf.`,
  'Les armes, rayons, couleurs et catégories du gameplay ne prouvent pas un équipement ou pouvoir canonique.',
  ...(hero.id === 'mj_performer' || hero.id === 'rhythm_guard_mj' ? ['Avatar original du projet : préserver cette identité et sa silhouette propres, sans substitution automatique par une célébrité réelle.'] : [])]);
 const HUMAN_P0 = new Set(['harry','hermione','luke','han_solo','joker_n52','harley_n52','batman_n52','grim_knight','mj_performer','rhythm_guard_mj','jack_sparrow_potc','batman_tdk','lilo_pelekai']);
 if (hero.id === 'liquid_snake') { visual.anatomy.unshift('Homme humain adulte, deux bras et deux jambes, torse nu et proportions de Liquid dans le duel final MGS11998.'); visual.equipment = ['Tenue duel : ceinture noire et bottes militaires noires isolables ; poings = anatomie, pas arme détachable. Aucun FAMAS attribué sans source.']; }
 if (hero.id === 'player_anchor') visual.distinguishingMarks.unshift('Visière jaune étroite, petits fermoirs jaunes et gantelet cyan asymétrique au bras gauche; visage caché.');
 if (hero.id === 'mistral_mgr') visual.costume.unshift('Corps cyborg ajusté noir, plaques chrome/ivoire asymétriques, détails rouges; jambe droite rouge et jambe gauche noire d’après rendu promotionnel miroir inspecté.');
 if (HUMAN_P0.has(hero.id)) visual.anatomy.unshift(hero.id === 'lilo_pelekai' ? 'Petite fille humaine, deux bras et deux jambes; proportions enfantines du film2D2002.' : 'Anatomie humanoïde à deux bras et deux jambes; âge et proportions de l’incarnation indiquée, aucune armure/mutation anatomique ajoutée.');
 if (hero.id === 'roger_rabbit') visual.equipment = ['Salopette rouge à boutons jaunes, nœud papillon bleu à pois jaunes et gants jaunes ; corps Toon = anatomie, pas objet détachable.'];
 if (hero.id === 'raven_tt') visual.equipment = ['Cape à capuche bleu-violet et fermoir rouge ; pouvoirs mystiques = capacité, pas fusil ou objet isolable inventé.'];
 if (hero.id === 'starfire_tt') visual.equipment = ['Bracelets argent à gemmes vertes et collier argent du costume animé2003 ; starbolts = capacité Tamaranean, pas arme à feu.'];
 if (hero.id === 'vader') visual.anatomy.unshift('Humanoïde humain cybernétique adulte, deux bras/deux jambes, casque respiratoire fermé; aucune tête ou bouche humaine visible.');
 if (hero.id === 'roger_rabbit') visual.anatomy.unshift('Lapin cartoon bipède blanc, deux bras à mains gantées, deux jambes et deux longues oreilles; élasticité Toon, pas anatomie humaine réaliste.');
 if (hero.id.startsWith('cyber_spider_')) visual.anatomy.unshift('Arachnide organique minuscule à huit pattes, appendices mécaniques fixés aux pattes avant; pas insecte à six pattes ni robot à dôme. Géométrie précise du modèle et implant facial encore à vérifier.');
 if (hero.id === 'saturnin_duck') { visual.silhouette.unshift('Petit vrai caneton jaune au corps rond duveteux, cou court et petit bec orange.'); visual.face.unshift('Deux petits yeux noirs et bec orange naturel, pas visage humain.'); visual.distinguishingMarks.unshift('Identité portée par le duvet jaune, le bec orange et les pattes palmées; aucun vêtement permanent ajouté.'); visual.costume.unshift('Sans vêtement permanent; accessoires d’une scène seulement attestés ou marqués originaux.'); visual.anatomy.unshift('Vrai caneton jaune, deux ailes et deux pattes palmées, bec orange; pas de mains humaines, pas de marionnette.'); visual.equipment = ['Aucune arme canonique; accessoires miniatures de scène seulement si attestés ou explicitement imaginés en WhatIf.']; }
 if (hero.id === 'true_ogre_tekken') { visual.face.unshift('Tête bestiale à grande corne frontale et crinière brune, museau monstrueux; pas visage humain Ogrepremièreforme.'); visual.costume.unshift('Aucun costume humain : peau reptilienne olive tachetée, crinière et ailes membraneuses constituent sa silhouette.'); }
 if (hero.id === 'true_ogre_tekken') visual.equipment = ['Aucune arme détachable documentée pour Tekken3; le bras-serpent appartient au corps et ne devient pas un équipement CG02.'];
 const detailedAxes = Object.keys(visualMatchers).filter(key => visual[key].length);
 for (const key of Object.keys(visualMatchers)) if (!visual[key].length) visual[key] = missingAxis(key);
 if (!visual.equipment.length) visual.equipment = ['Aucun équipement distinct établi pour cette incarnation; CG02 à adapter ou déclarer N/A plutôt que reprendre une arme générique du gameplay.'];
 visual.outfit = visual.costume;
 const stageProfile = STAGE_LORE_PROFILES[subject.universe] || pack?.stageLoreProfile;
 const backdrop = plan.backgrounds.find(b => b.characterId === subject.characterId && b.type === 'characterSolo');
 const canonicalStage = stageProfile?.canonicalName || dossier?.canonicalStage || dossier?.canonicalMotif || pack?.stageName || pack?.stage || backdrop?.sourceSetting || '';
 const anchor = stageProfile?.visualAnchor || pack?.visualAnchor || dossier?.visualAnchors || dossier?.ancragesVisuels || backdrop?.sourceContext || [];
 const world = {
  sourceWork: original ? original.universe : sourceEvidence?.sourceWork || sourceEvidence?.incarnation || proposal?.incarnation || hero.incarnation || pack?.continuity || universeTarget?.sourceWork || dossier?.installment || subject.universe,
  period: incarnationLabel,
  locations: unique([text(canonicalStage), ...(original?.stages || []).map(s => `${text(s.name)} — ${text(s.setting)}`)]),
  architecture: unique([...(typeof anchor === 'string' ? [anchor] : Array.isArray(anchor) ? anchor : Object.values(anchor || {})), ...(dossier?.materials || [])].map(text)),
  palette: unique([...(dossier?.palette || []), ...(pack?.colors || []), ...(original?.visual?.colors ? Object.entries(original.visual.colors).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`) : [])]),
  props: (pack?.gear || []).map(item => Array.isArray(item) ? `${text(item[1])} — ${item[4]?.visualAnchor || ''}` : text(item.name)).filter(Boolean).slice(0, 6).map(prop => `Contexte partagé de l’univers, pas équipement attribué à ${subject.characterName} : ${prop}`),
  boundaries: unique([universeTarget?.boundary, pack?.canonProfile?.adaptationRule, pack?.fidelityNotes, original ? 'Univers original autonome : aucune importation d’identité, objet ou divinité d’une licence tierce.' : `Conserver matières, architecture, technologie et période de ${subject.universe}.`,
   'Un décor original cohérent ne certifie pas la reconstitution d’un lieu précis ou d’un épisode.',
   ...(hero.id === 'mistral_mgr' ? ['Mistral affronte Raiden à Sukhumi/Abkhazie; la raffinerie mexicaine inscrite dans CG01 historique est une incohérence de lieu à corriger, pas un lieu canon Mistral.', 'Nombre des bras montés à contrôler sur modèle : source designer PlatinumGames dit environ une douzaine de bras DwarfGekko, distincts des mains composant L’Étranger; pas comptage16 garanti.'] : []),
   ...(hero.id === 'saturnin_duck' ? ['Saturnin est un vrai caneton filmé, pas une marionnette; scènes miniatures et accessoires originaux doivent rester distingués des accessoires attestés à l’écran.'] : []),
   ...(hero.id === 'true_ogre_tekken' ? ['Tekken3 : un unique grand bras-serpent; ne pas importer la grappe de petits serpents de TekkenTag2. Aucune arme externe : bras-serpent = anatomie.'] : [])])
 };
 const evidenceWorld = sourceEvidence?.universeCoherence;
 if (evidenceWorld) {
  const lines = value => (Array.isArray(value) ? value : value ? [value] : []).map(text).filter(Boolean);
  if (evidenceWorld.sourceWork) world.sourceWork = evidenceWorld.sourceWork;
  if (evidenceWorld.locations || evidenceWorld.settings) world.locations = lines(evidenceWorld.locations || evidenceWorld.settings);
  for (const key of ['period', 'architecture', 'palette', 'props']) if (evidenceWorld[key]) world[key] = key === 'period' ? text(evidenceWorld[key]) : lines(evidenceWorld[key]);
  world.boundaries.push(...lines(evidenceWorld.boundaries), ...lines(evidenceWorld.excludedSharedDossierSetting));
 }
 if (hero.id === 'mistral_mgr') { world.locations = ['Sukhumi, Abkhazie, contexte industriel de la confrontation Mistral dans MetalGearRising:Revengeance2013; scènes originales dans cette région.']; world.architecture = ['Complexe industriel de Sukhumi, tuyauteries, cuves et passerelles métalliques; ne pas lui transférer les lieux WorldMarshal de Raiden.']; world.props = ['L’Étranger composé de DwarfGekko; supports techniques et bras détachables de sa propre configuration.']; }
 if (hero.id === 'true_ogre_tekken') { world.locations = ['Temple mésoaméricain associé à Ogre dans Tekken3; composition originale à vérifier contre le modèle de l’arène, pas HonMaru.']; world.boundaries.push('HonMaru du dossier Tekken partagé n’est pas la localisation de référence Tekken3 de TrueOgre.'); }
 if (subject.universe === 'Michael Jackson') { world.locations = ['Scène musicale originale du projet MultiverseBreach; décor nouveau sans prétendre reproduire Thriller, Moonwalker ou un concert réel.']; world.boundaries.push('Le décor ThrillerPalace du dossier partagé est une adaptation de scène; il ne change pas ces avatars originaux en personnages historiques.'); }
 const specificWorldLocations = {
  luke: ['DeathStarII, salle du trône de l’Empereur et passerelles de la confrontation finale ReturnoftheJedi1983; pas tranchéeYavinEpisodeIV.'],
  vader: ['Bespin, CloudCity, chambre de congélation carbonique et passerelles du duel ESB1980; continuité distincte deYavin.'],
  han_solo: ['Tatooine/MosEisley et intérieur duMillenniumFalcon pendant ANewHope1977; pas tenues Hoth/époques suites.'],
  harry: ['Poudlard, salle surDemande et entraînement DumbledoreArmy dans OrderofthePhoenix2007; design cinéma2007.'],
  hermione: ['Poudlard, salle surDemande, couloirs et bibliothèque pendant OrderofthePhoenix2007; aucune forêt DeathlyHallows.'],
  jack_sparrow_potc: ['Caraïbes deTheCurseoftheBlackPearl2003 : PortRoyal, pont duBlackPearl ou côte d’IsladeMuerta; scènes nouvelles et non plans recopiés.'],
  joker_n52: ['GothamCity, arcEndgame Batman#35–40, continuitéNew52; architecture exacte à comparer aux planches.'],
  batman_n52: ['GothamCity, arcEndgame Batman#35–40, continuitéNew52; pas BatcaveNolan ni JusticeBuster intégré à CG01.'],
  harley_n52: ['Gotham/BelleReve selon scène, débutSuicideSquadvol4#1 (2011); ambiancecomicsNew52.']
 };
 if (specificWorldLocations[hero.id]) { world.locations = specificWorldLocations[hero.id]; world.boundaries.push('Les lieux du dossier monde partagé ne remplacent pas le lieu de cette incarnation individuelle.'); }
 const refs = [];
 for (const file of sourceEvidence?.files || []) refs.push(source(file, 'character-reference-evidence-receipt', file, 'reference-evidence-with-stated-inspection-status-and-limitations'));
 for (const value of unique([...(sourceEvidence?.sourceRefs || []), sourceEvidence?.sourceText?.url])) refs.push(source(value, 'source-evidence-provenance', sourceEvidence.file));
 for (const value of unique([...(hero.referenceUrls || []), hero.referenceUrl, ...(refRecord?.referencePages || []), ...(pack?.referenceUrls || []), pack?.referenceUrl, ...(dossier?.officialReferenceUrls || []), ...(subject.identity?.sourceRefs || [])])) refs.push(source(value, 'source-identity-or-world-reference', refRecord?.referencePages?.includes(value) ? 'public/sprites/generated/sprite-reference-sources.json' : 'src/game/heroes.js / dossier / source-pack'));
 for (const value of refRecord?.referenceImages || []) refs.push(source(value, 'independent-image-url-candidate', 'public/sprites/generated/sprite-reference-sources.json', 'recorded-historical-image-url-not-loaded-now'));
 if (proposal || universeTarget) refs.push(source(AUTHOR_FILE, 'authored-target-proposal-not-source-proof', AUTHOR_FILE, 'proposal-needs-source-comparison'));
 if (originalSpriteAnchor) refs.push(source('/src/game/heroes.js', 'authored-original-character-prompt', 'src/game/heroes.js', 'authored-project-canon'));
 if (sourceAnchor) refs.push(source('/src/game/heroes.js', 'character-specific-identity-description', 'src/game/heroes.js', 'authored-project-record'));
 if (original) refs.push(source('/src/game/originalUniversesManifest.json', 'original-project-canon', 'src/game/originalUniversesManifest.json', 'authored-project-canon'));
 const selectedSprite = getHeroSpriteSheetSrc(hero);
 const recordedSpriteFinding = selectedSpriteFindings.get(hero.id);
 // Findings apply to the exact reviewed asset. Installing a later variant must
 // not inherit a defect observed only in its historical predecessor.
 const currentSpriteFinding = recordedSpriteFinding?.selectedAsset?.path === selectedSprite && existsSync(localFile(selectedSprite)) && recordedSpriteFinding.selectedAsset.sha256 === hash(localFile(selectedSprite)) ? recordedSpriteFinding : null;
 const currentSpriteCorrection = (correctedSpriteAudits.get(hero.id) || []).find(entry => entry.output === selectedSprite && entry.visualReview?.status === 'close-to-reference' && existsSync(localFile(selectedSprite)) && entry.image?.sha256 === hash(localFile(selectedSprite)));
 const recordedTechnicalPacking = technicalSpritePackings.get(hero.id);
 const currentTechnicalPacking = recordedTechnicalPacking?.currentRuntimePath === selectedSprite && existsSync(localFile(selectedSprite)) && recordedTechnicalPacking.preparation.output.sha256 === hash(localFile(selectedSprite)) ? recordedTechnicalPacking : null;
 const currentSpriteReview = currentSpriteFinding ? { path: selectedSprite, sha256: currentSpriteFinding.selectedAsset.sha256, status: currentSpriteFinding.status, observation: currentSpriteFinding.observed, sourceComparison: currentSpriteFinding.sourceComparison, evidenceFile: currentSpriteFinding.evidenceFile, correctionAttemptEvidence: currentSpriteFinding.correctionAttemptEvidence, ...(currentSpriteFinding.sourceCoverageDecision ? { sourceCoverageDecision: currentSpriteFinding.sourceCoverageDecision } : {}), visualFidelityApproved: false }
  : currentSpriteCorrection ? { path: selectedSprite, sha256: currentSpriteCorrection.image.sha256, status: 'corrected-sprite-reviewed-with-source-limitations', evidenceFile: currentSpriteCorrection.file, frames: currentSpriteCorrection.processing?.dominantBodies || currentSpriteCorrection.processing?.sourceGridCells || null, observations: currentSpriteCorrection.visualReview.notes || [], canonicalFidelityApproved: false, visualFidelityApproved: false }
  : currentTechnicalPacking ? { path: selectedSprite, sha256: currentTechnicalPacking.preparation.output.sha256, status: 'technical-frame-packing-reviewed-original-art-preserved', operationKind: currentTechnicalPacking.operationKind, evidenceFile: currentTechnicalPacking.file, preparationReceipt: currentTechnicalPacking.preparationReceipt, independentReview: currentTechnicalPacking.independentReview, frames: currentTechnicalPacking.preparation.processing.dominantBodies, uniformScale: currentTechnicalPacking.uniformScale, previousAtlasRetainedAsVariant: currentTechnicalPacking.previousAtlasRetainedAsVariant, newImageGenerationUsed: false, semanticArtworkCreated: false, limitations: currentTechnicalPacking.limitations, canonicalFidelityApproved: false, visualFidelityApproved: false } : null;
 if (currentSpriteFinding) {
  refs.push(source(currentSpriteFinding.evidenceFile, 'current-selected-sprite-independent-comparison', currentSpriteFinding.evidenceFile, currentSpriteFinding.status));
  if (currentSpriteFinding.correctionAttemptEvidence) refs.push(source(currentSpriteFinding.correctionAttemptEvidence, 'sprite-correction-attempt-evidence', currentSpriteFinding.correctionAttemptEvidence, currentSpriteFinding.correctionAttempt?.status));
 }
 if (currentSpriteCorrection) refs.push(source(currentSpriteCorrection.file, 'current-selected-sprite-correction-audit', currentSpriteCorrection.file, 'reviewed-correction-not-perfect-fidelity-approval'));
 if (currentTechnicalPacking) refs.push(source(currentTechnicalPacking.file, 'current-selected-sprite-technical-frame-packing-audit', currentTechnicalPacking.file, 'existing-project-frame-packing-no-new-art-or-fidelity-certification'));
 const visualPaths = unique([selectedSprite, ...(CORRECTED_HERO_SPRITE_VARIANTS[hero.id] || []).map(variant => variant.src), manifestRow?.output, ...(subject.identity?.localCandidates || []).map(v => v.path), ...(rosterArt.filter(cg => cg.characterId === hero.id).flatMap(cg => [cg.assets?.source?.path, cg.assets?.master?.path, cg.sourcePath].filter(Boolean)))]);
 const localVisuals = visualPaths.map(value => ({ path: value, role: 'project-generated-art', exists: existsSync(localFile(value)), selectedInRuntime: value === selectedSprite,
  status: 'existing-project-art-not-independent-canon-proof' }));
 for (const ref of independentRefs.get(hero.id) || []) {
  localVisuals.push(ref);
  if (ref.url) refs.push({ ...source(ref.url, ref.role, ref.sourceFile, ref.status), referencePurpose: ref.referencePurpose, referenceScope: ref.referenceScope, slot: ref.slot });
 }
 const allRefs = [...new Map(refs.map(r => [`${r.url || r.path}|${r.role}`, r])).values()];
 const inspectedIndependentIdentity = localVisuals.some(ref => ref.role === 'independent-canon-reference' && ref.viewed === true);
 const complete = completionPlans.get(hero.id);
 const themes = {};
 for (const [slot, matrixCell] of Object.entries(subject.matrix)) {
  const completedCell = complete?.slots.find(row => cgSlotKey(row.slot) === slot);
  const entry = plan.entries.find(e => e.id === matrixCell.entryId);
  const latestRevision = entry && revisionRows.filter(row => row.cgId === entry.id).at(-1);
  const isSpecial = specialSlots.has(slot);
  const currentType = completedCell?.type || matrixCell.type || matrixCell.selectedType;
  const installedEntry = rosterArt.find(row => row.characterId === hero.id && row.type === currentType && row.assets?.master?.path && existsSync(publicFile(row.assets.master.path)));
  const generatedStatus = installedEntry ? 'generated' : null;
  const declaredFamily = latestRevision?.family || installedEntry?.family || completedCell?.family || entry?.family || '';
  const continuityStatus = matrixCell.status?.startsWith('not-applicable') ? 'not-applicable'
   : /what[ -]?if/i.test(declaredFamily) ? 'what-if-transformation-not-source-canon'
   : /fan[ -]?art/i.test(declaredFamily) ? 'fan-art-special-theme-original-scene'
   : ['CG09', 'CG10', 'CG11'].includes(slot) ? 'fan-art-special-theme-original-scene'
   : isSpecial ? 'what-if-transformation-not-source-canon'
   : slot === 'CG05' ? 'nexus-game-adaptation' : 'source-identity-in-original-scene';
  themes[slot] = {
   slot, type: completedCell?.type || matrixCell.type || matrixCell.selectedType || (matrixCell.typeOptions || []).join(' / '),
   themeBrief: deliveredTheme(latestRevision) || deliveredTheme(installedEntry) || completedCell?.themeBrief || completedCell?.theme || matrixCell.themeBrief || matrixCell.resolutionRule || '',
   poseBrief: latestRevision?.poseBrief || latestRevision?.poseDescription || installedEntry?.poseBrief || installedEntry?.poseDescription || completedCell?.poseBrief || completedCell?.pose || matrixCell.poseBrief || '',
   backgroundBrief: latestRevision?.backgroundDescription || latestRevision?.backgroundBrief || installedEntry?.backgroundDescription || installedEntry?.backgroundBrief || completedCell?.backgroundDescription || completedCell?.backgroundBrief || authoredBackground(completedCell) || matrixCell.backgroundBrief || (slot === 'CG03' ? world.locations.join(' ; ') : `${world.locations[0] || subject.universe} — composition distincte pour ${subject.characterName} / ${slot}`),
   status: generatedStatus || completedCell?.status || matrixCell.status,
   ...(matrixCell.authoredBriefFile ? { authoredBriefFile: matrixCell.authoredBriefFile } : {}),
   ...(matrixCell.generationStatus ? { generationStatus: matrixCell.generationStatus, generationEvidenceFile: matrixCell.generationEvidenceFile } : {}),
   continuityStatus,
   source: unique([...(Array.isArray(matrixCell.themeSource) ? matrixCell.themeSource : matrixCell.themeSource ? [matrixCell.themeSource] : []), matrixCell.authoredBriefFile, ...(complete ? [complete.file] : [])]),
   sourceComparisonRequired: true,
   visualFidelityApproved: false
  };
 }
 const missing = unique([
  ...(!sourceIncarnation && !pilotIncarnation && !proposal?.incarnation && !original && !universeTarget ? ['Incarnation exacte encore à choisir; le nom de franchise ne suffit pas.'] : []),
  ...(!identityLock ? ['Silhouette, anatomie, visage, tenue et équipement non décrits spécifiquement; la vignette actuelle sert uniquement de point de comparaison.'] : []),
  ...(!inspectedIndependentIdentity && !original ? ['Aucune image source indépendante conservée localement et inspectée dans cette session pour ce personnage.'] : []),
  ...(detailedAxes.length < 6 ? [`Axes visuels non détaillés : ${Object.keys(visualMatchers).filter(k => !detailedAxes.includes(k)).join(', ')}.`] : []),
  ...(review?.limitations || []),
  ...(sourceEvidence?.limitations || []),
  ...(currentSpriteFinding ? [`Sprite sélectionné encore trop éloigné : ${currentSpriteFinding.observed}`, ...(currentSpriteFinding.correctionAttempt?.outputProduced === false && currentSpriteFinding.correctionAttempt?.serviceRefusalForAtlas !== false ? ['Correction bloquée par le service de génération en sortie; aucun nouveau sprite livré, ancien fichier conservé.'] : [])] : []),
  ...(currentSpriteFinding?.sourceCoverageDecision ? [currentSpriteFinding.sourceCoverageDecision] : []),
  ...(hero.id === 'cyber_spider_kelly' ? kellyReview?.unresolvedVisualDetails || [] : [])
 ]);
 const qualificationStatus = currentSpriteFinding ? currentSpriteFinding.status : original ? 'original-project-reference-to-compare' : review ? 'reference-compared-close-to-reference-not-certified' : qualifiedSource ? 'source-evidence-qualified-needs-final-comparison' : Object.keys(evidenceVisualLocks).length ? 'documentary-lock-needs-inspected-identity-image' : sourceAnchor ? 'character-specific-lock-needs-image-comparison' : proposal ? 'specific-target-proposed-needs-source-review' : 'identity-or-visual-locks-incomplete';
 return {
  characterId: subject.characterId, characterName: subject.characterName, name: subject.characterName,
  universe: subject.universe, universeName: subject.universe, universeId: subject.universeKey, priority: subject.priority,
  incarnation: { label: incarnationLabel, status: incarnationStatus, evidence: unique([...(original ? ['src/game/heroes.js / originalUniversesManifest'] : []), ...(sourceEvidence?.files || []), ...(universeTarget ? [AUTHOR_FILE] : []), ...(hero.incarnation ? ['src/game/heroes.js'] : []), ...(refRecord ? ['public/sprites/generated/sprite-reference-sources.json'] : []), ...(pack?.continuity ? ['src/game/canonRosterWave.js'] : []), ...(proposal ? [AUTHOR_FILE] : [])]) },
  identityLock: identityLock || `${subject.characterName}, ${subject.universe} : l’identité nominative est conservée; les détails de ressemblance ne sont pas établis par les données actuelles.`,
  visualLocks: visual, universeCoherence: world, sourceRefs: allRefs, sources: allRefs, localVisuals,
  cgRequirements: { canonSlots: Object.keys(themes).filter(slot => themes[slot].continuityStatus === 'source-identity-in-original-scene'), nexusSlots: Object.keys(themes).filter(slot => themes[slot].continuityStatus === 'nexus-game-adaptation'), fanArtSlots: Object.keys(themes).filter(slot => themes[slot].continuityStatus === 'fan-art-special-theme-original-scene'), whatIfSlots: Object.keys(themes).filter(slot => themes[slot].continuityStatus === 'what-if-transformation-not-source-canon'), themes, commonRule: 'Une pose et une composition de décor distinctes par CG; pour objet/décor seul, aucun personnage forcé. Préserver incarnation/anatomie/tenue sauf transformation spéciale explicitement étiquetée. Préserver tous les anciens assets comme variantes.' },
  readiness: { identity: incarnationStatus, visualReference: inspectedIndependentIdentity ? 'independent-image-inspected-with-limitations' : localVisuals.some(ref => ref.role === 'independent-canon-reference') ? 'independent-image-available-inspection-not-recorded' : original ? 'project-canon-reference' : 'source-image-needed-or-historical-url-only', sourceReview: qualificationStatus, ...(currentSpriteReview ? { currentSprite: currentSpriteReview } : {}), visualFidelityApproved: false, detailedVisualAxes: detailedAxes, missing },
  qualificationStatus,
  notes: unique([hero.canonStatus, ...(review?.notes || []), ...(proposal ? [proposal.provenance] : []),
   `Palette runtime indicative (pas preuve canon) : ${unique([hero.primaryColor, hero.secondaryColor]).join(', ') || 'non définie'}.`,
   `Kit jeu séparé du canon : ${['simple','secondary','defense','special'].map(k => hero[k]?.name).filter(Boolean).join(' ; ') || 'non défini'}.`,
   ...(dossier && !dossierIsThisHero ? [`Le dossier ${dossierFile} décrit le monde et éventuellement ${dossier.leadHeroName || 'un protagoniste'}; ses ancrages de visage/tenue ne sont pas transférés à ${subject.characterName}.`] : [])]),
  ageStatus: sourceEvidence?.ageStatus || hero.ageStatus || 'not-established',
  provenance: { roster: 'src/game/heroes.js', plan: 'docs/cg/roster-production-2026-10-18.json', dossier: existsSync(path.resolve(ROOT, dossierFile)) ? dossierFile : null, sourcePack: pack ? 'src/game/expandedUniverses.js / src/game/canonRosterWave.js' : null, sourceSpecificDescription: authoritativeVisualEvidence ? `${sourceEvidence.file}#visualLocks` : sourceAnchor ? 'runtime-visualAnchor' : proposal ? AUTHOR_FILE : null, hasRuntimeSpecificDescription: !!sourceAnchor, rawRuntimePalette: unique([hero.primaryColor, hero.secondaryColor]), rawRuntimeWeaponType: hero.weaponType || null, oldArtPreservation: 'No raster or runtime registry changed by this builder.' }
 };
});
assert.equal(subjects.length, 1912);
assert.equal(new Set(subjects.map(s => s.characterId)).size, subjects.length);
assert(subjects.every(s => s.readiness.visualFidelityApproved === false));
assert(subjects.every(s => Object.keys(s.cgRequirements.themes).length === 15));
assert(subjects.every(s => s.localVisuals.some(r => r.role === 'project-generated-art' && r.exists)));
assert(subjects.find(s => s.characterId === 'player_anchor').visualLocks.equipment.some(line => /gauche/.test(line)));
assert(subjects.find(s => s.characterId === 'masterchief').visualLocks.equipment.some(line => /MA40/.test(line)));
assert(subjects.find(s => s.characterId === 'mistral_mgr').universeCoherence.locations.every(line => /Sukhumi|Abkhazie/.test(line)));
assert(subjects.every(s => s.localVisuals.filter(r => r.role === 'independent-canon-reference').every(r => r.url && r.sha256 && r.exists)));
assert(subjects.every(s => !s.visualLocks.forbiddenMixes.some(line => /avec le personnage principal/.test(line))));
const document = {
 schemaVersion: 1, date: '2026-10-18', generatedAt: '2026-10-20', generator: 'scripts/buildCgRosterFidelityBible.mjs',
 methodology: 'Reconstitution traçable des dossiers, héros, source packs, manifeste de références et cibles proposées. Les ancrages spécifiques et les adaptations du gameplay sont séparés. Une cible détaillée, une URL, une ancienne validation de sprite ou la présence d’un PNG ne certifient pas une fidélité visuelle 1:1. Les propositions rédigées ont un statut explicite.',
 reviewRules: [
  'Comparer le visage ou la tête, la silhouette et les proportions à une référence source de la même incarnation.',
  'Compter membres, yeux, mandibules, ailes et appendices; contrôler le côté des prothèses et accessoires asymétriques.',
  'Comparer tenue, découpes, matières, palette et géométrie exacte de chaque équipement.',
  'Séparer la fidélité au personnage de la cohérence du décor; un décor nouveau doit respecter époque, géographie et technologie.',
  'Préserver les anciens visuels en variantes. Une livraison nouvelle n’efface ni un écart signalé ni une limitation de référence.',
  'Les scènes spéciales de plage, service et comédie sont du fan art; les transformations, inversions morales et futurs hypothétiques sont des What If explicitement identifiés. Garder l’identité et distinguer tout accessoire imaginé.',
  'Une comparaison finale indépendante reste requise avant le statut validé1:1. Le présent fichier ne confère ce statut à aucun personnage.'
 ],
 summary: { subjects: subjects.length, universes: new Set(subjects.map(s => s.universe)).size, cgSlots: subjects.length * 15,
  authoredSpecificProposals: subjects.filter(s => authored[s.characterId]).length,
  proposedUniverseScopes: Object.keys(universeTargets).length,
  withOriginalAuthoredVisualPrompt: subjects.filter(s => s.sourceRefs.some(r => r.role === 'authored-original-character-prompt')).length,
  characterSpecificSourceDescriptions: subjects.filter(s => s.provenance.hasRuntimeSpecificDescription).length,
  subjectsWithSourceEvidenceReceipts: evidenceByHero.size,
  discoveredSourceEvidenceFiles: additionalEvidenceFiles.length,
  withIndependentLocalCanonImage: subjects.filter(s => s.localVisuals.some(r => r.role === 'independent-canon-reference')).length,
  withInspectedIndependentLocalCanonImage: subjects.filter(s => s.localVisuals.some(r => r.role === 'independent-canon-reference' && r.viewed === true)).length,
  withIndependentLocalIconicOutfitImage: subjects.filter(s => s.localVisuals.some(r => r.role === 'independent-iconic-outfit-reference')).length,
  withIndependentLocalEquipmentImage: subjects.filter(s => s.localVisuals.some(r => r.role === 'independent-equipment-reference')).length,
  withIndependentLocalCostumeSupportImage: subjects.filter(s => s.localVisuals.some(r => r.role === 'independent-costume-support-reference')).length,
  withIndependentLocalEnvironmentImage: subjects.filter(s => s.localVisuals.some(r => r.role === 'independent-environment-reference')).length,
  withInspectedOriginalProjectReference: subjects.filter(s => s.localVisuals.some(r => r.canonicalProjectReference && r.viewed)).length,
  withLocalProjectArt: subjects.filter(s => s.localVisuals.some(r => r.role === 'project-generated-art' && r.exists)).length,
  selectedSpritesWithConfirmedMajorDifference: subjects.filter(s => s.readiness.currentSprite?.status?.includes('too-far')).length,
  selectedSpritesWithReviewedCorrections: subjects.filter(s => s.readiness.currentSprite?.status === 'corrected-sprite-reviewed-with-source-limitations').length,
  selectedSpritesWithReviewedTechnicalPacking: subjects.filter(s => s.readiness.currentSprite?.status === 'technical-frame-packing-reviewed-original-art-preserved').length,
  selectedSpriteCorrectionsBlocked: subjects.filter(s => s.readiness.currentSprite?.status?.includes('blocked')).length,
  perfect1to1Approvals: 0,
  qualificationStatuses: count(subjects, s => s.qualificationStatus),
  incarnationStatuses: count(subjects, s => s.incarnation.status)
 }, subjects
};
const encoded = `${JSON.stringify(document, null, 2)}\n`;
if (process.argv.includes('--inspect')) {
 const id = process.argv[process.argv.indexOf('--inspect') + 1];
 const subject = subjects.find(subject => subject.characterId === id);
 assert(subject, `Unknown character to inspect: ${id}`);
 console.log(JSON.stringify(subject, null, 2));
} else if (process.argv.includes('--summary')) {
 console.log(JSON.stringify(document.summary, null, 2));
} else if (process.argv.includes('--check')) {
 assert.equal(readFileSync(path.resolve(ROOT, OUTPUT), 'utf8'), encoded, 'Fidelity bible is stale; rerun builder.');
 console.log(`Fidelity bible current: ${subjects.length} subjects, ${subjects.length * 15} slots.`);
} else {
 writeFileSync(path.resolve(ROOT, OUTPUT), encoded);
 console.log(JSON.stringify(document.summary, null, 2));
}
