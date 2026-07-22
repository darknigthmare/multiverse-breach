const SLOT_DEFINITIONS = Object.freeze([
  Object.freeze({
    slot: "sigil",
    role: "offense",
    gameplayRole: Object.freeze({
      fr: "attaque ou interaction principale",
      en: "primary attack or interaction",
    }),
  }),
  Object.freeze({
    slot: "armor",
    role: "defense",
    gameplayRole: Object.freeze({
      fr: "defense, protection ou survie",
      en: "defense, protection or survival",
    }),
  }),
  Object.freeze({
    slot: "core",
    role: "tempo",
    gameplayRole: Object.freeze({
      fr: "mobilite, recharge, soin ou tempo",
      en: "mobility, recharge, healing or tempo",
    }),
  }),
  Object.freeze({
    slot: "event",
    role: "event",
    gameplayRole: Object.freeze({
      fr: "declenchement d un evenement propre a l univers",
      en: "trigger for a universe-specific event",
    }),
  }),
]);

const EXCLUDED_UNIVERSES = Object.freeze([
  "Tomba",
  "Woodruff",
  "Hellraiser",
  "A Nightmare on Elm Street",
  "The Ring",
  "The Grudge",
]);

const EMPTY_EQUIPMENT = Object.freeze([]);
const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export const slugifyLoreItemAsset = (value) => {
  const slug = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "unknown";
};

const item = (nameEn, nameFr, visualAnchor) => Object.freeze({
  nameEn,
  nameFr,
  visualAnchor,
});

const pack = (universe, stem, referenceUrl, items) => Object.freeze({
  universe,
  stem,
  referenceUrl,
  items: Object.freeze(items),
});

