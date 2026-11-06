// Silent Hill — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'SH-RED',
    rank: { fr: 'Executioner', en: 'Executioner' },
    role: { fr: 'Punition et zone de peur', en: 'Punishment and fear zone' },
    callSign: 'Red Pyramid',
    origin: { fr: 'Univers Silent Hill - cauchemar personnel / Otherworld rouille', en: 'Silent Hill universe - personal nightmare / rust Otherworld' },
    dossier: {
      fr: 'Dans sa Trame d origine, Pyramid Head n est pas un soldat ni un monstre ordinaire: c est une manifestation de jugement, de culpabilite et de punition liee aux lois psychologiques de Silent Hill, particulierement a la descente de James Sunderland. Sa grande lame, son casque rouge et sa marche lente ne servent pas seulement a tuer; ils rendent visible une sentence interieure. Son monde d origine fonctionne par brouillard, sirenes, Otherworld rouille, symboles personnels et horreur qui accuse celui qui la traverse.',
      en: 'In his origin Thread, Pyramid Head is not a soldier or ordinary monster: he is a manifestation of judgment, guilt, and punishment tied to Silent Hill psychological laws, especially James Sunderland descent. His great knife, red helmet, and slow march do not only kill; they make an inner sentence visible. His origin world runs on fog, sirens, rust Otherworld, personal symbols, and horror that accuses whoever crosses it.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, A.R.C.A. ne classe pas Pyramid Head comme heros fiable, mais comme ancre dangereuse de la loi Silent Hill. Quand une faille tente de transformer la culpabilite des autres univers en arme generique, sa presence force le cauchemar a rester personnel: pas de punition gratuite, pas de monstre sans raison. Le Sans-Auteur veut utiliser Pyramid Head comme bourreau universel; A.R.C.A. l emploie au contraire comme limite rouge, pour couper les jugements faux et enfermer les peurs qui cherchent a sortir de leur Trame.',
      en: 'In Multiverse Breach, A.R.C.A. does not classify Pyramid Head as a reliable hero, but as a dangerous anchor of Silent Hill law. When a breach tries to turn guilt from other universes into generic weaponry, his presence forces the nightmare to remain personal: no free punishment, no monster without reason. The Authorless wants to use Pyramid Head as a universal executioner; A.R.C.A. uses him instead as a red boundary, cutting false judgments and sealing fears trying to leave their Thread.'
    },
    doctrine: { fr: 'Grande lame, brouillard, sirene Otherworld, zone de culpabilite, execution lente.', en: 'Great knife, fog, Otherworld siren, guilt zone, slow execution.' },
    tags: ['Silent Hill', 'Otherworld', 'Guilt', 'Judgment', 'Executioner']
  });
}

export function createCharacterPlaques2() {
  return ({
    clearance: 'SH-JS2',
    rank: { fr: 'Survivant appele par la ville', en: 'Town-called survivor' },
    role: { fr: 'Survie psychologique et verite enfouie', en: 'Psychological survival and buried truth' },
    callSign: 'Sunderland',
    origin: { fr: 'Univers Silent Hill 2 - South Vale / Lakeview / culpabilite', en: 'Silent Hill 2 universe - South Vale / Lakeview / guilt' },
    dossier: {
      fr: 'Dans sa Trame d origine, James Sunderland vient a Silent Hill apres avoir recu une lettre de Mary, sa femme morte. La ville ne lui oppose pas seulement des monstres: elle reconstruit ses mensonges, son deuil, son desir d oubli et sa culpabilite sous forme de brouillard, d appartements vides, d hopital, de prison, d hotel Lakeview et de creatures symboliques comme les Lying Figures, les Nurses, Abstract Daddy et Pyramid Head. James represente Silent Hill dans sa forme la plus intime: avancer parce qu une verite attend, meme quand survivre signifie se regarder enfin.',
      en: 'In his origin Thread, James Sunderland comes to Silent Hill after receiving a letter from Mary, his dead wife. The town does not only place monsters before him: it rebuilds his lies, grief, desire to forget, and guilt as fog, empty apartments, hospital, prison, Lakeview Hotel, and symbolic creatures such as Lying Figures, Nurses, Abstract Daddy, and Pyramid Head. James represents Silent Hill at its most intimate: moving forward because a truth waits, even when survival means finally looking at himself.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, James est une signature fragile mais essentielle: il prouve que la Trame Silent Hill ne doit jamais devenir un simple decor horrifique. A.R.C.A. l envoie dans les failles ou le Sans-Auteur transforme les regrets des heros en ennemis anonymes. Son role est de nommer le cauchemar, separer la punition juste de la manipulation, puis sortir avec une verite intacte plutot qu une victoire spectaculaire. Si James echoue, la Cite-Mosaique risque de produire des Otherworlds pour n importe quelle peur non resolue.',
      en: 'In Multiverse Breach, James is a fragile but essential signature: he proves Silent Hill must never become a simple horror backdrop. A.R.C.A. sends him into rifts where the Authorless turns heroes regrets into anonymous enemies. His role is to name the nightmare, separate deserved reckoning from manipulation, then leave with an intact truth rather than a spectacular victory. If James fails, Mosaic City may start producing Otherworlds for any unresolved fear.'
    },
    doctrine: { fr: 'Tuyau de fer, radio parasite, carte de ville, soin rare, confrontation de memoire.', en: 'Steel pipe, static radio, town map, scarce healing, memory confrontation.' },
    tags: ['Silent Hill 2', 'James', 'Mary', 'Fog', 'Guilt']
  });
}

