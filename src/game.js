import Phaser from 'phaser';
import Start from './scenes/start.js';
import Boot from './scenes/boot.js';
import Letter from './scenes/letter.js';
import Store from './scenes/store.js';
import Kitchen from './scenes/kitchen.js';
import House from './scenes/house.js';
import Cave from './scenes/cave.js';
import End from './scenes/end.js';

import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'juego',
    dom: { createContainer: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    pixelArt: true,
    roundPixels: true,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: true } },
    scene: [Start, Boot, Letter, Store, Kitchen, House, Cave, End], // Start primero
    // npm install phaser-animated-tiles tuve que hacer para la animacion de las tiles
    plugins: { scene: [ { key: 'AnimatedTiles', plugin: AnimatedTiles, mapping: 'animatedTiles'} ] }
};

new Phaser.Game(config);