const ACTIVE_PACK_SPECS = Object.freeze([
  // FG4 - games
  pack("Altered Beast", "altered_beast", "https://segaretro.org/images/a/a7/AlteredBeast_Steam_manual.pdf", [
    item("Spirit Ball", "Orbe spirituel", "Small luminous blue-white energy sphere with a dense arcade glow and no container."),
    item("Centurion Bracer", "Brassard de centurion", "Single bronze Roman forearm bracer with worn leather straps and engraved ridges."),
    item("Beast Transformation Stone", "Pierre de transformation bestiale", "Rough ancient stone bearing one carved beast silhouette, warm amber energy in its cracks."),
    item("Zeus Lightning Urn", "Urne de foudre de Zeus", "Single dark Greek urn with bronze trim and contained forked lightning, no readable lettering."),
  ]),
  pack("Cool Spot", "cool_spot", "https://strategywiki.org/wiki/Cool_Spot/Walkthrough", [
    item("7UP Bottle", "Bouteille 7UP", "Single vintage green glass soda bottle, red circular cap motif, no copied label or lettering."),
    item("Cool Point Token", "Jeton Cool Point", "Small glossy red circular collectible token with a simple white highlight, no brand mark."),
    item("Health Beaker", "Fiole de sante", "Tiny clear laboratory beaker filled with bright restorative red liquid."),
    item("Cage Key", "Cle de cage", "Small brass cage key with a rounded bow and one chunky arcade-style tooth."),
  ]),
  pack("Dynamite Duke", "dynamite_duke", "https://gamefaqs.gamespot.com/sms/575448-dynamite-duke/faqs/73830", [
    item("Cybernetic Arm Plate", "Plaque de bras cybernetique", "Heavy steel cybernetic forearm armor plate with exposed bolts and a red status light."),
    item("Machine Gun", "Mitrailleuse", "Compact late-1980s arcade machine gun with dark receiver, short barrel and folded stock."),
    item("Flash Bomb", "Bombe aveuglante", "Single round military flash bomb with metal casing, safety lever and bright warning band without text."),
    item("Red Ammo Crate", "Caisse de munitions rouge", "Small red metal ammunition crate with reinforced corners, latch and no printed markings."),
  ]),
  pack("Earthworm Jim", "earthworm_jim", "https://r.mprd.se/Sega%20CD/Manuals/Earthworm%20Jim%20-%20Special%20Edition%20%28U%29.pdf", [
    item("Plasma Blaster", "Blaster plasma", "Cartoon sci-fi blaster with a bulbous silver barrel, blue accents and oversized trigger guard."),
    item("Super Suit Collar", "Col du Super Suit", "Single thick white powered-suit collar with blue-grey inner padding and red fastener."),
    item("Pocket Rocket", "Pocket Rocket", "Compact silver-red cartoon rocket with one saddle-like grip and a bright rear nozzle."),
    item("Life Atom", "Atome de vie", "Single glowing atomic pickup made of a bright core and three clean orbiting pixel rings."),
  ]),
  pack("Ecco the Dolphin", "ecco", "https://manuals.sega.com/genesismini/pdf/ECCO_THE_DOLPHIN.pdf", [
    item("Key Glyph", "Glyphe-cle", "Tall narrow Atlantean crystalline device with pointed faceted ends, pale lavender rim and deep blue-violet inner channel."),
    item("Barrier Glyph", "Glyphe-barriere", "Tall Atlantean crystal surrounded by the circular blue-violet force field that blocks Ecco until a Key Glyph empowers him."),
    item("Invincibility Glyph", "Glyphe d invincibilite", "Rare pale lavender Atlantean crystal emitting a compact halo of blue-violet sparks that grants temporary invincibility."),
    item("Clam", "Palourde", "Natural ridged Shelled One opened horizontally and releasing one healing air bubble when Ecco sings to it."),
  ]),
  pack("Flashback", "flashback", "https://www.world-of-nintendo.com/manuals/super_nes/flashback.shtml", [
    item("Holocube", "Holocube", "Small black angular memory cube projecting a cyan holographic face above one corner."),
    item("Shield Cartridge", "Cartouche de bouclier", "Compact dark sci-fi cartridge with cyan energy window and two metal contacts."),
    item("Mechanical Mouse", "Souris mecanique", "Palm-sized grey robotic mouse with jointed legs, red sensor eye and segmented tail."),
    item("Teleport Receiver", "Recepteur de teleportation", "Portable dark receiver unit with cyan screen, antenna and chunky 1990s sci-fi controls."),
  ]),
  pack("Final Fantasy VII", "final_fantasy_vii", "https://na.finalfantasy.com/titles/finalfantasy7", [
    item("Buster Sword", "Epee Buster", "Single original-1997 Buster Sword: immense weathered rectangular steel blade with clipped angled tip, two circular materia slots near the base, riveted dark guard, long burgundy-wrapped handle and small metal pommel."),
    item("Ribbon", "Ruban", "Single canonical status-protection accessory: narrow deep-crimson silk ribbon tied into a compact bow with two long forked tails, subtle protective sheen and no wearer or jewel."),
    item("Restore Materia", "Materia Restaurer", "Single translucent emerald-green Magic Materia sphere with a bright mako core, cloudy spiral facets and tiny internal star glints, no socket, stand or duplicate orb."),
    item("Bombing Mission Detonator", "Detonateur de la mission de sabotage", "Single compact AVALANCHE field detonator used to arm the Mako Reactor 1 charge: worn olive-black rectangular casing, guarded red arming switch, blank amber countdown window and short bundled red-black leads."),
  ]),
  pack("Jet Set Radio", "jet_set_radio", "https://shop.sega.com/collections/jet-set-radio", [
    item("Spray Can", "Bombe de peinture", "Single bright aerosol paint can with removable cap and bold color blocks but no logo or text."),
    item("Magnetic Inline Skates", "Rollers magnetiques", "One complete pair of chunky magnetic inline skates with neon wheels and industrial straps."),
    item("Graffiti Soul", "Graffiti Soul", "Small floating stylized soul token with angular street-art silhouette and saturated cyan-yellow palette."),
    item("Portable Radio", "Radio portable", "Compact portable boombox with twin speakers, cassette deck and vivid street palette without branding."),
  ]),
  pack("Left 4 Dead", "left_4_dead", "https://developer.valvesoftware.com/wiki/Category:Left_4_Dead_Weapons", [
    item("Auto Shotgun", "Fusil a pompe automatique", "Single Left 4 Dead Auto Shotgun: matte-grey semi-automatic receiver, long black barrel above a tubular magazine, black synthetic pistol grip, collapsible stock, ghost-ring sights and compact under-barrel flashlight."),
    item("First Aid Kit", "Trousse de premiers soins", "Single original-game red rectangular soft medical pouch with black zippers, top carry handle and a white square patch bearing one red medical cross, no shoulder straps or words."),
    item("Pain Pills", "Antidouleurs", "Single original-game white plastic pain-pill bottle with a red screw cap and blank red-white-blue pharmacy label blocks, sealed and shown without loose tablets or readable lettering."),
    item("Rescue Radio", "Radio de sauvetage", "Single weathered finale rescue radio: olive-drab rectangular field transceiver with black speaker grille, short antenna, cream control knobs, red transmit lamp and one connected handset resting in its cradle."),
  ]),
  pack("Lost Planet 2", "lost_planet_2", "https://www.videogamemanual.com/xbox360/Lost%20Planet-%20Extreme%20Condition%20Colonies%20Edition.pdf", [
    item("T-ENG Canister", "Reservoir T-ENG", "Cylindrical orange thermal-energy canister with armored caps and glowing amber fluid window."),
    item("Harmonizer Injector", "Injecteur Harmonizer", "Rugged sci-fi medical injector with amber vial, metal grip and insulated needle guard."),
    item("Anchor Gun", "Anchor Gun", "Compact industrial grappling launcher with cable drum, claw head and orange-white snowfield wear."),
    item("Vital Suit Activation Key", "Cle d activation VS", "Heavy electronic vehicle key with angular orange casing and one blue status light."),
  ]),
  pack("Ristar", "ristar", "https://segaretro.org/images/0/08/Ristar_Steam_manual.pdf", [
    item("Star Handle", "Poignee etoile", "Single yellow five-point star handle attached to a short blue grip, clean 16-bit silhouette."),
    item("Little Star", "Petite etoile", "Small bright yellow five-point collectible star with a soft white center glow."),
    item("Restore Star", "Etoile de soin", "Larger luminous green-yellow five-point star with a restorative halo."),
    item("Yellow Jewel", "Joyau jaune", "Single faceted golden-yellow gem with chunky 16-bit cuts and bright central shine."),
  ]),
  pack("Seaman", "seaman", "https://www.digitpress.com/library/manuals/dreamcast/seaman.pdf", [
    item("Dreamcast Microphone", "Microphone Dreamcast", "Single grey console microphone module with short stem, round grille and controller connector."),
    item("Seaman Egg", "Oeuf de Seaman", "One mottled aquatic egg with leathery shell, translucent veins and damp organic sheen."),
    item("Seaman Shell", "Coquille de Seaman", "Single rough spiral aquarium shell with muted sand-grey ridges and chipped opening."),
    item("Food Pellet", "Granule de nourriture", "One compact brown aquarium food pellet with a slightly porous cylindrical surface."),
  ]),
  pack("Secret of Monkey Island", "monkey_island", "https://monkeyisland.fandom.com/wiki/Rubber_Chicken_With_A_Pulley_In_The_Middle", [
    item("Rubber Chicken with Pulley", "Poulet en caoutchouc avec poulie", "Single yellow rubber chicken with a small metal pulley mounted through its middle."),
    item("Grog Mug", "Chope de grog", "One dented pirate tankard holding vivid green corrosive grog with faint vapor."),
    item("Voodoo Doll", "Poupee vaudou", "Small stitched cloth pirate doll with one pin and colored thread, no human hand."),
    item("Treasure Map", "Carte au tresor", "Single rolled parchment treasure map partly open, red route marks but no readable words."),
  ]),
  pack("Splatterhouse", "splatterhouse", "https://dds.konami.com/games/manual/pcemini/en_Splatter.pdf", [
    item("Terror Mask", "Terror Mask", "Single cracked white hockey-like mask with narrow eye slots, red markings and aged straps."),
    item("Shotgun", "Fusil a pompe", "One worn pump-action shotgun with wooden stock and dark steel barrel."),
    item("Two-by-Four Plank", "Madrier 2x4", "Single splintered wooden construction plank stained by damp basement grime."),
    item("Meat Cleaver", "Couperet", "One heavy rectangular butcher cleaver with chipped steel blade and dark wooden handle."),
  ]),
  pack("Streets of Rage", "streets_of_rage", "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/71165/manuals/04%20SOR2_PC_MG_EFIGS_US_v6.pdf?t=1733765070", [
    item("Apple", "Pomme", "Single bright red arcade apple with one green leaf and a strong white pixel highlight."),
    item("Roast Chicken", "Poulet roti", "One whole roast chicken on no plate, golden skin and compact arcade pickup silhouette."),
    item("Steel Pipe", "Tuyau d acier", "Single straight grey steel pipe with scuffed ends and street grime."),
    item("Police Badge", "Badge de police", "Single gold police shield badge with blue inset, no copied seal or readable lettering."),
  ]),
  pack("Team Fortress 2", "team_fortress_2", "https://wiki.teamfortress.com/wiki/Mann_Co._Supply_Crate_Key", [
    item("Sandvich", "Sandvich", "Single triangular sandwich with white bread, olive toothpick, lettuce, tomato and meat layers."),
    item("Mann Co. Crate Key", "Cle de caisse Mann Co.", "Single chunky brass industrial crate key with rectangular teeth, no copied company logo."),
    item("Australium Bar", "Lingot d Australium", "One radiant golden metal bar with beveled corners and no stamped text."),
    item("Medkit", "Medkit", "Single small white medical case with red color block and no copied symbol or text."),
  ]),
  pack("Toy Soldiers", "toy_soldiers", "https://store.steampowered.com/app/98300/Toy_Soldiers/", [
    item("Wind-up Key", "Cle de remontage", "Single brass toy wind-up key with twin oval loops and short square shaft."),
    item("Tin Soldier Rifle", "Fusil de soldat en etain", "One miniature stamped-tin bolt-action rifle with painted wood and metal colors."),
    item("Toy Artillery Shell", "Obus miniature", "Single miniature brass artillery shell with toy-scale seams and blunt safe tip."),
    item("Ration Tin", "Boite de ration", "One small olive drab ration tin with rolled rim and no readable military markings."),
  ]),
  pack("Zombies Ate My Neighbors", "zombies_neighbors", "https://segaretro.org/images/e/ed/Zombies_Ate_My_Neighbors_MD_US_Manual.pdf", [
    item("Water Pistol", "Pistolet a eau", "Single colorful plastic water pistol with oversized blue reservoir and red nozzle."),
    item("Soda Can", "Canette de soda", "One bright arcade soda can with generic color bands and no copied brand text."),
    item("Pandora's Box", "Boite de Pandore", "Single ornate dark box with gold corners and eerie violet light leaking from the lid."),
    item("Bazooka", "Bazooka", "One chunky olive shoulder-fired launcher with simple sights and 16-bit proportions."),
  ]),

  // FG4 - manga and animation
  pack("Another", "another", "https://another.fandom.com/wiki/Mei_Misaki/Image_Gallery", [
    item("Mei's Eyepatch", "Cache-oeil de Mei", "Single plain white medical eyepatch with thin straps and subtle fabric folds."),
    item("Blue Doll", "Poupee bleue", "One delicate blue-eyed ball-jointed doll in dark blue gothic dress and bonnet."),
    item("Class 3 Roster", "Registre de la classe 3", "Single closed school roster notebook with worn grey cover and no readable writing."),
    item("Umbrella", "Parapluie", "One folded clear school umbrella with pointed metal tip and pale curved handle."),
  ]),
  pack("Dandadan", "dandadan", "https://anime-dandadan.com/", [
    item("Turbo Granny Maneki-neko", "Maneki-neko Turbo Granny", "Single white lucky-cat figure with Turbo Granny's wide grin, red bib and raised paw."),
    item("Golden Ball", "Boule doree", "One smooth supernatural golden sphere with a warm aura and clean reflective surface."),
    item("Seiko's Bat", "Batte de Seiko", "Single worn wooden baseball bat wrapped near the grip with talisman paper lacking readable text."),
    item("Okarun's Glasses", "Lunettes d Okarun", "Single pair of black rectangular school glasses with thick rims and clear lenses."),
  ]),
  pack("Digimon Celestial Rift", "digimon_celestial", "https://toy.bandai.co.jp/manuals/files/2648482.pdf?ver=sf7ii9", [
    item("Digivice", "Digivice", "Single compact handheld evolution device with rounded white casing, blue screen and colored buttons."),
    item("Crest of Light", "Crest of Light", "One small golden crest tag with a sun-like light emblem and no lettering."),
    item("Holy Ring", "Anneau sacre", "Single thick golden sacred ring with subtle engraved bands and white radiance."),
    item("Berenjena Gun", "Pistolet Berenjena", "One purple-black demonic handgun with organic curves and silver barrel details."),
  ]),
  pack("Gunnm", "gunnm", "https://battleangel.fandom.com/wiki/Damascus_Blade", [
    item("Damascus Blade", "Lame Damascus", "Single long curved Damascus steel blade with layered wave pattern and cybernetic grip."),
    item("Motorball", "Motorball", "One heavy steel racing ball with segmented armor plates, recessed bolts and scuff marks."),
    item("Hunter-Warrior Badge", "Badge Hunter-Warrior", "Single worn metal bounty badge with angular cyberpunk insignia and no readable text."),
    item("Gally's Cyborg Heart", "Coeur cybernetique de Gally", "One compact biomechanical heart with red core, silver valves and bundled black cables."),
  ]),
  pack("Overlord Anime", "overlord_anime", "https://overlordmaruyama.fandom.com/wiki/Staff_of_Ainz_Ooal_Gown", [
    item("Staff of Ainz Ooal Gown", "Sceptre d Ainz Ooal Gown", "Single ornate black-gold staff crowned by seven colored serpent-held gems."),
    item("Ring of Nazarick", "Anneau de Nazarick", "One heavy gold signet ring with a dark central crest and no copied lettering."),
    item("Red Healing Potion", "Potion de soin rouge", "Single small faceted glass vial filled with vivid red potion and sealed by a cork."),
    item("Momonga's Red Orb", "Orbe rouge de Momonga", "One large polished crimson orb with deep internal glow and dark metal setting."),
  ]),
  pack("Spawn", "spawn", "https://mcfarlane.com/toys/series/spawn-series-1/", [
    item("Necroplasm Chain", "Chaine necroplasmique", "Single length of heavy black-green living chain coiled into one compact pickup."),
    item("Living Cape Clasp", "Agrafe de cape vivante", "One skull-like red-black cape clasp with organic ridges and green necroplasm glow."),
    item("Military Dog Tags", "Plaques militaires", "One pair of worn military dog tags on a single ball chain, no readable personal data."),
    item("Agony Axe", "Hache Agony", "Single massive dark fantasy battle axe with hooked blades and green necroplasm veins."),
  ]),
  pack("Tanya the Evil", "tanya_the_evil", "https://youjo-senki.jp/tv/", [
    item("Type-95 Computation Orb", "Orbe de calcul Type-95", "Single jeweled four-core computation orb in brass housing with pale blue magical light."),
    item("Mage Rifle", "Fusil de mage", "One wood-and-steel imperial bolt-action rifle fitted with a compact magical computation sight."),
    item("Silver Wings Assault Badge", "Insigne Silver Wings", "Single silver winged military badge with central gemstone and no readable text."),
    item("Imperial Dog Tags", "Plaques imperiales", "One pair of dark imperial identity tags on a chain, stamped texture without legible writing."),
  ]),

  // FG4 - films
  pack("Baby Cart", "baby_cart", "https://en.wikipedia.org/wiki/Lone_Wolf_and_Cub%3A_White_Heaven_in_Hell", [
    item("Daigoro's Cart", "Chariot de Daigoro", "Single wooden Edo-period baby cart with high wicker hood, iron-rim wheels and concealed panels."),
    item("Dotanuki Sword", "Sabre dotanuki", "One sturdy Japanese dotanuki sword in dark scabbard with practical wrapped hilt."),
    item("Hidden Cart Machine Gun", "Mitrailleuse dissimulee du chariot", "Single compact period-stylized multi-barrel gun module folded out from a wooden cart panel."),
    item("Daigoro's Drum", "Petit tambour de Daigoro", "One small hand drum with tan hide heads, dark wooden body and short strap."),
  ]),
  pack("Banlieue 13", "banlieue_13", "https://www.imdb.com/title/tt0414852/plotsummary/", [
    item("Neutron Bomb Detonator", "Detonateur de bombe a neutrons", "Single rugged digital detonator with numeric keypad shapes, red switch and no readable text."),
    item("Damien's Badge", "Badge de Damien", "One worn undercover police badge in a black leather holder, no copied seal or lettering."),
    item("Leito's Parkour Shoe", "Chaussure de parkour de Leito", "Single lightweight black urban trainer with reinforced sole and red accent."),
    item("Taha's Pistol", "Pistolet de Taha", "One compact dark semi-automatic pistol with worn grip and no custom markings."),
  ]),
  pack("Battle Royale", "battle_royale", "https://www.rottentomatoes.com/m/battle_royale", [
    item("Explosive Collar", "Collier explosif", "Single thick steel student collar with segmented plates, small red indicator and locking clasp."),
    item("Island Map", "Carte de l ile", "One folded paper island map showing a grid and coastline but no readable labels."),
    item("Survival Bag", "Sac de survie", "One olive school-issue canvas backpack with buckles, rolled blanket and no printed number."),
    item("Assigned Weapon Card", "Carte d arme assignee", "Single plain issue card with abstract weapon silhouette and color code, no readable text."),
  ]),
  pack("Chappie", "chappie", "https://theproptank.com/original-guard-key-prop-case/", [
    item("Consciousness USB", "Cle USB de conscience", "Single rugged black USB drive with colored tape tabs and exposed metal connector."),
    item("Guard Key", "Cle de garde", "One heavy industrial security key in a fitted black case, angular metal bow and short teeth."),
    item("Children's Book", "Livre pour enfant", "Single small worn illustrated children's book with bright shapes but no copied cover or text."),
    item("MOOSE Control Helmet", "Casque de controle MOOSE", "One bulky neural-control helmet with dark visor, side electrodes and military grey shell."),
  ]),
  pack("Chicken Run", "chicken_run", "https://www.netflix.com/tudum/articles/chicken-run-ending-explained", [
    item("Tunnel Spoon", "Cuillere de tunnel", "Single bent metal kitchen spoon with scratched bowl and dirt on the handle."),
    item("Escape Blueprint", "Plan d evasion", "One rolled blue escape blueprint partly open with white schematic lines and no readable labels."),
    item("Fowler's RAF Medal", "Medaille RAF de Fowler", "Single aged brass service medal with striped ribbon and no copied insignia text."),
    item("Crate-plane Propeller", "Helice de l avion-caisse", "One handmade wooden aircraft propeller with bolted hub and uneven carved blades."),
  ]),
  pack("Cloverfield", "cloverfield", "https://cloverfield.fandom.com/wiki/Production_Notes", [
    item("Hud's Camcorder", "Camescope de Hud", "Single handheld consumer camcorder with flip-out screen, tape bay and scratched black casing."),
    item("Memory Card", "Carte memoire", "One small black flash memory card with gold contacts and no printed brand or capacity."),
    item("Rob and Beth Photo", "Photo de Rob et Beth", "Single slightly bent instant photograph showing two indistinct silhouettes, no copied faces or text."),
    item("Evacuation Badge", "Badge d evacuation", "One laminated emergency evacuation pass with colored stripe and abstract icon, no readable text."),
  ]),
  pack("Evil Dead", "evil_dead", "https://www.evildeadthegame.com/en/", [
    item("Necronomicon Ex-Mortis", "Necronomicon Ex-Mortis", "Single flesh-bound ancient book with distorted face relief, stitched seams and iron corner clasps."),
    item("Chainsaw", "Tronconneuse", "One battered red chainsaw with silver guide bar, black top handle and dried cabin grime."),
    item("Boomstick", "Boomstick", "One short double-barrel shotgun with sawn wooden stock and dark blued steel."),
    item("Kandarian Dagger", "Dague kandarienne", "Single bone-handled ritual dagger with jagged asymmetrical blade and carved skull details."),
  ]),
  pack("Gremlins", "gremlins", "https://www.lego.com/en-ca/categories/adults-welcome/article/back-80s-lego-gizmo-gremlins", [
    item("Gizmo Gift Box", "Boite cadeau de Gizmo", "Single square antique gift box with carved wooden panels, air holes and brass latch."),
    item("Glass of Water", "Verre d eau", "One clear drinking glass filled with water, bright reflections and no other object."),
    item("Alarm Clock", "Reveil", "Single red bedside alarm clock showing nearly midnight with simplified unreadable dial marks."),
    item("Gizmo's Bow Tie", "Noeud papillon de Gizmo", "One small red fabric bow tie with elastic band and soft folds."),
  ]),
  pack("H2G2", "h2g2", "https://www.thepropgallery.com/the-hitchhikers-guide-to-the-galaxy-babel-fish", [
    item("Towel", "Serviette", "Single folded blue-grey travel towel with thick woven edge and no embroidery."),
    item("Electronic Guide", "Guide electronique", "One small black electronic guide device with green-lit screen and chunky side controls."),
    item("Babel Fish Bowl", "Bocal a poisson Babel", "Single clear spherical bowl containing one tiny yellow fish silhouette and blue water."),
    item("Point-of-View Gun", "Arme Point-of-View", "One sleek white curved sci-fi handheld device with violet emitter and smooth ergonomic grip."),
  ]),
  pack("Heavy Metal 2000", "heavy_metal_2000", "https://en.wikipedia.org/wiki/Heavy_Metal_2000", [
    item("Julie's Sword", "Epee de Julie", "Single broad futuristic sword with dark steel blade, red grip and battle-worn edge."),
    item("Fountain Key Crystal", "Cristal-cle de la fontaine", "One faceted blue-white alien key crystal in a small dark metal mount."),
    item("FAKK2 Talisman", "Talisman FAKK2", "Single metallic protective talisman with angular alien shape and central red gem, no text."),
    item("Odin's Weapon", "Arme d Odin", "One heavy alien energy pistol with ribbed black body and luminous blue barrel chamber."),
  ]),
  pack("House of 1000 Corpses", "house_1000_corpses", "https://en.wikipedia.org/wiki/House_of_1000_Corpses", [
    item("Captain Spaulding Mask", "Masque de Captain Spaulding", "Single sinister clown mask with white face, blue eye shapes, red mouth and bald cap."),
    item("Murder Ride Ticket", "Ticket Murder Ride", "One aged carnival admission ticket with faded red-black ornament but no readable text."),
    item("Otis' Revolver", "Revolver d Otis", "One worn long-barrel revolver with dark steel frame and brown grip."),
    item("Dr. Satan Surgical Tool", "Outil chirurgical de Dr. Satan", "Single corroded surgical clamp modified with jagged steel jaws and dirty cloth wrap."),
  ]),
  pack("Iron Sky", "iron_sky", "https://en.wikipedia.org/wiki/Iron_Sky", [
    item("Command Smartphone", "Smartphone de commande", "Single black early touchscreen smartphone displaying abstract blue control shapes without text."),
    item("Moon Helmet", "Casque lunaire", "One retro white lunar helmet with black visor, ribbed hose port and no insignia."),
    item("Flying Saucer Key", "Cle de soucoupe", "Single silver disc-shaped vehicle key with tiny radial fins and blue center light."),
    item("Gotterdammerung Control Unit", "Unite de controle du Gotterdammerung", "One bulky retro-futurist control box with metal toggles, red lamps and no readable labels."),
  ]),
  pack("Kazaam", "kazaam", "https://d23.com/a-to-z/kazaam-film/", [
    item("Battered Boombox", "Boombox abime", "Single battered 1990s boombox with twin speakers, cassette deck and scratched black casing."),
    item("Magic Lamp", "Lampe magique", "One ornate brass genie lamp with curved spout, round lid and violet magical smoke glow."),
    item("Basketball", "Ballon de basket", "Single orange basketball with black channels and worn outdoor texture."),
    item("Stolen Cassette", "Cassette volee", "One clear audio cassette with red reels and blank label, no readable text."),
  ]),
  pack("Killer Tomatoes from Outer Space", "killer_tomatoes", "https://catalog.afi.com/Film/56192-ATTACK-OFTHEKILLERTOMATOES?cp=1&cxt=Filmography1&pos=1&sid=51558907-02aa-4f93-86a4-7021ddf1e46d&sr=0.09320808", [
    item("Finletter's Parachute", "Parachute de Finletter", "Single folded military parachute pack with olive straps and a small strip of canopy fabric."),
    item("Puberty Love Sheet Music", "Partition Puberty Love", "One loose sheet of music with abstract note marks but no readable title or lyrics."),
    item("Vinyl Record", "Disque vinyle", "Single black 7-inch vinyl record with plain red center label and no lettering."),
    item("Ketchup Bottle", "Bouteille de ketchup", "One generic red squeeze bottle with white cap and no copied label."),
  ]),
  pack("La Cite de la Peur", "cite_peur", "https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur_%28film%2C_1994%29", [
    item("Red Is Dead Sickle", "Faucille de Red Is Dead", "Single theatrical curved sickle with dark handle, polished blade and slasher-film wear."),
    item("Hammer", "Marteau", "One ordinary claw hammer with steel head and worn wooden handle."),
    item("Cannes Festival Badge", "Badge du Festival de Cannes", "Single laminated festival access badge with color blocks and no copied logo or readable text."),
    item("Film Reel", "Bobine du film", "One metal 35mm film reel with dark celluloid wound around it and a loose short tail."),
  ]),
  pack("Les Tuche", "tuche", "https://en.wikipedia.org/wiki/Les_Tuche", [
    item("Lottery Ticket", "Ticket de loterie", "Single creased lottery ticket with colored number boxes but no readable numbers or brand."),
    item("Fries Cone", "Cornet de frites", "One paper cone filled with golden fries, generic red-white paper and no logo."),
    item("Bouzolles Football Scarf", "Echarpe de football de Bouzolles", "Single folded blue-red supporter scarf with simple stripes and no readable club name."),
    item("Monaco Bow Tie", "Noeud papillon de Monaco", "One oversized formal bow tie in bright luxury colors with satin highlights."),
  ]),
  pack("Les Visiteurs", "les_visiteurs", "https://fr.wikipedia.org/wiki/Les_Visiteurs_%28film%2C_1993%29", [
    item("Time Potion Vial", "Fiole de potion temporelle", "Single medieval glass vial of murky green potion sealed with wax and rough twine."),
    item("Godefroy's Sword", "Epee de Godefroy", "One broad medieval knight sword with straight crossguard, leather grip and worn steel."),
    item("Godefroy's Signet Ring", "Chevaliere de Godefroy", "Single heavy gold medieval signet ring with a heraldic face and no readable inscription."),
    item("Time Grimoire", "Grimoire du temps", "One small weathered medieval grimoire with iron clasps, leather cover and occult diagrams without text."),
  ]),
  pack("Mars Attacks", "mars_attacks", "https://screencraft.org/wp-content/uploads/2019/11/MarsAttacks.pdf", [
    item("Martian Ray Gun", "Pistolet a rayons martien", "Single retro-futurist silver ray gun with transparent green chamber and red emitter tip."),
    item("Martian Bubble Helmet", "Casque-bulle martien", "One clear glass dome helmet with silver neck ring and green atmosphere valves."),
    item("Translation Device", "Appareil de traduction", "Single compact Martian translator box with chrome grille, colored lights and no readable controls."),
    item("Slim Whitman Record", "Disque de Slim Whitman", "One black vinyl record in a plain western-themed sleeve with no copied portrait, logo or text."),
  ]),
  pack("Meet the Feebles", "feebles", "https://www.nzfilm.co.nz/films/meet-feebles", [
    item("Heidi's Microphone", "Microphone de Heidi", "Single vintage silver stage microphone with rounded grille and pale stand clip."),
    item("Wynyard's Rifle", "Fusil de Wynyard", "One worn military rifle with dark wood stock, steel barrel and stage-backlot grime."),
    item("Backstage Pass", "Pass coulisses", "Single laminated backstage pass with bright border and abstract shapes, no readable text."),
    item("Show Clapperboard", "Clap de spectacle", "One small black-white production clapperboard with blank fields and no lettering."),
  ]),
  pack("Moonwalker", "moonwalker", "https://www.imfdb.org/wiki/Moonwalker", [
    item("Fedora", "Fedora", "Single black fedora with narrow white band, crisp crown and stage-worn brim."),
    item("Falling Star Token", "Jeton d etoile filante", "One luminous silver star-shaped token with a short blue-white comet trail."),
    item("Pulse Laser Cannon", "Canon laser a impulsion", "Single compact futuristic silver pulse cannon with red emitter and angular grip."),
    item("Lancia Stratos Key", "Cle de Lancia Stratos", "One 1980s car key with black plastic bow, silver blade and no manufacturer logo."),
  ]),
  pack("Necronomicon", "necronomicon", "https://en.wikipedia.org/wiki/Necronomicon_%28film%29", [
    item("Forbidden Bound Book", "Livre interdit relie", "Single thick forbidden book with cracked dark leather, metal corners and an abstract eye relief."),
    item("Vault Key", "Cle du coffre", "One long antique iron vault key with ornate teeth and oxidized surface."),
    item("Lovecraft's Pen", "Stylo de Lovecraft", "Single black fountain pen with gold nib, worn cap and dried ink stain."),
    item("Ink Bottle", "Flacon d encre", "One squat faceted glass ink bottle filled with near-black violet ink and cork stopper."),
  ]),
  pack("Pee-wee", "pee_wee", "https://www.thealamo.org/support/preservation/updates/artifact-spotlight-pee-wees-red-bicycle", [
    item("Red Bicycle", "Velo rouge", "Single complete bright red vintage bicycle with white tires, chrome handlebars and rear carrier."),
    item("Red Bow Tie", "Noeud papillon rouge", "One small vivid red fabric bow tie with neat central knot."),
    item("Bicycle Lock", "Antivol de velo", "Single coiled steel bicycle cable lock with red plastic coating and small key cylinder."),
    item("Fortune Card", "Carte de voyance", "One illustrated fortune card with abstract moon-eye symbols and no readable text."),
  ]),
  pack("Planete Hurlante", "planete_hurlante", "https://en.wikipedia.org/wiki/Screamers_%281995_film%29", [
    item("Alliance Rifle", "Fusil de l Alliance", "Single rugged grey sci-fi assault rifle with ribbed barrel shroud and desert wear."),
    item("Alliance ID Tag", "Plaque d identite de l Alliance", "One angular military identity tag on a short chain, scratched metal and no readable data."),
    item("Type 3 Teddy Bear", "Ours en peluche Type 3", "Single dusty brown teddy bear with one damaged eye and subtle mechanical seam."),
    item("Screamer Blade", "Lame de Screamer", "One crescent-shaped autonomous metal blade with serrated edge and compact motor housing."),
  ]),
  pack("Puppet Master", "puppet_master", "https://puppet-master.fandom.com/wiki/Blade/Puppet", [
    item("Blade's Hook Knife", "Lame-crochet de Blade", "Single compact puppet-scale weapon combining one knife edge and one curved hook on a black grip."),
    item("Toulon's Trunk", "Malle de Toulon", "One small aged wooden puppet trunk with brass corners, leather handle and multiple drawers."),
    item("Animation Fluid Vial", "Fiole de fluide d animation", "Single slender glass vial filled with bright green animation fluid and capped by brass."),
    item("Jester Hat", "Bonnet de Jester", "One miniature black-white jester cap with four soft points and tiny bells."),
  ]),
  pack("Re-Animator", "re_animator", "https://www.re-animatorfilms.com/Re-Animator.html", [
    item("Green Reagent Syringe", "Seringue de reactif vert", "Single large medical syringe filled with luminous green reagent, steel needle and black plunger."),
    item("Severed-head Tray", "Plateau pour tete sectionnee", "One empty stainless surgical tray with raised rim, straps and green reagent stains."),
    item("Miskatonic ID Badge", "Badge de Miskatonic", "Single clipped hospital identity badge with green stripe and no copied logo or readable name."),
    item("Medical Bag", "Sac medical", "One worn black leather doctor's bag with brass clasp and green vial holder visible inside."),
  ]),
  pack("REC", "rec", "https://www.sonypictures.com/movies/rec", [
    item("Pablo's Camera", "Camera de Pablo", "Single shoulder-mounted broadcast video camera with top microphone and scratched black casing."),
    item("Firefighter Axe", "Hache de pompier", "One red-headed firefighter axe with wooden handle and worn rescue grip."),
    item("Rosary", "Rosaire", "Single dark wooden rosary coiled around one small metal cross."),
    item("Attic Key", "Cle du grenier", "One old brass apartment key with oval bow, chipped teeth and a small cloth tag without text."),
  ]),
  pack("Rocky Horror Picture Show", "rocky_horror", "https://dcrockyhorror.com/prop-guide", [
    item("Sonic Transducer", "Transducteur sonique", "Single retro laboratory control device with silver body, red dome light and black cable."),
    item("Rocky's Gold Trunks", "Short dore de Rocky", "One neatly folded pair of metallic gold stage trunks with black waistband."),
    item("Floor-show Corset", "Corset du floor-show", "One folded black sequined stage corset with red lacing and no wearer."),
    item("Laboratory Glove", "Gant de laboratoire", "Single long pale rubber laboratory glove with rolled cuff and theatrical pink tint."),
  ]),
  pack("Roger Rabbit", "roger_rabbit", "https://rogerrabbit.fandom.com/wiki/Portable_Hole", [
    item("Dip Canister", "Bidon de Trempette", "Single yellow-black industrial solvent canister with hazard color blocks but no readable text."),
    item("Portable Hole", "Trou portable", "One rolled black flexible disc partly unfurled, perfectly dark center and thin grey rim."),
    item("Acme Will", "Testament Acme", "Single sealed legal parchment with red wax seal and no readable document text."),
    item("Gag Mallet", "Maillet gag", "One oversized cartoon wooden mallet with striped handle and brightly painted head."),
  ]),
  pack("RRRrrrr!!!", "rrrrrrr", "https://fr.wikipedia.org/wiki/RRRrrrr%21%21%21", [
    item("Shampoo Bowl", "Bol de shampooing", "Single rough stone bowl containing pale foamy shampoo and a primitive wooden stirrer fixed inside."),
    item("Wooden Club", "Gourdin", "One chunky prehistoric wooden club with knots, chipped surface and leather wrist loop."),
    item("First-murder Stone", "Pierre du premier meurtre", "One palm-sized dark stone with a sharp edge and a single red stain."),
    item("Clean-hair Headband", "Bandeau des Cheveux Propres", "One simple beige cloth headband folded into a loop, no markings."),
  ]),
  pack("Sharknado", "sharknado", "https://www.rottentomatoes.com/m/sharknado", [
    item("Chainsaw", "Tronconneuse", "Single orange chainsaw with long silver bar, black grip and storm-splashed finish."),
    item("Surfboard", "Planche de surf", "One bright surfboard with shark-bite notch and abstract stripes without logo."),
    item("Explosive Cylinder", "Bouteille explosive", "Single red compressed-gas cylinder with valve cage and no readable warning text."),
    item("Shark Tooth", "Dent de requin", "One large triangular white shark tooth with serrated edge and weathered root."),
  ]),
  pack("Shaun of the Dead", "shaun_dead", "https://propstore.com/movie/shaun-of-the-dead-2004", [
    item("Cricket Bat", "Batte de cricket", "Single worn willow cricket bat with taped handle and light pub-floor grime."),
    item("Winchester Pint", "Pinte du Winchester", "One clear pub pint glass filled with amber beer and a small foam head, no logo."),
    item("Foree Electronics Badge", "Badge Foree Electronics", "Single clipped employee badge with red-blue blocks and no readable company name."),
    item("Vinyl Record", "Disque vinyle", "One black vinyl record in a plain sleeve with a small torn corner, no copied cover art."),
  ]),
  pack("Sinister", "sinister", "https://en.wikipedia.org/wiki/Sinister_%28film%29", [
    item("Super 8 Reel", "Bobine Super 8", "Single small metal Super 8 film reel wound with dark home-movie film."),
    item("Super 8 Projector", "Projecteur Super 8", "One beige vintage film projector with twin reel arms, lens and power cord."),
    item("Bughuul Drawing", "Dessin de Bughuul", "Single child's crayon drawing of a tall dark face-like shape, original composition and no text."),
    item("Film Box", "Boite de film", "One plain white cardboard film box with black stripe and no copied title or writing."),
  ]),
  pack("Starship Troopers", "starship_troopers", "https://entertainment.ha.com/itm/movie-tv-memorabilia/props/starship-troopers-tri-star-1997-mobile-infantry-hero-morita-mk-i-rifle/a/7356-90530.s", [
    item("Morita Mk I Rifle", "Fusil Morita Mk I", "Single bulky black futuristic rifle with integrated underslung barrel and olive furniture."),
    item("Mobile Infantry Helmet", "Casque de l Infanterie mobile", "One grey-black infantry helmet with cheek guards, clear goggles and no unit markings."),
    item("Tactical Mini-nuke", "Mini-bombe tactique", "One compact olive tactical warhead with folding fins and red safety cap, no printed text."),
    item("Citizenship Pamphlet", "Brochure de citoyennete", "Single folded propaganda pamphlet with abstract heroic silhouettes and no copied slogan or logo."),
  ]),
  pack("The Collector", "collector", "https://en.wikipedia.org/wiki/The_Collector_%282009_film%29", [
    item("Collector Mask", "Masque du Collector", "Single dark stitched leather mask with narrow eye openings and metal fasteners."),
    item("Red Trunk", "Malle rouge", "One heavy red travel trunk with brass corners, black straps and multiple locks."),
    item("Bear Trap", "Piege a machoires", "Single open steel bear trap with toothed jaws, chain and trigger plate."),
    item("Insect Display Box", "Boite d exposition d insectes", "One shallow glass specimen box containing pinned insect silhouettes without labels."),
  ]),
  pack("The Thing", "the_thing", "https://www.imdb.com/title/tt0084787/plotsummary", [
    item("Blood-test Petri Dish", "Boite de Petri du test sanguin", "Single clear Petri dish holding one dark red blood sample on a metal tray insert."),
    item("Heated Copper Wire", "Fil de cuivre chauffe", "One bent copper wire loop glowing orange at the tip with insulated clamp handle."),
    item("Flamethrower", "Lance-flammes", "Single improvised Antarctic flamethrower with metal fuel canister, hose and rifle-like nozzle."),
    item("Whisky Bottle", "Bouteille de whisky", "One square amber whisky bottle with plain cream label shape and no copied brand text."),
  ]),
  pack("Virus", "virus_1999", "https://www.imfdb.org/index.php/Virus", [
    item("Ship Keycard", "Carte d acces du navire", "Single scratched ship access card with red magnetic stripe and no readable vessel name."),
    item("Welder", "Poste a souder", "One handheld industrial arc welder with thick cable, metal grip and blue spark at the tip."),
    item("Mechanical Eye Module", "Module d oeil mecanique", "Single red-lensed biomechanical camera eye with steel iris and bundled black wires."),
    item("Nadia's Shotgun", "Fusil de Nadia", "One worn pump-action shotgun with black polymer stock and taped flashlight mount."),
  ]),
  pack("Voyage de Chihiro", "spirited_away", "https://ghibli.fandom.com/wiki/Bath_Tokens", [
    item("Bath Token", "Jeton de bain", "Single carved wooden bathhouse token with simple geometric herb symbol and no readable text."),
    item("Herbal Dumpling", "Boule d herbes", "One large green medicinal dumpling with fibrous texture and a small bite-free silhouette."),
    item("Purple Hair Tie", "Elastique violet", "Single purple woven hair tie loop with a tiny sparkling thread detail."),
    item("Train Ticket", "Ticket de train", "One small pale paper train ticket with punched edge and abstract marks but no readable text."),
  ]),
  pack("Wrong Turn", "wrong_turn", "https://www.yourprops.com/Barb-wire-prop-used-by-original-movie-prop-Wrong-Turn-2003-YP829721.html", [
    item("Barbed-wire Trap", "Piege en fil barbele", "Single coiled barbed-wire snare with rusty hooks and one compact pressure trigger."),
    item("Compound Bow", "Arc a poulies", "One rugged hunting compound bow with dark limbs, cams and olive grip."),
    item("Backroads Map", "Carte des routes secondaires", "One folded paper forest road map with red route line and no readable place names."),
    item("Truck Key", "Cle du camion", "One old ignition key with cracked black plastic bow and small rusty ring."),
  ]),

  // FG4 - series and literature
  pack("American Dad", "american_dad", "https://americandad.fandom.com/wiki/The_Golden_Turd", [
    item("Golden Turd", "Etron dore", "Single polished gold novelty sculpture with a compact curled silhouette and bright highlights."),
    item("CIA Badge", "Badge de la CIA", "One black leather federal badge wallet with gold shield shape and no copied seal or text."),
    item("Roger Wig", "Perruque de Roger", "Single flamboyant blonde disguise wig on no head, curled ends and synthetic shine."),
    item("Klaus Fishbowl", "Bocal de Klaus", "One round clear fishbowl with orange pebble, tiny castle and blue water, no fish character."),
  ]),
  pack("Cthulhu", "cthulhu", "https://www.hplovecraft.com/WRITINGS/texts/fiction/cc.aspx", [
    item("Cthulhu Idol", "Idole de Cthulhu", "Single small green-black stone idol of a winged tentacled figure on a squat pedestal."),
    item("R'lyeh Bas-relief", "Bas-relief de R'lyeh", "One broken dark stone tablet carved with impossible city angles and a central tentacled silhouette."),
    item("Johansen Manuscript", "Manuscrit de Johansen", "Single tied bundle of aged handwritten pages with ink lines rendered unreadable."),
    item("Alert Compass", "Boussole affolee", "One antique brass compass with a visibly off-center needle and salt-corroded glass."),
  ]),
  pack("Defiance", "defiance", "https://www.imfdb.org/wiki/Defiance_-_Season_1", [
    item("Nolan's Pistol", "Pistolet de Nolan", "Single rugged hybrid human-alien pistol with dark frame, silver barrel and worn leather grip."),
    item("Ark-tech Device", "Appareil Ark-tech", "One compact alien mechanism with layered metal petals and cyan energy core."),
    item("E-Rep Badge", "Badge E-Rep", "Single angular metal authority badge with blue inset and no readable lettering."),
    item("Charge Blade", "Lame de charge", "One short alien energy blade emitter with metallic handle and bright blue edge."),
  ]),
  pack("Family Guy", "family_guy", "https://familyguy.fandom.com/wiki/Rupert", [
    item("Pawtucket Beer Can", "Canette de biere Pawtucket", "Single generic cartoon beer can with red-white bands and no copied brand name."),
    item("Stewie's Ray Gun", "Pistolet a rayons de Stewie", "One bulbous grey-blue cartoon ray gun with red antenna tip and oversized trigger."),
    item("Rupert Teddy Bear", "Ours Rupert", "Single worn brown teddy bear with simple button eyes, rounded ears and stitched paws."),
    item("Peter's Glasses", "Lunettes de Peter", "Single pair of round wire-frame glasses with thick clear lenses and no face."),
  ]),
  pack("Futurama", "futurama", "https://www.theinfosphere.org/Fry_and_the_Slurm_Factory", [
    item("Slurm Can", "Canette de Slurm", "Single bright green sci-fi soda can with abstract swirl shapes and no copied logo or text."),
    item("Planet Express Badge", "Badge Planet Express", "One red-white delivery badge with a simple rocket silhouette and no copied lettering."),
    item("Holophonor", "Holophonor", "Single ornate brass wind instrument with curved bell, keys and small holographic emitter."),
    item("Dark-matter Pellet", "Granule de matiere noire", "One small faceted black-violet fuel pellet with dense purple glow."),
  ]),
  pack("Godzilla The Animated Series", "godzilla_tas", "https://www.scifijapan.com/anime-animation/godzilla-the-series", [
    item("H.E.A.T. Communicator", "Communicateur H.E.A.T.", "Single rugged grey handheld communicator with green screen, antenna and no copied acronym text."),
    item("Sonic Signaler", "Emetteur sonique", "One compact tripod sonic beacon with circular speaker, red light and black casing."),
    item("DNA Sample Vial", "Fiole d ADN", "Single sealed laboratory vial containing dark green reptilian tissue and amber fluid."),
    item("Tracking Beacon", "Balise de suivi", "One magnetic oval tracking beacon with blinking green diode and reinforced shell."),
  ]),
  pack("La Casa de Papel", "casa_papel", "https://casa-de-papel.hypnoweb.net/la-casa-de-papel/les-dossiers-du-professeur/les-objets/masques.271.74/", [
    item("Dali Mask", "Masque de Dali", "Single pale theatrical mask with arched brows, curled moustache and black elastic strap."),
    item("Folded Red Jumpsuit", "Combinaison rouge pliee", "One neatly folded red hooded jumpsuit with front zipper and no wearer."),
    item("Professor's Origami", "Origami du Professeur", "Single small paper bird folded from cream paper, no writing."),
    item("Gold Bar", "Lingot d or", "One heavy rectangular gold bar with worn edges and no stamped serial or text."),
  ]),
  pack("Les Inconnus", "les_inconnus", "https://fr.wikipedia.org/wiki/Liste_des_sketches_des_Inconnus", [
    item("Sketch Cue Card", "Fiche de sketch", "Single studio cue card with abstract blocking marks and no readable joke or text."),
    item("Stade 2 Tracksuit", "Survetement Stade 2", "One folded retro blue sports tracksuit with white stripes and no copied logo."),
    item("Hunter's Rifle", "Fusil du chasseur", "One old double-barrel hunting shotgun with worn wood and leather sling."),
    item("Auteuil Cap", "Casquette d Auteuil", "Single dark supporter cap with red-blue panels and no readable club name."),
  ]),
  pack("Malcolm in the Middle", "malcolm", "https://malcolminthemiddle.fandom.com/wiki/Rollerskates", [
    item("Krelboyne Textbook", "Manuel des Krelboynes", "Single thick school science textbook with geometric atom shapes and no copied title."),
    item("Hal's Roller Skate", "Patin a roulettes de Hal", "One retro quad roller skate with brown boot, orange wheels and white laces."),
    item("Dewey's Hamster Ball", "Boule de hamster de Dewey", "Single clear plastic hamster exercise ball with circular air slots and blue latch."),
    item("Lois' Clipboard", "Porte-bloc de Lois", "One brown store clipboard holding blank checklist boxes and a red pen."),
  ]),
  pack("Pingu", "pingu", "https://pingu.jp/", [
    item("Fish", "Poisson", "Single small silver-blue fish with simple clay-animation proportions and bright eye."),
    item("Red Sled", "Luge rouge", "One compact red wooden sled with curved runners and tan pull rope."),
    item("Mailbag", "Sac postal", "One blue-grey canvas mailbag with flap, shoulder strap and no postal logo."),
    item("Accordion", "Accordeon", "One small red accordion with cream keys, black bellows and no brand lettering."),
  ]),
  pack("Rugrats", "rugrats", "https://nickelodeon.fandom.com/wiki/Cynthia", [
    item("Reptar Doll", "Poupee Reptar", "Single green cartoon dinosaur toy with purple back plates and soft vinyl texture."),
    item("Cynthia Doll", "Poupee Cynthia", "Single fashion doll with uneven blonde hair, pink dress and one missing shoe."),
    item("Tommy's Screwdriver", "Tournevis de Tommy", "One small yellow-handled flat screwdriver with rounded child-safe cartoon proportions."),
    item("Baby Bottle", "Biberon", "Single clear baby bottle filled with milk, blue cap and measurement marks without numbers."),
  ]),
  pack("SCP Foundation", "scp", "https://scp-wiki.wikidot.com/scp-500", [
    item("SCP-500 Bottle", "Flacon SCP-500", "Single small white medicine bottle holding red pills, plain label shapes and no copied text."),
    item("SCP-714 Ring", "Anneau SCP-714", "One smooth green jade ring with heavy muted sheen and no inscription."),
    item("Level 4 Keycard", "Carte d acces niveau 4", "Single dark facility keycard with orange stripe and abstract clearance blocks, no readable text."),
    item("Scranton Reality Anchor", "Ancre de realite Scranton", "One compact industrial reality anchor with steel frame, coils and pale blue central emitter."),
  ]),
  pack("Squid Game", "squid_game", "https://cdn.svc.asmodee.net/production-mixlore/uploads/2024/05/SITE_MIXLORE_SQUID_GAME_RULES_EN_1.pdf", [
    item("Dalgona Tin", "Boite de dalgona", "Single round silver tin containing one intact honeycomb candy with simple stamped shape."),
    item("Invitation Card", "Carte d invitation", "One black business card with three colored geometric shapes and no copied text."),
    item("Marbles", "Billes", "One small cloth pouch opened to reveal a single cluster of colorful glass marbles."),
    item("Player Patch", "Ecusson de joueur", "Single green fabric number patch with blank geometric blocks instead of readable digits."),
  ]),
  pack("The Simpsons", "simpsons", "https://simpsonswiki.com/wiki/Duff_Brewery", [
    item("Pink Donut", "Donut rose", "Single ring donut with pink frosting and multicolored sprinkles."),
    item("Duff Beer Can", "Canette de biere Duff", "Single red cartoon beer can with white oval shape and no copied brand text or logo."),
    item("Bart's Skateboard", "Skateboard de Bart", "One small red-orange skateboard with yellow wheels and scratched deck."),
    item("Cursed Krusty Doll", "Poupee Krusty maudite", "Single small clown doll with blue hair, green shirt, red nose and sinister wind-up switch."),
  ]),

  // FG4 - music
  pack("Ado", "ado", "https://ado.fandom.com/wiki/Ado_Music_Video_Characters", [
    item("Chando Blue Rose", "Rose bleue de Chando", "Single stylized deep-blue rose with black thorned stem and sharp music-video silhouette."),
    item("Black Ribbon", "Ruban noir", "One long black satin hair ribbon tied into a compact bow with trailing ends."),
    item("Cage Microphone", "Microphone-cage", "Single dark stage microphone enclosed by thin curved cage bars, no logo."),
    item("Cracked Mirror", "Miroir fissure", "One small oval black-framed mirror with radial cracks and a blue reflected glow."),
  ]),
  pack("Atarashii Gakko", "atarashii_gakko", "https://atarashiigakko-themovie.jp/", [
    item("Leader Armband", "Brassard de leader", "Single red-white school leader armband laid flat, no copied characters or readable text."),
    item("Megaphone", "Megaphone", "One compact red-white school megaphone with black handle and no printed logo."),
    item("Uwabaki Shoe", "Chaussure uwabaki", "Single white Japanese indoor school shoe with blue toe cap and rubber sole."),
    item("School Whistle", "Sifflet scolaire", "One silver school whistle on a short red cord, clean metal reflections."),
  ]),
  pack("Babymetal", "babymetal", "https://www.asmart.jp/en/shop/babymetal/product/10027584", [
    item("Fox Mask", "Masque de renard", "Single white kitsune stage mask with red-black painted details and gold bell accents."),
    item("Kitsune Charm", "Charme kitsune", "One small fox-head metal charm on a red cord with black enamel details."),
    item("Red Tutu Bow", "Noeud de tutu rouge", "Single folded red-black stage costume bow with layered tulle and metallic edging."),
    item("Stage Microphone", "Microphone de scene", "One black handheld performance microphone with red ring and no branding."),
  ]),
  pack("Band-Maid", "band_maid", "https://bandmaid.tokyo/biography?locale=en", [
    item("Maid Headband", "Serre-tete de maid", "Single black-white frilled maid headband with symmetrical lace and ribbon."),
    item("Zemaitis Guitar", "Guitare Zemaitis", "One engraved metal-top electric guitar with dark body and no copied brand or lettering."),
    item("Bass Guitar", "Guitare basse", "Single dark stage bass guitar with four strings, silver hardware and red accent."),
    item("Drumstick", "Baguette de batterie", "One worn wooden concert drumstick with black grip tape and chipped tip."),
  ]),
  pack("Bella Poarch", "bella_poarch", "https://en.wikipedia.org/wiki/Build_a_Bitch", [
    item("Doll Key", "Cle de poupee", "Single oversized brass wind-up doll key with heart-shaped loops and worn factory finish."),
    item("Stitched Heart", "Coeur recousu", "One small fabric heart with black stitches, red-pink panels and no text."),
    item("Horn Headband", "Serre-tete a cornes", "Single black headband with two small curved red-black fantasy horns."),
    item("Combat Boot", "Botte de combat", "One black lace-up combat boot with thick sole, silver eyelets and pink accent."),
  ]),
  pack("Bigflo & Oli", "bigflo_oli", "https://vimeo.com/234312930", [
    item("Toulouse Cap", "Casquette de Toulouse", "Single dark baseball cap with red-white city color blocks and no copied logo or text."),
    item("Rose Festival Wristband", "Bracelet du Rose Festival", "One woven pink concert wristband with abstract pattern and no readable lettering."),
    item("Trumpet", "Trompette", "Single polished brass trumpet with three valves and compact stage reflections."),
    item("Stage Microphone", "Microphone de scene", "One black handheld rap microphone with silver grille and no branding."),
  ]),
  pack("Billie Eilish", "billie_eilish", "https://store.billieeilish.com/shop", [
    item("Blohsh Pendant", "Pendentif Blohsh", "Single silver abstract leaning-figure pendant on a short chain, original geometry and no logo."),
    item("Black Crown", "Couronne noire", "One small dripping black crown prop with uneven points and glossy finish."),
    item("Folded Yellow Raincoat", "Impermeable jaune plie", "One folded oversized yellow raincoat with black snaps and wet vinyl sheen."),
    item("Spider Box", "Boite a araignee", "Single small matte-black display box with one silver spider relief, no text."),
  ]),
  pack("Black Eyed Peas", "black_eyed_peas", "https://www.universal-music.co.jp/black-eyed-peas/videos/boom-boom-pow/", [
    item("The E.N.D. Cube Token", "Jeton-cube The E.N.D.", "Single small black-white futuristic cube with original geometric panels and no copied lettering."),
    item("Boom Boom Pow Visor", "Visiere Boom Boom Pow", "One wraparound mirrored performance visor with angular silver temples and cyan reflections."),
    item("Futuristic Microphone", "Microphone futuriste", "Single chrome handheld microphone with segmented blue light rings and no logo."),
    item("Stage Touch Panel", "Panneau tactile de scene", "One portable black touch panel displaying abstract neon equalizer shapes without text."),
  ]),
  pack("Blackpink", "blackpink", "https://shop.blackpinkmusic.com/pages/blackpink-official-light-stick-user-guide", [
    item("Pink Hammer Lightstick", "Lightstick marteau rose", "Single pink-black concert lightstick shaped like a double-headed toy hammer, no copied logo."),
    item("Geomungo", "Geomungo", "One traditional Korean zither with dark polished wood, six strings and decorative bridge."),
    item("Stage Microphone", "Microphone de scene", "One pink metallic handheld concert microphone with black grille and no branding."),
    item("Crown Hairpin", "Epingle couronne", "Single small gold crown-shaped hairpin set with pink stones and no lettering."),
  ]),
  pack("Bring Me the Horizon", "bring_me_horizon", "https://www.bmthofficial.com/music/", [
    item("Sempiternal Pendant", "Pendentif Sempiternal", "Single circular metal pendant with original interlaced geometric pattern and no copied logo."),
    item("Post Human Mask", "Masque Post Human", "One dark tactical face mask with red cyber-organic seams and no printed words."),
    item("Stage Microphone", "Microphone de scene", "Single battered black live microphone with red tape ring and no branding."),
    item("Guitar Pick", "Mediator", "One black guitar pick with a simple original white geometric mark and no logo."),
  ]),
  pack("Deadmau5", "deadmau5", "https://timeline.deadmau5.com/timeline/mau5head/", [
    item("Mau5head", "Mau5head", "Single large round mouse-eared electronic helmet with LED eyes, original color layout and no logo."),
    item("Cube Stage Panel", "Panneau du Cube", "One detached triangular LED stage panel showing abstract cyan-magenta pixels without text."),
    item("Studio Headphones", "Casque audio", "Single black-red over-ear studio headset with padded band and coiled cable."),
    item("Set USB Drive", "Cle USB de set", "One compact black USB drive with red indicator light and no branding."),
  ]),
  pack("Die Antwoord", "die_antwoord", "https://en.wikipedia.org/wiki/Die_Antwoord", [
    item("Ninja Cap-mask", "Casquette-masque de Ninja", "Single black-white performance cap with attached lower-face cloth and original geometric marks."),
    item("Yo-Landi Platform Shoe", "Chaussure plateforme de Yo-Landi", "One oversized white-black platform sneaker with thick stacked sole."),
    item("Stage Microphone", "Microphone de scene", "Single white handheld rap microphone with black grille and no branding."),
    item("Chappie Prop Pistol", "Pistolet accessoire de Chappie", "One bright stylized prop pistol with white-pink casing, clearly non-real finish and no text."),
  ]),
  pack("Eminem", "eminem", "https://www.eminem.com/news/cyber-monday-additions-on-the-eminem-store/", [
    item("Hockey Mask", "Masque de hockey", "Single off-white hockey mask with small ventilation holes, black straps and restrained red marks."),
    item("Prop Chainsaw", "Tronconneuse factice", "One theatrical compact chainsaw with orange casing, blunt silver bar and stage wear."),
    item("Cassette Tape", "Cassette audio", "Single clear audio cassette with black reels and blank white label."),
    item("Stage Microphone", "Microphone de scene", "One black handheld rap microphone with silver grille and no branding."),
  ]),
  pack("Ghost", "ghost_band", "https://shopuk.ghost-official.com/products/grucifix-ghoul-mask", [
    item("Papa Mitre", "Mitre de Papa", "Single tall black-white ceremonial mitre with gold piping and original occult geometry without text."),
    item("Grucifix", "Grucifix", "One black-silver inverted cross-like stage pendant with original proportions and no copied logo."),
    item("Nameless Ghoul Mask", "Masque de Nameless Ghoul", "Single silver horned stage mask with smooth expressionless face and dark eye mesh."),
    item("Thurible", "Encensoir", "One ornate silver censer on a single chain cluster, faint smoke and gothic cutouts."),
  ]),
  pack("Gorillaz", "gorillaz", "https://wmg.jp/gorillaz/profile/", [
    item("Noodle's Guitar", "Guitare de Noodle", "Single slim red-black electric guitar with anime-band wear and no copied brand."),
    item("2-D's Melodica", "Melodica de 2-D", "One compact blue keyboard melodica with flexible black mouth tube and no logo."),
    item("Murdoc's Bass", "Basse de Murdoc", "Single dark green-black bass guitar with pointed body and tarnished metal hardware."),
    item("Plastic Beach Key", "Cle de Plastic Beach", "One large weathered brass island key with coral-like bow and pink plastic fragment."),
  ]),
  pack("Guns N Roses", "guns_n_roses", "https://www.lemonde.fr/culture/article/2024/05/17/slash-guitariste-de-guns-n-roses-ce-disque-de-reprises-de-blues-est-cathartique-pour-moi_6233903_3246.html", [
    item("Slash's Top Hat", "Haut-de-forme de Slash", "Single tall black top hat with silver concho band and no copied emblem."),
    item("Slash's Les Paul", "Les Paul de Slash", "One sunburst single-cut electric guitar with cream binding and no copied brand."),
    item("Axl's Bandana", "Bandana d Axl", "Single folded red bandana with original white pattern and tied trailing ends."),
    item("Standing Microphone", "Microphone sur pied", "One silver stage microphone on a short black stand segment with no branding."),
  ]),
  pack("Hoshi", "hoshi_music", "https://www.nrj.fr/artistes/hoshi/albums/coeur-parapluie", [
    item("Heart Umbrella", "Parapluie Coeur", "Single folded black umbrella with one small original red heart patch and curved handle."),
    item("Black Glasses", "Lunettes noires", "Single pair of thick black rectangular glasses with dark lenses."),
    item("Heart Pin", "Epingle coeur", "One small red enamel heart pin with silver edge and no lettering."),
    item("Stage Microphone", "Microphone de scene", "One black handheld vocal microphone with silver grille and no branding."),
  ]),
  pack("Indila", "indila", "https://www.universal-music.de/indila/videos/derniere-danse-335045", [
    item("White Umbrella", "Parapluie blanc", "Single folded white vintage umbrella with slender dark shaft and curved handle."),
    item("Snow Globe", "Boule a neige", "One small glass snow globe containing a miniature Parisian rooftop silhouette."),
    item("Stage Microphone", "Microphone de scene", "One elegant silver handheld vocal microphone with dark grille and no logo."),
    item("Music-box Key", "Cle de boite a musique", "Single ornate brass winding key with curled bow and short square stem."),
  ]),
  pack("Korn", "korn", "https://www.hrgiger.com/music/korn.htm", [
    item("Biomechanical Microphone Stand", "Pied de micro biomecanique", "Single sculptural dark-metal microphone stand with ribbed vertebral forms and no copied logo."),
    item("Bagpipes", "Cornemuse", "One complete dark tartan bagpipe instrument with black drones and silver fittings."),
    item("Seven-string Guitar", "Guitare sept cordes", "Single dark seven-string electric guitar with low-slung body and no copied brand."),
    item("Follow the Leader Doll", "Poupee Follow the Leader", "One small vintage school-uniform doll with shadowed face, original pose and no copied cover art."),
  ]),
  pack("Kyary Pamyu Pamyu", "kyary", "https://www.vogue.com/article/kyary-pamyu-pamyu-j-pop-beauty-fashion", [
    item("Eye Bow", "Noeud avec oeil", "Single pastel hair bow centered on one surreal blue eye motif, original design and no text."),
    item("Candy Microphone", "Microphone bonbon", "One striped candy-like handheld microphone with pink grille and glossy toy finish."),
    item("Rabbit Doll", "Poupee lapin", "Single pastel stuffed rabbit with mismatched button eyes and surreal fashion details."),
    item("PonPon Bow", "Noeud PonPon", "One oversized multicolor ribbon bow with polka-dot panels and dangling pompons."),
  ]),
  pack("Lady Gaga", "lady_gaga", "https://www.ladygaga.com/us-en/music/telephone-with-beyonce", [
    item("Disco Stick", "Disco Stick", "Single chrome crystal-tipped performance wand with faceted transparent head and black grip."),
    item("Telephone Glasses", "Lunettes Telephone", "One pair of angular black sunglasses decorated with small metallic chain links."),
    item("Chromatica Armor Piece", "Piece d armure Chromatica", "Single pink-silver sculpted shoulder armor plate with spikes and iridescent finish."),
    item("Red Stage Microphone", "Microphone rouge", "One metallic red handheld concert microphone with dark grille and no branding."),
  ]),
  pack("Ladybaby", "ladybaby", "https://www.ttmnet.co.jp/artists/ladybaby/", [
    item("Metal Microphone", "Microphone metal", "Single black-silver concert microphone wrapped by a small red chain detail."),
    item("Maid Bow", "Noeud de maid", "One black-white frilled maid bow with lace edges and red center gem."),
    item("Mini Stage Axe", "Mini hache de scene", "Single miniature foam stage axe with silver-black head and red ribbon."),
    item("Concert Pass", "Pass de concert", "One laminated red-black concert pass with abstract shapes and no readable text."),
  ]),
  pack("Lil Nas X", "lil_nas_x", "https://www.grammy.com/news/lil-nas-x-creative-vision-montero-collaborators-roundtable-64th-grammy-awards/", [
    item("Cowboy Hat", "Chapeau de cowboy", "Single black western hat with silver chain band and subtle pink underside."),
    item("Montero Pole Ornament", "Ornement de pole Montero", "One ornate golden serpent-shaped pole finial detached as a single collectible object."),
    item("Star Walkin Sword", "Epee Star Walkin", "Single sleek fantasy sword with blue-purple cosmic blade and gold guard."),
    item("Horseshoe Microphone", "Microphone fer a cheval", "One gold handheld microphone with horseshoe-shaped grille frame and no logo."),
  ]),
  pack("Linkin Park", "linkin_park", "https://www.linkinpark.com/music", [
    item("Hybrid Soldier Tag", "Plaque du soldat Hybrid", "Single worn metal dog tag with an original winged-soldier silhouette and no copied title."),
    item("Platinum Turntable Disc", "Disque de platine", "One silver DJ turntable platter with concentric grooves and black center spindle."),
    item("Chester-style Microphone", "Microphone style Chester", "Single black live microphone with silver grille and a narrow white tape band."),
    item("Meteora Spray Can", "Bombe de peinture Meteora", "One grey-red aerosol can with original stencil-like color blocks and no copied lettering."),
  ]),
  pack("Man with a Mission", "man_with_mission", "https://www.sonymusic.co.jp/artist/manwithamission/profile/", [
    item("Wolf Mask", "Masque de loup", "Single realistic grey wolf stage mask with open jaw, fur texture and dark eye mesh."),
    item("Military Dog Tags", "Plaques militaires", "One pair of worn steel dog tags on a black cord, no readable personal data."),
    item("Stage Guitar", "Guitare de scene", "Single black-red electric guitar with angular body and no copied brand."),
    item("DJ Deck", "Platine DJ", "One compact black DJ controller with twin jog wheels and colored pads without labels."),
  ]),
  pack("Marilyn Manson", "marilyn_manson", "https://www.marilynmansoncollection.com/museum", [
    item("Mechanical Animals Prosthetic Arm", "Bras prothetique Mechanical Animals", "Single pale biomechanical prosthetic forearm with segmented fingers and smooth alien joints."),
    item("Stage Podium", "Pupitre de scene", "One compact black metal podium top with industrial bolts and abstract occult ornament."),
    item("Contact Lens Case", "Etui de lentilles", "Single small black contact lens case opened to reveal one pale and one dark lens."),
    item("Prop Knife Microphone", "Microphone-couteau factice", "Single theatrical microphone shaped with a blunt knife-like body, clearly a stage prop and no logo."),
  ]),
  pack("Michael Jackson", "michael_jackson", "https://www.si.edu/object/nmaahc_2009.42.2", [
    item("Black Fedora", "Fedora noir", "Single black stage fedora with narrow white band and sharply pinched crown."),
    item("Sequined Glove", "Gant sequine", "Single right-hand white glove laid flat and densely covered with silver sequins."),
    item("Folded Thriller-style Jacket", "Veste style Thriller pliee", "One folded red-black leather stage jacket with angular paneling and no wearer."),
    item("Black Loafers", "Mocassins noirs", "One complete pair of black leather loafers with white socks folded inside."),
  ]),
  pack("Nightwish", "nightwish", "https://www.nightwish.com/releases/imaginaerum", [
    item("Imaginaerum Snow Globe", "Boule a neige Imaginaerum", "One ornate snow globe containing a miniature dark carnival silhouette and blue winter glow."),
    item("Pendulum", "Pendule", "Single brass clock pendulum with long rod and moon-shaped bob."),
    item("Lantern", "Lanterne", "One antique black lantern with warm blue-white flame and frosted glass."),
    item("Closed Score Book", "Livre de partitions ferme", "Single closed dark-blue music score book with silver corner pieces and no readable title."),
  ]),
  pack("PSY", "psy", "https://abcnews.go.com/Entertainment/Music/south-korean-rapper-psys-gangnam-style-viral/story?id=16996559", [
    item("Black Sunglasses", "Lunettes noires", "Single pair of glossy black rounded sunglasses with thick temples."),
    item("Blue Bow Tie", "Noeud papillon bleu", "One bright blue satin bow tie with compact formal knot."),
    item("Prop Horse Head", "Tete de cheval factice", "Single theatrical brown horse-head prop with synthetic mane and clearly artificial finish."),
    item("Stage Microphone", "Microphone de scene", "One black handheld pop microphone with silver grille and no branding."),
  ]),
  pack("Queen Bee", "queen_bee", "https://ziyoou-vachi.com/about/index_e.html", [
    item("Honeycomb Microphone", "Microphone nid d abeille", "Single gold-black stage microphone with hexagonal honeycomb grille and no logo."),
    item("Avu-chan Fan", "Eventail d Avu-chan", "One folding black-red performance fan with iridescent feather pattern and no text."),
    item("Glam Glove", "Gant glam", "Single long black sequined glove with gold claw-like fingertip ornaments."),
    item("Album Mask", "Masque d album", "One original theatrical half-mask with black-gold insect geometry and no copied cover art."),
  ]),
  pack("Shaka Ponk", "shaka_ponk", "https://www.shakaponk.com/", [
    item("Goz Figure", "Figurine de Goz", "Single small stylized digital-ape figure with black fur, neon goggles and original pose."),
    item("Stage Goggles", "Lunettes de scene", "One pair of chunky black performance goggles with green lenses and side vents."),
    item("Stage Microphone", "Microphone de scene", "One black-green handheld rock microphone with silver grille and no branding."),
    item("Electric Guitar", "Guitare electrique", "Single red-black electric guitar with distressed body and no copied logo."),
  ]),
  pack("Shakira", "shakira", "https://grammymuseum.org/wp-content/uploads/2023/01/Shakira-exhibit-announce_FINAL.pdf", [
    item("Hip Scarf", "Foulard de hanche", "Single folded red-purple dance hip scarf edged with small gold coins."),
    item("Crystal Gibson Firebird", "Gibson Firebird cristal", "One translucent crystal-like angular electric guitar with silver hardware and no brand."),
    item("Leather Bracelet", "Bracelet en cuir", "Single stacked brown-black leather wrist bracelet with small silver beads."),
    item("Stage Microphone", "Microphone de scene", "One gold handheld concert microphone with dark grille and no branding."),
  ]),
  pack("Skrillex", "skrillex", "https://wmg.jp/skrillex/news/60025/", [
    item("Mothership Stage Panel", "Panneau Mothership", "Single angular black LED stage panel emitting original red-white geometric light patterns."),
    item("Studio Headphones", "Casque audio", "One black over-ear studio headset with asymmetric side shave-inspired color accent."),
    item("MIDI Controller", "Controleur MIDI", "One compact black MIDI pad controller with colored square pads and unlabeled knobs."),
    item("Tour Pass", "Pass de tournee", "Single laminated black-red tour pass with abstract spaceship silhouette and no readable text."),
  ]),
  pack("Sub Urban", "sub_urban", "https://suburban.lnk.to/Cradles", [
    item("Cradles Music Box", "Boite a musique Cradles", "Single dark wooden music box with brass crank and small porcelain cradle figure."),
    item("Black Top Hat", "Haut-de-forme noir", "One tall black top hat with narrow burgundy ribbon and dusty felt texture."),
    item("Porcelain Doll", "Poupee de porcelaine", "Single small cracked porcelain doll in pale vintage dress with glass eyes."),
    item("Funeral Ticket", "Ticket funeraire", "One aged black-cream admission ticket with ornamental border and no readable text."),
  ]),
  pack("The Weeknd", "the_weeknd", "https://pitchfork.com/thepitch/the-weeknd-director-alex-lill-unpacks-the-singer-eccentric-string-of-after-hours-tv-performances/", [
    item("Red-suit Sunglasses", "Lunettes du costume rouge", "Single pair of oversized square black sunglasses with amber-red reflected lights."),
    item("Starboy Cross", "Croix Starboy", "One faceted silver cross pendant on a short chain, original gem layout and no logo."),
    item("Bandage Roll", "Rouleau de bandage", "Single partly unrolled white medical bandage with a small dark-red stage stain."),
    item("Chrome Microphone", "Microphone chrome", "One polished chrome handheld vocal microphone with black grille and no branding."),
  ]),
  pack("Tommy Heavenly6", "tommy_heavenly", "https://www.sonymusic.co.jp/artist/Tommyheavenly6/discography/", [
    item("Gothic Top Hat", "Haut-de-forme gothique", "Single small black top hat with red ribbon, lace veil and silver safety pin."),
    item("Gothic Rabbit Doll", "Lapin gothique", "One black-white stuffed rabbit with stitched eye, tiny cross patch and red bow."),
    item("Red Guitar", "Guitare rouge", "Single glossy red electric guitar with black pickguard and no copied brand."),
    item("Candy-cross Pendant", "Pendentif bonbon-croix", "One red-white candy-like cross pendant on a black ribbon, original geometry and no text."),
  ]),
  pack("Ultra Vomit", "ultravomit", "https://www.sugeguitare.fr/guitares/sg-ultra-vomit-fetus/", [
    item("Fetus SG Guitar", "Guitare SG Fetus", "Single custom double-cut electric guitar with vivid original creature graphic and no copied logo."),
    item("Stage Frying Pan", "Poele de scene", "One battered black frying pan used as a stage prop, silver handle and comic dents."),
    item("Stage Microphone", "Microphone de scene", "One black handheld metal microphone with silver grille and no branding."),
    item("Parody Guitar Pick", "Mediator parodique", "One oversized yellow-black guitar pick with an original comic face and no text or logo."),
  ]),
  pack("Within Temptation", "within_temptation", "https://www.within-temptation.com/products/hydra", [
    item("Hydra Pendant", "Pendentif Hydra", "Single silver multi-headed serpent pendant on a dark chain, original arrangement and no logo."),
    item("Ice Queen Glove", "Gant Ice Queen", "One long white-silver stage glove with crystal-like cuff and frosted embroidery."),
    item("Stage Microphone", "Microphone de scene", "One silver-black symphonic-rock microphone with blue gem ring and no branding."),
    item("Stage Crown", "Couronne de scene", "One slender dark-silver crown with blue crystals and branching gothic points."),
  ]),
]);

