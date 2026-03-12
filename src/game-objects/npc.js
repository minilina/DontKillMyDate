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
        this.sprite = scene.add.sprite(0, 0, spriteKey).setScale(3);
        

        this.add(this.sprite); // Añadimos el sprite al contenedor

        //PARA CUANDO QUITE EL PLACEHOLDER (ALBA)
        //this.setScale(3); // Ajusta el tamaño del NPC según tu sprite 

        scene.add.existing(this); // Añadimos el contenedor a la escena
    }
}


