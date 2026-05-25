import Phaser from "phaser";
import DialogueManager from "../dialogue/dialogueManager.js";
import NPC from "../game-objects/npc.js";

/**
 * DialogueScene
 * -------------
 * Escena overlay que imita visualmente la escena "store":
 *   - Fondo oscuro semitransparente (como el menú de pausa)
 *   - Sprite del NPC a la izquierda (construido con npc.js usando los looks del JSON)
 *   - Cuadro de diálogo abajo a la derecha (el mismo DialogueUI de la tienda)
 *
 * Se lanza desde una TopDownScene así:
 *
 *   this.scene.launch("DialogueScene", {
 *     parentScene: this.scene.key,
 *     npcData:     scriptedNpcs[npcId],   // el objeto completo del JSON
 *     dialogue:    { speakerName, lines },
 *   });
 *   this.scene.pause();
 */
export default class DialogueScene extends Phaser.Scene {
  constructor() {
    super({ key: "DialogueScene" });
  }

  init(data) {
    this.parentSceneKey = data.parentScene;
    this.dialogueData = data.dialogue;
    this.npcData = data.npcData ?? null;  // objeto completo del JSON (tiene .looks)
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.add
      .rectangle(0, 0, W, H, 0x000000, 0.6)
      .setOrigin(0, 0)
      .setDepth(0);

    if (this.npcData?.looks) {
      // NPC usa la misma clase que en la tienda. Le pasamos looks y requirements vacíos.
      this.npcSprite = new NPC(
        this,
        W / 4,
        H * 0.85,
        this.npcData.looks,
        {},
        this.npcData,
      );
    }


    this.scene.bringToTop();

    this.dialogueManager = new DialogueManager(this);

    this.events.once("dialogue:finished", () => this._onFinished());

    this.dialogueManager.start(this.dialogueData);
  }

  update() {
    this.dialogueManager?.update();
  }

  _onFinished() {
    this.scene.resume(this.parentSceneKey);
    this.scene.stop();
  }
}