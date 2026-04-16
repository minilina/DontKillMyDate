import Phaser from 'phaser';

import fondoMenu from "../../assets/sprites/carta.png";
import button from "../../assets/sprites/UI/button.png";
import buttonSound from "../../assets/sound/button.mp3";

export default class Menu extends Phaser.Scene {
  constructor() {
    super({ key: 'Menu' });
  }

  preload() {
    this.load.image('fondoMenu', fondoMenu);
    this.load.image('button', button);
    this.load.audio('buttonSound', buttonSound);
  }

  create(data) {
    this.parentScene = data.parentScene;

    const { width, height } = this.scale;

    //  Fondo tipo pergamino centrado
    this.add.image(width / 2, height / 2, 'fondoMenu')
      .setDisplaySize(width, height);

    //  Texto PAUSED
    this.add.text(width / 2, height / 2 - 120, 'PAUSED', {
      fontFamily: 'VT323, monospace',
      fontSize: '50px',
      fill: '#ffffff'
    }).setOrigin(0.5);




    //  BOTÓN RESUME
    this.createStyledButton(
      width / 2,
      height / 2 + 75,
      'RESUME',
      () => this.resumeGame()
    );

    //  BOTÓN MENU
    this.createStyledButton(
      width / 2,
      height / 2 + 150,
      'MAIN MENU',
      () => this.goToMainMenu()
    );

    this.scene.bringToTop();

    //BOTON MUTE
    this.createStyledButton(
      width / 2 - 50,
      height / 2 - 20,
      null,
      () => {
        if (!this.game.sound.mute) {
          this.game.sound.mute = true;
        }
        else {
          this.game.sound.mute = false;
        }
      },
      'btnSoundOn',
      'btnSoundOff');

    //BOTON FULLSCREEN

    this.createStyledButton(
      width / 2 + 50,
      height / 2 - 20,
      '⛶',
      () => { this.scale.toggleFullscreen() },
      'blankBtn'
    );

  }

  /**
   * Creates a styled button with the specified properties.
   * @param {number} x - The x-coordinate of the button.
   * @param {number} y - The y-coordinate of the button.
   * @param {string} text - The text to display on the button.
   * @param {function} callback - The function to call when the button is clicked.
   * @param {string} texture - The texture for the button (optional).
   * @param {string} alternateTexture - An optional alternate texture to switch with when the button is pressed (useful for toggle buttons)(optional).
   */
  createStyledButton(x, y, text, callback, texture = 'button', alternateTexture = null) {
    // botón (MISMO estilo que Start)
    if (!text&&!texture) {
      texture = 'blankBtn';
    }
    let toggleState = false;
    let switchable = alternateTexture !== null;

    const boton = this.add.image(x, y, texture)
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(3)

    // texto (MISMO estilo)
    const botonTexto = this.add.text(
      x,
      y - 3,
      text,
      {
        fontFamily: 'VT323, monospace',
        fontSize: '25px',
        fill: '#ffffff'
      }
    ).setOrigin(0.5);

    // hover (IGUAL que Start)
    boton.on('pointerover', () => {
      boton.setScale(2.9);
      if (text)
        botonTexto.setColor('#ffcc00');
    });

    boton.on('pointerout', () => {
      boton.setScale(3);
      if (text)
        botonTexto.setColor('#ffffff');
    });

    // click
    boton.on('pointerdown', () => {
      this.sound.play('buttonSound', { volume: 0.2 });
      if (switchable) {
        toggleState = !toggleState;
        boton.setTexture(toggleState ? alternateTexture : texture);
      }
      callback();
    });


  }

  resumeGame() {
    this.scene.resume(this.parentScene);
    this.scene.stop();
  }

  goToMainMenu() {
    //  parar música si existe
    if (this.game.bgMusic) {
      this.game.bgMusic.stop();
      this.game.bgMusic.destroy(); // importante para evitar leaks
      this.game.bgMusic = null;
    }

    this.scene.stop(this.parentScene);
    this.scene.start('Start');
  }
}