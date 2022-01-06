const moles = document.querySelectorAll(".mole")
const worm = document.querySelector(".worm");
const MOLE_SHOW_MIN = 1000;
const MOLE_SHOW_MAX = 2000;
const WAIT_BETWEEN_SHOW_MIN = 1000;
const WAIT_BETWEEN_SHOW_MAX = 2000;
const TIME_BEFORE_LEAVING = 500;
const TIME_LEAVING = 500;
const WIN_SCORE = 10;
let score = 0;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateScore(mole) {

  if (mole.classList.contains("mole-clicked")) {
    const isKing = mole.getAttribute("src") === "./images/king-mole-fed.png";
    mole.classList.remove("mole-clicked");
    if (isKing) {
      mole.setAttribute("src", "./images/king-mole-fed.png");
    } else {
      mole.setAttribute("src", "./images/mole-fed.png");
    }
  } else {
    const isKing = mole.getAttribute("src") === "./images/king-mole-hungry.png";
    if (isKing) {
      mole.setAttribute("src", "./images/king-mole-sad.png");
    } else {
      mole.setAttribute("src", "./images/mole-sad.png");
    }
  }
}

function showWinningScreen() {
  const scoreSection = document.querySelector(".score-container");
  const boardSection = document.querySelector(".board-container");
  const winningImg = document.querySelector(".winning-img");
  scoreSection.classList.add("hide");
  boardSection.classList.add("hide");
  document.body.classList.remove("play");
  document.body.classList.add("win");
  winningImg.style.display = "block";
}

async function showMole(timestamp) {
  const index = Math.floor(getRandomArbitrary(0, moles.length));
  const mole = moles[index];
  const isKing = Math.random() >= 0.5;
  if (isKing) {
    mole.setAttribute("src", "./images/king-mole-hungry.png");
  }
  mole.classList.add("show");
  await sleep(getRandomArbitrary(MOLE_SHOW_MIN, MOLE_SHOW_MAX));
  updateScore(mole);
  await sleep(TIME_BEFORE_LEAVING);
  if (isKing) {
    mole.setAttribute("src", "./images/king-mole-leaving.png");
  } else {
    mole.setAttribute("src", "./images/mole-leaving.png");
  }
  await sleep(TIME_LEAVING);
  mole.classList.remove("show");
  mole.setAttribute("src", "./images/mole-hungry.png");
  if (score < WIN_SCORE) {
    await sleep(getRandomArbitrary(WAIT_BETWEEN_SHOW_MIN, WAIT_BETWEEN_SHOW_MAX));
    window.requestAnimationFrame(showMole);
  } else {
    await sleep(500);
    showWinningScreen();
  }
}

function updateWormScore(mole, isKing) {
  score = isKing ? score + 2 : score + 1;
  const hiddenPercent = Math.max(0, 100 - score * (100 / WIN_SCORE));
  worm.style.clipPath = `inset(0 ${hiddenPercent}% 0 0)`;
}

function prepareEventListeners() {
  moles.forEach(mole => {
    mole.addEventListener("mousedown", event => {
      const isKing = event.target.getAttribute("src") === "./images/king-mole-hungry.png";
      if (isKing) {
        event.target.setAttribute("src", "./images/king-mole-fed.png");
      } else {
        event.target.setAttribute("src", "./images/mole-fed.png");
      }
      if (!event.target.classList.contains("mole-clicked")) {
        updateWormScore(event.target, isKing);
      }
      event.target.classList.add("mole-clicked");
    });
  });
}

async function init() {
  prepareEventListeners();
  await sleep(1000);
  window.requestAnimationFrame(showMole);
}

init();
