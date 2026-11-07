// Sartorius Stedim Biotech — definitions consumed by src/game/canonRosterWavePartA.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPackPalettes() {
  return (Object.freeze(["#dceff4", "#62858f", "#f6fbfc"]));
}

export function createCanonRosterWavePartA({ ADAPTED, SARTORIUS, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }) {
  return (definePack({
    key: "sartorius_stedim_biotech",
    universe: "Sartorius Stedim Biotech",
    mediaType: "real-world-industry",
    faction: "science",
    mode: "Tactics",
    difficulty: "Very Hard",
    referenceUrl: SARTORIUS,
    canonStatus: ADAPTED,
    visualAnchor: "Aubagne bioprocess cleanroom: bright white modular walls, stainless process frames, single-use sterile bags, tubing and connectors, strict gowning and white Everest cleanroom suits; no sinister laboratory clichés.",
    safetyNote: "Sartorius is a real company. Employees are cooperative heroes; every enemy or boss is a non-human process deviation marked crossover-adaptation.",
    lore: localizedLore("À Aubagne, les opérateurs protègent une production bioprocédés à usage unique. Le crossover transforme uniquement particules, pertes d'intégrité et écarts de procédé en menaces abstraites; aucun salarié n'est ennemi.", "At Aubagne, operators protect single-use bioprocess production. The crossover turns only particles, integrity loss and process deviations into abstract threats; no employee is an enemy."),
    hero: hero("sartorius_aseptic_operator", "Aseptic Production Operator", "operator", SARTORIUS, "Anonymous production operator fully enclosed in a clean white Everest suit, hood, mask, goggles, overshoes and gloves, working with sterile tubing; no weapon and no identifiable employee likeness.", ADAPTED, "L'opérateur réalise les gestes aseptiques et protège le produit.", "The operator performs aseptic manipulations and protects the product.", "Aseptic Connection"),
    allies: [
      hero("sartorius_process_technician", "Bioprocess Technician", "technician", SARTORIUS, "Anonymous cleanroom technician in the same white Everest ensemble, checking a stainless process skid and single-use bag through a tablet interface.", ADAPTED, "Le technicien stabilise pression, débit et intégrité des équipements.", "The technician stabilizes pressure, flow and equipment integrity.", "Process Stabilization"),
      hero("sartorius_quality_controller", "Quality Controller", "support", SARTORIUS, "Anonymous quality specialist in compliant white cleanroom gowning, carrying a sealed sampler and traceability tablet, never depicted as police or combat staff.", ADAPTED, "Le contrôle qualité bloque les écarts avant libération du lot.", "Quality control blocks deviations before batch release.", "Traceability Review")
    ],
    monsters: [
      threat("sartorius_particle_excursion", "Airborne Particle Excursion", "process-hazard", SARTORIUS, "Subtle particle-counter alert and magnified nonliving motes above an otherwise immaculate white-room work zone.", ADAPTED, "Une hausse de particules ferme la zone jusqu'au nettoyage et au contrôle.", "A particle rise closes the zone until cleaning and verification.", "Particle Alert"),
      threat("sartorius_seal_loss", "Single-Use Seal Integrity Loss", "process-hazard", SARTORIUS, "Small visible leak or pressure decay at a sterile bag seal on a transparent single-use assembly, with no body-horror imagery.", ADAPTED, "La perte d'intégrité exige isolement et remplacement de l'assemblage.", "Integrity loss requires isolation and replacement of the assembly.", "Pressure Decay"),
      threat("sartorius_connector_misalignment", "Sterile Connector Misalignment", "process-hazard", SARTORIUS, "Two single-use sterile connector halves visibly out of alignment, capped tubing and amber process warning light.", ADAPTED, "Un mauvais alignement interrompt la connexion aseptique avant contact.", "Misalignment interrupts the aseptic connection before contact.", "Connection Interlock")
    ],
    bosses: [
      threat("sartorius_bioburden_excursion", "Bioburden Excursion", "boss-deviation", SARTORIUS, "Abstract red trend line above specification beside sealed samples and a quarantined production zone; no monster or blamed worker.", ADAPTED, "L'équipe identifie la source, met le lot en quarantaine et assainit la ligne.", "The team identifies the source, quarantines the batch and sanitizes the line.", "Quarantine Protocol"),
      threat("sartorius_pressure_cascade", "Cleanroom Pressure Cascade Failure", "boss-deviation", SARTORIUS, "White-room airlock diagram with reversed pressure arrows, closed interlocked doors and HVAC alarms.", ADAPTED, "Il faut restaurer la cascade de pression sans ouvrir les sas compromis.", "The pressure cascade must be restored without opening compromised airlocks.", "Airlock Recovery"),
      threat("sartorius_traceability_break", "Batch Traceability Break", "boss-deviation", SARTORIUS, "Disconnected digital batch record nodes, sealed component labels and a clear HOLD status with unreadable identifiers.", ADAPTED, "Le lot reste bloqué jusqu'à la reconstruction complète de sa traçabilité.", "The batch remains on hold until its traceability is completely reconstructed.", "Record Reconciliation")
    ],
    worldBoss: threat("sartorius_contamination_cascade", "Facility-Wide Contamination Cascade", "world-boss-incident", SARTORIUS, "Nonliving contamination-control crisis across connected cleanroom zones: alarm maps, isolated airlocks and quarantined single-use lines, with all staff cooperating in PPE.", ADAPTED, "Le world boss est un incident de maîtrise à contenir et documenter, jamais une attaque d'employés.", "The world boss is a control incident to contain and document, never an employee attack.", "Contain, Clean, Release"),
    stage: "Aubagne White Room Production Line",
    stageMeta: metadata(SARTORIUS, "Bright white classified room in the Aubagne expansion, operators in Everest suits around sterile bags, tubing, connectors and stainless mobile frames.", ADAPTED, "La scène valorise la production et les gestes propres réels.", "The scene foregrounds real production and clean practices."),
    stageVariants: [
      stageVariant("Tactics", "Single-Use Bag Assembly Line", "Very Hard", "Single-Use Seal Integrity Loss", SARTORIUS, "Organized white-room stations assembling clear sterile bags, tubing sets and connectors under controlled airflow.", ADAPTED, "Chaque assemblage suit contrôle, soudure et test d'intégrité.", "Each assembly follows inspection, sealing and integrity testing."),
      stageVariant("RPG", "Aubagne R&D Process Suite", "Expert", "Cleanroom Pressure Cascade Failure", SARTORIUS, "Clean pilot suite with small bioreactor systems, analytical instruments and segregated airlocks, based on the Aubagne R&D expansion.", ADAPTED, "La variante restaure les paramètres de la suite pilote.", "The variant restores the pilot suite's parameters.")
    ],
    gear: [
      gear("sartorius_everest_suit", "Everest Cleanroom Suit", "Tenue cleanroom Everest", { def: 10, hp: 50 }, "https://it.elis.com/it/servizi/elis-cleanroom/microelettronica/tuta-cleanroom-everest-soluzione-di-indumenti-con-cerniera", "White reusable Everest cleanroom coverall with integrated hood and front closure, completed by mask, goggles, gloves and overshoes for the production operator.", ADAPTED, "La tenue limite l'émission particulaire de l'opérateur.", "The suit limits particles emitted by the operator."),
      gear("sartorius_sterile_connector", "Sterile Connector Set", "Jeu de connecteurs stériles", { def: 7, spd: 2 }, SARTORIUS, "Capped single-use sterile connector pair attached to clear tubing, isolated on a sterile field with no readable trademarks.", ADAPTED, "Le connecteur crée un transfert fermé et contrôlé.", "The connector creates a closed controlled transfer."),
      gear("sartorius_integrity_tester", "Integrity Test Unit", "Unité de test d'intégrité", { def: 8, hp: 30 }, SARTORIUS, "Compact cleanroom-compatible pressure integrity tester linked to a clear single-use bag and tablet readout.", ADAPTED, "Le test confirme l'étanchéité avant utilisation.", "The test confirms leak tightness before use.")
    ],
    event: event("evt_sartorius_line_clearance", "Aseptic Line Clearance", "Libération aseptique de ligne", "Operators jointly isolate the deviation, clear every station and resume only after quality verification.", "Les opérateurs isolent ensemble l'écart, libèrent chaque poste et ne reprennent qu'après vérification qualité.", SARTORIUS, "Cooperative white-room reset: sealed waste exit, sanitized surfaces, checked connectors and green status across the production line.", ADAPTED)
  }));
}
