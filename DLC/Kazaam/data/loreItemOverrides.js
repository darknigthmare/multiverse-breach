// Kazaam — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Kazaam", "kazaam", "https://d23.com/a-to-z/kazaam-film/", [
    item("Battered Boombox", "Boombox abime", "Single battered 1990s boombox with twin speakers, cassette deck and scratched black casing."),
    item("Magic Lamp", "Lampe magique", "One ornate brass genie lamp with curved spout, round lid and violet magical smoke glow."),
    item("Basketball", "Ballon de basket", "Single orange basketball with black channels and worn outdoor texture."),
    item("Stolen Cassette", "Cassette volee", "One clear audio cassette with red reels and blank label, no readable text."),
  ]));
}
