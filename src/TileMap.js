import Player from "./Player.js";
import MovingDirection from "./MovingDirection.js";
import Enemy from "./Enemy.js";

export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;

    this.reward = new Image();
    this.reward.src = "../images/reward.png";

    this.rewardFlash = new Image();
    this.rewardFlash.src = "../images/reward_flash.png";

    this.wall = new Image();
    this.wall.src = "../images/wall.png";

    this.player = new Image();
    this.player.src = "../images/player0.png";

    this.powerReward = this.rewardFlash;
    this.powerRewardAnimationTimerDefault = 30;
    this.powerRewardAnimationTimer = this.powerRewardAnimationTimerDefault;
  }

  //1 - wall
  //0 - rewards
  //4 - pacman
  //5 - empty space
  //6 - enemy
  //7 - power reward
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 7, 0, 0, 4, 0, 0, 0, 0, 0, 0, 7, 1],
    [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 6, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 7, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        let tile = this.map[row][col];
        if (tile == 1) {
          this.#drawWall(ctx, col, row, this.tileSize);
        } else {
          this.#drawBlank(ctx, col, row, this.tileSize);
          if (tile == 0) {
            this.#drawReward(ctx, col, row, this.tileSize);
          } else if (tile == 7) {
            this.#drawPowerReward(ctx, col, row, this.tileSize);
          }
        }

        // visualizing map squares
        // ctx.strokeStyle = "yellow";
        // ctx.strokeRect(
        //   col * this.tileSize,
        //   row * this.tileSize,
        //   this.tileSize,
        //   this.tileSize
        // );
      }
    }
  }

  #drawWall(ctx, col, row, size) {
    ctx.drawImage(this.wall, col * size, row * size, size, size);
  }

  #drawReward(ctx, col, row, size) {
    ctx.drawImage(this.reward, col * size, row * size, size, size);
  }

  #drawPowerReward(ctx, col, row, size) {
    this.powerRewardAnmationTimer--;
    if (this.powerRewardAnmationTimer === 0) {
      this.powerRewardAnmationTimer = this.powerRewardAnmationTimerDefault;
      if (this.powerReward == this.rewardFlash) {
        this.powerReward = this.reward;
      } else {
        this.powerReward = this.rewardFlash;
      }
    }
    ctx.drawImage(this.powerReward, col * size, row * size, size, size);
  }

  #drawBlank(ctx, col, row, size) {
    ctx.fillStyle = "#222";
    ctx.fillRect(col * size, row * size, size, size);
  }

  getPlayer(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        let tile = this.map[row][col];
        if (tile == 4) {
          this.map[row][col] = 0;
          return new Player(
            col * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this
          );
        }
      }
    }
  }

  getEnemies(velocity) {
    const enemies = [];
    for (let row = 0; row < this.map.length; row++) {
      for (let col = 0; col < this.map[row].length; col++) {
        const tile = this.map[row][col];
        if (tile == 6) {
          this.map[row][col] = 0;
          enemies.push(
            new Enemy(
              col * this.tileSize,
              row * this.tileSize,
              this.tileSize,
              velocity,
              this
            )
          );
        }
      }
    }
    return enemies;
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.tileSize;
    canvas.height = this.map.length * this.tileSize;
  }

  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) {
      return;
    }
    if (
      Number.isInteger(x / this.tileSize) &&
      Number.isInteger(y / this.tileSize)
    ) {
      let col = 0;
      let row = 0;
      let nextCol = 0;
      let nextRow = 0;

      switch (direction) {
        case MovingDirection.right:
          nextCol = x + this.tileSize;
          col = nextCol / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.left:
          nextCol = x - this.tileSize;
          col = nextCol / this.tileSize;
          row = y / this.tileSize;
          break;
        case MovingDirection.up:
          nextRow = y - this.tileSize;
          row = nextRow / this.tileSize;
          col = x / this.tileSize;
          break;
        case MovingDirection.down:
          nextRow = y + this.tileSize;
          row = nextRow / this.tileSize;
          col = x / this.tileSize;
          break;
      }
      const tile = this.map[row][col];
      if (tile == 1) {
        return true;
      }
    }
    return false;
  }

  eatReward(x, y) {
    const row = y / this.tileSize;
    const col = x / this.tileSize;

    if (Number.isInteger(row) && Number.isInteger(col)) {
      if (this.map[row][col] == 0) {
        this.map[row][col] = 5;
        return true;
      }
    }
    return false;
  }
}
