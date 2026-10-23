// Individually authored action identities. Sources below identify the work and
// action being adapted; no record asserts network verification or 1:1 motion.
// Shared builders standardize game timing, never choose a character's identity.
const work = (universe, sourceWork) => (sourceReference, identityBasis, special) => ({
  universe, sourceWork, sourceReference, identityBasis, special,
  canonicalVerified: false, networkVerified: false, gameplayAdaptation: true
});
const action = (name, type, dmg, color, shape, delivery, range, extra = {}) => ({
  name, type, dmg, color, animationDuration: 1.25, hitAt: 0.5,
  targeting: { effect: 'damage', targetSide: 'enemy', shape, delivery, range, ...extra }
});
const hit = (name, dmg, color, range = 155, extra = {}) => action(name, 'melee', dmg, color, 'single', 'melee', range, extra);
const shot = (name, dmg, color, extra = {}) => action(name, 'projectile', dmg, color, 'single', 'projectile', 720, extra);
const beam = (name, dmg, color, extra = {}) => action(name, 'beam', dmg, color, 'line', 'beam', 760, { lineWidth: 48, ...extra });
const area = (name, type, dmg, color, extra = {}) => action(name, type, dmg, color, 'area', 'area', 720, { areaRadius: 140, ...extra });
const support = (name, effect, color, extra = {}) => ({
  name, type: effect, dmg: 0, color, animationDuration: 1.35, hitAt: 0.55,
  targeting: {
    effect, targetSide: 'ally', shape: 'group', delivery: 'support', range: 1200,
    duration: 5, buffMultiplier: 1.25, reduce: 0.5,
    healRatio: effect === 'heal' ? 0.25 : 0,
    cleanses: effect === 'cleanse', ...extra
  }
});

const ado = work('Ado', 'Ado — public concert and vocal performances');
const covenant = work('Alien: Covenant', 'Alien: Covenant (2017)');
const dad = work('American Dad', 'American Dad! — Smith family and CIA stories');
const creed = work("Assassin's Creed", "Assassin's Creed II, III and Odyssey — distinct protagonist continuities");
const titan = work('Attack on Titan', 'Attack on Titan — Survey Corps and Titan shifter continuity');
const babymetal = work('Babymetal', 'BABYMETAL — public concert performances and stage mythology');
const royale = work('Battle Royale', 'Battle Royale (2000)');
const bible = work('Bible Black', 'Bible Black: The Game (Active Software, 2000) — project noncombat investigation adaptation');
const bittrip = work('BIT.TRIP', 'BIT.TRIP RUNNER and Runner2');
const blazblue = work('BlazBlue', 'BlazBlue: Centralfiction');
const camera = work('Camera Cafe', 'Caméra Café — French office comedy');
const chucky = work('Chucky', 'Child’s Play / Chucky — Kyle, Nica and Jake continuities');
const bebop = work('Cowboy Bebop', 'Cowboy Bebop (1998)');
const cyberpunk = work('Cyberpunk', 'Cyberpunk 2077');
const dbd = work('Dead by Daylight', 'Dead by Daylight — survivor perk descriptions');
const deathnote = work('Death Note', 'Death Note — Kira investigation');
const defiance = work('Defiance', 'Defiance (2013 television series)');
const devilman = work('Devilman', 'Devilman Crybaby (2018)');
const digimon = work('Digimon Celestial Rift', 'Digimon Reference Book — named Digimon techniques');
const discworld = work('Discworld', 'Terry Pratchett’s Discworld novels');
const duke = work('Dynamite Duke', 'Dynamite Duke (1989)');
const elvira = work('Elvira', 'Elvira: Mistress of the Dark (1988); explicit roster adaptations');
const evolution = work('Evolution', 'Evolution (2001)');
const fear = work('F.E.A.R.', 'F.E.A.R. (2005) — F.E.A.R. team medic');
const fallout = work('Fallout', 'Fallout 4 and Fallout: New Vegas companion continuities');
const fantomas = work('Fantomas', 'Fantômas — André Hunebelle film trilogy');
const frieren = work('Frieren: Beyond Journeys End', 'Frieren: Beyond Journey’s End');
const ghost = work('Ghost', 'Ghost — public stage performances and Ministry fiction');
const godzilla = work('Godzilla The Animated Series', 'Godzilla: The Series (1998)');
const guitar = work('Guitar Hero', 'Guitar Hero — playable guitar performances');
const halo = work('Halo', 'Halo — Cortana, ODST and Blue Team continuities');
const hearteyes = work('Heart Eyes', 'Heart Eyes (2025)');
const homealone = work('Home Alone', 'Home Alone (1990)');
const iceage = work('Ice Age', 'Ice Age (2002)');
const inuyashiki = work('Inuyashiki', 'Inuyashiki — manga / 2017 anime');
const jersey = work('Jersey Devil', 'Jersey Devil (1997) — rescue and ending objectives');
const new52 = work('Joker New 52', 'DC New 52 — Batman and Harley Quinn continuities');
const killzone = work('Killzone', 'Killzone 2 / 3 and Killzone: Shadow Fall');
const casa = work('La Casa de Papel', 'La Casa de Papel — Royal Mint and Bank of Spain heists');
const land = work('Land of the Dead', 'Land of the Dead (2005)');
const fiel = work('Les Chevaliers du Fiel', 'Les Chevaliers du Fiel — municipal employee sketches');
const visiteur = work('Les Visiteurs du Futur', 'Le Visiteur du Futur — François Descraques web-series continuity');
const linkin = work('Linkin Park', 'Linkin Park — public vocal, rap and turntable performances');
const magicjack = work('MagiC JacK', 'MagiC JacK / La Minute Sapiens / Max Rage — Maxime Ginolin’s fictional personas');
const mars = work('Mars Attacks', 'Mars Attacks! (1996)');
const meridien = work('Méridien Creux', 'Multiverse Breach — Borrowed Hours DLC canon in src/game/ocDlcPacks.js');
const hellsinger = work('Metal: Hellsinger', 'Metal: Hellsinger (2022) — the Unknown’s stolen voice');
const minions = work('Minions', 'Minions (2015)');
const eva = work('Neon Genesis Evangelion', 'Neon Genesis Evangelion (1995 television continuity)');
const noob = work('Noob', 'Noob — Horizon web-series player characters');
const overlord = work('Overlord Anime', 'Overlord — Nazarick anime continuity');
const payday = work('Payday', 'PAYDAY 2 — crew roles, perk decks and Bain’s mission guidance');
const peepoodo = work('Peepoodo — Safe Educational Adaptation', 'Project-authored safe educational adaptation — canonRosterWave noncombat rules');
const predator = work('Predator', 'Predator (1987) and Predator 2 (1990), identified per record');
const predator2 = work('Predator 2', 'Predator 2 (1990)');
const prey = work('Prey', 'Prey (2022)');
const puttputt = work('Putt-Putt', 'Humongous Entertainment’s Putt-Putt adventure games');
const reanimator = work('Re-Animator', 'Re-Animator (1985) — medical and serum roles');
const rickmorty = work('Rick & Morty', 'Rick and Morty — Birdperson, Beth and Meeseeks appearances');
const rockyhorror = work('Rocky Horror Picture Show', 'The Rocky Horror Picture Show (1975)');
const kenshin = work('Rurouni Kenshin', 'Rurouni Kenshin — Hiten Mitsurugi and Kamiya Kasshin fighting styles');
const seaman = work('Seaman', 'Seaman (1999) — aquarium care and spoken interaction');
const shadowman = work('Shadow Man', 'Shadow Man (1999)');
const sharknado = work('Sharknado', 'Sharknado film series — survivor roles');
const slender = work('Slender Man', 'Slender: The Arrival — Kate, Lauren and Charlie Matheson');
const spermageddon = work('Spermageddon', 'Spermageddon (2025) — nonsexual abstract race adaptation');
const spoof = work('Spoof Movie', 'Don’t Be a Menace to South Central While Drinking Your Juice in the Hood (1996)');
const spy = work('Spy x Family', 'SPY×FAMILY — Operation Strix and Forger family continuity');
const stanhelsing = work('Stan Helsing', 'Stan Helsing (2009)');
const infinity = work('Stargate Infinity', 'Stargate Infinity (2002 animated series)');
const rage = work('Streets of Rage', 'Streets of Rage 2 and Streets of Rage 4 — named fighter moves');
const sao = work('Sword Art Online', 'Sword Art Online — Aincrad sword skills');
const titans = work('Teen Titans', 'Teen Titans (2003 animated series)');
const patate = work('The Amazing Patate Show', 'The Amazing Patate Show — noncombat music and dance adaptation in project roster');
const collector = work('The Collector', 'The Collector (2009) and The Collection (2012)');
const darkknight = work('The Dark Knight', 'The Dark Knight (2008)');
const rings = work('The Lord of the Rings', 'The Lord of the Rings — Peter Jackson film trilogy');
const thepredator = work('The Predator', 'The Predator (2018)');
const texas = work('The Texas Chain Saw Massacre', 'The Texas Chain Saw Massacre (1974) — survivor escape continuity');
const truman = work('The Truman Show', 'The Truman Show (1998)');
const titanfall = work('Titanfall 2', 'Titanfall 2 (2016) — campaign');
const torbahead = work('Torbahead', 'Torbahead — public reel-format adaptation in canonRosterWavePartM.js');
const twisted = work('Twisted Metal', 'Twisted Metal (1995), Twisted Metal 2 and Twisted Metal (2012), explicitly selected per vehicle');
const velocipastor = work('VelociPastor', 'The VelociPastor (2018)');
const warworlds = work('War of the Worlds', 'War of the Worlds (2005)');
const ferngully = work('Zak et Crysta', 'FernGully: The Last Rainforest (1992)');
const zorro = work('Zorro', 'The Mask of Zorro (1998)');

