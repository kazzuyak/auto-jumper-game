import { GameObjects, Physics, Scene } from "phaser";

export class Jumper extends GameObjects.Arc {
  public body!: Physics.Arcade.Body;

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