// House of the Dead 3 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Death',
      weapon: 'giant_club_and_body_charge',
      special: 'EFI Security Rampage',
      phases: ['Pursues the agents through the facility with sweeping club attacks', 'Drops the club and uses faster body charges after sustained head damage'],
      lore: {
        fr: 'L ancien agent de securite geant protege l EFI avec sa masse et sa force physique.',
        en: 'The giant former security guard protects the EFI facility with his club and physical strength.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Death',
      visualAnchor: 'Exact House of the Dead III Death Type 001: enormous obese security-guard creature in torn blue uniform, peaked cap and heavy spiked club, with the small head weak point clearly readable; no Grim Reaper robe or scythe.'
    },
    {
      name: 'Fool',
      weapon: 'claws_and_cage_leaps',
      special: 'Sloth Cage Pounce',
      phases: ['Climbs rapidly around the laboratory cage and launches diagonal pounces', 'Loses its grip after claw damage and attacks from the floor with frantic swipes'],
      lore: {
        fr: 'La creature semblable a un paresseux grimpe sur la cage du laboratoire et attaque avec ses longues griffes.',
        en: 'The sloth-like creature climbs the laboratory cage and attacks with its long claws.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Fool',
      visualAnchor: 'Exact House of the Dead III Fool Type 0028: huge round dark-grey hairy sloth body, pale cracked face, orange bare feet and four extremely long curved claws, built for cage climbing; no court-jester costume, hat, ape anatomy or human weapon.'
    }
  ]);
}
