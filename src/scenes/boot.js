import Phaser from 'phaser';
import customer from '../../assets/sprites/default.png';
import fondo from '../../assets/sprites/fondo.jpg';

export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        this.load.image('customer', customer);
        this.load.image('fondo', fondo);

        // Aquí puedes añadir barra de progreso si quieres
    }

    create() {
        this.scene.start('Letter'); // ⚡ siguiente escena
    }
}