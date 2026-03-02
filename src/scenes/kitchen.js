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
        this.add.image(0, 0, 'kitchen').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);
        // Añadimos el evento para detectar el clic en cualquier lugar de la pantalla
        this.input.on('pointerdown', () => {
            // Cambiamos a la escena del mapa top-down
            this.scene.start('house');
        });
    }
}
