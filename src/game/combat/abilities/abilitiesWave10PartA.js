import { buff, defend, guard, hit, shot } from './rules.js';

const matrix = 'The Matrix';
const stargate = 'Stargate';
const matrixSource = 'The Matrix Reloaded (2003)';
const stargateSource = 'Stargate SG-1 — saison 4 (2000–2001)';
const superAction = (ability, color) => ({ ...ability, color, animationDuration: 1.1, hitAt: 0.451, meterCost: 100 });
const kit = (sourceHeroId, universe, sourceWork, sourceReference, simple, secondary, defense, special) => ({
  sourceHeroId, universe, sourceWork, sourceReference,
  identityBasis: 'canonical-role', canonicalVerified: false, networkVerified: false,
  gameplayAdaptation: true, simple, secondary: { cd: 6, ...secondary }, defense, special
});

// Selected screen versions, physical actions and bounded support adaptations.
// Names describe the selected choreography; they are not invented official
// named supers, new Time Stop rules, magical translations or extra engine hits.
export const ABILITIES_WAVE10_PART_A = Object.freeze({
  neo: kit('neo', matrix, matrixSource,
    'Reloaded Neo wears a closed long black high-collar coat and fights unarmed. His martial exchanges and bullet evasion are selected here; an authored close-range combination replaces the unsupported damaging Source Code Rewrite. Bullet stopping is a personal defensive adaptation, not an explosive code spell.',
    hit('Loaded Kung Fu Strike', 1.15, { range: 170 }),
    hit('Bullet Time Counter', 1.8, { range: 170 }),
    defend('Arrêt des balles de Neo', 0.8, { duration: 2.2 }),
    superAction(hit('Enchaînement de l’Élu', 5.2, { range: 180 }), '#76d798')),
  trinity: kit('trinity', matrix, matrixSource,
    'Reloaded Trinity wears fitted black leather and uses two physical Beretta 92-series pistols and martial kicks. The selected burst has one authored impact. A kiss is not an area attack, and no motorcycle is invented in the unmounted actor.',
    shot('Couverture au pistolet', 1.1, { range: 640 }),
    hit('Coup de pied retourné de Trinity', 1.8, { range: 170 }),
    defend('Esquive acrobatique de Trinity', 0.7, { duration: 2 }),
    superAction(shot('Salve aux deux Beretta', 4.6, { range: 640, shape: 'line', lineWidth: 42, maxTargets: 3 }), '#d5e1e6')),
  morpheus: kit('morpheus', matrix, matrixSource,
    'Reloaded Morpheus fights with the katana seen during the freeway sequence; the sword is a physical held weapon. This selection replaces a dojo staff and Red Pill/No Spoon damage spells with a katana cut and an unarmed close-range strike. His pince-nez sunglasses and long dark textured coat identify this screen version.',
    hit('Taille au katana de Morpheus', 1.2, { range: 180 }),
    hit('Frappe rapprochée de Morpheus', 1.8, { range: 150 }),
    defend('Garde au katana de Morpheus', 0.65, { duration: 2 }),
    superAction(hit('Taille au katana de Morpheus', 4.9, { range: 190 }), '#c9b9db')),
  seraph: kit('seraph', matrix, matrixSource,
    'Reloaded Seraph is the Oracle’s martial guardian in his light cream mandarin jacket and dark trousers. The tea-house encounter supports unarmed palms and kicks; the selected sequence is physical martial choreography. Gold code sight does not become an emitted firewall, beam or damaging explosion.',
    hit('Paume du gardien de l’Oracle', 1.1, { range: 170 }),
    hit('Coup de pied de Seraph', 1.9, { range: 170 }),
    defend('Parade du gardien de l’Oracle', 0.75, { duration: 2 }),
    superAction(hit('Enchaînement du gardien de l’Oracle', 4.7, { range: 180 }), '#e6d6b2')),
  oneill: kit('oneill', stargate, stargateSource,
    'Season-four Colonel Jack O’Neill is a field SG-1 officer in olive fatigues and a tactical vest. The selected firearm is the FN P90 with its top-mounted magazine; a zat sidearm remains physical Goa’uld equipment. Tactical withdrawal does not damage enemies through a Stargate or create an orbital strike.',
    shot('Rafale au P90 d’O’Neill', 1.15, { range: 640 }),
    shot('Tir au zat d’O’Neill', 1.7, { range: 480 }),
    defend('Couvert de terrain d’O’Neill', 0.7, { duration: 2 }),
    superAction(shot('Rafale de couverture au P90', 4.8, { range: 640, shape: 'line', lineWidth: 44, maxTargets: 3 }), '#d9bd78')),
  tealc: kit('tealc', stargate, stargateSource,
    'Season-four Teal’c is a bald Jaffa with the gold Apophis forehead mark, wearing SG-1 field fatigues. His long Jaffa staff weapon emits a plasma shot from its opening oval head. A staff blow is physical melee; his resolve does not summon an armed uprising or a later-season army.',
    shot('Tir de lance Jaffa', 1.25, { range: 640 }),
    hit('Coup de lance de Teal’c', 1.9, { range: 180 }),
    defend('Garde de Teal’c', 0.75, { duration: 2 }),
    superAction(shot('Tir de lance Jaffa', 5, { range: 640, shape: 'line', lineWidth: 48, maxTargets: 3 }), '#efa44c')),
  sam_carter: kit('sam_carter', stargate, stargateSource,
    'Season-four Major Samantha Carter has short blond hair, olive SG-1 fatigues and a tactical vest. Her P90 is a physical firearm; analysis and radio instructions help the team position safely. Neither naquadah nor calculation grants a handheld magical pulse, and a field actor does not spontaneously invert every Goa’uld shield.',
    shot('Rafale au P90 de Carter', 1.1, { range: 640 }),
    guard('Analyse de la position par Carter', { duration: 2.5, reduce: 0.3 }),
    defend('Mise à couvert de Carter', 0.65, { duration: 2 }),
    superAction(shot('Couverture au P90 de Carter', 4.6, { range: 640, shape: 'line', lineWidth: 42, maxTargets: 3 }), '#e5ca87')),
  daniel_jackson: kit('daniel_jackson', stargate, stargateSource,
    'Season-four Daniel Jackson is the unascended human archaeologist with glasses, field fatigues, notebook and radio. Reporting observed terrain and translating information helps allies coordinate; it does not fire glyphs, damage enemies, heal tissue or grant supernatural light. The buff is an explicitly authored representation of information and positioning, not a canonical magical translation power.',
    buff('Observation de terrain de Daniel', { duration: 2.5, buffMultiplier: 1.1 }),
    guard('Itinéraire sûr signalé par Daniel', { duration: 2.5, reduce: 0.25 }),
    defend('Mise à couvert de Daniel', 0.6, { duration: 2 }),
    superAction(buff('Repérage de terrain de Daniel', { duration: 4, buffMultiplier: 1.25 }), '#d5c5a6'))
});

export const ABILITY_REVISIONS_WAVE10_PART_A = Object.freeze({
  agent_smith: {
    universe: matrix, sourceWork: matrixSource,
    versionNote: 'Reloaded Smith is the dark-suited, narrow-sunglasses former Agent. Keep physical punches and personal evasion. Replace the self-buff duplication super with a physical combination: no missing clone body, multiplication rule, laser weapon or explosive code field is implied.',
    special: superAction(hit('Enchaînement physique de Smith', 5, { range: 180 }), '#a8c0a8')
  },
  hammond_sgc: {
    universe: stargate, sourceWork: stargateSource,
    versionNote: 'Season-four General George Hammond is the bald older SGC commander in blue service uniform. Existing report/evacuation support remains zero damage. Extraction authorization is conveyed through a held radio and an ordinary command gesture; no personal pistol attack, portal weapon or projected magical shield is created.',
    special: superAction(guard('Autorisation d’extraction du SGC', { duration: 4, reduce: 0.45 }), '#adc9d4')
  }
});
