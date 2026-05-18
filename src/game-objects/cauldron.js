import Phaser from 'phaser';

export default class Cauldron {

    constructor(scene, cauldronSprite) {
        this.scene = scene;
        this.cauldronSprite = cauldronSprite;
        this.hasLiquid = true;
        this.liquidSprite = this.scene.add.image(140 * 3, 96 * 3, 'noColorLiquid').setOrigin(0, 0).setScale(3).setVisible(true).setDepth(4);

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

        // animaciones cara fuego
        if (!this.scene.anims.exists('fireEyesBlink')) {
            this.scene.anims.create({ 
                key: 'fireEyesBlink', 
                frames: [
                    { key: 'fireEyes', frame: 'ojos-0' }, 
                    { key: 'fireEyes', frame: 'ojos-1' }, 
                    { key: 'fireEyes', frame: 'ojos-2' }, 
                    { key: 'fireEyes', frame: 'ojos-1' }, 
                    { key: 'fireEyes', frame: 'ojos-0' }],
                    frameRate: 8, repeat: 0 });
        }

        if (!this.scene.anims.exists('fireEyesTalk')) {
            this.scene.anims.create({ 
                key: 'fireEyesTalk', 
                frames: [
                    { key: 'fireEyes', frame: 'ojos-0' }, 
                    { key: 'fireEyes', frame: 'ojos-5' }, 
                    { key: 'fireEyes', frame: 'ojos-6' }, 
                    { key: 'fireEyes', frame: 'ojos-5' }], 
                    frameRate: 5, repeat: -1 });
        }

        this.generalPhrases = [
            "¡Avisame si hay beso, que desde aquí abajo no veo!",
            "¡Oye, que yo también necesito mis descansos para el café!",
            "¡Y decían que la hostelería mágica era un sector relajado...!",
            "¡Se me están chamuscando hasta las pestañas!"
        ];

        this.hotPhrases = [
            "¡Estoy hot!",
            "¡Oye, que a este paso derrito hasta el caldero!",
            "¡Ni el aliento de un dragón tiene tanta intensidad!",
            "¡Uf, a este cliente le vas a quemar el corazón!",
            "¡Con este calorazo, o se enamoran o se achicharran!",
            "¡Que alguien me traiga un abanico o me extingo!"
        ];

        // estado sistema cara fuego
        this.blinkTimer = null;
        this.midHeatingTimer = null;
        this.hasTriggeredHotScene = false;
        this.isHotSceneActive = false; 
        this.hasSpokenThisSession = false;

        // inicialización sprites fuego
        this.fire = this.scene.add.sprite(126 * 3, 113 * 3, 'hotFire').setOrigin(0, 0).setScale(3).setVisible(false).setDepth(4);
        this.fireEyes = this.scene.add.sprite((148 * 3), (137 * 3), 'fireEyes', 'ojos-0').setOrigin(0, 0).setScale(3).setVisible(false).setDepth(5);

        const bubbleX = (188 * 3);
        const bubbleY = (90 * 3);

        this.speechBubble = this.scene.add.nineslice(
            bubbleX,
            bubbleY,
            'speechBubble', 
            0, 
            100, 50, 
            7, 6, 6, 7
        ).setOrigin(0, 1).setScale(3).setVisible(false).setDepth(205);

        this.speechText = this.scene.add.text(
            bubbleX + 24,
            bubbleY - 32,
            '',
            {
                fontFamily: 'VT323, monospace', 
                fontSize: '22px', 
                color: '#000000', 
                align: 'left',
                wordWrap: { width: 200 }
            }
        ).setOrigin(0, 1).setVisible(false).setDepth(206);
        
        this.fireEyes.on('animationcomplete', (anim) => {
            if (anim.key === 'fireEyesBlink' && !this.isHotSceneActive) {
                this.fireEyes.setFrame('ojos-0');
            }
        });

        // barra de temperatura
        this.borderOffset = 3;
        this.heatBar = this.scene.add.image(133 * 3, 155 * 3, 'heatBar').setOrigin(0, 0).setScale(3).setVisible(false);
        this.heatArrow = this.scene.add.image((133 * 3) + this.borderOffset, (155 * 3) + 18, 'heatArrow').setOrigin(0.5, 0).setScale(3).setVisible(false);
        this.temperatureValue = 0;

        this.scene.events.on('update', this.updateTemperature, this);

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
            this.deactivateFaceSystem();

        } else {
            this.fire.setVisible(true);
            this.fire.play('heat');
            this.scene.sound.play('fireSound', { volume: 1.5, loop: true });

            // mostrar barra de temperatura al encender el fuego
            this.heatBar.setVisible(true);
            this.heatArrow.setVisible(true);

            // activar sistema de cara del fuego
            this.fireEyes.setVisible(true);
            this.fireEyes.setFrame('ojos-0');
            this.startBlinkLoop();
            this.triggerMidHeatingDialogue();
        }
    }

    // actualizar movimiento de la flecha y temperatura
    updateTemperature(time, delta) {
        
        // si el fuego ya no existe porque hemos cambiado de escena, cortamos la función aquí
        if (!this.fire || !this.fireEyes || !this.fireEyes.active) return;

        if (this.fire.visible && this.temperatureValue < 100) {
            this.temperatureValue += 0.005 * delta;
        } else if (!this.fire.visible && this.temperatureValue > 0) {
            this.temperatureValue -= 0.005 * delta;
        }

        this.temperatureValue = Phaser.Math.Clamp(this.temperatureValue, 0, 100); 

        const innerWidth = this.heatBar.displayWidth - (this.borderOffset * 2);

        // mover flecha proporcionalmente al valor de temperatura
        this.heatArrow.x = this.heatBar.x + this.borderOffset + (innerWidth * (this.temperatureValue / 100));

        if (this.temperatureValue < 33.3) {
            this.currentPotion.temperature = 'cold';
            if (!this.fireEyes.anims?.isPlaying && !this.isHotSceneActive && this.fireEyes.frame.name !== 'ojos-3') this.fireEyes.setFrame('ojos-0');
        } else if (this.temperatureValue < 66.6) {
            this.currentPotion.temperature = 'warm';
            if (!this.fireEyes.anims?.isPlaying && !this.isHotSceneActive && this.fireEyes.frame.name !== 'ojos-3') this.fireEyes.setFrame('ojos-0');
        } else {
            this.currentPotion.temperature = 'hot';
            if (this.temperatureValue === 100 && !this.hasTriggeredHotScene && this.fire.visible) {
                this.triggerHotScene();
            } else if (!this.isHotSceneActive) { 
                const isTalking = this.fireEyes.anims?.currentAnim?.key === 'fireEyesTalk';
                if (!this.fireEyes.anims?.isPlaying && !isTalking && this.fireEyes.frame.name !== 'ojos-0') {
                    this.fireEyes.setFrame('ojos-0');
                }
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

        this.hasLiquid = true;
        this.liquidSprite.setTexture('noColorLiquid');
        this.liquidSprite.setVisible(true);

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

        this.deactivateFaceSystem();
    }

    // desactivar sistema de cara del fuego
    deactivateFaceSystem() {
        this.fireEyes.setVisible(false);
        this.fireEyes.stop();
        this.hideSpeech();
        this.hasSpokenThisSession = false;
        this.hasTriggeredHotScene = false;
        this.isHotSceneActive = false;
        
        if (this.blinkTimer) { this.blinkTimer.remove(); this.blinkTimer = null; }
        if (this.midHeatingTimer) { this.midHeatingTimer.remove(); this.midHeatingTimer = null; }
    }

    // iniciar bucle de parpadeo
    startBlinkLoop() {
        if (this.blinkTimer) this.blinkTimer.remove();
        this.blinkTimer = this.scene.time.addEvent({
            delay: 4000, 
            callback: () => {
                // si el temporizador salta justo cuando salimos de la cocina, no hace nada
                if (!this.fireEyes || !this.fireEyes.active) return;

                if (this.fire.visible && !this.isHotSceneActive && !this.fireEyes.anims?.isPlaying) {
                    this.fireEyes.play('fireEyesBlink');
                }
                if (this.fire.visible) this.startBlinkLoop();
            }
        });
    }

    // mostrar texto de diálogo
    showSpeech(textPhrase) {
        this.scene.tweens.killTweensOf([this.speechBubble, this.speechText]);

        this.speechText.setText(textPhrase);
        this.speechBubble.width = (this.speechText.width / 3) + 15; 
        this.speechBubble.height = (this.speechText.height / 3) + 15;
        
        const bubbleY = (90 * 3);
        
        this.speechBubble.y = bubbleY + 15;
        this.speechText.y = bubbleY - 24 + 15;

        this.speechBubble.setAlpha(0);
        this.speechText.setAlpha(0);

        this.speechBubble.setVisible(true);
        this.speechText.setVisible(true);

        this.scene.tweens.add({
            targets: [this.speechBubble, this.speechText],
            y: '-=15',
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Sine.easeOut'
        });
    }

    hideSpeech() {
        this.scene.tweens.killTweensOf([this.speechBubble, this.speechText]);
        this.speechBubble.setVisible(false);
        this.speechText.setVisible(false);
    }

    // diálogo sorpresa a mitad de calentamiento
    triggerMidHeatingDialogue() {
        if (Phaser.Math.Between(0, 1) === 0) return;
        
        this.midHeatingTimer = this.scene.time.delayedCall(Phaser.Math.Between(3000, 7000), () => {
            // si sigue encendido, no está al máximo y no ha hablado ya en este turno
            if (this.fire.visible && this.currentPotion.temperature !== 'hot' && !this.hasSpokenThisSession && !this.isHotSceneActive) {

                if (this.blinkTimer) this.blinkTimer.remove();

                this.hasSpokenThisSession = true; 
                this.fireEyes.play('fireEyesTalk');
                
                this.showSpeech(Phaser.Math.RND.pick(this.generalPhrases));

                this.scene.time.delayedCall(4000, () => {
                    this.hideSpeech();
                    // comprobamos por si se apagó el fuego mientras hablaba
                    if (this.fire.visible && this.currentPotion.temperature !== 'hot') {
                        this.finishTalkingWithSmile(false);
                    }
                });
            }
        });
    }

    // ojos sorpresa al alcanzar temperatura "hot"
    triggerHotScene() {
        this.hasTriggeredHotScene = true;
        this.isHotSceneActive = true; 
        
        if (this.blinkTimer) this.blinkTimer.remove();
        this.hideSpeech();

        // se sorprende
        this.fireEyes.stop();
        this.fireEyes.setFrame('ojos-4');

        this.scene.time.delayedCall(2500, () => {
            // por si el jugador apaga el fuego justo en el susto
            if (!this.fire.visible) return this.deactivateFaceSystem(); 
                
            // si no ha hablado antes, dice una frase
            if (!this.hasSpokenThisSession) {
                this.hasSpokenThisSession = true;
                this.fireEyes.play('fireEyesTalk');
                
                this.showSpeech(Phaser.Math.RND.pick(this.hotPhrases));

                this.scene.time.delayedCall(4000, () => {
                    this.hideSpeech();
                    this.finishTalkingWithSmile(true); 
                });
            } else {
                // si ya habló, vuelve a la normalidad
                this.fireEyes.setFrame('ojos-0');
                this.isHotSceneActive = false;
                this.fireEyes.play('fireEyesBlink');
                this.startBlinkLoop(); 
            }
        });
    }

    // finalizar diálogo con sonrisa
    finishTalkingWithSmile(isHotScene) {
        // si se apagó el fuego no hacemos nada
        if (!this.fire.visible) return;

        this.fireEyes.stop();
        this.fireEyes.setFrame('ojos-3');

        this.scene.time.delayedCall(2000, () => {
            // vuelve a la normalidad
            if (this.fire.visible) {
                this.fireEyes.setFrame('ojos-0');
                if (isHotScene) this.isHotSceneActive = false; 
                this.fireEyes.play('fireEyesBlink');
                this.startBlinkLoop(); 
            } else {
                if (isHotScene) this.isHotSceneActive = false;
            }
        });
    }
}