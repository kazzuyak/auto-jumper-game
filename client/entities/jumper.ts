import { GameObjects, Physics, Scene } from "phaser";

export class Jumper extends GameObjects.Arc {
  public body!: Physics.Arcade.Body;

  constructor(scene: Scene, x: number, y: number, radius: number) {
    super(
      scene,
      x,
      y,
      radius,
      undefined,
      undefined,
      undefined,
      0x000000,
    )
  }
}