export function createCharacterPlaques3() {
  return ({
    clearance: 'SH-HM3',
    rank: { fr: 'Heritiere de l Ordre', en: 'Heir of the Order' },
    role: { fr: 'Resistance a la naissance du dieu', en: 'Resistance against the god birth' },
    callSign: 'Mason',
    origin: { fr: 'Univers Silent Hill 3 - Heather Mason / Alessa / l Ordre', en: 'Silent Hill 3 universe - Heather Mason / Alessa / the Order' },
    dossier: {
      fr: 'Dans sa Trame d origine, Heather Mason decouvre que sa vie est liee a Alessa Gillespie, a Harry Mason et au culte de Silent Hill. Elle traverse centre commercial, metro, hopital Brookhaven, parc d attractions et Otherworld organique pendant que Claudia et l Ordre cherchent a faire naitre leur dieu a travers elle. Heather represente Silent Hill comme herite refuse: une adolescente qui porte une histoire trop lourde, mais qui choisit de ne pas devenir l outil d une prophetie.',
      en: 'In her origin Thread, Heather Mason discovers her life is tied to Alessa Gillespie, Harry Mason, and the cult of Silent Hill. She crosses mall, subway, Brookhaven Hospital, amusement park, and organic Otherworld while Claudia and the Order try to birth their god through her. Heather represents Silent Hill as rejected inheritance: a teenager carrying a story too heavy, yet choosing not to become the tool of a prophecy.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Heather sert de verrou vivant contre les failles qui se font passer pour destin. Le Sans-Auteur tente de recycler les propheties de l Ordre pour creer une divinite de Trame capable de juger tous les univers. A.R.C.A. l emploie pour briser les rituels, proteger les heros marques par une naissance imposee et rappeler qu une origine ne doit pas decider toute une vie. Son combat n est pas seulement contre les monstres de Silent Hill: c est contre la facon dont le Nexus pourrait transformer les personnages en roles fixes.',
      en: 'In Multiverse Breach, Heather acts as a living lock against breaches pretending to be destiny. The Authorless tries to recycle the Order prophecies into a Thread deity able to judge every universe. A.R.C.A. uses her to break rituals, protect heroes marked by imposed birth, and remind the Nexus that origin should not decide an entire life. Her fight is not only against Silent Hill monsters: it is against the way the Nexus could turn characters into fixed roles.'
    },
    doctrine: { fr: 'Pistolet, katana, pendentif Aglaophotis, rejet du dieu, marche dans l Otherworld.', en: 'Handgun, katana, Aglaophotis pendant, refusal of the god, Otherworld march.' },
    tags: ['Silent Hill 3', 'Heather', 'Alessa', 'Order', 'Prophecy']
  });
}
