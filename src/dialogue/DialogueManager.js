import Phaser from "phaser";
import DialogueUI from "./dialogueUI.js";

/**
 * Controlador del flujo del diálogo (líneas + avanzar + eventos).
 */
export default class DialogueManager {
  /**
   * @param {Phaser.Scene} scene
   * @param {{ ui?: DialogueUI }} opts
   */
  constructor(scene, opts = {}) {
    this.scene = scene;
    this.ui = opts.ui ?? new DialogueUI(scene);

    this.active = false;
    this.lines = [];
    this.index = 0;

    this.speakerName = "";

    this.ui.onContinue(() => this.next());
  }

  /**
   * Inicia un diálogo.
   * @param {{lines: string[]}} dialogue
   */
  start(dialogue) {
    this.active = true;
    this.lines = dialogue?.lines ?? [];
    this.index = 0;

    this.ui.show();
    this._showCurrentLine();
    this.scene.events.emit("dialogue:started", dialogue);
  }

  _showCurrentLine() {
    const line = this.lines[this.index] ?? "";
    this.ui.setLine(line);
  }

  next() {
    if (!this.active) return;

    this.index += 1;
    if (this.index < this.lines.length) {
      this._showCurrentLine();
      return;
    }

    this.finish();
  }

  finish() {
    if (!this.active) return;

    this.active = false;
    this.ui.hide();
    this.scene.events.emit("dialogue:finished");
  }

  update() {
    
  }
}