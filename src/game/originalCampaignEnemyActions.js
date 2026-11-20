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
