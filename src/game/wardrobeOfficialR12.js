// Publisher-backed existence and exact wearers; not finished artwork or global completeness.
const L=(fr,en)=>Object.freeze({fr,en});
const checkedOn='2026-10-25';
export const WARDROBE_SOURCES_R12=Object.freeze([
 {id:'capcom-drdr-packs',publisher:'Capcom',url:'https://store.steampowered.com/app/2527390/',scope:'Six named Costume & BGM pack lists: 20 costume names. Gameplay wardrobe and turnarounds are not exhaustively reviewed.'},
 {id:'capcom-drdr-wearer',publisher:'Capcom',url:'https://store.steampowered.com/dlc/2527390/',scope:'Publisher catalogue identifies Frank as the costume wearer; no transfer to the referenced character.'},
 {id:'bhvr-slipknot',publisher:'Behaviour Interactive',url:'https://deadbydaylight.com/news/slipknot-collection/',scope:'Four masks bound to active killers; four further named items have no matching active wearer. Article separates masks from the Legion full outfit.'},
 {id:'bhvr-maiden',publisher:'Behaviour Interactive',url:'https://deadbydaylight.com/news/iron-maiden-collection/',scope:'Named tour shirt for original Survivors. Article does not establish identical geometry/print on every wearer; Legendary Eddie models need separate identity review.'},
 {id:'tripwire-deluxe',publisher:'Tripwire Interactive',url:'https://store.steampowered.com/dlc/232090/',scope:'Publisher catalogue excerpt explicitly names Scullyphones for DJ Scully and Mr Foster. Truncated recipient list and unspecified color variants are not expanded.'},
 {id:'bhvr-charity-research',publisher:'Behaviour Interactive',url:'https://store.steampowered.com/dlc/381210/',scope:'Charity Chest lists recipients but not the exact item names/components in the inspected catalogue excerpt; research only.'},
 {id:'capcom-dr2-research',publisher:'Capcom',url:'https://store.steampowered.com/app/45740/',scope:'Chuck protagonist and four skill-pack names; attire components require additional evidence, not automatic costume grants.'},
 {id:'capcom-otr-research',publisher:'Capcom',url:'https://store.steampowered.com/app/45770/',scope:'Frank in Off the Record and skill-pack names. Clothing versus gameplay package remains to establish.'}
].map(s=>Object.freeze({...s,checkedOn})));
const sources=new Map(WARDROBE_SOURCES_R12.map(s=>[s.id,s]));
function costume(universe,ids,key,name,work,sourceId,nature,component,fr,en,extra={}) {
 const source=sources.get(sourceId);if(!source)throw new Error(`Unknown R12 source ${sourceId}`);
 return Object.freeze({universe,actorIds:Object.freeze(ids),key,name:L(name,name),sourceId,sourceUrl:source.url,
  sourceWork:work,targetIncarnation:work,sourceMode:universe==='Dead Rising'?'DRDR_2024_FRANK':universe==='Dead by Daylight'?'DBD_COSMETIC':'KF2_COSMETIC',
  sourceEvidence:sourceId==='tripwire-deluxe'?'PUBLISHER_CATALOGUE_EXCERPT':'PUBLISHER_NAMED_VARIANT_AND_WEARER',
  checkedOn,nature,component,brief:L(fr,en),note:'Existence et porteur documentés ; vues et graphismes à produire. Aucun bonus, personnage, pouvoir, arme, musique ou contenu annexe transféré.',
  modelChange:'UNASSESSED',visualEvidence:'NOT_INSPECTED',artworkStatus:'NOT_PRODUCED',artApproval:'NOT_REVIEWED',equippable:false,...extra});
}
// The manifest covers these six DLC lists only, never all of Frank's wardrobe/franchise.
export const DRDR_NAMED_PACKS_R12=Object.freeze([
 ['Resident Evil Villains',['chainsaw-villager','Chainsaw Villager'],['licker','Licker'],['nemesis','Nemesis']],
 ['Resident Evil Heroes',['ashley-graham','Ashley Graham'],['chris-redfield','Chris Redfield'],['leon','Leon S. Kennedy']],
 ['Mega Man',['lan-hikari','Lan Hikari'],['mega-man','Mega Man'],['tron-bonne','Tron Bonne']],
 ['Dead Rising Original',['chuck-greene','Chuck Greene'],['frank-2006','Frank West 2006'],['mall-bee','Willamette Parkview Mall Bee']],
 ['Willamette Parkview Mall',['clown','Clown'],['creepy-rabbit','Creepy Rabbit'],['sheriff','Sheriff'],['war-photographer','War Photographer']],
 ['Capcom Fighters',['blodia','Blodia'],['ken','Ken'],['rikuo','Rikuo'],['sodom','Sodom']]
].map(([pack,...items])=>Object.freeze({pack,items:Object.freeze(items.map(([slug,name])=>Object.freeze({key:`drdr-${slug}`,name})))})));
const frank=DRDR_NAMED_PACKS_R12.flatMap(pack=>pack.items.map(item=>costume('Dead Rising',['dead_rising_frank_west'],item.key,item.name,
 `Dead Rising Deluxe Remaster (2024) — ${pack.pack} Pack`,'capcom-drdr-packs','official-costume','outfit-only',
 `Frank West porte « ${item.name} » dans le pack ${pack.pack} du remaster 2024. Relever les volumes, couches, attaches, tête visible ou masquée et proportions sur ce costume précis. Ne pas remplacer Frank par le personnage ou le boss cité dans le nom ; ne pas copier automatiquement son modèle d'une autre franchise. Comparer avant/arrière/profils et les poses de Frank. Musiques et objets du pack exclus.`,
 `Frank West wears ${item.name} from the ${pack.pack} pack in the 2024 remaster. Record volumes, layers, attachments, exposed or covered head and proportions from this specific costume. Do not replace Frank with the character or boss named by the item, or copy another franchise's model automatically. Compare front/back/sides and Frank's poses. Pack music and items are excluded.`,
 {coverageScopeId:'drdr-six-named-packs-2024',secondarySourceUrl:sources.get('capcom-drdr-wearer').url})));
