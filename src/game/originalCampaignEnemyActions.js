import { ORIGINAL_UNIVERSE_DEFINITIONS } from './originalUniverseWave.js';

// Concrete RPG secondaries for the original campaign.
// Adapts the declared weapon and signature to the effects the RPG supports.
const secondary = (name, type, targeting, dmg = 1.45, statusEffect = null) => Object.freeze({
  name, type, targeting: Object.freeze(targeting), dmg, cd: 3,
  ...(statusEffect ? { statusEffect } : {})
});
const contact = name => secondary(name, 'melee', { delivery: 'melee', shape: 'single' });
const contactDisruption = name => secondary(name, 'melee', { delivery: 'melee', shape: 'single' }, 1.05, 'glitched');
const radial = (name, areaRadius, statusEffect) => secondary(name, 'blast_aoe', {
  delivery: 'radial', shape: 'area', range: areaRadius, areaRadius
}, 0.95, statusEffect);
const zone = (name, areaRadius, statusEffect) => secondary(name, 'blast_aoe', {
  delivery: 'area', shape: 'area', areaRadius
}, 1, statusEffect);
const line = (name, lineWidth, delivery = 'projectile') => secondary(name, delivery, {
  delivery, shape: 'line', lineWidth
}, 1.05);
const cone = (name, coneAngle) => secondary(name, 'spray', {
  delivery: 'projectile', shape: 'cone', coneAngle
}, 1);
const disruption = (name, dmg = 1.05) => secondary(name, 'glitch', { delivery: 'ranged', shape: 'single' }, dmg, 'glitched');
const guard = (name, targetSide, shape, reduce, range, excludeSelf = false) => secondary(name, 'shield', {
  effect: 'guard', targetSide, shape, reduce, ...(range ? { range } : {}), duration: 2.5, excludeSelf
}, 0);
const selfGuard = (name, reduce) => guard(name, 'self', 'single', reduce);
const groupGuard = (name, reduce, range) => guard(name, 'ally', 'group', reduce, range);
const allyGuard = (name, reduce, range) => guard(name, 'ally', 'single', reduce, range, true);
const repair = (name, healRatio, range, shape = 'single') => secondary(name, 'heal', {
  effect: 'heal', targetSide: 'ally', shape, healRatio, range, excludeSelf: true
}, 0);
const selfHeal = (name, healRatio) => secondary(name, 'heal', {
  effect: 'heal', targetSide: 'self', shape: 'single', healRatio
}, 0);
const alliesBuff = (name, buffMultiplier, range) => secondary(name, 'buff', {
  effect: 'buff', targetSide: 'ally', shape: 'group', buffMultiplier, range, duration: 3, excludeSelf: true
}, 0);
const selfBuff = (name, buffMultiplier) => secondary(name, 'buff', {
  effect: 'buff', targetSide: 'self', shape: 'single', buffMultiplier, duration: 3
}, 0);
const record = (name, weapon, signature, action) => ({ name, weapon, signature, action });
const loreRecord = (name, weapon, special, lore, action, scope) => ({ name, weapon, special, lore, action, ...scope });

