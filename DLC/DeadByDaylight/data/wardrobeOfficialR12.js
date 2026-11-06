// Dead by Daylight — definitions consumed by src/game/wardrobeOfficialR12.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createOfficialCostumesR12({ costume }) {
  return (costume('Dead by Daylight',['dead_by_daylight_dwight_fairfield','dead_by_daylight_meg_thomas','dead_by_daylight_claudette_morel'],
  'dbd-eddies-live-shirt','Eddie’s Live Shirt','Dead by Daylight — Iron Maiden Collection (2024)','bhvr-maiden','official-costume','torso-only',
  'T-shirt de tournée pour ces trois Survivants originaux présents. Produire une coupe et un raccord propres à Dwight, Meg et Claudette ; la source annonce des différences selon le porteur, donc ne pas déclarer les trois impressions identiques sans captures. Conserver tête, bas et identité ; ne pas équiper automatiquement les Survivants sous licence ni importer une musique.',
  'Tour shirt for these three present original Survivors. Produce wearer-specific fit and joints for Dwight, Meg and Claudette; the source mentions wearer-dependent differences, so do not assert identical prints without screenshots. Preserve head, lower body and identity; no automatic licensed-Survivor assignment or music import.'));
}

export function createWardrobeResearchR12({ research }) {
  return (research('Dead by Daylight','dead_by_daylight_doctor','dbd-pharoah-eddie-identity','bhvr-maiden','Pharoah Eddie, modèle Legendary du Doctor : définir identité représentée et compatibilité avant de le traiter comme un vêtement.','Pharoah Eddie, the Doctor Legendary model: establish depicted identity and compatibility before treating it as clothing.','LEGENDARY_IDENTITY_REVIEW'));
}
