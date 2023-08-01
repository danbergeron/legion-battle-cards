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

    // Call any functions that depend on the imported arrays here.
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
    console.log(deploymentCards);

    // Call any functions that depend on the imported arrays here.
    loadState();
    renderCards();
    console.log(turnTracker);
  });
} else {
  // Handle any other pages.
}

console.log(objectiveCards);

const shuffleButton = document.getElementById("shuffleBtn");
shuffleButton.addEventListener("click", reShuffleCards);

const passButton = document.getElementById("passBtn");
passButton.addEventListener("click", nextPlayer);

const homeButton = document.getElementById("homeBtn");
homeButton.addEventListener("click", returnHome);

function returnHome() {
  localStorage.removeItem("gameState");
  window.location.href = "./index.html";
}

function saveState() {
  localStorage.setItem(
    "gameState",
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

function loadState() {
  const savedState = localStorage.getItem("gameState");
  console.log(savedState);
  if (savedState) {
    const state = JSON.parse(savedState, (key, value) => {
      if (
        key === "objectiveCards" ||
        key === "conditionCards" ||
        key === "deploymentCards"
      ) {
        return value.map((name) => `./battle-cards/${key}_${name}.${fileExt}`);
      }
      return value;
    });
    turnTracker = state.turnTracker;
    selectedCards = state.selectedCards;
    lastClickedFace = state.lastClickedFace;
    restoreCardState();
    boardState();
  } else {
    lastClickedFace = null;
    turnTracker = 0;
    selectedCards = [];

    shuffleCards(objectiveCards);
    shuffleCards(deploymentCards);
    shuffleCards(conditionCards);
    console.log("there's NO saved state.");
  }
}

console.log(turnTracker);

function saveCardState() {
  const dismissedCards = Array.from(
    document.querySelectorAll(".dismissed-card")
  ).map((card) => ({
    id: card.id,
    bgUrl: card.style.backgroundImage,
  }));

  const selectedCards = Array.from(
    document.querySelectorAll(".selected-card")
  ).map((card) => ({
    id: card.id,
    bgUrl: card.style.backgroundImage,
  }));

  localStorage.setItem("dismissedCards", JSON.stringify(dismissedCards));
  localStorage.setItem("selectedCards", JSON.stringify(selectedCards));
}

function restoreCardState() {
  const dismissedCards =
    JSON.parse(localStorage.getItem("dismissedCards")) || [];
  const selectedCards = JSON.parse(localStorage.getItem("selectedCards")) || [];

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
    { turn: 1, color: "#8e6060", label: "Red's Turn" },
    { turn: 2, color: "#60798e", label: "Blue's Turn" },
    { turn: 3, color: "#8e6060", label: "Red's Turn" },
  ];

  const currentTurn = playerTurns.find(({ turn }) => turn === turnTracker);

  if (currentTurn) {
    $(".blue-turn").toggle(currentTurn.turn === 2);
    $(".red-turn").toggle(currentTurn.turn !== 2);
    document.querySelector(".grid-container").style.backgroundColor =
      currentTurn.color;
    console.log(currentTurn.label);
  } else {
    $(".blue-turn").hide();
    $(".red-turn").hide();
    passButton.style.display = "none";
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
