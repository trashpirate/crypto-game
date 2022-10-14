import TileMap from "./TileMap.js";

const tileSize = 64;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const player = tileMap.getPlayer(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("../sounds/gameOver.wav");
const gameWinSound = new Audio("../sounds/gameWin.wav");

function gameLoop() {
  tileMap.draw(ctx);
  player.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), player));
  drawGameEnd();
  checkGameOver();
  checkGameWin();
  // console.log("game loop");
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !player.powerRewardActive && enemy.collideWith(player)
  );
}

function pause() {
  return !player.madeFirstMove || gameOver || gameWin;
}

function drawBanner(text, width, height, color) {
  let rectWidth = width;
  let rectHeight = height;

  // let text = "Game Over!";

  ctx.fillStyle = "black";
  ctx.strokeStyle = color;
  ctx.lineWidth = 5;
  ctx.fillRect(
    canvas.width / 2 - rectWidth / 2,
    canvas.height / 2 - rectHeight / 2,
    rectWidth,
    rectHeight
  );
  ctx.strokeRect(
    canvas.width / 2 - rectWidth / 2,
    canvas.height / 2 - rectHeight / 2,
    rectWidth,
    rectHeight
  );
  ctx.font = 'bold 50px "Press Start 2P"';
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillStyle = color;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
}

function drawGameEnd() {
  // drawBanner("You Win!", 600, 100, color);

  if (gameOver || gameWin) {
    let text = "You Win!";
    let color = "aqua";
    if (gameOver) {
      text = "Game Over!";
      color = "red";
    }
    drawBanner(text, 600, 100, color);
  }
}

tileMap.setCanvasSize(canvas);
window.focus();
setInterval(gameLoop, 1000 / 75);