const masks=[
 ['dead_by_daylight_wraith','wraith','Metallic Grill'],
 ['dead_by_daylight_doctor','doctor','Zipper Mouthpiece'],
 ['dead_by_daylight_hillbilly','hillbilly','Engraved Flesh'],
 ['dead_by_daylight_trapper','trapper','Ashen Quake']
].map(([id,slug,name])=>costume('Dead by Daylight',[id],`dbd-slipknot-${slug}`,name,'Dead by Daylight — Slipknot Collection (2024)',
 'bhvr-slipknot','official-accessory','head-mask',
 `Masque « ${name} » sur son tueur exact. Relever sa géométrie, ses attaches et les zones du visage occultées ; conserver corps, arme et animations du porteur. Ce n'est pas une tenue complète, un membre du groupe jouable ou une nouvelle capacité. Ne pas attribuer ce masque aux autres tueurs.`,
 `The ${name} mask on its exact killer. Record geometry, attachment and facial occlusion; preserve the wearer's body, weapon and animations. This is not a full outfit, a playable band member or a new ability. Do not give this mask to another killer.`));
export const OFFICIAL_COSTUMES_R12=Object.freeze([...frank,...masks,
 costume('Dead by Daylight',['dead_by_daylight_dwight_fairfield','dead_by_daylight_meg_thomas','dead_by_daylight_claudette_morel'],
  'dbd-eddies-live-shirt','Eddie’s Live Shirt','Dead by Daylight — Iron Maiden Collection (2024)','bhvr-maiden','official-costume','torso-only',
  'T-shirt de tournée pour ces trois Survivants originaux présents. Produire une coupe et un raccord propres à Dwight, Meg et Claudette ; la source annonce des différences selon le porteur, donc ne pas déclarer les trois impressions identiques sans captures. Conserver tête, bas et identité ; ne pas équiper automatiquement les Survivants sous licence ni importer une musique.',
  'Tour shirt for these three present original Survivors. Produce wearer-specific fit and joints for Dwight, Meg and Claudette; the source mentions wearer-dependent differences, so do not assert identical prints without screenshots. Preserve head, lower body and identity; no automatic licensed-Survivor assignment or music import.'),
 costume('Killing Floor 2',['killing_floor_2_dj_scully_dj_masque','killing_floor_2_mr_foster_masque_a_gaz'],
  'kf2-scullyphones','Scullyphones','Killing Floor 2 — Digital Deluxe Edition','tripwire-deluxe','official-accessory','headphones',
  'Casque audio Scullyphones : raccord distinct sur DJ Scully et sur le masque à gaz de Mr Foster. Relever arceau, oreillettes, attaches et occultations sur chaque modèle. Les variantes de couleur ne sont pas nommées dans l’extrait : ne pas inventer des droits supplémentaires. Aucun personnage, voix, tenue de corps ou avantage accordé.',
  'Scullyphones headphones: separate fit on DJ Scully and Mr Foster’s gas mask. Record headband, earcups, attachment and occlusion on each model. The excerpt does not name color variants: do not invent extra entitlements. No character, voice pack, body outfit or advantage is granted.')
]);
const research=(universe,id,key,sourceId,fr,en,status='REFERENCE_DETAILS_REQUIRED')=>Object.freeze({universe,id,key,
 sourceUrl:sources.get(sourceId).url,question:L(fr,en),status,note:'Research only. No entitlement, art approval or automatic substitution.'});
