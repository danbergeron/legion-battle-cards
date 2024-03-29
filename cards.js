var lastClickedFace;
var turnTracker;
var selectedCards;
var fileExt;

let objectiveCards, conditionCards, deploymentCards;

if (document.location.pathname.includes("skirmish")) {
  import("./skirmish-cards.js").then((module) => {
    objectiveCards = module.objectiveCards;
    conditionCards = module.conditionCards;
    deploymentCards = module.deploymentCards;

    // Loads cached selected cards (if previous session exists) and renders cards
    loadState();
    renderCards();
    console.log(turnTracker);
  });
} else if (document.location.pathname.includes("standard")) {
  import("./standard-cards.js").then((module) => {
    objectiveCards = module.objectiveCards;
    conditionCards = module.conditionCards;
    deploymentCards = module.deploymentCards;
    console.log(objectiveCards);
    console.log(conditionCards);
    console.log(deploymentCards);

    // Loads cached selected cards (if previous session exists) and renders cards
    loadState();
    renderCards();
    console.log(turnTracker);
  });
} else if (document.location.pathname.includes("json-cards")) {
  // Retrieve the card arrays from localStorage for the json-cards page
  objectiveCards = JSON.parse(localStorage.getItem("objectiveCards")) || [];
  conditionCards = JSON.parse(localStorage.getItem("conditionCards")) || [];
  deploymentCards = JSON.parse(localStorage.getItem("deploymentCards")) || [];

  // Check if the arrays were successfully retrieved
  if (
    objectiveCards.length &&
    conditionCards.length &&
    deploymentCards.length
  ) {
    console.log(objectiveCards);
    console.log(conditionCards);
    console.log(deploymentCards);

    shuffleCards(objectiveCards);
    shuffleCards(conditionCards);
    shuffleCards(deploymentCards);
    loadState();
    renderCards();
    console.log(turnTracker);
  }
} else {
}

const shuffleButton = document.getElementById("shuffleBtn");
shuffleButton.addEventListener("click", reShuffleCards);

const passButton = document.getElementById("passBtn");
passButton.addEventListener("click", nextPlayer);

const homeButton = document.getElementById("homeBtn");
homeButton.addEventListener("click", returnHome);

function returnHome() {
  localStorage.removeItem(getLocalStorageKey("gameState"));
  window.location.href = "./index.html";
}

