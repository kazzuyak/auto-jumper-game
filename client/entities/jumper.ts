import { GameObjects, Input, Physics, Scene } from "phaser";
import { ImageEnum } from "../enums/ImageEnum";
import { CustomScaleManager } from "./custom-scale-manager";
interface ICursors {
  left: Input.Keyboard.Key;
  right: Input.Keyboard.Key;
  A: Input.Keyboard.Key;
  D: Input.Keyboard.Key;
}
export class Jumper extends GameObjects.Sprite {
  public body!: Physics.Arcade.Body;
  private cursors!: ICursors;
  private customScale: CustomScaleManager;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, ImageEnum.JumperJumping);
    this.scale = 0.5;

    scene.physics.add.existing(this);
    scene.add.existing(this);
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;
    this.body.checkCollision.up = false;

    this.cursors = this.scene.input.keyboard.addKeys(
      "left,right,A,D",
    ) as ICursors;

    this.customScale = new CustomScaleManager(scene.scale);
  }

  public static preLoad(scene: Scene) {
    scene.load.image(
      ImageEnum.JumperJumping,
      require("../assets/bunny1_jump.png"),
    );
    scene.load.image(
      ImageEnum.JumperStanding,
      require("../assets/bunny1_ready.png"),
    );
    scene.load.image(
      ImageEnum.JumperWalking,
      require("../assets/bunny1_walk1.png"),
    );
  }

  public preUpdate() {
    this.jumpIfTouchingDown();
    this.changeTextureIfFalling();
    this.horizontalWrap();
    this.handlePlayerInput();
  }

  private jumpIfTouchingDown() {
    if (this.body.touching.down) {
      this.body.setVelocityY(-this.scene.scale.height * 0.7);
      this.setTexture(ImageEnum.JumperJumping);
    }
  }

  private changeTextureIfFalling() {
    if (
      this.body.velocity.y > 0 &&
      this.texture.key !== ImageEnum.JumperStanding
    ) {
      this.setTexture(ImageEnum.JumperStanding);
    }
  }

  private horizontalWrap() {
    const jumperHalfWidth = this.displayWidth * 0.5;

    const endingX =
      this.customScale.extraHalfX + this.customScale.safeSize + jumperHalfWidth;
    const startingX = this.customScale.extraHalfX - jumperHalfWidth;

    if (this.x < startingX) {
      this.x = endingX;
    }

    if (this.x > endingX) {
      this.x = startingX;
    }
  }

  private handlePlayerInput() {
    const touchingDown = this.body.touching.down;

    const playerInput = this.getPlayerInput();

    let playerVelocity = 0;

    if (playerInput.left && !touchingDown) {
      playerVelocity -= this.customScale.safeSize * 0.34;
    }

    if (playerInput.right && !touchingDown) {
      playerVelocity += this.customScale.safeSize * 0.34;
    }

    if (playerVelocity !== 0) {
      const fliX = playerVelocity > 0 ? false : true;

      this.setTexture(ImageEnum.JumperWalking).setFlipX(fliX);
    }

    this.body.setVelocityX(playerVelocity);
  }

  private getPlayerInput(): { left: boolean; right: boolean } {
    let isPressingLeft = false;
    let isPressingRight = false;

    const pointer1 = this.scene.input.pointer1;
    const pointer2 = this.scene.input.pointer2;

    if (
      (pointer1.isDown && pointer1.x >= this.scene.scale.width / 2) ||
      (pointer2.isDown && pointer2.x >= this.scene.scale.width / 2) ||
      this.cursors.right.isDown ||
      this.cursors.D.isDown
    ) {
      isPressingRight = true;
    }

    if (
      (pointer1.isDown && pointer1.x < this.scene.scale.width / 2) ||
      (pointer2.isDown && pointer2.x < this.scene.scale.width / 2) ||
      this.cursors.left.isDown ||
      this.cursors.A.isDown
    ) {
      isPressingLeft = true;
    }

    return {
      left: isPressingLeft,
      right: isPressingRight,
    };
  }
}
