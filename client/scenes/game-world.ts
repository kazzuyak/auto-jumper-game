import { Physics, Scene } from "phaser";
import { CustomScaleManager } from "../entities/custom-scale-manager";
import { Jumper } from "../entities/jumper";
import { Platform } from "../entities/platform";
import { PlatformManager } from "../entities/platform-manager";
import { ScoreCounter } from "../entities/score-counter";

export class GameWorld extends Scene {
  private platformManager!: PlatformManager;
  private player!: Jumper;
  private scoreCounter!: ScoreCounter;
  private customScale!: CustomScaleManager;

  constructor() {
    super("game");
  }

  public preload() {
    Jumper.preLoad(this);
  }

  public create() {
    this.customScale = new CustomScaleManager(this.scale);

    this.platformManager = new PlatformManager(this);

    const firstPlatform = this.platformManager.children.entries[
      this.platformManager.getLength() - 1
    ].body as Physics.Arcade.Body;

    this.player = new Jumper(
      this,
      this.scale.width / 2,
      firstPlatform.position.y -
        firstPlatform.height -
        this.customScale.safeSize * 0.1,
    );

    this.physics.add.collider(this.platformManager, this.player);

    this.cameras.main.startFollow(this.player, false, 0, 1);
    this.player.x = firstPlatform.position.x + firstPlatform.halfWidth;
    this.physics.world.gravity.y = this.customScale.safeSize;

    this.input.addPointer(1);

    this.scoreCounter = new ScoreCounter(
      this,
      this.scale.width * 0.5,
      this.scale.height * 0.05,
      this.customScale.safeSize * 0.04,
    )
      .setScrollFactor(0)
      .setOrigin(0.5);
    this.add.existing(this.scoreCounter);
  }

  public update() {
    this.platformManager.updatePlatforms();

    const bottomPlatform = this.platformManager.getBottomMostPlatform();

    this.scoreCounter.updateScore(this.platformManager.platformsUpdated);

    if (
      this.player.y >
      bottomPlatform.body.position.y + this.scale.height / 5
    ) {
      this.scene.start("game-over", { score: this.scoreCounter.score });
    }
  }
}
