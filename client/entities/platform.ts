import { GameObjects, Scene } from "phaser";

export class Platform extends GameObjects.Rectangle {
  constructor(scene: Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height, 0xff0000);
  }
}
