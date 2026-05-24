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
    this.dialogueData   = data.dialogue;
    this.npcData        = data.npcData ?? null;  // objeto completo del JSON (tiene .looks)
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // ── 1. FONDO OSCURO (igual que el menú de pausa) ──────────────────────────
    this.add
      .rectangle(0, 0, W, H, 0x000000, 0.6)
      .setOrigin(0, 0)
      .setDepth(0);

    // ── 2. SPRITE DEL NPC (mismo sitio que en store: cuarto izquierdo) ─────────
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

      // Aplicamos ajustes de entrada si los hay (igual que en customerFlowManager)
      if (this.npcData.ajustesEntrada) {
        const aj = this.npcData.ajustesEntrada;
        if (aj.offsetY) this.npcSprite.y += aj.offsetY;
        if (aj.depth)   this.npcSprite.setDepth(aj.depth);
      }
    }

    // ── 3. CAPA "mostrador" y "luzStore" (para que el NPC encaje visualmente) ──
    // Si en tu juego estos assets también se cargan en las topdown scenes puedes
    // descomentar estas líneas. Si no, el NPC flota sobre el fondo oscuro (también queda bien).
    //
    // this.add.image(0, 0, "mostrador").setOrigin(0,0).setDisplaySize(W,H).setDepth(40);
    // this.add.image(0, 0, "luzStore").setOrigin(0,0).setDisplaySize(W,H).setDepth(20);

    // ── 4. DIALOGUE MANAGER (idéntico al de store) ─────────────────────────────
    // Traemos esta escena al frente del renderizado (igual que Menu.js)
    this.scene.bringToTop();

    this.dialogueManager = new DialogueManager(this);

    // Escuchamos el fin del diálogo
    this.events.once("dialogue:finished", () => this._onFinished());

    // Arrancamos
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