const DISABLED_POLICY_SPECS = Object.freeze([
  Object.freeze({
    universe: "ASMRZ",
    stem: "asmrz",
    reason: Object.freeze({
      fr: "Source non identifiee : aucun objet ne doit etre invente avant fourniture d une reference officielle non ambigue.",
      en: "Unidentified source: no item may be invented until an unambiguous official reference is provided.",
    }),
  }),
  Object.freeze({
    universe: "Spoof Movie",
    stem: "spoof_movie",
    reason: Object.freeze({
      fr: "Titre ambigu : plusieurs oeuvres peuvent correspondre. Les drops restent desactives jusqu a identification du film exact et de son annee.",
      en: "Ambiguous title: several works may match. Drops remain disabled until the exact film and release year are identified.",
    }),
  }),
]);

const idsForStem = (stem) => Object.freeze({
  equipment: Object.freeze([
    `${stem}_sigil`,
    `${stem}_armor`,
    `${stem}_core`,
  ]),
  eventItem: `evt_${stem}_breach`,
});

const buildDescription = (universe, name, slotDefinition) => {
  const description = {
    fr: `${name.fr} est un objet physique emblematique de ${universe}. Sa silhouette et son usage canoniques sont conserves ; en jeu, il assure ${slotDefinition.gameplayRole.fr}.`,
    en: `${name.en} is an emblematic physical prop from ${universe}. Its canonical silhouette and use are preserved; in game, it provides ${slotDefinition.gameplayRole.en}.`,
  };

  return Object.freeze(description);
};

