// Hellraiser — definitions consumed by src/game/featuredUniversePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createFeaturedUniversePacks({ hero, threat }) {
  return ({
    universe: 'Hellraiser',
    mediaType: 'movie',
    faction: 'horror',
    skipPrimaryStage: true,
    stageName: 'Labyrinth Cenobite Chamber',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Leviathan God',
    title: { en: 'Hellraiser', fr: 'Hellraiser' },
    desc: {
      en: 'Lemarchands puzzle box opens the Labyrinth, a geometric domain ruled by Leviathan where Cenobites treat sensation, desire, pain, and transformation as ritual law. Kirsty survives by understanding the bargain instead of reducing the Order of the Gash to ordinary demons.',
      fr: 'La boite de Lemarchand ouvre le Labyrinthe, domaine geometrique gouverne par Leviathan ou les Cenobites traitent sensation, desir, douleur et transformation comme des lois rituelles. Kirsty survit en comprenant le pacte au lieu de reduire l Ordre de l Entaille a de simples demons.'
    },
    hero: hero('kirsty', 'Kirsty Cotton', 'horror', '#e7e4de', 'puzzlebox', 'Lament Spark', 'Chain Bargain', 'Puzzle Reversal', 'Leviathan Gate Seal'),
    allies: [
      hero('female_cenobite', 'Female Cenobite', 'slayer', '#c8c5bd', 'chains', 'Needle Chain Lash', 'Throat Wound Command', 'Order of the Gash Guard', 'Labyrinth Procession'),
      hero('butterball', 'Butterball', 'tactical', '#68625f', 'cleaver', 'Butcher Cleaver', 'Hidden Eye Hook', 'Leather Apron Brace', 'Cenobite Appetite')
    ],
    monsters: [
      threat('Skinless Frank Cotton', '/sprites/generated/bosses/hellraiser/skinless-frank-cotton.png', 'claws', 'Blood Resurrection'),
      threat('Eremite Puzzle Guardian', '/sprites/generated/bosses/hellraiser/eremite-puzzle-guardian.png', 'cube', 'Lemarchand Lock'),
      threat('Labyrinth Chain Corridor', '/sprites/generated/bosses/hellraiser/labyrinth-chain-corridor.png', 'hook', 'Wall Chain Volley')
    ],
    bosses: [
      threat('Channard Cenobite', '/sprites/generated/bosses/hellraiser/channard-cenobite.png', 'tentacles', 'And To Think I Hesitated'),
      threat('The Engineer', '/sprites/generated/bosses/hellraiser/the-engineer.png', 'maw', 'Threshold Pursuit')
    ],
    worldBoss: threat('Leviathan Diamond', '/sprites/generated/bosses/hellraiser/leviathan-diamond.png', 'black_light', 'Labyrinth Geometry'),
    gear: [
      ['cenobite_hook', 'Barbed Cenobite Hook', 'Crochet barbe de Cenobite', { atk: 11, spd: 1 }],
      ['puzzle_piece', 'Lament Configuration', 'Configuration des Lamentations', { def: 7, hp: 50 }],
      ['pillar_stone', 'Pillar of Souls Fragment', 'Fragment du Pilier des Ames', { atk: 7, def: 5 }],
      ['hellraiser_2022_configuration', 'Six-Phase Configuration', 'Configuration a six phases', { atk: 6, def: 6, spd: 1 }],
      ['hellraiser_voight_nerve_mechanism', 'Voight Nerve Mechanism', 'Mecanisme nerveux de Voight', { atk: 12, hp: 35 }],
      ['hellraiser_priest_pearl_pin', 'Priest Pearl Pin', 'Epingle perlee de la Pretresse', { def: 8, spd: 1 }]
    ],
    event: ['evt_hellraiser_lament_reversal', 'Lament Configuration', 'Configuration des Lamentations', 'Kirsty manipulates the brass-and-black puzzle box under pressure, redirects the Labyrinth chains toward the true subject of the bargain, and closes the threshold.', 'Kirsty manipule sous pression la boite-puzzle noire et doree, redirige les chaines du Labyrinthe vers la veritable cible du pacte et referme le seuil.'],
    decor: { sky: ['#281311', '#050202'], floor: 'rgba(145, 45, 36, 0.2)', grid: 'rgba(211, 158, 72, 0.3)', motif: 'labyrinth', accent: '#d39e48' },
    stageVariants: [
      { mode: 'Tactics', name: 'Cotton House Attic Bargain', difficulty: 'Very Hard', bossName: 'The Engineer' },
      { mode: 'Smash', name: 'Leviathan Black-Light Labyrinth', difficulty: 'Expert', bossName: 'Leviathan Diamond' },
      { mode: 'RPG', name: 'Voight Mansion Six-Phase Trial', difficulty: 'Expert', bossName: 'The Priest (2022)' },
      { mode: 'Tactics', name: 'Voight Mansion Steel Cage', difficulty: 'Expert', bossName: 'Roland Voight - Leviathan Transformation' },
      { mode: 'Smash', name: 'Leviathan Audience Chamber 2022', difficulty: 'Expert', bossName: 'The Priest (2022)' }
    ]
  });
}

