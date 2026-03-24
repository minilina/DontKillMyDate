// npc.js
import Phaser from "phaser";

// Definimos la profundidad de cada capa para que el pelo no quede bajo la cara
const LAYER_DEPTH = {
  RASGO_DETRAS: 5,
  BASE: 10,
  BOCA: 15,
  NARIZ: 16,
  OJOS: 20,
  PELO: 30,
  OREJAS: 35, // <--- NUEVA CAPA: Orejas (encima del pelo)
  RASGO_FRENTE: 40,
};

export default class NPC extends Phaser.GameObjects.Container {
  /**
   * @param {Phaser.Scene} scene - La escena actual (ej. PotionShopScene)
   * @param {number} x - Posición en X (Mitad de la pantalla)
   * @param {number} y - Posición en Y (Línea del mostrador verde)
   * @param {Object} looks - Objeto generado por NPCGenerator.generateLooks()
   * @param {Object} requirements - Las variables para ganar/perder
   */
  constructor(scene, x, y, looks, requirements) {
    super(scene, x, y);

    this.requirements = requirements;

    // 1. Construir las capas visuales
    this.buildCharacter(scene, looks);

    // 2. Escalar el personaje (Como cuerpo_1.png es pequeñito, lo hacemos x4)
    this.setScale(3);

    // 3. Añadirlo a la escena principal
    scene.add.existing(this);

    // 4. Animación de entrada suave
    this.alpha = 0;
    scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 400,
      ease: "Linear",
    });
  }

  buildCharacter(scene, looks) {
    // Función auxiliar para añadir cada capa sin repetir código
    const addPart = (textureKey, depth) => {
      if (!textureKey) return; // Si viene null (ej. calvo), no hacemos nada

      let sprite = scene.add.sprite(0, 0, textureKey);

      // ¡CLAVE! Anclamos la base de la imagen al (0,0) del contenedor
      sprite.setOrigin(0.5, 1);
      sprite.setDepth(depth);

      this.add(sprite); // Lo metemos dentro del contenedor NPC
    };

    // Montamos el "Paper Doll" en orden
    addPart(looks.rasgoDetras, LAYER_DEPTH.RASGO_DETRAS);
    addPart(looks.base, LAYER_DEPTH.BASE);
    addPart(looks.boca, LAYER_DEPTH.BOCA); 
    addPart(looks.nariz, LAYER_DEPTH.NARIZ);
    addPart(looks.ojos, LAYER_DEPTH.OJOS);
    addPart(looks.pelo, LAYER_DEPTH.PELO);
    addPart(looks.orejas, LAYER_DEPTH.OREJAS);
    addPart(looks.rasgoFrente, LAYER_DEPTH.RASGO_FRENTE);
  }

  /**
   * Anima al NPC para que desaparezca y luego se destruye
   */
  leave(onComplete) {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 400,
      ease: "Linear",
      onComplete: () => {
        this.destroy(); // Limpiamos la memoria
        if (onComplete) onComplete();
      },
    });
  }
}
