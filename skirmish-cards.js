export const basePath = "./battle-cards/skirmish/";
export const fileExt = "png";

function createCardArray(type, names) {
  return names.map((name) => `${basePath}${type}_${name}.${fileExt}`);
}

export const objectiveCards = createCardArray("objective", [
  "breach",
  "control",
  "elimination",
  "positions",
]);

export const conditionCards = createCardArray("condition", [
  "clear",
  "dawn",
  "defenses",
  "war_weary",
]);

export const deploymentCards = createCardArray("deployment", [
  "battle_lines",
  "faceoff",
  "flanking",
  "meeting",
]);
