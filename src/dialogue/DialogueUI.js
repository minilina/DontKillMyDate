/**
 * UI del cuadro de diálogo clientes
 */
export default class DialogueUI {
  
  constructor(scene) {

    this.scene = scene;

    this.container = scene.add.container(0, 0).setDepth(1000);
    this.container.setVisible(false);

    this.dialog = scene.add.image(630, 185, "dialog").setScale(3).setInteractive();
    this.dialogArrow = scene.add.image(870, 260, "dialogArrow").setScale(3);

    // animacion flecha
    this.arrowTween = scene.tweens.add({
      targets: this.dialogArrow,
      y: 265, // mueve la flecha 5 píxeles hacia abajo
      duration: 600,
      ease: 'Power1.easeInOut',
      yoyo: true, // hace que vuelva a la posición original
      repeat: -1 // se repite indefinidamente
    });
    this.arrowTween.pause();

    // texto del dialogo
    this.text = scene.add.text(380, 105, "", {
      fontFamily: "VT323, monospace",
      fontSize: "23px", 
      color: "#000000",
      wordWrap: { width: 480 },
      align: "left"
    });

    this.container.add([this.dialog, this.dialogArrow, this.text]);

    // variables para gestionar el texto letra a letra
    this.fullText = ""; 
    this.isTyping = false; 
    this.typewriterTimer = null;
    this.arrowTimer = null;
  }

  // clics en cualquier parte de la pantalla para autocompletar o avanzar
  onContinue(handler) {
    this.scene.input.removeListener("pointerdown");
    
    this.scene.input.on("pointerdown", () => {
      if (!this.container.visible) return; // si el diálogo no está visible, no hace nada

      if (this.isTyping) {
        this.finishTyping(); // si está escribiendo, completa el texto
      } else {
        handler(); // si no, llama al handler para avanzar el diálogo
      }
    });
  }

  // muestra el dialogo por pantalla
  show() {
    this.container.setVisible(true);
  }

  // oculta todo, pausa la animacion y resetea la posicion de la flecha
  hide() {
    this.container.setVisible(false);
    this.arrowTween.pause();
    this.dialogArrow.y = 260;
  }

  // escribe el texto letra a letra y al terminar muestra la flecha
  setLine(text) {
    if (this.typewriterTimer) {
      this.typewriterTimer.remove();
    }

    if (this.arrowTimer) {
      this.arrowTimer.remove();
    }

    this.scene.input.setDefaultCursor('default');

    this.fullText = text ?? "";
    this.text.setText("");
    this.isTyping = true;

    this.dialogArrow.setVisible(false);
    this.arrowTween.pause();
    this.dialogArrow.y = 260;

    let index = 0;

    this.typewriterTimer = this.scene.time.addEvent({
      delay: 30, 
      repeat: this.fullText.length - 1,
      callback: () => {
        this.text.text += this.fullText[index];
        index++;
        
        if (index === this.fullText.length) {
          this.isTyping = false;

          this.arrowTimer = this.scene.time.delayedCall(300, () => {
            this.dialogArrow.setVisible(true); 
            this.arrowTween.play();
            this.scene.input.setDefaultCursor('pointer');
          });
        }
      }
    });
  }

  // para el timer y escribe todo el texto de golpe
  finishTyping() {
    if (this.typewriterTimer) {
      this.typewriterTimer.remove(); 
    }

    if (this.arrowTimer) {
      this.arrowTimer.remove();
    }

    this.text.setText(this.fullText); 
    this.isTyping = false;
    this.dialogArrow.setVisible(true);
    this.arrowTween.play();
    this.scene.input.setDefaultCursor('pointer');
  }
}