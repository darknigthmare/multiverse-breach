// The Grudge — definitions consumed by src/game/featuredUniversePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createFeaturedUniversePacks({ hero, threat }) {
  return ({
    universe: 'The Grudge',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Saeki House Care Visit',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Kayako Stair Crawl',
    title: { en: 'The Grudge', fr: 'The Grudge' },
    desc: {
      en: 'The Saeki house carries a Ju-On born when Takeos violence killed Kayako and Toshio. Karen Davis, Detective Nakagawa, and Aubrey follow a non-linear chain of visits, recordings, attic noises, black hair, Toshios catlike cry, and Kayakos death rattle; entering the house is enough for the curse to follow.',
      fr: 'La maison Saeki porte un Ju-On ne lorsque la violence de Takeo a tue Kayako et Toshio. Karen Davis, l inspecteur Nakagawa et Aubrey suivent une chaine non lineaire de visites, enregistrements, bruits de grenier, cheveux noirs, cri felin de Toshio et rale de Kayako; entrer dans la maison suffit pour que la malediction suive.'
    },
    hero: hero('karen_grudge', 'Karen Davis', 'horror', '#e2dfd4', 'flashlight', 'Flashlight Sweep', 'Care File Search', 'House Exit Sprint', 'Saeki House Firebreak'),
    allies: [
      hero('detective_nakagawa', 'Detective Nakagawa', 'tactical', '#59656d', 'gun', 'Tokyo Police Shot', 'Case Tape Review', 'Gasoline Line Guard', 'Saeki File Reconstruction'),
      hero('aubrey_grudge', 'Aubrey Davis', 'horror', '#b9a18f', 'camera', 'Camera Flash', 'Karen Trail Search', 'Hotel Corridor Dodge', 'Ju-On Contact Trace')
    ],
    monsters: [
      threat('Toshio Attic Apparition', '/sprites/generated/bosses/the-grudge/toshio-attic-apparition.png', 'cat_cry', 'Attic Lure'),
      threat('Mar Black-Cat Echo', '/sprites/generated/bosses/the-grudge/mar-black-cat-echo.png', 'shadow_claws', 'Cat Cry Blindspot'),
      threat('Cursed Security Camera Shade', '/sprites/generated/bosses/the-grudge/cursed-security-camera-shade.png', 'static', 'Office Hallway Advance')
    ],
    bosses: [
      threat('Takeo Bathtub Rage Echo', '/sprites/generated/bosses/the-grudge/takeo-bathtub-rage-echo.png', 'drowning_grip', 'Saeki Family Murder Loop'),
      threat('Kayako Stair Crawl', '/sprites/generated/bosses/the-grudge/kayako-stair-crawl.png', 'hair_claws', 'Death Rattle Descent')
    ],
    worldBoss: threat('Kayako Saeki Onryo', '/sprites/generated/bosses/the-grudge/kayako-saeki-onryo.png', 'juon_curse', 'Grudge Without Exit'),
    gear: [
      ['grudge_saeki_photo', 'Saeki Family Photograph', 'Photographie de la famille Saeki', { def: 5, hp: 55 }],
      ['grudge_case_recorder', 'Kayakos Journal', 'Journal de Kayako', { spd: 2, def: 4 }],
      ['grudge_house_key', 'Nakagawas Gasoline Can', 'Bidon dessence de Nakagawa', { atk: 7, hp: 45 }]
    ],
    event: ['evt_grudge_contact_chain', 'Kayakos Journal', 'Journal de Kayako', 'The physical journal records Kayakos obsession with Peter Kirk and the discovery that triggers Takeos murderous rage. Reading it identifies the curses original contact chain without claiming to break it.', 'Le journal physique consigne l obsession de Kayako pour Peter Kirk et la decouverte qui declenche la rage meurtriere de Takeo. Sa lecture identifie la chaine de contact originelle sans pretendre briser la malediction.'],
    decor: { sky: ['#181817', '#030303'], floor: 'rgba(178, 178, 166, 0.12)', grid: 'rgba(229, 229, 217, 0.22)', motif: 'hauntedset', accent: '#deded2' },
    stageVariants: [
      { mode: 'Tactics', name: 'Nakagawa Curse Contact Board', difficulty: 'Very Hard', bossName: 'Takeo Bathtub Rage Echo' },
      { mode: 'Smash', name: 'Saeki Staircase and Attic Descent', difficulty: 'Expert', bossName: 'Kayako Saeki Onryo' }
    ]
  });
}

