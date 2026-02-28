import Boot from './scenes/boot.js';
import Letter from './scenes/letter.js';
import Store from './scenes/store.js';
import Phaser from 'phaser';
import End from './scenes/end.js';
import Kitchen from './scenes/kitchen.js';

let config = {
  type: Phaser.AUTO,
  width: 960,
  height: 540,
  parent: 'juego',

  /* Comment: para qué sirve esto? 
    * Phaser crea un div contenedor dentro del parent: 'juego'.
    * Cuando llamas a this.add.dom(...), Phaser añade ahí el <input> y lo posiciona según las coordenadas del juego.
  */
  dom: {
    createContainer: true
  },

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.NO_CENTER
  },
  pixelArt: true,
  scene: [Boot, Letter, Store, Kitchen], /*Carga las escenas en orden, pero no las inicia. El orden de inicio se controla desde cada escena con this.scene.start('nombreDeLaEscena')*/
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: false
    }
  }
};

new Phaser.Game(config);