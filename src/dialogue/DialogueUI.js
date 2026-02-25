import Phaser from "phaser";

/**
 * UI del cuadro de diálogo (solo presentación).
 * No decide qué línea toca; eso lo hace DialogueManager.
 */
export default class DialogueUI {
  /**
   * @param {Phaser.Scene} scene
   */
  constructor(scene) {
    this.scene = scene;

    const w = scene.scale.width;
    const h = scene.scale.height;

    this.container = scene.add.container(0, 0).setDepth(1000);
    this.container.setVisible(false);

    this.bg = scene.add
      .rectangle(w / 2, h - 110, w - 40, 180, 0x000000, 0.75)
      .setStrokeStyle(2, 0xffffff, 0.9);

    this.nameText = scene.add.text(40, h - 185, "", {
      fontFamily: "Arial",
      fontSize: "20px",
      color: "#ffd166",
    });

    this.lineText = scene.add.text(40, h - 155, "", {
      fontFamily: "Arial",
      fontSize: "18px",
      color: "#ffffff",
      wordWrap: { width: w - 80 },
    });

    this.continueText = scene.add
      .text(w - 160, h - 60, "Continuar", {
        fontFamily: "Arial",
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#2b2d42",
        padding: { left: 12, right: 12, top: 8, bottom: 8 },
      })
      .setInteractive({ useHandCursor: true });

    this.container.add([this.bg, this.nameText, this.lineText, this.continueText]);
  }

  onContinue(handler) {
    // borrar listeners previos si se reutiliza
    this.continueText.removeAllListeners();
    this.continueText.on("pointerdown", handler);
  }

  show() {
    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
  }

  setSpeakerName(name) {
    this.nameText.setText(name ?? "");
  }

  setLine(text) {
    this.lineText.setText(text ?? "");
  }

  setContinueLabel(label) {
    this.continueText.setText(label ?? "Continuar");
  }
}