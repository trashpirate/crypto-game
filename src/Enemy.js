import MovingDirection from "./MovingDirection.js";

export default class Enemy {
  constructor(x, y, size, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.velocity = velocity;
    this.tileMap = tileMap;

    this.#loadImages();

    this.movingDirection = Math.floor(
      Math.random() * Object.keys(MovingDirection).length
    );

    this.directionTimerDefault = this.#random(10, 50);
    this.directionTimer = this.directionTimerDefault;

    this.scaredAboutToExpireDefault = 10;
    this.scaredAboutToExpireTimer = this.scaredAboutToExpireDefault;
  }

  draw(ctx, pause, player) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, player);
  }

  collideWith(player) {
    const size = this.size / 2;
    if (
      this.x < player.x + size &&
      this.x + size > player.x &&
      this.y < player.y + size &&
      this.y + size > player.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  #setImage(ctx, player) {
    if (player.powerRewardActive) {
      this.#setImageWhePowerDotIsActive(player);
    } else {
      this.image = this.normalEnemy;
    }
    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
  }

  #setImageWhePowerDotIsActive(player) {
    if (player.powerRewardAboutToExpire) {
      this.scaredAboutToExpireTimer--;
      if (this.scaredAboutToExpireTimer === 0) {
        this.scaredAboutToExpireTimer = this.scaredAboutToExpireDefault;
        if (this.image === this.scaredEnemy) {
          this.image = this.scaredEnemy2;
        } else {
          this.image = this.scaredEnemy;
        }
      }
    } else {
      this.image = this.scaredEnemy;
    }
  }

  #move() {
    if (
      !this.tileMap.didCollideWithEnvironment(
        this.x,
        this.y,
        this.movingDirection
      )
    ) {
      switch (this.movingDirection) {
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
  }

  #changeDirection() {
    this.directionTimer--;
    let newMoveDirection = null;
    if (this.directionTimer == 0) {
      this.directionTimer = this.directionTimerDefault;
      newMoveDirection = Math.floor(
        Math.random() * Object.keys(MovingDirection).length
      );
    }

    if (newMoveDirection != null && this.movingDirection != newMoveDirection) {
      if (
        Number.isInteger(this.x / this.size) &&
        Number.isInteger(this.y / this.size)
      ) {
        if (
          !this.tileMap.didCollideWithEnvironment(
            this.x,
            this.y,
            newMoveDirection
          )
        ) {
          this.movingDirection = newMoveDirection;
        }
      }
    }
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  #loadImages() {
    this.normalEnemy = new Image();
    this.normalEnemy.src = "../images/enemy.png";

    this.scaredEnemy = new Image();
    this.scaredEnemy.src = "../images/scaredEnemy.png";

    this.scaredEnemy2 = new Image();
    this.scaredEnemy2.src = "../images/scaredEnemy2.png";

    this.image = this.normalEnemy;
  }
}
