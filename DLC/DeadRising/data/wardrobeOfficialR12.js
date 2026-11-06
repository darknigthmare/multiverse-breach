// Dead Rising — definitions consumed by src/game/wardrobeOfficialR12.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createWardrobeResearchR12({ research }) {
  return (research('Dead Rising','dead_rising_frank_west','drdr-base-wardrobe','capcom-drdr-packs','Compléter les vêtements du jeu de base et les autres épisodes : les vingt noms des six packs ne sont pas toute la garde-robe de Frank.','Research base-game clothing and other releases: twenty names from six packs do not exhaust Frank’s wardrobe.'));
}

export function createWardrobeResearchR122({ research }) {
  return (research('Dead Rising','dead_rising_frank_west','otr-skills-attire','capcom-otr-research','BBQ Chef, COSPLAY, Firefighter, Cyborg : distinguer composant vestimentaire, porteur et effets avant tout ajout.','BBQ Chef, COSPLAY, Firefighter, Cyborg: establish clothing component, wearer and gameplay effects before adding rights.','CLOTHING_COMPONENT_UNRESOLVED'));
}

export function createWardrobeResearchR123({ research }) {
  return (research('Dead Rising','dead_rising_chuck_greene','dr2-skills-attire','capcom-dr2-research','Ninja, Psychopath, Soldier of Fortune, Sports Fan : documenter séparément la tenue de Chuck et les capacités du pack.','Ninja, Psychopath, Soldier of Fortune, Sports Fan: separately document Chuck’s attire and pack abilities.','CLOTHING_COMPONENT_UNRESOLVED'));
}

export function createWardrobeSourceScopesR12({ DRDR_NAMED_PACKS_R12, checkedOn, sources }) {
  return (Object.freeze({id:'drdr-six-named-packs-2024',universe:'Dead Rising',actorId:'dead_rising_frank_west',
  sourceUrl:sources.get('capcom-drdr-packs').url,checkedOn,
  expectedItems:Object.freeze(DRDR_NAMED_PACKS_R12.flatMap(p=>p.items)),
  boundary:'Only the 20 named costumes in six listed DLC packs; excludes base-game unlocks, other games, BGM, weapons and full visual review.'}));
}
