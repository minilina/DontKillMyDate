import NPC from "../game-objects/npc.js";
import DialogueManager from "./dialogueManager.js";
import { generateRandomRequest } from "./requestGenerator.js";
import { buildDialogueFromRequest } from "./dialogueScripts.js";
import NPCGenerator from "../utils/npcGenerator.js";
import GameState from "../state/GameState.js";

export default class CustomerFlowManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueManager = new DialogueManager(scene);
    this.currentCustomer = null;
    this.currentRequest = null;

    this._onDialogueFinished = this._onDialogueFinished.bind(this);
    this.scene.events.on("dialogue:finished", this._onDialogueFinished);
  }

  startShift() {
    this.spawnNextCustomer();
  }

  spawnNextCustomer() {
    if (GameState.isDayOver()) {
      this._finishShift();
      return;
    }

    if (this.currentCustomer) {
      this.currentCustomer.destroy();
    }

    // preparamos variables globales y generamos el pedido aleatorio
    GameState.prepareNewCustomer();
    this.currentRequest = generateRandomRequest();

    // extraemos la raza que el diccionario acaba de elegir (ej: "elfos", "kitsunes")
    const chosenRace = this.currentRequest.requirements.raza;

    // generamos el aspecto visual basado EXCLUSIVAMENTE en esa raza
    const looksNPC = NPCGenerator.generateLooks(chosenRace);

    // creamos NPC
    this.currentCustomer = new NPC(
      this.scene,
      this.scene.scale.width / 4,
      this.scene.scale.height * 0.85,
      looksNPC,
      this.currentRequest.requirements,
    );

    // generamos y lanzamos el diálogo
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
      this.currentCustomer.leave(() => {
        this.currentCustomer = null;
      });
    }

    this.currentRequest = null;
    this.scene.scene.wake("store");
    this.spawnNextCustomer();
  }

  _finishShift() {
    GameState.advanceDay();
    this.scene.scene.stop("store"); 
    this.scene.scene.start("house");
  }

  update() {
    this.dialogueManager.update();
  }

  destroy() {
    this.scene.events.off("dialogue:finished", this._onDialogueFinished);
  }
}
