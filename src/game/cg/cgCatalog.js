import { createCgDefinition } from './cgSchema.js';

const PUBLISHED_AT = '2026-08-01';

const PROJECT_CREDITS = Object.freeze({
  fr: 'Illustration originale créée avec OpenAI pour Multiverse Breach.',
  en: 'Original illustration created with OpenAI for Multiverse Breach.'
});

const FAN_ART_CREDITS = Object.freeze({
  fr: 'Fan-art original non officiel créé avec OpenAI pour Multiverse Breach. Aucun visuel officiel reproduit.',
  en: 'Original unofficial fan art created with OpenAI for Multiverse Breach. No official artwork reproduced.'
});

const SLOT_DEFINITIONS = Object.freeze([
  Object.freeze({ type: 'characterSolo', label: { fr: 'Base Character', en: 'Base Character' }, rarity: 'stable' }),
  Object.freeze({ type: 'weaponSolo', label: { fr: 'Arme signature', en: 'Signature Weapon' }, rarity: 'rare' }),
  Object.freeze({ type: 'decorSolo', label: { fr: 'Décor', en: 'Environment' }, rarity: 'stable' }),
  Object.freeze({ type: 'coherentScene', label: { fr: 'Scène cohérente', en: 'Coherent Scene' }, rarity: 'rare' }),
  Object.freeze({ type: 'actionScene', label: { fr: 'Scène d’action Nexus', en: 'Nexus Action Scene' }, rarity: 'epic' }),
  Object.freeze({ type: 'introPose', label: { fr: 'Pose d’arrivée', en: 'Intro Pose' }, rarity: 'rare' }),
  Object.freeze({ type: 'victoryPose', label: { fr: 'Pose de victoire', en: 'Victory Pose' }, rarity: 'epic' }),
  Object.freeze({ type: 'defeatPose', label: { fr: 'Pose de repli', en: 'Defeat Pose' }, rarity: 'rare' })
]);

const toKebabCase = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

