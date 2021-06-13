import { Input, Physics, Scene, Types } from "phaser";
import { Jumper } from "../entities/jumper";
import { Platform } from "../entities/platform";

interface ICursors {
  left: Input.Keyboard.Key;
  right: Input.Keyboard.Key;
  A: Input.Keyboard.Key;
  D: Input.Keyboard.Key;
}

export class GameWorld extends Scene {
  private platforms!: Physics.Arcade.StaticGroup;
  private player!: Jumper;
  private cursors!: ICursors;

  constructor() {
    super("game");
  }

  preload() {}

  create() {
    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; ++i) {
      const x = Phaser.Math.Between(200, 800);
      const y = 150 * i;

      const platform = new Platform(this, x, y);
      this.platforms.add(platform, true);
    }

    const firstPlatform = this.platforms.children.entries[4].body.position;

    this.player = new Jumper(this, this.scale.width / 2, firstPlatform.y - 100);

    this.physics.add.existing(this.player);
    this.add.existing(this.player);

    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
    this.player.body.checkCollision.up = false;
    this.cursors = this.input.keyboard.addKeys("left,right,A,D") as ICursors;

    this.cameras.main.startFollow(this.player, false, 0, 1);
    this.player.x = firstPlatform.x + 100;
  }

  update() {
    this.platforms.children.iterate((child) => {
      const childBody = child.body as Physics.Arcade.Body;
      const scrollY = this.cameras.main.scrollY;

      if (childBody.y >= scrollY + 700) {
        childBody.reset(childBody.x + childBody.halfWidth, scrollY);
      }
    });

    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.body.setVelocityY(-560);
    }

    let playerVelocity = 0;

    let isPressingLeft = false;
    let isPressingRight = false;

    const pointer1 = this.input.pointer1;

    if (pointer1.isDown) {
      if (pointer1.x >= this.scale.width / 2) {
        isPressingRight = true;
      }

      if (pointer1.x < this.scale.width / 2) {
        isPressingLeft = true;
      }
    }

    const pointer2 = this.input.pointer2;

    if (pointer2.isDown) {
      if (pointer2.x >= this.scale.width / 2) {
        isPressingRight = true;
      }

      if (pointer2.x < this.scale.width / 2) {
        isPressingLeft = true;
      }
    }

    if (
      (this.cursors.left.isDown || this.cursors.A.isDown || isPressingLeft) &&
      !touchingDown
    ) {
      playerVelocity -= 300;
    }

    if (
      (this.cursors.right.isDown || this.cursors.D.isDown || isPressingRight) &&
      !touchingDown
    ) {
      playerVelocity += 300;
    }

    this.player.body.setVelocityX(playerVelocity);

    this.horizontalWrap(this.player);

    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.body.position.y + 200) {
      this.scene.start("game-over");
    }
  }

  private findBottomMostPlatform() {
    const platforms = this.platforms.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i];

      if (platform.body.position.y < bottomPlatform.body.position.y) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }

  private horizontalWrap(player: Jumper) {
    const halfWidth = player.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (player.x < -halfWidth) {
      player.x = gameWidth + halfWidth;
    } else if (player.x > gameWidth + halfWidth) {
      player.x = -halfWidth;
    }
  }
}
