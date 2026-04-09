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
      .setDisplaySize(this.scale.width, this.scale.height);

    // Carta
    this.add
      .image(0, 0, "letter")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);

    // Área visible del texto
    this.textArea = {
      x: this.scale.width / 2 - 130,
      y: this.scale.height / 2 - 175,
      width: 260,
      height: 350,
    };

    // Container del texto
    this.textContainer = this.add.container(this.textArea.x, this.textArea.y);

    this.letterText = this.add.text(0, 0, "", {
      fontFamily: "VT323, monospace",
      fontSize: "25px",
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


    const inputY = uiCy; // centro vertical del área
    const confirmY = uiCy + 180;
    const closeY = uiCy + 180;

    // UI nombre
    this.nameInput = this.add
      .dom(uiCx, inputY+130, "input", { fontSize: "15px", padding: "5px" })
      .setVisible(false);

    this.nameInput.node.placeholder = "Escribe tu nombre";
    this.nameInput.node.setAttribute("inputmode", "text");
    this.nameInput.node.setAttribute("autocomplete", "off");
    this.nameInput.node.setAttribute("autocapitalize", "none");
    this.nameInput.node.setAttribute("spellcheck", "false");

    this.nameInput.node.addEventListener("input", (e) => {
      let v = e.target.value;
      v = v.toLowerCase();
      v = v.replace(/[^a-z]/g, "");
      v = v.substring(0, 16);
      e.target.value = v;
    });

    this.nameInput.addListener("keydown");
    this.nameInput.on("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        this.onConfirmName();
      }
    });

    this.confirmText = this.add
      .text(uiCx, confirmY, "Confirmar", {
        fontFamily: "VT323, monospace",
        fontSize: "21px",
        backgroundColor: "#4f342d",
        color: "#ffffff",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.confirmText.on("pointerdown", () => this.onConfirmName());

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
      .setInteractive()
      .setVisible(false);

    this.closeButton.on("pointerdown", () => 
      this.initializeKitchen()
    );

    // (Quitado) Prompt "ENTER para continuar"
    // Ya no se crea nextPrompt

    // ─────────────────────────────
    // PAGINACIÓN MANUAL
    // ─────────────────────────────
    this.pages = letterData.pages ?? [];
    this.pageIndex = 0;
    this.marker = "{{NAME}}";
    this.waitingName = false;

    // ─────────────────────────────
    // Estado typewriter + skip con Enter o Click
    // ─────────────────────────────
    this.isTyping = false;
    this._typeEvent = null;
    this._fullTargetText = "";
    this._baseText = "";
    this._onTypeComplete = null;
    this._typeIndex = 0;
    this._afterNameInThisPage = "";

    // Acción unificada: si escribe -> completa; si no -> avanza/cierra
    this.advanceOrFinish = () => {
      // Si estamos esperando nombre, no avanzar
      if (this.waitingName) return;

      // Si el foco está en un input/textarea, no avanzar
      const ae = document.activeElement?.tagName?.toLowerCase();
      if (ae === "input" || ae === "textarea") return;

      // Si está escribiendo: completar
      if (this.isTyping) {
        this.finishTyping();
        return;
      }

      // Si está el botón de cerrar (última página)
      if (this.closeButton.visible) {
        this.initializeKitchen();
        return;
      }

      // Si no: siguiente página
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

    // si en esta página está el marcador, paramos y pedimos nombre
    const markerPos = raw.indexOf(this.marker);
    if (markerPos !== -1) {
      const before = raw.slice(0, markerPos);
      const after = raw.slice(markerPos + this.marker.length);

      this.waitingName = false;
      this.closeButton.setVisible(false);

      this.typewriter(before, () => {
        this.waitingName = true;
        this._afterNameInThisPage = after;

        this.nameInput.setVisible(true);
        this.confirmText.setVisible(true);

        this.time.delayedCall(50, () => {
          this.nameInput.node.focus();
          this.nameInput.node.click();
        });
      });

      return;
    }

    // página normal
    this.typewriter(raw, () => {
      if (isLast) {
        this.closeButton.setVisible(true);
      } else {
        this.closeButton.setVisible(false);
      }
    });
  }

  onConfirmName() {
    const raw = this.nameInput.node.value ?? "";

    const cleanLower = raw.replace(/\d+/g, "").trim().toLowerCase() || "jugador";
    const nameForLetter = this.capitalizeFirstLetter(cleanLower);

    this.registry.set("playerName", nameForLetter);

    this.nameInput.setVisible(false);
    this.confirmText.setVisible(false);
    this.waitingName = false;

    const after = this._afterNameInThisPage ?? "";

    // 1) pegar el nombre inmediatamente
    this.letterText.setText((this.letterText.text ?? "") + nameForLetter);

    // 2) continuar escribiendo el resto con append
    const isLast = this.pageIndex >= this.pages.length - 1;
    this.typewriter(
      after,
      () => {
        if (isLast) {
          this.closeButton.setVisible(true);
        }
      },
      { append: true }
    );
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
