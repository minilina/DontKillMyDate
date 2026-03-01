import Phaser from 'phaser';
import Start from './scenes/start.js';
import Boot from './scenes/boot.js';
import Letter from './scenes/letter.js';
import Store from './scenes/store.js';
import Kitchen from './scenes/kitchen.js';
import End from './scenes/end.js';

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'juego',
    dom: { createContainer: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.NO_CENTER },
    pixelArt: true,
    physics: { default: 'arcade', arcade: { gravity: { y: 400 }, debug: false } },
    scene: [Start, Boot, Letter, Store, Kitchen, End] // Start primero
};

new Phaser.Game(config);