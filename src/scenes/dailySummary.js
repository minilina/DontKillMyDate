import Phaser from "phaser";
import GameState from "../state/GameState.js";

export default class DailySummary extends Phaser.Scene {
  constructor() {
    super({ key: "dailySummary" });
  }

  create() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const bgScale = 3;
    const iconScale = 1.6;
    const starScale = 1.3;
    const iconSpacing = 65;

    this.add.image(centerX, centerY, "resumenBg").setScale(bgScale);

    const stats = GameState.dailyStats;
    const titleColor = "#f9ce2a";
    const textColor = "#623100";

    this.add
      .text(centerX, centerY - 140, `DÍA ${GameState.currentDay} FINALIZADO`, {
        fontFamily: "VT323, monospace",
        fontSize: "42px",
        color: titleColor,
        stroke: "#623100",
        strokeThickness: 6,
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

    let offsetY = 0; // Variable para empujar el resto de cosas si hay penalizacion

    // Regar penalizacion
    if (stats.wateringPenalty && stats.wateringPenalty > 0) {
      offsetY = 15;

      const penaltyText = this.add
        .text(
          centerX + 15,
          centerY - 5,
          `¡Plantas Secas! -${stats.wateringPenalty} Reputación`,
          {
            fontFamily: "VT323, monospace",
            fontSize: "26px",
            color: textColor,
          },
        )
        .setOrigin(0.5)
        .setAlpha(0); // Empieza invisible

      penaltyText.updateText();
      const spacing = 15;

      const penaltyIconLeft = this.add
        .image(
          penaltyText.getTopLeft().x - spacing, // Calculado para ponerse a la izquierda del texto
          centerY - 5,
          "hierba amarilla",
        )
        .setScale(1.5)
        .setAlpha(0);

      const penaltyIconRight = this.add
        .image(
          penaltyText.getTopRight().x + spacing, // Sumamos para ir a la derecha
          centerY - 5,
          "hierba amarilla",
        )
        .setScale(1.5)
        .setAlpha(0)
        .setFlipX(true);

      // Hacemos que aparezca con un fade-in justo despues de que terminen de salir los corazones
      this.tweens.add({
        targets: [penaltyText, penaltyIconLeft, penaltyIconRight],
        alpha: 1,
        duration: 400,
        delay: 500,
      });
    }

    let repLabel = "";
    const netSign = stats.repChange >= 0 ? "+" : "";

    if (stats.wateringPenalty && stats.wateringPenalty > 0) {
      const repPorPociones = stats.repChange + stats.wateringPenalty;
      const potionSign = repPorPociones >= 0 ? "+" : "";
      repLabel = `Reputación Total: ${GameState.reputation} (Pociones: ${potionSign}${repPorPociones} | Neto: ${netSign}${stats.repChange})`;
    } else {
      repLabel = `Reputación Total: ${GameState.reputation} (${netSign}${stats.repChange})`;
    }

    this.add
      .text(centerX, centerY + 25 + offsetY, repLabel, {
        fontFamily: "VT323, monospace",
        fontSize: "26px",
        color: textColor,
      })
      .setOrigin(0.5);

    this.animateIconRow(
      centerX,
      centerY + 65 + offsetY,
      "corazon",
      GameState.getReputationHearts(),
      iconScale,
      iconSpacing,
      800,
    );

    // --- AQUÍ ESTÁN LOS CONSEJOS ACTUALIZADOS ---
    const consejos = [
      "Recuerda regar las plantas del huerto de la ciudad a diario, ¡o tu reputación bajará!",
      "Investiga todo lo que puedas, el bosque aguarda secretos.",
      "Si descuidas el huerto, las plantas se secarán y la gente dejará de confiar en ti.",
      "Tu reputación determina tu futuro, cuida cada poción que sirves.",
      "Explora cada rincón fuera de la casa antes de marcharte.",
      "Un buen alquimista también es un buen jardinero. ¡No olvides regar hoy!",
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

      const saveData = {
        currentDay: GameState.currentDay,
        reputation: GameState.reputation,
        specialNpcRecords: GameState.specialNpcRecords,
        tutorialDone: true,
        topdownNpcFirstDialogueDone: GameState.topdownNpcFirstDialogueDone,
        timesMotherTalkedToPlayer: GameState.timesMotherTalkedToPlayer,
        lastDayTalkedToMother: GameState.lastDayTalkedToMother
      };

      localStorage.setItem("potionGameSave", JSON.stringify(saveData));

      const saveText = this.add
        .text(centerX, this.scale.height - 30, "¡Progreso guardado!", {
          fontFamily: "VT323, monospace",
          fontSize: "26px",
          color: "#ffffff",
          shadow: {
            offsetX: 2,
            offsetY: 2,
            color: "#000000",
            blur: 0,
            stroke: false,
            fill: true,
          },
        })
        .setOrigin(0.5)
        .setAlpha(0);

      this.tweens.add({
        targets: saveText,
        alpha: 1,
        y: "-=10",
        duration: 700,
        ease: "Power2",
        onComplete: () => {
          this.time.delayedCall(3000, () => {
            this.scene.start("house", {
              spawnX: 720,
              spawnY: 230,
              direccion: "down",
            }); // cambio de escena
          });
        },
      });
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