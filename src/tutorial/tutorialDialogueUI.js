import DialogueUI from "../dialogue/dialogueUI.js";

export default class TutorialDialogueUI extends DialogueUI {
    constructor(scene) {
        super(scene);

        // Cambiamos el fondo
        if (this.dialog) {
            this.dialog.setTexture("dialog2");
        }

        // Escala que ya tenías
        this.container.setScale(0.9);
    }

    /**
     * Sobreescribimos setLine para ajustar las coordenadas al nuevo PNG
     */
    setLine(text) {
        const tamañoFuente = "24px";

        if (this.typewriterTimer) this.typewriterTimer.remove();
        if (this.arrowTimer) this.arrowTimer.remove();

        this.scene.input.setDefaultCursor("default");
        this.isTyping = true;
        this.dialogArrow.setVisible(false);
        this.arrowTween.pause();

        this.dialogArrow.x = 760;
        this.dialogArrow.y = 260;

        if (this.currentTextObjects) {
            this.currentTextObjects.forEach((t) => t.obj.destroy());
        }
        this.currentTextObjects = [];

        // --- AJUSTE DE COORDENADAS PARA DIALOG2 ---
        // Cambia estos números hasta que el texto esté centrado en tu nuevo cuadro
        let cx = 500; // Margen izquierdo (Original: 380)
        let cy = 115; // Margen superior (Original: 105)
        const maxWrapWidth = cx + 260; // Ancho máximo antes de saltar de línea
        // ------------------------------------------

        let chars = [];
        let highlighting = false;
        for (let i = 0; i < text.length; i++) {
            if (text[i] === "*") {
                highlighting = !highlighting;
                continue;
            }
            chars.push({ char: text[i], highlight: highlighting });
        }

        let words = [];
        let currentWord = [];
        for (let i = 0; i < chars.length; i++) {
            currentWord.push(chars[i]);
            if (chars[i].char === " " || i === chars.length - 1) {
                words.push(currentWord);
                currentWord = [];
            }
        }

        let tempText = this.scene.add.text(0, 0, "", {
            fontFamily: "VT323, monospace",
            fontSize: tamañoFuente,
        });

        words.forEach((wordObjArray) => {
            let wordString = wordObjArray.map((c) => c.char).join("");
            tempText.setText(wordString);

            if (cx + tempText.width > maxWrapWidth && wordString !== " ") {
                cx = 500;
                cy += 25;
            }

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
                        fontSize: tamañoFuente,
                        color: seg.highlight ? "#f9ce2a" : "#000000",
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

        // Lógica de máquina de escribir
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

    moveTo(x, y) {
        this.scene.tweens.add({
            targets: this.container,
            x: x,
            y: y,
            duration: 400,
            ease: 'Power2.easeOut'
        });
    }
}