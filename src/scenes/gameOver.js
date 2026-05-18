import Phaser from "phaser";

// Importamos los mismos assets de botón que usa el Menú (revisa las rutas)
import button from "../../assets/sprites/UI/button.png";
import buttonSound from "../../assets/sound/button.mp3";

export default class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "gameOver" });
  }

  preload() {
    // Cargamos los sprites de los botones para usarlos aquí
    this.load.image("button", button);
    this.load.audio("buttonSound", buttonSound);
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // 1. CONFIGURACIÓN VISUAL (Estructura idéntica a dailySummary)
    const bgScale = 3;

    // Cambiamos el fondo al de dailySummary
    this.add.image(centerX, centerY, "resumenBg").setScale(bgScale);

    const titleColor = "#ffcc00";
    const textColor = "#2b1d10";


    this.add
      .text(centerX, centerY - 140, "ORDEN REAL: CLAUSURA DE TIENDA", {
        fontFamily: "VT323, monospace",
        fontSize: "42px",
        color: titleColor,
        fontWeight: "bold",
      })
      .setOrigin(0.5)
      .setStroke("#623100", 8);

    const loreText =
      "Tu reputación ha caído DEMASIADO.\n\nEl camino de la alquimia es duro, y los habitantes de los 6 reinos han dejado de confiar en ti.\n\nPresta más atención a sus peticiones en la próxima vida...";

    this.add
      .text(centerX, centerY - 10, loreText, {
        fontFamily: "VT323, monospace",
        fontSize: "26px",
        color: textColor,
        align: "center",
        wordWrap: { width: 480 },
      })
      .setOrigin(0.5);

    // BOTÓN VOLVER AL MENÚ 
    this.createStyledButton(centerX, centerY + 150, "REINTENTAR", () => {
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
      if (text) botonTexto.setColor("#ffcc00");
    });

    boton.on("pointerout", () => {
      boton.setScale(3);
      if (text) botonTexto.setColor("#ffffff");
    });

    boton.on("pointerdown", () => {
      this.sound.play("buttonSound", { volume: 0.2 });
      callback();
    });
  }
}