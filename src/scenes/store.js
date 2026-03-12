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
        // 1) La escena base
        // Fondo++
        this.add
            .image(0, 0, "store")
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);
        // 2) Crear diálogo
        this.flow = new CustomerFlowManager(this);
        // Metemos la cantidad de clientes n elegida a la cola
        let n = 2;
        this.flow.startShift(n);

         this.events.on("shift:finished", () => {
            this.scene.start("house");
        });
    }

    update(time, delta) {
        this.flow?.update(time, delta);
    }
}

/* EN PRINCIPIO ESTO SE QUEDA ASÍ*/ 