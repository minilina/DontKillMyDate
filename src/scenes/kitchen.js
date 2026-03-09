import Phaser from 'phaser';
import kitchen from '../../assets/sprites/cocina.png';
import button from '../../assets/sprites/button.png';
import Book from '../game-objects/book.js';

import libro from '../../assets/sprites/libro.png';
import normal from '../../assets/sprites/normal.png';
import fuego from '../../assets/sprites/fuego.png';
import agua from '../../assets/sprites/agua.png';
import tierra from '../../assets/sprites/tierra.png';
import aire from '../../assets/sprites/aire.png';
import planta from '../../assets/sprites/planta.png';

import afin from '../../assets/sprites/afin.png';

export default class Kitchen extends Phaser.Scene {
    constructor() {
        super({ key: 'kitchen' }); // id escena
    }

    preload() {
        this.load.image('kitchen', kitchen);
        this.load.image('button', button);
        this.load.image('libro', libro);
        this.load.image('humanos', normal);
        this.load.image('kitsunes', fuego);
        this.load.image('ninfas', agua);
        this.load.image('gnomos', tierra);
        this.load.image('hadas', aire);
        this.load.image('elfos', planta);
        this.load.image('afin', afin);

    }

    create() {

        
        // Guardamos la imagen en una variable

        const bg = this.add.image(0, 0, 'kitchen').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        this.book = new Book(this);
        // La hacemos interactiva (para que detecte el ratón)
        bg.setInteractive();

        const boton = this.add.image(this.scale.width - 110, this.scale.height - 40, 'button')
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5).setScale(3);

            
        boton.on('pointerdown', () => {
            this.book.open();
        });

        // Le añadimos el evento de clic a la imagen
        bg.on('pointerdown', () => {
            console.log("Clic detectado, cambiando a house..."); // Esto nos avisará en la consola
            this.scene.start('house');
        });


    }
}
