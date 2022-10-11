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
  }

  draw(ctx, pause) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }

    ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
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
