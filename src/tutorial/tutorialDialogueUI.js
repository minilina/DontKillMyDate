// src/dialogue/tutorialDialogueUI.js
import DialogueUI from "../dialogue/dialogueUI.js";
export default class TutorialDialogueUI extends DialogueUI {
    constructor(scene) {
        super(scene);

        // Hacemos el cuadro más pequeño (ajusta el 1.5 o 2 según necesites)
        this.container.setScale(0.7);

        // Cambiamos el origen del contenedor para que sea más fácil 
        // posicionarlo cerca de objetos (opcional, según cómo sea tu asset)
        // this.container.setPivot(x, y);
    }

    /**
     * Mueve el cuadro de diálogo a una posición específica con una pequeña transición
     */
    moveTo(x, y) {
        this.scene.tweens.add({
            targets: this.container,
            x: x,
            y: y,
            duration: 400,
            ease: 'Power2.easeOut'
        });
    }

    // Si necesitas cambiar el fondo por uno más pequeño específicamente:
    // show() {
    //    super.show();
    //    this.dialog.setTexture('dialog_small');
    // }
}