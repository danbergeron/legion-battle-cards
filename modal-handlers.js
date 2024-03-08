// modal-handlers.js
document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("submit").addEventListener("click", handleSubmit);
});

function handleSubmit() {
  const jsonText = document.getElementById("json").value.trim(); // Trim whitespace
  if (!jsonText) {
    showError("Error: No JSON entered. Please enter JSON data.");
    return;
  }

  try {
    const jsonObj = JSON.parse(jsonText);
    const validationMessage = validateBattlefieldDeck(jsonObj.battlefieldDeck);

    if (validationMessage === true) {
      const cardData = extractAndUpdateCardArrays(jsonText);
      console.log("cardData:", cardData);

      localStorage.setItem(
        "objectiveCards",
        JSON.stringify(cardData.objectiveCards)
      );
      localStorage.setItem(
        "conditionCards",
        JSON.stringify(cardData.conditionCards)
      );
      localStorage.setItem(
        "deploymentCards",
        JSON.stringify(cardData.deploymentCards)
      );

      showSuccess("JSON successfully processed!"); // Show success message
      setTimeout(() => {
        window.location.href = "./json-cards.html"; // Redirect after the success message has been shown
      }, 1000);
    } else {
      showError(validationMessage);
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      showError(
        `Error parsing JSON: ${e.message}. Please check the JSON syntax.`
      );
    } else {
      showError("Error: JSON entered is invalid. Please enter a valid JSON.");
    }
    console.error("Error when parsing JSON:", e);
  }
}

function validateBattlefieldDeck(battlefieldDeck) {
  if (!battlefieldDeck) {
    return "Error: JSON entered is invalid. No 'battlefieldDeck' found.";
  }

  if (
    !Array.isArray(battlefieldDeck.conditions) ||
    battlefieldDeck.conditions.length < 4
  ) {
    return "Error: Not enough 'conditions' battle cards. A minimum of 4 items is required.";
  }
  if (
    !Array.isArray(battlefieldDeck.deployment) ||
    battlefieldDeck.deployment.length < 4
  ) {
    return "Error: Not enough 'deployment' battle cards. A minimum of 4 items is required.";
  }
  if (
    !Array.isArray(battlefieldDeck.objective) ||
    battlefieldDeck.objective.length < 4
  ) {
    return "Error: Not enough 'objective' battle cards. A minimum of 4 items is required.";
  }

  return true; // No errors, validation passed
}

function extractAndUpdateCardArrays(jsonText) {
  try {
    const jsonObj = JSON.parse(jsonText);
    console.log("Extracted battlefieldDeck:", jsonObj.battlefieldDeck); // Log to inspect the structure

    const objectiveCards = convertNamesToURLs(
      jsonObj.battlefieldDeck.objective,
      "objective"
    );
    const conditionCards = convertNamesToURLs(
      jsonObj.battlefieldDeck.conditions,
      "condition"
    );
    const deploymentCards = convertNamesToURLs(
      jsonObj.battlefieldDeck.deployment,
      "deployment"
    );

    return {
      objectiveCards,
      conditionCards,
      deploymentCards,
    };
  } catch (e) {
    console.error("Invalid JSON:", e);
    return {};
  }
}

function convertNamesToURLs(names, type) {
  const basePath = "./battle-cards/standard/";
  const fileExt = "jpeg";
  return names.map(
    (name) => `${basePath}${type}_${name.replace(/ /g, "-")}.${fileExt}`
  );
}

function showSuccess(message) {
  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "none"; // Make the error message invisible

  const successDiv = document.getElementById("success-message");
  successDiv.textContent = message;
  successDiv.style.display = "block";
}

function showError(message) {
  // Hide any success messages
  const successDiv = document.getElementById("success-message");
  if (successDiv) {
    successDiv.style.display = "none";
  }

  const errorDiv = document.getElementById("error-message");
  errorDiv.textContent = message;
  errorDiv.style.display = "block"; // Make the error message visible
}
