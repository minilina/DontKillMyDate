import Phaser from 'phaser';

/**
 * Clase base para escenas que necesitan soporte de pausa:
 *  - Botón de pausa en la esquina superior derecha
 *  - Tecla ESC para abrir el menú de pausa
 *  - Apertura de Menu.js como escena superpuesta
 *
 * --- Escenas normales (Store, Letter, etc.) ---
 *   create() {
 *     this.setupPause();
 *   }
 *   update(time, delta) {
 *     super.update(time, delta); // para que ESC funcione
 *   }
 *
 * --- Escenas top-down (con zoom de cámara) ---
 *   Llamar setupPause({ isTopDown: true }) DESPUÉS de setupPlayer(),
 *   porque necesita que this.cameras.main.zoom ya esté fijado.
 *   El ESC se registra via events.on('update'), no hace falta super.update().
 */
export default class StoppableScene extends Phaser.Scene {

  /**
   * @param {{ isTopDown?: boolean }} [opts]
   *   isTopDown: true  → posición del botón compensada por el zoom de cámara
   *                       + ESC gestionado con events.on('update')
   *   isTopDown: false → posición fija en esquina, ESC en super.update()  (por defecto)
   */
  setupPause({ isTopDown = false } = {}) {
    this._isTopDown = isTopDown;

    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC
    );

    this._createPauseButton();

    if (isTopDown) {
      // En escenas top-down el update() no se hereda fácilmente (TopDownScene
      // tiene su propio loop), así que escuchamos desde el sistema de eventos.
      this.events.on('update', () => {
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
          this.openPauseMenu();
        }
      });
    }
  }

  /** @private */
  _createPauseButton() {
    let btnX, btnY, scale;

    if (this._isTopDown) {
      // Compensa el zoom para que el botón quede en la esquina de la pantalla,
      // no en la esquina del mundo. Requiere que la cámara ya tenga el zoom correcto.
      const zoom = this.cameras.main.zoom;
      const w    = this.scale.width;
      const h    = this.scale.height;
      btnX  = (w / 2) + ((w / 2) / zoom) - (30 / zoom);
      btnY  = (h / 2) - ((h / 2) / zoom) + (30 / zoom);
      scale = 3 / zoom;
    } else {
      btnX  = this.scale.width - 30;
      btnY  = 30;
      scale = 3;
    }

    this._pauseBtn = this.add
      .image(btnX, btnY, 'pauseBtn')
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(scale)
      .setDepth(10000)
      .setScrollFactor(this._isTopDown ? 0 : 1); // fijo en pantalla si hay scroll de cámara

    this._pauseBtn.on('pointerover', () => this._pauseBtn.setTexture('pauseBtnPressed'));
    this._pauseBtn.on('pointerout',  () => this._pauseBtn.setTexture('pauseBtn'));
    this._pauseBtn.on('pointerdown', () => {
      this.sound.play('buttonSound', { volume: 0.2 });
      this.openPauseMenu();
    });
  }

  openPauseMenu() {
    this.scene.launch('Menu', { parentScene: this.scene.key });
    this.scene.pause();
  }

  /**
   * Solo necesario en escenas NO top-down (Store, Letter…).
   * Llama a super.update() desde el update() de la escena hija.
   */
  update(time, delta) {
    if (!this._isTopDown && this.pauseKey && Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.openPauseMenu();
    }
  }
}