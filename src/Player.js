import MovingDirection from "./MovingDirection.js";

export default class Player {
  constructor(x, y, size, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;
    this.stop = true;

    this.playerAnimationTimerDefault = 10;
    this.playerAnimationTimer = null;

    this.rewardSound = new Audio("../sounds/reward_trimmed.wav");

    this.powerRewardSound = new Audio("../sounds/powerReward.wav");
    this.powerRewardActive = false;
    this.powerRewardAboutToExpire = false;
    this.timers = [];

    this.eatEnemySound = new Audio("../sounds/eatEnemy.wav");

    this.madeFirstMove = false;
    document.addEventListener("keydown", this.#keydown);

    this.#loadPlayerImages();
  }

  draw(ctx, pause, enemies) {
    if (!pause) {
      this.#move();
      this.#animate();
    }

    this.#eatReward();
    this.#eatPowerReward();
    this.#eatEnemy(enemies);
    ctx.drawImage(
      this.playerImages[this.playerImageIndex],
      this.x,
      this.y,
      this.size,
      this.size
    );
  }

  #loadPlayerImages() {
    const playerImage1 = new Image();
    playerImage1.src = "../images/player0.png";

    const playerImage2 = new Image();
    playerImage2.src = "../images/player1.png";

    this.playerImages = [playerImage1, playerImage2];

    this.playerImageIndex = 0;
  }

  #keydown = (event) => {
    // up
    if (event.keyCode == 38) {
      if (this.currentMovingDirection == MovingDirection.down)
        this.currentMovingDirection = MovingDirection.up;
      this.requestedMovingDirection = MovingDirection.up;
      this.madeFirstMove = true;
    }
    // down
    if (event.keyCode == 40) {
      if (this.currentMovingDirection == MovingDirection.up)
        this.currentMovingDirection = MovingDirection.down;
      this.requestedMovingDirection = MovingDirection.down;
      this.madeFirstMove = true;
    }
    // left
    if (event.keyCode == 37) {
      if (this.currentMovingDirection == MovingDirection.right)
        this.currentMovingDirection = MovingDirection.left;
      this.requestedMovingDirection = MovingDirection.left;
      this.madeFirstMove = true;
    }
    // right
    if (event.keyCode == 39) {
      if (this.currentMovingDirection == MovingDirection.left)
        this.currentMovingDirection = MovingDirection.right;
      this.requestedMovingDirection = MovingDirection.right;
      this.madeFirstMove = true;
    }
  };

  #move() {
    if (this.currentMovingDirection !== this.requestedMovingDirection) {
      if (
        Number.isInteger(this.x / this.size) &&
        Number.isInteger(this.y / this.size)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            this.requestedMovingDirection
          )
        )
          this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    if (
      this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.currentMovingDirection
      )
    ) {
      this.playerAnimationTimer = null;
      this.playerImageIndex = 0;
      return;
    } else if (
      this.currentMovingDirection != null &&
      this.playerAnimationTimer == null
    ) {
      this.playerAnimationTimer = this.playerAnimationTimerDefault;
    }

    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        break;
    }
  }

  #animate() {
    if (this.playerAnimationTimer == null) {
      return;
    }
    this.playerAnimationTimer--;
    if (this.playerAnimationTimer == 0) {
      this.playerAnimationTimer = this.playerAnimationTimerDefault;
      this.playerImageIndex++;
      if (this.playerImageIndex == this.playerImages.length)
        this.playerImageIndex = 0;
    }
  }

  #eatReward() {
    if (this.tileMap.eatReward(this.x, this.y) && this.madeFirstMove) {
      this.rewardSound.play();
    }
  }

  #eatPowerReward() {
    if (this.tileMap.eatPowerReward(this.x, this.y) && this.madeFirstMove) {
      this.powerRewardSound.play();
      this.powerRewardActive = true;
      this.powerRewardAboutToExpire = false;
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];

      let powerRewardTimer = setTimeout(() => {
        this.powerRewardActive = false;
        this.powerRewardAboutToExpire = false;
      }, 1000 * 6);
      this.timers.push(powerRewardTimer);

      let powerRewardAboutToExpireTimer = setTimeout(() => {
        this.powerRewardAboutToExpire = true;
      }, 1000 * 3);
      this.timers.push(powerRewardTimer);
    }
  }

  #eatEnemy(enemies) {
    if (this.powerRewardActive) {
      const collideEnemies = enemies.filter((enemy) => enemy.collideWith(this));
      collideEnemies.forEach((enemy) => {
        enemies.splice(enemies.indexOf(enemy), 1);
        this.eatEnemySound.play();
      });
    }
  }
}