export function createFeaturedUniverseNarrativeArcs() {
  return ({
    id: 'the_grudge_saeki_contact_chain',
    title: { fr: 'Arc Univers - The Grudge: chaine de contact Saeki', en: 'Universe Arc - The Grudge: Saeki Contact Chain' },
    universes: ['The Grudge'],
    intro: {
      fr: 'Karen Davis remplace une aide a domicile disparue dans la maison Saeki. Emma reste seule, Toshio apparait dans le placard et le rale de Kayako confirme que le Ju-On attend deja chaque personne entree dans la piece.',
      en: 'Karen Davis replaces a missing care worker inside the Saeki house. Emma sits alone, Toshio appears in the closet, and Kayakos death rattle confirms the Ju-On is already waiting for everyone who entered the room.'
    },
    missions: [
      { fr: 'Intro - Visite de soins: retrouver Emma, ouvrir le placard condamne et marquer Karen comme contact avant que la maison ne reecrive l ordre des evenements.', en: 'Intro - Care Visit: find Emma, open the sealed closet, and mark Karen as a contact before the house rewrites the order of events.' },
      { fr: 'Mission - Dossier Nakagawa: relier les meurtres Saeki, les policiers disparus et les visiteurs recents a partir de photos, magnetophones et cameras de securite.', en: 'Mission - Nakagawa File: connect the Saeki murders, missing police officers, and recent visitors through photographs, recorders, and security cameras.' },
      { fr: 'Interlude - Takeo et le grenier: reconstituer le meurtre de Kayako, la noyade de Toshio et la violence qui a cree la malediction sans transformer les victimes en simples monstres.', en: 'Interlude - Takeo and the Attic: reconstruct Kayakos murder, Toshios drowning, and the violence that created the curse without turning its victims into generic monsters.' },
      { fr: 'Mission - Maison incendiee: utiliser l essence de Nakagawa comme barriere de repli, evacuer les nouveaux visiteurs et constater que le feu ne coupe pas les contacts deja transmis.', en: 'Mission - Burning House: use Nakagawas gasoline as a retreat barrier, evacuate new visitors, and establish that fire does not break contacts already transmitted.' },
      { fr: 'Boss - Descente de Kayako: traverser escalier, plafond et grenier, rompre la chaine de nouvelles visites et extraire Karen sans annoncer une purification impossible.', en: 'Boss - Kayakos Descent: cross staircase, ceiling, and attic, break the chain of new visits, and extract Karen without claiming an impossible cleansing.' }
    ],
    outro: { fr: 'La maison reste condamnee et le Ju-On survit dans ses contacts. A.R.C.A. obtient seulement une victoire honnete: aucune nouvelle personne ne franchit le seuil et chaque survivant porte un dossier qui ne sera plus nie.', en: 'The house remains condemned and the Ju-On survives through its contacts. A.R.C.A. earns only an honest victory: nobody new crosses the threshold and every survivor carries a record that will no longer be denied.' },
    reward: { fr: 'Magnetophone Nakagawa + apparence Karen maison Saeki', en: 'Nakagawa Recorder + Saeki House Karen skin' }
  });
}

