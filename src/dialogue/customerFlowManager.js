import NPC from '../game-objects/npc.js';
import DialogueManager from './dialogueManager.js';
import { generateRandomRequest } from "./requestGenerator.js";
import { buildDialogueFromRequest } from "./DialogueScripts.js";

export default class CustomerFlowManager {
    constructor(scene) {
        this.scene = scene;
        this.dialogueManager = new DialogueManager(scene);

        this.totalCustomers = 0;
        this.currentIndex = 0;

        this.currentCustomer = null;
        this.currentRequest = null;

        // Evitar listeners duplicados si reinicias el turno
        this._onDialogueFinished = this._onDialogueFinished.bind(this);
        this.scene.events.on("dialogue:finished", this._onDialogueFinished);
    }

    // INICIO DEL TURNO
    startShift(numCustomers) {
        this.totalCustomers = numCustomers;
        this.currentIndex = 0;
        this.spawnNextCustomer();
    }

    // SPAWNEAR SIGUIENTE CLIENTE
    spawnNextCustomer() {
        // Si ya no hay más clientes, fin del turno
        if (this.currentIndex >= this.totalCustomers) {
            this._finishShift();
            return;
        }

        if (this.currentCustomer) {
            this.currentCustomer.destroy();
            this.currentCustomer = null;
        }

        // 1. Generar pedido aleatorio
        this.currentRequest = generateRandomRequest();

        // 2. Crear NPC con requisitos y diálogo
        const spriteKey = "customer";
        const x = this.scene.scale.width / 4;
        const y = this.scene.scale.height / 2 + 7;

        this.currentCustomer = new NPC(
            this.scene,
            x,
            y,
            spriteKey,
            "",
            this.currentRequest.requirements
        );

        // 3. Generar diálogo a partir del pedido
        const dialogueData = buildDialogueFromRequest(this.currentRequest);
        this.dialogueManager.start(dialogueData);
    }

    /**
     * Se llama cuando el diálogo termina.
     * Aquí es donde normalmente:
     * - guardarías el pedido en un estado global
     * - mandarías al jugador a la cocina
     * - o pasarías al siguiente cliente
     */
    _onDialogueFinished() {
        // Si no hay request activo, ignorar
        if (!this.currentRequest) return;

        // Guardar pedido en el registry para que otra escena (cocina) lo lea
        this.scene.registry.set("currentOrder", this.currentRequest);

         // duerme la tienda y lanza cocina encima
         this.scene.scene.sleep("store");
        this.scene.scene.launch("kitchen");
    }

    continueShift() {
        this.currentCustomer = null;
        this.currentRequest = null;
            this.currentIndex += 1;
            this.spawnNextCustomer();
}

    _finishShift() {
        // Aquí podrías mostrar una pantalla de resumen, puntaje, etc.
        console.log("Turno terminado. Total clientes atendidos:", this.totalCustomers);

        // Evento opcional para que Store sepa que ha terminado el turno
        this.scene.events.emit("shift:finished");

        // Si queréis: cambiar de escena al terminar el turno
        // this.scene.scene.start("end");
    }

    update() {
        // Necesario para avanzar con SPACE/ENTER además del botón
        this.dialogueManager.update();
    }

    destroy() {
        this.scene.events.off("dialogue:finished", this._onDialogueFinished);
    }

        update(){
            // Necesario para avanzar con SPACE/ENTER además del botón
            this.dialogue?.update();
        }

        destroy() {
            this.scene.events.off("dialogue:finished", this._onDialogueFinished);



    }
}
