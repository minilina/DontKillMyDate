import Phaser from 'phaser';
import CustomerFlowManager from "../dialogue/customerFlowManager.js";
import GameState from "../state/GameState.js";

export default class Store extends Phaser.Scene {
  /**
   * Constructor de la escena
   */
  constructor() {
    super({ key: "store" });
  }

  preload() {}

  /**
   * Creación de los elementos de la escena principal de juego
   */
  create() {
    this.add
      .image(0, 0, "store")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);

    this.flowManager = new CustomerFlowManager(this);
    this.flowManager.startShift();

    // Pausa
    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );
  }

  update(time, delta) {
    this.flowManager?.update(time, delta);
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.openPauseMenu();
    }
  }

  openPauseMenu() {
    this.scene.launch("Menu", { parentScene: this.scene.key });
    this.scene.pause();
  }

  showPotionResult() {
    // Fondo semitransparente
    const overlay = this.add
      .rectangle(this.scale.width / 2, 240, 500, 150, 0x000000, 0.7)
      .setOrigin(0.5)
      .setDepth(100);

    const quality = GameState.currentPotion.quality;

    // reaccionar cliente
    if (this.flowManager && this.flowManager.currentCustomer) {
      this.flowManager.currentCustomer.reaccionar(quality);
    }

    // actiualizar reputación
    GameState.deliverPotion();


    const qualityText = this.add
      .text(this.scale.width / 2, 200, `Calidad: ${quality}%`, {
        fontFamily: "VT323, monospace",
        fontSize: "40px",
        color: "#f2e3d3",
      })
      .setOrigin(0.5)
      .setDepth(101);

    const repText = this.add
      .text(this.scale.width / 2, 280, `Reputación: ${GameState.reputation}`, {
        fontFamily: "VT323, monospace",
        fontSize: "35px",
        color: "#f2e3d3",
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Esperar 2.5 segundos y continuar
    this.time.delayedCall(2500, () => {
      overlay.destroy();
      qualityText.destroy();
      repText.destroy();

      this.flowManager.continueShift();
    });
  }
}