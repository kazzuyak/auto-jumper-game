import { AUTO, Game, Scale } from "phaser";
import { GameOver } from "./scenes/game-over";
import { GameWorld } from "./scenes/game-world";

export default new Game({
  type: AUTO,
  backgroundColor: "#125555",
  scale: {
    mode: Scale.RESIZE
  },
  input: {
    activePointers: 2
  },
  scene: [GameWorld, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
});
