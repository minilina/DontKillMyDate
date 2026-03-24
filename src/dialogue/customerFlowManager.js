import NPC from "../game-objects/npc.js";
import DialogueManager from "./dialogueManager.js";
import { generateRandomRequest } from "./requestGenerator.js";
import { buildDialogueFromRequest } from "./dialogueScripts.js";

// 1. IMPORTAMOS EL GENERADOR VISUAL QUE CREAMOS
import NPCGenerator from "../utils/npcGenerator.js"; 

export default class CustomerFlowManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueManager = new DialogueManager(scene);

    this.totalCustomers = 0;
    this.currentIndex = 0;

    this.currentCustomer = null;
    this.currentRequest = null;

    this._onDialogueFinished = this._onDialogueFinished.bind(this);
    this.scene.events.on("dialogue:finished", this._onDialogueFinished);
  }

  startShift(numCustomers) {
    this.totalCustomers = numCustomers;
    this.currentIndex = 0;
    this.spawnNextCustomer();
  }

  spawnNextCustomer() {
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

    
    // Extraemos la raza que el diccionario acaba de elegir (ej: "elfos", "kitsunes")
    const razaElegida = this.currentRequest.requirements.raza;

    // Generamos el aspecto visual basado EXCLUSIVAMENTE en esa raza
    const aspectoVisual = NPCGenerator.generateLooks(razaElegida);

    // 3. Calcular posición
  
    const x = this.scene.scale.width / 4;


    const y = this.scene.scale.height * 0.85;

    // 4. Crear NPC con el sistema de capas
    this.currentCustomer = new NPC(
      this.scene,
      x,
      y,
      aspectoVisual, // Pasamos las capas generadas en lugar del spriteKey ("customer")
      "", // El texto se lo pasas al dialogueManager, así que aquí va vacío
      this.currentRequest.requirements,
    );

    // 5. Generar y lanzar el diálogo
    const dialogueData = buildDialogueFromRequest(this.currentRequest);
    this.dialogueManager.start(dialogueData);
  }

  _onDialogueFinished() {
    if (!this.currentRequest) return;
    this.scene.registry.set("currentOrder", this.currentRequest);
    this.scene.scene.sleep("store");
    this.scene.scene.launch("kitchen");
  }

  continueShift() {
    if (this.currentCustomer) {
      // Usamos el método leave() que le pusimos a la clase NPC para que haga el fade out
      this.currentCustomer.leave(() => {
        this.currentCustomer = null;
      });
    }

    this.currentRequest = null;
    this.currentIndex += 1;
    this.scene.scene.wake("store");
    this.spawnNextCustomer();
  }

  _finishShift() {
    console.log(
      "Turno terminado. Total clientes atendidos:",
      this.totalCustomers,
    );
    this.scene.events.emit("shift:finished");
  }

  update() {
    this.dialogueManager.update();
  }

  destroy() {
    this.scene.events.off("dialogue:finished", this._onDialogueFinished);
  }
}
