import Phaser from "phaser";
import GameState from "../state/GameState.js";

export default class DailySummary extends Phaser.Scene {
  constructor() {
    super({ key: "dailySummary" });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // 1. CONFIGURACIÓN VISUAL
    const bgScale = 3;
    const iconScale = 1.6;
    const starScale = 1.3;
    const iconSpacing = 65;

    
    this.add.image(centerX, centerY, "resumenBg").setScale(bgScale);

    const stats = GameState.dailyStats;
    const titleColor = "#3e2723";
    const textColor = "#2b1d10";

   
    this.add
      .text(centerX, centerY - 140, `DÍA ${GameState.currentDay} FINALIZADO`, {
        fontFamily: "VT323, monospace",
        fontSize: "42px",
        color: titleColor,
        fontWeight: "bold",
      })
      .setOrigin(0.5);

    
    this.add
      .text(centerX, centerY - 85, "Desempeño Alquímico", {
        fontFamily: "VT323, monospace",
        fontSize: "26px",
        color: textColor,
      })
      .setOrigin(0.5);

    this.animateIconRow(
      centerX,
      centerY - 45,
      "estrella",
      GameState.getDailyStars(),
      starScale,
      iconSpacing,
      200,
    );

    const sign = stats.repChange >= 0 ? "+" : "";
    const repLabel = `Reputación Total: ${GameState.reputation} (${sign}${stats.repChange})`;

    this.add
      .text(centerX, centerY + 25, repLabel, {
        fontFamily: "VT323, monospace",
        fontSize: "26px",
        color: titleColor,
      })
      .setOrigin(0.5);

    
    this.animateIconRow(
      centerX,
      centerY + 65,
      "corazon",
      GameState.getReputationHearts(),
      iconScale,
      iconSpacing,
      800,
    );

    const consejos = [
      "Investiga todo lo que puedas, el bosque aguarda secretos.",
      "El tiempo vuela fuera, aprovecha cada paso en el exterior.",
      "Tu reputación determina tu futuro, cuida cada pocion que sirves.",
      "Explora cada rincón fuera de la casa antes de marcharte.",
    ];

    const consejoDelDia =
      consejos[(GameState.currentDay - 1) % consejos.length];

    const tipText = this.add
      .text(centerX, centerY + 140, "", {
        fontFamily: "VT323, monospace",
        fontSize: "26px",
        color: "#5d4037",
        align: "center",
        fontStyle: "italic",
        wordWrap: { width: 480 },
      })
      .setOrigin(0.5);

    
    this.time.delayedCall(1500, () => {
      let currentChar = 0;
      this.time.addEvent({
        delay: 45,
        callback: () => {
          tipText.text += consejoDelDia[currentChar];
          currentChar++;
        },
        repeat: consejoDelDia.length - 1,
      });

      
      this.tweens.add({
        targets: tipText,
        alpha: { from: 0.7, to: 1 },
        scale: { from: 1, to: 1.03 },
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    });

   
    this.input.once("pointerdown", () => {
      GameState.advanceDay();
      this.scene.start("house");
    });
  }

  /**
   * Dibuja y anima una fila de iconos uno por uno.
   * @param {number} x - Centro X
   * @param {number} y - Altura Y
   * @param {string} spriteKey - Clave del asset
   * @param {number} activeCount - Cuántos están activos
   * @param {number} scale - Escala final
   * @param {number} spacing - Espacio entre ellos
   * @param {number} delayStart - Cuánto esperar antes de empezar la animación de la fila
   */
  animateIconRow(x, y, spriteKey, activeCount, scale, spacing, delayStart) {
    const startX = x - spacing * 2;
    const icons = [];

    for (let i = 0; i < 5; i++) {
      // invisibles
      const icon = this.add
        .image(startX + i * spacing, y, spriteKey)
        .setScale(0);

      if (i >= activeCount) {
        icon.setTint(0x000000);
        icon.setAlpha(0.2);
      }
      icons.push(icon);
    }

    // animacion 
    this.tweens.add({
      targets: icons,
      scale: scale,
      ease: "Back.easeOut", 
      duration: 400,
      delay: this.tweens.stagger(150, { start: delayStart }),
    });
  }
}