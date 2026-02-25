import Phaser from "phaser";
import letterData from "../dialogue/letter_intro.json";
import pergamino from "../../assets/sprites/pergamino.png";

export default class LetterScene extends Phaser.Scene {
  constructor() {
    super("LetterScene");
  }

  preload() {
    this.load.image("letter", pergamino);
  }

  create() {
    // Fondo
    this.add
      .image(0, 0, "background")
      .setOrigin(0, 0)
      .setDisplaySize(this.scale.width, this.scale.height);

    // Carta
    this.add
      .image(this.scale.width / 2, this.scale.height / 2, "letter")
      .setDisplaySize(1250, 700);

    // Área visible del texto
    this.textArea = {
      x: this.scale.width / 2 - 240,
      y: this.scale.height / 2 - 140,
      width: 500,
      height: 300,
    };

    // Container del texto
    this.textContainer = this.add.container(this.textArea.x, this.textArea.y);

    this.letterText = this.add.text(0, 0, "", {
      fontSize: "20px",
      color: "#1a1a1a",
      wordWrap: { width: this.textArea.width },
      lineSpacing: 8,
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

    // UI nombre
    this.nameInput = this.add
      .dom(cx, 520, "input", {
        fontSize: "24px",
        padding: "10px",
      })
      .setVisible(false);

    this.nameInput.node.placeholder = "Escribe tu nombre";
    this.nameInput.node.setAttribute("inputmode", "text");
    this.nameInput.node.setAttribute("autocomplete", "off");
    this.nameInput.node.setAttribute("autocapitalize", "none"); // no auto-mayúsculas
    this.nameInput.node.setAttribute("spellcheck", "false");

    // Filtrar en tiempo real: NO números, NO distinguir may/min (guardamos en minúsculas)
    this.nameInput.node.addEventListener("input", (e) => {
      // 1) quitar dígitos
      let v = e.target.value.replace(/\d+/g, "");

      // 2) normalizar: todo minúsculas (así no distinguís may/min)
      v = v.toLowerCase();

      // (opcional) también puedes limpiar dobles espacios:
      v = v.replace(/\s{2,}/g, " ");

      // aplicar
      e.target.value = v;
    });

    // Confirmar con Enter
    this.nameInput.addListener("keydown");
    this.nameInput.on("keydown", (event) => {
      if (event.key === "Enter") this.onConfirmName();
    });

    this.confirmText = this.add
      .text(cx, 570, "Confirmar", {
        fontSize: "24px",
        color: "#000",
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.confirmText.on("pointerdown", () => this.onConfirmName());

    // Botón cerrar
    this.closeButton = this.add
      .text(cx, 570, "Cerrar carta", {
        fontSize: "26px",
        backgroundColor: "#ffffff",
        color: "#000",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.closeButton.on("pointerdown", () => this.scene.start("level"));

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
      this.nameInput.node.focus();
    });
  }

  onConfirmName() {
    // Ya llega filtrado (sin números y en minúsculas), pero limpiamos por seguridad
    const raw = this.nameInput.node.value ?? "";
    const name = raw.replace(/\d+/g, "").trim().toLowerCase() || "jugador";

    // Guardar para el resto del juego (normalizado)
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