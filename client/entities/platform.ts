import { GameObjects, Scene } from "phaser";

export class Platform extends GameObjects.Rectangle {
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, 300, 20, 0xff0000);
  }
}
