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
  }

  public scoreUp() {
    this.score++;
    this.text = `Score: ${this.score}`;
  }
}