export function createFeaturedUniverseNarrativeArcs() {
  return ({
    id: 'hellraiser_lament_configuration',
    title: { fr: 'Arc Univers - Hellraiser: configuration des Lamentations', en: 'Universe Arc - Hellraiser: Lament Configuration' },
    universes: ['Hellraiser'],
    intro: {
      fr: 'La Configuration de Lemarchand ouvre simultanement la maison Cotton et le Labyrinthe de Leviathan. Frank cherche du sang pour reconstruire son corps tandis que les Cenobites viennent reclamer celui qui a ouvert le seuil.',
      en: 'Lemarchands Configuration opens the Cotton house and Leviathans Labyrinth at once. Frank seeks blood to rebuild his body while the Cenobites come to claim the one who opened the threshold.'
    },
    missions: [
      { fr: 'Intro - Grenier Cotton: suivre les traces de sang et comprendre que le corps sans peau est Frank, pas une creature anonyme produite par la Breche.', en: 'Intro - Cotton Attic: follow the blood trail and identify the skinless body as Frank rather than an anonymous Breach creature.' },
      { fr: 'Mission - Prix de Julia: empecher de nouvelles victimes de nourrir la resurrection sans effacer le desir, la trahison et les choix humains qui ont ouvert la maison.', en: 'Mission - Julias Price: stop new victims from feeding the resurrection without erasing the desire, betrayal, and human choices that opened the house.' },
      { fr: 'Interlude - Pacte de Kirsty: proposer Frank aux Cenobites, conserver la boite et rappeler que leur sentence suit un pacte plutot qu une chasse aleatoire.', en: 'Interlude - Kirstys Bargain: offer Frank to the Cenobites, retain the box, and establish that their sentence follows a bargain rather than a random hunt.' },
      { fr: 'Mission - Labyrinthe: resoudre les configurations pendant que Chatterer, Butterball et la Female Cenobite ferment les routes sous la lumiere noire.', en: 'Mission - Labyrinth: solve the configurations while Chatterer, Butterball, and the Female Cenobite close routes beneath the black light.' },
      { fr: 'Boss - Leviathan: retourner la configuration au moment exact, briser le relais de Channard et fermer le seuil sans pretendre detruire le dieu du Labyrinthe.', en: 'Boss - Leviathan: reverse the configuration at the exact moment, break Channards relay, and close the threshold without pretending to destroy the god of the Labyrinth.' }
    ],
    outro: { fr: 'La maison redevient un lieu humain, mais la boite demeure. A.R.C.A. archive la regle essentielle: ouvrir est un choix, negocier a un prix et refermer exige de comprendre la configuration.', en: 'The house becomes human space again, but the box remains. A.R.C.A. archives the essential rule: opening is a choice, bargaining has a price, and closing requires understanding the configuration.' },
    reward: { fr: 'Configuration Lemarchand scellee + apparence Kirsty Labyrinthe', en: 'Sealed Lemarchand Configuration + Labyrinth Kirsty skin' }
  });
}

