export const basePath = "./battle-cards/standard/";
export const fileExt = "jpeg";

function createCardArray(type, names) {
  return names.map((name) => `${basePath}${type}_${name}.${fileExt}`);
}

export const objectiveCards = createCardArray("objective", [
  "Bombing-Run",
  "Breakthrough",
  "Hostage-Exchange",
  "Intercept-Transmissions",
  "Key-Positions",
  "Payload",
  "Recover-the-Supplies",
  "Sabotag-the-Moisture-Vaporators",
]);

export const conditionCards = createCardArray("condition", [
  "Minefield",
  "Clear-Conditions",
  "Fortified-Positions",
  "Hostile-Environment",
  "Limited-Visibility",
  "Rapid-Reinforcements",
  "Supply-Drop",
  "War-Weary",
]);

export const deploymentCards = createCardArray("deployment", [
  "Advanced-Positions",
  "Battle-Lines",
  "Danger-Close",
  "Disarray",
  "Hemmed-In",
  "Major-Offensive",
  "Roll-Out",
  "The-Long-March",
]);
