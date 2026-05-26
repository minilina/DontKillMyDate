import Phaser from 'phaser';
import Start from './scenes/start.js';
import Boot from './scenes/boot.js';
import Letter from './scenes/letter.js';
import Store from './scenes/store.js';
import Kitchen from './scenes/kitchen.js';
import Menu from './scenes/menu.js';
import DialogueScene from './scenes/dialogueScene.js';
import House from './scenes/house.js';
import Cave from './scenes/cave.js';
import City from './scenes/city.js';
import MortarMinigame from './scenes/mortarMinigame.js';
import CuttingMinigame from './scenes/cuttingMinigame.js';
import DailySummary from './scenes/dailySummary.js';
import GameOver from './scenes/gameOver.js';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.js';
import { PhaserNavMeshPlugin } from "phaser-navmesh";
/*
navmesh from https://github.com/mikewesthad/navmesh/blob/master/LICENSE

MIT License

Copyright (c) 2017 Michael Hadley

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    parent: 'juego',
    dom: { createContainer: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.NO_CENTER },
    pixelArt: true,
    roundPixels: true,
    physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
    scene: [Start, Boot, Letter, Store, Kitchen, CuttingMinigame, MortarMinigame, Menu,DialogueScene, DailySummary, House, Cave, City, GameOver],
    
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
//window.game = game;