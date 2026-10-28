/** Read-only production inventory. Source facts and proposed mode adaptations remain separate. */
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HEROES_DB, EQUIP_ITEMS_DB } from '../../src/game/heroes.js';
import { ENEMIES_DB, FINAL_GAME_BOSS } from '../../src/game/enemies.js';
import { LORE_DB } from '../../src/game/lore.js';
import { getUniverseSignature } from '../../src/game/loreDescriptions.js';
import { createPlayerHero } from '../../src/game/playerHero.js';
import { getHeroSpriteSheetSrc, getHeroCompleteSpritePack, getEnemySpriteSheetSrc, getItemSpriteSrc, getSpriteSheetLayout } from '../../src/game/spriteAssets.js';
import { getExtinctionSignature } from '../../src/game/extinctionSignatures.js';
import { getExtinctionViewmodel, isExtinctionCombatant } from '../../src/game/extinctionContent.js';
import { getUniverseHubPlace } from '../../src/game/mosaicUniversePlaces.js';
import { CANON_ROSTER_WAVE } from '../../src/game/canonRosterWave.js';
import { EXPANDED_UNIVERSES } from '../../src/game/expandedUniverses.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const text=v=>typeof v==='string'?v: v?.fr||v?.en||'';
const short=v=>text(v).slice(0,2500);
const nonCombat=a=>a?.nonCombat===true||a?.category==='trial'||a?.cat==='trial';
const src=(commit,file)=>`https://github.com/darknigthmare/multiverse-breach/blob/${commit}/${file}`;
const actionType=a=>typeof a==='object'?a?.type||'':'non précisé';
const palettes=a=>[a.primaryColor||a.color,a.secondaryColor,a.weaponColor].filter(Boolean).join(' / ');
const combatSlots=['simple','secondary','defense','special'];

export const ANIMATION_CONTRACTS = [
 ['FPS-IDLE','FPS','Repos','Mains ou appendices et outil à hauteur cohérente ; respiration discrète, viseur dégagé.','Boucle proposée 4–8 images ; durée à valider.','Ne pas réutiliser une silhouette de corps entier.'],
 ['FPS-MOVE','FPS','Marche / course','Balancement des mains lié au mouvement réel ; ne pas déplacer le point de visée.','Boucle proposée 6–8 images ; option mouvements réduits.','Identité, bracelets, gants et nombre de doigts à référencer.'],
 ['FPS-DRAW','FPS','Dégainer / ranger','Main porteuse et main de soutien prennent ou rangent l’objet ; sockets propres au modèle.','Proposition 6–10 images ; entrée/sortie sans flash.','Pas de miroir automatique des marquages asymétriques.'],
 ['FPS-PRIMARY','FPS','Action principale','Anticipation, déclenchement, recul et retour ; employer le nom et le type source de la ligne Actions_FPS.','Proposition 6–10 images ; événement de tir séparé du dessin.','Pas de munitions balistiques inventées pour un sort ou un objet non létal.'],
 ['FPS-SECONDARY','FPS','Action secondaire','Geste et outil de la technique source ; trajectoire, portée et retombée à définir séparément.','Proposition 8–12 images ; point de sortie référencé.','Une technique RPG n’est pas automatiquement intégrée dans Extinction.'],
 ['FPS-RELOAD','FPS','Recharge / régénération','Chargeur, cartouche, cellule, énergie, corde ou geste magique seulement selon source confirmée.','Proposition 8–16 images ; plein/vide/interruption explicités.','Ne pas inventer la ligne reload si le manifeste ne la fournit pas.'],
 ['FPS-DEFENSE','FPS','Garde / esquive','Arme et mains sortent de l’axe ou déploient la défense source ; garder visibilité du danger.','Proposition 6–10 images ; reprise et annulation sûres.','Pas de bouclier technologique ajouté à un personnage qui n’en possède pas.'],
 ['FPS-SPECIAL','FPS','Spécial / ultime','Geste lisible, préparation, émission puis récupération ; caméra et effet séparés.','Proposition 10–16 images ; flash réduit disponible.','Utiliser la technique source ; si générique, passer en recherche avant production.'],
 ['FPS-HIT','FPS','Dégâts / faibles PV','Réaction courte des mains et indicateur directionnel ; aucun déplacement forcé excessif.','Proposition 3–6 images ; intensité réglable.','Texte/HUD non incorporés au PNG.'],
 ['FPS-INTERACT','FPS','Ramassage / balise','Main libre ou appendice approprié ; contact avec l’objet sans le transformer en arme.','Proposition 6–10 images ; signal de collecte unique.','Préserver les trois balises d’Extraction.'],
 ['FPS-PROJECTILE','FPS','Projectile en profondeur','Naissance au socket, vues proche/moyenne/lointaine, déplacement, impact, expiration.','Proposition 4–8 images par phase ; collision indépendante.','Hitscan : traînée et impact, pas de projectile lent imposé.'],
 ['FPS-ENEMY','FPS','Ennemi en perspective','Face, trois-quarts, profil, dos ; attente, déplacement, attaque, dégâts et sortie.','Proposition 8 directions × séquences ; dimensions selon anatomie.','Une planche RPG latérale n’est pas un billboard FPS validé.'],
 ['FPS-BOSS','FPS','Boss / phases','Silhouette à l’échelle, points faibles source, annonce de chaque attaque, récupération.','Phases à documenter par boss ; aucune transformation inventée.','Très grands boss : décor animé et composants plutôt qu’un géant humanoïde générique.'],
 ['CITY-IDLE','Cité','Repos PNJ','Silhouette complète, orientation, respiration et ombre au sol indépendante.','Proposition 4 directions minimum ; 8 selon caméra.','Palette et tenue verrouillées à l’incarnation.'],
 ['CITY-WALK','Cité','Marche PNJ','Pas sans glissement, pivot de pieds constant, changements de direction propres.','Proposition 6–8 images par direction.','Empreinte au sol distincte de la hauteur graphique.'],
 ['CITY-TALK','Cité','Dialogue / gestes','Regard vers l’Ancre, geste signature non agressif, portrait et bulles séparés.','Proposition 4–6 images ; retour au repos.','PNJ pacifiques et enfants ne sont pas convertis en adversaires.'],
 ['CITY-USE','Cité','Service / activité','Interaction avec outil ou console source ; état libre, occupé et fin lisibles.','Proposition 6–10 images ; point d’interaction hors obstacle.','Ne pas dépenser ni attribuer une récompense au simple dessin.'],
 ['CITY-PROP','Cité','Objet / mobilier','Base, ombre, premier plan, lumière et états fermé/ouvert séparés.','Taille en pixels à proposer après verrouillage de l’échelle.','Collision, occlusion et portée d’interaction dans le manifeste.'],
 ['CITY-PORTAL','Cité','Portail / retour','Repos, activation, transit, verrouillé et stabilisé ; point de retour sûr.','Boucle proposée 8–12 images ; pas de flash obligatoire.','Conserver le checkpoint avant la navigation.'],
 ['CITY-ENV','Cité','Sol / murs / toits','Tuiles raccordables, angles, seuils, intérieur/extérieur et masques d’occlusion.','Grille et pivot à définir ; ne pas redimensionner les collisions au hasard.','Pas d’interface ou de texte fusionné dans les décors.'],
 ['CITY-AMBIENCE','Cité','Ambiance','Lumière, vapeur, eau, végétation ou poussière selon les éléments du thème source.','Boucles indépendantes, mouvements réduits et sons réglables.','Le thème du dépôt est une indication, pas un asset déjà produit.']
];

