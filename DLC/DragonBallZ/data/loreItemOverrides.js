// Dragon Ball Z — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Dragon Ball Z", "dragon_ball_z", "https://en.dragon-ball-official.com/news/01_672.html", [
    item("Dragon Radar", "Radar du Dragon", "Single classic handheld Dragon Radar: compact rounded lime-green casing, large dark circular radar screen with a fine green grid, one small red control button and no visible letters, numbers or copied marks."),
    item("Scouter", "Scouter", "Single classic Frieza Force scouter removed from its wearer: translucent red monocle lens joined to one pale grey ear module with two small controls, no head, face, eye or readable display."),
    item("Senzu Bean", "Haricot Senzu", "Exactly one plump pale-green Senzu Bean with a smooth kidney-shaped silhouette, shallow central crease and matte natural surface, enlarged for inventory readability."),
    item("Hoi-Poi Capsule", "Capsule Hoi-Poi", "Exactly one compact white Hoi-Poi Capsule with rounded red end caps, narrow dark center band and one raised activation button, blank casing without number, lettering or company emblem."),
  ]));
}