function getLocalStorageKey(baseKey) {
  // This will create a base key including the normalized path as a unique identifier for the page
  const path = window.location.pathname
    .replace(/^\//, "")
    .replace(/\/$/, "")
    .replace(/\//g, "_");
  return `${path}_${baseKey}`;
}

function saveState() {
  const gameStateKey = getLocalStorageKey("gameState");

  localStorage.setItem(
    gameStateKey,
    JSON.stringify({
      turnTracker: turnTracker,
      objectiveCards: objectiveCards,
      conditionCards: conditionCards,
      deploymentCards: deploymentCards,
      selectedCards: selectedCards,
      lastClickedFace: lastClickedFace,
    })
  );
}

// ...

function loadState() {
  const savedState = localStorage.getItem(getLocalStorageKey("gameState"));
  console.log(savedState);
  if (savedState) {
    const state = JSON.parse(savedState);
    turnTracker = state.turnTracker;
    objectiveCards = state.objectiveCards;
    conditionCards = state.conditionCards;
    deploymentCards = state.deploymentCards;
    selectedCards = state.selectedCards;
    lastClickedFace = state.lastClickedFace;

    // Restore the card states if they were previously saved
    restoreCardState();
    boardState();
  } else {
    lastClickedFace = null;
    turnTracker = 0;
    selectedCards = [];

    // Only shuffle the cards if there is no saved state
    shuffleCards(objectiveCards);
    shuffleCards(conditionCards);
    shuffleCards(deploymentCards);
    console.log("There's NO saved state.");
  }
}
function saveCardState() {
  const dismissedCards = Array.from(
    document.querySelectorAll(".dismissed-card")
  ).map((card) => ({
    id: card.id,
    bgUrl: card.style.backgroundImage,
  }));

  const selectedCardsArray = Array.from(
    document.querySelectorAll(".selected-card")
  ).map((card) => ({
    id: card.id,
    bgUrl: card.style.backgroundImage,
  }));

  // Use the getLocalStorageKey function to store the state with the page-specific key
  localStorage.setItem(
    getLocalStorageKey("dismissedCards"),
    JSON.stringify(dismissedCards)
  );
  localStorage.setItem(
    getLocalStorageKey("selectedCards"),
    JSON.stringify(selectedCardsArray)
  );
}

function restoreCardState() {
  const dismissedCards =
    JSON.parse(localStorage.getItem(getLocalStorageKey("dismissedCards"))) ||
    [];
  const selectedCards =
    JSON.parse(localStorage.getItem(getLocalStorageKey("selectedCards"))) || [];

  dismissedCards.forEach(({ id, bgUrl }) => {
    const card = document.getElementById(id);
    card.classList.add("dismissed-card");
    card.classList.remove("selected-card");
    card.style.opacity = "0.3";
    card.style.pointerEvents = "none";
    card.style.backgroundImage = bgUrl;
  });

  selectedCards.forEach(({ id, bgUrl }) => {
    const card = document.getElementById(id);
    card.classList.add("selected-card");
    card.classList.remove("dismissed-card");
    card.style.backgroundImage = bgUrl;
  });
}

function reShuffleCards() {
  localStorage.removeItem(getLocalStorageKey("gameState"));
  if ((passButton.style.display = "none")) {
    location.reload();
  }
  localStorage.removeItem("gameState");
  shuffleCards(objectiveCards);
  shuffleCards(deploymentCards);
  shuffleCards(conditionCards);
  turnTracker = 0;
  renderCards();
}

function shuffleCards(array) {
  let currentIndex = array.length,
    randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  if (array.length > 4) {
    array.splice(4);
  }
  console.log(array);
  return array;
}

function renderCards() {
  const cardTypes = [
    { prefix: "ob-card-", cards: objectiveCards },
    { prefix: "co-card-", cards: conditionCards },
    { prefix: "de-card-", cards: deploymentCards },
  ];

  for (const { prefix, cards } of cardTypes) {
    for (let i = 0; i < Math.min(cards.length, 4); i++) {
      const card = document.getElementById(prefix + i);
      console.log(card); // Add this line
      card.style.backgroundImage = `url(${cards[i]})`;
    }
  }
}

$(document).on("click", ".selected-card", function (e) {
  $(this).css("pointer-events", "none");
  var nextUp = $(this);
  let incrementedTag = nextUp[0].outerHTML.replace(
    /(\d+)/,

    function (match, capture) {
      return (parseInt(capture, 10) + 1).toString();
    }
  );

  let id = incrementedTag.match(/id="(.+?)"/)[1];

  var nextUp2 = document.getElementById(id);
  nextUp2.classList.toggle("selected-card");

  console.log(nextUp2);

  if (turnTracker > 3) {
  } else {
    $(this).css("opacity", "0.3");
    if (lastClickedFace) {
      $(lastClickedFace).css("background-color", "red");
    }
    lastClickedFace = this;

    var nextUp3 = document.getElementById($(this).attr("id"));
    console.log(nextUp3);
    nextUp3.classList.add("dismissed-card");
    nextUp3.classList.remove("selected-card");

    saveCardState();
    nextPlayer();
  }
});

function nextPlayer() {
  turnTracker++;
  boardState();
}

function boardState() {
  const playerTurns = [
    {
      turn: 1,
      color: "#8e6060",
      label: "Red's Turn",
      targetDivClass: "red-turn",
      btnClass: "btn-danger",
    },
    {
      turn: 2,
      color: "#60798e",
      label: "Blue's Turn",
      targetDivClass: "blue-turn",
      btnClass: "btn-primary",
    },
    {
      turn: 3,
      color: "#8e6060",
      label: "Red's Turn",
      targetDivClass: "red-turn",
      btnClass: "btn-danger",
    },
  ];

  const currentTurn = playerTurns.find(({ turn }) => turn === turnTracker);

  if (currentTurn) {
    // Hide both turn divs and buttons to start fresh
    $(".blue-turn, .red-turn").hide();
    $("#passBtn, #inactivePassBtn").hide();

    // Show the current turn div
    $("." + currentTurn.targetDivClass).show();

    // Detach event listeners from both buttons
    $("#passBtn, #inactivePassBtn").off("click");

    // Assign the 'passBtn' ID to the active button and 'inactivePassBtn' to the other
    const activeButton = $("." + currentTurn.targetDivClass + " button");
    const inactiveButton = $(".blue-turn button, .red-turn button").not(
      activeButton
    );

    activeButton
      .attr("id", "passBtn")
      .removeClass("btn-primary btn-danger")
      .addClass(currentTurn.btnClass)
      .show();

    inactiveButton.attr("id", "inactivePassBtn");

    // Reattach the event listener to the new active button
    $("#passBtn").on("click", nextPlayer);

    // Update the background color of the grid container
    document.querySelector(".grid-container").style.backgroundColor =
      currentTurn.color;
    console.log(currentTurn.label);
  } else {
    // If no turn is active
    $(".blue-turn, .red-turn").hide();
    $("#passBtn, #inactivePassBtn").hide();
    topFunction();
    displaySelectedCards();
  }
  saveState();
}

function displaySelectedCards() {
  var selectedCards = Array.from(
    document.querySelectorAll(".selected-card")
  ).map(function (element) {
    return {
      element: element,
      bgUrl: element.style.backgroundImage.slice(5, -2),
    };
  });

  console.log(selectedCards);

  document.querySelector(".grid-container").style.display = "none";
  document.querySelector(".container-selected-grid").style.display = "grid";

  for (var i = 0; i < selectedCards.length; i++) {
    const completedCards = document.getElementById("grid-item-" + (i + 1));
    completedCards.style.backgroundImage = `url(${selectedCards[i].bgUrl})`;
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