const byUniverse = new Map(Object.entries({
  'The Aether Crown': {
    'aether_crown:brass_constable': record('Brass Constable', 'shield_bash',
      'Bouclier de laiton et matraque pneumatique.', contact('Matraque pneumatique')),
    'aether_crown:coalbound_golem': record('Coalbound Golem', 'heavy_melee',
      'Automate alimenté par un cœur de charbon humain.', radial('Choc de la fournaise', 135)),
    'aether_crown:aether_mite_swarm': record('Aether Mite Swarm', 'staff',
      'Ronge les jauges et les dispositifs énergétiques.', cone('Morsures de l’essaim', 55)),
    'aether_crown:sky_corsair_press_gang': record('Sky Corsair Press-Gang', 'blade',
      'Projette les héros entre les plateformes.', contact('Taille d’abordage')),
    'aether_crown:pressure_wraith': record('Pressure Wraith', 'magic',
      'Explose si sa pression n’est pas purgée à temps.', radial('Surpression de la conduite', 170))
  },
  'Meridian Clockwork': {
    'meridian_clockwork:escapement_guard': record('Escapement Guard', 'shield_bash',
      'Bloque les déplacements avec des ancres d’horloge.', selfGuard('Ancre d’échappement', 0.4)),
    'meridian_clockwork:springblade_automaton': record('Springblade Automaton', 'claws',
      'Accumule de la tension avant une ruée tranchante.', contact('Ruée des lames à ressort')),
    'meridian_clockwork:gearwing_falcon': record('Gearwing Falcon', 'blade',
      'Marque les cibles depuis les hauteurs.', contact('Piqué d’engrenage')),
    'meridian_clockwork:pendulum_penitent': record('Pendulum Penitent', 'heavy_melee',
      'Frappe alternativement les deux côtés de l’arène.', radial('Balayage des deux balanciers', 155)),
    'meridian_clockwork:hour_thief': record('Hour-Thief', 'magic',
      'Retire du temps de recharge aux boss et en ajoute aux héros.', disruption('Heure dérobée'))
  },
  'Iron Tempest': {
    'iron_tempest:soot_legionnaire': record('Soot Legionnaire', 'shield_bash',
      'Infanterie blindée à masque filtrant.', selfGuard('Couvert du bouclier de suie', 0.35)),
    'iron_tempest:gyro_trooper': record('Gyro Trooper', 'blade',
      'Saute derrière les lignes avec un rotor dorsal.', contact('Taille du rotor')),
    'iron_tempest:trench_automaton': record('Trench Automaton', 'staff',
      'Répare les barricades et ravitaille les boss.', repair('Réparations de campagne', 0.18, 210)),
    'iron_tempest:fuel_hound': record('Fuel Hound', 'claws',
      'Explose près de la cible marquée.', zone('Explosion du molosse', 95)),
    'iron_tempest:propaganda_drone': record('Propaganda Drone', 'magic',
      'Impose de faux objectifs et brouille le HUD.', zone('Parasites de l’émetteur', 110, 'glitched'))
  },
  'Helios 56': {
    'helios_56:isotope_mite': record('Isotope Mite', 'melee',
      'Se nourrit des boucliers et laisse une zone irradiée.', radial('Contamination isotopique', 142, 'radiated')),
    'helios_56:civil_defense_automaton': record('Civil Defense Automaton', 'shield_bash',
      'Protège les panneaux de propagande au lieu des civils.', groupGuard('Paravent atomique', 0.32, 180)),
    'helios_56:radglass_mutant': record('Radglass Mutant', 'heavy_melee',
      'Réfracte les rayons et renvoie une partie des dégâts.', line('Rayon réfracté', 54, 'beam')),
    'helios_56:saucer_scout': record('Saucer Scout', 'blade',
      'Enlève temporairement une unité vers une plateforme haute.', contact('Griffe de la soucoupe')),
    'helios_56:happy_home_servitor': record('Happy Home Servitor', 'staff',
      'Soigne les ennemis en diffusant des jingles hypnotiques.', repair('Jingle réparateur', 0.20, 260, 'group'))
  },
  'Kemet: The Devoured Sun': {
    'kemet_devoured_sun:shabti_corrompu': record('Shabti corrompu', 'shield_bash',
      'Statue servile animée par un ordre falsifié; elle protège le scribe qui l’a réveillée.', allyGuard('Protection du scribe', 0.42, 200)),
    'kemet_devoured_sun:serpent_des_dunes': record('Serpent des dunes', 'claws',
      'S’enfouit puis frappe la cible isolée depuis une case de sable.', contact('Morsure des dunes')),
    'kemet_devoured_sun:ombre_de_ba': record('Ombre de Ba', 'magic',
      'Vole une portion de jauge spéciale et crée un double spectral.', zone('Ombre de Ba', 75)),
    'kemet_devoured_sun:chacal_de_tombe': record('Chacal de tombe', 'blade',
      'Marque les héros blessés et accélère à chaque porte funéraire ouverte.', contact('Entaille funéraire')),
    'kemet_devoured_sun:pretre_d_isfet': record('Prêtre d’Isfet', 'staff',
      'Inverse temporairement les bonus de Maât et renforce les créatures du chaos.', alliesBuff('Bénédiction d’Isfet', 1.2, 225))
  },
  'Imperium Aeternum': {
    'imperium_aeternum:lemure_de_la_maison_vide': record('Lémure de la Maison Vide', 'magic',
      'Traverse les murs et affaiblit les héros éloignés du feu civique.', disruption('Épuisement du Lémure')),
    'imperium_aeternum:legionnaire_au_serment_brise': record('Légionnaire au serment brisé', 'shield_bash',
      'Gagne de la défense tant qu’un commandant hostile demeure vivant.', selfGuard('Abri du serment rompu', 0.42)),
    'imperium_aeternum:louve_de_bronze': record('Louve de bronze', 'blade',
      'Automate rapide qui protège les enseignes impériales.', contact('Crocs de l’enseigne')),
    'imperium_aeternum:oracle_des_dirae': record('Oracle des Dirae', 'staff',
      'Transforme une case sûre en présage néfaste au tour suivant.', zone('Présage des Dirae', 100)),
    'imperium_aeternum:aquila_mecanique': record('Aquila mécanique', 'claws',
      'Plonge sur la cible qui porte le plus de reliques.', contact('Piqué de l’Aquila'))
  },
  'The Crownless Sea': {
    'crownless_sea:corsaire_noye': record('Corsaire noyé', 'shield_bash',
      'Revient depuis l’eau tant que son contrat de marque n’est pas brûlé.', contact('Coup du bouclier noyé')),
    'crownless_sea:goule_a_poudre': record('Goule à poudre', 'heavy_melee',
      'Explose près des barils et peut déclencher des réactions en chaîne.', zone('Baril à poudre', 105)),
    'crownless_sea:sirene_de_recif': record('Sirène de récif', 'magic',
      'Attire les unités vers les bords ou brouille la direction des commandes.', disruption('Appel du récif')),
    'crownless_sea:fusilier_de_la_marine_de_la_couronne': record('Fusilier de la Marine de la Couronne', 'staff',
      'Pose des lignes de tir et protège les officiers.', line('Ligne de la Marine', 45)),
    'crownless_sea:coffre_mimetique': record('Coffre mimétique', 'claws',
      'Imite une récompense puis avale la première unité qui le ramasse.', contact('Morsure du coffre'))
  },
  'The Drowned Testament': {
    'drowned_testament:cultiste_lie_au_sel': record('Cultiste lié au sel', 'staff',
      'Chante pour augmenter la Pression de Rêve et renforcer les créatures marines.', alliesBuff('Chant lié au sel', 1.18, 235)),
    'drowned_testament:sangsue_de_reve': record('Sangsue de rêve', 'claws',
      'S’attache à la compétence la plus utilisée et augmente son temps de recharge.', contactDisruption('Emprise de la sangsue')),
    'drowned_testament:rejeton_du_ch_ur_profond': record('Rejeton du Chœur Profond', 'heavy_melee',
      'Ses cris superposés créent des zones où l’interface devient incertaine.', radial('Hurlement du Chœur', 148)),
    'drowned_testament:traqueur_d_angles': record('Traqueur d’angles', 'blade',
      'Se déplace entre deux coins non adjacents sans traverser l’espace.', contact('Entaille d’angle')),
    'drowned_testament:coquille_couverte_de_balanes': record('Coquille couverte de balanes', 'shield_bash',
      'Ancien habitant vidé de sa voix; l’armure tombe lorsque son nom est retrouvé.', selfGuard('Carapace de balanes', 0.4))
  },
  'Aegea: War of the Moirai': {
    'aegea_moirai:harpie_des_vents_contraires': record('Harpie des vents contraires', 'blade',
      'Déplace les héros et vole les objets non ramassés.', contact('Serres du vent contraire')),
    'aegea_moirai:myrmidon_d_ombre': record('Myrmidon d’ombre', 'shield_bash',
      'Gagne de la puissance en formation avec d’autres Myrmidons.', groupGuard('Formation des boucliers', 0.33, 170)),
    'aegea_moirai:sentinelle_gorgone': record('Sentinelle gorgone', 'magic',
      'Pétrifie une case annoncée un tour à l’avance.', zone('Regard annoncé de la Sentinelle', 88, 'glitched')),
    'aegea_moirai:fragment_de_talos': record('Fragment de Talos', 'heavy_melee',
      'Automate de bronze dont le talon est la seule zone vulnérable.', contact('Frappe du bronze')),
    'aegea_moirai:bete_du_labyrinthe_mobile': record('Bête du Labyrinthe mobile', 'claws',
      'Change les couloirs autour de sa cible avant de charger.', cone('Charge du Labyrinthe', 44))
  },
  'Nine Realms: Last Twilight': {
    'nine_realms_last_twilight:draugr_du_tertre_ouvert': record('Draugr du tertre ouvert', 'shield_bash',
      'Revient avec une armure plus lourde si son sceau funéraire n’est pas détruit.', selfGuard('Carapace du tertre', 0.43)),
    'nine_realms_last_twilight:eclaireur_jotunn_de_givre': record('Éclaireur jötunn de givre', 'magic',
      'Gèle des lignes de déplacement et repousse les unités trop proches.', line('Ligne de givre', 55, 'beam')),
    'nine_realms_last_twilight:chien_de_hel': record('Chien de Hel', 'claws',
      'Suit les héros ressuscités et inflige davantage de dégâts aux faibles PV.', contact('Crocs du chien de Hel')),
    'nine_realms_last_twilight:rejeton_de_ni_hoggr': record('Rejeton de Níðhöggr', 'blade',
      'Ronge les objectifs, obstacles et racines protectrices plutôt que les héros.', contact('Morsure des racines')),
    'nine_realms_last_twilight:pillard_maudit_par_le_sei_r': record('Pillard maudit par le seiðr', 'staff',
      'Copie une rune alliée et la retourne contre l’escouade.', disruption('Runes retournées'))
  },
  'Tawantinsuyu: The Split Sun': {
    'tawantinsuyu_split_sun:ombre_d_uku_pacha': record('Ombre d’Uku Pacha', 'magic',
      'Éteint les balises solaires et attire une unité vers les niveaux inférieurs.', radial('Faille d’Uku Pacha', 140)),
    'tawantinsuyu_split_sun:chasqui_corrompu': record('Chasqui corrompu', 'blade',
      'Transporte des renforts entre deux portails tant que sa route reste ouverte.', alliesBuff('Signal du Chasqui', 1.18, 220)),
    'tawantinsuyu_split_sun:gardien_puma_de_pierre': record('Gardien puma de pierre', 'shield_bash',
      'Devient presque invulnérable lorsqu’il tient un carrefour de route.', selfGuard('Ancrage du puma', 0.46)),
    'tawantinsuyu_split_sun:jeune_amaru_de_tempete': record('Jeune Amaru de tempête', 'claws',
      'Passe du sol au ciel et frappe depuis une altitude différente.', contact('Plongée d’Amaru')),
    'tawantinsuyu_split_sun:masque_du_monde_renverse': record('Masque du monde renversé', 'staff',
      'Échange les effets positifs et négatifs de deux cases.', zone('Onde du masque renversé', 95, 'glitched'))
  },
  'Yomi no Kage': {
    'yomi_no_kage:oni_du_peage_rouge': record('Oni du péage rouge', 'heavy_melee',
      'Exige un tribut d’objet avant d’ouvrir le passage et devient furieux si on attaque sans négocier.', selfBuff('Colère du péage', 1.22)),
    'yomi_no_kage:yurei_sans_tablette': record('Yūrei sans tablette', 'magic',
      'Efface le nom d’une compétence et la rend inutilisable jusqu’à restauration du mémorial.', disruption('Entrave du mémorial')),
    'yomi_no_kage:tsukumogami_affole': record('Tsukumogami affolé', 'blade',
      'Change de forme selon l’objet de décor le plus proche.', contact('Ruée de l’objet animé')),
    'yomi_no_kage:tengu_du_sentier_ferme': record('Tengu du sentier fermé', 'claws',
      'Attaque depuis les hauteurs puis déplace la cible hors de sa route.', contact('Serres du sentier fermé')),
    'yomi_no_kage:kappa_du_canal_sec': record('Kappa du canal sec', 'staff',
      'Vole l’eau des zones de soin; peut être neutralisé en restaurant le bassin.', zone('Siphon du canal', 96))
  },
  'Mandate of Nine Heavens': {
    'mandate_nine_heavens:garde_jiangshi_sous_sceau': record('Garde jiangshi sous sceau', 'shield_bash',
      'Saute entre les cases marquées et s’arrête si son talisman est restauré.', contact('Bond sous sceau')),
    'mandate_nine_heavens:bete_de_papier_talismanique': record('Bête de papier talismanique', 'blade',
      'Se replie en feuille puis se redéploie derrière l’escouade.', contact('Déploiement du talisman')),
    'mandate_nine_heavens:yaoguai_renard_aux_faux_decrets': record('Yaoguai renard aux faux décrets', 'magic',
      'Crée une copie illusoire d’un objectif et détourne les unités automatiques.', disruption('Faux décret')),
    'mandate_nine_heavens:rejeton_de_bronze_taotie': record('Rejeton de bronze taotie', 'heavy_melee',
      'Dévore les objets de terrain et convertit leurs effets en armure.', selfGuard('Armure taotie', 0.43)),
    'mandate_nine_heavens:bandit_des_nuages': record('Bandit des nuages', 'claws',
      'Descend d’une plateforme céleste pour voler la jauge de la cible la plus rapide.', contact('Descente du nuage'))
  },
  'Mythos Primordia': {
    'mythos_primordia:chimere_sans_nom': record('Chimère sans nom', 'blade',
      'Change de capacités dès qu’un joueur tente de la classer.', cone('Entaille de la Chimère', 58)),
    'mythos_primordia:colosse_idole': record('Colosse-idole', 'shield_bash',
      'Devient plus lourd à chaque archive qui le décrit comme invincible.', selfGuard('Poids de l’idole', 0.45)),
    'mythos_primordia:oracle_d_os': record('Oracle d’os', 'staff',
      'Prévoit une action puis gagne de la puissance si le joueur la confirme.', selfBuff('Présage d’os', 1.18)),
    'mythos_primordia:rejeton_mange_etoile': record('Rejeton mange-étoile', 'claws',
      'Éteint les balises et dévore les projectiles lumineux.', radial('Rafale du Mange-Étoile', 124)),
    'mythos_primordia:titan_au_masque_vierge': record('Titan au masque vierge', 'magic',
      'Copie le rôle du dernier héros actif sans copier son identité.', line('Écho du masque vierge', 47))
  },
  'Aetherion: Seven Laws of Magic': {
    'aetherion_seven_laws:sort_vivant_echappe': record('Sort vivant échappé', 'blade',
      'Change de type élémentaire après chaque attaque reçue.', radial('Éclat du sort vivant', 132)),
    'aetherion_seven_laws:sangsue_de_mana': record('Sangsue de mana', 'claws',
      'S’accroche à la cible ayant la plus forte charge spéciale.', contactDisruption('Emprise de mana')),
    'aetherion_seven_laws:null_knight_loyaliste': record('Null-Knight loyaliste', 'shield_bash',
      'Réduit les dégâts magiques mais expose son noyau aux attaques physiques.', selfGuard('Garde des lois', 0.44)),
    'aetherion_seven_laws:gargouille_runique': record('Gargouille runique', 'heavy_melee',
      'S’active uniquement lorsque deux glyphes voisins correspondent.', radial('Choc runique', 135)),
    'aetherion_seven_laws:feu_follet_de_memoire': record('Feu follet de mémoire', 'staff',
      'Répète le dernier sort allié sous une forme affaiblie ou corrompue.', line('Lueur de mémoire', 48, 'beam'))
  },
  'Infernum: Nine Pits': {
    'infernum_nine_pits:diablotin_de_cendre': record('Diablotin de cendre', 'blade',
      'Met le feu aux objets et fuit vers le prochain brasier.', zone('Braise du diablotin', 84)),
    'infernum_nine_pits:templier_des_chaines': record('Templier des chaînes', 'shield_bash',
      'Lie deux unités; les dégâts subis par l’une se transmettent à l’autre.', line('Balayage des chaînes', 50)),
    'infernum_nine_pits:fielon_contractuel': record('Fiélon contractuel', 'staff',
      'Propose un buff immédiat contre une pénalité différée clairement affichée.', alliesBuff('Offre du Fiélon', 1.22, 210)),
    'infernum_nine_pits:molosse_de_braise': record('Molosse de braise', 'claws',
      'Traque les héros portant une dette ou une marque de péché.', contact('Morsure de braise')),
    'infernum_nine_pits:coquille_penitente': record('Coquille pénitente', 'magic',
      'Absorbe les voix des âmes et réduit la puissance des soins.', cone('Onde pénitentielle', 53))
  },
  'Neon Requiem': {
    'neon_requiem:helix_warden': record('Helix Warden', 'shield_bash',
      'Bouclier corporatif et fusil à impulsion.', selfGuard('Bouclier corporatif', 0.39)),
    'neon_requiem:debt_repossession_drone': record('Debt Repossession Drone', 'staff',
      'Désactive temporairement l’équipement d’un héros.', disruption('Saisie de l’équipement', 0)),
    'neon_requiem:neuro_hound': record('Neuro-Hound', 'claws',
      'Traque la cible dont la jauge spéciale est la plus élevée.', contact('Morsure de traque neurale')),
    'neon_requiem:ad_skin_assassin': record('Ad-Skin Assassin', 'blade',
      'Se camoufle derrière des panneaux publicitaires dynamiques.', contact('Entaille sous publicité')),
    'neon_requiem:memory_husk': record('Memory Husk', 'magic',
      'Copie la dernière compétence utilisée contre lui.', line('Écho de compétence', 48, 'beam'))
  },
  'Ilyr Concordat': {
    'ilyr_concordat:corsaire_du_vide_velari': record('Corsaire du Vide velari', 'blade',
      'Utilise des micro-sauts et vole les cellules de propulsion.', contact('Coup de lame en micro-saut')),
    'ilyr_concordat:aberration_du_culte_genetique': record('Aberration du Culte génétique', 'heavy_melee',
      'Adapte son corps au dernier type de dégâts subi.', selfGuard('Adaptation du Culte', 0.37)),
    'ilyr_concordat:drone_nul_paleen': record('Drone Nul paléen', 'shield_bash',
      'Supprime les projectiles et construit une géométrie défensive.', groupGuard('Géométrie nulle', 0.32, 205)),
    'ilyr_concordat:parasite_de_voie_resonante': record('Parasite de voie résonante', 'claws',
      'S’attache aux portails et attaque les unités qui les empruntent.', contact('Morsure de voie résonante')),
    'ilyr_concordat:deserteur_du_concordat': record('Déserteur du Concordat', 'staff',
      'Utilise les doctrines des cinq espèces contre leurs propres héros.', alliesBuff('Doctrine des cinq espèces', 1.19, 200))
  },
  'Valedor: The Shattered Crown': {
    'valedor_shattered_crown:sapeur_gobelin_mercenaire': record('Sapeur gobelin mercenaire', 'blade',
      'Pose des charges sur les obstacles mais peut changer de camp si son contrat est brisé.', zone('Charge de siège gobeline', 102)),
    'valedor_shattered_crown:chevalier_creux': record('Chevalier creux', 'shield_bash',
      'Armure animée par un serment sans porteur; vulnérable aux attaques qui restaurent un nom.', selfGuard('Garde du serment vide', 0.43)),
    'valedor_shattered_crown:brute_troll_des_ponts': record('Brute troll des ponts', 'heavy_melee',
      'Régénère tant que le pont ou territoire qu’il garde reste contesté.', selfHeal('Régénération du pont contesté', 0.16)),
    'valedor_shattered_crown:matriarche_araignee_des_ruines': record('Matriarche araignée des ruines', 'magic',
      'Relie les cases par des toiles et protège ses œufs plutôt qu’un maître maléfique.', zone('Toile des ruines', 107, 'glitched')),
    'valedor_shattered_crown:archer_spectre_de_l_ancienne_cour': record('Archer spectre de l’ancienne cour', 'claws',
      'Tire depuis les bannières de royaumes disparus.', line('Flèche des bannières disparues', 50))
  },
  'Aevum Fracture': {
    'aevum_fracture:constable_de_chronologie': record('Constable de chronologie', 'shield_bash',
      'Arrête les unités qui portent un objet provenant d’une autre ligne temporelle.', disruption('Arrêt chronologique', 0)),
    'aevum_fracture:soldat_anachrone': record('Soldat anachrone', 'blade',
      'Change d’arme et de doctrine selon la capitale actuellement dominante.', contact('Frappe d’arme anachrone')),
    'aevum_fracture:doppelganger_de_propagande': record('Doppelgänger de propagande', 'magic',
      'Copie un héros puis modifie son nom, son portrait et sa citation de victoire.', zone('Propagande du double', 98, 'glitched')),
    'aevum_fracture:molosse_chronal': record('Molosse chronal', 'claws',
      'Suit les traces de retour en arrière et punit les déplacements répétés.', contact('Crocs de la trace chronale')),
    'aevum_fracture:citoyen_efface_automatise': record('Citoyen effacé automatisé', 'staff',
      'Silhouette forcée au combat; peut être restaurée comme témoin plutôt que tuée.', selfGuard('Réflexe du témoin effacé', 0.35))
  },
  'Thalassa Mnémique': {
    'rature_de_corail': loreRecord('Rature de Corail', 'coral_scrape', 'Mémoire abrasée',
      {
        en: 'A reef grown around a censored memory. It scrapes names from armor before adding their colors to its branches.',
        fr: 'Un récif poussé autour d’un souvenir censuré. Il gratte les noms sur les armures avant d’ajouter leurs couleurs à ses branches.'
      },
      contactDisruption('Grattage du corail'), { contentPackId: 'oc-dlc-drowned-dawn' }),
    'nageur_sans_nom': loreRecord('Nageur Sans-Nom', 'undertow_claws', 'Appel presque familier',
      {
        en: 'A drowned citizen whose identity was traded for passage. It follows any voice that sounds almost familiar.',
        fr: 'Citoyen noyé dont l’identité fut échangée contre un passage. Il suit toute voix qui lui semble presque familière.'
      },
      contact('Griffes du ressac'), { contentPackId: 'oc-dlc-drowned-dawn' }),
    'archiviste_de_sel': loreRecord('Archiviste de Sel', 'salt_tablets', 'Témoignage tranchant',
      {
        en: 'A walking shelf of crystallized testimonies. Breaking one tablet releases a truth sharp enough to wound both sides.',
        fr: 'Rayonnage ambulant de témoignages cristallisés. Briser une tablette libère une vérité assez coupante pour blesser les deux camps.'
      },
      line('Tablette de sel brisée', 54), { contentPackId: 'oc-dlc-drowned-dawn' })
  },
  'Méridien Creux': {
    'huissier_instant': loreRecord('Huissier d’Instant', 'foreclosure_pendulum', 'Saisie immédiate',
      {
        en: 'A faceless enforcement clerk that confiscates the pause between a warning and its punishment.',
        fr: 'Agent d’exécution sans visage qui confisque la pause entre un avertissement et sa sanction.'
      },
      disruption('Confiscation du sursis', 0), { contentPackId: 'oc-dlc-borrowed-hours' }),
    'mite_horlogere': loreRecord('Mite Horlogère', 'rust_bite', 'Vieillissement différé',
      {
        en: 'A brass parasite that eats maintenance time until bridges and bodies age all at once.',
        fr: 'Parasite de laiton qui dévore le temps d’entretien jusqu’à ce que ponts et corps vieillissent d’un seul coup.'
      },
      contactDisruption('Morsure de rouille'), { contentPackId: 'oc-dlc-borrowed-hours' }),
    'voleur_vieillesse': loreRecord('Voleur de Vieillesse', 'age_vials', 'Échange d’années',
      {
        en: 'A market phantom that sells youthful faces while the stolen years scream from jars under its coat.',
        fr: 'Fantôme de marché qui vend des visages jeunes tandis que les années volées hurlent dans des bocaux sous son manteau.'
      },
      zone('Années libérées', 103, 'glitched'), { contentPackId: 'oc-dlc-borrowed-hours' })
  },
  'Viridienne Ultime': {
    'pollen_du_vide': loreRecord('Pollen du Vide', 'void_spores', 'Germination négative',
      {
        en: 'A cloud of seeds from futures that never received light. It germinates inside abandoned plans.',
        fr: 'Nuage de graines issues de futurs qui n’ont jamais reçu de lumière. Il germe dans les projets abandonnés.'
      },
      zone('Nuage de graines sans lumière', 120, 'glitched'), { contentPackId: 'oc-dlc-star-garden' }),
    'cerf_cometaire': loreRecord('Cerf Cométaire', 'orbital_antlers', 'Charge de périhélie',
      {
        en: 'A migratory grazer that carries young orbits in its antlers and panics when they are pruned too early.',
        fr: 'Herbivore migrateur qui porte de jeunes orbites dans ses bois et panique lorsqu’elles sont taillées trop tôt.'
      },
      contact('Encornement orbital'), { contentPackId: 'oc-dlc-star-garden' }),
    'liane_orpheline': loreRecord('Liane Orpheline', 'root_coils', 'Étreinte d’adoption',
      {
        en: 'A severed world-root seeking any sun to call parent, crushing habitats with desperate affection.',
        fr: 'Racine-monde sectionnée qui cherche n’importe quel soleil à appeler parent et broie les habitats dans son affection désespérée.'
      },
      cone('Étreinte des racines-mondes', 63), { contentPackId: 'oc-dlc-star-garden' })
  },
  'Nexus de Convergence': {
    'name:Matrice de Substitution': loreRecord('Matrice de Substitution', 'identity_copy_beam', 'Copie de doctrine',
      'Gyroscope de la Fonderie construit autour d un Eclat d Origine contamine. Il observe la derniere competence employee, imprime une version sans contexte puis la greffe au prochain double ideal.',
      alliesBuff('Greffe de doctrine', 1.18, 220), { role: 'support', visualStyle: 'origin_forge_matrix' }),
    'oc_act1_reflet_vie_possible': loreRecord('Reflet de Vie Possible', 'possible_life_mirror', 'Memoire empruntee',
      'Le Sans-Auteur extrait un choix regrette et lui donne un corps provisoire. Le Reflet combat avec les gestes que sa cible aurait appris dans cette autre vie, mais ne peut expliquer aucun de ses souvenirs.',
      contact('Geste de l’autre vie'), { role: 'mimic', actId: 'arrivals' }),
    'oc_act1_courtier_regret': loreRecord('Courtier du Regret', 'regret_hook', 'Offre sans consequence',
      'Messager faconne dans les marges du Nexus, il promet a chaque membre de la cellule une victoire dont le prix aurait deja ete paye par une autre version de lui-meme.',
      disruption('Offre piégée du Regret', 0), { role: 'skirmisher', actId: 'arrivals' }),
    'oc_act2_scribe_registre_noir': loreRecord('Scribe du Registre Noir', 'black_index_quill', 'Dette reclassee',
      'Protocole A.R.C.A. corrompu qui transforme les pertes nominatives en simples couts techniques. Chaque ligne qu il rature renforce la pression causale du Sans-Auteur.',
      zone('Ratures du Registre Noir', 106, 'glitched'), { role: 'debuffer', actId: 'anchors' }),
    'oc_act2_porte_verrou_endeuille': loreRecord('Porte-Verrou Endeuille', 'mourning_lock_ram', 'Ancrage de deuil',
      'Carcasse de maintenance soudee a un ancien Verrou d Origine. Elle repousse les temoins du sacrifice afin que le premier ancrage continue de fonctionner sans jamais nommer ceux qui l ont alimente.',
      selfGuard('Garde du Verrou d’Origine', 0.44), { role: 'guardian', actId: 'anchors' }),
    'oc_act3_indexeur_contradictions': loreRecord('Indexeur des Contradictions', 'contradiction_shear', 'Cohérence forcee',
      'Automate d archive qui coupe tout souvenir incompatible avec la version dominante. Une Trame rendue parfaitement coherente devient plus facile a traverser, mais cesse d appartenir a ceux qui l ont vecue.',
      line('Cisaille des contradictions', 52), { role: 'controller', actId: 'archives' }),
    'oc_act3_guide_issue_parfaite': loreRecord('Guide de l Issue Parfaite', 'perfect_exit_lure', 'Itineraire sans perte',
      'Silhouette hospitaliere qui indique toujours le chemin le plus court. Ses portails retirent les echecs, les deuils et les noms necessaires pour comprendre comment la destination fut atteinte.',
      disruption('Leurre du chemin court', 0), { role: 'displacer', actId: 'archives' }),
    'oc_act4_rature_seuil_blanc': loreRecord('Rature du Seuil Blanc', 'white_margin_claw', 'Marge devorante',
      'Trait mobile detache de la marge du Sans-Auteur. Il ne blesse pas le corps: il efface le lien entre une action et la raison pour laquelle elle devait etre accomplie.',
      disruption('Effacement de l’intention', 0), { role: 'assassin', actId: 'white-void' }),
    'oc_act4_simulacre_sans_choix': loreRecord('Simulacre Sans Choix', 'consent_nullifier', 'Paix obligatoire',
      'Gardien d une Cite ideale ou aucun conflit ne subsiste parce que les habitants ne peuvent plus se rappeler avoir prefere une voie a une autre.',
      selfGuard('Garde de la Cité idéale', 0.4), { role: 'tank', actId: 'white-void' }),
    'oc_act5_vigie_coordonnee_x': loreRecord('Vigie de la Coordonnee X', 'coordinate_x_beacon', 'Position interdite',
      'Ancienne balise A.R.C.A. retournee contre les explorateurs. Elle brouille la coordonnee restauree de Route X pour empecher ses habitants de redevenir des temoins consultables.',
      zone('Brouillage de Route X', 112, 'glitched'), { role: 'artillery', actId: 'primordial' }),
    'oc_act5_contre_temoin_veyr': loreRecord('Contre-Temoin de Veyr', 'testimony_redactor', 'Deposition tronquee',
      'Contrefacon produite par le Sans-Auteur pour remplacer le temoignage integral de Veyr. Elle transforme deux responsabilites distinctes en une accusation simple, donc facile a effacer.',
      disruption('Censure du témoignage intégral', 0), { role: 'silencer', actId: 'primordial' })
  }
}));

