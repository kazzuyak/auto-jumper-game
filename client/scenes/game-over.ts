import { Scene } from "phaser";
import { CustomScaleManager } from "../entities/custom-scale-manager";
import { ScoreCounter } from "../entities/score-counter";

export class GameOver extends Scene {

  constructor() {
    super("game-over");
  }

  create(data: { score: number }) {
    const customScale = new CustomScaleManager(this.scale);
    const width = this.scale.width;
    const height = this.scale.height;

    this.add
      .text(width * 0.5, height * 0.65, "Tap Screen or Press Space", {
        fontSize: `${customScale.safeSize * 0.035}px`,
      })
      .setOrigin(0.5);

    new ScoreCounter(
      this,
      this.scale.width * 0.5,
      this.scale.height * 0.4,
      customScale.safeSize * 0.1,
      data.score,
    ).setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("game");
    });

    this.input.once("pointerdown", () => {
      this.scene.start("game");
    });
  }
}