const CHARACTER_PROFILES = [
  {
    universeKey: 'nexus-de-convergence',
    promptNamespace: 'nexus',
    universeName: { fr: 'Nexus de Convergence', en: 'Convergence Nexus' },
    characterKey: 'player-anchor',
    characterId: 'player_anchor',
    characterName: { fr: 'L’Ancre', en: 'The Anchor' },
    canonStatus: 'project-canon',
    continuityId: 'project-canon',
    contentRating: 'family',
    characterReferenceId: 'player-anchor-project-canon-v1',
    rightsClass: 'project-original',
    credits: PROJECT_CREDITS,
    sourceRefs: [
      '/visuals/cosmetics/openai/universes/nexus-de-convergence/reference-dossier.json',
      '/sprites/generated/heroes/nexus-de-convergence/player-anchor.png',
      '/src/game/ocCampaign.js'
    ],
    briefs: {
      characterSolo: {
        fr: 'Ancre en armure segmentée charbon, casque intégral à fine visière jaune, longs pans fendus et gantelet cyan. Silhouette entière, sans arme inventée.',
        en: 'The Anchor in segmented charcoal armor, closed helmet with a narrow yellow visor, long split tails and cyan gauntlet. Full silhouette, no invented weapon.'
      },
      weaponSolo: {
        fr: 'Signature d’Ancre : gantelet mécanique cyan complet, isolé sur son support, sans main ni bras coupé et sans accessoire ajouté.',
        en: 'Anchor Signature: the complete cyan mechanical gauntlet isolated on its stand, with no hand, severed arm or added accessory.'
      },
      decorSolo: {
        fr: 'Atrium central original de la Cité-Mosaïque : arches d’archives, fils causaux cyan, palimpsestes ivoire et machinerie sombre, sans personnage dominant.',
        en: 'Original Mosaic City Central Atrium: archive arches, cyan causal threads, ivory palimpsests and dark machinery, with no dominant figure.'
      },
      coherentScene: {
        fr: 'L’Ancre stabilise calmement des fils causaux superposés depuis une console d’archive, identité et équipement inchangés.',
        en: 'The Anchor calmly stabilizes overlapping causal threads at an archive console, with identity and equipment unchanged.'
      },
      actionScene: {
        fr: 'Commandement d’Ancrage : l’Ancre déploie un vaste champ cyan de stabilisation contre l’effacement du Sans-Auteur, sans nouvel équipement.',
        en: 'Anchor Command: the Anchor deploys a broad cyan stabilization field against Authorless erasure, with no new equipment.'
      },
      introPose: {
        fr: 'L’Ancre reste entière lorsque plusieurs Trames se superposent dans la Cité-Mosaïque : aucune invocation de portail, identité, armure et gantelet inchangés.',
        en: 'The Anchor remains whole as several Threads overlap in Mosaic City: no portal summoning, with identity, armor and gauntlet unchanged.'
      },
      victoryPose: {
        fr: 'L’Ancre adopte une posture calme après avoir stabilisé les fils causaux, sans trophée ni nouvel équipement.',
        en: 'The Anchor takes a calm stance after stabilizing the causal threads, with no trophy or new equipment.'
      },
      defeatPose: {
        fr: 'L’Ancre se replie à un genou, toujours entière et vivante, gantelet affaibli mais équipement intact; la pose reste digne et non humiliante.',
        en: 'The Anchor regroups on one knee, still whole and alive, with a dimmed gauntlet and intact equipment; the pose remains dignified and non-humiliating.'
      }
    }
  },
  {
    universeKey: 'halo',
    universeName: { fr: 'Halo', en: 'Halo' },
    characterKey: 'masterchief',
    characterId: 'masterchief',
    characterName: { fr: 'Master Chief', en: 'Master Chief' },
    canonStatus: 'canon-inspired',
    continuityId: 'halo-infinite-gen3',
    contentRating: 'family',
    characterReferenceId: 'masterchief-halo-infinite-gen3-v1',
    rightsClass: 'unofficial-fan-art',
    credits: FAN_ART_CREDITS,
    sourceRefs: [
      'https://www.halowaypoint.com/news/master-class',
      'https://www.halowaypoint.com/halo-infinite',
      'https://support.halowaypoint.com/hc/en-us/articles/34335369079700-Halo-Infinite-Spring-Update-2025-Patch-Notes',
      'https://www.halowaypoint.com/news/halo-4-vertical-umbrage',
      '/sprites/generated/heroes/halo/master-chief-complete/master-chief-universal.png'
    ],
    briefs: {
      characterSolo: {
        fr: 'Master Chief en MJOLNIR Mark VI GEN3 de Halo Infinite : armure olive usée, visière dorée, casque fermé et MA40 complet.',
        en: 'Master Chief in Halo Infinite MJOLNIR Mark VI GEN3: weathered olive armor, gold visor, closed helmet and complete MA40.'
      },
      weaponSolo: {
        fr: 'Fusil d’assaut MA40 de Halo Infinite, isolé et entièrement visible, sans main, munition flottante, marquage ou logo lisible.',
        en: 'Halo Infinite MA40 assault rifle, isolated and fully visible, without a hand, floating ammunition, readable marking or logo.'
      },
      decorSolo: {
        fr: 'Paysage original de Zeta Halo : vallée fracturée, hexagones Forerunner et courbure de l’anneau, sans personnage dominant.',
        en: 'Original Zeta Halo landscape: fractured valley, Forerunner hexagons and ring curvature, with no dominant character.'
      },
      coherentScene: {
        fr: 'John-117 analyse silencieusement une fracture de Zeta Halo, armure GEN3 et identité casquée strictement conservées.',
        en: 'John-117 silently analyzes a Zeta Halo fracture, strictly preserving his GEN3 armor and helmeted identity.'
      },
      actionScene: {
        fr: 'Action Nexus : Master Chief GEN3 tire un Spartan Laser M6 complet à travers une brèche, sans convertir cette arme cross-era en visuel officiel Halo Infinite.',
        en: 'Nexus action: GEN3 Master Chief fires a complete M6 Spartan Laser through a breach, without presenting this cross-era weapon as official Halo Infinite artwork.'
      },
      introPose: {
        fr: 'Master Chief arrive avec discipline sur Zeta Halo, casque fermé, armure Mark VI GEN3 et MA40 complet strictement conservés.',
        en: 'Master Chief makes a disciplined arrival on Zeta Halo, strictly preserving his closed helmet, Mark VI GEN3 armor and complete MA40.'
      },
      victoryPose: {
        fr: 'John-117 tient une victoire sobre après l’engagement, MA40 complet abaissé en position de sécurité, sans trophée ni visage révélé.',
        en: 'John-117 holds a restrained post-engagement victory stance, complete MA40 lowered to low ready, with no trophy or revealed face.'
      },
      defeatPose: {
        fr: 'John-117 se replie tactiquement à un genou, vivant, casque fermé et armure GEN3 intacte ou légèrement marquée; aucune mort ni humiliation.',
        en: 'John-117 makes a controlled tactical regroup on one knee, alive, helmet closed and GEN3 armor intact or lightly marked; no death or humiliation.'
      }
    }
  },
  {
    universeKey: 'halo',
    universeName: { fr: 'Halo', en: 'Halo' },
    characterKey: 'arbiter',
    characterId: 'arbiter',
    characterName: { fr: 'L’Arbiter', en: 'The Arbiter' },
    canonStatus: 'canon-inspired',
    continuityId: 'halo-2-anniversary-classic',
    contentRating: 'family',
    characterReferenceId: 'arbiter-halo-2-anniversary-classic-v1',
    rightsClass: 'unofficial-fan-art',
    credits: FAN_ART_CREDITS,
    sourceRefs: [
      'https://www.halowaypoint.com/news/canon-fodder-fighting-words',
      'https://www.halowaypoint.com/news/master-class',
      'https://www.halowaypoint.com/news/halo-2-twentieth-anniversary',
      '/sprites/generated/heroes/halo/arbiter-complete/arbiter-universal.png'
    ],
    briefs: {
      characterSolo: {
        fr: 'Thel ’Vadam dans son harnais classique Halo 2 Anniversary, principalement argent/gunmetal, anatomie Sangheili et épée à énergie cohérentes.',
        en: 'Thel ’Vadam in his classic Halo 2 Anniversary harness, mainly silver/gunmetal, with consistent Sangheili anatomy and energy sword.'
      },
      weaponSolo: {
        fr: 'Épée à énergie Type-1 cyan, poignée et deux lames entièrement visibles, isolée sans main, texte ni seconde arme.',
        en: 'Cyan Type-1 energy sword, hilt and both blades fully visible, isolated without a hand, text or second weapon.'
      },
      decorSolo: {
        fr: 'Temple Forerunner original de Delta Halo, pierre ancienne, structures métalliques et lumière froide, sans figure dominante.',
        en: 'Original Delta Halo Forerunner temple, ancient stone, metal structures and cold light, with no dominant figure.'
      },
      coherentScene: {
        fr: 'Thel médite après sa rupture avec les Prophètes dans un sanctuaire de Delta Halo, harnais Halo 2A inchangé et épée désactivée.',
        en: 'Thel reflects after breaking with the Prophets in a Delta Halo sanctuary, keeping his Halo 2A harness unchanged and sword deactivated.'
      },
      actionScene: {
        fr: 'Action Nexus : Thel charge à l’épée tandis qu’une singularité de brèche contrôlée déforme le décor, sans armure Kaidon ni pouvoir présenté comme canon Halo.',
        en: 'Nexus action: Thel charges with his sword while a controlled breach singularity distorts the scene, with no Kaidon armor or power presented as Halo canon.'
      },
      introPose: {
        fr: 'Thel arrive dignement dans un sanctuaire de Delta Halo, harnais classique Halo 2A inchangé et une seule épée à énergie complète.',
        en: 'Thel makes a dignified arrival in a Delta Halo sanctuary, keeping his classic Halo 2A harness unchanged and carrying one complete energy sword.'
      },
      victoryPose: {
        fr: 'Thel adopte une posture d’honneur retenue, épée complète abaissée, sans trophée ni livrée Kaidon.',
        en: 'Thel holds a restrained stance of honor with his complete sword lowered, without a trophy or Kaidon livery.'
      },
      defeatPose: {
        fr: 'Thel se regroupe dignement à un genou, vivant, anatomie et harnais intacts, épée faible ou désactivée; aucune humiliation ni blessure graphique.',
        en: 'Thel regroups with dignity on one knee, alive, anatomy and harness intact, sword dim or deactivated; no humiliation or graphic injury.'
      }
    }
  },
  {
    universeKey: 'resident-evil',
    universeName: { fr: 'Resident Evil', en: 'Resident Evil' },
    characterKey: 'wesker',
    characterId: 'wesker',
    characterName: { fr: 'Albert Wesker', en: 'Albert Wesker' },
    canonStatus: 'canon-inspired',
    continuityId: 'resident-evil-5-human',
    contentRating: 'family',
    characterReferenceId: 'wesker-resident-evil-5-human-v1',
    rightsClass: 'unofficial-fan-art',
    credits: FAN_ART_CREDITS,
    sourceRefs: [
      'https://game.capcom.com/residentevil/uk/exfile-2-9.html',
      'https://news.capcomusa.com/lets/browse/resident-evil-20th-anniversary-the-evolution-of-wesker',
      '/sprites/generated/heroes/resident-evil/wesker.png'
    ],
    briefs: {
      characterSolo: {
        fr: 'Wesker humain dans Resident Evil 5 : cheveux blonds plaqués, lunettes noires, long manteau tactique et Samurai Edge, sans mutation Uroboros.',
        en: 'Human Wesker in Resident Evil 5: slicked-back blond hair, black sunglasses, long tactical coat and Samurai Edge, without Uroboros mutation.'
      },
      weaponSolo: {
        fr: 'Samurai Edge tactique argent/noir isolé, profil entier et chargeur en place, sans main, gravure, emblème ou munition flottante.',
        en: 'Isolated silver-and-black Samurai Edge tactical handgun, complete profile and inserted magazine, without a hand, engraving, emblem or floating ammunition.'
      },
      decorSolo: {
        fr: 'Laboratoire biotech souterrain original de Resident Evil 5, verre, conduites et cuves scellées, sans organisme ni figure dominante.',
        en: 'Original Resident Evil 5 underground biotech laboratory, glass, pipes and sealed tanks, without an organism or dominant figure.'
      },
      coherentScene: {
        fr: 'Wesker, entièrement humain, observe calmement une cuve scellée dans un laboratoire sombre, tenue et visage stylisé inchangés.',
        en: 'A fully human Wesker calmly observes a sealed tank in a dark laboratory, keeping his outfit and stylized face unchanged.'
      },
      actionScene: {
        fr: 'Action Nexus : Wesker déclenche une onde de sélection noire et rouge près d’une cuve scellée, mais reste totalement humain, sans tentacule ni mutation.',
        en: 'Nexus action: Wesker triggers a black-and-red selection burst beside a sealed tank while remaining fully human, with no tentacle or mutation.'
      },
      introPose: {
        fr: 'Wesker entre avec contrôle dans un laboratoire biotech souterrain, forme humaine RE5, manteau, lunettes et Samurai Edge complète inchangés.',
        en: 'Wesker makes a controlled entrance into an underground biotech laboratory, keeping his human RE5 form, coat, sunglasses and complete Samurai Edge unchanged.'
      },
      victoryPose: {
        fr: 'Wesker reste debout dans une victoire froide et calculatrice au laboratoire, entièrement humain, sans trophée, Uroboros ni mutation.',
        en: 'Wesker stands in a cold, calculating laboratory victory pose, fully human, with no trophy, Uroboros or mutation.'
      },
      defeatPose: {
        fr: 'Wesker effectue un repli tactique digne, vivant, manteau, lunettes et arme intacts, toujours humain et sans gore ni Uroboros.',
        en: 'Wesker makes a dignified tactical retreat, alive, coat, sunglasses and weapon intact, still human and without gore or Uroboros.'
      }
    }
  },
  {
    universeKey: 'resident-evil',
    universeName: { fr: 'Resident Evil', en: 'Resident Evil' },
    characterKey: 'jill',
    characterId: 'jill',
    characterName: { fr: 'Jill Valentine', en: 'Jill Valentine' },
    canonStatus: 'canon-inspired',
    continuityId: 'resident-evil-1-hd-stars',
    contentRating: 'family',
    characterReferenceId: 'jill-resident-evil-1-hd-stars-v1',
    rightsClass: 'unofficial-fan-art',
    credits: FAN_ART_CREDITS,
    sourceRefs: [
      'https://game.capcom.com/residentevil/en/umbrella-20240607180000.html',
      'https://game.capcom.com/manual/bio1/',
      '/sprites/generated/heroes/resident-evil/jill.png'
    ],
    briefs: {
      characterSolo: {
        fr: 'Jill dans Resident Evil HD Remaster : uniforme tactique bleu-gris, béret, épaulières, holster et pistolet, sans tenue RE3 ni likeness réel.',
        en: 'Jill in Resident Evil HD Remaster: blue-gray tactical uniform, beret, shoulder pads, holster and handgun, without an RE3 outfit or real likeness.'
      },
      weaponSolo: {
        fr: 'Pistolet tactique S.T.A.R.S. de type Beretta 92F, isolé et entier, sans main, insigne, texte ou gravure lisible.',
        en: 'Beretta 92F-style S.T.A.R.S. tactical handgun, isolated and complete, without a hand, insignia, text or readable engraving.'
      },
      decorSolo: {
        fr: 'Safe room original du Manoir Spencer : lampe chaude, coffre, fournitures et machine à écrire sans caractères lisibles, aucun personnage dominant.',
        en: 'Original Spencer Mansion safe room: warm lamp, storage chest, supplies and a typewriter without readable characters, no dominant figure.'
      },
      coherentScene: {
        fr: 'Jill crochette calmement une porte ornée du Manoir Spencer, tenue S.T.A.R.S. RE1/HD et visage original strictement conservés.',
        en: 'Jill calmly picks an ornate Spencer Mansion door, strictly preserving her RE1/HD S.T.A.R.S. outfit and original face.'
      },
      actionScene: {
        fr: 'Action Nexus : Jill en tenue RE1 déploie une ligne de mines tactiques dans une brèche A.R.C.A. contre une menace lointaine non dominante.',
        en: 'Nexus action: Jill in her RE1 outfit deploys a tactical mine line in an A.R.C.A. breach against a distant non-dominant threat.'
      },
      introPose: {
        fr: 'Jill entre prudemment dans le hall du Manoir Spencer, tenue S.T.A.R.S. RE1/HD, visage stylisé original et pistolet complet inchangés.',
        en: 'Jill cautiously enters the Spencer Mansion hall, keeping her RE1/HD S.T.A.R.S. outfit, original stylized face and complete pistol unchanged.'
      },
      victoryPose: {
        fr: 'Jill adopte une posture de survie retenue après avoir sécurisé une pièce, équipement complet et pistolet en sécurité, sans trophée.',
        en: 'Jill holds a restrained survival stance after securing a room, equipment complete and pistol safely lowered, with no trophy.'
      },
      defeatPose: {
        fr: 'Jill se replie épuisée mais vigilante, vivante, tenue et équipement intacts; pose tactique, digne, non sexualisée et sans gore.',
        en: 'Jill regroups exhausted but alert, alive, outfit and equipment intact; the pose is tactical, dignified, non-sexualized and without gore.'
      }
    }
  },
  {
    universeKey: 'resident-evil',
    universeName: { fr: 'Resident Evil', en: 'Resident Evil' },
    characterKey: 'leon',
    characterId: 'leon',
    characterName: { fr: 'Leon S. Kennedy', en: 'Leon S. Kennedy' },
    canonStatus: 'canon-inspired',
    continuityId: 'resident-evil-2-1998',
    contentRating: 'family',
    characterReferenceId: 'leon-resident-evil-2-1998-v1',
    rightsClass: 'unofficial-fan-art',
    credits: FAN_ART_CREDITS,
    sourceRefs: [
      'https://game.capcom.com/residentevil/en/umbrella-20230324110000.html',
      'https://game.capcom.com/residentevil/en/exfile-2-6.html',
      'https://game.capcom.com/residentevil/it/re-history.html',
      '/sprites/generated/heroes/resident-evil/leon.png'
    ],
    briefs: {
      characterSolo: {
        fr: 'Leon en 1998 : jeune policier rookie blond, uniforme tactique marine à écussons neutres et pistolet de service, sans tenue RE4.',
        en: 'Leon in 1998: young blond rookie, navy tactical uniform with neutral patches and service handgun, without an RE4 outfit.'
      },
      weaponSolo: {
        fr: 'Matilda, pistolet de service fin années 1990 isolé et entièrement visible, sans main, écusson, lettre ou marquage lisible.',
        en: 'Matilda, an isolated and fully visible late-1990s service handgun, without a hand, patch, letter or readable marking.'
      },
      decorSolo: {
        fr: 'Hall principal original du commissariat-musée de Raccoon City en 1998, statue, marbre, bois sombre et pluie, sans texte ni personnage dominant.',
        en: 'Original 1998 Raccoon City museum-police-station main hall, statue, marble, dark wood and rain, without text or a dominant figure.'
      },
      coherentScene: {
        fr: 'Leon gère calmement ses rares munitions dans une chambre noire sécurisée du commissariat, tenue rookie 1998 inchangée.',
        en: 'Leon calmly manages scarce ammunition in a police-station darkroom safe area, keeping his 1998 rookie outfit unchanged.'
      },
      actionScene: {
        fr: 'Action Nexus : Leon 1998 tire un RPG-7 à travers une brèche contre une B.O.W. lointaine, sans adopter son apparence d’agent RE4.',
        en: 'Nexus action: 1998 Leon fires an RPG-7 through a breach at a distant B.O.W., without adopting his RE4 agent appearance.'
      },
      introPose: {
        fr: 'Leon rookie arrive prudemment dans le hall du commissariat-musée de Raccoon City en 1998, tenue d’origine et pistolet complet inchangés.',
        en: 'Rookie Leon cautiously arrives in the 1998 Raccoon City museum-police-station hall, keeping his original outfit and complete pistol unchanged.'
      },
      victoryPose: {
        fr: 'Leon paraît soulagé mais vigilant après avoir sécurisé une route pour les survivants, sans attitude d’agent RE4 ni trophée.',
        en: 'Leon looks relieved but vigilant after securing a route for survivors, without RE4 agent swagger or a trophy.'
      },
      defeatPose: {
        fr: 'Leon se replie à un genou, épuisé mais vivant et tactique, tenue rookie et équipement complets; aucune mort, humiliation ni blessure graphique.',
        en: 'Leon regroups on one knee, exhausted but alive and tactical, with complete rookie outfit and equipment; no death, humiliation or graphic injury.'
      }
    }
  }
];

