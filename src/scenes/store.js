import Phaser from 'phaser';
import CustomerFlowManager from "../dialogue/CustomerFlowManager.js";

export default class Store extends Phaser.Scene {
    /**
     * Constructor de la escena
     */
    constructor() {
        super({ key: 'store' });
    }

    /**
     * Creación de los elementos de la escena principal de juego
     */
    create() {
        // 1) La escena base
        // Fondo++
        this.add
            .image(0, 0, "fondo")
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);
        // 2) Crear diálogo
        this.flow = new CustomerFlowManager(this);

        // Metemos la cantidad de clientes n elegida a la cola
        let n = 1;
        this.flow.startShift(n);

        this.events.on("wake", () => {
            this.flow.continueShift();
        });
    }

    update(time, delta) {
        this.flow?.update(time, delta);
    }
}

/* EN PRINCIPIO ESTO SE QUEDA ASÍ*/ 