// Portal — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesignExtension({ design }) {
  return (design('Portal','atlas','maintenance','Atlas — maintenance des Failles','Atlas — rift maintenance','Plaques de coque ivoire et repères turquoise, conservation de l’œil bleu et du corps sphérique ; aucun changement de diamètre ou de pattes.','Ivory shell panels and turquoise markings; retain blue optic and spherical body, unchanged diameter and limbs.'));
}

export function createSignatureDesignExtension2({ design }) {
  return (design('Portal','pbody','maintenance','P-body — balisage des Failles','P-body — rift wayfinding','Coque mate et repères ambre, œil orange intact ; conserver proportions allongées et articulations, pas de conversion en Atlas.','Matte shell and amber markings, intact orange optic; keep elongated proportions and joints, never turn P-body into Atlas.'));
}

export function createSignatureDesignExtension3({ design }) {
  return (design('Portal','chell','test-pilot','Pilote d’essais Nexus','Nexus test pilot','Surveste de laboratoire courte et bracelets d’identification ; jambes, mains et bottes libres, visage de Chell conservé, aucun pouvoir ajouté.','Short lab over-jacket and ID bands; keep legs, hands and boots clear, preserve Chell’s face, no added power.'));
}