const VARIANT_APPROVAL_REF = '/docs/cg/variant-wave-approvals.json';

const fanArtSlot = ({ type, label, brief, rarity = 'rare', sourceRefs = [] }) => Object.freeze({
  type,
  label: Object.freeze(label),
  brief: Object.freeze(brief),
  rarity,
  family: 'Fan Art',
  canonStatus: 'fan-art',
  contentRating: 'family',
  sourceRefs: Object.freeze(sourceRefs)
});

const whatIfSlot = ({
  type,
  label,
  brief,
  continuityId,
  characterReferenceId,
  contentRating = 'family',
  rarity = 'anomaly',
  sourceRefs = []
}) => Object.freeze({
  type,
  label: Object.freeze(label),
  brief: Object.freeze(brief),
  rarity,
  family: 'What If',
  canonStatus: 'what-if',
  continuityId,
  contentRating,
  characterReferenceId,
  sourceRefs: Object.freeze(sourceRefs)
});

const VARIANT_WAVES = Object.freeze({
  player_anchor: Object.freeze({
    ageStatus: 'unknown-family-safe-only',
    consentStatus: 'no-romance',
    slots: Object.freeze([
      fanArtSlot({
        type: 'goofy',
        label: { fr: 'Gag de brèche', en: 'Breach Gag' },
        brief: {
          fr: 'L’Ancre casquée tente très sérieusement de contenir une minuscule brèche qui lui dérobe un outil; gag familial, identité et armure fermée inchangées.',
          en: 'The helmeted Anchor very seriously tries to contain a tiny breach stealing a tool; a family-safe gag with the closed armor identity unchanged.'
        }
      }),
      whatIfSlot({
        type: 'alignmentSwap',
        label: { fr: 'Alignement inversé', en: 'Alignment Swap' },
        continuityId: 'project-canon+what-if:arca-defector',
        characterReferenceId: 'player-anchor-alignment-swap-v1',
        brief: {
          fr: 'Branche What If : l’Ancre devient une opératrice froide de la Convergence, armure d’origine assombrie et énergie magenta hostile, sans victime.',
          en: 'What If branch: the Anchor becomes a cold Convergence operative, with the original armor darkened and hostile magenta energy, without victims.'
        }
      }),
      whatIfSlot({
        type: 'zombieVersion',
        label: { fr: 'Corruption Nexus', en: 'Nexus Corruption' },
        continuityId: 'project-canon+what-if:nexus-corruption',
        brief: {
          fr: 'Branche What If : corruption Nexus lisible par des fissures lumineuses sur l’armure fermée; aucune chair, blessure ou violence graphique.',
          en: 'What If branch: readable Nexus corruption shown as luminous cracks across the closed armor; no flesh, injury or graphic violence.'
        }
      }),
      whatIfSlot({
        type: 'firstStep',
        label: { fr: 'Première brèche', en: 'First Breach' },
        continuityId: 'project-canon-first-breach',
        characterReferenceId: 'player-anchor-first-breach-v1',
        rarity: 'epic',
        brief: {
          fr: 'Variante temporelle : premier pas réel de l’Ancre devant une brèche A.R.C.A. naissante, équipement plus neuf mais casque et silhouette identitaires conservés.',
          en: 'Timeline variant: the Anchor’s real first step before a forming A.R.C.A. breach, with newer equipment while preserving the identifying helmet and silhouette.'
        }
      })
    ])
  }),
  masterchief: Object.freeze({
    ageStatus: 'adult-confirmed',
    consentStatus: 'no-romance',
    slots: Object.freeze([
      fanArtSlot({
        type: 'goofy',
        label: { fr: 'Gag fidèle', en: 'Faithful Gag' },
        brief: {
          fr: 'Chief en armure GEN3 fermée désactive méthodiquement une minuscule tour de propagande Banished puis incline le casque devant son absurdité; aucun texte lisible.',
          en: 'Chief in closed GEN3 armor methodically disables a tiny Banished propaganda tower, then tilts his helmet at its absurdity; no readable text.'
        }
      }),
      whatIfSlot({
        type: 'alignmentSwap',
        label: { fr: 'Alignement inversé', en: 'Alignment Swap' },
        continuityId: 'halo-infinite-gen3+what-if:created-loyalist',
        characterReferenceId: 'masterchief-created-alignment-swap-v1',
        brief: {
          fr: 'Branche What If : John-117 reste loyal aux Created par fidélité mal placée envers Cortana, GEN3 olive parcourue de hardlight froid, sans victime.',
          en: 'What If branch: John-117 remains loyal to the Created through misplaced loyalty to Cortana, his olive GEN3 crossed by cold hardlight, without victims.'
        },
        sourceRefs: ['https://www.halowaypoint.com/news/canon-fodder-of-protocols-and-prisons']
      }),
      whatIfSlot({
        type: 'iconicOutfitSwap',
        label: { fr: 'Tenue iconique inversée', en: 'Iconic Outfit Swap' },
        continuityId: 'halo-infinite-gen3+what-if:arbiter-harness-swap',
        characterReferenceId: 'masterchief-arbiter-outfit-swap-v1',
        brief: {
          fr: 'Branche What If : volumes MJOLNIR humains réinterprétés en argent, gunmetal et or comme le harnais de l’Arbiter; anatomie humaine, casque fermé et fusil MA40 conservés.',
          en: 'What If branch: human MJOLNIR volumes reinterpreted in silver, gunmetal and gold like the Arbiter’s harness; human anatomy, closed helmet and MA40 retained.'
        },
        sourceRefs: ['/cg/halo/arbiter/character-solo-openai-v1.png']
      }),
      whatIfSlot({
        type: 'zombieVersion',
        label: { fr: 'Infection Flood', en: 'Flood Infection' },
        continuityId: 'halo-infinite-gen3+what-if:flood-infection',
        contentRating: 'teen',
        brief: {
          fr: 'Branche What If non canon : infection Flood précoce et non graphique aux jointures d’une GEN3 encore lisible, casque fermé, sans gore ni membre arraché.',
          en: 'Non-canon What If branch: early, non-graphic Flood infection at the joints of still-readable GEN3 armor, closed helmet, no gore or severed limb.'
        },
        sourceRefs: ['https://www.halowaypoint.com/news/flood-of-flavor']
      }),
      whatIfSlot({
        type: 'firstStep',
        label: { fr: 'Premier Halo', en: 'First Halo' },
        continuityId: 'halo-combat-evolved-mark-v-2552',
        characterReferenceId: 'masterchief-halo-ce-mark-v-first-step-v1',
        rarity: 'epic',
        brief: {
          fr: 'Variante temporelle attestée : John-117 adulte en armure Mark V de Combat Evolved avec MA5B sur l’Installation 04 originelle; jamais représenté enfant.',
          en: 'Attested timeline variant: adult John-117 in Combat Evolved Mark V armor with an MA5B on the original Installation 04; never depicted as a child.'
        },
        sourceRefs: ['https://www.halowaypoint.com/news/master-class']
      })
    ])
  }),
  arbiter: Object.freeze({
    ageStatus: 'adult-confirmed',
    consentStatus: 'no-romance',
    slots: Object.freeze([
      fanArtSlot({
        type: 'goofy',
        label: { fr: 'Gag fidèle', en: 'Faithful Gag' },
        brief: {
          fr: 'Thel ’Vadam en harnais Halo 2A répare dignement un petit piédestal covenant endommagé avec une minuscule clé tout en tenant son épée à énergie; gag fidèle sans texte.',
          en: 'Thel ’Vadam in his Halo 2A harness dignifiedly repairs a small damaged Covenant pedestal with a tiny wrench while holding his energy sword; a faithful gag without text.'
        }
      }),
      whatIfSlot({
        type: 'alignmentSwap',
        label: { fr: 'Alignement inversé', en: 'Alignment Swap' },
        continuityId: 'halo-2-anniversary-classic+what-if:prophet-loyalist',
        characterReferenceId: 'arbiter-prophet-loyal-alignment-swap-v1',
        brief: {
          fr: 'Branche What If : Thel demeure l’Arbiter loyal aux Prophètes, harnais Halo 2A et épée conservés dans un sanctuaire covenant violet, sans victime.',
          en: 'What If branch: Thel remains the Prophets’ loyal Arbiter, retaining his Halo 2A harness and sword in a violet Covenant sanctuary, without victims.'
        }
      }),
      whatIfSlot({
        type: 'iconicOutfitSwap',
        label: { fr: 'Tenue iconique inversée', en: 'Iconic Outfit Swap' },
        continuityId: 'halo-2-anniversary-classic+what-if:mjolnir-swap',
        characterReferenceId: 'arbiter-masterchief-outfit-swap-v1',
        brief: {
          fr: 'Branche What If : harnais ajusté à l’anatomie Sangheili avec volumes olive inspirés de la GEN3, tout en conservant mandibules, jambes digitigrades et épée à énergie.',
          en: 'What If branch: a Sangheili-fitted harness with olive GEN3-inspired volumes while retaining mandibles, digitigrade legs and the energy sword.'
        },
        sourceRefs: ['/cg/halo/masterchief/character-solo-openai-v1.png']
      }),
      whatIfSlot({
        type: 'zombieVersion',
        label: { fr: 'Infection Flood', en: 'Flood Infection' },
        continuityId: 'halo-2-anniversary-classic+what-if:flood-infection',
        contentRating: 'teen',
        brief: {
          fr: 'Branche What If non canon : infection Flood précoce, lisible et non graphique sur Thel, harnais argent toujours identifiable, sans gore ni anatomie mutilée.',
          en: 'Non-canon What If branch: early, readable and non-graphic Flood infection on Thel, with the silver harness still identifiable and no gore or mutilation.'
        },
        sourceRefs: ['https://www.halowaypoint.com/news/flood-of-flavor']
      }),
      whatIfSlot({
        type: 'futureExperienced',
        label: { fr: 'Kaidon expérimenté', en: 'Experienced Kaidon' },
        continuityId: 'halo-5-2559-kaidon',
        characterReferenceId: 'arbiter-halo-5-kaidon-future-v1',
        rarity: 'epic',
        brief: {
          fr: 'Variante temporelle attestée : Thel en 2559, Kaidon des Swords of Sanghelios dans une livrée Halo 5 distincte du harnais Halo 2A, au domaine Vadam original.',
          en: 'Attested timeline variant: Thel in 2559, Kaidon of the Swords of Sanghelios in Halo 5 livery distinct from his Halo 2A harness, at an original Vadam keep.'
        },
        sourceRefs: [
          'https://www.halowaypoint.com/news/customization-overview-great-journey',
          'https://www.halowaypoint.com/news/canon-fodder-feet-first-into-fall'
        ]
      })
    ])
  }),
  wesker: Object.freeze({
    ageStatus: 'adult-confirmed',
    consentStatus: 'no-romance',
    slots: Object.freeze([
      fanArtSlot({
        type: 'beachFamily',
        label: { fr: 'Plage familiale', en: 'Family Beach' },
        brief: {
          fr: 'Wesker adulte surveille froidement une plage publique en tenue estivale noire couvrante et lunettes, posture naturelle non sexualisée, sans arme ni romance.',
          en: 'Adult Wesker coldly surveys a public beach in a covering black summer outfit and sunglasses, natural non-sexualized pose, no weapon or romance.'
        }
      }),
      fanArtSlot({
        type: 'maidService',
        label: { fr: 'Service tactique', en: 'Tactical Service' },
        brief: {
          fr: 'Wesker adulte dans une tenue professionnelle noire de maître d’hôtel tactique transporte du linge propre avec une précision glaciale; familial, non sexualisé et sans gag humiliant.',
          en: 'Adult Wesker in a professional black tactical butler outfit carries clean linens with icy precision; family-safe, non-sexualized and not humiliating.'
        }
      }),
      fanArtSlot({
        type: 'goofy',
        label: { fr: 'Gag fidèle', en: 'Faithful Gag' },
        brief: {
          fr: 'Wesker analyse avec un sérieux excessif une plante verte ordinaire dans un laboratoire, lunettes et contrôle inchangés; gag visuel sans texte.',
          en: 'Wesker studies an ordinary green herb with excessive seriousness in a laboratory, preserving his sunglasses and composure; a visual gag without text.'
        }
      }),
      whatIfSlot({
        type: 'alignmentSwap',
        label: { fr: 'Alignement inversé', en: 'Alignment Swap' },
        continuityId: 'resident-evil-5-human+what-if:bsaa-ally',
        characterReferenceId: 'wesker-bsaa-alignment-swap-v1',
        brief: {
          fr: 'Branche What If : Wesker choisit d’aider le BSAA et guide une fouille de secours dans un refuge en ruine, long manteau tactique clair et lanterne, sans victime ni mutation.',
          en: 'What If branch: Wesker chooses to help the BSAA and guides a rescue search through a ruined safe house, wearing a light tactical coat and carrying a lantern, without victims or mutation.'
        }
      }),
      whatIfSlot({
        type: 'genderSwap',
        label: { fr: 'Genre inversé', en: 'Gender Swap' },
        continuityId: 'resident-evil-5-human+what-if:gender-swap',
        characterReferenceId: 'wesker-gender-swap-v1',
        brief: {
          fr: 'Branche What If séparée : interprétation féminine adulte de Wesker, même autorité froide, cheveux blonds plaqués, lunettes et manteau tactique RE5; aucune sexualisation.',
          en: 'Separate What If branch: an adult female interpretation of Wesker with the same cold authority, slick blond hair, sunglasses and RE5 tactical coat; no sexualization.'
        }
      }),
      whatIfSlot({
        type: 'zombieVersion',
        label: { fr: 'Corruption Uroboros', en: 'Uroboros Corruption' },
        continuityId: 'resident-evil-5-human+what-if:uroboros-corruption',
        contentRating: 'teen',
        brief: {
          fr: 'Branche What If : contamination Uroboros précoce lisible par des filaments noirs contenus autour d’un Wesker encore identifiable; sans gore, plaie ni membre déformé.',
          en: 'What If branch: early Uroboros contamination readable as contained black filaments around an identifiable Wesker; no gore, wound or deformed limb.'
        }
      }),
      whatIfSlot({
        type: 'firstStep',
        label: { fr: 'Capitaine S.T.A.R.S.', en: 'S.T.A.R.S. Captain' },
        continuityId: 'resident-evil-1-1998-stars',
        characterReferenceId: 'wesker-stars-1998-first-step-v1',
        rarity: 'epic',
        brief: {
          fr: 'Variante temporelle attestée : Wesker adulte capitaine S.T.A.R.S. en 1998 dans le Manoir Spencer, uniforme tactique de l’époque et lunettes, aucun likeness réel.',
          en: 'Attested timeline variant: adult Wesker as S.T.A.R.S. captain in 1998 at Spencer Mansion, with period tactical uniform and sunglasses, no real likeness.'
        },
        sourceRefs: ['https://game.capcom.com/residentevil/uk/exfile-2-9.html']
      })
    ])
  }),
  jill: Object.freeze({
    ageStatus: 'adult-confirmed',
    consentStatus: 'no-romance',
    slots: Object.freeze([
      fanArtSlot({
        type: 'beachFamily',
        label: { fr: 'Plage familiale', en: 'Family Beach' },
        brief: {
          fr: 'Jill adulte sur une plage publique en tenue estivale sportive couvrante bleu-gris, posture naturelle et active; familial, non sexualisé, sans arme ni romance.',
          en: 'Adult Jill on a public beach in a covering blue-gray athletic summer outfit, natural active pose; family-safe, non-sexualized, no weapon or romance.'
        }
      }),
      fanArtSlot({
        type: 'maidService',
        label: { fr: 'Service du refuge', en: 'Safe-Room Service' },
        brief: {
          fr: 'Jill adulte en uniforme professionnel bleu de gestionnaire de refuge, range méthodiquement des fournitures; familial, pratique, non sexualisé et sans soumission.',
          en: 'Adult Jill in a professional blue safe-room steward uniform methodically organizes supplies; family-safe, practical, non-sexualized and not submissive.'
        }
      }),
      fanArtSlot({
        type: 'goofy',
        label: { fr: 'Gag fidèle', en: 'Faithful Gag' },
        brief: {
          fr: 'Jill tente de faire entrer beaucoup trop d’herbes de soin dans une petite sacoche tactique, avec un calme professionnel; gag visuel sans texte.',
          en: 'Jill tries to fit far too many healing herbs into a small tactical pouch with professional calm; a visual gag without text.'
        }
      }),
      whatIfSlot({
        type: 'alignmentSwap',
        label: { fr: 'Alignement inversé', en: 'Alignment Swap' },
        continuityId: 'resident-evil-1-hd-stars+what-if:umbrella-operative',
        characterReferenceId: 'jill-umbrella-alignment-swap-v1',
        brief: {
          fr: 'Branche What If : Jill devient une opératrice biotech rivale en uniforme tactique rouge sombre sans logo, tout en conservant compétence et silhouette; aucune victime.',
          en: 'What If branch: Jill becomes a rival biotech operative in a dark-red tactical uniform without logos, retaining her skill and silhouette; no victims.'
        }
      }),
      whatIfSlot({
        type: 'genderSwap',
        label: { fr: 'Genre inversé', en: 'Gender Swap' },
        continuityId: 'resident-evil-1-hd-stars+what-if:gender-swap',
        characterReferenceId: 'jill-gender-swap-v1',
        brief: {
          fr: 'Branche What If séparée : interprétation masculine adulte de Jill, même uniforme S.T.A.R.S. bleu-gris, béret, équipement et compétence; aucune caricature.',
          en: 'Separate What If branch: an adult male interpretation of Jill with the same blue-gray S.T.A.R.S. uniform, beret, equipment and competence; no caricature.'
        }
      }),
      whatIfSlot({
        type: 'zombieVersion',
        label: { fr: 'Infection virale', en: 'Viral Infection' },
        continuityId: 'resident-evil-1-hd-stars+what-if:viral-infection',
        contentRating: 'teen',
        brief: {
          fr: 'Branche What If : infection virale précoce signalée par pâleur et veines discrètes, Jill et uniforme toujours lisibles; sans gore, plaie ou posture humiliée.',
          en: 'What If branch: early viral infection shown by pallor and subtle veins, with Jill and her uniform still readable; no gore, wound or humiliating pose.'
        }
      }),
      whatIfSlot({
        type: 'futureExperienced',
        label: { fr: 'Agente BSAA expérimentée', en: 'Experienced BSAA Agent' },
        continuityId: 'resident-evil-revelations-bsaa',
        characterReferenceId: 'jill-revelations-bsaa-future-v1',
        rarity: 'epic',
        brief: {
          fr: 'Variante temporelle attestée : Jill adulte devenue agente BSAA expérimentée, tenue tactique maritime inspirée de Revelations dans un navire original, sans likeness réel.',
          en: 'Attested timeline variant: adult Jill as an experienced BSAA agent, wearing Revelations-inspired maritime tactical gear aboard an original ship, no real likeness.'
        },
        sourceRefs: ['https://game.capcom.com/residentevil/it/umbrella-20220630110000.html']
      })
    ])
  }),
  leon: Object.freeze({
    ageStatus: 'adult-confirmed',
    consentStatus: 'no-romance',
    slots: Object.freeze([
      fanArtSlot({
        type: 'beachFamily',
        label: { fr: 'Plage familiale', en: 'Family Beach' },
        brief: {
          fr: 'Leon adulte sur une plage publique en tenue estivale sportive marine couvrante, aide à sécuriser une zone, posture naturelle; familial, non sexualisé, sans romance.',
          en: 'Adult Leon on a public beach in a covering navy athletic summer outfit, helping secure the area in a natural pose; family-safe, non-sexualized, no romance.'
        }
      }),
      fanArtSlot({
        type: 'maidService',
        label: { fr: 'Service du refuge', en: 'Safe-Room Service' },
        brief: {
          fr: 'Leon adulte en uniforme professionnel marine de concierge de refuge, distribue des fournitures avec sérieux; familial, non sexualisé, sans soumission ni romance.',
          en: 'Adult Leon in a professional navy safe-room concierge uniform distributes supplies seriously; family-safe, non-sexualized, not submissive and no romance.'
        }
      }),
      fanArtSlot({
        type: 'goofy',
        label: { fr: 'Gag fidèle', en: 'Faithful Gag' },
        brief: {
          fr: 'Leon rookie tente d’emporter simultanément plusieurs clés inutilement élaborées du commissariat, restant vigilant malgré l’encombrement; aucun texte.',
          en: 'Rookie Leon tries to carry several unnecessarily elaborate police-station keys at once, staying alert despite the clutter; no text.'
        }
      }),
      whatIfSlot({
        type: 'alignmentSwap',
        label: { fr: 'Alignement inversé', en: 'Alignment Swap' },
        continuityId: 'resident-evil-2-1998+what-if:umbrella-security',
        characterReferenceId: 'leon-umbrella-alignment-swap-v1',
        brief: {
          fr: 'Branche What If : Leon rejoint une sécurité biotech rivale en uniforme noir et rouge sans logo dans un laboratoire scellé, tout en restant humain; aucune victime.',
          en: 'What If branch: Leon joins rival biotech security in a black-and-red uniform without logos inside a sealed laboratory, remaining human; no victims.'
        }
      }),
      whatIfSlot({
        type: 'genderSwap',
        label: { fr: 'Genre inversé', en: 'Gender Swap' },
        continuityId: 'resident-evil-2-1998+what-if:gender-swap',
        characterReferenceId: 'leon-gender-swap-v1',
        brief: {
          fr: 'Branche What If séparée : interprétation féminine adulte de Leon rookie, même coupe blonde rideau, uniforme marine et compétence; aucune sexualisation.',
          en: 'Separate What If branch: an adult female interpretation of rookie Leon with the same blond curtain haircut, navy uniform and competence; no sexualization.'
        }
      }),
      whatIfSlot({
        type: 'zombieVersion',
        label: { fr: 'Infection virale', en: 'Viral Infection' },
        continuityId: 'resident-evil-2-1998+what-if:viral-infection',
        contentRating: 'teen',
        brief: {
          fr: 'Branche What If : infection virale précoce signalée par pâleur et veines discrètes, uniforme rookie toujours lisible; sans gore, morsure ouverte ni humiliation.',
          en: 'What If branch: early viral infection shown by pallor and subtle veins, with the rookie uniform still readable; no gore, open bite or humiliation.'
        }
      }),
      whatIfSlot({
        type: 'futureExperienced',
        label: { fr: 'Agent fédéral expérimenté', en: 'Experienced Federal Agent' },
        continuityId: 'resident-evil-4-agent-2004',
        characterReferenceId: 'leon-re4-agent-future-v1',
        rarity: 'epic',
        brief: {
          fr: 'Variante temporelle attestée : Leon adulte devenu agent fédéral expérimenté, veste tactique et équipement de mission inspirés de RE4 dans un hangar de déploiement original, sans likeness réel.',
          en: 'Attested timeline variant: adult Leon as an experienced federal agent, with RE4-inspired tactical jacket and mission gear in an original deployment hangar, no real likeness.'
        },
        sourceRefs: ['https://game.capcom.com/residentevil/en/umbrella-20230324110000.html']
      })
    ])
  })
});

