import NPC from "../game-objects/npc.js";
import DialogueManager from "./dialogueManager.js";
import { generateRandomRequest } from "./requestGenerator.js";
import { buildDialogueFromRequest } from "./dialogueScripts.js";

export default class CustomerFlowManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueManager = new DialogueManager(scene);

    this.totalCustomers = 0;
    this.currentIndex = 0;

    this.currentCustomer = null;
    this.currentRequest = null;

    // Lista de sprites (tú pones las keys que tengas cargadas en preload)
    // Ej: this.load.image("customer_1", ...), this.load.image("customer_2", ...)
    this.customerSpriteKeys = ["customer", "customer2"];

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

  // Elegir sprite del cliente (cambia cada cliente)
  _getNextCustomerSpriteKey() {
    return this.customerSpriteKeys[this.currentIndex % this.customerSpriteKeys.length];
  }

  // SPAWNEAR SIGUIENTE CLIENTE
  spawnNextCustomer() {
    // Si ya no hay más clientes, fin del turno
    if (this.currentIndex >= this.totalCustomers) {
      this._finishShift();
      return;
    }

    // limpiar cliente anterior
    if (this.currentCustomer) {
      this.currentCustomer.destroy();
      this.currentCustomer = null;
    }

    // 1. Generar pedido aleatorio (nuevo cada cliente)
    this.currentRequest = generateRandomRequest();

    // 2. Crear NPC con requisitos y sprite distinto
    const spriteKey = this._getNextCustomerSpriteKey();
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

    // 3. Generar diálogo nuevo a partir del pedido
    const dialogueData = buildDialogueFromRequest(this.currentRequest);
    this.dialogueManager.start(dialogueData);
  }

  /**
   * Se llama cuando el diálogo termina.
   * Aquí guardas el pedido y mandas a cocina.
   */
  _onDialogueFinished() {
    if (!this.currentRequest) return;

    this.scene.registry.set("currentOrder", this.currentRequest);

    // duerme la tienda y lanza cocina encima
    this.scene.scene.sleep("store");
    this.scene.scene.launch("kitchen");
  }

  /**
   * Llama a esto cuando la cocina termine (pedido entregado) para volver a tienda
   * y pasar al siguiente cliente.
   */
  continueShift() {
  // destruir el sprite anterior antes de perder la referencia
  if (this.currentCustomer) {
    this.currentCustomer.destroy();
    //this.currentCustomer = null;
  }

  this.currentRequest = null;

  this.currentIndex += 1;

  // IMPORTANTE: reanudar tienda si estaba dormida
  this.scene.scene.wake("store");

  this.spawnNextCustomer();
}

  _finishShift() {
    console.log("Turno terminado. Total clientes atendidos:", this.totalCustomers);
    this.scene.events.emit("shift:finished");
  }

  update() {
    this.dialogueManager.update();
  }

  destroy() {
    this.scene.events.off("dialogue:finished", this._onDialogueFinished);
  }
}