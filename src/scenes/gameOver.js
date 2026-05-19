import Phaser from "phaser";

import button from "../../assets/sprites/UI/button.png";
import buttonSound from "../../assets/sound/button.mp3";
import GameState from "../state/GameState.js";
// --- NUEVO IMPORT PARA EL DISEÑO BASADO EN DATOS ---
import ENDINGS from "../../assets/json/endings.json";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "gameOver" });
  }

  preload() {
    this.load.image("button", button);
    this.load.audio("buttonSound", buttonSound);
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Determinar qué final mostrar
    let endingKey;
    if (GameState.reputation <= 0) {
      endingKey = "bad";
    } else if (GameState.isNeutralEnding()) {
      endingKey = "neutral";
    } else {
      endingKey = "good";
    }

    const ending = ENDINGS[endingKey];

    this.add.image(centerX, centerY, "resumenBg").setScale(3);

    this.add
      .text(centerX, centerY - 140, ending.title, {
        fontFamily: "VT323, monospace",
        fontSize: "42px",
        color: ending.titleColor,
        fontWeight: "bold",
        align: "center",
        wordWrap: { width: 520 },
      })
      .setOrigin(0.5)
      .setStroke("#623100", 8);

    this.add
      .text(centerX, centerY - 10, ending.body, {
        fontFamily: "VT323, monospace",
        fontSize: "26px",
        color: "#2b1d10",
        align: "center",
        wordWrap: { width: 480 },
      })
      .setOrigin(0.5);

    this.createStyledButton(centerX, centerY + 150, ending.buttonLabel, () => {
      window.location.reload();
    });
  }

  createStyledButton(x, y, text, callback, texture = "button") {
    const boton = this.add
      .image(x, y, texture)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(3);

    const botonTexto = this.add
      .text(x, y - 3, text, {
        fontFamily: "VT323, monospace",
        fontSize: "25px",
        fill: "#ffffff",
      })
      .setOrigin(0.5);

    boton.on("pointerover", () => {
      boton.setScale(2.9);
      botonTexto.setColor("#ffcc00");
    });

    boton.on("pointerout", () => {
      boton.setScale(3);
      botonTexto.setColor("#ffffff");
    });

    boton.on("pointerdown", () => {
      this.sound.play("buttonSound", { volume: 0.2 });
      callback();
    });
  }
}