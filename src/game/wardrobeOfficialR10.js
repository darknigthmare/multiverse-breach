// R10: named publisher evidence only. A design brief is NOT an observed or approved sprite.
const L = (fr, en) => Object.freeze({ fr, en });
export const WARDROBE_SOURCES_R10 = Object.freeze([
  Object.freeze({ id: 'me2-2010', publisher: 'Electronic Arts / BioWare', url: 'https://store.steampowered.com/app/24980/', checkedOn: '2026-10-25', scope: 'Publisher DLC list: named armor/accessories and exact squad members. No visual turnaround reviewed.' }),
  Object.freeze({ id: 'me3-2012', publisher: 'Electronic Arts / BioWare', url: 'https://store.steampowered.com/app/1238020/', checkedOn: '2026-10-25', scope: 'Publisher DLC list: N7 Defender Armor and named recipients of Alternate Appearance Pack. Not Legendary Edition artwork.' }),
  Object.freeze({ id: 're4-romantic', publisher: 'CAPCOM', url: 'https://store.steampowered.com/dlc/2050650/', checkedOn: '2026-10-25', scope: 'Publisher description explicitly names Romantic costumes for Leon and Ashley. Only Leon is bound here.' })
]);
const sources = new Map(WARDROBE_SOURCES_R10.map(s => [s.id, s]));
function make(universe, actorId, key, en, sourceWork, sourceId, component, frBrief, enBrief, evidence = 'PUBLISHER_NAMED_VARIANT') {
  const source = sources.get(sourceId);
  if (!source) throw new Error(`Unknown R10 source: ${sourceId}`);
  return Object.freeze({ universe, actorIds: Object.freeze([actorId]), key, name: L(en, en),
    sourceWork, targetIncarnation: sourceWork, sourceId, sourceUrl: source.url,
    sourceEvidence: evidence, checkedOn: source.checkedOn, component,
    nature: component === 'head-only' ? 'official-accessory' : 'official-costume',
    brief: L(frBrief, enBrief), note: 'Existence documentée ; modèle, vues multi-angles, animations et compatibilité d’incarnation à vérifier. Aucun bonus ni arme du pack transféré.',
    artworkStatus: 'NOT_PRODUCED', artApproval: 'NOT_REVIEWED', equippable: false });
}
const bodyBrief = (name, edition, extraFr, extraEn) => L(
  `${name} sur Shepard dans ${edition} : relever séparément casque, plastron, dos, articulations, jambes et attaches. Conserver le visage, le sexe et la morphologie choisis pour Shepard ; aucune conversion automatique en autre espèce. ${extraFr} La fiche éditeur confirme le nom, pas les couleurs exactes : collecter les captures avant fabrication.`,
  `${name} on Shepard in ${edition}: record helmet, chest, back, joints, legs and attachments separately. Preserve Shepard's selected face, sex and anatomy; never automatically convert the wearer into another species. ${extraEn} The publisher confirms the name, not exact colors: collect screenshots before production.`);
const armor = [
  ['cerberus-assault', 'Cerberus Assault Armor', 'Cerberus Weapon and Armor pack', 'Le fusil M-22 Eviscerator est exclu.', 'The M-22 Eviscerator shotgun is excluded.'],
  ['kestrel', 'Kestrel Armor', 'Aegis Pack', 'Documenter les pièces du set séparément ; le M-29 Incisor est exclu.', 'Document the set pieces separately; the M-29 Incisor is excluded.'],
  ['inferno', 'Inferno Armor', 'Equalizer Pack', 'Ne pas superposer automatiquement Archon Visor ou Capacitor Helmet au set.', 'Do not automatically stack the Archon Visor or Capacitor Helmet onto this set.'],
  ['collector', 'Collector Armor', 'Collectors’ Weapon and Armor pack', 'Il s’agit de l’armure de Shepard, pas d’un modèle de Collecteur ; fusil Collector exclu.', 'This is Shepard’s armor, not a Collector actor model; the Collector Assault Rifle is excluded.'],
  ['terminus-assault', 'Terminus Assault Armor', 'Terminus Weapon and Armor pack', 'Ne pas importer le M-490 Blackstorm ni ses effets.', 'Do not import the M-490 Blackstorm or its effects.'],
  ['blood-dragon', 'Blood Dragon Armor', 'Blood Dragon Armor', 'Relever les marquages du modèle Mass Effect 2, pas ceux d’une armure Dragon Age approximative.', 'Record the Mass Effect 2 model markings, not an approximate Dragon Age armor.']
].map(([key, name, pack, fr, en]) => {
  const brief = bodyBrief(name, 'Mass Effect 2 (2010)', fr, en);
  return make('Mass Effect', 'shepard', `me2-${key}`, name, `Mass Effect 2 (2010) — ${pack}`, 'me2-2010', 'outfit-only', brief.fr, brief.en);
});
const accessories = [
  ['capacitor-helmet', 'Capacitor Helmet', 'Equalizer Pack'],
  ['archon-visor', 'Archon Visor', 'Equalizer Pack'],
  ['umbra-visor', 'Umbra Visor', 'promo bundle'],
  ['sentry-interface', 'Sentry Interface', 'promo bundle'],
  ['recon-hood', 'Recon Hood', 'promo bundle']
].map(([key, name, pack]) => make('Mass Effect', 'shepard', `me2-${key}`, name,
  `Mass Effect 2 (2010) — ${pack}`, 'me2-2010', 'head-only',
  `${name} est une pièce de tête seule. Relever son volume, les attaches et les zones du visage occultées sur le Shepard ciblé ; conserver le corps et l’armure de base. Vérifier sa compatibilité avec le casque existant, sans empilement supposé ni bonus de bouclier, précision ou pouvoir.`,
  `${name} is a head piece only. Record volume, fastenings and face occlusion on the target Shepard; retain the base body and armor. Check compatibility with existing headgear rather than assuming they stack; no shield, accuracy or power bonus.`));
