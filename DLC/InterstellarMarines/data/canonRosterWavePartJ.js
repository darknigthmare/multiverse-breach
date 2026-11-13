// Interstellar Marines — definitions consumed by src/game/canonRosterWavePartJ.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRows({ r }) {
  return (r('interstellar-marines','Interstellar Marines','https://store.steampowered.com/app/236370/Interstellar_Marines/',['Marine Rifleman - armure ITO','Marine Medic - soutien','Marine Recon - capteurs'],['CTR Rifle Unit','CTR Heavy Unit','Defective CTR'],['Sentry Grid Evaluation','NeuroGen Incident','Starcrown Assault'],'SARA Final Evaluation',['ITO Tactical Helmet','Tactical Flashlight','Tactical Laser'],['The Vault Target Course','Blackout Infiltration','Dynamic Weather Extraction'],{aliases:['Interstellar Marine'],continuity:'Early Access publiee dans The Vault ; concepts non sortis exclus.',adaptationRule:'Marines = avatars de fonction ; missions = evaluations.',visualAnchor:'armures ITO, HUD, alarmes et meteo artificielle'}));
}
