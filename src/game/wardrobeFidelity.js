// Evidence review only. A numerical score NEVER grants an outfit or approves artwork.
const criterion = (key,max,fr,en) => Object.freeze({key,max,name:Object.freeze({fr,en})});
export const COSTUME_FIDELITY_CRITERIA = Object.freeze([
  criterion('incarnation',15,'Identité et incarnation','Identity and incarnation'),
  criterion('silhouette',15,'Silhouette et proportions','Silhouette and proportions'),
  criterion('head',15,'Tête, visage et casque','Head, face and helmet'),
  criterion('clothing',15,'Coupe et pièces de tenue','Tailoring and garment pieces'),
  criterion('palette',8,'Couleurs et marquages','Colors and markings'),
  criterion('equipment',10,'Accessoires et attaches','Accessories and attachments'),
  criterion('animation',7,'Gestuelle et raccords','Movement and pose continuity'),
  criterion('identity',7,'Capacités et identité inchangées','Unchanged abilities and identity'),
  criterion('style',4,'Style de la source','Source visual style'),
  criterion('technical',4,'Cadrage et lisibilité','Framing and readability')
]);
export const COSTUME_REFERENCE_VIEWS = Object.freeze(['front','back','left','right','detail']);
const sha256 = value => typeof value==='string' && /^[a-f\d]{64}$/.test(value);
const nonempty = value => typeof value==='string' && value.trim().length>0;
export function isLocalEvidencePath(value) {
  return typeof value==='string' && value.length>0 && value.length<=1000
    && !value.startsWith('/') && !value.includes('\\') && !value.includes('%')
    && !value.includes(':') && !value.includes('?') && !value.includes('#')
    && value.split('/').every(p=>p && p!=='.' && p!=='..');
}
function isImageEvidence(proof,inventory) {
  if(!proof || !isLocalEvidencePath(proof.path) || !sha256(proof.sha256))return false;
  const evidence=inventory.get(proof.path);
  return evidence?.sha256===proof.sha256 && Number.isSafeInteger(evidence.bytes) && evidence.bytes>0
    && Number.isSafeInteger(evidence.width) && evidence.width>0
    && Number.isSafeInteger(evidence.height) && evidence.height>0;
}
const validDate = value => typeof value==='string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10)===value;
/**
 * inventory must be computed from files, not copied from the review being assessed.
 * requirements come from the caller's runtime animation contract, never a guessed 4x4 grid.
 * The output is a proposal for a human review, NOT permission to equip or certify 1:1.
 */
export function assessCostumeFidelity(entry,review={},inventory=new Map(),requirements={}) {
  const blockers=[];
  const add = value => {if(!blockers.includes(value))blockers.push(value);};
  review=review && typeof review==='object' && !Array.isArray(review)?review:{};
  inventory=inventory instanceof Map?inventory:new Map();
  requirements=requirements && typeof requirements==='object'?requirements:{};
  if(!entry?.id || !entry?.actorKey || entry.nature==='procedural-effect')add('INVALID_COSTUME_ENTRY');
  if(review.entryId!==entry?.id || review.actorKey!==entry?.actorKey)add('IDENTITY_MISMATCH');
  if(!nonempty(review.incarnation))add('INCARNATION_REQUIRED');
  if(entry?.origin==='OFFICIAL' && review.sourceWork!==entry.sourceWork)add('SOURCE_EDITION_MISMATCH');
  if(!nonempty(review.reviewer))add('REVIEWER_REQUIRED');
  if(!validDate(review.reviewedOn))add('REVIEW_DATE_REQUIRED');
  if(validDate(requirements.asOf) && validDate(review.reviewedOn) && review.reviewedOn>requirements.asOf)add('FUTURE_REVIEW_DATE');
  let total=0,complete=true;
  for(const c of COSTUME_FIDELITY_CRITERIA){
    const score=review.scores?.[c.key];
    if(typeof score!=='number' || !Number.isFinite(score) || score<0 || score>c.max){complete=false;add(`INVALID_SCORE:${c.key}`);}
    else total+=score;
    if(!nonempty(review.notes?.[c.key]))add(`CRITERION_NOTE_REQUIRED:${c.key}`);
  }
  const references=Array.isArray(review.references)?review.references:[];
  const proofIds=new Set();
  for(const view of COSTUME_REFERENCE_VIEWS){
    const reference=references.find(r=>r?.view===view);
    if(!isImageEvidence(reference,inventory))add(`REFERENCE_FILE_REQUIRED:${view}`);
    else {
      if(proofIds.has(reference.sha256))add('REFERENCE_VIEWS_NOT_DISTINCT');
      proofIds.add(reference.sha256);
    }
    // Originals need a design sheet, not an unrelated official franchise page.
    if(entry?.origin==='OFFICIAL' && reference?.sourceUrl!==entry.sourceUrl)add(`REFERENCE_SOURCE_MISMATCH:${view}`);
  }
  if(!isImageEvidence(review.sheet,inventory))add('COSTUME_SHEET_REQUIRED');
  if(proofIds.has(review.sheet?.sha256))add('SOURCE_IS_OUTPUT_SHEET');
  const expected=Array.isArray(requirements.states)?requirements.states:[];
  if(!expected.length || !expected.every(nonempty) || new Set(expected).size!==expected.length)add('RUNTIME_STATES_REQUIRED');
  if(requirements.actorKey!==entry?.actorKey)add('RUNTIME_IDENTITY_MISMATCH');
  const checked=Array.isArray(review.checkedStates)?review.checkedStates:[];
  for(const state of expected){
    const check=checked.find(s=>s?.state===state);
    if(!check || check.passed!==true || !nonempty(check.notes) || !isImageEvidence(check,inventory))add(`STATE_PROOF_REQUIRED:${state}`);
    else if(check.path===review.sheet?.path || check.sha256===review.sheet?.sha256)add(`STATE_PROOF_IS_SHEET:${state}`);
  }
  if(!isImageEvidence(review.inGame,inventory))add('IN_GAME_CAPTURE_REQUIRED');
  else if(review.inGame.path===review.sheet?.path || review.inGame.sha256===review.sheet?.sha256)add('IN_GAME_CAPTURE_IS_SHEET');
  const score=complete?Math.round(total*100)/100:null;
  const proposedAction=score===null?'A_AUDITER':score>=90?'GARDER_A_CONFIRMER':score>=80?'RETOUCHES':score>=65?'REFAIRE_PARTIEL':'REFAIRE';
  return {status:blockers.length?'EVIDENCE_INCOMPLETE':'READY_FOR_MANUAL_REVIEW',score,proposedAction,
    blockers,artApproved:false,equippable:false};
}
