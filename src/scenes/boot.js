import Phaser from 'phaser';
import customer from '../../assets/sprites/default.png';
import fondo from '../../assets/sprites/fondo.jpg';
import playerAnimJson from '../../assets/anims/player_atlas.json';
import playerAnim from '../../assets/anims/player.png';


export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        this.load.image('customer', customer);
        this.load.image('fondo', fondo);
        this.load.atlas('player', playerAnim, playerAnimJson);

        // Aquí puedes añadir barra de progreso si quieres
    }

    create() {
        this.scene.start('Letter'); // ⚡ siguiente escena
    }
}