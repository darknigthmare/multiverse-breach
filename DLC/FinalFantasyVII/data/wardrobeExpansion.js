// Final Fantasy VII — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createOfficialCostumeExtension({ L, official }) {
  return (official('Final Fantasy VII','cloud_ff7','ff7r-wall-market-dress','Wall Market — robe à volants','Wall Market — ruffled dress','Final Fantasy VII Remake (2020) — Wall Market',
    'https://na.store.square-enix-games.com/final-fantasy-vii-remake-static-arts---cloud-strife-dress-ver_',
    'PUBLISHER_FIGURE_DEPICTS_GAME_OUTFIT',L('Verrouiller le modèle de robe présenté : volants, rubans, coiffure à nattes et ornement. La figurine est une référence secondaire aux captures du jeu ; ne pas changer le visage ou les statistiques de Cloud.','Lock the depicted dress: ruffles, ribbons, pigtails and hair ornament. Use game captures alongside the figure; preserve Cloud’s face and stats.')));
}

export function createOfficialCostumeExtension2({ L, official }) {
  return (official('Final Fantasy VII','tifa_ff7','ff7r-tifa-dress','Wall Market — robe de soirée','Wall Market — evening dress','Final Fantasy VII Remake (2020) — Wall Market',
    'https://na.store.square-enix-games.com/final-fantasy-vii-remake-static-arts-tifa-lockhart-dress-ver_',
    'PUBLISHER_FIGURE_DEPICTS_GAME_OUTFIT',L('Modèle Dress Ver. distinct de Sporty et Exotic. Relever coupe, bretelles, chaussures et accessoires sur les captures Remake ; conserver les proportions de Tifa.','Dress Ver. is distinct from Sporty and Exotic. Record cut, straps, footwear and accessories from Remake captures; preserve Tifa’s proportions.')));
}

export function createOfficialCostumeExtension3({ L, official }) {
  return (official('Final Fantasy VII','tifa_ff7','ff7r-tifa-sporty','Wall Market — Sporty','Wall Market — Sporty','Final Fantasy VII Remake (2020) — Wall Market',
    'https://na.store.square-enix-games.com/final-fantasy-vii-remake-static-arts---tifa-lockhart-sporty-dress-ver_',
    'PUBLISHER_FIGURE_DEPICTS_GAME_OUTFIT',L('Relever coiffure, accessoires, bas et coupe Sporty. Contrôler les plis dans les gardes et les esquives ; ne pas substituer la robe Exotic.','Record hair, accessories, stockings and the Sporty cut. Check folds in guards and dodges; do not substitute the Exotic dress.')));
}

export function createOfficialCostumeExtension4({ L, official }) {
  return (official('Final Fantasy VII','tifa_ff7','ff7r-tifa-exotic','Wall Market — Exotic','Wall Market — Exotic','Final Fantasy VII Remake (2020) — Wall Market',
    'https://na.store.square-enix-games.com/final-fantasy-vii-remake-static-arts---tifa-lockhart-exotic-dress-ver_',
    'PUBLISHER_FIGURE_DEPICTS_GAME_OUTFIT',L('Ornement floral, obi et manches propres à cette variante. Contrôler les attaches et le dos ; conserver taille, visage et mouvements de Tifa.','Use this variant’s flower ornament, obi and sleeves. Verify fastenings and back view; retain Tifa’s size, face and movement.')));
}

export function createSignatureDesignExtension({ design }) {
  return (design('Final Fantasy VII','aerith_ff7','botanist','Jardin des Mondes','Garden of worlds','Veste de jardinage courte sur robe couvrante et petite sacoche de graines ; ruban, cheveux et visage conservés, pas de magie supplémentaire.','Short gardening jacket over a covering dress and a small seed satchel; retain ribbon, hair and face, no extra magic.'));
}

export function createSignatureDesignExtension2({ design }) {
  return (design('Final Fantasy VII','barret_ff7','workshop','Contremaître du Nexus','Nexus foreman','Gilet de chantier graphite et liserés ambre ; l’ouverture d’épaule respecte la prothèse existante, aucune main ou arme inventée.','Graphite worksite vest and amber edging; shoulder opening respects the existing prosthesis, no invented hand or weapon.'));
}

export function createSignatureDesignExtension3({ design }) {
  return (design('Final Fantasy VII','redxiii_ff7','guardian','Gardien des relais','Relay guardian','Collier de balisage et finitions de parure compatibles avec un quadrupède ; préserver crinière, tatouages, queue et anatomie, sans tenue humaine.','Wayfinding collar and quadruped-compatible ornaments; preserve mane, tattoos, tail and anatomy, no human outfit.'));
}

export function createSignatureDesignExtension4({ design }) {
  return (design('Final Fantasy VII','yuffie_ff7','courier','Courrière des Failles','Rift courier','Veste courte de messagère, sacoche latérale et gants légers, tenue adaptée à son âge ; cheveux et silhouette préservés, pas de nouvelle arme.','Short courier jacket, side satchel and light gloves, age-appropriate outfit; preserve hair and silhouette, no new weapon.'));
}
