import Phaser from "phaser";
import letterData from "../../assets/json/letter_intro.json";
import letter from "../../assets/sprites/carta.png";

export default class Letter extends Phaser.Scene {
  constructor() {
    super("Letter");
  }

  preload() {
    this.load.image("letter", letter);
  }

  create() {
    // Fondo
    this.add
      .image(0, 0, "store")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(0);

    // Capa de luz
    this.add
      .image(0, 0, "luzStore")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(20);

    // Mostrador
    this.add
      .image(0, 0, "mostrador")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(40);

    // Carta
    this.add
      .image(0, 0, "letter")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height)
      .setDepth(50);

    // Área visible del texto
    this.textArea = {
      x: this.scale.width / 2 - 130,
      y: this.scale.height / 2 - 175,
      width: 260,
      height: 350,
    };

    // Container del texto
    this.textContainer = this.add.container(this.textArea.x, this.textArea.y).setDepth(60);

    this.letterText = this.add.text(0, 0, "", {
      fontFamily: "VT323, monospace",
      fontSize: "24px",
      color: "#4f342d",
      wordWrap: { width: this.textArea.width },
    });

    this.textContainer.add(this.letterText);

    // Máscara
    const maskGfx = this.make.graphics({});
    maskGfx.fillStyle(0xffffff);
    maskGfx.fillRect(
      this.textArea.x,
      this.textArea.y,
      this.textArea.width,
      this.textArea.height
    );
    this.textContainer.setMask(maskGfx.createGeometryMask());

    // ─────────────────────────────
    // OPCIÓN B: centrar input respecto al textArea
    // ─────────────────────────────
    const uiCx = this.textArea.x + this.textArea.width / 2;
    const uiCy = this.textArea.y + this.textArea.height / 2;

    const closeY = uiCy + 180;

    // Botón cerrar
    this.closeButton = this.add
      .text(uiCx, closeY, "COMENZAR TUTORIAL", {
        fontFamily: "VT323, monospace",
        fontSize: "21px",
        backgroundColor: "#4f342d",
        color: "#ffffff",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setDepth(60)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.closeButton.on("pointerover", () => this.closeButton.setColor("#ffcc00"));
    this.closeButton.on("pointerout", () => this.closeButton.setColor("#ffffff"));

    this.closeButton.on("pointerdown", () => {
      this.game.canvas.style.cursor = 'default';
      this.scene.start("kitchen", { startInTutorialMode: true });
    });

    // ─────────────────────────────
    // PAGINACIÓN MANUAL
    // ─────────────────────────────
    this.pages = letterData.pages ?? [];
    this.pageIndex = 0;

    // ─────────────────────────────
    // Estado typewriter + skip con Enter o Click
    // ─────────────────────────────
    this.isTyping = false;
    this._typeEvent = null;
    this._fullTargetText = "";
    this._baseText = "";
    this._onTypeComplete = null;
    this._typeIndex = 0;

    // Acción unificada: si escribe -> completa; si no -> avanza/cierra
    this.advanceOrFinish = () => {
      // Si estamos escribiendo: completar
      if (this.isTyping) {
        this.finishTyping();
        this.sound.play("buttonSound", { volume: 1 });
        return;
      }
      const bookSounds = ['bookSound1', 'bookSound2'];
      const randomSound = Phaser.Math.RND.pick(bookSounds);

      // Si está el botón de cerrar (última página)
      if (this.closeButton.visible) {
        this.sound.play(randomSound, { volume: 1 });

        // CAMBIO 2: Solo iniciamos la cocina, pasándole el parámetro
        this.scene.start("kitchen", { startInTutorialMode: true });
        return;
      }

      // Si no: siguiente página
      this.sound.play(randomSound, { volume: 1 });
      this.nextManualPage();
    };

    // Enter: misma lógica que click
    this.input.keyboard.on("keydown-ENTER", () => {
      this.advanceOrFinish();
    });

    // Click en cualquier parte: misma lógica que enter
    this.input.off("pointerdown");
    this.input.on("pointerdown", () => {
      this.advanceOrFinish();
    });

    // Render inicial
    this.renderPage(0);

    // Pausa
    this.pauseKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ESC,
    );
    this.createPauseButton();
  }