export function getOriginalCampaignEnemySecondary(actor) {
  if (!actor || actor.isBoss || actor.isWorldBoss || (actor.sourceUniverse && actor.sourceUniverse !== actor.universe)) return null;
  const entries = byUniverse.get(actor.universe);
  // The Foundry matrix has a stable catalog name, but no serialized actor ID.
  const key = actor.id ?? `name:${actor.name}`;
  if (typeof key !== 'string' || (actor.id != null && key.startsWith('name:'))) return null;
  const source = entries && Object.hasOwn(entries, key) ? entries[key] : null;
  if (!source || actor.name !== source.name || actor.weapon !== source.weapon) return null;
  if (source.signature) {
    return actor.signature?.fr === source.signature && actor.signature?.en === source.signature ? source.action : null;
  }
  if (actor.special !== source.special || actor.role !== source.role
    || actor.actId !== source.actId || actor.visualStyle !== source.visualStyle) return null;
  if (source.contentPackId) {
    return actor.contentPackId === source.contentPackId && actor.contentOrigin === 'oc' && actor.originalContent === true
      && actor.lore?.fr === source.lore.fr && actor.lore?.en === source.lore.en ? source.action : null;
  }
  if (actor.contentPackId !== undefined || actor.lore !== source.lore) return null;
  return source.action;
}

