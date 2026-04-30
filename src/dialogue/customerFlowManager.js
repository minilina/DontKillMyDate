import NPC from "../game-objects/npc.js";
import DialogueManager from "./dialogueManager.js";
import {
  generateRandomRequest,
  processScriptedDialogue,
} from "./requestGenerator.js";
import { buildDialogueFromRequest, splitIntoLines } from "./dialogueScripts.js";
import NPCGenerator from "../utils/npcGenerator.js";
import GameState from "../state/GameState.js";

export default class CustomerFlowManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueManager = new DialogueManager(scene);
    this.currentCustomer = null;
    this.currentRequest = null;

    this.isShowingResult = false;
    this.onResultComplete = null;

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

    GameState.prepareNewCustomer();

    // si es npc o scripted
    const customerType = GameState.getCurrentCustomerType();

    // dificultad actual para generar diálogos acorde a ella
    const difficulty = GameState.getCurrentDifficulty
      ? GameState.getCurrentDifficulty()
      : "facil";

    let looksNPC;
    let dialogueData;

    if (customerType === "npc") {
      // le pasamos la dificultad al generador aleatorio
      this.currentRequest = generateRandomRequest(difficulty);
      const chosenRace = this.currentRequest.requirements.raza;
      looksNPC = NPCGenerator.generateLooks(chosenRace);
      dialogueData = buildDialogueFromRequest(this.currentRequest);
    } else {
      // scripted
      const specialData = GameState.getSpecialNPC(customerType);

      // para estos no necesitmos dificultad en principio
      const scriptedRequest = processScriptedDialogue(specialData);

      this.currentRequest = {
        requirements: scriptedRequest.requirements, // requisitos reales: traducciones
        literalWords: scriptedRequest.literalWords, // palabras literales para mostrar en la UI
      };

      looksNPC = specialData.looks;
      dialogueData = {
        speakerName: specialData.name,
        lines: scriptedRequest.dialogueLines,
      };

      this.currentRequest.specialData = specialData;
    }

    // creamos NPC
    this.currentCustomer = new NPC(
      this.scene,
      this.scene.scale.width / 4,
      this.scene.scale.height * 0.85,
      looksNPC,
      this.currentRequest.requirements,
    );

    if (this.currentRequest.specialData) {
      this.currentCustomer.npcData = this.currentRequest.specialData;
      this.currentCustomer.id = customerType;
    }

    this.dialogueManager.start(dialogueData);
  }

  _onDialogueFinished() {
    if (this.isShowingResult) {
      this.isShowingResult = false;
      if (this.onResultComplete) {
        this.onResultComplete();
        this.onResultComplete = null;
      }
      return;
    }

    if (!this.currentRequest) return;
    this.scene.registry.set("currentOrder", this.currentRequest);
    this.scene.scene.sleep("store");
    this.scene.scene.launch("kitchen");
  }

  showResultDialogue(dialogueLines, callback) {
    this.isShowingResult = true;
    this.onResultComplete = callback;

    const formattedLines = [];
    dialogueLines.forEach((line) => {
      formattedLines.push(...splitIntoLines(line));
    });

    this.dialogueManager.start({ lines: formattedLines });
  }

  continueShift() {
    if (this.currentCustomer) {
      this.currentCustomer.leave(() => {
        this.currentCustomer = null;
        this.currentRequest = null;
        this.scene.time.delayedCall(1000, () => {
          this.spawnNextCustomer();
        });
      });
    } else {
      this.currentRequest = null;
      this.spawnNextCustomer();
    }
  }

  _finishShift() {
    this.scene.scene.stop("store");
    this.scene.scene.start("dailySummary");
  }

  update() {
    this.dialogueManager.update();
  }

  destroy() {
    this.scene.events.off("dialogue:finished", this._onDialogueFinished);
  }
}