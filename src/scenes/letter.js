import Phaser from "phaser";
import letterData from "../dialogue/letter_intro.json";
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
      .image(0, 0, "fondo")
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
      fontSize: "23px",
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

    const cx = this.scale.width / 2;
    const inputY = this.scale.height / 2 + 140;

    // UI nombre
    this.nameInput = this.add
      .dom(cx, inputY, "input", { fontSize: "15px", padding: "5px" })
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
      v = v.substring(0, 20);
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
      .text(cx, inputY + 40, "Confirmar", {
        fontFamily: "Pixelify Sans",
        fontSize: "15px",
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
      .text(cx, inputY + 80, "Cerrar carta", {
        fontFamily: "Pixelify Sans",
        fontSize: "15px",
        backgroundColor: "#4f342d",
        color: "#ffffff",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.closeButton.on("pointerdown", () => this.scene.start("store"));

    // Prompt "ENTER para continuar"
    this.nextPrompt = this.add
      .text(
        this.textArea.x + this.textArea.width / 2,
        this.textArea.y + this.textArea.height + 18,
        "Pulsa ENTER para continuar",
        { fontFamily: "Pixelify Sans", fontSize: "14px", color: "#4f342d" }
      )
      .setOrigin(0.5)
      .setVisible(false);

    // ─────────────────────────────
    // PAGINACIÓN MANUAL (3 páginas fijas)
    // ─────────────────────────────
    this.pages = letterData.pages ?? [];
    this.pageIndex = 0;
    this.marker = "{{NAME}}";
    this.waitingName = false;

    // Enter para siguiente página (solo si no estás en input de nombre)
    this.input.keyboard.on("keydown-ENTER", () => {
      // Si estamos esperando nombre, no pasar página
      if (this.waitingName) return;

      // Si el foco está en un input/textarea (extra seguridad)
      const ae = document.activeElement?.tagName?.toLowerCase();
      if (ae === "input" || ae === "textarea") return;

      if (this.closeButton.visible) {
        this.scene.start("store");
        return;
      }

      this.nextManualPage();
    });

    // Render inicial
    this.renderPage(0);
  }

  // Escribe con efecto (sin cortar automáticamente)
  typewriter(text, onComplete, opts) {
    const append = opts?.append ?? false;

    const base = append ? (this.letterText.text ?? "") : "";
    if (!append) this.letterText.setText("");

    let i = 0;

    const tick = () => {
      if (i >= text.length) {
        onComplete?.();
        return;
      }
      this.letterText.setText(base + text.slice(0, i + 1));
      i++;
      this.time.delayedCall(20, tick);
    };

    tick();
  }

  renderPage(index) {
    const raw = this.pages[index] ?? "";

    // última página => luego mostrar "Cerrar" en vez de prompt
    const isLast = index >= this.pages.length - 1;

    // si en esta página está el marcador, paramos y pedimos nombre
    const markerPos = raw.indexOf(this.marker);
    if (markerPos !== -1) {
      const before = raw.slice(0, markerPos);
      const after = raw.slice(markerPos + this.marker.length);

      this.waitingName = false;
      this.nextPrompt.setVisible(false);
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
        this.nextPrompt.setVisible(false);
        this.closeButton.setVisible(true);
      } else {
        this.nextPrompt.setVisible(true);
        this.closeButton.setVisible(false);
      }
    });
  }

 onConfirmName() {
  const raw = this.nameInput.node.value ?? "";
  const name = raw.replace(/\d+/g, "").trim().toLowerCase() || "jugador";

  this.registry.set("playerName", name);

  this.nameInput.setVisible(false);
  this.confirmText.setVisible(false);
  this.waitingName = false;

  const after = this._afterNameInThisPage ?? "";

  // 1) pegar el nombre inmediatamente (sin reescribir "Querida ")
  this.letterText.setText((this.letterText.text ?? "") + name);

  // 2) continuar escribiendo el resto con append
  const isLast = this.pageIndex >= this.pages.length - 1;
  this.typewriter(after, () => {
    if (isLast) {
      this.nextPrompt.setVisible(false);
      this.closeButton.setVisible(true);
    } else {
      this.nextPrompt.setVisible(true);
    }
  }, { append: true });
}

  nextManualPage() {
    if (this.pageIndex >= this.pages.length - 1) {
      // ya es la última; aquí podrías cerrar o no hacer nada
      this.closeButton.setVisible(true);
      this.nextPrompt.setVisible(false);
      return;
    }

    this.pageIndex++;
    this.nextPrompt.setVisible(false);
    this.renderPage(this.pageIndex);
  }
}