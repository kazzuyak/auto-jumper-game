import { AUTO, Game, Scale } from "phaser";
import GameOver from "./scenes/game-over";
import { GameWorld } from "./scenes/game-world";

new Game({
  type: AUTO,
  backgroundColor: "#125555",
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [GameWorld, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 200,
      },
      debug: true,
    },
  },
});
