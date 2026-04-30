import Phaser from 'phaser';
import Start from './scenes/start.js';
import Boot from './scenes/boot.js';
import Letter from './scenes/letter.js';
import Store from './scenes/store.js';
import Kitchen from './scenes/kitchen.js';
import Menu from './scenes/menu.js';
import House from './scenes/house.js';
import Cave from './scenes/cave.js';
import End from './scenes/end.js';
import MortarMinigame from './scenes/mortarMinigame.js';
import CuttingMinigame from './scenes/cuttingMinigame.js';
import DailySummary from './scenes/dailySummary';

import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';
import { PhaserNavMeshPlugin } from "phaser-navmesh";



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
    scene: [Start, Boot, Letter, Store, Kitchen, CuttingMinigame, MortarMinigame, Menu, DailySummary, House, Cave, End],
    // npm install phaser-animated-tiles tuve que hacer para la animacion de las tiles
    // npm install phaser-navmesh tuve que hacer para el point and go del jugador
    plugins: {
        scene: [
            {
                key: 'AnimatedTiles',
                plugin: AnimatedTiles,
                mapping: 'animatedTiles'
            },
            {
                key: 'NavMeshPlugin',
                plugin: PhaserNavMeshPlugin,
                mapping: 'navMeshPlugin',
                start: true
            }
        ]
    }
};

new Phaser.Game(config);