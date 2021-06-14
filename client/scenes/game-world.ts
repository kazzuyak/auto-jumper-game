import { Input, Physics, Scene } from "phaser";
import { Jumper } from "../entities/jumper";
import { Platform } from "../entities/platform";
import { ScoreCounter } from "../entities/score-counter";
import { ImageEnum } from "../enums/ImageEnum";

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
  private scoreCounter!: ScoreCounter;

  constructor() {
    super("game");
  }

  public preload() {
    this.load.image(
      ImageEnum.JumperJumping,
      require("../assets/bunny1_jump.png"),
    );
    this.load.image(
      ImageEnum.JumperStanding,
      require("../assets/bunny1_ready.png"),
    );
    this.load.image(
      ImageEnum.JumperWalking,
      require("../assets/bunny1_walk1.png"),
    );
  }

  public create() {
    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; ++i) {
      const platformWidth = this.scale.width / 5;

      const x = this.getRandomPlatformX(platformWidth);
      const y = (this.scale.height / 5) * i;

      const platform = new Platform(
        this,
        x,
        y,
        platformWidth,
        this.scale.height / 100,
      );
      this.platforms.add(platform, true);
    }

    const firstPlatform = this.platforms.children.entries[
      this.platforms.getLength() - 1
    ].body as Physics.Arcade.Body;

    this.player = new Jumper(
      this,
      this.scale.width / 2,
      firstPlatform.position.y - firstPlatform.height - this.scale.height * 0.1,
    );

    this.physics.add.existing(this.player);
    this.add.existing(this.player);

    this.physics.add.collider(this.platforms, this.player);
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
    this.player.body.checkCollision.up = false;
    this.cursors = this.input.keyboard.addKeys("left,right,A,D") as ICursors;

    this.cameras.main.startFollow(this.player, false, 0, 1);
    this.player.x = firstPlatform.position.x + firstPlatform.halfWidth;
    this.physics.world.gravity.y = this.scale.height;
    this.input.addPointer(1);

    this.scoreCounter = new ScoreCounter(
      this,
      this.scale.width * 0.5,
      this.scale.height * 0.05,
      this.scale.height * 0.025,
    )
      .setScrollFactor(0)
      .setOrigin(0.5);
    this.add.existing(this.scoreCounter);
  }

  public update() {
    this.platforms.children.iterate((child) => {
      const childBody = child.body as Physics.Arcade.Body;
      const scrollY = this.cameras.main.scrollY;

      if (childBody.y >= scrollY + this.scale.height) {
        childBody.reset(this.getRandomPlatformX(childBody.width), scrollY);
        this.scoreCounter.scoreUp();
      }
    });

    const touchingDown = this.player.body.touching.down;

    if (touchingDown) {
      this.player.body.setVelocityY(-this.scale.height * 0.7);
      this.player.setTexture(ImageEnum.JumperJumping);
    }

    if (
      this.player.body.velocity.y > 0 &&
      this.player.texture.key !== ImageEnum.JumperStanding
    ) {
      this.player.setTexture(ImageEnum.JumperStanding);
    }

    const playerInput = this.getPlayerInput();

    let playerVelocity = 0;

    if (playerInput.left && !touchingDown) {
      playerVelocity -= this.scale.width * 0.34;
    }

    if (playerInput.right && !touchingDown) {
      playerVelocity += this.scale.width * 0.34;
    }

    if (playerVelocity !== 0) {
      const fliX = playerVelocity > 0 ? false : true;

      this.player.setTexture(ImageEnum.JumperWalking).setFlipX(fliX);
    }

    this.player.body.setVelocityX(playerVelocity);

    this.horizontalWrap(this.player);

    const bottomPlatform = this.findBottomMostPlatform();
    if (
      this.player.y >
      bottomPlatform.body.position.y + this.scale.height / 5
    ) {
      this.scene.start("game-over", { score: this.scoreCounter.score });
    }
  }

  private getPlayerInput(): { left: boolean; right: boolean } {
    let isPressingLeft = false;
    let isPressingRight = false;

    const pointer1 = this.input.pointer1;
    const pointer2 = this.input.pointer2;

    if (
      (pointer1.isDown && pointer1.x >= this.scale.width / 2) ||
      (pointer2.isDown && pointer2.x >= this.scale.width / 2) ||
      this.cursors.right.isDown ||
      this.cursors.D.isDown
    ) {
      isPressingRight = true;
    }

    if (
      (pointer1.isDown && pointer1.x < this.scale.width / 2) ||
      (pointer2.isDown && pointer2.x < this.scale.width / 2) ||
      this.cursors.left.isDown ||
      this.cursors.A.isDown
    ) {
      isPressingLeft = true;
    }

    return {
      left: isPressingLeft,
      right: isPressingRight,
    };
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

  private getRandomPlatformX(platformWidth: number) {
    return Phaser.Math.Between(
      platformWidth / 2,
      this.scale.width - platformWidth / 2,
    );
  }
}