export function createFeaturedUniverseNarrativeArcs2() {
  return ({
    id: 'hellraiser_2022_six_configurations',
    title: { fr: 'Arc Univers - Hellraiser 2022: les six configurations', en: 'Universe Arc - Hellraiser 2022: The Six Configurations' },
    universes: ['Hellraiser'],
    intro: {
      fr: 'Six ans apres avoir exige la sensation, Roland Voight vit prisonnier de son propre mecanisme nerveux. Riley recupere une nouvelle boite dont chaque forme exige un sacrifice et rapproche le manoir de l audience de Leviathan.',
      en: 'Six years after demanding sensation, Roland Voight lives trapped inside his own nerve mechanism. Riley finds a new box whose every form demands a sacrifice and draws the mansion closer to Leviathans audience.'
    },
    missions: [
      { fr: 'Intro - Entrepot de Voight: retrouver la boite, identifier sa lame retractable et refuser de traiter la premiere victime comme un simple cout de tutoriel.', en: 'Intro - Voights Warehouse: recover the box, identify its retractable blade, and refuse to treat its first victim as a disposable tutorial cost.' },
      { fr: 'Mission - Configurations: stabiliser Lament, Lore, Laudarant, Liminal et Lazarus sans laisser le Sans-Auteur fusionner leurs recompenses en un bonus generique.', en: 'Mission - Configurations: stabilize Lament, Lore, Laudarant, Liminal, and Lazarus without letting the Authorless merge their rewards into a generic bonus.' },
      { fr: 'Interlude - Maison piege: Riley, Colin et Trevor traversent les couloirs mobiles tandis que la Gasp, la Weeper, l Asphyx, la Mother, le Masque et Chatterer appliquent les marques deja ouvertes.', en: 'Interlude - Puzzle Mansion: Riley, Colin, and Trevor cross shifting corridors while the Gasp, Weeper, Asphyx, Mother, Masque, and Chatterer enforce the marks already opened.' },
      { fr: 'Mission - Cage d acier: utiliser le dessin du manoir pour enfermer les Cenobites sans pretendre que la grille annule la juridiction de la boite.', en: 'Mission - Steel Cage: use the mansions design to contain the Cenobites without pretending the grid cancels the boxs jurisdiction.' },
      { fr: 'Boss - Audience de Leviathan: retourner le dernier sacrifice contre Voight, survivre a sa transformation et choisir Lament plutot qu une recompense falsifiee.', en: 'Boss - Leviathans Audience: turn the final sacrifice against Voight, survive his transformation, and choose Lament rather than accept a falsified reward.' }
    ],
    outro: { fr: 'Riley accepte la perte au lieu de demander a Leviathan de reecrire son histoire. A.R.C.A. archive les deux continuites Hellraiser sans confondre la Pretresse de 2022 avec Elliot Spencer.', en: 'Riley accepts loss instead of asking Leviathan to rewrite her history. A.R.C.A. archives both Hellraiser continuities without confusing the 2022 Priest with Elliot Spencer.' },
    reward: { fr: 'Configuration Lament 2022 + apparence Riley audience', en: '2022 Lament Configuration + Audience Riley skin' }
  });
}

