// Existing accepted pixels reused after explicit native-generation refusals.
// These layouts add no PNG, base16, native phase or distinct pose.
export const LEGACY_POSE_FALLBACKS_WAVE11 = Object.freeze([
  {
    "heroId": "hermione_granger",
    "universe": "Harry Potter",
    "sheet": "/sprites/generated/heroes/harry-potter/hermione-granger.png",
    "layout": {
      "columns": 4,
      "rows": 4,
      "rowByState": {
        "idle": 0,
        "run": 1,
        "attack": 0,
        "support": 0,
        "special": 0,
        "defense": 0,
        "hit": 3,
        "dead": 3
      },
      "baseline": 244,
      "renderScaleByRow": {
        "0": 0.8189655172413793,
        "1": 0.8189655172413793,
        "2": 0.8189655172413793,
        "3": 0.8189655172413793
      },
      "adaptedLegacyFallback": true,
      "sourcePhaseByState": {
        "idle": "legacy-idle",
        "run": "legacy-run",
        "attack": "legacy-idle",
        "support": "legacy-idle",
        "special": "legacy-idle",
        "defense": "legacy-idle",
        "hit": "legacy-hit",
        "dead": "legacy-hit"
      },
      "countedAsDedicatedBase16": false,
      "countedAsDedicatedSuperOrFinale": false,
      "source1to1Verified": false
    }
  },
  {
    "heroId": "snape",
    "universe": "Harry Potter",
    "sheet": "/sprites/generated/heroes/harry-potter/snape.png",
    "layout": {
      "columns": 4,
      "rows": 4,
      "rowByState": {
        "idle": 0,
        "run": 0,
        "attack": 0,
        "support": 0,
        "special": 0,
        "defense": 0,
        "hit": 0,
        "dead": 0
      },
      "baseline": 244,
      "renderScaleByRow": {
        "0": 0.8189655172413793,
        "1": 0.8189655172413793,
        "2": 0.8189655172413793,
        "3": 0.8189655172413793
      },
      "adaptedLegacyFallback": true,
      "sourcePhaseByState": {
        "idle": "legacy-idle",
        "run": "legacy-idle",
        "attack": "legacy-idle",
        "support": "legacy-idle",
        "special": "legacy-idle",
        "defense": "legacy-idle",
        "hit": "legacy-idle",
        "dead": "legacy-idle"
      },
      "countedAsDedicatedBase16": false,
      "countedAsDedicatedSuperOrFinale": false,
      "source1to1Verified": false,
      "fixedColumn": 0
    }
  }
]);