// These are the boss encounters attached to the RPG mission of each world.
// Their separate phase signatures remain on the existing special command.
const bossSecondaries = new Map(Object.entries({
  'neon_requiem:omnia_citymind_of_nadir_9': disruption('Effacement de quartier', 0),
  'aether_crown:crown_of_storms_leviathan_engine': radial('Mise à vide des chaudières', 159),
  'meridian_clockwork:chronophage_of_the_last_meridian': disruption('Dévoration d’un instant', 0),
  'iron_tempest:moloch_continental_landship': line('Batteries du flanc', 52),
  'helios_56:helio_1_smiling_sun_reactor': zone('Fuite de fusion', 118, 'radiated'),
  'kemet_devoured_sun:apep_devoreur_de_l_aube': radial('Sillage des anneaux', 166),
  'imperium_aeternum:collecteur_d_orcus': disruption('Perception de la dette', 0),
  'aegea_moirai:typhon_tempete_des_cent_voix': cone('Souffle de tempête', 54),
  'nine_realms_last_twilight:jormungandr_anneau_du_dernier_crepuscule': radial('Balayage de la Mer-Anneau', 182),
  'tawantinsuyu_split_sun:pachakuti_du_soleil_noir': zone('Onde du Puits solaire', 109),
  'yomi_no_kage:porte_de_yomi_aux_mille_ombres': secondary('Aspiration des noms', 'glitch', {
    delivery: 'area', shape: 'area', areaRadius: 98
  }, 0, 'glitched'),
  'mandate_nine_heavens:usurpateur_du_neuvieme_ciel': line('Sceau de l’édit', 45, 'beam'),
  'mythos_primordia:le_dieu_d_avant_les_noms': selfBuff('Appel à la première Foi', 1.19),
  'crownless_sea:kraken_sans_couronne': contact('Fouet du tentacule avant'),
  'aetherion_seven_laws:le_sort_non_ecrit': zone('Dérive du Cercle blanc', 124, 'glitched'),
  'infernum_nine_pits:trone_rouge_du_premier_peche': cone('Bouche du combustible', 47),
  'ilyr_concordat:l_architecte_pale': line('Panneau de compression', 58, 'beam'),
  'drowned_testament:le_dormeur_derriere_la_maree': radial('Ressac du rêve', 173, 'glitched'),
  'valedor_shattered_crown:vaelgor_premier_wyrm': cone('Souffle des Sept Fragments', 63),
  'aevum_fracture:moteur_de_l_histoire_unique': line('Coupure d’une ligne', 47, 'beam')
}));

const manifestBosses = new Map(ORIGINAL_UNIVERSE_DEFINITIONS.flatMap(world => [...world.bosses, world.worldBoss]
  .filter(boss => bossSecondaries.has(boss.id)).map(boss => [boss.id, boss])));

export function getOriginalCampaignBossSecondary(actor) {
  const source = manifestBosses.get(actor?.id);
  if (!source || actor.universe !== source.universe || actor.name !== source.name || actor.weapon !== source.weapon
    || actor.combatRole !== source.combatRole || actor.production?.id !== source.production.id
    || actor.production.isWorldBoss !== source.production.isWorldBoss
    || (actor.sourceUniverse != null && actor.sourceUniverse !== source.universe)
    || (actor.sourceId != null && actor.sourceId !== source.id)
    || (actor.sourceHeroId != null && actor.sourceHeroId !== source.id)
    || (actor.isBoss != null && actor.isBoss !== true)
    || (actor.isWorldBoss != null && actor.isWorldBoss !== source.production.isWorldBoss)) return null;
  const signature = actor.special;
  if (typeof signature !== 'object' || !signature || Object.keys(signature).length !== 2
    || signature.fr !== source.special.fr || signature.en !== source.special.en) return null;
  return bossSecondaries.get(source.id);
}
