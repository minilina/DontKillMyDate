import Star from './star.ts';
import Phaser from 'phaser'

/**
 * Clase que representa la base sobre la que se sitúan las estrellas que aparecen en el juego
 */
export default class Base extends Phaser.GameObjects.Sprite {

    /**
     * 
     * @param {Phaser.Scene} scene Escena a la que pertenece la base
     * @param {Platform} platform Plataforma sobre la que se sitúa la base
     * @param {number} x Coordenada x
     * @param {number} y Coordenada y 
     * @param { Phaser.GameObjects.Group } baseGroup Grupo en el que se incluirá la base creada
     */
    constructor(scene, platform, x, y, baseGroup) {
        super(scene, x, y, 'base');
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this, true);
        baseGroup.add(this);
        this.y -= this.height / 2 + platform.height / 2;
    }

    /**
     * Método para que la base instancie una estrella sobre ella
     */
    spawn() {
        this.scene.add.existing(new Star(this.scene, this, this.x, this.y));
    }

}
