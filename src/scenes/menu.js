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
      height / 2 - 20,
      'RESUME',
      () => this.resumeGame()
    );

    //  BOTÓN MENU
    this.createStyledButton(
      width / 2,
      height / 2 + 80,
      'MAIN MENU',
      () => this.goToMainMenu()
    );

    this.scene.bringToTop();
  }

  createStyledButton(x, y, text, callback) {
    // botón (MISMO estilo que Start)
    const boton = this.add.image(x, y, 'button')
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(3);

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
      botonTexto.setColor('#ffcc00');
    });

    boton.on('pointerout', () => {
      boton.setScale(3);
      botonTexto.setColor('#ffffff');
    });

    // click
    boton.on('pointerdown', () => {
      this.sound.play('buttonSound', { volume: 0.2 });
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