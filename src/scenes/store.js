import Phaser from "phaser";
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
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(0);

    this.crearAnimacionesPociones();

    this.add
      .sprite(420, 193, "pocion_roja")
      .setDepth(5)
      .setScale(3)
      .play("anim_pocion_roja");

    this.add
      .sprite(480, 185, "pocion_azul")
      .setDepth(5)
      .setScale(3)
      .play("anim_pocion_azul");

    this.add
      .sprite(540, 196, "pocion_amarilla")
      .setDepth(5)
      .setScale(3)
      .play("anim_pocion_amarilla");

    this.add
      .image(0, 0, "mostrador")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(40);

    this.add
      .image(0, 0, "luzStore")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(20);

    this.flowManager = new CustomerFlowManager(this);
    this.flowManager.startShift();

    this.events.on("wake", () => {
      this.cameras.main.fadeIn(500, 0, 0, 0);
    });

    if (!this.anims.exists("think")) {
      this.anims.create({
        key: "think",
        frames: this.anims.generateFrameNames("thinkingBubble", {
          prefix: "pensar-",
          start: 0,
          end: 3,
        }),
        frameRate: 5,
        repeat: -1,
      });
    }

    // Pausa
    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );
    this.createPauseButton();
  }

  crearAnimacionesPociones() {
    // Animación Amarilla (9 fotogramas: 0 al 8)
    if (!this.anims.exists("anim_pocion_amarilla")) {
      this.anims.create({
        key: "anim_pocion_amarilla",
        frames: this.anims.generateFrameNumbers("pocion_amarilla", {
          start: 0,
          end: 8,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }

    // Animación Roja (8 fotogramas: 0 al 7)
    if (!this.anims.exists("anim_pocion_roja")) {
      this.anims.create({
        key: "anim_pocion_roja",
        frames: this.anims.generateFrameNumbers("pocion_roja", {
          start: 0,
          end: 7,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }

    // Animación Azul (7 fotogramas: 0 al 6)
    if (!this.anims.exists("anim_pocion_azul")) {
      this.anims.create({
        key: "anim_pocion_azul",
        frames: this.anims.generateFrameNumbers("pocion_azul", {
          start: 0,
          end: 6,
        }),
        frameRate: 8,
        repeat: -1,
      });
    }
  }

  createPauseButton() {
    const btnX = this.scale.width - 25;
    const btnY = 25;

    // Sprite botón
    this.pauseBtnBg = this.add
      .image(btnX, btnY, "pauseBtn")
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(3)
      .setDepth(1000);

    // Animación hover
    this.pauseBtnBg.on("pointerover", () => {
      this.pauseBtnBg.setTexture("pauseBtnPressed");
    });

    this.pauseBtnBg.on("pointerout", () => {
      this.pauseBtnBg.setTexture("pauseBtn");
    });

    // Acción al hacer clic
    this.pauseBtnBg.on("pointerdown", () => {
      this.sound.play("buttonSound", { volume: 0.2 });
      this.openPauseMenu();
    });
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

  showPotionResult(potionTextureKey, quality) {
    const resultPotion = this.add
      .image(149 * 3, 145 * 3, potionTextureKey)
      .setOrigin(0, 0)
      .setScale(3)
      .setDepth(15) // AÑADIDO: Profundidad por encima del mostrador (10)
      .setAlpha(0);

    // animación de la poción apareciendo
    this.tweens.add({
      targets: resultPotion,
      alpha: 1,
      duration: 800,
      ease: "Power2",
      delay: 300,
      onComplete: () => {
        const thinkingBubble = this.add
          .sprite(45 * 3, 24 * 3, "thinkingBubble")
          .setOrigin(0, 0)
          .setScale(3)
          .setDepth(25) // AÑADIDO: Profundidad por encima de la luz general (20)
          .play("think");

        // PRIMERA PAUSA entre entrega poción y reacción cliente
        this.time.delayedCall(1000, () => {
          thinkingBubble.destroy();

          const mostrarPuntuacionFinal = () => {
            // SEGUNDA PAUSA entre reacción cliente y textos resultado
            this.time.delayedCall(1200, () => {
              // actualizar reputación
              GameState.deliverPotion();

              // textos de resultado
              const overlay = this.add
                .image(630, 185, "dialog2")
                .setDepth(100)
                .setScale(3)
                .setAlpha(0);

              const qualityText = this.add
                .text(630, 160, `Calidad: ${quality}%`, {
                  fontFamily: "VT323, monospace",
                  fontSize: "30px",
                  color: "#000000",
                })
                .setOrigin(0.5)
                .setDepth(101)
                .setAlpha(0);

              const repText = this.add
                .text(630, 210, `Reputación: ${GameState.reputation}`, {
                  fontFamily: "VT323, monospace",
                  fontSize: "30px",
                  color: GameState.reputation < 0 ? "#9d2121" : "#000000",
                })
                .setOrigin(0.5)
                .setDepth(101)
                .setAlpha(0);

              // animación de los textos apareciendo después de la poción
              this.tweens.add({
                targets: [overlay, qualityText, repText],
                alpha: 1,
                duration: 500,
                onComplete: () => {

                  if (GameState.reputation < 0) {
                    this.tweens.add({
                      targets: repText,
                      alpha: 0,
                      duration: 150,
                      yoyo: true,
                      repeat: -1,
                    });
                  }
                  
                  this.time.delayedCall(2000, () => {
                    overlay.destroy();
                    qualityText.destroy();
                    repText.destroy();
                    resultPotion.destroy();

                    this.flowManager.continueShift();
                  });
                },
              });
            }); // fin de la segunda pausa
          };

          // reacción cliente
          if (this.flowManager && this.flowManager.currentCustomer) {
            const customer = this.flowManager.currentCustomer;

            if (customer.id && customer.id !== "npc") {
              GameState.saveSpecialNpcRecord(customer.id, quality);

              if (
                quality >= 80 &&
                customer.npcData &&
                customer.npcData.successDialogue
              ) {
                customer.reaccionar(quality);

                this.flowManager.showResultDialogue(
                  customer.npcData.successDialogue,
                  () => {
                    mostrarPuntuacionFinal();
                  },
                );
              } else {
                customer.reaccionar(quality);
                mostrarPuntuacionFinal();
              }
            } else {
              customer.reaccionar(quality);
              mostrarPuntuacionFinal();
            }
          } else {
            mostrarPuntuacionFinal();
          }
        }); // fin de la primera pausa
      },
    });
  }
}