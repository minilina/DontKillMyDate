import Phaser from 'phaser';
import CustomerFlowManager from "../dialogue/customerFlowManager.js";

export default class Store extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
        super({ key: 'store' });
    }

    preload() {

    }

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {
        
        this.add
            .image(0, 0, "store")
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);
        
        this.flowManager = new CustomerFlowManager(this);
        this.flowManager.startShift();

        // Pausa
        this.pauseKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );
    }

    update(time, delta) {
        this.flowManager?.update(time, delta);
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.openPauseMenu();
        }
    }

    openPauseMenu() {
        this.scene.launch('Menu', { parentScene: this.scene.key });
        this.scene.pause();
    }
}