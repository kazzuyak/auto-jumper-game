import { GameObjects, Scene } from "phaser";

export class ScoreCounter extends GameObjects.Text {
  constructor(
    scene: Scene,
    x: number,
    y: number,
    fontSize: number,
    public score: number = 0,
  ) {
    super(scene, x, y, `Score: ${score}`, { fontSize: `${fontSize}px` });
    scene.add.existing(this);
    this.setScrollFactor(0);
    this.setOrigin(0.5);
  }

  public updateScore(score: number) {
    this.score = score;
    this.text = `Score: ${this.score}`;
  }
}
