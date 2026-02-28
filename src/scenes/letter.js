import Phaser from "phaser";
import letterData from "../dialogue/letter_intro.json";
import letter from "../../assets/sprites/carta.png";

export default class Letter extends Phaser.Scene {
  constructor() {
    super("letter");
  }

  preload() {
    this.load.image("letter", letter);
  }

  create() {
    // Fondo
    this.add
      .image(0, 0, "background")
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
      y: this.scale.height / 2 - 160,
      width: 260,
      height: 350,
    };

    // Container del texto
    this.textContainer = this.add.container(this.textArea.x, this.textArea.y);

    this.letterText = this.add.text(0, 0, "", {
      fontFamily: "Pixelify Sans",
      fontSize: "15px",
      color: "#4f342d",
      wordWrap: { width: this.textArea.width },
      lineSpacing: 5,
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

    // Scroll state
    this.scrollY = 0;
    this.targetScrollY = 0;
    this.scrollEnabled = false;

    // Scrollbar
    this.createScrollbar();
    this.scrollThumb.setVisible(false);
    this.scrollTrack.setVisible(false);

    const cx = this.scale.width / 2;
    const inputY = this.scale.height / 2 + 140;

    // UI nombre
    this.nameInput = this.add
      .dom(cx, inputY, "input", {
        fontSize: "15px",
        padding: "5px",
      })
      .setVisible(false);

    this.nameInput.node.placeholder = "Escribe tu nombre";
    this.nameInput.node.setAttribute("inputmode", "text");
    this.nameInput.node.setAttribute("autocomplete", "off");
    this.nameInput.node.setAttribute("autocapitalize", "none");
    this.nameInput.node.setAttribute("spellcheck", "false");

    // Filtrar en tiempo real: sin números, normalizar a minúsculas
    this.nameInput.node.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\d+/g, "");
      v = v.toLowerCase();
      v = v.replace(/\s{2,}/g, " ");
      e.target.value = v;
    });

    // Confirmar con Enter
    this.nameInput.addListener("keydown");
    this.nameInput.on("keydown", (event) => {
      if (event.key === "Enter") this.onConfirmName();
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

    // Texto
    this.fullText = letterData.text;
    this.marker = "{{NAME}}";

    this.typeUntilMarker(this.fullText, this.marker);
  }

  // ─────────────────────────────
  // SCROLLBAR
  // ─────────────────────────────
  createScrollbar() {
    const barX = this.textArea.x + this.textArea.width + 12;
    const barY = this.textArea.y;
    const barHeight = this.textArea.height;

    this.scrollTrack = this.add
      .rectangle(barX, barY, 6, barHeight, 0xcccccc)
      .setOrigin(0, 0);

    this.scrollThumb = this.add
      .rectangle(barX - 2, barY, 10, 60, 0x888888)
      .setOrigin(0, 0)
      .setInteractive({ draggable: true });

    this.input.setDraggable(this.scrollThumb);

    this.input.on("drag", (_, gameObject, __, dragY) => {
      if (!this.scrollEnabled || gameObject !== this.scrollThumb) return;

      const minY = barY;
      const maxY = barY + barHeight - this.scrollThumb.height;
      gameObject.y = Phaser.Math.Clamp(dragY, minY, maxY);

      const ratio = (gameObject.y - minY) / (maxY - minY);
      const maxScroll = Math.max(0, this.letterText.height - this.textArea.height);

      this.targetScrollY = ratio * maxScroll;
    });
  }

  update() {
    // Scroll suave
    this.scrollY = Phaser.Math.Linear(this.scrollY, this.targetScrollY, 0.1);
    this.letterText.y = -this.scrollY;

    this.updateScrollbar();
  }

  updateScrollbar() {
    if (!this.scrollEnabled) return;

    const maxScroll = Math.max(0, this.letterText.height - this.textArea.height);

    if (maxScroll <= 0) {
      this.scrollThumb.setVisible(false);
      this.scrollTrack.setVisible(false);
      return;
    }

    this.scrollThumb.setVisible(true);
    this.scrollTrack.setVisible(true);

    const ratio = this.scrollY / maxScroll;
    const trackY = this.textArea.y;
    const trackH = this.textArea.height;

    this.scrollThumb.y = trackY + ratio * (trackH - this.scrollThumb.height);
  }

  // ─────────────────────────────
  // TEXTO
  // ─────────────────────────────
  typeUntilMarker(text, marker) {
    const i = text.indexOf(marker);

    if (i === -1) {
      return this.typewriterEffect(text, () => {
        this.scrollEnabled = true;
        this.closeButton.setVisible(true);
      });
    }

    this.before = text.slice(0, i);
    this.after = text.slice(i + marker.length);

    this.typewriterEffect(this.before, () => {
      this.nameInput.setVisible(true);
      this.confirmText.setVisible(true);

      // En algunos navegadores el focus inmediato falla: delay corto
      this.time.delayedCall(50, () => {
        this.nameInput.node.focus();
        this.nameInput.node.click();
      });
    });
  }

  onConfirmName() {
    const raw = this.nameInput.node.value ?? "";
    const name = raw.replace(/\d+/g, "").trim().toLowerCase() || "jugador";

    // Guardar para el resto del juego
    this.registry.set("playerName", name);

    this.nameInput.setVisible(false);
    this.confirmText.setVisible(false);

    this.letterText.text += name;

    this.typewriterEffect(this.after, () => {
      this.scrollEnabled = true;
      this.closeButton.setVisible(true);
    });
  }

  typewriterEffect(text, onComplete) {
    let index = 0;

    this.time.addEvent({
      delay: 20,
      repeat: text.length - 1,
      callback: () => {
        this.letterText.text += text[index];
        index++;

        // Scroll automático progresivo
        const maxScroll = Math.max(0, this.letterText.height - this.textArea.height);
        this.targetScrollY = maxScroll;

        if (index === text.length && onComplete) onComplete();
      },
    });
  }
}