export function createFeaturedEnemyLore({ localized }) {
  return ({
    'Skinless Frank Cotton': localized('Frank revient sous le plancher du grenier quand le sang touche le lieu de sa fuite. Sans peau et incomplet, il pousse Julia a lui fournir des victimes pour reconstruire son corps.', 'Frank returns beneath the attic floor when blood touches the place of his escape. Skinless and incomplete, he drives Julia to supply victims so he can rebuild his body.'),
    'Eremite Puzzle Guardian': localized('L Eremite est la figure squelettique associee a la Configuration de Lemarchand. Il garde la boite et rappelle que le seuil possede un mecanisme precis.', 'The Eremite is the skeletal figure associated with Lemarchands Configuration. It guards the box and establishes that the threshold follows a precise mechanism.'),
    'Labyrinth Chain Corridor': localized('Ce couloir est un mecanisme du Labyrinthe, pas un monstre autonome: les murs ouvrent des crochets qui suivent la sentence prononcee par les Cenobites.', 'This corridor is a Labyrinth mechanism rather than an autonomous monster: its walls release hooks that execute the sentence pronounced by the Cenobites.'),
    'Channard Cenobite': localized('Le docteur Channard est transforme par Leviathan en Cenobite chirurgical relie a un long appendice. Il retourne son obsession pour les esprits malades contre patients et Cenobites.', 'Doctor Channard is transformed by Leviathan into a surgical Cenobite attached to a long appendage. He turns his obsession with damaged minds against patients and Cenobites alike.'),
    'The Engineer': localized('L Engineer est la bete du Labyrinthe qui poursuit Kirsty dans les couloirs apres ouverture de la boite. Sa gueule et son corps bas en font un traqueur, pas un demon humanoide.', 'The Engineer is the Labyrinth beast that pursues Kirsty through the corridors after the box opens. Its maw and low body make it a tracker rather than a humanoid demon.'),
    'Leviathan Diamond': localized('Leviathan domine le Labyrinthe sous la forme dun immense losange noir projetant sa lumiere. Il ordonne les transformations cenobites et la geometrie du royaume.', 'Leviathan rules the Labyrinth as a vast black diamond projecting its light. It commands Cenobite transformations and the realms geometry.'),
    'The Auditor (Judgment)': localized('L Auditor est le greffier balafre de l Inquisition stygienne. Derriere ses lunettes rondes et son costume noir use, il consigne les confessions sur des feuilles de chair avec une machine a ecrire; il ne fait pas partie de l Ordre de l Entaille.', 'The Auditor is the scarred clerk of the Stygian Inquisition. Behind round goggles and a worn black suit, he records confessions on flesh pages with a typewriter; he is not part of the Order of the Gash.'),
    'The Assessor (Judgment)': localized('L Assessor est le membre corpulent de l Inquisition qui traite les pages remises par l Auditor. Son veston sale porte sans chemise et son rituel de consommation transmettent la matiere du verdict au Jury.', 'The Assessor is the corpulent Inquisition member who processes pages delivered by the Auditor. His dirty shirtless jacket and consumption ritual pass the verdict material to the Jury.'),
    'The Jury (Judgment)': localized('Le Jury rassemble trois jeunes femmes aux visages depouilles, toujours presentes comme un collectif. Elles lisent la matiere produite par l Assessor et prononcent ensemble le verdict; le jeu conserve leur silhouette de trio sans nudite explicite.', 'The Jury consists of three young women with stripped faces, always presented as a collective. They read the material produced by the Assessor and deliver one verdict together; the game preserves their trio silhouette without explicit nudity.'),
    'The Cleaners (Judgment)': localized('Les Cleaners sont trois femmes tres agees qui accomplissent la phase de purification avant la sentence chirurgicale. Elles restent un trio de l Inquisition stygienne, jamais des Cenobites ni une seule creature dupliquee.', 'The Cleaners are three very old women who perform the cleansing phase before surgical punishment. They remain a Stygian Inquisition trio, never Cenobites or one duplicated creature.'),
    'The Butcher (Judgment)': localized('Le Butcher est le colosse de l Inquisition stygienne. Son masque de cheveux, son tablier souille et sa gigantesque faux accompagnent de larges gestes de decoupe; il execute la sentence avec le Surgeon.', 'The Butcher is the Stygian Inquisitions behemoth. His curtain of hair, stained apron, and giant scythe accompany broad cutting motions; he carries out punishment with the Surgeon.'),
    'The Surgeon (Judgment)': localized('Le Surgeon de Judgment est un bourreau maigre suspendu a un harnais, masque par une tete organique et un respirateur noir, puis arme d instruments chirurgicaux. Il est distinct du Surgeon Cenobite de Hellseeker deja repertorie.', 'Judgments Surgeon is a thin executioner suspended from a harness, hidden behind an organic headpiece and black respirator, and armed with surgical instruments. This character is distinct from the Hellseeker Surgeon Cenobite already catalogued.'),
    'The Gasp (2022)': localized('La Gasp porte une architecture de perles et de tensions autour de la gorge et du visage. Sa silhouette pale et drapee appartient au nouvel ordre de 2022, jamais a la Female Cenobite classique.', 'The Gasp carries a pearl-and-tension architecture around her throat and face. Her pale draped silhouette belongs to the 2022 order and is never substituted for the classic Female Cenobite.'),
    'The Weeper (2022)': localized('La Weeper avance avec une ouverture faciale verticale et des traces sombres semblables a des larmes. Son attaque prolonge cette ligne anatomique au lieu de lui donner une arme humaine arbitraire.', 'The Weeper advances with a vertical facial opening and dark tear-like trails. Her attack extends that anatomical line instead of assigning her an arbitrary human weapon.'),
    'The Asphyx (2022)': localized('L Asphyx est construit autour de la respiration contrainte: tete et gorge sont enchassees dans un dispositif organique rigide. Il impose silence et manque dair dans les couloirs du manoir.', 'The Asphyx is built around constrained breathing: head and throat are locked inside a rigid organic device. He imposes silence and air deprivation through the mansion corridors.'),
    'The Mother (2022)': localized('La Mother possede une masse maternelle monumentale sculptee par des plis anatomiques. Sa lenteur sert une presence de procession et une zone de saisie, pas un profil de brute generique.', 'The Mother has a monumental maternal mass sculpted through anatomical folds. Her slow movement supports a processional presence and grappling zone rather than a generic brute profile.'),
    'The Masque (2022)': localized('Le Masque expose son visage comme une piece tenue a distance du crane. Ses gestes jouent sur cette separation et sur les angles du manoir, sans le confondre avec Camerahead.', 'The Masque displays his face as a piece held away from the skull. His motions exploit that separation and the mansions angles without confusing him with Camerahead.'),
    'Chatterer (2022)': localized('Le Chatterer de 2022 est une nouvelle incarnation gigantesque, pale et presque nue, dont la bouche exposee reste le centre de lecture. Il demeure distinct du Chatterer classique et de Chatterer II.', 'The 2022 Chatterer is a new towering, pale, nearly unclothed incarnation whose exposed mouth remains its visual center. It stays distinct from classic Chatterer and Chatterer II.'),
    'The Priest (2022)': localized('La Pretresse de 2022 porte un quadrillage de fines incisions, des epingles perlees et des vetements formes par sa propre anatomie. Elle preside les six configurations sans etre Elliot Spencer.', 'The 2022 Priest bears a grid of fine incisions, pearl-headed pins, and garments formed from her own anatomy. She presides over the six configurations without being Elliot Spencer.'),
    'Roland Voight - Leviathan Transformation': localized('Voight exige le pouvoir apres avoir rejete la sensation. Leviathan repond en le suspendant et en le remodelant devant son audience; cette forme est une recompense-punition, pas un Cenobite officiellement nomme.', 'Voight demands power after rejecting sensation. Leviathan answers by suspending and remaking him before its audience; this form is a reward-punishment, not an officially named Cenobite.'),
    'Pistonhead Cenobite': localized('Pistonhead est la transformation de J.P. Monroe dans Hellraiser III. Son crane est traverse par un piston mecanique et ses charges doivent conserver cette origine industrielle.', 'Pistonhead is J.P. Monroes transformation in Hellraiser III. A mechanical piston crosses his skull, and his charges preserve that industrial origin.'),
    'Camerahead Cenobite': localized('Camerahead vient du cameraman Doc transforme par Pinhead. Une camera fusionnee a son visage enregistre et frappe; il ne partage ni silhouette ni pouvoir avec le Masque de 2022.', 'Camerahead comes from cameraman Doc after Pinheads transformation. A camera fused to his face records and strikes; he shares neither silhouette nor power with the 2022 Masque.'),
    'CD Cenobite': localized('Le DJ de la Boiler Room devient CD, un pseudo-Cenobite de Hellraiser III qui projette des disques comme des lames. Son equipement musical reste visible dans chaque attaque.', 'The Boiler Room DJ becomes CD, a Hellraiser III pseudo-Cenobite who throws discs like blades. His musical equipment remains visible in every attack.'),
    'Barbie Cenobite': localized('Le barman de la Boiler Room est transforme en Barbie, dont le dispositif buccal alimente une projection de feu. Le nom vient du barbecue, pas dune apparence de poupee.', 'The Boiler Room bartender becomes Barbie, whose mouth device feeds a burst of flame. The name refers to barbecue rather than a doll-like appearance.'),
    'Dreamer Cenobite': localized('Terri devient Dreamer dans Hellraiser III. Sa cigarette et sa fumee structurent ses attaques et rappellent le desir de rever et de fuir qui a permis a Pinhead de la manipuler.', 'Terri becomes Dreamer in Hellraiser III. Her cigarette and smoke structure her attacks and recall the wish to dream and escape that let Pinhead manipulate her.'),
    'Chatterer II': localized('Apres avoir retrouve brievement le visage de Nicholas, Chatterer est transforme de nouveau avec des yeux visibles et une dentition differente. Cette etape reste separee de sa premiere apparence.', 'After briefly recovering Nicholass face, Chatterer is transformed again with visible eyes and altered teeth. This stage remains separate from his first appearance.'),
    'Chatterer Beast': localized('Le Chatterer Beast de Bloodline se deplace comme un animal bas et rapide. Sa gueule et ses proportions quadrupedes interdisent de recycler une animation humanoide de Chatterer.', 'The Bloodline Chatterer Beast moves as a low, fast animal. Its maw and quadrupedal proportions prevent reuse of a humanoid Chatterer animation.'),
    'Bloodline Twins': localized('Les Twins de Bloodline sont deux victimes fusionnees en une seule architecture symetrique. Leurs attaques alternent traction opposee et mouvement parfaitement coordonne.', 'The Bloodline Twins are two victims fused into one symmetrical architecture. Their attacks alternate opposing pulls and perfectly coordinated movement.'),
    'Angelique Cenobite': localized('Angelique, princesse demoniaque invoquee par de L Isle puis soumise aux regles de Pinhead, conserve sa robe noire, ses fils et son lien direct avec la genealogie de la boite.', 'Angelique, a demon princess summoned by de L Isle and later subjected to Pinheads rules, retains her black gown, wires, and direct link to the boxs lineage.'),
    'Wire Twins': localized('Les Wire Twins forment une paire symetrique aux chairs retenues par des fils et des crochets. Elles attaquent comme un duo et ne doivent jamais etre reduites a un seul sprite clone.', 'The Wire Twins form a symmetrical pair whose anatomy is held by wires and hooks. They attack as a duo and must never be reduced to one cloned sprite.'),
    'Torso Cenobite': localized('Torso se traine sans membres inferieurs et transforme sa faible hauteur en approche sous les gardes. Sa locomotion au sol exige un cadrage different des Cenobites debout.', 'Torso drags itself without lower limbs and turns its low height into an approach beneath guards. Its ground locomotion requires framing distinct from standing Cenobites.'),
    'Stitch Cenobite': localized('Stitch porte une couture faciale horizontale qui ferme et deforme ses traits. Ses crochets suivent cette ligne sans inventer une magie qui ne vient pas du film.', 'Stitch bears a horizontal facial seam that closes and distorts her features. Her hooks follow that line without inventing magic absent from the film.'),
    'Bound Cenobites': localized('Les Bound Cenobites sont maintenus dans des contraintes de cuir et de metal qui limitent leurs gestes. En jeu, leur resistance et leur attaque liee viennent de cette immobilisation.', 'The Bound Cenobites are held inside leather and metal restraints that limit their movement. In play, their resistance and binding attack come from that immobilization.'),
    'Surgeon Cenobite': localized('Le Surgeon utilise des instruments integres a sa fonction rituelle. Il controle une zone par gestes precis et ne devient pas un simple medecin zombie.', 'The Surgeon uses instruments integrated into his ritual function. He controls an area through precise gestures rather than becoming a generic zombie doctor.'),
    'Pseudo-Pinhead': localized('Pseudo-Pinhead reproduit imparfaitement le quadrillage et les clous du Hell Priest. Le dossier le classe comme imitation tardive afin de ne jamais remplacer Pinhead ou la Pretresse de 2022.', 'Pseudo-Pinhead imperfectly reproduces the Hell Priests grid and nails. The dossier classifies him as a later imitation so he never replaces Pinhead or the 2022 Priest.')
  });
}

