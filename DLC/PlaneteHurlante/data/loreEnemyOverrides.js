// Planete Hurlante — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Planete Hurlante", [
    candidate(
      RIFT_DRONE,
      "Type 1 Screamer",
      "Rotary blades",
      "burrow leap and blade strike",
      "Machine tueuse de type 1 qui se cache sous le sol avant de jaillir avec ses lames rotatives.",
      "A Type 1 killing machine that burrows underground before erupting with rotary blades.",
      "https://www.imdb.com/title/tt0114367/plotsummary/",
      "Low metal killing machine, reptile/rat-like profile, articulated legs and tail, exposed rotary blades; no human silhouette.",
    ),
    candidate(
      BREACH_STALKER,
      "Type 2 Screamer",
      "Concealed mechanical blade",
      "infiltration then close-range blade attack",
      "Screamer infiltre sous l'apparence d'un soldat blesse qui revele sa lame a courte portee.",
      "A Screamer disguised as a wounded soldier that reveals its blade at close range.",
      "https://www.springfieldspringfield.co.uk/movie_script.php?movie=screamers",
      "Adult wounded-soldier disguise; dirty battlefield uniform over a mechanical endoskeleton; repeated distress behavior.",
    ),
    candidate(
      ANOMALY_PACK,
      "Type 3 Screamer - David",
      "Concealed mechanical blade",
      "swarm rush and concealed blade attack",
      "Copie de David utilisee comme leurre enfantin avant qu'un groupe revele ses mecanismes meurtriers.",
      "A David copy used as a childlike lure before a group reveals its killing mechanisms.",
      "https://www.imdb.com/title/tt0114367/plotsummary/",
      "Blond child disguise, winter coat and teddy bear; identical copies; mechanical interior only visible on hit.",
    ),
  ]));
}
