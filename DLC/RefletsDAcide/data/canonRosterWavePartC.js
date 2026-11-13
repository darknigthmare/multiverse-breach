// Reflets d’Acide — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createReflets() {
  return (Object.freeze({
  key: 'reflets_acide',
  universe: 'Reflets d’Acide',
  url: 'https://www.refletsdacide.com/personnages/'
}));
}

export function createRefletsAcide({ REFLETS, definePack, stageVariant }) {
  return (definePack(REFLETS, {
  aliases: ["Reflet d'acide", 'Reflets d Acide'],
  mediaType: 'audio-drama', faction: 'arcane', mode: 'RPG', difficulty: 'Expert',
  colors: ['#331d44', '#08040d', '#ff784e'], motif: 'abyss',
  theme: 'rhymed heroic-fantasy audio saga descending into Mortepierre',
  continuity: 'JBX audio saga, official character pages and episode transcripts',
  adaptationRule: 'Preserve the rhymed saga’s exact identities and moral changes. Alia-Aénor is a rescue/trial encounter who becomes an ally, never a villain to kill; Bélial remains the true overarching antagonist.',
  visualAnchor: 'Mortepierre’s carved abyss, infernal red light, medieval-fantasy equipment and sharply differentiated party silhouettes.',
  canonStatus: 'canon audio-saga roster with explicit nonlethal story encounters',
  fr: 'Wrandrall entraîne Zehirmahnn et Zarakaï vers Mortepierre, où démons, révélations familiales et plans de Bélial redéfinissent leur quête.',
  en: 'Wrandrall draws Zehirmahnn and Zarakaï toward Mortepierre, where demons, family revelations and Bélial’s plans reshape their quest.',
  referenceUrls: [REFLETS.url, 'https://www.refletsdacide.com/presentation/', 'https://www.refletsdacide.com/wp-content/uploads/2017/04/Reflets-dAcide-16.pdf', 'https://www.refletsdacide.com/episodes/au-dela-de-la-mort/', 'https://sagas.neamar.fr/Reflets/'],
  characters: [
    { id: 'wrandrall', name: 'Wrandrall', role: 'slayer', weapon: 'Flamberge', weaponType: 'blade', simple: 'Taille de flamberge', secondary: 'Ruse de cambion', defense: 'Feinte de Wrandrall', special: 'Héritage infernal maîtrisé', visualAnchor: 'Young cambion adventurer with dark hair, travel-worn cloak and an oversized two-handed flamberge.', fr: 'Wrandrall, cambion armé d’une flamberge, est au centre des révélations de Mortepierre.', en: 'Wrandrall, a cambion carrying a flamberge, stands at the center of Mortepierre’s revelations.' },
    { id: 'zehirmahnn', name: 'Zehirmahnn', role: 'hacker', weapon: 'Feu élémentaire', weaponType: 'magic', simple: 'Trait de feu', secondary: 'Aura ignée', defense: 'Corps de flamme', special: 'Déferlement élémentaire', visualAnchor: 'Tall fire outsider with red-orange skin glow, elegant adventuring clothes and controlled flames around the hands.', fr: 'L’extraplanaire du feu manie les flammes avec retenue et érudition.', en: 'The fire outsider wields flame with restraint and learning.' },
    { id: 'zarakai', name: 'Zarakaï', role: 'slayer', weapon: 'Marteau de Zarakaï', weaponType: 'hammer', simple: 'Coup de marteau', secondary: 'Impact de jambe métallique', defense: 'Endurance presque indestructible', special: 'Colère du vieux nain', visualAnchor: 'Old broad dwarf with long beard, massive hammer, heavy armor and a clearly metallic leg.', fr: 'Le vieux nain presque indestructible frappe au marteau et s’appuie sur sa jambe métallique.', en: 'The nearly indestructible old dwarf fights with a hammer and his metal leg.' }
  ],
  monsters: [
    { id: 'goule', name: 'Goule', weapon: 'Griffes', special: 'Assaut des morts', visualAnchor: 'Gaunt undead ghoul from a medieval crypt, hunched silhouette and torn burial cloth.', fr: 'Un mort affamé rencontré dans les profondeurs.', en: 'A hungry undead creature encountered below.' },
    { id: 'gargouille', name: 'Gargouille', weapon: 'Serres de pierre', special: 'Plongeon minéral', visualAnchor: 'Carved stone gargoyle with folded wings that breaks from Mortepierre architecture.', fr: 'Une sentinelle minérale qui se détache des parois.', en: 'A mineral sentinel that tears free from the walls.' },
    { id: 'demon_legion', name: 'Démon des légions infernales', weapon: 'Arme infernale', special: 'Percée des légions', visualAnchor: 'Disciplined infernal legionary with ember-red armor, polearm and no generic horned-beast anatomy.', fr: 'Un soldat des forces infernales liées au plan de Bélial.', en: 'A soldier of the infernal forces tied to Bélial’s plan.' }
  ],
  bosses: [
    { id: 'sabnock', name: 'Sabnock', weapon: 'Magie démoniaque', special: 'Commandement infernal', visualAnchor: 'Named infernal noble with severe armor, heraldic occult marks and command posture.', fr: 'Sabnock exerce une autorité démoniaque au cœur de l’intrigue.', en: 'Sabnock wields demonic authority at the heart of the plot.' },
    { id: 'mortys', name: 'Mortys', weapon: 'Pouvoir de Mortepierre', special: 'Révélation de Mortys', visualAnchor: 'Ancient Mortepierre figure framed by carved stone, spectral energy and narrative rather than brute-force menace.', fr: 'Mortys constitue une rencontre majeure liée aux secrets du gouffre.', en: 'Mortys is a major encounter tied to the abyss’s secrets.' },
    { id: 'alia_aenor', name: 'Alia-Aénor', weapon: 'Souffle draconique', special: 'Éveil d’Alia-Aénor', visualAnchor: 'Majestic dragoness emerging from confinement, expressive intelligent eyes and red-gold scales.', fr: 'Alia-Aénor doit être libérée et comprise ; elle devient une alliée, pas une victime à abattre.', en: 'Alia-Aénor must be freed and understood; she becomes an ally, not a target to slay.', canonStatus: 'canon rescue encounter and later ally', entityType: 'rescue-trial', nonCombat: true, objective: 'Free Alia-Aénor and survive her awakening without killing her.', objectiveFr: 'Libérer Alia-Aénor puis survivre à son éveil sans la tuer.', victoryCondition: 'rescue-and-pacify' }
  ],
  worldBoss: { id: 'belial', name: 'Bélial', weapon: 'Pouvoir infernal', special: 'Plan du prince démon', visualAnchor: 'Overarching infernal prince in immense red-black silhouette behind Mortepierre’s abyss and ritual geometry.', fr: 'Bélial est la menace maîtresse dont les plans dépassent les gardiens du gouffre.', en: 'Bélial is the master threat whose designs exceed the abyss’s guardians.', canonStatus: 'canon overarching antagonist', entityType: 'infernal-world-boss', objective: 'Break Bélial’s ritual and force his influence out of Mortepierre.' },
  stage: { name: 'Gouffre de Mortepierre', visualAnchor: 'Vertical carved-stone abyss, bridges, crypt doors and deep red infernal light below.', fr: 'Le groupe descend dans le gouffre de Mortepierre à mesure que les rimes révèlent ses secrets.', en: 'The party descends into Mortepierre’s abyss as the rhymed story reveals its secrets.' },
  stageVariants: [
    stageVariant('Tactics', 'Geôle d’Alia-Aénor', 'Very Hard', 'Alia-Aénor', { objective: 'Release and pacify Alia-Aénor; lethal attacks fail the encounter.' }),
    stageVariant('Smash', 'Rituel infernal de Bélial', 'Expert', 'Bélial', { objective: 'Break the ritual anchors before confronting Bélial’s manifestation.' })
  ],
  gear: [
    { id: 'flamberge_wrandrall', enName: 'Wrandrall’s Flamberge', frName: 'Flamberge de Wrandrall', boost: { atk: 9, spd: 1 }, visualAnchor: 'Large two-handed flamberge with undulating blade and travel wear.', fr: 'L’arme caractéristique du cambion.', en: 'The cambion’s characteristic weapon.' },
    { id: 'marteau_zarakai', enName: 'Zarakaï’s Hammer', frName: 'Marteau de Zarakaï', boost: { hp: 55, atk: 5 }, visualAnchor: 'Massive dwarf war hammer balanced for Zarakaï’s short broad frame.', fr: 'Le marteau du vieux nain.', en: 'The old dwarf’s hammer.' },
    { id: 'braise_zehirmahnn', enName: 'Zehirmahnn Ember', frName: 'Braise de Zehirmahnn', boost: { def: 6, hp: 45 }, visualAnchor: 'Contained elemental ember floating inside a simple warded glass charm.', fr: 'Une braise stabilisée de l’extraplanaire du feu.', en: 'A stabilized ember from the fire outsider.' }
  ],
  event: { id: 'rime_mortepierre', enName: 'Mortepierre Revelation', frName: 'Révélation de Mortepierre', en: 'A rhymed revelation exposes the ritual anchors while the party’s fire, steel and hammer strike in sequence.', fr: 'Une révélation rimée dévoile les ancrages du rituel tandis que feu, acier et marteau frappent en cadence.', visualAnchor: 'Runes illuminating in rhyme-like sequence across Mortepierre’s carved abyss.' }
}));
}
