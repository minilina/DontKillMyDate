import letterData from "../dialogue/letter_intro.json";
import pergamino from '../../assets/sprites/pergamino.png';

export default class LetterScene extends Phaser.Scene {

  constructor() {
    super("LetterScene");
  }

  preload() {
this.load.image('letter', pergamino);}

  create() {

    // Fondo carta
    this.add.image(400, 300, "letter");

    this.letterText = this.add.text(220, 140, "", {
      fontSize: "20px",
      color: "#1a1a1a",
      wordWrap: { width: 360 },
      lineSpacing: 8
    });

    // UI nombre (empieza OCULTO)
    this.nameInput = this.add.dom(400, 500, "input", {
      fontSize: "24px",
      padding: "10px"
    }).setVisible(false);
    this.nameInput.node.placeholder = "Escribe tu nombre";

    this.confirmText = this.add.text(400, 550, "Confirmar", {
      fontSize: "24px",
      color: "#000"
    }).setOrigin(0.5).setInteractive().setVisible(false);

    this.confirmText.on("pointerdown", () => this.onConfirmName());

    // Botón cerrar (oculto)
    this.closeButton = this.add.text(400, 520, "Cerrar carta", {
      fontSize: "26px",
      backgroundColor: "#ffffff",
      color: "#000",
      padding: { x: 15, y: 8 }
    }).setOrigin(0.5).setInteractive().setVisible(false);

    this.closeButton.on("pointerdown", () => this.scene.start("level"));

    // Texto completo con marcador
    this.fullText = letterData.text; // Debe incluir {{NAME}}
    this.marker = "{{NAME}}";

    // Empieza escribiendo nada más entrar
    this.typeUntilMarker(this.fullText, this.marker);
  }

  typeUntilMarker(text, marker) {
    const markerIndex = text.indexOf(marker);

    if (markerIndex === -1) {
      // Si no hay marcador, escribe todo y muestra cerrar
      return this.typewriterEffect(text, () => this.closeButton.setVisible(true));
    }

    this.before = text.slice(0, markerIndex);
    this.after = text.slice(markerIndex + marker.length);

    this.typewriterEffect(this.before, () => {
      // Al llegar al marcador, pedir nombre
      this.nameInput.setVisible(true);
      this.confirmText.setVisible(true);
      this.nameInput.node.focus();
    });
  }

  onConfirmName() {
    const playerName = this.nameInput.node.value?.trim() || "Jugador";

    this.nameInput.setVisible(false);
    this.confirmText.setVisible(false);

    // Escribe el nombre de golpe (o también con typewriter si quieres)
    this.letterText.text += playerName;

    // Continúa con el resto
    this.typewriterEffect(this.after, () => {
      this.closeButton.setVisible(true);
    });
  }

  typewriterEffect(text, onComplete) {
    let index = 0;

    this.time.addEvent({
      delay: 40,
      repeat: text.length - 1,
      callback: () => {
        this.letterText.text += text[index];
        index++;

        if (index === text.length && onComplete) onComplete();
      }
    });
  }

  startLetter() {

    const playerName = this.nameInput.node.value || "Jugador";

    this.nameInput.setVisible(false);
    this.confirmText.setVisible(false);

    const finalText = letterData.text.replace("{playerName}", playerName);

    this.typewriterEffect(finalText);
  }

  closeLetter() {

    // transición a la siguiente escena
    this.scene.start("level");

  }

}