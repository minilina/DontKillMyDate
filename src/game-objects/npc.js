// npc.js
import Phaser from "phaser";

// Definimos la profundidad de cada capa 
const LAYER_DEPTH = {
  RASGO_DETRAS: 5,
  BASE: 25,
  BOCA: 26,
  NARIZ: 26,
  CEJAS: 27,
  OJOS: 28,
  ROPA: 29,
  PELO: 30,
  OREJAS: 31, 
  RASGO_FRENTE: 32,
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

    this.buildCharacter(scene, looks);

    this.setDepth(30);

    this.setScale(3);

    scene.add.existing(this);

    this.alpha = 0;
    scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 400,
      ease: "Linear",
    });
  }

  buildCharacter(scene, looks) {
    // 1. Añadimos el parámetro opcional partName
    const addPart = (textureKey, depth, partName = null) => {
      if (!textureKey) return;

      let sprite = scene.add.sprite(0, 0, textureKey);
      sprite.setOrigin(0.5, 1);
      sprite.setDepth(depth);

      this.add(sprite);

      // Si le ponemos un nombre, lo guarda en la clase
      if (partName) {
        this[partName] = sprite;
      }
    };

    addPart(looks.rasgoDetras, LAYER_DEPTH.RASGO_DETRAS);
    addPart(looks.base, LAYER_DEPTH.BASE);
    addPart(looks.ropa, LAYER_DEPTH.ROPA);

    // 2. Guardamos la BOCA y los OJOS
    addPart(looks.boca, LAYER_DEPTH.BOCA, "spriteBoca");
    addPart(looks.nariz, LAYER_DEPTH.NARIZ);
    addPart(looks.ojos, LAYER_DEPTH.OJOS, "spriteOjos");
    addPart(looks.cejas, LAYER_DEPTH.CEJAS);
    addPart(looks.pelo, LAYER_DEPTH.PELO);
    addPart(looks.orejas, LAYER_DEPTH.OREJAS);
    addPart(looks.rasgoFrente, LAYER_DEPTH.RASGO_FRENTE);
  }

  // 3. Método para cambiar la cara
  reaccionar(calidad) {
    if (calidad >= 70) {
      this.spriteOjos.setTexture("ojos_felices"); 
      this.spriteBoca.setTexture("boca_feliz");

        if (this.id === "gnomo") {
          this.scene.tweens.add({
            targets: this,
            y: this.scene.scale.height * 0.85,
            duration: 1000,
            ease: "Back.easeOut",
          });
          
      } else {
        this.scene.tweens.add({
          targets: this,
          y: this.y - 20,
          yoyo: true,
          duration: 250,
        });
      }
    } else if (calidad < 50) {
      this.spriteOjos.setTexture("ojos_enfadados"); 
      this.spriteBoca.setTexture("boca_enfadada");
      this.scene.tweens.add({
        targets: this,
        x: this.x + 10,
        yoyo: true,
        repeat: 3,
        duration: 50,
      });
    }
  }

  // 4. Salida con desvanecimiento
  leave(onComplete) {
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 400,
      onComplete: () => {
        this.destroy();
        if (onComplete) onComplete();
      },
    });
  }
}
