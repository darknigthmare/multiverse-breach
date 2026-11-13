// ASMRZ — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("ASMRZ", "asmrz", "https://www.youtube.com/watch?v=FoO7Pmx0bE4", [
    item("Butler Microphone", "Microphone de majordome", "Single slim black handheld microphone used by the two Good Night Ojou-sama butler personas, silver grille and no branding."),
    item("White Butler Glove", "Gant blanc de majordome", "Single immaculate white formal glove from the Good Night Ojou-sama butler costume, laid flat with black cuff piping."),
    item("Late-night Smartphone", "Smartphone nocturne", "Single dark smartphone displaying only a blank midnight-blue glow, the bedtime-warning prop from Good Night Ojou-sama, no copied interface or text."),
    item("Good Night Service Bell", "Clochette de service Bonne nuit", "Small polished brass service bell with a black ribbon, rung by the ASMRZ butler duo to begin their bedtime choreography."),
  ]));
}
