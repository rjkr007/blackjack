let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
};

const YOU = blackjackGame["you"];
const DEALER = blackjackGame["dealer"];
const hitSound = new Audio("./sounds/swish.m4a");
const winSound = new Audio("./sounds/cash.mp3");
const lossSound = new Audio("./sounds/aww.mp3");

document
  .querySelector("#blackjack-hit-button")
  .addEventListener("click", blackjackHit);

document
  .querySelector("#blackjack-deal-button")
  .addEventListener("click", blackjackDeal);

document
  .querySelector("#blackjack-stand-button")
  .addEventListener("click", blackjackStand);

function blackjackHit() {
  let card = randomCard();
  //   consoleog(card);
  showCard(card, YOU);
  updateScore(card, YOU);
  showScore(YOU);
  //   console.log(YOU["score"]);
}

function blackjackStand() {
  let card = randomCard();
  //   console.log(card);
  showCard(card, DEALER);
  updateScore(card, DEALER);
  showScore(DEALER);

  if (DEALER["score"] > 15) {
    let winner = computWinner();
    showResult(winner);
  }
  //   console.log(YOU["score"]);
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame["cards"][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer["score"] <= 21) {
    let cardImage = document.createElement("img");
    cardImage.src = `./images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
  }
}

function blackjackDeal() {
  //   showResult(computWinner());

  let yourImages = document.querySelector("#your-box").querySelectorAll("img");
  for (i = 0; i < yourImages.length; i++) {
    yourImages[i].remove();
  }

  let dealerImages = document
    .querySelector("#dealer-box")
    .querySelectorAll("img");
  for (i = 0; i < dealerImages.length; i++) {
    dealerImages[i].remove();
  }
  YOU["score"] = 0;
  DEALER["score"] = 0;
  document.querySelector("#your-blackjack-result").textContent = 0;
  document.querySelector("#dealer-blackjack-result").textContent = 0;
  document.querySelector("#your-blackjack-result").style.color = "white";
  document.querySelector("#dealer-blackjack-result").style.color = "white";
  document.querySelector("#blackjack-result").style.color = "black";
  document.querySelector("#blackjack-result").textContent = "Let's Play";
  
  
}

function updateScore(card, activePlayer) {
  // If adding 11 keeps me below 21, add 11, otherwisw add 1
  if (card === "A") {
    if (activePlayer["score"] + blackjackGame["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += blackjackGame["cardsMap"][card][1];
    } else {
      activePlayer["score"] += blackjackGame["cardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += blackjackGame["cardsMap"][card];
  }
}

function showScore(activePlayer) {
  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUSTED!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent =
      activePlayer["score"];
  }
}

//comput winner and return who just won

function computWinner() {
  let winner;

  if (YOU["score"] <= 21) {
    // condition: higher score than dealer or when dealer busts but you don't bust.
    // update wins, losses and draws
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {
      //   console.log("You won");
      blackjackGame["wins"]++;
      winner = YOU;
    } else if (YOU["score"] < DEALER["score"]) {
      //   console.log("You Lost");
      blackjackGame["losses"]++;
      winner = DEALER;
    } else if (YOU["score"] === DEALER["score"]) {
      //   console.log("DRAW");
      blackjackGame["draws"]++;
    }
    // condition : when user busts but dealer does not
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {
    // console.log("you loose");
    blackjackGame["losses"]++;
    winner = DEALER;

    // conditione: when both busts
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    // console.log("DRAW");
    blackjackGame["draws"]++;
  }
  //   console.log("Winner is", winner);
  return winner;
}

function updateTable() {
  document.querySelector("#wins").textContent = blackjackGame["wins"];
  document.querySelector("#losses").textContent = blackjackGame["losses"];
  document.querySelector("#draws").textContent = blackjackGame["draws"];
}

function showResult(winner) {
  updateTable();
  let message, messageColor;

  if (winner === YOU) {
    message = "You Won!";
    messageColor = "green";
    winSound.play();
  } else if (winner === DEALER) {
    message = "You Lost!";
    messageColor = "red";
    lossSound.play();
  } else {
    message = "It is a draw!";
    messageColor = "black";
  }
  document.querySelector("#blackjack-result").textContent = message;
  document.querySelector("#blackjack-result").style.color = messageColor;
}