export const CAPABILITIES_LOT_3 = Object.freeze({
  ado_avatar: ado('Ado’s Usseewa vocal performance: expressive vocal contrast becomes a team morale buff; no combat power is claimed.', 'canonical-role', support('Usseewa — refrain de concert', 'buff', '#3f6dff', { buffMultiplier: 1.3 })),
  uta_echo_ado: ado('Uta Echo is the roster’s musical echo, not One Piece’s Uta; sustained backing vocals provide support only.', 'authored-universe-canon', support('Écho de la dernière note', 'guard', '#6290ff', { reduce: 0.45 })),
  rebellion_dancer_ado: ado('The roster’s Rebellion Dancer supports an Ado stage performance through synchronized choreography, without fictional weapons.', 'authored-universe-canon', support('Chorégraphie de rébellion', 'buff', '#1c4adc', { buffMultiplier: 1.22 })),
  daniels_covenant: covenant('Daniels uses the cargo bay and its machinery to eject the xenomorph; this adapts her practical escape planning as protection.', 'canonical-role', support('Évacuation du cargo', 'guard', '#b0a27a', { reduce: 0.62 })),
  walter_covenant: covenant('Walter physically interposes himself to protect Daniels during the neomorph attack, losing a hand in the film.', 'canonical-role', support('Interposition de Walter', 'guard', '#d6d6c2', { reduce: 0.68 })),
  tennessee_covenant: covenant('Tennessee pilots the cargo lifter to retrieve the surviving landing party, providing an extraction route.', 'canonical-role', support('Extraction au monte-charge', 'guard', '#7b8a8b', { reduce: 0.58 })),
  stan_smith: dad('Stan’s CIA-agent role includes conventional pistol fire and tactical assaults; no supernatural ability is assigned.', 'canonical-role', shot('Tir de couverture de la CIA', 3.6, '#ff4f5c', { shape: 'cone', coneAngle: 38 })),
  roger_alien: dad('Roger repeatedly changes disguises and assumed personas to deceive other characters; the adaptation protects allies through misdirection.', 'canonical-role', support('Changement de persona', 'guard', '#ff727f', { reduce: 0.55 })),
  hayley_smith: dad('Hayley’s activism and opposition to violence are expressed as an appeal for solidarity, not a gun or an alien power.', 'canonical-role', support('Appel à la solidarité', 'buff', '#dc2c39', { buffMultiplier: 1.24 })),
  ezio_auditore_ac: creed('Assassin’s Creed II / Brotherhood: Ezio employs paired hidden blades for close-range double assassinations.', 'canonical-technique', hit('Double lame secrète', 4.1, '#d14c43', 130, { shape: 'multi', maxTargets: 2 })),
  desmond_miles_ac: creed('Assassin’s Creed III: Desmond applies assassin training acquired through the Bleeding Effect, including hidden-blade takedowns.', 'canonical-role', hit('Lame secrète — effet de transfert', 3.7, '#f46f66', 130)),
  kassandra_ac: creed('Assassin’s Creed Odyssey: Hero Strike is an assassin ability performed with the broken Spear of Leonidas.', 'canonical-technique', hit('Hero Strike — lance de Léonidas', 4.5, '#ae2920', 175)),
  eren_yeager: titan('Eren’s Attack Titan fights with powerful close-range punches; the action uses that form rather than unrelated energy projectiles.', 'canonical-role', hit('Poing du Titan Assaillant', 4.8, '#2f7d55', 205, { shape: 'area', areaRadius: 95 })),
  mikasa_ackerman: titan('Mikasa uses omnidirectional mobility gear and paired ultrahard-steel blades to cut a Titan’s nape.', 'canonical-role', hit('Coupe de nuque — équipement tridimensionnel', 4.3, '#8b1e2d', 195)),
  armin_arlert: titan('Armin plans the operation against Bertholdt at Shiganshina; this retains his analytical command role without inventing a firearm.', 'canonical-role', support('Plan de Shiganshina', 'buff', '#f1c40f', { buffMultiplier: 1.35 })),
  levi_aot: titan('Levi’s revolving aerial blade attacks against the Beast Titan are performed with omnidirectional mobility equipment.', 'canonical-role', hit('Taille tournoyante du Bataillon', 4.7, '#566573', 200, { shape: 'area', areaRadius: 105 })),
  hange_aot: titan('Hange leads Survey Corps research and coordinates attacks using Thunder Spears against armored targets.', 'canonical-role', area('Salve de lances foudroyantes', 'rocket', 4.3, '#8e6e53', { areaRadius: 125 })),
  erwin_aot: titan('Erwin leads the Survey Corps charge at Shiganshina through a rallying speech; its game effect strengthens the squad.', 'canonical-role', support('Ordre de charge du commandant', 'buff', '#d6b465', { buffMultiplier: 1.4, duration: 4 })),
  babymetal_unit: babymetal('BABYMETAL’s Road of Resistance performance pairs lead vocals and dance; this is a concert morale effect only.', 'canonical-role', support('Road of Resistance — final de scène', 'buff', '#ff335f', { buffMultiplier: 1.32 })),
  fox_god_signal: babymetal('The Fox God is a motif in BABYMETAL’s stage mythology; the roster signal represents a concert cue, not a verified supernatural entity.', 'canonical-role', support('Only the Fox God Knows — signal de scène', 'guard', '#ff5682', { reduce: 0.48 })),
  kami_band_guard: babymetal('The Kami Band supplies BABYMETAL’s live instrumental accompaniment; the roster role reinforces musical timing without weapons.', 'canonical-role', support('Relais instrumental du Kami Band', 'buff', '#dc103c', { buffMultiplier: 1.26 })),
  shuya_nanahara: royale('Shuya protects Noriko and tries to escape the Program instead of embracing its violence; protection adapts that role.', 'canonical-role', support('Ne laisser personne sur l’île', 'guard', '#ff4e4e', { reduce: 0.56 })),
  noriko_nakagawa: royale('Noriko survives through mutual trust with Shuya and Kawada; the support action represents reassurance, not a fictional weapon.', 'canonical-role', support('Confiance de Noriko', 'buff', '#ff7171', { buffMultiplier: 1.2 })),
  kazuo_kiriyama: royale('Kiriyama uses automatic firearms in the film’s Program encounters; the adaptation is a conventional burst of gunfire.', 'canonical-role', shot('Rafale de Kiriyama', 4.2, '#dc2b2b', { shape: 'cone', coneAngle: 45 })),
  bible_black_taki_minase: bible('canonRosterWavePartE.js: Minase compares symbols and records containment notation while keeping the grimoire closed; this is an investigative protection action.', 'canonical-role', support('Notation de confinement du grimoire', 'guard', '#8660b8', { reduce: 0.5 })),
  bible_black_kurumi_imari: bible('canonRosterWavePartE.js: Imari aligns ward notes and prepares a safe fire-seal around the closed book; she remains a noncombat investigator.', 'canonical-role', support('Préparation du sceau d’Imari', 'guard', '#d77bb7', { reduce: 0.48 })),
  bible_black_hiroko_takashiro: bible('canonRosterWavePartE.js: Takashiro reconstructs the twelve-year archive and establishes counter-ritual proof to close the circle; no damaging spell is assigned.', 'canonical-role', support('Preuve du contre-rituel de Takashiro', 'cleanse', '#8565c8')),
  bit_trip_commander_video: bittrip('CommanderVideo in RUNNER progresses by jumping, sliding and kicking in rhythm; synchronized successful traversal is adapted as a buff.', 'canonical-role', support('Perfect Run — rythme sans faute', 'buff', '#f5c542', { buffMultiplier: 1.3 })),
  bit_trip_commandgirl_video: bittrip('CommandGirlVideo is a playable Runner2 character using its rhythm traversal actions, not a laser fighter.', 'canonical-role', support('Relais de course de CommandGirlVideo', 'guard', '#ed86c5', { reduce: 0.48 })),
  bit_trip_radbot: bittrip('canonRosterWavePartI.js supplies Radbot as a retro-robot rhythm-Trial roster role; this does not claim that it is a verified playable Runner2 fighter.', 'authored-universe-canon', support('Cadence mécanique de Radbot', 'buff', '#6ed9e6', { buffMultiplier: 1.24 })),
  hazama_bb: blazblue('Hazama uses the named technique Eternal Coils of the Dragon Serpent with Ouroboros chains; the area footprint and timing are gameplay adaptations, without an unverified source-system classification.', 'canonical-technique', area('Eternal Coils of the Dragon Serpent', 'chain', 4.5, '#4dbb73', { areaRadius: 125 })),
  tsubaki_bb: blazblue('Tsubaki’s Izayoi sealed armament channels stored Install energy through sword and light attacks; this is an adaptation of that weapon role, not a claimed Distortion Drive title.', 'canonical-role', hit('Izayoi — taille de lumière', 4.4, '#f5db92', 180)),
  hakumen_bb: blazblue('Hakumen’s Yukikaze is his counter Distortion Drive with the Ōkami sword; the adapted strike retains its close-range sword identity.', 'canonical-technique', hit('Yukikaze', 4.8, '#dde7e8', 190)),
  jean_claude_camera: camera('Jean-Claude Convenant is the company’s salesman and raconteur; a sales pitch is adapted as morale support at the coffee machine.', 'canonical-role', support('Argumentaire de Jean-Claude', 'buff', '#d2915a', { buffMultiplier: 1.2 })),
  herve_camera: camera('Hervé Dumont’s union-representative role organizes colleagues around their workplace interests, not combat or magic.', 'canonical-role', support('Réunion syndicale à la machine', 'guard', '#60929c', { reduce: 0.46 })),
  maeva_camera: camera('Maéva Capucin’s office poetry and timid conversation provide a character-specific supportive pause.', 'canonical-role', support('Poème de Maéva', 'cleanse', '#a779b0')),
  kyle_chucky: chucky('Child’s Play 2: Kyle helps Andy escape the Good Guy factory using the environment and practical resistance.', 'canonical-role', support('Sortie de la fabrique Good Guy', 'guard', '#d6a35e', { reduce: 0.58 })),
  nica_chucky: chucky('Nica Pierce resists Chucky’s control in the film and television continuity; the adaptation represents regained resolve, not an invented weapon.', 'canonical-role', support('Résister à l’emprise de Chucky', 'cleanse', '#a77a99')),
  jake_chucky: chucky('Jake Wheeler’s sculpting and relationships are central to Chucky’s television story; collective resolve is adapted as support.', 'canonical-role', support('Tenir ensemble contre Chucky', 'buff', '#719f9c', { buffMultiplier: 1.24 })),
  spike_spiegel: bebop('Spike practices Jeet Kune Do and uses rapid kicks and punches during bounty encounters.', 'canonical-role', hit('Enchaînement de Jeet Kune Do', 4.1, '#4568b2', 150)),
  faye_valentine: bebop('Faye carries a Glock 30 and participates in bounty-hunting shootouts; the adaptation uses that conventional sidearm.', 'canonical-role', shot('Tirs de couverture de Faye', 3.8, '#e9cf4a')),
  jet_black: bebop('Jet, a former ISSP officer, uses a Walther P99 and his cybernetic arm during bounty-hunting operations.', 'canonical-role', hit('Interception au bras cybernétique', 3.9, '#6c8eab', 155)),
  v_cyberpunk: cyberpunk('Cyberpunk 2077: Sandevistan operating systems slow perceived time and permit rapid close-range attacks; this is a selectable-build adaptation for V.', 'canonical-role', hit('Sandevistan — assaut accéléré', 4.5, '#f5d943', 190, { shape: 'multi', maxTargets: 3 })),
  johnny_silverhand_cp: cyberpunk('Johnny’s Malorian Arms 3516 is his signature pistol in Cyberpunk 2077 flashbacks.', 'canonical-role', shot('Malorian Arms 3516', 4.3, '#d94444')),
  panam_palmer_cp: cyberpunk('Panam’s Overwatch is the silenced sniper rifle associated with her Aldecaldo missions.', 'canonical-role', shot('Overwatch — tir de Panam', 4.5, '#de9952', { range: 900 })),
  dead_by_daylight_dwight_fairfield: dbd('Dwight’s Leader perk improves nearby survivors’ cooperative work; the adaptation buffs allies without turning him into a killer.', 'canonical-technique', support('Leader', 'buff', '#7397a5', { buffMultiplier: 1.26 })),
  dead_by_daylight_meg_thomas: dbd('Meg’s Adrenaline perk restores her own health state and grants her a sprint when exit gates are powered; the activation condition and recovery amount are adapted, while the effect stays self-only.', 'canonical-technique', support('Adrenaline', 'heal', '#bf655c', { healRatio: 0.28, targetSide: 'self', shape: 'single' })),
  dead_by_daylight_claudette_morel: dbd('Claudette’s Botany Knowledge improves healing efficiency; it remains a survivor healing action.', 'canonical-technique', support('Botany Knowledge', 'heal', '#84ad6b', { healRatio: 0.32 })),
  light_yagami: deathnote('Light manipulates information and constructs alibis during the Kira investigation; this avoids giving the Death Note arbitrary instant-kill rules against unknown targets.', 'canonical-role', support('Alibi de Kira', 'guard', '#a04643', { reduce: 0.55 })),
  l_lawliet: deathnote('L tests hypotheses and directs surveillance during the Kira investigation; deductions strengthen the team rather than creating energy attacks.', 'canonical-role', support('Déduction du quartier général', 'buff', '#6d83b3', { buffMultiplier: 1.32 })),
  misa_amane: deathnote('Misa Amane works as an idol and model; her public-performance role provides support without a fabricated damaging eye beam.', 'canonical-role', support('Apparition de Misa-Misa', 'buff', '#d9638e', { buffMultiplier: 1.23 })),
  misa_dn: deathnote('This second Misa roster entry retains the same idol identity and a distinct press-distraction support presentation.', 'canonical-role', support('Diversion médiatique de Misa', 'guard', '#c66ca7', { reduce: 0.48 })),
  ryuk_dn: deathnote('Ryuk observes Light and offers information about Death Note rules; his detached commentary becomes tactical support without invented mass death.', 'canonical-role', support('Rappel des règles du carnet', 'buff', '#7e6da6', { buffMultiplier: 1.22 })),
  near_dn: deathnote('Near reconstructs the Kira case using toys and analytical models; the warehouse plan supplies a team buff.', 'canonical-role', support('Reconstitution de Near', 'buff', '#d7e1e7', { buffMultiplier: 1.34 })),
  nolan_defiance: defiance('Joshua Nolan serves as Defiance’s lawkeeper and uses conventional firearms to defend the settlement.', 'canonical-role', shot('Tir du lawkeeper', 3.9, '#aa7858')),
  irisa_defiance: defiance('Irisa is an Irathient fighter known for close-range knife work; the action uses her blades rather than a generic energy power.', 'canonical-role', hit('Double taille irathient', 4.1, '#d08050', 150)),
  datak_tarr: defiance('Datak is a Castithan crime leader whose knife duels and ruthless close fighting belong to the series.', 'canonical-role', hit('Duel au couteau castithan', 3.9, '#c8ccd0', 145)),
  akira_fudo: devilman('Akira’s Devilman form combines demonic strength, flight and close fighting; this adapts a lunging claw strike.', 'canonical-role', hit('Assaut ailé de Devilman', 4.7, '#4968b2', 205)),
  miki_makimura: devilman('Miki publicly defends Akira’s humanity and reaches out to others; the action is protective solidarity, not a demonic attack.', 'canonical-role', support('Reconnaître l’humanité d’Akira', 'guard', '#df8e91', { reduce: 0.58 })),
  miko_kuroda: devilman('Miko’s Devilman Crybaby transformation grants demonic speed and strength; this adapts her running acceleration into a close strike.', 'canonical-role', hit('Sprint de la Devilman', 4.0, '#9b69ab', 195)),
  angewomon_digi: digimon('Angewomon’s Celestial Arrow is its sacred arrow technique in the Digimon Reference Book.', 'canonical-technique', shot('Celestial Arrow', 4.5, '#efd8ff')),
  lady_devimon_digi: digimon('LadyDevimon’s Darkness Wave releases a swarm-like wave of dark energy.', 'canonical-technique', area('Darkness Wave', 'dark_aoe', 4.5, '#a36bdd', { areaRadius: 155 })),
  beelzemon_digi: digimon('Beelzemon’s Double Impact fires its two Berenjena shotguns.', 'canonical-technique', shot('Double Impact', 4.8, '#9e7bce', { shape: 'multi', maxTargets: 2 })),
  darcmon_digi: digimon('The Digimon Reference Book associates Darcmon with the sword La Pucelle and the sword technique Baptême d’Amour; this action adapts a strike with that weapon, without presenting its name as a separate named technique.', 'canonical-role', hit('La Pucelle', 4.3, '#edc9dc', 175)),
  rincewind_dw: discworld('The Colour of Magic and later novels repeatedly define Rincewind through survival by running away, not reliable offensive sorcery.', 'canonical-role', support('Fuite stratégiquement très rapide', 'guard', '#c74c43', { reduce: 0.6 })),
  vimes_dw: discworld('Sam Vimes investigates crimes and holds the City Watch together; his watchman’s command becomes defensive coordination.', 'canonical-role', support('La Garde tient la rue', 'guard', '#849598', { reduce: 0.6 })),
  granny_dw: discworld('Granny Weatherwax uses headology and Borrowing rather than showy generic wizard attacks; headology steadies the squad.', 'canonical-role', support('Headology de Mémé Ciredutemps', 'cleanse', '#9999b9')),
  twoflower_dw: discworld('The Colour of Magic: Twoflower is a tourist with an iconograph and optimistic curiosity, not a trained combat mage.', 'canonical-role', support('Optimisme du premier touriste', 'buff', '#efd379', { buffMultiplier: 1.2 })),
  death_dw: discworld('Death’s duties concern guiding souls, while his sword is reserved for exceptional tasks; this adapts his composed guidance as protection.', 'canonical-role', support('Il reste encore du temps', 'guard', '#a8d5e7', { reduce: 0.65 })),
  vetinari_dw: discworld('Vetinari governs Ankh-Morpork through preparation, information and political leverage; strategic orders are represented by a buff.', 'canonical-role', support('Tout était prévu par le Patricien', 'buff', '#716b88', { buffMultiplier: 1.35 })),
  nanny_ogg_dw: discworld('Nanny Ogg uses practical witchcraft, common sense and community support in the Witches novels.', 'canonical-role', support('Réconfort de Nounou Ogg', 'heal', '#b07c91', { healRatio: 0.24 })),
  dynamite_duke: duke('Dynamite Duke’s protagonist has a cybernetic arm and a screen-clearing Dynamite Punch charged during arcade shooting stages.', 'canonical-technique', area('Dynamite Punch', 'punch_aoe', 4.8, '#d99855', { areaRadius: 175 })),
  arcade_commando_duke: duke('The project’s Arcade Commando represents the game’s military shooting role, not a separate verified named protagonist.', 'authored-universe-canon', shot('Couverture du poste arcade', 3.8, '#80988b', { shape: 'cone', coneAngle: 40 })),
  intel_duke: duke('The roster-created Intel Operator relays target information for Dynamite Duke’s commando operation; no laser power is attributed.', 'authored-universe-canon', support('Repérage du convoi ennemi', 'buff', '#729ac1', { buffMultiplier: 1.27 })),
  elvira_mistress: elvira('In Mistress of the Dark, Elvira inherits a cookbook whose recipe creates an unruly creature; this support adaptation uses her showmanship, not a fabricated combat spell.', 'canonical-role', support('Réplique de la maîtresse des ténèbres', 'buff', '#c66cb6', { buffMultiplier: 1.25 })),
  gonk_elvira: elvira('Gonk is Elvira’s poodle familiar in Mistress of the Dark; an alert bark provides protection without magical artillery.', 'canonical-role', support('Alerte de Gonk', 'guard', '#7d3c98', { reduce: 0.42 })),
  mansion_handyman: elvira('Macabre Handyman is an explicitly project-created mansion helper, not a claimed named film character; he opens a maintenance exit.', 'authored-universe-canon', support('Issue de service du manoir', 'guard', '#8b6f5a', { reduce: 0.45 })),
  ira_kane: evolution('Ira identifies selenium as toxic to the alien life and organizes the shampoo-based solution; the adaptation rewards scientific coordination.', 'canonical-role', support('Protocole au sulfure de sélénium', 'buff', '#78a499', { buffMultiplier: 1.32 })),
  harry_block: evolution('Harry assists Ira’s investigation and deployment of selenium shampoo against the alien organism; this is practical team preparation.', 'canonical-role', support('Préparation de la solution au sélénium', 'guard', '#b89864', { reduce: 0.52 })),
  wayne_green: evolution('Wayne Grey is an aspiring firefighter who helps deliver the selenium shampoo solution with fire-service equipment.', 'canonical-role', support('Appui du camion de pompiers', 'guard', '#de8750', { reduce: 0.56 })),
  fear_jin_sun_kwon: fear('Jin Sun-Kwon is the F.E.A.R. team medic and performs forensic examination and medical support in the first game.', 'canonical-role', support('Triage de l’équipe F.E.A.R.', 'heal', '#8ab9ae', { healRatio: 0.32 })),
  dogmeat: fallout('Fallout 4: Dogmeat’s companion combat includes biting and holding hostile targets in place.', 'canonical-role', hit('Prise de Dogmeat', 3.6, '#ad8b5e', 125)),
  piper_wright: fallout('Fallout 4: Piper’s Publick Occurrences reporting and Gift of Gab companion identity ground an information-based team buff.', 'canonical-role', support('Publick Occurrences — vérité publiée', 'buff', '#c45c54', { buffMultiplier: 1.27 })),
  preston_garvey: fallout('Fallout 4: Preston uses a laser musket as a Commonwealth Minuteman.', 'canonical-role', beam('Mousquet laser des Minutemen', 4.0, '#66a8d6')),
  boone_fnv: fallout('Fallout: New Vegas: Craig Boone is a former 1st Recon sniper using a scoped hunting rifle and spotting targets.', 'canonical-role', shot('Tir de précision du 1st Recon', 4.5, '#bf695a', { range: 950 })),
  commissaire_juve_fantomas: fantomas('Commissaire Juve coordinates police pursuit of Fantômas; the adapted action is an evacuation cordon, not a supernatural attack.', 'canonical-role', support('Cordon du commissaire Juve', 'guard', '#9a8f75', { reduce: 0.53 })),
  fandor_fantomas: fantomas('Jérôme Fandor is a journalist who investigates Fantômas and uses disguise and ingenuity to gather evidence.', 'canonical-role', support('Enquête sous couverture de Fandor', 'buff', '#688da0', { buffMultiplier: 1.27 })),
  helene_fantomas: fantomas('Hélène is Fandor’s photographer partner; photographic evidence supports the investigation without inventing offensive powers.', 'canonical-role', support('Cliché décisif d’Hélène', 'buff', '#d7ae77', { buffMultiplier: 1.23 })),
  frieren_elf: frieren('Frieren learns and uses humanity’s general offensive magic, Zoltraak, after studying Qual’s original killing magic.', 'canonical-technique', beam('Zoltraak', 4.7, '#c2e5ed', { lineWidth: 58 })),
  fern_mage: frieren('Fern is renowned for exceptionally fast casting of ordinary offensive magic, including Zoltraak barrages.', 'canonical-technique', beam('Zoltraak — incantation accélérée', 4.5, '#b099db', { lineWidth: 40 })),
  stark_warrior: frieren('Stark’s Lightning Strike is a powerful downward axe attack used against formidable monsters.', 'canonical-technique', hit('Lightning Strike', 4.7, '#dc7662', 195)),
  papa_emeritus: ghost('Papa Emeritus is Ghost’s theatrical singer persona; Square Hammer’s refrain becomes musical morale support, not an occult combat power.', 'canonical-role', support('Square Hammer — refrain de Papa', 'buff', '#b3c5cd', { buffMultiplier: 1.3 })),
  nameless_ghoul: ghost('Nameless Ghouls perform Ghost’s instrumental parts; synchronized live accompaniment supports the ensemble.', 'canonical-role', support('Relais instrumental des Nameless Ghouls', 'buff', '#849cb0', { buffMultiplier: 1.25 })),
  sister_imperator: ghost('Sister Imperator directs the fictional Ministry’s operations in Ghost’s narrative chapters; stage organization becomes protection.', 'canonical-role', support('Consignes du Ministère', 'guard', '#a86f87', { reduce: 0.5 })),
  nick_tatopoulos_tas: godzilla('Nick leads H.E.A.T., studies Godzilla and coordinates the team’s responses to mutations; tactical observation is a support effect.', 'canonical-role', support('Coordination H.E.A.T.', 'buff', '#5bafa3', { buffMultiplier: 1.3 })),
  elsie_chapman_tas: godzilla('Elsie Chapman is H.E.A.T.’s paleobiologist; biological analysis supports the team without giving her a monster energy weapon.', 'canonical-role', support('Analyse paléobiologique d’Elsie', 'buff', '#c79a65', { buffMultiplier: 1.26 })),
  guitar_hero_avatar: guitar('Guitar Hero’s Star Power rewards performance streaks and is activated during a song; this adapts its score boost as a team buff.', 'canonical-technique', support('Star Power — solo parfait', 'buff', '#ffc857', { buffMultiplier: 1.35 })),
  judy_nails: guitar('Judy Nails is a playable guitarist; her character-specific special is a performed solo with Star Power, not an electrical attack.', 'canonical-role', support('Solo Star Power de Judy Nails', 'buff', '#e16aa0', { buffMultiplier: 1.28 })),
  axel_steel: guitar('Axel Steel is a playable heavy-metal guitarist; a sustained riff supplies musical support rather than physical damage.', 'canonical-role', support('Riff soutenu d’Axel Steel', 'guard', '#80a1bd', { reduce: 0.48 })),
  cortana: halo('Cortana analyzes Covenant systems, coordinates navigation and provides tactical information to Spartan allies.', 'canonical-role', support('Solution tactique de Cortana', 'buff', '#69cce8', { buffMultiplier: 1.35 })),
  buck_odst: halo('Halo 3: ODST: Buck leads Alpha-Nine and fights with conventional UNSC firearms.', 'canonical-role', shot('Couverture d’Alpha-Nine', 4.0, '#a6b0a9', { shape: 'cone', coneAngle: 35 })),
  kelly_087: halo('Kelly-087 is Blue Team’s exceptionally fast scout; the adaptation uses a fast close-range Spartan assault.', 'canonical-role', hit('Percée rapide de Blue Team', 4.2, '#8cc5b2', 195)),
  linda_058: halo('Linda-058 is Blue Team’s sniper and is associated with the customized SRS99 sniper rifle Nornfang.', 'canonical-role', shot('Nornfang — tir de Linda', 4.7, '#a8b68c', { range: 1000 })),
  ally_mccabe_he: hearteyes('Ally is a survivor of the Heart Eyes attacks; practical escape and mutual trust become defensive support, not fabricated combat powers.', 'canonical-role', support('Itinéraire de fuite d’Ally', 'guard', '#c8788a', { reduce: 0.52 })),
  jay_simmonds_he: hearteyes('Jay helps Ally survive the masked killer’s pursuit; the action represents covering their escape.', 'canonical-role', support('Couverture de la fuite de Jay', 'guard', '#8b9db3', { reduce: 0.54 })),
  monica_he: hearteyes('Monica is Ally’s supportive friend in Heart Eyes; a reassuring call is adapted as morale support without inventing an action-hero role.', 'canonical-role', support('Appel rassurant de Monica', 'buff', '#bd8eae', { buffMultiplier: 1.2 })),
  kevin_mccallister: homealone('Kevin prepares household obstacles and escape routes in the McCallister house; the adaptation protects the team rather than depicting injury.', 'canonical-role', support('Maison préparée de Kevin', 'guard', '#d5a94f', { reduce: 0.6 })),
  old_man_marley: homealone('Marley rescues Kevin at the neighboring house; the special adapts that protective intervention.', 'canonical-role', support('Intervention du vieux Marley', 'guard', '#adb9c4', { reduce: 0.62 })),
  kate_mccallister: homealone('Kate organizes a difficult journey home to Kevin; determination and reunion are represented as team morale.', 'canonical-role', support('Retour à la maison de Kate', 'buff', '#bd785f', { buffMultiplier: 1.25 })),
  manny_iceage: iceage('Manny shields the herd and the human baby using his mammoth size and tusks; protection retains his guardian role.', 'canonical-role', support('Rempart de la harde', 'guard', '#ad7b4c', { reduce: 0.65 })),
  sid_iceage: iceage('Sid brings the mismatched herd together with persistence and companionship; his special is morale support.', 'canonical-role', support('La famille de Sid', 'buff', '#c9a56a', { buffMultiplier: 1.22 })),
  diego_iceage: iceage('Diego’s saber-toothed tiger body and hunting movement ground a close-range pounce, without unrelated elemental attacks.', 'canonical-role', hit('Bond du tigre à dents de sabre', 4.1, '#bb8c59', 180)),
  ichiro_inuyashiki: inuyashiki('Ichiro uses his mechanized body to cure injuries and save people; this special preserves his healing role.', 'canonical-role', support('Réparation vitale d’Ichiro', 'heal', '#8eb9d1', { healRatio: 0.38 })),
  hiro_shishigami: inuyashiki('Hiro’s mechanical body can project invisible lethal force from a finger gesture; the non-graphic adaptation retains that directed firing action.', 'canonical-role', shot('Bang — pointage de Hiro', 4.5, '#6a8faf')),
  mari_inuyashiki: inuyashiki('Mari is Ichiro’s daughter and an aspiring manga artist, not a cyborg fighter; familial recognition provides supportive resolve.', 'canonical-role', support('Reconnaître le courage d’Ichiro', 'buff', '#d496aa', { buffMultiplier: 1.2 })),
  jersey_devil_hostage_rescue: jersey('canonRosterWavePartF.js: activate cage switches and release Jersey City residents; this roster entry is a rescue objective, never an armed sidekick.', 'canonical-role', support('Libération des cages de Jersey City', 'guard', '#f0a36a', { reduce: 0.5 })),
  jersey_devil_police_arrest: jersey('canonRosterWavePartF.js: open the forest laboratory exit so police can arrest Dr. Knarf in the ending; no invented police combat squad.', 'canonical-role', support('Sortie ouverte pour l’arrestation de Knarf', 'guard', '#7f9bc6', { reduce: 0.48 })),
  joker_n52: new52('The New 52 Joker uses theatrical deception and prepared traps; this adaptation uses misdirection instead of borrowing supernatural powers.', 'canonical-role', support('Diversion du clown de Gotham', 'guard', '#a364bc', { reduce: 0.53 })),
  harley_n52: new52('New 52 Harley Quinn uses a large mallet in close combat; the action is a physical swing without imported magical effects.', 'canonical-role', hit('Grand coup de maillet de Harley', 4.2, '#cf5a68', 170, { shape: 'area', areaRadius: 90 })),
  batman_n52: new52('New 52 Batman deploys batarangs, smoke and martial training; a spread of batarangs retains his nonlethal gadget identity.', 'canonical-role', shot('Volée de batarangs de Gotham', 4.1, '#8e9eaf', { shape: 'multi', maxTargets: 3 })),
  sev_killzone: killzone('Killzone 2 / 3: Tomas Sevchenko fights as an ISA rifleman with the M82 assault rifle.', 'canonical-role', shot('Rafale M82 de Sev', 4.1, '#9d9f8a', { shape: 'cone', coneAngle: 32 })),
  rico_killzone: killzone('Killzone 2 / 3: Rico Velasquez supports ISA assaults with heavy automatic weapons such as the M224-A1 light machine gun.', 'canonical-role', shot('Suppression à la M224-A1', 4.3, '#b39a67', { shape: 'cone', coneAngle: 43 })),
  echo_killzone: killzone('Killzone: Shadow Fall: Echo is a Helghast intelligence operative and sniper; this uses her precision-rifle role.', 'canonical-role', shot('Tir d’observation d’Echo', 4.4, '#b95e62', { range: 950 })),
  professor_casa: casa('The Professor coordinates the heists through contingency planning and radio instructions; tactical planning becomes a team buff.', 'canonical-role', support('Plan de repli du Professeur', 'buff', '#8b9f93', { buffMultiplier: 1.35 })),
  tokyo_casa: casa('Tokyo participates in armed resistance during the heists; her special uses conventional rifle cover rather than a magical blast.', 'canonical-role', shot('Rafale de couverture de Tokyo', 4.0, '#d25c58', { shape: 'cone', coneAngle: 38 })),
  nairobi_casa: casa('Nairobi organizes printing, production and team discipline during the heists; her rallying command is a morale action.', 'canonical-role', support('L’équipe au travail de Nairobi', 'buff', '#d99d5a', { buffMultiplier: 1.28 })),
  riley_denbo_lotd: land('Riley commands the armored Dead Reckoning and uses its equipment to protect a civilian extraction.', 'canonical-role', support('Extraction à bord de Dead Reckoning', 'guard', '#739197', { reduce: 0.65 })),
  slack_lotd: land('Slack fights to survive and joins Riley’s escape group; the adaptation emphasizes guiding survivors through the city.', 'canonical-role', support('Passage dégagé par Slack', 'guard', '#c6947b', { reduce: 0.52 })),
  charlie_lotd: land('Charlie is Riley’s loyal companion and an unusually accurate rifle shot.', 'canonical-role', shot('Tir précis de Charlie', 4.1, '#bc9c71', { range: 900 })),
  municipal_agent_fiel: fiel('The municipal-worker sketches center on routine duties, conversation and comic avoidance of work; a scheduled break is supportive, never a weapon.', 'canonical-role', support('Pause réglementaire du service', 'cleanse', '#b0a674')),
  brigadier_fiel: fiel('The project’s Brigadier Municipal is a sketch-role adaptation of municipal supervision, not a canon action fighter.', 'authored-universe-canon', support('Répartition des équipes municipales', 'buff', '#9a9a79', { buffMultiplier: 1.2 })),
  mairie_fiel: fiel('The roster’s Mairie Clerk represents municipal paperwork in the comedy setting; opening the right administrative route supplies protection.', 'authored-universe-canon', support('Dossier municipal enfin validé', 'guard', '#bd9778', { reduce: 0.43 })),
  visiteur_futur: visiteur('The Visitor travels back to prevent disastrous chains of events and warns Raph about their consequences.', 'canonical-role', support('Voilà ce qui va se passer', 'guard', '#a79b74', { reduce: 0.62 })),
  raph_visiteur: visiteur('Raph’s everyday choices trigger the Visitor’s interventions; accepting the warning is adapted as defensive cooperation.', 'canonical-role', support('Choisir une autre conséquence', 'guard', '#85a1ad', { reduce: 0.48 })),
  constance_visiteur: visiteur('Constance belongs to the time-travel story’s human group; this conservative adaptation uses shared future information, not an invented time weapon.', 'canonical-role', support('Mise en commun des avertissements', 'buff', '#c38f9c', { buffMultiplier: 1.22 })),
  chester_lp: linkin('Chester Echo is the project’s vocal tribute persona; sustained singing and expressive vocal contrast provide concert morale only.', 'authored-universe-canon', support('In the End — reprise vocale', 'buff', '#d8a15d', { buffMultiplier: 1.3 })),
  mike_lp: linkin('Mike Signal adapts Mike Shinoda’s rap, keyboard and production roles as musical synchronization, without fictional offensive powers.', 'canonical-role', support('Placement rap et clavier', 'buff', '#85a6be', { buffMultiplier: 1.26 })),
  mr_hahn_lp: linkin('Linkin Park’s turntablist Joe Hahn contributes scratching and sampled transitions; a turntable relay supports musical timing.', 'canonical-role', support('Transition aux platines de Mr. Hahn', 'cleanse', '#a4a0c8')),
  magic_jack_ginolin: magicjack('requestedUniverseWave.js identifies MagiC JacK as Ginolin’s polymorphic alien satire persona; changing viewpoint exposes a contradiction rather than firing a magic beam.', 'canonical-role', support('Réquisitoire polymorphe', 'cleanse', '#f05765')),
  max_rage_ginolin: magicjack('requestedUniverseWave.js anchors Max Rage in a confrontational concert performance with a microphone; the effect is musical resolve, not invented violence.', 'canonical-role', support('Réquisitoire du concert Max Rage', 'buff', '#d75a5a', { buffMultiplier: 1.3 })),
  sapiens_witness: magicjack('Sapiens Witness is the project’s observer in the La Minute Sapiens tribunal, using recorded testimony rather than a fictitious canonical weapon.', 'authored-universe-canon', support('Témoignage de La Minute Sapiens', 'guard', '#9db5b3', { reduce: 0.5 })),
  byron_mars: mars('Byron is a former boxer who fights Martian invaders to help others escape; the adaptation uses a conventional boxing combination.', 'canonical-role', hit('Enchaînement de boxe de Byron', 4.0, '#bc8653', 145)),
  ritchie_mars: mars('Richie discovers that Slim Whitman’s Indian Love Call stops the Martians; the roster adapts playing the recording as support, not an indiscriminate sonic weapon.', 'canonical-role', support('Disque de Slim Whitman', 'guard', '#b9b879', { reduce: 0.56 })),
  nathalie_mars: mars('Nathalie Lake is a television presenter caught in the Martian invasion; composure in a crisis is represented as morale, without an invented combat profession.', 'canonical-role', support('Garder le contact à l’antenne', 'buff', '#ce96ab', { buffMultiplier: 1.2 })),
  kael_venn: meridien('MERIDIEN_HEROES: kael_refund / Full Refund returns accumulated delay as a chain of rapid attacks with Kael’s paired minute-blades.', 'authored-universe-canon', hit('Remboursement total', 4.5, '#ffb347', 185, { shape: 'multi', maxTargets: 3 })),
  ysolde_quarz: meridien('MERIDIEN_HEROES: ysolde_clean_cut / Clean Cut severs a hostile effect from its original timestamp using chronal sutures.', 'authored-universe-canon', support('Coupe nette', 'cleanse', '#67f0ff')),
  bramm_treize: meridien('MERIDIEN_HEROES: bramm_void_invoice / Void Invoice destroys temporal taxes affecting the squad; the effect removes hostile conditions.', 'authored-universe-canon', support('Facture annulée', 'cleanse', '#d6c6a4')),
  metal_hellsinger_stolen_voice: hellsinger('The Unknown seeks her stolen voice; this roster entry represents the recovered musical objective, not a second armed demon character.', 'canonical-role', support('Retrouver la voix de l’Unknown', 'buff', '#dc7868', { buffMultiplier: 1.3 })),
  kevin_minions: minions('Kevin leads Stuart and Bob in finding a new master and ultimately protects them; leadership becomes a team buff.', 'canonical-role', support('En route avec Kevin', 'buff', '#f3d34e', { buffMultiplier: 1.24 })),
  stuart_minions: minions('Stuart’s interest in guitar and his musical performance are established in Minions; the action is a friendly guitar break.', 'canonical-role', support('Interlude de guitare de Stuart', 'cleanse', '#e5c75e')),
  bob_minions: minions('Bob’s affection, his teddy bear Tim and his disarming friendliness define his supportive role; no weapon is invented.', 'canonical-role', support('Tim et le courage de Bob', 'guard', '#edcf62', { reduce: 0.46 })),
  shinji_ikari: eva('EVA-01 protects itself with an A.T. Field and engages Angels at close range; this action isolates the defensive field rather than implying a different Evangelion continuity.', 'canonical-role', support('A.T. Field de l’EVA-01', 'guard', '#a783c7', { reduce: 0.7 })),
  asuka_langley: eva('Asuka pilots EVA-02 and uses its Progressive Knife against Angels in the 1995 television series.', 'canonical-role', hit('Progressive Knife de l’EVA-02', 4.7, '#d95851', 205)),
  rei_ayanami: eva('Operation Yashima: Rei’s EVA-00 shields EVA-01 from Ramiel’s return fire with a heat-resistant shield.', 'canonical-role', support('Bouclier de l’opération Yashima', 'guard', '#9bcbd7', { reduce: 0.72 })),
  sparadrap_noob: noob('Sparadrap plays a priest in Horizon and repeatedly heals his companions; the special preserves that healing class role.', 'canonical-role', support('Grand soin de Sparadrap', 'heal', '#b7dce6', { healRatio: 0.34 })),
  gloglo_noob: noob('This historical local ID represents Gaea, a calculating Horizon player; tactical exploitation and planning are retained as support rather than assigning an unverified spell or class specialization.', 'canonical-role', support('Plan intéressé de Gaea', 'buff', '#a57bc6', { buffMultiplier: 1.28 })),
  omega_zell_noob: noob('Omega Zell plays an assassin in Horizon; this action adapts a stealthy close-range blade sequence without inventing a named web-series technique.', 'canonical-role', hit('Enchaînement de l’assassin d’Horizon', 4.2, '#b95d65', 160)),
  ainz_overlord: overlord('Ainz casts the super-tier spell Fallen Down against Shalltear; the adaptation retains its large radiant area attack.', 'canonical-technique', area('Fallen Down', 'holy_aoe', 5.0, '#dce9ff', { areaRadius: 190 })),
  albedo_overlord: overlord('Albedo is Nazarick’s tank-oriented guardian overseer, defending allies with her armor and great defensive strength.', 'canonical-role', support('Rempart de la gardienne de Nazarick', 'guard', '#c2a2d8', { reduce: 0.72 })),
  demiurge_overlord: overlord('Demiurge employs demonic fire and acts as Nazarick’s strategist; the offensive adaptation uses his infernal fire affinity without asserting an unverified spell title.', 'canonical-role', area('Mur de flammes infernales de Demiurge', 'fire_aoe', 4.4, '#d87950', { areaRadius: 150 })),
  chains_pd: payday('Chains is PAYDAY 2’s enforcer persona and provides heavy firearms cover for the crew.', 'canonical-role', shot('Couverture lourde de Chains', 4.2, '#c6ab7b', { shape: 'cone', coneAngle: 46 })),
  houston_pd: payday('Houston is associated with PAYDAY 2’s Crook perk deck, not Clover’s Burglar deck; his evasive heist role is adapted as short protection during extraction.', 'canonical-role', support('Extraction silencieuse de Houston', 'guard', '#93ae98', { reduce: 0.55 })),
  clover_pd: payday('Clover’s infiltrator and burglar presentation supports mask-on heist coordination; this special creates a safe crew approach.', 'canonical-role', support('Approche discrète de Clover', 'guard', '#a9bd83', { reduce: 0.53 })),
  bain_pd: payday('Bain guides the crew over the radio, tracks objectives and provides mission information; he remains a coordinator.', 'canonical-role', support('Instructions radio de Bain', 'buff', '#a3b6c4', { buffMultiplier: 1.33 })),
  peepoodo_safe_peepoodo_safe_mascot: peepoodo('The project’s safe mascot adaptation teaches boundaries and cooperation; it does not import adult source scenes or invented weapons.', 'authored-universe-canon', support('Écouter et respecter les limites', 'guard', '#a9ce77', { reduce: 0.45 })),
  peepoodo_safe_evelyn_safe_mascot: peepoodo('Evelyn’s safe educational roster role supports respectful communication and group reassurance, without sexualized or combat material.', 'authored-universe-canon', support('Parole bienveillante d’Evelyn', 'cleanse', '#d79ac0')),
  peepoodo_safe_kevin_safe_mascot: peepoodo('Kevin’s safe educational roster role helps the group cooperate and ask for assistance; the action is supportive play.', 'authored-universe-canon', support('Demander de l’aide ensemble', 'buff', '#e0bb72', { buffMultiplier: 1.2 })),
  anna_predator: predator('Predator (1987): Anna recognizes the hunter’s behavior and helps the survivors understand when it will attack.', 'canonical-role', support('Avertissement d’Anna sur le chasseur', 'guard', '#b8a37a', { reduce: 0.54 })),
  billy_predator: predator('Predator (1987): Billy Sole is the squad’s tracker; following signs in the jungle supplies reconnaissance.', 'canonical-role', support('Piste relevée par Billy', 'buff', '#9da274', { buffMultiplier: 1.27 })),
  mac_predator: predator('Predator (1987): Mac Eliot uses the M60 during the squad’s sustained fire into the jungle.', 'canonical-role', shot('Couverture à la M60 de Mac', 4.2, '#99865f', { shape: 'cone', coneAngle: 45 })),
  harrigan_predator: predator('Predator 2 (1990): Harrigan ultimately uses the City Hunter’s smart disc in close combat; this roster entry selects that film action.', 'canonical-role', hit('Contre au disque du chasseur', 4.4, '#bc9d6c', 165)),
  greyback_yautja: predator('Predator 2 (1990): the elder gives Harrigan the antique pistol after recognizing his victory; the adapted special is a recognition buff, not an invented elder weapon feat.', 'canonical-role', support('Reconnaissance du clan de Greyback', 'buff', '#bca877', { buffMultiplier: 1.3 })),
  harrigan_p2: predator2('Harrigan fights the City Hunter aboard the alien ship and turns the smart disc against it.', 'canonical-role', hit('Riposte au smart disc', 4.5, '#ad9367', 170)),
  city_hunter_p2: predator2('The City Hunter’s combistick is the telescoping spear used during its Los Angeles hunt.', 'canonical-role', hit('Déploiement de la combistick', 4.6, '#c7b184', 215)),
  keyes_p2: predator2('Peter Keyes plans a refrigerated slaughterhouse ambush to reduce the hunter’s thermal advantage; the adaptation is tactical preparation.', 'canonical-role', support('Protocole thermique de Keyes', 'guard', '#93bac3', { reduce: 0.57 })),
  naru_prey: prey('Naru’s corded hatchet lets her retrieve the weapon and improvise attacks during the Feral Predator hunt.', 'canonical-role', shot('Hachette à corde de Naru', 4.2, '#bc925e', { range: 500 })),
  taabe_prey: prey('Taabe is an experienced Comanche hunter who attacks the Predator with his spear while riding.', 'canonical-role', hit('Charge à la lance de Taabe', 4.3, '#c09b68', 215)),
  feral_predator: prey('The Feral Predator deploys a retractable forearm shield and combistick; this action uses the spear’s physical reach.', 'canonical-role', hit('Estoc de la combistick féroce', 4.6, '#bbac7e', 220)),
  putt_putt_putt_putt_purple_car: puttputt('Putt-Putt solves problems by helping neighbors, collecting useful items and opening routes; a friendly escort is support, never a vehicle attack.', 'canonical-role', support('Putt-Putt ouvre la bonne route', 'guard', '#a17ec7', { reduce: 0.46 })),
  putt_putt_pep_brown_puppy: puttputt('Pep is Putt-Putt’s brown puppy companion; a friendly alert helps the adventure party without giving Pep weapons.', 'canonical-role', support('Alerte amicale de Pep', 'guard', '#b28a5f', { reduce: 0.4 })),
  putt_putt_rover_moon_rover: puttputt('Putt-Putt Goes to the Moon: Rover is the lunar rover who helps Putt-Putt and Pep return home.', 'canonical-role', support('Rover prépare le retour de la Lune', 'buff', '#8ab3c8', { buffMultiplier: 1.22 })),
  herbert_west: reanimator('Herbert West’s reagent reanimates dead bodies in the film; the game’s limited revive is an explicit medical-horror adaptation, not a claim of a safe canonical cure.', 'canonical-role', support('Réactif expérimental de West', 'revive', '#7cdd86', { shape: 'single', reviveRatio: 0.28 })),
  dan_cain: reanimator('Dan Cain is a medical student working in hospital care; basic medical stabilization is retained as healing support.', 'canonical-role', support('Stabilisation médicale de Dan Cain', 'heal', '#92c7c1', { healRatio: 0.3 })),
  megan_halsey: reanimator('Megan Halsey is a person caught in the hospital crisis, not an occult combat specialist; mutual reassurance provides support.', 'canonical-role', support('Soutien de Megan à l’hôpital', 'buff', '#d7a1b1', { buffMultiplier: 1.2 })),
  birdperson: rickmorty('Birdperson is an armed resistance veteran with functional wings; this special adapts his aerial combat movement.', 'canonical-role', shot('Appui aérien de Birdperson', 4.2, '#b7a787', { shape: 'multi', maxTargets: 2 })),
  beth_smith: rickmorty('Beth is a horse surgeon; a veterinary emergency-care adaptation supplies healing without importing Space Beth’s combat identity.', 'canonical-role', support('Soins d’urgence de Beth', 'heal', '#c99e83', { healRatio: 0.28 })),
  mr_meeseeks: rickmorty('Meeseeks and Destroy: Meeseeks is summoned to complete a specified task and cooperate with other Meeseeks; the action assists an objective.', 'canonical-role', support('Je suis Monsieur Meeseeks, je vous aide', 'buff', '#69cde1', { buffMultiplier: 1.26 })),
  frank_n_furter: rockyhorror('Frank-N-Furter presents Sweet Transvestite and directs the floor show; the adaptation uses theatrical performance as morale, without depicting adult material.', 'canonical-role', support('Floor Show — entrée de Frank', 'buff', '#c96d9c', { buffMultiplier: 1.28 })),
  janet_rhps: rockyhorror('Janet participates in the film’s musical numbers and the floor show; an ensemble refrain supplies supportive timing.', 'canonical-role', support('Refrain de Janet au Floor Show', 'cleanse', '#e6bcc6')),
  rocky_rhps: rockyhorror('Rocky is introduced through The Sword of Damocles and participates in the floor show; the action uses stage movement as support.', 'canonical-role', support('The Sword of Damocles — reprise', 'buff', '#e8ce84', { buffMultiplier: 1.23 })),
  kenshin_himura: kenshin('Kenshin’s Amakakeru Ryū no Hirameki is the ultimate Hiten Mitsurugi-ryū battōjutsu technique, used with his reverse-blade sword.', 'canonical-technique', hit('Amakakeru Ryū no Hirameki', 4.9, '#d47c7c', 195)),
  kaoru_kamiya: kenshin('Kaoru teaches Kamiya Kasshin-ryū with a bokken and its principle of the sword that protects life.', 'canonical-role', hit('Bokken du Kamiya Kasshin-ryū', 3.8, '#8caed1', 170)),
  sanosuke_sagara: kenshin('Sanosuke learns Futae no Kiwami from Anji; the double-impact fist is his established technique.', 'canonical-technique', hit('Futae no Kiwami', 4.6, '#d9bb8a', 145)),
  seaman_oracle: seaman('Seaman’s core interaction is spoken conversation, questions and responses to aquarium care; a conversational prompt is supportive, not a spell.', 'canonical-role', support('Question du pensionnaire de l’aquarium', 'buff', '#8fc4b6', { buffMultiplier: 1.2 })),
  aquarium_keeper: seaman('The player’s caretaker role maintains tank temperature, oxygen and feeding; this adapts aquarium maintenance as recovery.', 'canonical-role', support('Réglage de l’oxygène et de la température', 'heal', '#85c8d0', { healRatio: 0.24 })),
  frogman_seaman: seaman('Seaman’s creature develops into an amphibious Frogman stage; the project’s Frogman Echo uses that life-stage cue for safe-route support.', 'canonical-role', support('Repère de la rive du Frogman', 'guard', '#86ac8a', { reduce: 0.42 })),
  shadow_man_mama_nettie: shadowman('Mama Nettie is the voodoo priestess who guides Michael LeRoi and binds the Mask of Shadows to him; guidance and protection are adapted conservatively.', 'canonical-role', support('Conseil vaudou de Mama Nettie', 'guard', '#bd8dba', { reduce: 0.6 })),
  shadow_man_jaunty: shadowman('Jaunty guards the entrance to Deadside and offers guidance to Shadow Man; route knowledge becomes tactical support.', 'canonical-role', support('Passage sûr vers Deadside', 'buff', '#b7c078', { buffMultiplier: 1.24 })),
  fin_sharknado: sharknado('Fin Shepard uses a chainsaw against airborne sharks in Sharknado; the adaptation retains that tool as a clean close-range game strike.', 'canonical-role', hit('Percée à la tronçonneuse de Fin', 4.4, '#9bafb9', 175)),
  april_sharknado: sharknado('Later Sharknado films give April a powered prosthetic arm with a chainsaw attachment; the record explicitly selects that equipment-bearing incarnation.', 'canonical-role', hit('Contre de la prothèse d’April', 4.2, '#c9a3a3', 170)),
  nova_sharknado: sharknado('Nova becomes a practiced shark-fighting survivor and uses firearms to defend the group.', 'canonical-role', shot('Couverture anti-requins de Nova', 4.0, '#c49b75', { shape: 'cone', coneAngle: 38 })),
  kate_slender: slender('Slender: The Arrival: Kate’s notes document her struggle with Slender Man and later fate as the Chaser; this record uses her warnings rather than inventing attack magic.', 'canonical-role', support('Avertissement laissé par Kate', 'guard', '#9fa6b3', { reduce: 0.5 })),
  lauren_slender: slender('Lauren explores with a camera and flashlight and activates generators while seeking Kate; observation and escape provide support.', 'canonical-role', support('Itinéraire aux générateurs de Lauren', 'guard', '#d2bb83', { reduce: 0.54 })),
  charlie_slender: slender('Charlie Matheson Jr.’s disappearance and apparitions belong to The Arrival’s Oakside story; a clue-based support avoids making the missing child an armed fighter.', 'canonical-role', support('Indice retrouvé d’Oakside', 'buff', '#afa7b9', { buffMultiplier: 1.2 })),
  simen_spermageddon: spermageddon('The project represents Simen’s perseverance as an abstract nonsexual race objective; maintaining pace is support rather than an invented attack.', 'canonical-role', support('Garder le cap de la course', 'buff', '#b7d9da', { buffMultiplier: 1.2 })),
  cumilla_spermageddon: spermageddon('Cumilla’s race partnership is adapted through nonsexual encouragement and synchronized progress only.', 'canonical-role', support('Avancer ensemble avec Cumilla', 'guard', '#d4b6d2', { reduce: 0.43 })),
  body_guard_cell: spermageddon('Body Guard Cell is the project’s abstract protective race-role mascot, not a claimed named biological attack from the film.', 'authored-universe-canon', support('Balisage protecteur du parcours', 'guard', '#9fcec5', { reduce: 0.5 })),
  spoof_survivor: spoof('Ashtray, called Cendar in the French localization, is the comedy’s protagonist; resourcefulness and avoiding neighborhood trouble become support.', 'canonical-role', support('Sortie de quartier de Cendar', 'guard', '#bd9c77', { reduce: 0.47 })),
  parody_detective: spoof('Loc Dog is Ashtray’s cousin, not a detective; the roster’s old class label is ignored and the action uses his comic group bravado.', 'canonical-role', support('Fanfaronnade de Loc Dog', 'buff', '#b8955d', { buffMultiplier: 1.23 })),
  slapstick_fighter: spoof('Preach is part of Ashtray’s neighborhood circle; conversational solidarity is adapted without inventing martial arts or supernatural powers.', 'canonical-role', support('Conseil de quartier de Preach', 'buff', '#b9aa85', { buffMultiplier: 1.2 })),
  loid_forger: spy('Twilight’s spycraft combines rapid disguise changes and mission planning; this special creates an escape cover for Operation Strix.', 'canonical-role', support('Couverture de Twilight', 'guard', '#91b39f', { reduce: 0.6 })),
  yor_forger: spy('Yor’s Thorn Princess assassin identity uses extraordinary physical strength and paired stiletto-like weapons in close combat.', 'canonical-role', hit('Assaut de Thorn Princess', 4.7, '#c65f70', 180)),
  anya_forger: spy('Anya reads nearby thoughts and silently uses that information to help her family; telepathy supplies tactical information without offensive psychic attacks.', 'canonical-role', support('Pensées entendues par Anya', 'buff', '#e9b1c6', { buffMultiplier: 1.28 })),
  bond_spy: spy('Bond’s precognition lets Anya see possible danger through his thoughts; his special warns and protects the family.', 'canonical-role', support('Vision d’alerte de Bond', 'guard', '#e0ddd2', { reduce: 0.58 })),
  fiona_spy: spy('Fiona Frost, codename Nightfall, supports WISE operations through disciplined undercover work; this is professional spy coordination.', 'canonical-role', support('Appui discret de Nightfall', 'buff', '#b9c9d1', { buffMultiplier: 1.29 })),
  yuri_spy: spy('Yuri Briar is an SSS officer who uses surveillance and interrogation; this adaptation is watchful perimeter protection, not a supernatural technique.', 'canonical-role', support('Surveillance du périmètre par Yuri', 'guard', '#a5a6b1', { reduce: 0.51 })),
  stan_helsing: stanhelsing('Stan survives the monster-parody confrontation through improvised cooperation rather than possessing a canonical arsenal of vampire spells.', 'canonical-role', support('Improvisation de Stan contre les monstres', 'guard', '#aa8d6b', { reduce: 0.52 })),
  nadine_helsing: stanhelsing('Nadine is part of the friends trapped in the monster-filled town; mutual support is retained instead of inventing combat magic.', 'canonical-role', support('Les amis restent groupés', 'buff', '#d6a1b5', { buffMultiplier: 1.21 })),
  teddy_helsing: stanhelsing('Teddy’s comic friendship and cooperation help the group face its horror-parody ordeal; the effect is confidence, not an invented weapon.', 'canonical-role', support('Assurance de Teddy', 'buff', '#b8a07a', { buffMultiplier: 1.22 })),
  gus_bonner: infinity('Gus Bonner commands the Stargate Infinity team during its journey through the gate network.', 'canonical-role', support('Ordre de repli de Gus Bonner', 'guard', '#b4ad7b', { reduce: 0.58 })),
  stacey_bonner: infinity('Stacey Bonner is a trained member of Gus’s team, supporting field operations and safe gate travel; this adapts disciplined cover.', 'canonical-role', shot('Couverture de l’équipe Infinity', 3.8, '#c3aa82')),
  ecgab_infinity: infinity('Ecgab is the local catalog’s alien-guide role; the identity is not established as a canonical Stargate Infinity character. This authored guidance shares directions without claiming telepathy or identifying the entry as Ec’co.', 'authored-universe-canon', support('Conseils du guide Ecgab du catalogue', 'buff', '#9ec8b5', { buffMultiplier: 1.26 })),
  axel_sor: rage('Streets of Rage 2: Axel’s Grand Upper is his forward uppercut special attack.', 'canonical-technique', hit('Grand Upper', 4.4, '#d7ad70', 155)),
  blaze_sor: rage('Streets of Rage 2: Blaze’s Kikou Shou is her forward palm-strike special, a close-range action rather than a long-distance beam.', 'canonical-technique', hit('Kikou Shou', 4.3, '#d66c78', 160)),
  adam_sor: rage('Streets of Rage 4: Adam’s Sword Upper is his rising physical special attack.', 'canonical-technique', hit('Sword Upper', 4.4, '#d5b85a', 165)),
  kirito_sao: sao('Aincrad: Starburst Stream is Kirito’s sixteen-hit Dual Blades sword skill.', 'canonical-technique', hit('Starburst Stream', 4.9, '#93bad6', 185)),
  asuna_sao: sao('Aincrad: Linear is a one-handed rapier thrust skill used by Asuna; this uses the established rapier system rather than unrelated magic.', 'canonical-technique', hit('Linear — estoc de l’Éclair', 4.3, '#d9b6b2', 185)),
  klein_sao: sao('Klein uses the curved-blade katana skill tree and leads Fuurinkazan; a katana sequence is a role-based adaptation rather than an unverified skill title.', 'canonical-role', hit('Enchaînement au katana de Fuurinkazan', 4.1, '#c78966', 180)),
  robin_tt: titans('Robin in the 2003 animated series uses a collapsible staff, acrobatics and nonlethal gadgets.', 'canonical-role', hit('Enchaînement au bâton de Robin', 4.1, '#d4b55c', 185, { shape: 'area', areaRadius: 95 })),
  cyborg_tt: titans('Cyborg’s arm transforms into a sonic cannon in the 2003 Teen Titans series.', 'canonical-role', beam('Sonic Cannon de Cyborg', 4.5, '#7eb8dd', { lineWidth: 65 })),
  raven_tt: titans('Raven uses the Azarath Metrion Zinthos incantation to focus her empathic and telekinetic powers; this adapts a defensive barrier.', 'canonical-role', support('Azarath Metrion Zinthos — barrière', 'guard', '#a18bd1', { reduce: 0.65 })),
  amazing_patate_show_la_petite_patate: patate('The roster’s La Petite Patate remains a friendly noncombat show participant; greeting the ensemble supplies supportive morale.', 'authored-universe-canon', support('Bonjour de la Petite Patate', 'buff', '#d4ba7c', { buffMultiplier: 1.2 })),
  amazing_patate_show_la_patate_musicienne: patate('La Patate Musicienne’s explicitly musical roster role is represented through a friendly instrumental refrain, not a sonic weapon.', 'authored-universe-canon', support('Refrain de la Patate Musicienne', 'buff', '#dba56e', { buffMultiplier: 1.23 })),
  amazing_patate_show_la_patate_danseuse: patate('La Patate Danseuse’s noncombat show role uses synchronized dance and encouragement, without inventing a fighting style.', 'authored-universe-canon', support('Pas synchronisés de la Patate Danseuse', 'guard', '#cfa08e', { reduce: 0.42 })),
  arkin_collector: collector('The Collector: Arkin studies the house’s lethal traps and helps a child escape; a safe-route plan preserves his burglar-survivor role.', 'canonical-role', support('Désamorcer l’itinéraire du Collecteur', 'guard', '#9d9f90', { reduce: 0.59 })),
  elena_collector: collector('The Collection: Elena survives captivity and uses observation to escape the Collector’s facility.', 'canonical-role', support('Repérer une issue avec Elena', 'guard', '#c3a1a0', { reduce: 0.52 })),
  lucello_collector: collector('The Collection: Lucello leads the extraction team into the Collector’s building; defensive coordination retains his rescue role.', 'canonical-role', support('Formation d’extraction de Lucello', 'guard', '#929f9b', { reduce: 0.6 })),
  batman_tdk: darkknight('The Dark Knight: Batman uses sonar-assisted detection and martial close fighting; this record selects a nonlethal disarming combination.', 'canonical-role', hit('Désarmement du Chevalier noir', 4.2, '#9daab8', 165)),
  jim_gordon_tdk: darkknight('Gordon coordinates GCPD operations and evacuations in The Dark Knight; a police cordon is represented as protection.', 'canonical-role', support('Périmètre de sûreté de Gordon', 'guard', '#99a7a5', { reduce: 0.59 })),
  lucius_fox_tdk: darkknight('Lucius Fox operates Wayne Enterprises technology and guides Batman through the sonar system during the hostage rescue.', 'canonical-role', support('Guidage technique de Lucius Fox', 'buff', '#b8b19c', { buffMultiplier: 1.31 })),
  aragorn_lotr: rings('The Return of the King: Aragorn fights with the reforged sword Andúril; this action keeps his physical swordsmanship.', 'canonical-role', hit('Taille d’Andúril', 4.5, '#a9b3ac', 185)),
  gandalf_lotr: rings('The Fellowship of the Ring: Gandalf bars the Balrog at the bridge of Khazad-dûm with staff and sword; the adaptation is a protective stand.', 'canonical-role', support('Vous ne passerez pas', 'guard', '#d7ded8', { reduce: 0.72 })),
  legolas_lotr: rings('Legolas’s rapid bow shots are repeatedly shown in the film trilogy; a limited volley preserves his elven archery.', 'canonical-role', shot('Volée d’archer de la Forêt Noire', 4.2, '#b7cc98', { shape: 'multi', maxTargets: 3, range: 900 })),
  gimli_lotr: rings('Gimli fights with dwarven axes at close range, including the defense of Balin’s tomb.', 'canonical-role', hit('Coup de hache de la salle de Mazarbul', 4.4, '#c79c6b', 165, { shape: 'area', areaRadius: 90 })),
  quinn_predator: thepredator('Quinn McKenna is an Army sniper; precision rifle cover reflects his established military role.', 'canonical-role', shot('Tir de couverture de McKenna', 4.3, '#93a488', { range: 950 })),
  casey_predator: thepredator('Casey Bracket is an evolutionary biologist studying the Predator; biological assessment supports the group without inventing alien weapon mastery.', 'canonical-role', support('Analyse évolutive de Casey', 'buff', '#b2c2ad', { buffMultiplier: 1.28 })),
  fugitive_predator: thepredator('The Fugitive Predator possesses wrist blades and conventional Yautja hunting equipment; the action uses a physical wrist-blade strike.', 'canonical-role', hit('Riposte aux lames de poignet', 4.5, '#a9b297', 175)),
  texas_chain_saw_franklin: texas('canonRosterWavePartM.js marks Franklin as a noncombat survivor who signals the safe route and unlocks the roadside exit; no firearm or fighting power is assigned.', 'canonical-role', support('Signalement de la sortie routière', 'guard', '#bcb292', { reduce: 0.47 })),
  truman_show_truman_burbank: truman('Truman observes continuity errors, sails across the studio ocean and reaches the exit door; his determination becomes protective resolve.', 'canonical-role', support('Atteindre la porte de Seahaven', 'guard', '#bc553f', { reduce: 0.55 })),
  truman_show_sylvia_lauren_garland: truman('Sylvia tries to reveal the truth to Truman and advocates his freedom outside the show; testimony strengthens allies.', 'canonical-role', support('Sylvia révèle la mise en scène', 'buff', '#df7862', { buffMultiplier: 1.25 })),
  truman_show_marlon: truman('Marlon is Truman’s scripted friend and delivers reassuring conversations; this adapts the on-screen reassurance without claiming magic or combat.', 'canonical-role', support('Conversation sur le pont de Seahaven', 'guard', '#99321c', { reduce: 0.44 })),
  jack_cooper_tf2: titanfall('Titanfall 2 campaign: Cooper’s pilot jump kit supports wall-running flanks and conventional rifle fire.', 'canonical-role', shot('Flanc du pilote au jump kit', 4.2, '#55d8ff', { shape: 'multi', maxTargets: 2 })),
  bt_7274_tf2: titanfall('BT-7274’s Expedition loadout includes the XO-16 automatic cannon and Burst Core; the named core is its sustained automatic barrage.', 'canonical-technique', shot('Burst Core — XO-16', 4.9, '#78fbff', { shape: 'cone', coneAngle: 45 })),
  sarah_briggs_tf2: titanfall('Sarah Briggs commands the Militia Marauder Corps and coordinates its Titan assault during Trial by Fire.', 'canonical-role', support('Ordres du Marauder Corps', 'buff', '#32b5dc', { buffMultiplier: 1.34 })),
  torbahead_torbahead_reel_persona: torbahead('canonRosterWavePartM.js restricts this adaptation to public greetings, audio timing and reel accessories; a greeting loop gives morale with no private identity or combat.', 'canonical-role', support('Boucle de salutation publique', 'buff', '#bc553f', { buffMultiplier: 1.2 })),
  torbahead_daily_greeting_caption: torbahead('The public-format adaptation synchronizes greeting captions to the audio cue; this is a noncombat timing aid.', 'authored-universe-canon', support('Sous-titre de salutation synchronisé', 'cleanse', '#df7862')),
  torbahead_community_remix_curator: torbahead('The project’s Community Remix Curator organizes public loop transitions and shared remixes; no supposed private likeness or offensive ability is introduced.', 'authored-universe-canon', support('Raccord du remix communautaire', 'buff', '#99321c', { buffMultiplier: 1.22 })),
  sweet_tooth_tm: twisted('Twisted Metal (2012): Sweet Tooth’s ice-cream truck transforms into a mechanical combat form; this explicitly selects that game incarnation.', 'canonical-role', area('Transformation mécanique de Sweet Tooth', 'explosion', 4.8, '#ff3f2f', { areaRadius: 155 })),
  outlaw_tm: twisted('Twisted Metal (1995): Outlaw’s special is an electric taser discharge from the police vehicle; this record selects the original game.', 'canonical-technique', area('Outlaw Taser', 'electric_aoe', 4.3, '#ff6252', { areaRadius: 125 })),
  roadkill_tm: twisted('Twisted Metal 2: Roadkill’s special is the boomerang missile; charging and timing distinguish it from a generic explosion.', 'canonical-technique', shot('Boomerang Missile de Roadkill', 4.4, '#dc1c0c', { range: 850 })),
  doug_velocipastor: velocipastor('Pastor Doug Jones transforms into a dinosaur and physically fights the antagonists; the action uses that story-specific transformation.', 'canonical-role', hit('Assaut du pasteur vélociraptor', 4.4, '#6c8a4b', 185)),
  carol_velocipastor: velocipastor('Carol helps Doug understand and use his transformation; her supportive partnership is retained rather than inventing a magical or medical power.', 'canonical-role', support('Carol guide le pasteur', 'buff', '#c45b5b', { buffMultiplier: 1.24 })),
  frankie_velocipastor: velocipastor('Frankie Mermaid is a criminal figure in Doug and Carol’s story; theatrical intimidation is adapted as confidence rather than an unsupported firearm feat.', 'canonical-role', support('Bluff de Frankie Mermaid', 'buff', '#5c6f7f', { buffMultiplier: 1.2 })),
  ray_wotw: warworlds('Ray Ferrier protects Rachel and improvises escape through the invasion; his special is a civilian extraction maneuver.', 'canonical-role', support('Mettre Rachel à l’abri', 'guard', '#4a5960', { reduce: 0.6 })),
  rachel_wotw: warworlds('Rachel is Ray’s young daughter and a civilian survivor; the protective family bond is represented through reassurance only.', 'canonical-role', support('Rassurer Rachel pendant la fuite', 'cleanse', '#b6a08c')),
  robbie_wotw: warworlds('Robbie tries to help people during the invasion and is drawn toward the military response; this adaptation supports evacuation without inventing military training.', 'canonical-role', support('Aider les civils à évacuer', 'guard', '#6b6f72', { reduce: 0.48 })),
  crysta_ferngully: ferngully('Crysta uses fairy growth magic and the seed that helps contain Hexxus; the special emphasizes renewing and protecting living forest.', 'canonical-role', support('Graine de vie de FernGully', 'heal', '#65d56e', { healRatio: 0.34 })),
  zak_ferngully: ferngully('Zak learns to protect FernGully and helps stop the tree-cutting machine; practical action supports the forest rather than giving him a gun.', 'canonical-role', support('Arrêter la machine à abattre', 'guard', '#4f9ed8', { reduce: 0.56 })),
  batty_ferngully: ferngully('Batty Koda uses flight and bat senses while helping Crysta and Zak; an echolocation warning is adapted as reconnaissance.', 'canonical-role', support('Alerte par écholocation de Batty', 'buff', '#7b5b9e', { buffMultiplier: 1.23 })),
  diego_de_la_vega_zorro: zorro('The Mask of Zorro: Diego trains Alejandro through controlled sword drills and the training circle; the special adapts the mentor’s fencing.', 'canonical-role', hit('Leçon du cercle de Diego', 4.2, '#d6ad55', 185)),
  alejandro_murrieta_zorro: zorro('The Mask of Zorro: Alejandro combines the fencing learned from Diego with the Zorro identity and signature sword work.', 'canonical-role', hit('Estoc et marque de Zorro', 4.4, '#f9d078', 190)),
  elena_montera_zorro: zorro('The Mask of Zorro: Elena duels Alejandro with a sword; this preserves her demonstrated fencing rather than inventing energy magic.', 'canonical-role', hit('Riposte d’escrime d’Elena', 4.0, '#b38a32', 180)),
});
