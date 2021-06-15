import { Physics, Scene } from "phaser";
import { CustomScaleManager } from "./custom-scale-manager";
import { Platform } from "./platform";

export class PlatformManager extends Physics.Arcade.StaticGroup {
  private customScale: CustomScaleManager;
  public platformsUpdated = 0;

  constructor(scene: Scene) {
    super(scene.physics.world, scene)

    this.customScale = new CustomScaleManager(scene.scale);

    const platformDistanceY = this.customScale.safeSize * 0.25;

    const startingPlatforms = Math.ceil(this.scene.scale.height / platformDistanceY);

    for (let i = 0; i < startingPlatforms; i++) {
      const platformWidth = this.customScale.safeSize * 0.2;

      const x = this.getRandomPlatformX(platformWidth);
      const y = platformDistanceY * i;

      const platform = new Platform(
        scene,
        x,
        y,
        platformWidth,
        this.customScale.safeSize / 100,
      );
      this.add(platform, true);
    }
  }

  public updatePlatforms() {
    this.children.iterate((child) => {
      const childBody = child.body as Physics.Arcade.Body;
      const scrollY = this.scene.cameras.main.scrollY;

      if (childBody.y >= scrollY + this.scene.scale.height) {
        childBody.reset(this.getRandomPlatformX(childBody.width), scrollY);
        this.platformsUpdated++
      }
    });
  }

  public getBottomMostPlatform() {
    const platforms = this.getChildren();
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; ++i) {
      const platform = platforms[i];

      if (platform.body.position.y < bottomPlatform.body.position.y) {
        continue;
      }

      bottomPlatform = platform;
    }

    return bottomPlatform;
  }

  private getRandomPlatformX(platformWidth: number) {
    return Phaser.Math.Between(
      this.customScale.extraHalfX + platformWidth / 2,
      this.customScale.extraHalfX +
        this.customScale.safeSize -
        platformWidth / 2,
    );
  }
}