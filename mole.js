const worm = document.querySelector(".worm");
const TIME_SAD = 500;
const TIME_LEAVING = 500;
const TIME_GONE_MIN = 2000;
const TIME_GONE_MAX = 20000;
const TIME_HUNGRY = 1000;
const TIME_FED = 500;
const WIN_SCORE = 10;
const moles = [];
let score = 0;

function getNextTime(ms) {
  return Date.now() + ms;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function getKingStatus() {
  return Math.random() > 0.9;
}

function showWinningScreen() {
  const gameBoard = document.querySelector(".game-board");
  gameBoard.classList.add("hide");
  const win = document.querySelector(".win");
  document.body.style.backgroundImage = "none";
  win.classList.remove("hide");
}

function updateScorebar(mole) {
  const hiddenPercent = Math.max(0, 100 - score * (100 / WIN_SCORE));
  worm.style.clipPath = `inset(0 ${hiddenPercent}% 0 0)`;
  if (score >= WIN_SCORE) {
    showWinningScreen();
  }
}

function getNextStatus(mole) {
  switch (mole.state) {
    case "hungry":
      if (mole.isKing) {
        mole.node.setAttribute("src", "./images/king-mole-sad.png");
      } else {
        mole.node.setAttribute("src", "./images/mole-sad.png");
      }
      mole.node.classList.remove("hungry");
      mole.state = "sad";
      mole.nextStateTime = getNextTime(TIME_SAD);
      break;
    case "sad":
      if (mole.isKing) {
        score = Math.max(0, score - 2);
      } else {
        score = Math.max(0, score - 1);
      }
      updateScorebar();
    case "fed":
      if (mole.isKing) {
        mole.node.setAttribute("src", "./images/king-mole-leaving.png");
      } else {
        mole.node.setAttribute("src", "./images/mole-leaving.png");
      }
      mole.state = "leaving";
      mole.nextStateTime = getNextTime(TIME_LEAVING);
      break;
    case "leaving":
      mole.isKing = false;
      mole.state = "gone";
      mole.node.classList.add("gone");
      mole.nextStateTime = getNextTime(
        getRandomArbitrary(TIME_GONE_MIN, TIME_GONE_MAX)
      );
      break;
    case "gone":
      mole.isKing = getKingStatus();
      if (mole.isKing) {
        mole.node.setAttribute("src", "./images/king-mole-hungry.png");
      } else {
        mole.node.setAttribute("src", "./images/mole-hungry.png");
      }
      mole.state = "hungry";
      mole.node.classList.add("hungry");
      mole.node.classList.remove("gone");
      mole.nextStateTime = getNextTime(TIME_HUNGRY);
      break;
  }
}

function feed(event) {
  if (
    event.target.tagName !== "IMG" ||
    !event.target.classList.contains("hungry")
  ) {
    return;
  }
  const mole = moles[parseInt(event.target.dataset.index)];
  mole.state = "fed";
  mole.nextStateTime = getNextTime(TIME_FED);
  mole.node.classList.remove("hungry");
  if (mole.isKing) {
    score += 2;
    mole.node.setAttribute("src", "./images/king-mole-fed.png");
  } else {
    score += 1;
    mole.node.setAttribute("src", "./images/mole-fed.png");
  }
  updateScorebar(mole);
}

function addMouseEventListener() {
  const board = document.querySelector(".board-container");

  board.addEventListener("click", feed);
}

function createMoles() {
  document.querySelectorAll(".mole").forEach((mole) => {
    mole.setAttribute("src", "./images/king-mole-hungry.png");
    moles.push({
      state: "sad",
      isKing: true,
      nextStateTime: getNextTime(TIME_SAD),
      node: mole,
    });
  });
}

function nextFrame() {
  const now = Date.now();
  moles.forEach((mole) => {
    if (mole.nextStateTime < now) {
      getNextStatus(mole);
    }
  });
  requestAnimationFrame(nextFrame);
}

function init() {
  createMoles();
  addMouseEventListener();
  window.requestAnimationFrame(nextFrame);
}

init();
