// Resident Evil — definitions consumed by src/game/wardrobeOriginals.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesigns({ p }) {
  return (p('Resident Evil','leon','Agent de la Brèche','Breach agent','Blouson technique anthracite, doublure ambre, holster conservé ; coupe et visage propres à Leon, pas un uniforme emprunté à Chris.','Anthracite technical jacket, amber lining and retained holster; Leon’s fit and face, not a uniform borrowed from Chris.'));
}

export function createSignatureDesigns2({ p }) {
  return (p('Resident Evil','jill','Secouriste du Nexus','Nexus responder','Veste courte robuste, renforts de genoux et patch secours original ; pas de nouvelles armes, garder visage et coiffure de l’incarnation ciblée.','Sturdy short jacket, knee reinforcement and an original rescue patch; no new weapons, retain the target incarnation’s face and hair.'));
}

export function createSignatureDesigns3({ p }) {
  return (p('Resident Evil','claire_redfield','Messagère intermondes','Interworld courier','Blouson rouge sombre avec panneaux de courrier Nexus et sacoche amovible ; ne change ni Claire en Elza ni la puissance de son équipement.','Dark-red jacket with Nexus courier panels and a removable satchel; neither turns Claire into Elza nor changes equipment power.'));
}
