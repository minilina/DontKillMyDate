import Phaser from 'phaser';

export default class Cauldron {

    constructor(scene, cauldronSprite) {
        this.scene = scene;
        this.cauldronSprite = cauldronSprite;
        this.liquidSprite = this.scene.add.image(140 * 3, 96 * 3, 'redLiquid').setOrigin(0, 0).setScale(3).setVisible(false);

        // requisitos poción
        this.currentPotion = {
            color: null,
            smell: [],
            taste: [],
            consistency: [],
            temperature: 'cold'
        };

        // animación fuego
        if (!this.scene.anims.exists('heat')) {
            this.scene.anims.create({
                key: 'heat',
                frames: this.scene.anims.generateFrameNames('hotFire', { prefix: 'fuego_caliente-', start: 0, end: 7 }),
                frameRate: 8,
                repeat: -1
            });
        }

        this.fire = this.scene.add.sprite(126 * 3, 115 * 3, 'hotFire').setOrigin(0, 0).setScale(3).setVisible(false);

        // barra de temperatura
        this.borderOffset = 3;
        this.heatBar = this.scene.add.image(133 * 3, 151 * 3, 'heatBar').setOrigin(0, 0).setScale(3).setVisible(false);
        this.heatArrow = this.scene.add.image((133 * 3) + this.borderOffset, (151 * 3) + 18, 'heatArrow').setOrigin(0.5, 0).setScale(3).setVisible(false);
        this.temperatureValue = 0;

        this.scene.events.on('update', this.updateTemperature, this);
        /*
                this.cauldronSprite.on('pointerdown', () => {
        
                    this.toggleFire();
                });
        */
        /*
        this.cauldronSprite.on('pointerdown', () => {
            if (!this.scene.isDraggingItem) {
                this.scene.events.emit('cauldron:tryheat'); 
            }
        });
        */

        this.scene.events.on('pause', () => {
            if (this.fire.visible) {
                this.scene.sound.pauseAll(); // Pausamos los sonidos para que no suene el fuego de fondo
            }
        }, this);

        this.scene.events.on('resume', () => {
            if (this.fire.visible) {
                this.scene.sound.resumeAll(); // Reanudamos los sonidos
            }
        }, this);
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
            this.scene.sound.play('fireSound', { volume: 1.5, loop: true });

            // mostrar barra de temperatura al encender el fuego
            this.heatBar.setVisible(true);
            this.heatArrow.setVisible(true);
        }
    }

    // actualizar movimiento de la flecha y temperatura
    updateTemperature(time, delta) {
        // solo calienta si el fuego está encendido y no ha llegado al máximo (100)
        if (this.fire.visible && this.temperatureValue < 100) {

            // la temperatura incrementa con el tiempo
            this.temperatureValue += 0.005 * delta;
            this.temperatureValue = Phaser.Math.Clamp(this.temperatureValue, 0, 100); // para evitar que supere 100

            const innerWidth = this.heatBar.displayWidth - (this.borderOffset * 2);

            // mover flecha proporcionalmente al valor de temperatura
            this.heatArrow.x = this.heatBar.x + this.borderOffset + (innerWidth * (this.temperatureValue / 100));

            if (this.temperatureValue < 33.3) {
                this.currentPotion.temperature = 'cold';
            } else if (this.temperatureValue < 66.6) {
                this.currentPotion.temperature = 'warm';
            } else {
                this.currentPotion.temperature = 'hot';
            }
        }
    }

    // añadir un ingrediente a la poción
    addIngredient(ingredientCategory, ingredientValue) {
        // si la categoría es una LISTA (olor, sabor, consistencia)
        if (Array.isArray(this.currentPotion[ingredientCategory])) {
            this.currentPotion[ingredientCategory].push(ingredientValue);
        }
        // si es un VALOR ÚNICO (color, temperatura)
        else {
            this.currentPotion[ingredientCategory] = ingredientValue;

            // cambiar color poción caldero
            if (ingredientCategory === 'color') {
                this.liquidSprite.setTexture(ingredientValue);
                this.liquidSprite.setVisible(true);
            }
        }

        console.log('Ingredientes actuales dentro caldero:', JSON.stringify(this.currentPotion, null, 2));
    }

    // resetear el caldero para el siguiente cliente
    resetCauldron() {
        this.currentPotion = {
            color: null,
            smell: [],
            taste: [],
            consistency: [],
            temperature: 'cold'
        };

        this.liquidSprite.setVisible(false);

        this.heatBar.setVisible(false);
        this.heatArrow.setVisible(false);
        this.temperatureValue = 0;
        this.heatArrow.x = this.heatBar.x + this.borderOffset;

        this.fire.setVisible(false);
        this.fire.stop();
        if (this.scene.sound.get('fireSound')) {
            this.scene.sound.stopByKey('fireSound');
        }

        if (this.fire.visible) {
            this.toggleFire();
        }
    }
}