const createSlotDefinition = (profile, slot) => {
  const isNexusAction = slot.type === 'actionScene';
  const variantWave = VARIANT_WAVES[profile.characterId];
  const isVariant = slot.family === 'Fan Art' || slot.family === 'What If';
  const characterReferencePath = `/cg/${profile.universeKey}/${profile.characterKey}/character-solo-openai-v1.png`;
  const promptNamespace = profile.promptNamespace || profile.universeKey;

  return createCgDefinition({
    universeKey: profile.universeKey,
    universeName: profile.universeName,
    characterKey: profile.characterKey,
    characterId: profile.characterId,
    characterName: profile.characterName,
    title: {
      fr: `${profile.characterName.fr} — ${slot.label.fr}`,
      en: `${profile.characterName.en} — ${slot.label.en}`
    },
    type: slot.type,
    family: slot.family || (isNexusAction ? 'Nexus' : 'Canon'),
    rarity: slot.rarity,
    canonStatus: slot.canonStatus || (isNexusAction && profile.rightsClass === 'unofficial-fan-art'
      ? 'nexus-variant'
      : profile.canonStatus),
    continuityId: slot.continuityId || (isVariant
      ? `${profile.continuityId}+${slot.family.toLowerCase().replace(/\s+/g, '-')}:${toKebabCase(slot.type)}`
      : isNexusAction && profile.rightsClass === 'unofficial-fan-art'
      ? `${profile.continuityId}+nexus`
      : profile.continuityId),
    contentRating: slot.contentRating || profile.contentRating,
    ageStatus: isVariant ? variantWave.ageStatus : 'not-required',
    consentStatus: isVariant ? variantWave.consentStatus : 'not-required',
    characterReferenceId: slot.characterReferenceId || profile.characterReferenceId,
    promptId: `cg-${promptNamespace}-${profile.characterKey}-${toKebabCase(slot.type)}-openai-v1`,
    promptSummary: slot.brief || profile.briefs[slot.type],
    publishedAt: PUBLISHED_AT,
    source: 'openai',
    rightsClass: profile.rightsClass,
    sourceRefs: slot.type === 'characterSolo'
      ? profile.sourceRefs
      : [
          ...profile.sourceRefs,
          characterReferencePath,
          ...(isVariant ? [VARIANT_APPROVAL_REF] : []),
          ...(slot.sourceRefs || [])
        ],
    credits: profile.credits,
    unlock: { type: 'heroOwned', heroId: profile.characterId }
  });
};

export const CG_CATALOG = Object.freeze(CHARACTER_PROFILES.flatMap((profile) => (
  [...SLOT_DEFINITIONS, ...(VARIANT_WAVES[profile.characterId]?.slots || [])]
    .map((slot) => createSlotDefinition(profile, slot))
)));

export const CG_BY_ID = Object.freeze(Object.fromEntries(
  CG_CATALOG.map((definition) => [definition.id, definition])
));

export const getCgDefinition = (cgId) => CG_BY_ID[cgId] || null;
