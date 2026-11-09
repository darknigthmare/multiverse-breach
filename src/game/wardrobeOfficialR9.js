// Publisher-named variants. Instructions are acceptance requirements, not art approvals.
const L=(fr,en)=>Object.freeze({fr,en});
const source=(id,publisher,url,scope)=>Object.freeze({id,publisher,url,scope,checkedOn:'2026-10-24'});
export const WARDROBE_SOURCES_R9=Object.freeze([
 source('lightning-pc','Square Enix','https://store.steampowered.com/app/345350/','Fourteen PC schemata; garb component only. Aerith explicitly excluded from this PC list.'),
 source('sonic-rathalos','SEGA','https://store.steampowered.com/app/2089730/','Two named Sonic Frontiers outfits; BBQ mini-game is separate.'),
 source('sonic-holiday','SEGA','https://store.steampowered.com/dlc/1237320/','Holiday Cheer Suit named; model details not inspected.'),
 source('sonic-shoes','SEGA','https://store.steampowered.com/app/2089840/','Footwear only. Historical promotional condition is not a current availability claim.'),
 source('horizon-complete','PlayStation PC','https://store.steampowered.com/api/appdetails?appids=1151640','Two named Aloy outfits. Bows and resource packs remain separate.'),
 source('gunzerker-packs','2K','https://store.steampowered.com/dlc/49520/','Two named heads and two skins, not four full outfits.'),
 source('ff15-half-life','Square Enix','https://store.steampowered.com/api/appdetails?appids=637650','Main-game costume and COMRADES HEV/glasses distinguished. Wearer/model references remain to confirm.')
]);
const bySource=new Map(WARDROBE_SOURCES_R9.map(s=>[s.id,s]));
const make=(universe,id,key,name,sourceWork,sourceId,fr,en,nature='official-costume',component='outfit')=>{
 const s=bySource.get(sourceId);if(!s)throw new Error(`Unknown R9 source: ${sourceId}`);
 return Object.freeze({universe,actorIds:Object.freeze([id]),key,name:L(name,name),sourceWork,sourceId,
  sourceUrl:s.url,sourceEvidence:component==='garb-only'?'PUBLISHER_NAMES_SCHEMA':'PUBLISHER_NAMES_EXACT_VARIANT',
  sourceCheckedOn:s.checkedOn,nature,component,targetIncarnation:sourceWork,visualSpec:L(fr,en),
  visualEvidence:'NOT_INSPECTED',artworkStatus:'NOT_PRODUCED',artApproval:'NOT_REVIEWED',equippable:false,
  note:'Existence documentée ; captures multi-vues et graphismes restent à produire. Les consignes ne sont pas une observation de sprites terminés. Aucun effet de gameplay transféré.',
  noteEn:'Existence documented; multi-view references and artwork remain to be produced. Instructions are not observations of finished sprites. No gameplay effect transferred.'});
};
const schemata=['Divine Wear','Moogle Lover','Ultimate Saviour','FFX-2 Yuna','FFVII Cloud','FFX Yuna','Tomb Raider','Shining Prince','Dark Samurai','Sohei Savior','Utsusemi','Art of War','Flower of Battle','Shogun'];
const crossovers={'FFX-2 Yuna':['Yuna de FFX-2','Yuna in FFX-2'],'FFVII Cloud':['Cloud','Cloud'],'FFX Yuna':['Yuna de FFX','Yuna in FFX'],'Tomb Raider':['Lara Croft','Lara Croft']};
const lightning=schemata.map(name=>{
 const cross=crossovers[name];
 return make('Final Fantasy XIII','lightning_ff13',`lr-${name.toLowerCase().replace(/[^a-z0-9]/g,'-')}`,name,
  'Lightning Returns: Final Fantasy XIII — PC (2015)','lightning-pc',
  `Isoler la partie vêtement du schéma ${name}. Photographier face, dos, profils et attaches sur Lightning de Lightning Returns. Séparer arme, bouclier, propriétés et effets du schéma ; conserver ses proportions et son visage.`+(cross?` Cette tenue inspirée de ${cross[0]} appartient à Lightning : ne pas remplacer son visage, son corps ou ses capacités par ceux du personnage cité.`:' Ne pas déduire les couleurs, les emblèmes ou la coupe à partir du nom : relever le modèle exact en jeu.'),
  `Isolate the garb component of ${name}. Capture front, back, profiles and fastenings on Lightning in Lightning Returns. Separate the schema weapon, shield, properties and effects; retain her proportions and face.`+(cross?` This ${cross[1]}-inspired garb belongs to Lightning: do not replace her face, body or abilities with the referenced character.`:' Do not infer colors, emblems or tailoring from the name: record the exact in-game model.'),
  'official-costume','garb-only');
});
const rathalos=[['hunter',"Hunter's Rathalos Outfit"],['felyne',"Felyne's Rathalos Outfit"]].map(([key,name])=>make(
 'Sonic','sonic_hedgehog',`frontiers-rathalos-${key}`,name,'Sonic Frontiers — Monster Hunter Collaboration Pack (2022)','sonic-rathalos',
 `Relever séparément ${name} sur Sonic moderne de Frontiers. Préserver museau, oreilles, piquants, gants et proportions du porteur ; vérifier les découpes et superpositions de chaque pièce sur toutes les poses. Ni corps de chasseur humain, ni transformation en Felyne, ni minijeu BBQ ajouté.`,
 `Record ${name} separately on modern Frontiers Sonic. Preserve the wearer’s muzzle, ears, quills, gloves and proportions; inspect every piece and overlap in all poses. No human hunter body, Felyne transformation or added BBQ mini-game.`));