  createPauseButton() {
    const btnX = this.scale.width - 25;
    const btnY = 25;

    // Sprite botón
    this.pauseBtnBg = this.add.image(btnX, btnY, 'pauseBtn')
      .setInteractive({ useHandCursor: true })
      .setOrigin(0.5)
      .setScale(3)
      .setDepth(1000);

    // Animación hover
    this.pauseBtnBg.on('pointerover', () => {
      this.pauseBtnBg.setTexture('pauseBtnPressed');
    });

    this.pauseBtnBg.on('pointerout', () => {
      this.pauseBtnBg.setTexture('pauseBtn');
    });

    // Acción al hacer clic
    this.pauseBtnBg.on('pointerdown', () => {
      this.sound.play('buttonSound', { volume: 0.2 });
      this.openPauseMenu();
    });
  }

  update(time, delta) {
    this.flowManager?.update(time, delta);
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      this.openPauseMenu();
    }
  }

  openPauseMenu() {
    this.scene.launch("Menu", { parentScene: this.scene.key });
    this.scene.pause();
  }

  shutdown() {
    console.log("Letter.js -> Limpiando listeners.");
    // Eliminamos los listeners globales para que no interfieran con otras escenas.
    this.input.keyboard.off("keydown-ENTER");
    this.input.off("pointerdown");
  }

  // Utilidad: capitalizar primera letra
  capitalizeFirstLetter(s) {
    const str = (s ?? "").toString();
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Escribe con efecto (controlable)
  typewriter(text, onComplete, opts) {
    this.game.canvas.style.cursor = 'default';

    const append = opts?.append ?? false;
    const speed = opts?.speed ?? 20;

    const base = append ? (this.letterText.text ?? "") : "";
    if (!append) this.letterText.setText("");

    // Guardar estado para poder "finishTyping"
    this._baseText = base;
    this._fullTargetText = text ?? "";
    this._onTypeComplete = onComplete;
    this._typeIndex = 0;

    this.isTyping = true;

    // cancelar cualquier timer anterior
    if (this._typeEvent) {
      this._typeEvent.remove(false);
      this._typeEvent = null;
    }

    const tick = () => {
      if (!this.isTyping) return;

      if (this._typeIndex >= this._fullTargetText.length) {
        this.isTyping = false;
        this._typeEvent = null;
        const cb = this._onTypeComplete;
        this._onTypeComplete = null;
        cb?.();
        return;
      }

      this.letterText.setText(
        this._baseText + this._fullTargetText.slice(0, this._typeIndex + 1)
      );
      this._typeIndex++;

      this._typeEvent = this.time.delayedCall(speed, tick);
    };

    tick();
  }

  // Completa instantáneamente el texto que queda por escribir
  finishTyping() {
    if (!this.isTyping) return;

    if (this._typeEvent) {
      this._typeEvent.remove(false);
      this._typeEvent = null;
    }

    this.letterText.setText(this._baseText + this._fullTargetText);

    this.isTyping = false;

    const cb = this._onTypeComplete;
    this._onTypeComplete = null;
    cb?.();
  }

  renderPage(index) {
    const raw = this.pages[index] ?? "";

    // última página => luego mostrar "Cerrar carta"
    const isLast = index >= this.pages.length - 1;

    // página normal
    this.typewriter(raw, () => {
      if (isLast) {
        this.closeButton.setVisible(true);
      } else {
        this.closeButton.setVisible(false);
      }
      this.game.canvas.style.cursor = 'pointer';
    });
  }

  nextManualPage() {
    if (this.pageIndex >= this.pages.length - 1) {
      this.closeButton.setVisible(true);
      return;
    }

    this.pageIndex++;
    this.renderPage(this.pageIndex);
  }

  initializeKitchen() {
    this.scene.start("kitchen");
    const kitchen = this.scene.get("kitchen");
    kitchen.events.once(Phaser.Scenes.Events.CREATE, () => {
      kitchen.startTutorial('full');
    });
  }
}