const buildIconPrompt = (universe, name, visualAnchor) => (
  `Original 512x512 RGBA pixel-art inventory icon. Exactly one physical object: ${name.en} from ${universe}. ` +
  `${visualAnchor} Three-quarter view from slightly above, complete object centered, source-accurate silhouette, ` +
  "proportions, materials and palette based on the cited visual reference without copying official artwork pixel for pixel. " +
  "Crisp pixel clusters, readable at small size, restrained contact shadow, transparent background. " +
  "No character, person, hand, duplicate object, environment, frame, watermark, copied logo or readable text."
);

const buildRuntimeItem = (
  universe,
  stem,
  referenceUrl,
  source,
  slotDefinition,
  index,
) => {
  const name = Object.freeze({
    fr: source.nameFr,
    en: source.nameEn,
  });
  const description = buildDescription(universe, name, slotDefinition);
  const prompt = buildIconPrompt(universe, name, source.visualAnchor);
  const id = slotDefinition.slot === "event"
    ? `evt_${stem}_breach`
    : `${stem}_${slotDefinition.slot}`;

  return Object.freeze({
    id,
    universe,
    kind: slotDefinition.slot === "event" ? "eventItem" : "equipment",
    slot: slotDefinition.slot,
    role: slotDefinition.role,
    gameplayRole: slotDefinition.gameplayRole,
    name,
    description,
    desc: description,
    referenceUrl,
    visualAnchor: source.visualAnchor,
    prompt,
    iconPrompt: prompt,
    icon: `/sprites/generated/items/${slugifyLoreItemAsset(universe)}/${slugifyLoreItemAsset(source.nameEn)}.png`,
    audit: Object.freeze({
      family: "FG4",
      priority: "P0",
      sourceIndex: index,
    }),
  });
};

