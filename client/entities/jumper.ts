import { GameObjects, Physics, Scene } from "phaser";
import { ImageEnum } from "../enums/ImageEnum";

export class Jumper extends GameObjects.Sprite {
  public body!: Physics.Arcade.Body;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, ImageEnum.JumperJumping);
    this.scale = 0.5;
  }
}
