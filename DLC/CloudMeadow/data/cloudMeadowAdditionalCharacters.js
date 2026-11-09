// The three additional reference sheets supplied on 2026-10-29.
// Each crop uses original source pixels: [x, y, width, height]. Some silhouettes
// overlap in the source; these are comparison regions, not isolated originals.
// No cross-sheet height ratio or canonical approval is inferred.
// The companion names are corroborated by a Steam forum answer selected by moderation:
// https://steamcommunity.com/app/1223750/discussions/0/4361250264578954844/
// Older unnamed designs retain visual labels rather than speculative NPC names.
export const ADDITIONAL_CLOUD_MEADOW_REFERENCES = [
  {
    id: 'companions_20261029',
    src: '/reviews/cloud-meadow/sources/companions-2026-10-29.png',
    suppliedFilename: 'image(20261029-062548).png', suppliedOn: '2026-10-29',
    label: { fr: 'Dix compagnons', en: 'Ten companions' }
  },
  {
    id: 'npcs_20261029',
    src: '/reviews/cloud-meadow/sources/npcs-2026-10-29.png',
    suppliedFilename: 'image(20261029-062552).png', suppliedOn: '2026-10-29',
    label: { fr: 'Quinze silhouettes et créatures', en: 'Fifteen character and creature designs' }
  },
  {
    id: 'monsters_20261029',
    src: '/reviews/cloud-meadow/sources/monsters-2026-10-29.png',
    suppliedFilename: 'image(20261029-062557).png', suppliedOn: '2026-10-29',
    label: { fr: 'Huit modèles de monstres', en: 'Eight monster designs' }
  }
];

const adaptedCoverage = {
  fidelityStatus: 'adapted-coverage',
  fidelityNote: {
    fr: 'Adaptation : une tenue opaque a été ajoutée ou sa couverture renforcée. La silhouette et les couleurs proviennent de la référence ; la tenue adaptée ne constitue pas une reproduction 1:1.',
    en: 'Adaptation: opaque clothing was added or its coverage increased. The silhouette and colours come from the reference; the adapted outfit is not a 1:1 reproduction.'
  }
};

const descriptionBasedAdaptation = {
  fidelityStatus: 'description-based-adaptation',
  provenance: 'generated-from-reference-description',
  fidelityNote: {
    fr: 'Nouvelle illustration adaptée d’après une description visuelle neutre. La planche source a été refusée comme entrée par le générateur et ne lui a pas été transmise pour cette variante. Une fidélité 1:1 n’est pas certifiée.',
    en: 'New adapted illustration made from a neutral visual description. The source sheet was rejected as generator input and was not sent to the generator for this variant. 1:1 fidelity is not certified.'
  }
};

