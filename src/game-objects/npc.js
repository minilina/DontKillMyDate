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
   * @param {Object} npcData - Datos extra del JSON para NPCs especiales
   */
  constructor(scene, x, y, looks, requirements, npcData = null) {
    super(scene, x, y);

    this.requirements = requirements;
    this.npcData = npcData; // Guardamos el cerebro de datos del personaje

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
      onComplete: () => {
        // --- ESCUDO DE SEGURIDAD Y ALETEOS CONSTANTES ---
        if (this.npcData && this.npcData.animacionConstante) {
          const config = this.npcData.animacionConstante;
          const targetSprite = this[config.target];

          if (targetSprite) {
            scene.tweens.add({
              targets: targetSprite,
              ...config.tween,
            });
          }
        }
      },
    });
  }

  buildCharacter(scene, looks) {
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

    // Le ponemos un nombre identificativo genérico a esta capa
    addPart(looks.rasgoDetras, LAYER_DEPTH.RASGO_DETRAS, "rasgoDetrasSprite");

    addPart(looks.base, LAYER_DEPTH.BASE);
    addPart(looks.ropa, LAYER_DEPTH.ROPA);

    // Guardamos la BOCA y los OJOS
    addPart(looks.boca, LAYER_DEPTH.BOCA, "spriteBoca");
    addPart(looks.nariz, LAYER_DEPTH.NARIZ);
    addPart(looks.ojos, LAYER_DEPTH.OJOS, "spriteOjos");
    addPart(looks.cejas, LAYER_DEPTH.CEJAS);
    addPart(looks.pelo, LAYER_DEPTH.PELO);
    addPart(looks.orejas, LAYER_DEPTH.OREJAS);
    addPart(looks.rasgoFrente, LAYER_DEPTH.RASGO_FRENTE);
  }

  // Método para cambiar la cara
  reaccionar(calidad) {
    if (calidad >= 70) {
      this.spriteOjos.setTexture("ojos_felices");
      this.spriteBoca.setTexture("boca_feliz");

      // --- DISEÑO BASADO EN DATOS: Animación de Éxito ---
      if (this.npcData && this.npcData.animacionExito) {
        // Ejecutamos cambios en la animación constante (ej. alas rápidas)
        if (this.npcData.animacionExito.modificarConstante) {
          const modConfig = this.npcData.animacionExito.modificarConstante;
          const targetSprite = this[modConfig.target];

          if (targetSprite) {
            this.scene.tweens.killTweensOf(targetSprite);
            this.scene.tweens.add({
              targets: targetSprite,
              ...modConfig.tween,
            });
          }
        }

        // Filtramos las propiedades puras del tween físico para el contenedor entero
        let tweenProps = { ...this.npcData.animacionExito };
        delete tweenProps.modificarConstante;
        delete tweenProps.resetDepth;

        // Si existen instrucciones de movimiento físico (como el salto del gnomo)
        if (Object.keys(tweenProps).length > 0) {
          let tweenConfig = {
            targets: this,
            ...tweenProps,
          };

          if (this.npcData.animacionExito.resetDepth) {
            tweenConfig.onComplete = () => {
              this.setDepth(30);
            };
          }
          this.scene.tweens.add(tweenConfig);
        }

        this.scene.sound.play("successSound");
      } else {
        // Animación normal (saltito) si no es un cliente especial
        this.scene.tweens.add({
          targets: this,
          y: this.y - 20,
          yoyo: true,
          duration: 250,
        });
        this.scene.sound.play("successSound");
      }
    } else {
      // --- NUEVO: Si NO tiene éxito (neutral o fallo), le borramos la animación de salida especial ---
      // De esta forma, cuando se ejecute leave(), usará el desvanecimiento normal.
      if (this.npcData && this.npcData.animacionSalida) {
        delete this.npcData.animacionSalida;
      }

      if (calidad < 50) {
        this.spriteOjos.setTexture("ojos_enfadados");
        this.spriteBoca.setTexture("boca_enfadada");
        this.scene.tweens.add({
          targets: this,
          x: this.x + 10,
          yoyo: true,
          repeat: 3,
          duration: 50,
        });
        this.scene.sound.play("errorSound");
      }
    }
  }

  // Salida con desvanecimiento o animación personalizada
  leave(onComplete) {
    // Comprobamos si mantiene una animación de salida especial dictada por el JSON
    if (this.npcData && this.npcData.animacionSalida) {
      this.scene.tweens.add({
        targets: this,
        ...this.npcData.animacionSalida,
        onComplete: () => {
          this.destroy();
          if (onComplete) onComplete();
        },
      });
    } else {
      // Salida estándar (desvanecimiento) para todos los demás (o especiales que fallaron)
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
}