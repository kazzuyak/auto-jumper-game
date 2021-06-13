import { Input, Physics, Scene } from "phaser";
import { Jumper } from "../entities/jumper";
import { Platform } from "../entities/platform";
import { ScoreCounter } from "../entities/score-counter";

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

  public preload() {}

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

    const ballRadius = this.scale.width / 55;

    this.player = new Jumper(
      this,
      this.scale.width / 2,
      firstPlatform.position.y - ballRadius - firstPlatform.height,
      ballRadius,
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
      playerVelocity -= this.scale.width * 0.34;
    }

    if (
      (this.cursors.right.isDown || this.cursors.D.isDown || isPressingRight) &&
      !touchingDown
    ) {
      playerVelocity += this.scale.width * 0.34;
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