const buildRuntimePack = (source) => {
  if (!source.referenceUrl.startsWith("https://")) {
    throw new Error(`Lore item reference must be an HTTPS URL: ${source.universe}`);
  }
  if (!/^[a-z0-9_]+$/.test(source.stem)) {
    throw new Error(`Invalid legacy item stem: ${source.universe} (${source.stem})`);
  }
  if (source.items.length !== SLOT_DEFINITIONS.length) {
    throw new Error(`Expected four lore items for ${source.universe}, received ${source.items.length}`);
  }

  const allItems = Object.freeze(source.items.map((entry, index) => {
    if (!entry.nameEn || !entry.nameFr || !entry.visualAnchor) {
      throw new Error(`Incomplete lore item source for ${source.universe} at index ${index}`);
    }

    return buildRuntimeItem(
      source.universe,
      source.stem,
      source.referenceUrl,
      entry,
      SLOT_DEFINITIONS[index],
      index,
    );
  }));

  return Object.freeze({
    universe: source.universe,
    legacyStem: source.stem,
    equipment: Object.freeze(allItems.slice(0, 3)),
    eventItem: allItems[3],
    allItems,
  });
};

export const LORE_ITEM_OVERRIDES = Object.freeze(Object.fromEntries(
  ACTIVE_PACK_SPECS.map((source) => [
    source.universe,
    buildRuntimePack(source),
  ]),
));