const aloy=[['carja-storm-ranger','Carja Storm Ranger Outfit'],['banuk-trailblazer','Banuk Trailblazer Outfit']].map(([key,name])=>make(
 'Horizon Zero Dawn','horizon_zero_dawn_aloy',`hzd-${key}`,name,'Horizon Zero Dawn Complete Edition — PC (2020)','horizon-complete',
 `Verrouiller Aloy et ${name} dans Zero Dawn Complete Edition, puis relever coiffe éventuelle, tresses, couches textiles, protections et attaches. Distinguer cette édition de Forbidden West ou du remaster. Conserver le Focus et le visage du personnage source ; arcs de bonus et caractéristiques de la tenue exclus du cosmétique.`,
 `Lock Aloy and ${name} in Zero Dawn Complete Edition, then document any headwear, braids, textile layers, protective pieces and fastenings. Distinguish this edition from Forbidden West or the remaster. Retain the source character’s Focus and face; bonus bows and outfit statistics are excluded from the cosmetic.`));
const salvador=[['major-malfunction','Major Malfunction','Domination','head'],['in-the-trenches','In the Trenches','Domination','skin'],['el-diablo','El Diablo','Madness','head'],['mess-with-the-bull','Mess With The Bull','Madness','skin']].map(([key,name,pack,part])=>make(
 'Borderlands 2','borderlands_2_salvador_gunzerking',`bl2-salvador-${key}`,name,`Borderlands 2 — Gunzerker ${pack} Pack (2013)`,'gunzerker-packs',
 part==='head'?`Pièce de tête ${name} pour Salvador : relever le modèle dans le menu de personnalisation, ses occultations du visage et ses raccords au cou. Ne pas inclure automatiquement le skin du même pack et ne pas modifier le corps ou la capacité Gunzerking.`:`Skin ${name} pour Salvador : documenter la répartition des motifs, couleurs et matières sur son corps existant. Ne pas ajouter automatiquement la tête du pack et ne pas le convertir en Axton ou un autre chasseur. Aucun gain de statistiques.`,
 part==='head'?`${name} head for Salvador: capture the model in character customization, face occlusion and neck joins. Do not automatically include the same pack’s skin or alter the body or Gunzerking ability.`:`${name} skin for Salvador: document pattern, color and material distribution on his existing body. Do not automatically add the pack’s head or convert him to Axton or another Vault Hunter. No statistic gains.`,
 part==='head'?'official-accessory':'official-skin',part==='head'?'head-only':'body-skin-only'));
export const OFFICIAL_COSTUMES_R9=Object.freeze([...lightning,...rathalos,
 make('Sonic','sonic_hedgehog','frontiers-holiday-cheer','Holiday Cheer Suit','Sonic Frontiers — DLC (2022)','sonic-holiday',
  'Capturer la tenue Holiday Cheer telle qu’affichée par Frontiers, ses attaches et ses volumes en course et en boule. La description commerciale ne fixe pas les détails : ne pas la remplacer par un Père Noël générique. Ne pas changer l’âge ni les proportions de Sonic.',
  'Capture the Holiday Cheer outfit as displayed in Frontiers, its fastenings and volumes while running and curled up. Marketing text does not establish details: do not substitute a generic Santa outfit. Do not change Sonic’s age or proportions.'),
 make('Sonic','sonic_hedgehog','frontiers-sa2-shoes','Sonic Adventure 2 Shoes','Sonic Frontiers — accessoire promotionnel (2022)','sonic-shoes',
  'Chaussures uniquement : relever semelles, attaches, profil et zones colorées du modèle Frontiers. Conserver tout le reste de Sonic et les volumes des pieds en course. Ne pas créer un nouveau corps Classic ou ajouter des capacités de grind par cette apparence.',
  'Footwear only: record soles, fastenings, profile and color regions of the Frontiers model. Retain the rest of Sonic and foot volumes while running. Do not create a Classic body or grant grind abilities through this appearance.','official-accessory','footwear-only'),
 ...aloy,...salvador]);
const research=(universe,id,key,sourceId,status,fr,en)=>Object.freeze({universe,id,key,sourceId,status,
 question:L(fr,en),sourceUrl:bySource.get(sourceId).url,officialConfirmed:false,equippable:false});
export const WARDROBE_RESEARCH_R9=Object.freeze([
 research('Final Fantasy XIII','lightning_ff13','lr-aerith-console','lightning-pc','EDITION_RESEARCH_REQUIRED',
  'Costume FFVII Aerith : identifier l’édition console et ses références, car la source PC l’exclut explicitement.',
  'FFVII Aerith costume: identify the console edition and references; the PC source explicitly excludes it.'),
 research('Final Fantasy XV','noctis_ff15','ff15-half-life-main','ff15-half-life','WEARER_AND_MODEL_REFERENCE_REQUIRED',
  'Confirmer le modèle porté par Noctis pour Half-Life Costume du jeu principal ; ne pas lui attribuer automatiquement le HEV ou les lunettes réservés à COMRADES.',
  'Confirm Noctis’s main-game Half-Life Costume model; do not automatically assign COMRADES-exclusive HEV or glasses.'),
 research('Horizon Zero Dawn','horizon_zero_dawn_aloy','hzd-nora-keeper','horizon-complete','PACK_NOT_CONFIRMED_AS_OUTFIT',
  'Nora Keeper Pack est nommé comme pack, pas comme tenue dans cette source : garder hors des récompenses de costume tant qu’aucune tenue exacte n’est documentée.',
  'Nora Keeper Pack is a pack, not a named outfit in this source: keep out of costume rewards until an exact outfit is documented.')
]);
