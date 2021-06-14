import { Scale } from "phaser";

export class CustomScaleManager {
  constructor(private scaleManager: Scale.ScaleManager) {}

  public get safeSize() {
    return this.scaleManager.isGamePortrait ? this.scaleManager.width : this.scaleManager.height;
  }

  public get extraHalfX() {
    return (this.scaleManager.width - this.safeSize) / 2;
  }
}