export function createFeaturedEnemyLore({ localized }) {
  return ({
    'Toshio Attic Apparition': localized('Toshio apparait pale, silencieux ou accompagne dun miaulement apres avoir ete tue avec le chat Mar. Il attire le regard vers les pieces deja marquees par le Ju-On.', 'Toshio appears pale, silent, or accompanied by a cats cry after being killed with Mar. He draws attention toward rooms already marked by the Ju-On.'),
    'Mar Black-Cat Echo': localized('Mar est le chat noir de Toshio, tue pendant le massacre Saeki. Son cri fusionne avec les apparitions de Toshio et signale une presence avant quelle soit visible.', 'Mar is Toshios black cat, killed during the Saeki massacre. Its cry merges with Toshios apparitions and signals a presence before it becomes visible.'),
    'Cursed Security Camera Shade': localized('La camera du bureau montre Kayako avancer image par image vers l objectif. Nakagawa comprend alors que les disparitions recentes remontent toutes a la maison Saeki.', 'The office security camera shows Kayako advancing frame by frame toward the lens. Nakagawa then understands the recent disappearances all lead back to the Saeki house.'),
    'Takeo Bathtub Rage Echo': localized('Takeo reapparait dans la salle de bain ou Toshio fut noye et tue Nakagawa venu incendier la maison. Il incarne la violence initiale qui a produit le Ju-On.', 'Takeo reappears in the bathroom where Toshio was drowned and kills Nakagawa, who came to burn the house. He embodies the original violence that produced the Ju-On.'),
    'Kayako Stair Crawl': localized('Kayako descend lescalier avec son corps brise et son rale de gorge, rejouant la mort infligee par Takeo. La maison utilise cette descente pour fermer toute fuite.', 'Kayako descends the stairs with her broken body and throat rattle, replaying the death Takeo inflicted. The house uses this descent to close every escape.'),
    'Kayako Saeki Onryo': localized('Kayako meurt dans une rage et une douleur extremes, donnant naissance au Ju-On qui contamine quiconque entre dans le lieu. Elle ne chasse pas selon une morale: le contact suffit.', 'Kayako dies in extreme rage and pain, creating the Ju-On that contaminates anyone entering the place. She does not hunt by morality: contact alone is enough.')
  });
}

export function createFeaturedStageLore({ localized }) {
  return ({
    RPG: localized('La maison Saeki garde son escalier, son grenier, son placard condamne et sa salle de bain. Entrer marque immediatement le visiteur; lextraction consiste a limiter les nouveaux contacts, pas a purifier la maison.', 'The Saeki house keeps its staircase, attic, sealed closet, and bathroom. Entry immediately marks a visitor; extraction limits new contacts rather than pretending to cleanse the house.'),
    Tactics: localized('Le dossier Nakagawa relie chaque visite, disparition, photographie et camera de securite. Les cases representent une chaine de contact: partager une piece avec une trace propage le Ju-On.', 'Nakagawas file connects every visit, disappearance, photograph, and security camera. Tiles represent a contact chain: sharing a room with a trace spreads the Ju-On.'),
    Smash: localized('Lescalier et le grenier se replient lun sur lautre pendant que Toshio, Mar, Takeo et Kayako rejouent les points du massacre. Le feu ouvre une sortie courte sans detruire la malediction.', 'The staircase and attic fold into one another while Toshio, Mar, Takeo, and Kayako replay points of the massacre. Fire opens a short exit without destroying the curse.')
  });
}

export function createFeaturedGearLore({ localized }) {
  return (localized('La photographie de famille conserve Kayako, Takeo, Toshio et Mar avant le massacre. Ses visages permettent de reconnaitre les manifestations sans les confondre.', 'The family photograph preserves Kayako, Takeo, Toshio, and Mar before the massacre. Its faces identify manifestations without confusing them.'));
}

export function createFeaturedGearLore2({ localized }) {
  return (localized('Le journal de Kayako contient ses sentiments obsessionnels pour Peter Kirk. Takeo le decouvre avant le massacre qui engendre le Ju-On.', 'Kayakos journal records her obsessive feelings for Peter Kirk. Takeo discovers it before the murders that create the Ju-On.'));
}

export function createFeaturedGearLore3({ localized }) {
  return (localized('Nakagawa apporte un bidon dessence dans la maison Saeki pour tenter de la detruire par le feu. Le geste retarde une manifestation sans supprimer la malediction.', 'Nakagawa brings a gasoline can into the Saeki house in an attempt to destroy it by fire. The act delays a manifestation without ending the curse.'));
}

export function createFeaturedBackdrops() {
  return ({
    RPG: '/backgrounds/featured/the-grudge-rpg-openai.png',
    Tactics: '/backgrounds/featured/the-grudge-tactics-openai.png',
    Smash: '/backgrounds/featured/the-grudge-smash-openai.png'
  });
}