const enabledPolicies = ACTIVE_PACK_SPECS.map((source) => {
  const ids = idsForStem(source.stem);
  return [
    source.universe,
    Object.freeze({
      status: "enabled",
      source: "FG4_P0_confirmed",
      universe: source.universe,
      legacyStem: source.stem,
      equipmentIds: ids.equipment,
      eventItemId: ids.eventItem,
      expectedEquipment: 3,
      expectedEventItems: 1,
    }),
  ];
});

const disabledPolicies = DISABLED_POLICY_SPECS.map((source) => {
  const ids = idsForStem(source.stem);
  return [
    source.universe,
    Object.freeze({
      status: "disabled",
      source: "FG4_P0_blocked",
      universe: source.universe,
      legacyStem: source.stem,
      equipmentIds: ids.equipment,
      eventItemId: ids.eventItem,
      expectedEquipment: 0,
      expectedEventItems: 0,
      reason: source.reason,
    }),
  ];
});

export const LORE_ITEM_POLICIES = Object.freeze(Object.fromEntries([
  ...enabledPolicies,
  ...disabledPolicies,
]));

const validateRuntimeRegistry = () => {
  const activeUniverses = Object.keys(LORE_ITEM_OVERRIDES);
  const policyUniverses = Object.keys(LORE_ITEM_POLICIES);
  const seenIds = new Set();
  const seenIcons = new Set();

  if (activeUniverses.length !== 115) {
    throw new Error(`Expected 115 active FG4 item universes, received ${activeUniverses.length}`);
  }
  if (policyUniverses.length !== 117) {
    throw new Error(`Expected 117 FG4 item policies, received ${policyUniverses.length}`);
  }

  for (const excludedUniverse of EXCLUDED_UNIVERSES) {
    if (
      hasOwn(LORE_ITEM_OVERRIDES, excludedUniverse) ||
      hasOwn(LORE_ITEM_POLICIES, excludedUniverse)
    ) {
      throw new Error(`Excluded universe leaked into lore item registry: ${excludedUniverse}`);
    }
  }

  for (const universe of activeUniverses) {
    const override = LORE_ITEM_OVERRIDES[universe];
    const policy = LORE_ITEM_POLICIES[universe];
    const expectedIds = idsForStem(override.legacyStem);

    if (policy?.status !== "enabled") {
      throw new Error(`Missing enabled lore item policy for ${universe}`);
    }
    if (override.equipment.length !== 3 || override.allItems.length !== 4) {
      throw new Error(`Invalid lore item cardinality for ${universe}`);
    }

    const actualEquipmentIds = override.equipment.map((entry) => entry.id);
    if (
      actualEquipmentIds.some((id, index) => id !== expectedIds.equipment[index]) ||
      override.eventItem.id !== expectedIds.eventItem
    ) {
      throw new Error(`Legacy lore item IDs changed for ${universe}`);
    }

    for (const entry of override.allItems) {
      if (
        !entry.name.fr ||
        !entry.name.en ||
        !entry.description.fr ||
        !entry.description.en ||
        !entry.gameplayRole.fr ||
        !entry.gameplayRole.en ||
        !entry.referenceUrl.startsWith("https://") ||
        !entry.visualAnchor ||
        !entry.prompt
      ) {
        throw new Error(`Incomplete runtime lore item: ${universe}/${entry.id}`);
      }
      if (!/^\/sprites\/generated\/items\/[a-z0-9-]+\/[a-z0-9-]+\.png$/.test(entry.icon)) {
        throw new Error(`Invalid lore item icon path: ${entry.icon}`);
      }
      if (seenIds.has(entry.id)) {
        throw new Error(`Duplicate lore item ID: ${entry.id}`);
      }
      if (seenIcons.has(entry.icon)) {
        throw new Error(`Duplicate lore item icon path: ${entry.icon}`);
      }
      seenIds.add(entry.id);
      seenIcons.add(entry.icon);
    }
  }

  for (const source of DISABLED_POLICY_SPECS) {
    const policy = LORE_ITEM_POLICIES[source.universe];
    if (policy?.status !== "disabled") {
      throw new Error(`Missing disabled lore item policy for ${source.universe}`);
    }
    if (hasOwn(LORE_ITEM_OVERRIDES, source.universe)) {
      throw new Error(`Disabled universe must not expose invented items: ${source.universe}`);
    }
  }

  if (seenIds.size !== 460 || seenIcons.size !== 460) {
    throw new Error(
      `Expected 460 unique lore items and icons, received ${seenIds.size} IDs and ${seenIcons.size} icons`,
    );
  }
};

validateRuntimeRegistry();

export const getLoreItemOverrides = (universe) => (
  LORE_ITEM_OVERRIDES[universe] ?? null
);

export const getLoreItemPolicy = (universe) => (
  LORE_ITEM_POLICIES[universe] ?? null
);

export const getLoreEquipmentOverrides = (universe) => (
  getLoreItemOverrides(universe)?.equipment ?? EMPTY_EQUIPMENT
);

export const getLoreEventItemOverride = (universe) => (
  getLoreItemOverrides(universe)?.eventItem ?? null
);

export const getLoreItemOverride = (universe, id) => (
  getLoreItemOverrides(universe)?.allItems.find((entry) => entry.id === id) ?? null
);

export const isLoreItemUniverseEnabled = (universe) => (
  getLoreItemPolicy(universe)?.status === "enabled"
);
