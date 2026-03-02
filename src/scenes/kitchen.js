import Phaser from 'phaser';
import kitchen from '../../assets/sprites/cocina.png';

export default class Kitchen extends Phaser.Scene {
    constructor() {
        super({ key: 'kitchen' }); // id escena
    }

    preload() {
        this.load.image('kitchen', kitchen);
    }

    create() {
        // Guardamos la imagen en una variable
        const bg = this.add.image(0, 0, 'kitchen').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        // La hacemos interactiva (para que detecte el ratón)
        bg.setInteractive();

        // Le añadimos el evento de clic a la imagen
        bg.on('pointerdown', () => {
            console.log("Clic detectado, cambiando a house..."); // Esto nos avisará en la consola
            this.scene.start('house'); 
        });
    }
}