export const WARDROBE_RESEARCH_R12=Object.freeze([
 research('Dead Rising','dead_rising_frank_west','drdr-base-wardrobe','capcom-drdr-packs','Compléter les vêtements du jeu de base et les autres épisodes : les vingt noms des six packs ne sont pas toute la garde-robe de Frank.','Research base-game clothing and other releases: twenty names from six packs do not exhaust Frank’s wardrobe.'),
 research('Dead Rising','dead_rising_frank_west','otr-skills-attire','capcom-otr-research','BBQ Chef, COSPLAY, Firefighter, Cyborg : distinguer composant vestimentaire, porteur et effets avant tout ajout.','BBQ Chef, COSPLAY, Firefighter, Cyborg: establish clothing component, wearer and gameplay effects before adding rights.','CLOTHING_COMPONENT_UNRESOLVED'),
 research('Dead Rising','dead_rising_chuck_greene','dr2-skills-attire','capcom-dr2-research','Ninja, Psychopath, Soldier of Fortune, Sports Fan : documenter séparément la tenue de Chuck et les capacités du pack.','Ninja, Psychopath, Soldier of Fortune, Sports Fan: separately document Chuck’s attire and pack abilities.','CLOTHING_COMPONENT_UNRESOLVED'),
 research('Dead by Daylight','dead_by_daylight_doctor','dbd-pharoah-eddie-identity','bhvr-maiden','Pharoah Eddie, modèle Legendary du Doctor : définir identité représentée et compatibilité avant de le traiter comme un vêtement.','Pharoah Eddie, the Doctor Legendary model: establish depicted identity and compatibility before treating it as clothing.','LEGENDARY_IDENTITY_REVIEW'),
 ...['dwight_fairfield','claudette_morel','nurse','huntress'].map(id=>research('Dead by Daylight',`dead_by_daylight_${id}`,`dbd-charity-${id.replaceAll('_','-')}`,'bhvr-charity-research','Charity Chest : relever le nom exact, le composant et le modèle de cette récompense ; la liste de porteurs seule ne suffit pas.','Charity Chest: obtain this reward’s exact name, component and model; a recipient list alone is insufficient.','NAMED_ITEM_AND_COMPONENT_UNRESOLVED')),
 ...['dj_scully_dj_masque','mr_foster_masque_a_gaz'].map(id=>research('Killing Floor 2',`killing_floor_2_${id}`,`kf2-variants-${id.replaceAll('_','-')}`,'tripwire-deluxe','Documenter chaque variante de Scullyphones ; ne pas fabriquer de noms ou de couleurs à partir de « multiple variants ».','Document each Scullyphones variant; do not invent names or colors from “multiple variants”.','VARIANT_NAMES_UNRESOLVED'))
]);
export const UNBOUND_COSTUME_RESEARCH_R12=Object.freeze([
 ['The Deathslinger','Dominant Eye','mask'],['The Clown','Grim Circus','mask'],['The Blight','Molded Visage','mask'],['The Legion (Frank)','Subliminal Menace','full-outfit']
].map(([actorName,costume,component])=>Object.freeze({actorName,costume,component,universe:'Dead by Daylight',
 sourceWork:'Dead by Daylight — Slipknot Collection (2024)',sourceUrl:sources.get('bhvr-slipknot').url,
 sourceEvidence:'PUBLISHER_NAMED_VARIANT_AND_WEARER',status:'ACTOR_BINDING_MISSING',equippable:false,
 note:'Exact DBD wearer not linked. Legion Frank is not Frank West; no fuzzy name or cross-universe reward.'})));
export const WARDROBE_SOURCE_SCOPES_R12=Object.freeze([
 Object.freeze({id:'drdr-six-named-packs-2024',universe:'Dead Rising',actorId:'dead_rising_frank_west',
  sourceUrl:sources.get('capcom-drdr-packs').url,checkedOn,
  expectedItems:Object.freeze(DRDR_NAMED_PACKS_R12.flatMap(p=>p.items)),
  boundary:'Only the 20 named costumes in six listed DLC packs; excludes base-game unlocks, other games, BGM, weapons and full visual review.'})
]);
