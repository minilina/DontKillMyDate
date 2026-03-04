import Phaser from 'phaser';
import customer from '../../assets/sprites/default.png'; // (ALBA) esto se cambiará para que los clientes tengan sprites únicos, pero por ahora es un placeholder.
// Ejemplos de futuras capas para generar los NPCS (ALBA):
// import npc_eyes_1 from '../../assets/sprites/ojos_1.png';
// import npc_hair_1 from '../../assets/sprites/pelo_1.png';
import fondo from '../../assets/sprites/fondo.jpg';

//Esto ya lo descomentare mas tarde(LUCAS)
//import playerAnimJson from '../../assets/anims/player_atlas.json';
//import playerAnim from '../../assets/anims/player.png';



export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {
        this.load.image('customer', customer);
        this.load.image('fondo', fondo);

        //Esto ya lo descomentare mas tarde(LUCAS)
        //this.load.atlas('player', playerAnim, playerAnimJson);

        // Aquí puedes añadir barra de progreso si quieres
    }

    create() {
        this.scene.start('Letter'); // ⚡ siguiente escena
    }
}