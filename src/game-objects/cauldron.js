
export default class Cauldron {

    constructor(scene, cauldronSprite) {
        this.scene = scene;
        this.cauldronSprite = cauldronSprite;
        this.liquidSprite = this.scene.add.image(144 * 3, 96 * 3, 'redLiquid').setOrigin(0, 0).setScale(3).setVisible(false).setDepth(1);
        
        // requisitos poción
        this.currentPotion = {
            color: null,
            smell: null,
            taste: null,
            consistency: null,
            temperature: 0
        };

        if (!this.scene.anims.exists('heat')) {
            this.scene.anims.create({
                key: 'heat',
                frames: this.scene.anims.generateFrameNames('hotFire', { prefix: 'fuego_caliente-', start: 0, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
        }

        this.fire = this.scene.add.sprite(130 * 3, 115 * 3, 'hotFire')
            .setOrigin(0, 0)
            .setScale(3)
            .setVisible(false);

        this.cauldronSprite.on('pointerdown', () => {
            this.toggleFire();
        });
    }

    // activar/desactivar fuego
    toggleFire() {
        if (this.fire.visible) {
            this.fire.setVisible(false);
            this.fire.stop();
            this.scene.sound.stopByKey('fireSound');
        } else {
            this.fire.setVisible(true);
            this.fire.play('heat');
            this.scene.sound.play('fireSound', { volume: 0.5, loop: true });
        }
    }

    // añadir un ingrediente a la poción
    addIngredient(ingredientCategory, ingredientValue) {
        // ingredientCategory puede ser: 'color', 'smell', 'taste'...
        this.currentPotion[ingredientCategory] = ingredientValue;

        // cambiar color poción caldero
        if (ingredientCategory === 'color') {
            this.liquidSprite.setTexture(ingredientValue);
            this.liquidSprite.setVisible(true);
        }

        console.log('Ingredientes actuales dentro caldero:', this.currentPotion);
    }

    // resetear el caldero para el siguiente cliente
    resetCauldron() {
        this.currentPotion = {
            color: null,
            smell: null,
            taste: null,
            consistency: null,
            temperature: 0
        };
        
        this.liquidSprite.setVisible(false);
        
        if (this.fire.visible) {
            this.toggleFire();
        }
    }
}