export function createFeaturedStageLore({ localized }) {
  return ({
    RPG: localized('Le Labyrinthe suit les angles de la Configuration et la lumiere noire de Leviathan. Chaines, couloirs et Cenobites appliquent un pacte ouvert par la boite; ils ne sont pas une horde infernale sans regles.', 'The Labyrinth follows the Configurations angles and Leviathans black light. Chains, corridors, and Cenobites apply a bargain opened by the box; they are not a ruleless infernal horde.'),
    Tactics: localized('Le grenier Cotton superpose la resurrection de Frank, les victimes attirees par Julia et la negociation de Kirsty. Chaque case de sang accelere Frank tandis que la boite peut rediriger les Cenobites.', 'The Cotton attic overlaps Franks resurrection, victims lured by Julia, and Kirstys bargain. Every blood tile advances Frank while the box can redirect the Cenobites.'),
    Smash: localized('Sous le losange Leviathan, les plateformes du Labyrinthe pivotent comme les pieces de Lemarchand. La lumiere noire transforme les combattants marques et les chaines sanctionnent toute ouverture forcee.', 'Beneath Leviathans diamond, Labyrinth platforms rotate like Lemarchand pieces. Black light transforms marked fighters and chains punish every forced opening.'),
    'Voight Mansion Six-Phase Trial': localized('Le manoir de Voight reproduit la symetrie de la boite 2022. Chaque victime fait avancer une configuration precise; Riley doit atteindre Lament sans accepter les recompenses de Leviathan.', 'Voights mansion repeats the symmetry of the 2022 box. Every victim advances one precise configuration; Riley must reach Lament without accepting Leviathans rewards.'),
    'Voight Mansion Steel Cage': localized('La grille d acier integree au manoir ferme les lignes de passage des Cenobites mais ne rompt pas la marque de la boite. Le placement sert a sauver les porteurs marques et a retourner Voight contre son propre plan.', 'The steel grid built into the mansion closes Cenobite approach lines but does not break the boxs mark. Positioning saves marked carriers and turns Voight against his own plan.'),
    'Leviathan Audience Chamber 2022': localized('La derniere configuration ouvre une audience verticale sous Leviathan. Les seuils changent de profondeur, la Pretresse dirige la procession et la transformation de Voight occupe le centre sans remplacer le boss final par un noyau generique.', 'The final configuration opens a vertical audience beneath Leviathan. Thresholds shift in depth, the Priest leads the procession, and Voights transformation occupies center stage without being replaced by a generic core.')
  });
}

