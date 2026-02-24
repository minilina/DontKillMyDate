import Boot from './scenes/boot.js';
import End from './scenes/end.js';
import Level from './scenes/level.js';
import Phaser from 'phaser';

/**
 * Inicio del juego en Phaser. Creamos el archivo de configuración del juego y creamos
 * la clase Game de Phaser, encargada de crear e iniciar el juego.
 */
let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'juego',
    scale: {
        mode: Phaser.Scale.FIT,  
        autoCenter: Phaser.Scale.NO_CENTER
    },
    pixelArt: true,
    scene: [Boot, Level, End],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 400 },
            debug: false
        }
    }
};

new Phaser.Game(config);
