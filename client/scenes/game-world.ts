import { Physics, Scene } from "phaser";
import { Jumper } from "../entities/jumper";
import { Platform } from "../entities/platform";
import { ScoreCounter } from "../entities/score-counter";

export class GameWorld extends Scene {
  private platforms!: Physics.Arcade.StaticGroup;
  private player!: Jumper;
  private scoreCounter!: ScoreCounter;

  constructor() {
    super("game");
  }

  public preload() {
    Jumper.preLoad(this);
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

    this.physics.add.collider(this.platforms, this.player);

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

  private getRandomPlatformX(platformWidth: number) {
    return Phaser.Math.Between(
      platformWidth / 2,
      this.scale.width - platformWidth / 2,
    );
  }
}
