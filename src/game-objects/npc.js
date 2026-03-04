import Phaser from 'phaser';

/**
 * Clase que representa a un cliente/NPC en el juego.
 * @extends Phaser.GameObjects.Container
 */

/*
(ALBA) en este comentario se definen las profundiades de cada elemento del NPC para que se rendericen en el orden correcto. 
Para cuando termine de implementar la generación de NPC y las capas (ojos, pelo, ropa, etc.)

const LAYER_DEPTH = {
  BASE: 10,
  EYES: 20,
  HAIR: 30, .... más capas
};
*/
export default class NPC extends Phaser.GameObjects.Container {
    
    /**
     * Constructor del NPC
     * @param {Phaser.Scene} scene - La escena actual (tu Level)
     * @param {number} x - Posición en X
     * @param {number} y - Posición en Y
     * @param {string} spriteKey - El nombre de la imagen del personaje cargada en preload
     * @param {string} dialogText - El texto generado proceduralmente que el NPC dirá
     * @param {Object} requirements - Las variables lógicas (color, sabor, consistencia, raza)
     */
    constructor(scene, x, y, spriteKey, dialogText, requirements) {
        // Llamamos al constructor del contenedor padre
        super(scene, x, y);

        // 1. GUARDAMOS LOS REQUISITOS 
        // { sabor: 'picante', color: 'rojo', consistencia: 'molido', raza: 'elfos' }
        this.requirements = requirements;

        // 2. CREAMOS EL SPRITE DEL PERSONAJE
        this.sprite = scene.add.sprite(0, 0, spriteKey);
        

        this.add(this.sprite); // Añadimos el sprite al contenedor

        //PARA CUANDO QUITE EL PLACEHOLDER (ALBA)
        //this.setScale(3); // Ajusta el tamaño del NPC según tu sprite 

        scene.add.existing(this); // Añadimos el contenedor a la escena
    }
}


/* Extra
 // Entrada suave
    this.alpha = 0;
    scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 300,
      ease: "Linear",
    });
  }

  leave(onComplete) {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 300,
      ease: "Linear",
      onComplete: () => {
        this.destroy();
        if (onComplete) onComplete();
      },
    });
  }
    */





        /*

        // 3. CREAMOS EL BOCADILLO DE DIÁLOGO
        // Lo colocamos por encima de la cabeza del sprite (ej. y: -80)
        this.dialogText = scene.add.text(0, -80, dialogText, {
            fontFamily: 'Arial', // Puedes cambiarlo por una fuente pixel-art si tienes
            fontSize: '16px',
            color: '#000000',
            backgroundColor: '#ffffff',
            padding: { x: 10, y: 10 },
            align: 'center',
            wordWrap: { width: 200 } // Importante: hace que el texto baje de línea si es muy largo
        }).setOrigin(0.5, 1); // El ancla está abajo en el centro para que crezca hacia arriba

        // (Opcional) Podemos añadirle un pequeño borde al texto usando setStroke
        this.dialogText.setStroke('#000000', 2);

        // 4. AÑADIR TODO AL CONTENEDOR
        this.add([this.sprite, this.dialogText]);

        // 5. AÑADIR EL CONTENEDOR A LA ESCENA
        scene.add.existing(this);

        // 6. ANIMACIÓN DE ENTRADA (Fade in)
        this.alpha = 0;
        // Hacemos que "aparezca" suavemente
        scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 500, // Medio segundo
            ease: 'Linear'
        });
    }
/*
   
      Método para hacer que el NPC se vaya cuando ha sido atendido
     
    leave() {
        // Animación de salida (Fade out)
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                // Destruimos el objeto para liberar memoria una vez que desaparece
                this.destroy(); 
            }
        });
    }
}

*/