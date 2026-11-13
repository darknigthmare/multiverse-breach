// Le Cinquième Element — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Le Cinquieme Element",
    "le-cinquieme-element-the-ultimate-evil-sphere",
    "stageSetpiece",
    "The Fifth Element (1997) - Great Evil finale",
    "Activer les quatre pierres puis le cinquieme element avant que la sphere noire atteigne la Terre.",
    "Activate the four stones and then the fifth element before the black sphere reaches Earth.",
    "Le Grand Mal est une sphere cosmique environnementale sans corps de melee.",
    "The Great Evil is an environmental cosmic sphere without a melee body.",
    ["https://fifth-element.fandom.com/wiki/Great_Evil"],
    "Black molten Great Evil sphere in the sky, Mondoshawan temple, four elemental stones and final beam as independent layers.",
  ));
}
