import NPC from "../game-objects/npc.js";
import DialogueManager from "./dialogueManager.js";
import {
  generateRandomRequest,
  processScriptedDialogue,
} from "./requestGenerator.js";
import { buildDialogueFromRequest, splitIntoLines } from "./dialogueScripts.js";
import NPCGenerator from "../utils/npcGenerator.js";
import GameState from "../state/GameState.js";

import ScriptedNPCs from "../../assets/json/scriptedNpcs.json";

export default class CustomerFlowManager {
  constructor(scene) {
    this.scene = scene;
    this.dialogueManager = new DialogueManager(scene);
    this.currentCustomer = null;
    this.currentRequest = null;

    this.isShowingResult = false;
    this.onResultComplete = null;

    this.isShowingGameOver = false;
    this.isKnocking = false;

    this.isShowingNeutralEnding = false;
    this.isKnockingNeutral = false;

    this._onDialogueFinished = this._onDialogueFinished.bind(this);
    this.scene.events.on("dialogue:finished", this._onDialogueFinished);
  }

  startShift() {
    this.spawnNextCustomer();
  }

  spawnNextCustomer() {
    if (GameState.isDayOver()) {
      if (GameState.reputation <= -60) {
        this.startGameOverSequence();
        return;
      }

      if (GameState.currentDay >= GameState.daysData.length) {
        if (GameState.isNeutralEnding()) {
          this.startNeutralEndingSequence();
        } else {
          this._finishShift(); // buen final
        }
        return;
      }

      this._finishShift();
      return;
    }

    if (this.currentCustomer) {
      this.currentCustomer.destroy();
    }

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

    // --- DISEÑO BASADO EN DATOS ---
    // Le pasamos this.currentRequest.specialData directamente en el constructor
    this.currentCustomer = new NPC(
      this.scene,
      this.scene.scale.width / 4,
      this.scene.scale.height * 0.85,
      looksNPC,
      this.currentRequest.requirements,
      this.currentRequest.specialData, // <-- NUEVO PARÁMETRO AÑADIDO
    );

    if (this.currentRequest.specialData) {
      this.currentCustomer.npcData = this.currentRequest.specialData;
      this.currentCustomer.id = customerType;

      // Aplicamos ajustes físicos genéricos al entrar (Si los tiene en el JSON)
      if (this.currentRequest.specialData.ajustesEntrada) {
        const ajustes = this.currentRequest.specialData.ajustesEntrada;
        if (ajustes.offsetY) this.currentCustomer.y += ajustes.offsetY;
        if (ajustes.depth) this.currentCustomer.setDepth(ajustes.depth);
      }
    }

    this.dialogueManager.start(dialogueData);
  }

  // ── GAME OVER ──────────────────────────────────────────────────────────────

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

    const formattedInspectorLines = [];
    dataInspector.dialogue.forEach((line) => {
      formattedInspectorLines.push(...splitIntoLines(line));
    });

    this.dialogueManager.start({
      speakerName: dataInspector.name,
      lines: formattedInspectorLines,
    });
  }

  // ── FINAL INTERMEDIO ───────────────────────────────────────────────────────

  startNeutralEndingSequence() {
    if (this.currentCustomer) {
      this.currentCustomer.destroy();
      this.currentCustomer = null;
    }

    this.isKnockingNeutral = true;

    // Llamada más suave a la puerta, tono ambiguo
    this.dialogueManager.start({
      speakerName: "???",
      lines: ["*toc... toc... toc...*", "Sobrina, ¿Estás ahí?."],
    });
  }

  spawnNeutralEndingNPC() {
    if (this.currentCustomer) {
      this.currentCustomer.destroy();
    }

    // Apunta a la entrada "neutralEnding" en scriptedNpcs.json
    const dataNeutralNPC = ScriptedNPCs.aunt;

    this.currentCustomer = new NPC(
      this.scene,
      this.scene.scale.width / 4,
      this.scene.scale.height * 0.85,
      dataNeutralNPC.looks,
      {},
    );

    this.isShowingNeutralEnding = true;

    const formattedLines = [];
    dataNeutralNPC.dialogue.forEach((line) => {
      formattedLines.push(...splitIntoLines(line));
    });

    this.dialogueManager.start({
      speakerName: dataNeutralNPC.name,
      lines: formattedLines,
    });
  }

  // ── EVENTOS DE DIÁLOGO ─────────────────────────────────────────────────────

  _onDialogueFinished() {
    // Golpes del Game Over → aparece el Inspector
    if (this.isKnocking) {
      this.isKnocking = false;
      this.spawnGameOverNPC();
      return;
    }

    // Inspector termina → pantalla Game Over
    if (this.isShowingGameOver) {
      // borramos partida guardada
      localStorage.removeItem('potionGameSave');

      this.scene.scene.stop("store");
      this.scene.scene.start("gameOver");
      return;
    }

    // Golpes del final intermedio → aparece el NPC especial
    if (this.isKnockingNeutral) {
      this.isKnockingNeutral = false;
      this.spawnNeutralEndingNPC();
      return;
    }

    // NPC del final intermedio termina → pantalla de final intermedio
    if (this.isShowingNeutralEnding) {
      // borramos partida guardada
      localStorage.removeItem('potionGameSave');

      this.isShowingNeutralEnding = false;
      this.scene.scene.stop("store");
      this.scene.scene.start("gameOver"); // ← antes ponía "neutralEnding"
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
    
    GameState.prepareNewCustomer();
    
    this.scene.scene.sleep("store");
    this.scene.scene.launch("kitchen");
  }

  // ── RESTO ──────────────────────────────────────────────────────────────────

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