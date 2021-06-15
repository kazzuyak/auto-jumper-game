import { GameObjects, Scene } from "phaser";
import { ImageEnum } from "../enums/ImageEnum";
import { CustomScaleManager } from "./custom-scale-manager";

export class WallPortal extends GameObjects.TileSprite {
  constructor(scene: Scene, x: number) {
    super(
      scene,
      x,
      scene.scale.height / 2,
      70,
      scene.scale.height,
      ImageEnum.Wall,
    );

    const customScale = new CustomScaleManager(scene.scale);

    this.scaleX = customScale.safeSize * 0.0003;
    this.setAlpha(0.3);
    this.setScrollFactor(0);
    scene.add.existing(this);
  }
}
