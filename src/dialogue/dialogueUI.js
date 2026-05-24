/**
 * UI del cuadro de diálogo clientes
 */
export default class DialogueUI {
  constructor(scene,topDown = false) {
    this.scene = scene;
    this.topDown = topDown;
    this.container = scene.add.container(0, 0).setDepth(1000);
    this.container.setVisible(false);

    this.dialog = scene.add
      .image(630, 185, "dialog")
      .setScale(3)
      .setInteractive();
    this.dialogArrow = scene.add.image(870, 260, "dialogArrow").setScale(3);

    // animacion flecha
    this.arrowTween = scene.tweens.add({
      targets: this.dialogArrow,
      y: 265,
      duration: 600,
      ease: "Power1.easeInOut",
      yoyo: true,
      repeat: -1,
    });
    this.arrowTween.pause();

   
    this.nameBg = scene.add.graphics();
    this.nameText = scene.add.text(380, 70, "", {
      // Lo subimos de 60 a 40
      fontFamily: "VT323, monospace",
      fontSize: "23px", // Mismo tamaño exacto que el diálogo
      color: "#f9ce2a",
    });

    // Ocultos por defecto
    this.nameBg.setVisible(false);
    this.nameText.setVisible(false);

    this.currentTextObjects = [];

    // Añadimos TODO al contenedor general (el fondo va ANTES que el texto para que quede detrás)
    this.container.add([
      this.dialog,
      this.dialogArrow,
      this.nameBg,
      this.nameText,
    ]);

    // variables de máquina de escribir
    this.isTyping = false;
    this.typewriterTimer = null;
    this.arrowTimer = null;
  }

  // --- NUEVO: Función mejorada para poner el nombre con bordes redondeados ---
  setName(name) {
    if (name) {
      this.nameText.setText(name);

      // Limpiamos el gráfico anterior y lo preparamos para dibujar el nuevo tamaño
      this.nameBg.clear();
      this.nameBg.fillStyle(0x623100, 1); // Color marrón oscuro

      // Márgenes (padding)
      const paddingX = 12;
      const paddingY = 6;

      // Calculamos la posición y el tamaño de la caja de fondo
      const bgX = this.nameText.x - paddingX;
      const bgY = this.nameText.y - paddingY;
      const bgWidth = this.nameText.width + paddingX * 2;
      const bgHeight = this.nameText.height + paddingY * 2;
      const radius = 10; // Nivel de "redondeo" de las esquinas

      // Dibujamos el rectángulo redondeado
      this.nameBg.fillRoundedRect(bgX, bgY, bgWidth, bgHeight, radius);

      this.nameBg.setVisible(true);
      this.nameText.setVisible(true);
    } else {
      this.nameBg.setVisible(false);
      this.nameText.setVisible(false);
    }
  }

  onContinue(handler) {
    this.scene.input.off("pointerdown");
    this.scene.input.keyboard?.off("keydown-ENTER");

    const advanceOrFinish = () => {
      if (!this.container.visible) return;

      this.scene.sound.play("buttonSound", { volume: 0.5 });
      if (this.isTyping) {
        this.finishTyping();
      } else {
        handler?.();
      }
    };

    this.scene.input.on("pointerdown", advanceOrFinish);

    this.scene.input.keyboard.on("keydown-ENTER", (event) => {
      const ae = document.activeElement?.tagName?.toLowerCase();
      if (ae === "input" || ae === "textarea") return;
      event?.preventDefault?.();
      advanceOrFinish();
    });
  }

  show() {
    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
    this.arrowTween.pause();
    this.dialogArrow.y = 260;
  }

