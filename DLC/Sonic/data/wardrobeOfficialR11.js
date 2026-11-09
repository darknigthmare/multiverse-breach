// Sonic — definitions consumed by src/game/wardrobeOfficialR11.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createWardrobeResearchR11({ L, sourceById }) {
  return (Object.freeze({universe:'Sonic',id:'sonic_hedgehog',key:'superstars-mech-battle',sourceUrl:sourceById.get('sega-superstars').url,
    question:L('Mech Sonic : définir le porteur et la portée Battle Mode avant tout droit de tenue.','Mech Sonic: establish the wearer and Battle Mode scope before defining a costume right.'),
    status:'SOURCE_MODE_BINDING_UNRESOLVED',note:'Named mode-specific pack content. Not automatically a Sonic outfit or a Metal Sonic boss skin.'}));
}