function squad(actorId, name, edition, pack, sourceId, anatomyFr, anatomyEn) {
  return make('Mass Effect', actorId, `${edition}-${actorId}-appearance`, `${name} — ${pack}`,
    `${edition === 'me2' ? 'Mass Effect 2 (2010)' : 'Mass Effect 3 (2012)'} — ${pack}`, sourceId, 'outfit-only',
    `La source nomme ${name} parmi les porteurs de ce pack, sans donner un nom individuel à la tenue. ${anatomyFr} Capturer le modèle de cette édition et ne pas réutiliser la tenue d’un autre épisode. Ni armes, compétences ni bonus de pack.`,
    `The source names ${name} as a recipient of this pack without assigning an individual outfit name. ${anatomyEn} Capture this edition's model; do not reuse another episode's outfit. No pack weapons, abilities or bonuses.`,
    'PUBLISHER_PACK_AND_WEARER_ONLY');
}
const n7 = bodyBrief('N7 Defender Armor', 'Mass Effect 3 (2012)', 'Exclure les fusils N7 Valkyrie et M-55 Argus.', 'Exclude the N7 Valkyrie and M-55 Argus rifles.');
export const OFFICIAL_COSTUMES_R10 = Object.freeze([
  ...armor, ...accessories,
  squad('garrus', 'Garrus', 'me2', 'Alternate Appearance Pack 1', 'me2-2010', 'Préserver tête turienne, mandibules, proportions et articulations ; vérifier séparément les réparations et l’asymétrie.', 'Preserve the turian head, mandibles, proportions and joints; check repairs and asymmetry separately.'),
  squad('tali', 'Tali', 'me2', 'Alternate Appearance Pack 2', 'me2-2010', 'Préserver masque, combinaison environnementale et anatomie quarienne ; relever tissus et connecteurs sans inventer un visage découvert.', 'Preserve the mask, environmental suit and quarian anatomy; record fabric and connectors without inventing an exposed face.'),
  make('Mass Effect', 'shepard', 'me3-n7-defender', 'N7 Defender Armor', 'Mass Effect 3 (2012) — N7 Warfare Gear', 'me3-2012', 'outfit-only', n7.fr, n7.en),
  squad('shepard', 'Shepard', 'me3', 'Alternate Appearance Pack', 'me3-2012', 'Conserver le Shepard choisi ; ne pas déduire un nom d’armure, un casque ou une palette non précisés par la fiche.', 'Preserve the selected Shepard; do not infer an armor name, helmet or palette not specified in the listing.'),
  squad('garrus', 'Garrus', 'me3', 'Alternate Appearance Pack', 'me3-2012', 'Conserver la morphologie turienne et comparer le set ME3 à celui de ME2 sans les fusionner.', 'Keep the turian anatomy and compare the ME3 set with ME2 without merging them.'),
  squad('liara', 'Liara', 'me3', 'Alternate Appearance Pack', 'me3-2012', 'Préserver la tête asari, les proportions et les mains ; relever la coupe de ce set sans ajouter une coiffure humaine.', 'Preserve the asari head, proportions and hands; record this set’s tailoring without adding human hair.'),
  make('Resident Evil', 'leon', 're4-romantic', 'Romantic', 'Resident Evil 4 (2023) — Leon & Ashley Costumes: Romantic', 're4-romantic', 'outfit-only',
    'Tenue Romantic de Leon uniquement, version remake 2023. Relever col, manches, couches textiles, ceinture et bottes dans le jeu. Garder le visage et la silhouette de Leon, pas le vêtement d’Ashley ; ne pas remplacer par un costume romantique inventé. Aucun filtre ou pouvoir ajouté.',
    'Leon’s Romantic outfit only, 2023 remake. Record collar, sleeves, fabric layers, belt and boots in-game. Keep Leon’s face and silhouette, not Ashley’s clothing; do not substitute an invented romantic outfit. No added screen filter or ability.')
]);
export const UNBOUND_COSTUME_RESEARCH_R10 = Object.freeze([
  ['Thane', 'Mass Effect 2 (2010) — Alternate Appearance Pack 1', 'me2-2010'],
  ['Jack', 'Mass Effect 2 (2010) — Alternate Appearance Pack 1', 'me2-2010'],
  ['Grunt', 'Mass Effect 2 (2010) — Alternate Appearance Pack 2', 'me2-2010'],
  ['Miranda', 'Mass Effect 2 (2010) — Alternate Appearance Pack 2', 'me2-2010'],
  ['EDI', 'Mass Effect 3 (2012) — Alternate Appearance Pack', 'me3-2012'],
  ['Ashley Graham', 'Resident Evil 4 (2023) — Romantic', 're4-romantic']
].map(([actorName, sourceWork, sourceId]) => Object.freeze({ actorName, universe: sourceId === 're4-romantic' ? 'Resident Evil' : 'Mass Effect', sourceWork, sourceId,
  sourceUrl: sources.get(sourceId).url, status: 'ACTOR_BINDING_MISSING', equippable: false,
  note: 'Porteur nommé par la source, mais absent du roster contrôlé. Ne pas le confondre avec Ashley Williams ni attribuer sa tenue à un autre acteur.' })));
