import { GameObjects, Scene } from "phaser";

export class Jumper extends GameObjects.Arc {
  constructor(scene: Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      25,
      undefined,
      undefined,
      undefined,
      0x000000,
    )
  }
}