export function buildCatalog(sourceCommit, trackedFiles) {
 if(!/^[a-f0-9]{40}$/.test(sourceCommit||''))throw new Error('Full immutable source commit required');
 const tracked=new Set(trackedFiles);
 const hasAsset=p=>Boolean(p&&tracked.has(`public${p.split(/[?#]/)[0]}`));
 const assetState=p=>!p?'Non renseigné':hasAsset(p)?'Présent dans Git':'Absent de Git';
 const universeNames=[...new Set([...Object.keys(LORE_DB),...Object.keys(ENEMIES_DB),...HEROES_DB.map(h=>h.universe)])].sort();
 const heroes=[createPlayerHero(),...HEROES_DB];
 const runtimeProfiles=new Map(heroes.map(h=>[h.id,getExtinctionSignature(h)]).filter(([,p])=>p));
 const packs=[...CANON_ROSTER_WAVE,...EXPANDED_UNIVERSES];
 const packByUniverse=new Map(packs.map(p=>[p.universe,p]));
 const reference=(a,u)=>a?.referenceUrl||packByUniverse.get(u)?.referenceUrl||LORE_DB[u]?.referenceUrl||'';
 const continuity=(a,u)=>short(a?.incarnation||a?.sourceIncarnation||a?.continuity||packByUniverse.get(u)?.continuity||packByUniverse.get(u)?.canonProfile?.continuity)||'À verrouiller';
 const tables={};
 const add=(name,headers,rows,note)=>{tables[name]={headers,rows,note};};
 const heroRows=[],actionRows=[],cityPeople=[],assetRows=[];
 const allThreats=[];
 for(const universe of universeNames){
  const group=ENEMIES_DB[universe]||{};
  for(const [kind,list] of [['Ennemi',group.monsters||[]],['Boss',group.bosses||[]],['Boss mondial',group.worldBoss?[group.worldBoss]:[]]]){
   list.forEach((actor,index)=>allThreats.push({actor,universe,kind,key:`${kind}::${universe}::${actor.id||actor.name}::${index}`}));
  }
 }
 allThreats.push({actor:FINAL_GAME_BOSS,universe:'Nexus de Convergence',kind:'Boss final',key:'Boss final::Nexus::FINAL_GAME_BOSS'});
 for(const h of heroes){
  const u=h.universe,nc=nonCombat(h),model=getExtinctionViewmodel(h),citySrc=getHeroSpriteSheetSrc(h,'nexus'),layout=getSpriteSheetLayout(citySrc);
  const sourceUrl=src(sourceCommit,h.isPlayer?'src/game/playerHero.js':'src/game/heroes.js');
  const visual=short(h.visualAnchor)||'Détails individuels absents : référencer mains, morphologie, gants, manches et tenue avant dessin.';
  const weapon=short(h.weapon)||h.weaponType||'Non renseigné';
  heroRows.push([h.id,u,h.name,h.category,nc?'Non combattant':'Combattant sous réserve de possession',continuity(h,u),visual,weapon,
   combatSlots.map(k=>`${k}: ${text(h[k]?.name||h[k])} [${actionType(h[k])}]`).join('\n'),palettes(h),model.src,assetState(model.src),
   nc?'Hors combat':model.src?'Partiel':'À produire',nc?'Préserver les épreuves et les interactions Cité ; aucun tir ajouté.':model.src?'Planche personnelle raccordée ; proportions et cellules vérifiées en navigateur. Recharge/variantes et validation artistique encore partielles ; pas de certification 1:1.':'Schéma neutre de secours ; mains et arme personnelles non produites par cette livraison.',reference(h,u),sourceUrl]);
  cityPeople.push([h.id,u,h.name,nc?'PNJ non combattant / épreuve':'Habitant / allié possédé',visual,citySrc,assetState(citySrc),`${layout.columns} × ${layout.rows} ; ${JSON.stringify(layout.rowByState||{})}`,
   'CITY-IDLE / CITY-WALK / CITY-TALK / CITY-USE',nc?short(h.objectiveFr||h.objective)||'Interaction pacifique à documenter':`Dialogue/activité de ${h.name} à écrire depuis le dossier ; ne pas inventer de fonction canonique.`,
   h.isPlayer ? 'Ancre contrôlée par le joueur ; jamais dupliquée comme habitant dans le répertoire.' : 'Répertoire de tous les habitants possédés et visibles ; groupes de 17, plus Mirelle dans l’Atrium. Rejoindre fait marcher l’Ancre vers l’identité en contournant les PNJ. Trois identités parcourues dans quatre formats ; animations et quartiers individuels encore à valider.',hasAsset(citySrc)?'Partiel':'À produire',sourceUrl]);
  if(nc)continue;
  for(const slot of combatSlots){
   const a=h[slot]||{},type=actionType(a),name=text(a.name||a)||'Non renseigné';
   const generic=/signature strike|breach technique|origin burst|signature action|signature technique|defensive action|decisive action/i.test(name);
   const emission=slot==='defense'?'Garde/esquive/effet source ; aucun projectile supposé'
    :/melee|fists|sword|claw|slash|bite|kick/.test(type)?'Contact : arc de frappe, portée courte, impact au contact ; pas de balle ajoutée'
    :/bullet|shotgun|gun/.test(type)?'À arbitrer : hitscan ou projectile selon l’arme source ; traînée, douille et impact seulement si pertinents'
    :/beam|laser|zap|lightning/.test(type)?'Rayon : origine, trajet et impact séparés ; arrêt lors de pause/fin'
    :/heal|buff|shield|dodge|dash/.test(type)?'Effet de soutien / déplacement ; aucune cible hostile ou munition inventée'
    :/summon/.test(type)?'Entité invoquée séparée ; apparition, activité, sortie ; identité de renfort à référencer'
    :'Projectile / onde / effet à déterminer depuis la technique source ; pas de vitesse ou calibre inventé';
   const runtime=runtimeProfiles.get(h.id)?.actions[slot];
   const runtimeText=runtime ? `Adaptation FPS jouable : ${runtime.kind} ; recharge ${runtime.cooldown}/60 s ; portée ${runtime.range} unités ; durée ${runtime.duration}/60 s. Réglage de jeu, pas mesure canonique. Projectiles : collision balayée et expiration ; pause et identité de session protégées. Animation personnelle non produite.` : '';
   const spec=slot==='simple'?'FPS-PRIMARY':slot==='secondary'?'FPS-SECONDARY':slot==='defense'?'FPS-DEFENSE':'FPS-SPECIAL';
   actionRows.push([`${h.id}::${slot}`,u,h.name,slot,name,type,JSON.stringify(a),weapon,visual,
    runtimeText || `${spec} ; ${name}. ${emission}. Mains gauche/droite, outil et effet sur couches séparées.`,
    generic?'Nom générique : recherche requise avant adaptation':'Technique déclarée au catalogue ; adaptation FPS à valider',
    runtime ? runtimeText : 'Non raccordé individuellement : statistiques et capacités de rôle conservées.', runtime ? 'Partiel' : 'À adapter',reference(h,u),sourceUrl]);
  }
  for(const sheet of (getHeroCompleteSpritePack(h)||[]).filter(p=>/^fps/i.test(p.id)))assetRows.push([h.id,u,h.name,sheet.id,sheet.src,assetState(sheet.src),JSON.stringify(getSpriteSheetLayout(sheet.src)),model.src===sheet.src?'Raccordement mains partiel':sheet.id==='fpsProjectile'?'Projectile source raccordé au pack':'Planche inventoriée ; découpage dédié à contrôler','Aucune approbation 1:1 déduite du nom ou de la présence du fichier',src(sourceCommit,'src/game/spriteAssets.js')]);
 }
 // Retain known legacy art without redirecting it onto the similarly named live persona.
 for(const p of trackedFiles.filter(p=>p.includes('/buckhead/bucket-guitar-echo-complete/')&&/fps.*\.png$/.test(p)))assetRows.push(['bucket_guitar_echo','Buckhead (ancien)','Bucket Guitar Echo (ancien)','fps',p.slice('public'.length),'Présent dans Git','4 × 10','Identité absente du roster actuel ; ne pas aliaser à buckethead_avatar','Ressource historique conservée, affectation à arbitrer',src(sourceCommit,'src/game/spriteAssets.js')]);
 add('Heros_Extinction',['ID','Univers','Personnage','Rôle source','Compatibilité','Incarnation source','Anatomie / tenue source','Arme / outil source','Techniques source','Palette source','Planche FPS résolue','Présence fichier','Statut','Manquant / limite','Référence déclarée','Source dépôt'],heroRows,'Inclut l’Ancre créée par playerHero ; les participants non combattants sont conservés, non armés.');
 const handRows=heroRows.filter(r=>r[4]!=='Non combattant').map(r=>[
  `${r[0]}::viewmodel`,r[1],r[2],r[7],r[6],r[5],
  `Vue subjective de ${r[2]} : cadrer les mains/appendices et ${r[7]}. Reprendre uniquement la morphologie et la tenue renseignées ci-contre ; laisser les détails non sourcés à valider.`,
  'Calques indépendants : main dominante, main de soutien, manches/poignets, arme/outil, mécanisme ou pièce mobile, émission et impact ; liaisons et pivots constants.',
  'FPS-IDLE, FPS-MOVE, FPS-DRAW, FPS-PRIMARY, FPS-SECONDARY, FPS-RELOAD, FPS-DEFENSE, FPS-SPECIAL, FPS-HIT, FPS-INTERACT. Un rechargement ne doit pas être inventé pour une arme sans munitions.',
  r[10],r[11],r[12],r[13],r[14],r[15]]);
 add('Armes_mains_FPS',['ID vue','Univers','Personnage','Arme / outil source','Anatomie / tenue source','Incarnation source','Cadrage à produire','Séparation des calques','Animations et exceptions','Asset actuel','Présence fichier','Statut','Limite actuelle','Référence déclarée','Source dépôt'],handRows,'Une spécification de vue subjective par combattant actuel ; aucune arme individuelle, anatomie absente ou animation supplémentaire n’est inventée comme canon.');
 add('Actions_FPS',['Clé','Univers','Personnage','Emplacement','Action source','Type source','Paramètres source','Arme source','Ancrage visuel','Adaptation FPS proposée','Précision source','Intégration actuelle','Statut','Référence déclarée','Source dépôt'],actionRows,'Une ligne par action de chaque combattant. Les gestes, projectiles et effets proposés ne sont pas des contenus déjà implémentés.');
 const projectileRows=actionRows.filter(r=>r[3]!=='defense'&&!/melee|fists|sword|claw|slash|bite|kick|heal|buff|shield|dodge|dash/.test(r[5])).map(r=>[
  `${r[0]}::effect`,r[1],r[2],r[4],r[5],r[9],
  'Séparer émission, trajet/trace, profondeur, impact et extinction ; ne pas afficher une balle pour un rayon, une onde ou une invocation.',
  'Trajectoire, vitesse, échelle et collisions propres à cette adaptation non renseignées dans le moteur FPS actuel ; définir après validation de la source.',
  'À produire',r[13],r[14]]);
 add('Projectiles_FPS',['ID effet','Univers','Personnage','Action source','Type source','Adaptation proposée','Calques et lecture FPS','Paramètres à définir','Statut','Référence déclarée','Source dépôt'],projectileRows,'Déclinaisons proposées des actions non purement corporelles. Ce tableau inclut traces, rayons et invocations : une ligne ne signifie pas forcément un projectile physique.');
 add('Cite_personnages',['ID','Univers','Personnage','Rôle Cité proposé','Anatomie / tenue source','Sprite actuel','Présence fichier','Disposition source','Contrats à produire','Dialogue / activité à développer','Limite runtime','Statut','Source dépôt'],cityPeople,'Réutilisation existante de sprites et besoins de véritables animations d’exploration ; aucun ajout de menace dans le quartier sûr.');
 add('Assets_FPS',['ID propriétaire','Univers','Nom','Usage déclaré','Chemin','Présence fichier','Disposition déclarée','Raccordement','Limite de preuve','Source dépôt'],assetRows,'Présence Git et métadonnées ne certifient ni qualité visuelle, ni animation, ni fidélité.');
 const threatHeaders=['Clé catalogue','Univers','Nom','Niveau','Arme source','Attaque spéciale source','Ancrage / incarnation source','Sprite catalogue','Présence fichier','Adaptation FPS proposée','Usage Cité proposé','Statut','Référence déclarée','Source dépôt'];
 const threatRows=t=>{const {actor:a,universe:u,kind,key}=t,p=getEnemySpriteSheetSrc({...a,universe:u});return [key,u,a.name,kind,text(a.weapon)||a.weaponType||'Non précisé',text(a.special)||'Non précisé',short(a.visualAnchor)||continuity(a,u),p,assetState(p),
  nonCombat(a)?'Entité non combattante : interaction/épreuve, pas de cible FPS':`${kind}: ${a.name}. Vue en profondeur avec directions et animations FPS-ENEMY${kind!=='Ennemi'?' / FPS-BOSS':''}; attaque ${text(a.special)||text(a.weapon)||'à documenter'}. Hitbox, portée et point faible à tirer de la source, pas de phase inventée.`,
  nonCombat(a)?'Rencontre / épreuve pacifique':'Codex, exposition ou sortie de mission ; aucune apparition hostile automatique dans le quartier sûr.',nonCombat(a)?'Hors combat':'À adapter',reference(a,u),src(sourceCommit,'src/game/enemies.js')];};
 add('Ennemis_FPS',threatHeaders,allThreats.filter(t=>t.kind==='Ennemi').map(threatRows),'Entrées ennemies du catalogue complet ; elles ne sont pas raccordées aux six archétypes génériques du moteur Extinction.');
 add('Boss_FPS',threatHeaders,allThreats.filter(t=>t.kind!=='Ennemi').map(threatRows),'Boss, boss mondiaux et boss final conservés avec leur identité de catalogue ; occurrence ≠ personnage distinct entre opus.');
 const finals=[];
 for(const u of universeNames){const p=ENEMIES_DB[u]?.finalePolicy;if(p)finals.push([u,p.policy,text(p.continuity),text(p.objective),text(p.finale),text(p.reason),p.visualAnchor||'',p.output||'',assetState(p.output),p.policy==='nonCombatFinal'?'Pas de boss hostile à inventer ; adapter en objectif pacifique':'Événement / décor de finale ; ne pas convertir en ennemi humanoïde',p.referenceUrls?.join('\n')||'',src(sourceCommit,'src/game/enemies.js')]);}
 add('Finales_et_politiques',['Univers','Politique source','Continuité','Objectif source','Finale source','Raison source','Ancrage visuel','Asset déclaré','Présence fichier','Règle d’adaptation','Références déclarées','Source dépôt'],finals,'Les finales sans boss et les scènes spéciales ne deviennent pas des cibles de tir par défaut.');
 const universeRows=[],zones=[],kits=[],props=[],modes=[];
 const zoneSpecs=[['anchor','Place et rencontres','talk',610,280,640,280,'CITY-IDLE / CITY-WALK / CITY-TALK'],['memory','Codex local','codex',190,710,430,205,'CITY-PROP / CITY-USE'],['breach','Balise mission','mission',1245,710,430,205,'CITY-PORTAL / CITY-USE'],['core','Ancre de stabilité','anchor',760,875,400,150,'CITY-PROP / CITY-AMBIENCE']];
 const modeDefs=[['extraction','3 balises puis Champion','Objectifs sur trois points et extraction ; conserver une route de repli.'],['last_signal','Élimination des signatures hostiles','Composer vagues depuis les ennemis source et limiter les mêlées incompatibles.'],['infestation','Survie 60 secondes / 3 600 frames','Faire varier la pression sans cacher les silhouettes et sans remplacer la règle de durée.'],['hunt','Défaite du Champion','Employer une cible source autorisée, ou documenter une alternative non létale.']];
 for(const u of universeNames){
  const lore=LORE_DB[u]||{},s=getUniverseSignature(u,lore),place=getUniverseHubPlace(u,'fr'),policy=ENEMIES_DB[u]?.finalePolicy;
  const boss=ENEMIES_DB[u]?.worldBoss?.name||'';
  const refs=reference(lore,u);
  universeRows.push([u,lore.mediaType||'Non précisé',text(s.theme),s.stageName||u,place.name,place.type,place.mood,policy?.policy||'Boss catalogue',boss||text(policy?.finale)||'Non renseigné','Non raccordé : pool FPS générique','Géométrie commune ; art spécialisé à produire',refs,src(sourceCommit,'src/game/lore.js')]);
  for(const z of zoneSpecs)zones.push([`${u}::${z[0]}`,u,z[0]==='anchor'?`Place ${place.name}`:z[1],z[2],`${z[3]}, ${z[4]} / ${z[5]} × ${z[6]} px`,`${place.name} ; ${s.stageName}. ${text(s.theme)}`,
   `${z[7]}; sol, premier plan, lumière et signalétique séparés. Préserver seuils et trajet vers le portail Galerie.`, 'Géométrie existante, décor spécifique à produire','Partiel',src(sourceCommit,'src/components/HubScreen.jsx')]);
  kits.push([u,place.name,s.stageName,text(s.theme),place.type,
   'Cité : sol raccordable, murs/angles, toit/masque, mobilier, panneau de service, portail, lumière, ambiance. Vue du dessus/3-quarts cohérente avec le moteur.',
   'Extinction : fond sans HUD, plans proche/moyen/lointain, sol, limites lisibles, couvertures, danger, points de ressources. Projection FPS propre ; ne pas recycler un plan tactique comme caméra.',
   place.type==='city'?'9 bâtiments procéduraux avec empreinte au sol ; pas un kit artistique complet':'Le type de quartier ne prouve pas un kit de bâtiments spécifique',
   'À produire',refs,src(sourceCommit,'src/components/HubScreen.jsx')]);
  for(const [id,label,interaction] of [['sign','Signalétique de quartier','Lire le nom et repérer les services sans texte intégré à l’image'],['portal','Portail de retour','Retour Galerie avec position conservée'],['light','Ambiance et lumière','Effet non bloquant conforme au thème source']])props.push([`${u}::${id}`,u,label,place.mood,interaction,'CITY-PROP / CITY-AMBIENCE','Objet fonctionnel/procédural ou besoin de production ; pas de fichier personnel résolu','À produire',src(sourceCommit,'src/components/HubScreen.jsx')]);
  for(const [id,rule,adaptation] of modeDefs)modes.push([`${u}::${id}`,u,id,rule,s.stageName,boss||'Aucun boss matériel déclaré',policy?.policy||'Boss catalogue',
   policy?.policy==='nonCombatFinal'?'Proposition : conserver les objectifs et entités non combattants ; pas de version létale automatique':`${adaptation} Décor lié à ${s.stageName}; comportements canoniques à valider.`,
   'Modes communs jouables ; version dédiée à cet univers non raccordée','À adapter',src(sourceCommit,'src/components/HubScreen.jsx')]);
 }
 for(const g of EQUIP_ITEMS_DB){props.push([`gear::${g.id}`,g.universe||'Non renseigné',text(g.name)||g.id,text(g.desc)||'Description source absente',`Vitrine A.R.C.A. consultable dans ${getUniverseHubPlace(g.universe,'fr').name} : recherche, pages de trois, marche vers le présentoir, fiche source et état possédé. Aucun achat, gain ni déblocage au simple examen.`,
  'CITY-PROP / CITY-USE',`${getItemSpriteSrc(g)} — ${assetState(getItemSpriteSrc(g))}; icône/relique ≠ prop de monde ; présentoir commun, modèle personnel encore à produire`,'Partiel',src(sourceCommit,'src/game/heroes.js')]);}
 add('Univers',['Univers','Média','Thème source','Lieu source','Quartier actuel','Type actuel','Ambiance actuelle','Politique finale','Boss / finale','Extinction actuel','Cité actuelle','Référence déclarée','Source dépôt'],universeRows,'Périmètre exhaustif des univers connus du catalogue de cette révision, pas de toutes les franchises existantes.');
 add('Cite_zones',['ID zone','Univers','Zone actuelle','Action actuelle','Rectangle source','Direction artistique sourcée','Kit proposé','Intégration actuelle','Statut','Source dépôt'],zones,'Quatre zones réelles par quartier d’univers. Les coordonnées sont celles du gabarit runtime, pas des lieux géographiques officiels.');
 add('Cite_props',['ID prop','Univers','Objet / famille','Description source','Usage Cité proposé','Contrat','Ressource / limite','Statut','Source dépôt'],props,'Les reliques possèdent un présentoir d’archives commun et une fiche consultable, pas un modèle individuel. Les trois familles de props spécifiques par univers restent des besoins de production.');
 add('Kits_environnement',['Univers','Quartier','Lieu source','Thème source','Type','Kit Cité proposé','Kit FPS proposé','État constaté','Statut','Référence déclarée','Source dépôt'],kits,'Spécifications proposées, distinctes des illustrations ou géométries réellement produites.');
 add('Modes_par_univers',['ID','Univers','Variante','Règle actuelle','Lieu source','Cible source','Politique','Adaptation proposée','Intégration actuelle','Statut','Source dépôt'],modes,'Quatre lignes par univers ; aucune version dédiée n’est déclarée implémentée par le seul remplissage de cette matrice.');
 add('Contrats_animation',['ID contrat','Contexte','État','Description attendue','Proposition technique','Contrainte de fidélité'],ANIMATION_CONTRACTS,'Les nombres d’images sont des propositions de production, pas des animations livrées.');
 const core=[['atrium','Atrium des Ancres','1680 × 1080','780,520','Missions / Archives / Forge / Galerie'],['threads','Galerie des Trames','2200 × 1260','220,700','9 portails par page ; tous les univers possédés restent indexés'],['archives','Archives A.R.C.A.','1640 × 980','820,760','Codex / Arcs / Journal'],['forge','Atelier d’Ancrage','1640 × 980','820,260','Équipe / Inventaire / Combat personnalisé']];
 add('Cite_noyau',['ID quartier','Nom','Dimensions actuelles','Apparition actuelle','Services actuels'],core,'Noyau commun existant ; l’accès à chaque destination complète reste une recette distincte du clic sur le terminal.');
 const engine=[['Traqueur','28 + 5 × vague','4','0.0025','Poursuite proche'],['Sniper','22 + 5 × vague','7','0.0015','Tir distant'],['Briseur','48 + 5 × vague','6','0.0018','Pression lourde'],['Essaim','16 + 5 × vague','2','0.0032','Pression rapide'],['Champion de Trame','180 + 40 × vague','10','0.0014','Bouclier/phase à vérifier selon le code'],['Drone Protecteur','24','3.5','0.0036','Trois drones invoqués lors de la phase de bouclier du Champion ; identité Nexus générique']];
 add('Runtime_Extinction',['Archétype actuel','PV source','Dégâts source','Vitesse source','Usage'],engine,'Les valeurs sont transcrites du moteur ; le catalogue Ennemis_FPS n’est pas son pool de spawn actuel.');
 const qa=[
 ['QA-ROSTER','Extinction','Tous les combattants possédés, y compris après le 40e','Aucune troncature ; non-combattants absents du sélecteur FPS, conservés ailleurs','Partiel','P1'],
 ['QA-IDENTITY','Extinction','Mirelle / Arthur / Serj et personnage sans planche','La planche correspond à l’ID exact ; aucun corps entier ou costume inconnu déguisé en mains','Tests unitaires ajoutés','P1'],
 ['QA-LOOT','Extinction','Arme ramassée shotgun/plasma/rocket','Plus de carte de Mirelle présentée comme l’arme ramassée ; schéma identifié en attendant l’art','Tests unitaires ajoutés','P1'],
 ['QA-CITY-LANG','Cité','12 ambiances et trois familles','Texte anglais réel, mêmes noms localisés et mêmes types de quartier','Tests unitaires ajoutés','P2'],
 ['QA-ALL-HEROES','Extinction','Chaque personnage, chaque action et chaque tenue','Revoir mains/poignets, arme, recul, projection, collisions, audio et interruption','À réaliser','P1'],
 ['QA-ENEMIES','Extinction','Chaque ennemi et boss listé','Hitboxes et phases adaptées à la vue FPS ; échelle et transitions lisibles','À réaliser','P1'],
 ['QA-PROJECTILES','Extinction','Chaque entrée Actions_FPS','Vérifier source, cible, trajectoire/trace, impact, TTL, pause et disparition','À réaliser','P1'],
 ['QA-DISTRICTS','Cité','Tous les quartiers','Routes sans blocage, seuils cohérents, occlusion, points sûrs et retour de menu','À réaliser','P1'],
 ['QA-DESTINATIONS','Cité','Vrais écrans ouverts par tous les services','Monter les destinations complètes, revenir au quartier et à la position initiale','À réaliser','P1'],
 ['QA-NONCOMBAT','Les deux','101 personnages marqués non combattants et politiques de finale','Aucune arme, hostilité ou récompense de kill inventée','Partiel','P0'],
 ['QA-HARDWARE','Les deux','Manette et multitouch physiques','Navigation, maintien, annulation, focus et zones sûres sur appareil réel','À réaliser','P2'],
 ['QA-CLOUD','Les deux','Compte cloud réel','Écritures uniques, conflits et restauration sans régression','À réaliser','P1'],
 ['QA-MEDIA','Les deux','Tous les fichiers déclarés présents','Comparer visuellement à l’incarnation et à la source ; un nom de fichier ne valide pas la fidélité','À réaliser','P1'],
 ['QA-40-PAGES','Interface','40 écrans du classeur UI distinct','Recette consolidée avec vrais médias et progression','À réaliser','P1'],
 ['QA-BUNDLE','Application','Bundle de production','Mesurer poids/temps avant découpage ; conserver les catalogues et la sauvegarde','À réaliser','P2'],
 ['QA-RESIDENT-INDEX','Cité','Répertoire de tous les habitants possédés et visibles','Recherche nom/univers/ID, pages de neuf, groupes de dix-sept ; 121 tests ciblés et 12 approches navigateur sur trois identités. Preuve : residents-fps-ci-receipt-2026-10-27.json','Partiel','P1'],
 ['QA-RESIDENT-PATH','Cité','Cible mouvante et PNJ interposés','Détour sans traverser les corps ; six tests de navigation et quatre formats navigateur. Pas de téléportation ; source : src/game/mosaicCityRuntime.js','Partiel','P1'],
 ['QA-RESIDENT-CANCEL','Cité','Clavier, terminal et cible supprimée','Annuler la poursuite et conserver le checkpoint ; aucune nouvelle identité possédée, aucun gain. Parcours complet des services encore ouvert','Partiel','P1'],
 ['QA-FPS-CROP','Extinction','Mirelle sur quatre formats ; Arthur et Serj sur ordinateur','Munitions consommées, recharge réelle, drawImage dans la cellule et rapport d’aspect préservé. Hors validation artistique ou projectile physique','Partiel','P1'],
 ['QA-PROGRESSION-CONTRACT','Build','Contrat exécutable des mains FPS','Résoudre identité, lignes et rognage au lieu de rechercher l’ancien texte dans HubScreen ; tests négatifs et replis conservés. Build intégral distinct','Partiel','P0'],
 ['QA-CI-PUBLICATION','Les deux','Source dc95aec15309fb2f9a23e36971b30db46197f9a6','Fichiers identiques aux blobs validés : https://github.com/darknigthmare/multiverse-breach/actions/runs/40508601682 ; résultats finaux de la PR nº 11 à lire séparément','Partiel','P1'],
 ['QA-INFESTATION-STABILITY','Extinction','Bot de partie complète Infestation','Diagnostiquer l’échec intermittent signalé dans la PR nº 10 ; ne pas réduire la difficulté ni forcer la victoire pour obtenir un test vert','À réaliser','P1'],
 ['QA-SPARSE-MEDIA','Les deux','Décors secondaires et portraits hors sélection CI','Arthur/Serj : décors secondaires ; portrait du combattant de fin de liste : vérifier avec tous les médias. Les mains requises décodées ne prouvent pas ce chargement','À réaliser','P2']
 ];
 qa.push(
 ['QA-NEXUS-PROTOCOLS','Extinction','Ancre, Mirelle, Bastion, Nova, Marrow, Sable, Loom','28 adaptations ; 28 nouveaux tests couvrant actions et vitrines. Charge, recharges, soin, garde, trajets et absence de gain ; détail dans continuation-2026-10-28.md','Partiel','P1'],
 ['QA-NEXUS-PROJECTILES','Extinction','Fil de Résonance, Mine de Lecture, Barrage du Cartographe','Projectiles mobiles, mine armée après 30 pas, collisions balayées, expiration, bouclier champion, identité de session, pause et abandon','Partiel','P1'],
 ['QA-CITY-EXHIBITS','Cité','Relique du catalogue par univers, hors objets désactivés','Recherche, pagination, état possédé / amélioré ; présentoir non canonique, inspection sans achat ni récompense ; approche réelle dans quatre formats','Partiel','P1'],
 ['QA-PROTOCOL-ART','Extinction','Animation et son individuels de chaque technique','Les actions exécutables ne sont pas 28 nouvelles animations. Sept kits mécaniques, trois raccordements de mains antérieurs ; revue artistique et équilibrage humains encore ouverts','À réaliser','P1']);
 add('Recette_et_ouverts',['ID','Contexte','Périmètre','Critère de validation','État','Priorité'],qa,'Les tests de code ne certifient ni fidélité 1:1, ni qualité artistique, ni tous les matériels.');
 const sourcePaths=['src/game/extinctionSignatures.js','src/game/mosaicExhibits.js','scripts/extinctionSignatures.test.mjs','scripts/mosaicExhibits.test.mjs','scripts/browserExtinctionProtocols.py','src/game/heroes.js','src/game/enemies.js','src/game/lore.js','src/game/expandedUniverses.js','src/game/canonRosterWave.js','src/game/spriteAssets.js','src/game/playerHero.js','src/game/mosaicCityRuntime.js','src/game/scenePresentation.js','src/components/HubScreen.jsx','src/game/mosaicResidents.js','src/game/extinctionContent.js','scripts/extinctionViewmodelContract.mjs','docs/extinction-city/residents-fps-ci-receipt-2026-10-27.json'];
 const sources=sourcePaths.map(p=>[p,src(sourceCommit,p),'Source projet figée ; les adaptations proposées ne sont pas des faits canoniques externes']);
 sources.push(['Nouvelle logique','src/game/extinctionContent.js','Dans le commit de continuation ; inventaire produit après ces modifications'],['Quartiers localisés','src/game/mosaicUniversePlaces.js','Refactorisation du gabarit existant ; 12 traductions d’ambiance'],['Références externes','Colonnes Référence déclarée','Recopiées depuis les sources du projet ; non consultées ni revalidées lors de cet export']);
 add('Sources', ['Ressource','URL / chemin','Portée'],sources,'Aucune certification externe implicite. Les 525 univers ne prétendent pas couvrir chaque personnage jamais créé dans leur franchise.');
 // One character/universe per row in these matrices: keep all slot details,
 // but avoid repeating identity/source columns four times in a very large workbook.
 const actionGroups=new Map();
 for(const r of actionRows){
  if(!actionGroups.has(r[0].split('::')[0]))actionGroups.set(r[0].split('::')[0],{id:r[0].split('::')[0],u:r[1],name:r[2],slots:{},ref:r[13],url:r[14]});
  actionGroups.get(r[0].split('::')[0]).slots[r[3]]=`${r[4]} [${r[5]}]\nParamètres source : ${r[6]}\n${r[9]}\n${r[10]}`;
 }
 tables.Actions_FPS={headers:['ID personnage','Univers','Personnage','Primaire source et FPS','Secondaire source et FPS','Défense source et FPS','Spéciale source et FPS','Intégration / statut','Référence déclarée','Source dépôt'],
  rows:[...actionGroups.values()].map(g=>[g.id,g.u,g.name,...combatSlots.map(k=>g.slots[k]),runtimeProfiles.has(g.id) ? 'Partiel — 4 actions jouables (28 pour les 7 identités Nexus). F secondaire / C défense / X ultime ; charge gagnée par les impacts. Cadrage/illustrations/audio dédiés et équilibrage encore à produire ou valider.' : 'À adapter : les quatre actions sont déclarées au catalogue mais ne sont pas raccordées individuellement au moteur Extinction.',g.ref,g.url]),
  note:'Quatre actions détaillées par personnage, regroupées sur une seule ligne pour faciliter la lecture. Armes et ancrages visuels : Armes_mains_FPS. Sept identités Nexus possèdent quatre adaptations exécutées dans le moteur ; les autres restent des propositions. Les animations individuelles restent distinctes.'};
 const projectileGroups=new Map();
 for(const r of projectileRows){
  const [id,slot]=r[0].split('::');
  if(!projectileGroups.has(id))projectileGroups.set(id,{id,u:r[1],name:r[2],slots:{},ref:r[9],url:r[10]});
  projectileGroups.get(id).slots[slot]=`${r[3]} [${r[4]}]\n${r[5]}`;
 }
 tables.Projectiles_FPS={headers:['ID personnage','Univers','Personnage','Effet primaire proposé','Effet secondaire proposé','Effet ultime proposé','Contrats communs','Statut','Référence déclarée','Source dépôt'],
  rows:[...projectileGroups.values()].map(g=>[g.id,g.u,g.name,g.slots.simple||null,g.slots.secondary||null,g.slots.special||null,
  runtimeProfiles.has(g.id) ? 'Mécanique Nexus raccordée selon le type : projectile mobile / mine / rayon / onde / soutien. Dessin procédural de lecture ; pas un nouvel asset canonique. Bastion et Loom : soutien temporisé, pas PNJ autonome.' : 'Séparer émission, trajet/trace, profondeur, impact et extinction. Type, vitesse, portée, collision et durée à valider depuis la source ; une invocation ou un rayon n’est pas une balle.',runtimeProfiles.has(g.id)?'Partiel':'À produire',g.ref,g.url]),
  note:'Chaque cellule non vide de D à F est une déclinaison à produire. Vide = contact/soutien ou absence d’effet dans cette sélection, pas un fichier perdu.'};
 const zoneGroups=new Map();
 for(const r of zones){if(!zoneGroups.has(r[1]))zoneGroups.set(r[1],{u:r[1],zone:[],url:r[r.length-1]});zoneGroups.get(r[1]).zone.push(r.slice(2,-1).join(' | '));}
 tables.Cite_zones={headers:['Univers','Place et rencontres','Codex local','Balise mission','Ancre de stabilité','Source dépôt'],rows:[...zoneGroups.values()].map(g=>[g.u,...g.zone,g.url]),note:'Les quatre zones du gabarit actuel réunies par univers. Coordonnées, actions et contrats préservés ; décors individuels encore à produire.'};
 const modeGroups=new Map();
 for(const r of modes){if(!modeGroups.has(r[1]))modeGroups.set(r[1],{u:r[1],mode:[],url:r[r.length-1]});modeGroups.get(r[1]).mode.push(r.slice(2,-1).join(' | '));}
 tables.Modes_par_univers={headers:['Univers','Extraction','Dernier Signal','Infestation','Chasse au Champion','Source dépôt'],rows:[...modeGroups.values()].map(g=>[g.u,...g.mode,g.url]),note:'Quatre variantes détaillées par univers, sur une ligne. Les colonnes ne constituent pas quatre cartes dédiées déjà livrées.'};
 return {schema:1,sourceCommit,scope:'Current resolved repository catalogs, plus explicitly labeled production proposals. No art approval.',
  counts:{runtimeSignatureHeroes:runtimeProfiles.size,runtimeSignatureActions:[...runtimeProfiles.values()].reduce((n,p)=>n+Object.keys(p.actions).length,0),cityExhibitRecords:EQUIP_ITEMS_DB.length,actionEntries:actionRows.length,projectileEntries:projectileRows.length,zoneEntries:zones.length,modeEntries:modes.length,universes:universeNames.length,heroes:heroes.length,baseHeroes:HEROES_DB.length,nonCombat:heroes.filter(nonCombat).length,
   combatants:heroes.filter(isExtinctionCombatant).length,enemies:allThreats.filter(t=>t.kind==='Ennemi').length,
   bosses:allThreats.filter(t=>t.kind!=='Ennemi').length,finalePolicies:finals.length,personalFpsBindings:heroes.filter(h=>getExtinctionViewmodel(h).src).length},tables};
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const commit=process.argv[2],output=process.argv[3];
 const trackedFile=path.join(root,'TRACKED_FILES.txt');
 const tracked=existsSync(trackedFile)?readFileSync(trackedFile,'utf8').split('\n'):execFileSync('git',['ls-files'],{cwd:root,encoding:'utf8',maxBuffer:32*1024*1024}).split('\n');
 const catalog=buildCatalog(commit,tracked);
 catalog.dataSha256=createHash('sha256').update(JSON.stringify(catalog.tables)).digest('hex');
 if(output){mkdirSync(path.dirname(path.resolve(output)),{recursive:true});writeFileSync(output,JSON.stringify(catalog));console.log(JSON.stringify({counts:catalog.counts,rows:Object.fromEntries(Object.entries(catalog.tables).map(([k,t])=>[k,t.rows.length])),dataSha256:catalog.dataSha256}));}
 else process.stdout.write(JSON.stringify(catalog));
}
