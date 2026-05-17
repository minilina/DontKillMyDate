import NPC from "../game-objects/npc.js";
import DialogueManager from "./dialogueManager.js";
import {
  generateRandomRequest,
  processScriptedDialogue,
} from "./requestGenerator.js";
import { buildDialogueFromRequest, splitIntoLines } from "./dialogueScripts.js";
import NPCGenerator from "../utils/npcGenerator.js";
import GameState from "../state/GameState.js";

// Importamos el JSON de NPCs especiales para leer los datos del inspector
import ScriptedNPCs from "../../assets/json/scriptedNpcs.json";

export default class CustomerFlowManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueManager = new DialogueManager(scene);
    this.currentCustomer = null;
    this.currentRequest = null;

    this.isShowingResult = false;
    this.onResultComplete = null;

    // Variable para saber si estamos en el diálogo de final de partida
    this.isShowingGameOver = false;
    this.isKnocking = false; // Variable para los golpes en la puerta

    this._onDialogueFinished = this._onDialogueFinished.bind(this);
    this.scene.events.on("dialogue:finished", this._onDialogueFinished);
  }

  startShift() {
    this.spawnNextCustomer();
  }

  spawnNextCustomer() {
    // Comprobamos si el día ha terminado
    if (GameState.isDayOver()) {
      if (GameState.reputation <= - 60) {
        this.startGameOverSequence();
      } else {
        this._finishShift();
      }
      return;
    }

    if (this.currentCustomer) {
      this.currentCustomer.destroy();
    }

    GameState.prepareNewCustomer();

    const customerType = GameState.getCurrentCustomerType();
    const difficulty = GameState.getCurrentDifficulty
      ? GameState.getCurrentDifficulty()
      : "facil";

    let looksNPC;
    let dialogueData;

    if (customerType === "npc") {
      this.currentRequest = generateRandomRequest(difficulty);
      const chosenRace = this.currentRequest.requirements.raza;
      looksNPC = NPCGenerator.generateLooks(chosenRace);
      dialogueData = buildDialogueFromRequest(this.currentRequest);
    } else {
      const specialData = GameState.getSpecialNPC(customerType);
      const scriptedRequest = processScriptedDialogue(specialData);

      this.currentRequest = {
        requirements: scriptedRequest.requirements,
        literalWords: scriptedRequest.literalWords,
      };

      looksNPC = specialData.looks;

      const formattedScriptedLines = [];
      scriptedRequest.dialogueLines.forEach((line) => {
        formattedScriptedLines.push(...splitIntoLines(line));
      });

      dialogueData = {
        speakerName: specialData.name,
        lines: formattedScriptedLines,
      };

      this.currentRequest.specialData = specialData;
    }

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

  // Secuencia inicial de los golpes en la puerta
  startGameOverSequence() {
    if (this.currentCustomer) {
      this.currentCustomer.destroy();
      this.currentCustomer = null;
    }

    this.isKnocking = true;

    this.dialogueManager.start({
      speakerName: "???",
      lines: [
        "*¡PUM! ¡PUM! ¡PUM!*",
        "¡GUARDIA REAL! ¡ABRAN LA PUERTA EN NOMBRE DEL REY!",
      ],
    });
  }

  // Crea al inspector leyendo desde el archivo JSON
  spawnGameOverNPC() {
    if (this.currentCustomer) {
      this.currentCustomer.destroy();
    }

    const dataInspector = ScriptedNPCs.inspector;

    this.currentCustomer = new NPC(
      this.scene,
      this.scene.scale.width / 4,
      this.scene.scale.height * 0.85,
      dataInspector.looks,
      {},
    );

    this.isShowingGameOver = true;

    // Procesamos sus frases por si contienen saltos o marcas
    const formattedInspectorLines = [];
    dataInspector.dialogue.forEach((line) => {
      formattedInspectorLines.push(...splitIntoLines(line));
    });

    this.dialogueManager.start({
      speakerName: dataInspector.name,
      lines: formattedInspectorLines,
    });
  }

  _onDialogueFinished() {
    // Si acababa de hablar la voz de la puerta, hacemos aparecer al NPC físico
    if (this.isKnocking) {
      this.isKnocking = false;
      this.spawnGameOverNPC();
      return;
    }

    // Si acababa de hablar el Inspector, saltamos a la pantalla de Game Over
    if (this.isShowingGameOver) {
      this.scene.scene.stop("store");
      this.scene.scene.start("gameOver");
      return;
    }

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