export function createFeaturedGearLore({ localized }) {
  return (localized('Les crochets barbes surgissent des murs du Labyrinthe et sont tires par des chaines invisibles. Ils appliquent une sentence cenobite; ils ne sont pas une arme humaine ordinaire.', 'Barbed hooks emerge from Labyrinth walls and are pulled by unseen chains. They execute a Cenobite sentence rather than serving as an ordinary human weapon.'));
}

export function createFeaturedGearLore2({ localized }) {
  return (localized('La Configuration de Lemarchand est une boite-puzzle qui ouvre ou referme le seuil du Labyrinthe. La posseder ne donne jamais le controle gratuit des Cenobites.', 'Lemarchands Configuration is a puzzle box that opens or closes the Labyrinth threshold. Possessing it never grants free control of the Cenobites.'));
}

export function createFeaturedGearLore3({ localized }) {
  return (localized('Le Pilier des Ames retient Pinhead et des victimes de la boite avant son reveil dans Hellraiser III. Ce fragment conserve leurs visages sans dupliquer la Configuration.', 'The Pillar of Souls contains Pinhead and victims of the box before his awakening in Hellraiser III. This fragment preserves their faces without duplicating the Configuration.'));
}

export function createFeaturedGearLore4({ localized }) {
  return (localized('La boite de 2022 traverse six formes: Lament, Lore, Laudarant, Liminal, Lazarus et Leviathan. Sa lame marque une victime et chaque sacrifice rapproche le porteur dune audience.', 'The 2022 box passes through six forms: Lament, Lore, Laudarant, Liminal, Lazarus, and Leviathan. Its blade marks a victim and every sacrifice draws the holder closer to an audience.'));
}

