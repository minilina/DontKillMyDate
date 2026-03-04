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
      fontSize: "18px",
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

    // Confirmar con Enter cuando el input está enfocado
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

    // ─────────────────────────────
    // PAGINACIÓN (ENTER PARA CONTINUAR)
    // ─────────────────────────────
    this.pageText = "";
    this.remainingText = "";
    this.isPaging = false;
    this.onPagedComplete = null;

    this.nextPrompt = this.add
      .text(
        this.textArea.x + this.textArea.width / 2,
        this.textArea.y + this.textArea.height + 18,
        "Pulsa ENTER para continuar",
        {
          fontFamily: "Pixelify Sans",
          fontSize: "14px",
          color: "#4f342d",
        }
      )
      .setOrigin(0.5)
      .setVisible(false);

    // Enter global para pasar página (cuando esté esperando)
    this.input.keyboard.on("keydown-ENTER", () => {
      if (this.isPaging) this.nextPage();
    });

    // Texto
    this.fullText = letterData.text;
    this.marker = "{{NAME}}";

    this.typeUntilMarker(this.fullText, this.marker);
  }

  // ─────────────────────────────
  // PAGINACIÓN
  // ─────────────────────────────
  fitsInTextArea(candidateText) {
    this.letterText.setText(candidateText);
    return this.letterText.height <= this.textArea.height;
  }

  typewriterPaged(text, onComplete) {
    // Si ya estaba escribiendo algo, lo "pisamos" sin más (simple)
    this.onPagedComplete = onComplete ?? null;

    this.remainingText = text ?? "";
    this.pageText = "";
    this.isPaging = false;
    this.nextPrompt.setVisible(false);
    this.letterText.setText("");

    const writeNextChar = () => {
      if (this.isPaging) return;

      if (!this.remainingText || this.remainingText.length === 0) {
        if (this.onPagedComplete) this.onPagedComplete();
        return;
      }

      const ch = this.remainingText[0];
      const candidate = this.pageText + ch;

      if (!this.fitsInTextArea(candidate)) {
        this.isPaging = true;
        this.nextPrompt.setVisible(true);
        return;
      }

      this.pageText = candidate;
      this.remainingText = this.remainingText.slice(1);
      this.letterText.setText(this.pageText);

      this.time.delayedCall(20, writeNextChar);
    };

    writeNextChar();
  }

  nextPage() {
    this.isPaging = false;
    this.nextPrompt.setVisible(false);

    this.pageText = "";
    this.letterText.setText("");

    // continuar con lo que quedaba
    const rest = this.remainingText;
    const onDone = this.onPagedComplete;
    this.typewriterPaged(rest, onDone);
  }

  // ─────────────────────────────
  // TEXTO CON MARCADOR {{NAME}}
  // ─────────────────────────────
  typeUntilMarker(text, marker) {
    const i = text.indexOf(marker);

    if (i === -1) {
      return this.typewriterPaged(text, () => {
        this.closeButton.setVisible(true);
      });
    }

    this.before = text.slice(0, i);
    this.after = text.slice(i + marker.length);

    this.typewriterPaged(this.before, () => {
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

    // Añadir el nombre inmediatamente (sin efecto), y continuar paginado con el resto
    // Importante: lo metemos en la página actual si cabe; si no, forzamos "siguiente página".
    const candidate = (this.pageText ?? "") + name;

    if (this.fitsInTextArea(candidate)) {
      this.pageText = candidate;
      this.letterText.setText(this.pageText);
    } else {
      // si no cabe el nombre, mostramos prompt para pasar página
      this.isPaging = true;
      this.nextPrompt.setVisible(true);
      // guardamos el nombre para que sea lo primero de la siguiente página
      this.remainingText = name + (this.after ?? "");
      this.onPagedComplete = () => this.closeButton.setVisible(true);
      return;
    }

    // Continuar con el resto del texto después del nombre
    const rest = this.after ?? "";
    // Seguimos escribiendo pero sin borrar la página actual:
    // Truco: concatenamos el texto restante delante de remainingText, y seguimos el loop manualmente.
    // Para mantenerlo simple, reiniciamos el paginado con el contenido ya escrito + resto.
    const already = this.pageText;
    this.typewriterPaged(rest, () => {
      this.closeButton.setVisible(true);
    });

    // Restaurar lo ya escrito en la página como punto de partida
    // (typewriterPaged resetea pageText; lo ponemos y seguimos)
    this.pageText = already;
    this.letterText.setText(this.pageText);
  }
}