  setLine(text) {
    if (this.typewriterTimer) this.typewriterTimer.remove();
    if (this.arrowTimer) this.arrowTimer.remove();

    this.scene.input.setDefaultCursor("default");
    this.isTyping = true;
    this.dialogArrow.setVisible(false);
    this.arrowTween.pause();
    this.dialogArrow.y = 260;

    // Limpiamos la línea anterior
    if (this.currentTextObjects) {
      this.currentTextObjects.forEach((t) => t.obj.destroy());
    }
    this.currentTextObjects = [];

    // Parseamos los asteriscos
    let chars = [];
    let highlighting = false;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === "*") {
        highlighting = !highlighting;
        continue;
      }
      chars.push({ char: text[i], highlight: highlighting });
    }

    // Agrupamos en palabras para simular el wordWrap
    let words = [];
    let currentWord = [];
    for (let i = 0; i < chars.length; i++) {
      currentWord.push(chars[i]);
      if (chars[i].char === " " || i === chars.length - 1) {
        words.push(currentWord);
        currentWord = [];
      }
    }

    let cx = 380; // Margen izquierdo
    let cy = 105; // Margen superior
    const maxWrapWidth = 380 + 480;

    // Texto invisible solo para medir
    let tempText = this.scene.add.text(0, 0, "", {
      fontFamily: "VT323, monospace",
      fontSize: "23px",
    });

    words.forEach((wordObjArray) => {
      let wordString = wordObjArray.map((c) => c.char).join("");
      tempText.setText(wordString);

      // Comprobamos salto de línea
      if (cx + tempText.width > maxWrapWidth && wordString !== " ") {
        cx = 380;
        cy += 25; // Salto de Y
      }

      // Agrupamos letras con el mismo estilo
      let segments = [];
      if (wordObjArray.length > 0) {
        let currentSeg = { text: "", highlight: wordObjArray[0].highlight };
        wordObjArray.forEach((c) => {
          if (c.highlight === currentSeg.highlight) {
            currentSeg.text += c.char;
          } else {
            segments.push(currentSeg);
            currentSeg = { text: c.char, highlight: c.highlight };
          }
        });
        segments.push(currentSeg);

        segments.forEach((seg) => {
          let styleConfig = {
            fontFamily: "VT323, monospace",
            fontSize: "23px",
            color: seg.highlight ? "#f9ce2a" : "#000000", // amarillo si es pista, negro si es normal
          };

          if (seg.highlight) {
            styleConfig.stroke = "#623100";
            styleConfig.strokeThickness = 6;
          }

          let t = this.scene.add.text(cx, cy, "", styleConfig);

          this.container.add(t);
          this.currentTextObjects.push({
            obj: t,
            highlight: seg.highlight,
            fullText: seg.text,
          });

          tempText.setStyle(styleConfig);
          tempText.setText(seg.text);
          cx += tempText.width;
        });
      }
    });
    tempText.destroy();

    // Sistema de máquina de escribir adaptado a múltiples objetos
    let currentSegIndex = 0;
    let currentCharIndex = 0;

    this.typewriterTimer = this.scene.time.addEvent({
      delay: 30,
      repeat: chars.length - 1,
      callback: () => {
        if (currentSegIndex >= this.currentTextObjects.length) return;

        let seg = this.currentTextObjects[currentSegIndex];
        seg.obj.text += seg.fullText[currentCharIndex];
        currentCharIndex++;

        if (currentCharIndex >= seg.fullText.length) {
          // Animación suave de levitación cuando termina de escribir la pista
          if (seg.highlight) {
            this.scene.tweens.add({
              targets: seg.obj,
              y: seg.obj.y - 3,
              yoyo: true,
              repeat: -1,
              duration: 400,
            });
          }
          currentSegIndex++;
          currentCharIndex = 0;
        }

        if (currentSegIndex >= this.currentTextObjects.length) {
          this.finishTypingAction();
        }
      },
    });
  }

  finishTypingAction() {
    this.isTyping = false;
    this.dialogArrow.setVisible(true);
    this.arrowTween.play();
    this.scene.input.setDefaultCursor("pointer");
  }

  finishTyping() {
    if (this.typewriterTimer) this.typewriterTimer.remove();
    if (this.arrowTimer) this.arrowTimer.remove();

    // Revelar todo el texto de golpe
    this.currentTextObjects.forEach((seg) => {
      if (seg.obj.text !== seg.fullText) {
        seg.obj.setText(seg.fullText);
        if (seg.highlight) {
          this.scene.tweens.add({
            targets: seg.obj,
            y: seg.obj.y - 3,
            yoyo: true,
            repeat: -1,
            duration: 400,
          });
        }
      }
    });

    this.finishTypingAction();
  }
  setPosition(x, y) {
    this.container.setPosition(x, y);


  }

}