export function createFeaturedGearLore5({ localized }) {
  return (localized('Le cadeau de sensation de Voight est un mecanisme fixe dans son corps qui tire aleatoirement sur ses nerfs. Cet objet signale le prix deja paye, il ne soigne ni ne renforce gratuitement.', 'Voights gift of sensation is a mechanism fixed into his body that pulls at his nerves at random. This item records the price already paid and never grants free healing or strength.'));
}

export function createFeaturedGearLore6({ localized }) {
  return (localized('Les epingles perlees de la Pretresse ponctuent le quadrillage de son visage et son costume anatomique. Le fragment sert de balise de procession, pas de substitut aux clous du Pinhead classique.', 'The Priests pearl-headed pins mark the grid of her face and anatomical vestments. The fragment serves as a processional beacon rather than a substitute for classic Pinheads nails.'));
}

export function createFeaturedBackdrops() {
  return ({
    RPG: '/backgrounds/hellraiser-rpg-openai.png',
    Tactics: '/backgrounds/featured/hellraiser-tactics-openai.png',
    Smash: '/backgrounds/featured/hellraiser-smash-openai.png'
  });
}

export function createFeaturedBattleItemOverrides() {
  return ({
    pickups: [
      ['Configuration Lament - Vie', 'Lament Configuration - Life', 'La forme cubique initiale de 2022 dissimule une lame retractable qui marque le prochain sacrifice.'],
      ['Configuration Lore - Connaissance', 'Lore Configuration - Knowledge', 'La seconde forme octogonale represente le choix de la connaissance et poursuit le cycle des sacrifices.'],
      ['Configuration Laudarant - Amour', 'Laudarant Configuration - Love', 'Deux pyramides imbriquees forment le choix de lamour selon la geometrie rituelle de la boite.'],
      ['Configuration Liminal - Sensation', 'Liminal Configuration - Sensation', 'La forme creuse et angulaire correspond au don de sensation choisi par Voight.'],
      ['Configuration Lazarus - Resurrection', 'Lazarus Configuration - Resurrection', 'La forme en sablier represente la resurrection et le temps defait.'],
      ['Configuration Leviathan - Pouvoir', 'Leviathan Configuration - Power', 'La forme finale en losange reprend la silhouette de Leviathan et ouvre laudience apres cinq sacrifices.']
    ],
    summon: ['Crochet cenobite barbe', 'Barbed Cenobite Hook', 'Le crochet physique jaillit du seuil sur une chaine du Labyrinthe et tire la cible deja marquee par la boite.'],
    ultimate: ['Configuration Leviathan', 'Leviathan Configuration', 'La forme finale en losange accorde laudience avec Leviathan et materialise le prix du choix de pouvoir.']
  });
}
