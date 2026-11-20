// Concrete RPG secondaries for ordinary enemies in the original campaign.
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
const disruption = name => secondary(name, 'glitch', { delivery: 'ranged', shape: 'single' }, 1.05, 'glitched');
const guard = (name, targetSide, shape, reduce, range, excludeSelf = false) => secondary(name, 'shield', {
  effect: 'guard', targetSide, shape, reduce, ...(range ? { range } : {}), duration: 2.5, excludeSelf
}, 0);
const selfGuard = (name, reduce) => guard(name, 'self', 'single', reduce);
const groupGuard = (name, reduce, range) => guard(name, 'ally', 'group', reduce, range);
const allyGuard = (name, reduce, range) => guard(name, 'ally', 'single', reduce, range, true);
const repair = (name, healRatio, range, shape = 'single') => secondary(name, 'heal', {
  effect: 'heal', targetSide: 'ally', shape, healRatio, range, excludeSelf: true
}, 0);
const alliesBuff = (name, buffMultiplier, range) => secondary(name, 'buff', {
  effect: 'buff', targetSide: 'ally', shape: 'group', buffMultiplier, range, duration: 3, excludeSelf: true
}, 0);
const selfBuff = (name, buffMultiplier) => secondary(name, 'buff', {
  effect: 'buff', targetSide: 'self', shape: 'single', buffMultiplier, duration: 3
}, 0);
const record = (name, weapon, signature, action) => ({ name, weapon, signature, action });

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
  }
}));

export function getOriginalCampaignEnemySecondary(actor) {
  if (!actor || actor.isBoss || actor.isWorldBoss || (actor.sourceUniverse && actor.sourceUniverse !== actor.universe)) return null;
  const entries = byUniverse.get(actor.universe);
  const source = entries && Object.hasOwn(entries, actor.id) ? entries[actor.id] : null;
  if (!source || actor.name !== source.name || actor.weapon !== source.weapon
    || actor.signature?.fr !== source.signature || actor.signature?.en !== source.signature) return null;
  return source.action;
}
