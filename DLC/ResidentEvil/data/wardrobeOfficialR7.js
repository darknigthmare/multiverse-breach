// Resident Evil — definitions consumed by src/game/wardrobeOfficialR7.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createOfficialCostumesR7({ make }) {
  return (make("Resident Evil","chris_redfield","re5-heavy-metal","Heavy Metal","Resident Evil 5 — Untold Stories Bundle","https://store.steampowered.com/app/352000/","Verrouiller Chris de RE5 et l’armure Heavy Metal, ses épaulières et attaches. La carrure et le visage restent ceux de Chris, pas de Soldat UAC. Aucun chargement Mercenaries ni arme lourde imposée.","Lock RE5 Chris and the Heavy Metal armor, shoulder pieces and fastenings. Keep Chris’s build and face, not a UAC soldier. No forced Mercenaries loadout or heavy weapon."));
}

export function createOfficialCostumesR72({ make }) {
  return (make("Resident Evil","claire_redfield","rev2-claire-rodeo","Rodeo","Resident Evil Revelations 2 — costume de Claire","https://store.steampowered.com/dlc/287290/","Relever le costume Rodeo de Claire dans Revelations 2 : chapeau, haut, ceinture et bottes à documenter en face et dos. Ne pas substituer un modèle western générique ni les proportions de RE2 Remake.","Document Claire’s Rodeo costume in Revelations 2: hat, upper garment, belt and boots in front and back views. Do not substitute a generic western model or RE2 Remake proportions."));
}

export function createOfficialCostumesR73({ make }) {
  return (make("Resident Evil","barry_burton","rev2-barry-commandant","Commandant","Resident Evil Revelations 2 — costume de Barry","https://store.steampowered.com/app/320363/","Le titre éditeur identifie Barry et Commandant ; la page détaillée est soumise à une vérification d’âge. Verrouiller coupes, insignes et couvre-chef à partir du jeu avant de dessiner. Ne pas inventer un uniforme historique.","The publisher title identifies Barry and Commandant; the detail page is age-gated. Lock tailoring, insignia and headwear from the game before drawing. Do not invent a historical uniform.","official-costume","PUBLISHER_PRODUCT_TITLE_ONLY"));
}

export function createUnboundCostumeResearchR7() {
  return (Object.freeze({actorName:'Sheva Alomar',costume:'Fairy Tale',universe:'Resident Evil',sourceWork:'Resident Evil 5 — Untold Stories Bundle',sourceUrl:'https://store.steampowered.com/app/352000/',sourceEvidence:'PUBLISHER_NAMES_EXACT_VARIANT',status:'ACTOR_BINDING_MISSING',equippable:false}));
}

export function createUnboundCostumeResearchR72() {
  return (Object.freeze({actorName:'Moira Burton',costume:'Urban Ninja',universe:'Resident Evil',sourceWork:'Resident Evil Revelations 2',sourceUrl:'https://store.steampowered.com/dlc/287290/',sourceEvidence:'PUBLISHER_NAMES_EXACT_VARIANT',status:'ACTOR_BINDING_MISSING',equippable:false}));
}

export function createUnboundCostumeResearchR73() {
  return (Object.freeze({actorName:'Natalia Korda',costume:'Lottie Suit',universe:'Resident Evil',sourceWork:'Resident Evil Revelations 2',sourceUrl:'https://store.steampowered.com/app/320362/',sourceEvidence:'PUBLISHER_PRODUCT_TITLE_ONLY',status:'ACTOR_BINDING_MISSING',equippable:false}));
}
