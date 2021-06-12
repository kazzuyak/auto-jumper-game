import { Physics, Scene, Types } from "phaser";
import { Jumper } from "../entities/jumper";
import { Platform } from "../entities/platform";

export class GameWorld extends Scene {
  private platforms!: Physics.Arcade.StaticGroup;
  private player!: Jumper;
  private cursors!: Types.Input.Keyboard.CursorKeys;

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
    (this.player.body as Physics.Arcade.Body).checkCollision.left = false;
    (this.player.body as Physics.Arcade.Body).checkCollision.right = false;
    (this.player.body as Physics.Arcade.Body).checkCollision.up = false;
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.startFollow(this.player, false, 0, 1);
    this.player.x = firstPlatform.x + 100;
  }

  update() {
    this.platforms.children.iterate((child) => {
      const position = child.body.position;
      const scrollY = this.cameras.main.scrollY;

      if (position.y >= scrollY + 700) {
        (child.body as Physics.Arcade.Body).reset(
          position.x + (child.body as Physics.Arcade.Body).halfWidth,
          scrollY,
        );
      }
    });

    const touchingDown = (this.player.body as Physics.Arcade.Body).touching
      .down;

    if (touchingDown) {
      (this.player.body as Physics.Arcade.Body).setVelocityY(-250);
    }

    let playerVelocity = 0;

    if (this.cursors.left.isDown && !touchingDown) {
      playerVelocity -= 300;
    }

    if (this.cursors.right.isDown && !touchingDown) {
      playerVelocity += 300;
    }

    (this.player.body as Physics.Arcade.Body).setVelocityX(playerVelocity);

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