export function createFeaturedCharacterPlaques({ plaque }) {
  return (plaque(
    'Karen Davis est une etudiante americaine a Tokyo qui remplace une aide a domicile disparue dans la maison Saeki. Elle comprend progressivement que chaque personne entree dans la maison est deja prise dans le Ju-On.',
    'Karen Davis is an American student in Tokyo who replaces a missing care worker inside the Saeki house. She gradually understands that everyone who entered the house is already caught in the Ju-On.',
    'La Breche duplique les pieces de la maison dans plusieurs quartiers. Karen cartographie l ordre reel des visites, tente de couper les nouvelles entrees et accepte que bruler le batiment ne suffit pas a effacer le contact deja transmis.',
    'The Breach duplicates rooms from the house across several districts. Karen maps the true order of visits, tries to stop new entries, and accepts that burning the building is not enough to erase contact already transmitted.',
    'Lampe, dossier de soins, fuite de la maison et coupe-feu de contact.',
    'Flashlight, care file, house escape, and contact firebreak.',
    ['Karen Davis', 'Saeki house', 'care visit']
  ));
}

export function createFeaturedCharacterPlaques2({ plaque }) {
  return (plaque(
    'Nakagawa est le detective de Tokyo qui relie les disparitions recentes aux meurtres Saeki et a la mort de ses collegues. Il retourne finalement a la maison avec de l essence, convaincu que le lieu doit etre detruit.',
    'Nakagawa is the Tokyo detective who connects recent disappearances to the Saeki murders and the deaths of his colleagues. He eventually returns to the house with gasoline, convinced the place must be destroyed.',
    'A.R.C.A. lui donne enfin un tableau causal complet. Nakagawa marque les visiteurs, recoupe les enregistrements et se sert de l essence comme barriere temporaire, jamais comme solution magique a une malediction deja propagee.',
    'A.R.C.A. finally gives him a complete causal board. Nakagawa marks visitors, cross-checks recordings, and uses gasoline as a temporary barrier, never as a magical solution to an already spread curse.',
    'Dossier de police, magnetophone, ligne d essence et reconstruction des contacts.',
    'Police file, tape recorder, gasoline line, and contact reconstruction.',
    ['Nakagawa', 'Tokyo police', 'case recorder']
  ));
}

export function createFeaturedCharacterPlaques3({ plaque }) {
  return (plaque(
    'Aubrey Davis vient au Japon chercher sa soeur Karen et suit a son tour la trace de Kayako. Son enquete montre que la malediction survit au premier incendie et se propage par les personnes deja touchees.',
    'Aubrey Davis travels to Japan to find her sister Karen and follows Kayakos trail in turn. Her investigation shows the curse survives the first fire and spreads through people already touched.',
    'Dans Multiverse Breach, Aubrey relie les survivants de plusieurs temporalites sans confondre leurs versions. Elle suit la trace de Karen, documente les nouveaux foyers et ferme les routes qui transporteraient le Ju-On hors de la Cite.',
    'In Multiverse Breach, Aubrey connects survivors from several timelines without confusing their versions. She follows Karens trail, documents new sites, and closes routes that would carry the Ju-On outside the City.',
    'Camera, piste de Karen, esquive de couloir et trace de contact Ju-On.',
    'Camera, Karens trail, corridor dodge, and Ju-On contact trace.',
    ['Aubrey Davis', 'The Grudge 2', 'contact trace']
  ));
}

export function createFeaturedBattleItemOverrides() {
  return ({
    pickups: [
      ['Journal de Kayako', 'Kayakos Journal', 'Le journal consigne lobsession pour Peter Kirk et revele la decouverte qui precede le massacre des Saeki.'],
      ['Photographie de famille Saeki laceree', 'Defaced Saeki Family Photograph', 'La photographie dont le visage de Kayako est decoupe relie Takeo, Kayako, Toshio et Mar a lorigine du Ju-On.'],
      ['Bidon dessence de Nakagawa', 'Nakagawas Gasoline Can', 'Le bidon alimente une barriere de feu temporaire qui retarde Kayako sans detruire la malediction.']
    ],
    summon: ['Photographie de Peter Kirk', 'Peter Kirk Photograph', 'La photographie conservee avec le journal materialise lobsession de Kayako et identifie le premier contact exterieur de la chaine.'],
    ultimate: ['Briquet de Doug', 'Dougs Lighter', 'Karen ouvre le briquet de Doug au-dessus de lessence pour incendier la maison et obtenir une courte voie devacuation.']
  });
}