export const ADDITIONAL_CLOUD_MEADOW_ARTWORK = [
  {
    id: 'cloud_meadow_jaero', name: 'Jaero', file: 'jaero-reference.png', kind: 'mandrake',
    referenceId: 'companions_20261029', referenceCrop: [48, 179, 166, 453], referenceRegion: 'top-row-1',
    traits: ['sunflower-petals', 'green-plant-body', 'yellow-waistcoat', 'red-rose', 'dark-boots'],
    description: { fr: 'Visage mauve entouré de pétales jaunes, veste verte et jaune, rose rouge et bottes sombres.', en: 'Purple face framed by yellow petals, green and yellow jacket, red rose and dark boots.' }
  },
  {
    id: 'cloud_meadow_kiram', name: 'Kiram', file: 'kiram-reference.png', kind: 'human',
    referenceId: 'companions_20261029', referenceCrop: [225, 148, 248, 483], referenceRegion: 'top-row-2',
    traits: ['black-hair', 'beard', 'teal-waistcoat', 'crossed-brown-belts', 'brown-bracers'],
    description: { fr: 'Homme barbu aux cheveux noirs, gilet turquoise, chemise claire et larges protections de cuir.', en: 'Bearded man with black hair, teal waistcoat, pale shirt and broad leather guards.' }
  },
  {
    id: 'cloud_meadow_yonten', name: 'Yonten', file: 'yonten-reference.png', kind: 'yeti',
    referenceId: 'companions_20261029', referenceCrop: [472, 101, 245, 545], referenceRegion: 'top-row-3',
    traits: ['pale-hair', 'large-hands', 'indigo-tunic', 'red-sash', 'fur-cuffs'],
    description: { fr: 'Grand yéti clair, tunique indigo ornée, ceinture rouge, poignets de fourrure et mains imposantes.', en: 'Tall pale yeti with an ornate indigo tunic, red sash, fur cuffs and large hands.' }
  },
  {
    id: 'cloud_meadow_brontide', name: 'Brontide', file: 'brontide-reference.png', kind: 'drake',
    referenceId: 'companions_20261029', referenceCrop: [672, 119, 436, 523], referenceRegion: 'top-row-4',
    traits: ['dark-drake-scales', 'cream-chest', 'blue-striped-trousers', 'brown-belts', 'long-tail'],
    description: { fr: 'Drake sombre au torse clair, pantalon rayé bleu, ceintures brunes, bottes hautes et longue queue.', en: 'Dark drake with a pale chest, blue striped trousers, brown belts, tall boots and a long tail.' }
  },
  {
    id: 'cloud_meadow_garst', name: 'Garst', file: 'garst-reference.png', kind: 'spirit',
    referenceId: 'companions_20261029', referenceCrop: [1029, 181, 196, 453], referenceRegion: 'top-row-5',
    traits: ['blue-face', 'pale-hair', 'brown-hood', 'layered-armor', 'long-coat'],
    description: { fr: 'Visage bleu sous une capuche brune, mèche claire, armure segmentée et long manteau sombre.', en: 'Blue face beneath a brown hood, pale hair, segmented armour and a long dark coat.' }
  },
  {
    id: 'cloud_meadow_camellia', name: 'Camellia', file: 'camellia-reference.png', kind: 'companion',
    referenceId: 'companions_20261029', referenceCrop: [101, 868, 140, 410], referenceRegion: 'bottom-row-1',
    traits: ['red-gown', 'black-eye-mask', 'red-hair-flower', 'dark-trim', 'lace-up-shoes'],
    description: { fr: 'Robe rouge longue à bordures sombres, masque noir, fleur rouge dans les cheveux et chaussures lacées.', en: 'Long red gown with dark trim, black eye mask, red hair flower and lace-up shoes.' }
  },
  {
    id: 'cloud_meadow_goldra', name: 'Goldra', file: 'goldra-reference.png', kind: 'drake',
    referenceId: 'companions_20261029', referenceCrop: [208, 759, 298, 510], referenceRegion: 'bottom-row-2',
    traits: ['pale-long-hair', 'gold-eyes', 'dark-long-coat', 'brown-gauntlets', 'curved-tail'],
    description: { fr: 'Drake aux cheveux clairs, yeux dorés, manteau sombre à longues pans, gantelets bruns et queue recourbée.', en: 'Drake with pale hair, golden eyes, a long dark coat, brown gauntlets and a curved tail.' }
  },
  {
    id: 'cloud_meadow_kreyton', name: 'Kreyton', file: 'kreyton-adapted.png', kind: 'ogre',
    referenceId: 'companions_20261029', referenceCrop: [520, 650, 288, 625], referenceRegion: 'bottom-row-3',
    ...adaptedCoverage,
    traits: ['green-skin', 'red-bob', 'stone-shoulder-spikes', 'brown-bracers', 'brown-greaves', 'opaque-outfit'],
    description: { fr: 'Grande ogresse verte aux cheveux roux, pointes de pierre sur les épaules, bracelets et jambières bruns. Couverture du vêtement renforcée.', en: 'Tall green ogre with red hair, stone shoulder spikes, brown bracers and greaves. Clothing coverage increased.' }
  },
  {
    id: 'cloud_meadow_fio', name: 'Fio', file: 'fio-reference.png', kind: 'rabbit',
    referenceId: 'companions_20261029', referenceCrop: [822, 790, 185, 485], referenceRegion: 'bottom-row-4',
    traits: ['long-pink-ears', 'teal-and-pink-hair', 'black-vest', 'blue-shorts', 'mechanical-gauntlet'],
    description: { fr: 'Longues oreilles roses, mèche turquoise, gilet noir, short bleu et grand gantelet mécanique.', en: 'Long pink ears, teal fringe, black vest, blue shorts and a large mechanical gauntlet.' }
  },
  {
    id: 'cloud_meadow_kaleida', name: 'Kaleida', file: 'kaleida-adapted.png', kind: 'brownie',
    referenceId: 'companions_20261029', referenceCrop: [1022, 1050, 194, 231], referenceRegion: 'bottom-row-5',
    ...adaptedCoverage,
    traits: ['small-blue-brownie', 'large-ears', 'long-dark-hair', 'glowing-orb', 'red-and-gold-opaque-clothing'],
    description: { fr: 'Petite brownie bleue aux grandes oreilles et cheveux sombres, tenant un orbe lumineux. Tenue rouge et or rendue entièrement opaque.', en: 'Small blue brownie with large ears and dark hair, holding a glowing orb. Red and gold clothing made fully opaque.' }
  },
  {
    id: 'cloud_meadow_dark_armored_knight', name: 'Chevalier en armure sombre', englishName: 'Dark-armoured Knight', file: 'dark-armored-knight-reference.png', kind: 'armored-warrior',
    referenceId: 'npcs_20261029', referenceCrop: [15, 10, 235, 355], referenceRegion: 'top-row-1',
    traits: ['dark-full-plate', 'horned-helmet', 'oversized-greatsword', 'pale-tabard'],
    description: { fr: 'Armure intégrale bleu noir, casque pointu, tabard clair et épée démesurée levée au-dessus de l’épaule. Nom individuel non confirmé.', en: 'Blue-black full plate, pointed helmet, pale tabard and an enormous sword raised over the shoulder. Individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_bronze_armored_warrior', name: 'Guerrier en armure de bronze', englishName: 'Bronze-armoured Warrior', file: 'bronze-armored-warrior-reference.png', kind: 'armored-warrior',
    referenceId: 'npcs_20261029', referenceCrop: [170, 45, 220, 325], referenceRegion: 'top-row-2',
    traits: ['bronze-armor', 'long-plated-skirt', 'pole-weapon', 'large-spiked-mace'],
    description: { fr: 'Armure de bronze et longue jupe de plaques, avec une arme à long manche et une grosse tête de masse à pointes. Nom individuel non confirmé.', en: 'Bronze armour and a long plated skirt, with a pole weapon and a large spiked mace head. Individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_harpy_egg_keeper', name: 'Gardienne ailée à l’œuf', englishName: 'Winged Egg Keeper', file: 'harpy-egg-keeper-reference.png', kind: 'winged-character',
    referenceId: 'npcs_20261029', referenceCrop: [385, 120, 120, 245], referenceRegion: 'top-row-3',
    traits: ['teal-hair', 'green-feathered-gown', 'speckled-egg', 'yellow-legs'],
    description: { fr: 'Chevelure turquoise, plumage vert en longue robe, pattes jaunes et œuf tacheté tenu à la main. Nom individuel non confirmé.', en: 'Teal hair, green feathers forming a long gown, yellow legs and a speckled egg held in one hand. Individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_masked_egg_keeper', name: 'Gardien masqué à l’œuf', englishName: 'Masked Egg Keeper', file: 'masked-egg-keeper-reference.png', kind: 'masked-character',
    referenceId: 'npcs_20261029', referenceCrop: [505, 78, 125, 290], referenceRegion: 'top-row-4',
    traits: ['oval-pale-mask', 'long-black-neck', 'black-and-gold-coat', 'speckled-egg'],
    description: { fr: 'Silhouette élancée au visage ovale clair, long cou noir, habit noir et or et œuf tacheté. Nom individuel non confirmé.', en: 'Slender figure with a pale oval face, long black neck, black and gold clothing and a speckled egg. Individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_teacup_spirit', name: 'Esprit dans une coupe', englishName: 'Cup Spirit', file: 'teacup-spirit-adapted.png', kind: 'spirit',
    referenceId: 'npcs_20261029', referenceCrop: [628, 28, 310, 318], referenceRegion: 'top-row-5',
    ...adaptedCoverage,
    traits: ['blue-skin', 'short-pale-hair', 'heart-motif-cup', 'pink-magical-ribbons', 'opaque-beige-wraps'],
    description: { fr: 'Esprit bleu dans une grande coupe ivoire ornée de cœurs roses, entouré de rubans magiques. Bandages et tissu beige rendus pleinement opaques.', en: 'Blue spirit in a large ivory cup decorated with pink hearts, surrounded by magical ribbons. Beige wraps made fully opaque.' }
  },
  {
    id: 'cloud_meadow_chain_anchor_warrior', name: 'Guerrier à la chaîne et à l’ancre', englishName: 'Chain-and-anchor Warrior', file: 'chain-anchor-warrior-reference.png', kind: 'skeletal-warrior',
    referenceId: 'npcs_20261029', referenceCrop: [928, 72, 325, 305], referenceRegion: 'top-row-6',
    traits: ['skeletal-face', 'gold-spiked-armor', 'dark-red-coat', 'pale-trousers', 'chain-and-anchor'],
    description: { fr: 'Visage squelettique, épaulières dorées à pointes, manteau rouge sombre et grande ancre reliée par une chaîne. Nom individuel non confirmé.', en: 'Skeletal face, spiked gold pauldrons, dark red coat and a large anchor attached by a chain. Individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_golden_slime', name: 'Slime dorée', englishName: 'Golden Slime', file: 'golden-slime-adapted.png', kind: 'slime',
    referenceId: 'npcs_20261029', referenceCrop: [24, 442, 112, 255], referenceRegion: 'bottom-row-1',
    ...adaptedCoverage,
    traits: ['golden-gel-body', 'swept-hair', 'turquoise-eyes', 'opaque-golden-outfit'],
    description: { fr: 'Silhouette humanoïde de gel doré, cheveux relevés et yeux turquoise. Tenue opaque ajoutée pour cette adaptation.', en: 'Humanoid golden gel silhouette with swept hair and teal eyes. Opaque clothing added for this adaptation.' }
  },
  {
    id: 'cloud_meadow_pink_haired_gunner', name: 'Canonnière aux cheveux roses', englishName: 'Pink-haired Gunner', file: 'pink-haired-gunner-adapted.png', kind: 'gunner',
    referenceId: 'npcs_20261029', referenceCrop: [120, 544, 130, 155], referenceRegion: 'bottom-row-2',
    ...adaptedCoverage,
    traits: ['short-stature', 'long-pink-hair', 'dark-eye-cover', 'oversized-black-cannon', 'opaque-outfit'],
    description: { fr: 'Canonnière de petite taille, longue chevelure rose, masque sombre et canon noir disproportionné. Tenue opaque ajoutée ; nom individuel non confirmé.', en: 'Short gunner with long pink hair, dark eye covering and an oversized black cannon. Opaque outfit added; individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_halo_mage', name: 'Mage à l’auréole', englishName: 'Halo Mage', file: 'halo-mage-adapted.png', kind: 'mage',
    referenceId: 'npcs_20261029', referenceCrop: [176, 441, 183, 257], referenceRegion: 'bottom-row-3',
    ...adaptedCoverage,
    traits: ['white-voluminous-hair', 'pale-blue-skin', 'golden-halo', 'golden-orbs', 'black-boots'],
    description: { fr: 'Cheveux blancs volumineux, peau bleu pâle, auréole et sphères dorées, hautes bottes noires. Haut opaque ajouté ; nom individuel non confirmé.', en: 'Voluminous white hair, pale blue skin, golden halo and orbs, tall black boots. Opaque top added; individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_golden_barmaid', name: 'Serveuse dorée', englishName: 'Golden Barmaid', file: 'golden-barmaid-reference.png', kind: 'barmaid',
    referenceId: 'npcs_20261029', referenceCrop: [338, 443, 114, 253], referenceRegion: 'bottom-row-4',
    traits: ['golden-skin-and-hair', 'white-blouse', 'dark-corset', 'black-trousers', 'serving-cloche'],
    description: { fr: 'Serveuse dorée en blouse blanche et corset sombre, pantalon noir et plateau à cloche. Nom individuel non confirmé.', en: 'Golden barmaid in a white blouse and dark corset, black trousers and a serving cloche. Individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_mantis_warrior', name: 'Guerrier mante', englishName: 'Mantis Warrior', file: 'mantis-warrior-reference.png', kind: 'mantis',
    referenceId: 'npcs_20261029', referenceCrop: [456, 371, 152, 333], referenceRegion: 'bottom-row-5',
    traits: ['long-antennae', 'green-carapace', 'pale-arm-plates', 'red-sash', 'long-red-cloth'],
    description: { fr: 'Mante humanoïde verte, longues antennes, plaques claires et étoffes rouges nouées à la taille. Ancien modèle ; nom individuel non confirmé.', en: 'Green humanoid mantis with long antennae, pale plates and red cloth tied at the waist. Older design; individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_crystal_mage', name: 'Mage au cristal', englishName: 'Crystal Mage', file: 'crystal-mage-reference.png', kind: 'mage',
    referenceId: 'npcs_20261029', referenceCrop: [641, 437, 107, 260], referenceRegion: 'bottom-row-6',
    traits: ['pale-short-hair', 'pointed-ears', 'purple-crystal', 'dark-long-coat', 'orange-and-red-trim'],
    description: { fr: 'Mage aux cheveux clairs et oreilles pointues, cristal violet en main, long manteau noir aux pans rouges et orange. Nom individuel non confirmé.', en: 'Pale-haired mage with pointed ears, a purple crystal in hand and a long black coat with red and orange panels. Individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_diving_suit', name: 'Explorateur en scaphandre', englishName: 'Diving-suit Explorer', file: 'diving-suit-reference.png', kind: 'armored-explorer',
    referenceId: 'npcs_20261029', referenceCrop: [750, 463, 104, 236], referenceRegion: 'bottom-row-7',
    traits: ['blue-dome-helmet', 'round-bronze-ports', 'brown-diving-suit', 'dark-boots'],
    description: { fr: 'Casque à dôme bleu et oculaires ronds de bronze, épaisse combinaison brune et bottes sombres. Nom individuel non confirmé.', en: 'Blue-domed helmet with round bronze ports, a thick brown suit and dark boots. Individual name unconfirmed.' }
  },
  {
    id: 'cloud_meadow_lamia_female', name: 'Lamia femelle', englishName: 'Female Lamia', file: 'lamia-female-adapted.png', kind: 'lamia',
    referenceId: 'npcs_20261029', referenceCrop: [864, 437, 195, 260], referenceRegion: 'bottom-row-8',
    ...adaptedCoverage,
    traits: ['blue-cobra-hood', 'cream-underside', 'gold-border', 'floating-crystals', 'coiled-tail', 'opaque-chest-cover'],
    description: { fr: 'Lamia bleue à capuchon de cobra, dessous crème bordé d’or et cristaux flottants. Couverture opaque ajoutée au buste ; modèle distinct du mâle.', en: 'Blue lamia with a cobra hood, gold-edged cream underside and floating crystals. Opaque chest coverage added; distinct from the male design.' }
  },
  {
    id: 'cloud_meadow_coral_mermaid', name: 'Sirène au corail rose', englishName: 'Pink-coral Mermaid', file: 'coral-serpent-adapted.png', kind: 'mermaid',
    referenceId: 'npcs_20261029', referenceCrop: [1061, 462, 180, 233], referenceRegion: 'bottom-row-9',
    ...adaptedCoverage,
    traits: ['pink-coral-hair', 'pale-blue-face', 'dark-coiled-tail', 'pink-fins', 'raised-hand', 'opaque-bodice'],
    description: { fr: 'Sirène au visage bleu clair, chevelure de corail rose, queue sombre enroulée et main levée. Corsage opaque ajouté.', en: 'Mermaid with a pale blue face, pink coral-like hair, dark coiled tail and raised hand. Opaque bodice added.' }
  },
  {
    id: 'cloud_meadow_cat_female', name: 'Chatte humanoïde', englishName: 'Female Cat', file: 'cat-female-adapted.png', kind: 'cat',
    referenceId: 'monsters_20261029', referenceCrop: [19, 128, 133, 222], referenceRegion: 'single-row-1',
    ...descriptionBasedAdaptation,
    traits: ['orange-fur', 'white-front', 'pointed-ears', 'long-curled-tail', 'opaque-outfit'],
    description: { fr: 'Féline orange et blanche aux oreilles pointues, main levée et longue queue recourbée. Tenue opaque ajoutée.', en: 'Orange and white feline with pointed ears, raised hand and long curled tail. Opaque clothing added.' }
  },
  {
    id: 'cloud_meadow_crab', name: 'Crabe humanoïde', englishName: 'Humanoid Crab', file: 'crab-adapted.png', kind: 'crab',
    referenceId: 'monsters_20261029', referenceCrop: [102, 109, 185, 242], referenceRegion: 'single-row-2',
    ...descriptionBasedAdaptation,
    traits: ['red-carapace', 'oversized-left-claw', 'pale-blue-hair', 'pointed-legs', 'dark-chest-plate'],
    description: { fr: 'Carapace rouge, grande pince relevée, chevelure bleu pâle et jambes articulées en pointe.', en: 'Red carapace, large raised claw, pale blue hair and pointed articulated legs.' }
  },
  {
    id: 'cloud_meadow_cyclops_female', name: 'Cyclope femelle', englishName: 'Female Cyclops', file: 'cyclops-female-adapted.png', kind: 'cyclops',
    referenceId: 'monsters_20261029', referenceCrop: [251, 27, 249, 327], referenceRegion: 'single-row-3',
    ...descriptionBasedAdaptation,
    traits: ['massive-stone-body', 'red-hair', 'dark-rock-plates', 'large-fists', 'yellow-abdominal-eye', 'opaque-armor'],
    description: { fr: 'Cyclope massive aux cheveux roux, plaques rocheuses sombres, énormes poings et œil jaune abdominal. Armure opaque ajoutée.', en: 'Massive red-haired cyclops with dark stone plates, enormous fists and a yellow abdominal eye. Opaque armour added.' }
  },
  {
    id: 'cloud_meadow_centaur_female', name: 'Centaure femelle', englishName: 'Female Centaur', file: 'centaur-female-adapted.png', kind: 'centaur',
    referenceId: 'monsters_20261029', referenceCrop: [475, 62, 213, 290], referenceRegion: 'single-row-4',
    ...descriptionBasedAdaptation,
    traits: ['blonde-high-ponytail', 'tan-and-white-horse-body', 'four-hooves', 'dark-wristbands', 'opaque-tunic'],
    description: { fr: 'Centaure blonde à queue-de-cheval haute, corps de cheval fauve et blanc, quatre sabots et bracelets sombres. Tunique opaque ajoutée.', en: 'Blonde centaur with a high ponytail, tan and white horse body, four hooves and dark wristbands. Opaque tunic added.' }
  },
  {
    id: 'cloud_meadow_lamia_male', name: 'Lamia mâle', englishName: 'Male Lamia', file: 'lamia-male-adapted.png', kind: 'lamia',
    referenceId: 'monsters_20261029', referenceCrop: [649, 73, 209, 280], referenceRegion: 'single-row-5',
    ...descriptionBasedAdaptation,
    traits: ['blue-cobra-hood', 'cream-segmented-underside', 'gold-border', 'coiled-tail', 'arms-at-sides'],
    description: { fr: 'Lamia bleue au long cou et capuchon de cobra, dessous crème segmenté et queue enroulée. Bras abaissés, sans cristaux.', en: 'Blue lamia with a long neck and cobra hood, segmented cream underside and coiled tail. Arms lowered, without crystals.' }
  },
  {
    id: 'cloud_meadow_wolf_female', name: 'Louve humanoïde', englishName: 'Female Wolf', file: 'wolf-female-adapted.png', kind: 'wolf',
    referenceId: 'monsters_20261029', referenceCrop: [854, 87, 159, 266], referenceRegion: 'single-row-6',
    ...descriptionBasedAdaptation,
    traits: ['charcoal-fur', 'grey-hair', 'large-bushy-tail', 'digitigrade-legs', 'hand-on-hip', 'opaque-outfit'],
    description: { fr: 'Louve grise et anthracite, oreilles dressées, grande queue touffue et main sur la hanche. Tenue opaque ajoutée.', en: 'Grey and charcoal wolf with upright ears, a large bushy tail and one hand on her hip. Opaque clothing added.' }
  },
  {
    id: 'cloud_meadow_holstaur_male', name: 'Holstaur mâle', englishName: 'Male Holstaur', file: 'holstaur-male-adapted.png', kind: 'holstaur',
    referenceId: 'monsters_20261029', referenceCrop: [1016, 89, 125, 263], referenceRegion: 'single-row-7',
    ...descriptionBasedAdaptation,
    traits: ['white-hair', 'cow-ears-and-horns', 'black-and-white-limbs', 'neck-bell', 'opaque-brown-tunic', 'brown-knee-length-trousers'],
    description: { fr: 'Holstaur aux cheveux blancs, cornes et oreilles bovines, membres tachetés et cloche au cou. Tunique brune et pantalon opaque ajoutés pour couvrir le torse et le bassin.', en: 'White-haired holstaur with bovine horns and ears, spotted limbs and a neck bell. A brown tunic and opaque trousers were added to cover the torso and pelvis.' }
  },
  {
    id: 'cloud_meadow_harpy_male', name: 'Harpie mâle', englishName: 'Male Harpy', file: 'harpy-male-adapted.png', kind: 'harpy',
    referenceId: 'monsters_20261029', referenceCrop: [1146, 153, 112, 199], referenceRegion: 'single-row-8',
    ...descriptionBasedAdaptation,
    traits: ['green-feathers', 'red-and-green-hair', 'spread-wings', 'golden-bird-legs', 'feathered-waist'],
    description: { fr: 'Harpie au plumage vert, ailes ouvertes, cheveux rouges et verts, taille emplumée et longues pattes dorées.', en: 'Green-feathered harpy with spread wings, red and green hair, a feathered waist and long golden bird legs.' }
  }
];
