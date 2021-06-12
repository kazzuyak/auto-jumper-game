import { AUTO, Game, Scale } from "phaser";
import { GameOver } from "./scenes/game-over";
import { GameWorld } from "./scenes/game-world";

new Game({
  type: AUTO,
  backgroundColor: "#125555",
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [],
  physics: {
    default: "arcade",
    arcade: {
      gravity: {
        y: 1000,
      },
      debug: false,
    },
  },
});
