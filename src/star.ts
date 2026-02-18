import Phaser from 'phaser'
import Base from './base.js'
import Player from './player.js'
import Level from './level.js'

/**
 * Clase para los objetos estrella que el jugador ha de recoger
 * Una estrella aparece sobre una base. Cuando el jugador la recoge, se crea 
 * una nueva estrella en otra posición, si el juego no ha terminado.
 * @extends Phaser.GameObjects.Sprite
 */
export default class Star extends Phaser.GameObjects.Sprite {

    base: Base
    scene: Level

    /**
     * Constructor de Star
     * @param {Sceme} scene Escena en la que aparece la estrella
     * @param {Base} base Objeto base sobre el que se va a dibujar la estrella
     * @param {number} x coordenada x
     * @param {number} y coordenada y
     */
    constructor(scene: Phaser.Scene, base: Base, x: number, y: number) {
        super(scene, x, y, 'star');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true);
        this.y -= this.height;
        this.base = base;

    }

    /**
     * Redefinición del preUpdate de Phaser
     * @override
     */
    preUpdate(t:number, d:number) {
        // IMPORTANTE: Si no ponemos esta instrucción y el sprite está animado
        // no se podrá ejecutar la animación del sprite. 
        super.preUpdate(t, d);
        if (this.scene.physics.overlap(this.scene.player as Player, this)) {
            // Delegamos en la escena para decidir qué hacer al 
            // haber cogido una estrella
            this.scene.starPickt(this.base);
            this.destroy();
        }
    }
}
