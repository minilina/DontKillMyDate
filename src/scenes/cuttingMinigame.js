import Phaser from 'phaser';
import GameState from '../state/GameState.js';

export default class CuttingMinigame extends Phaser.Scene {
    constructor() {
        super({ key: 'cuttingMinigame' });
    }

    init(data) {
        this.isTutorial = data.isTutorial || false;
        this.ingredientId = data.ingredient;
        this.cutsMade = 0;
        this.clicks = 0;
        this.sc = 3; 
    }

    create() {
        this.createAnimations();
        
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0).setDepth(9);
        this.add.image(0, 0, 'cuttingBg').setOrigin(0).setDepth(1).setScale(this.sc);

        this.createIngredient(141 * this.sc, 67 * this.sc);
        this.createBar(74 * this.sc, 132 * this.sc);
        this.createArrow(151 * this.sc);

        if (this.isTutorial) {
            this.runTutorialFlow();
        } else {
            this.startCountdownAndGame();
        }
    }

    // --- FLUJO PRINCIPAL ---

    runTutorialFlow() {
        // Mostramos el texto de instrucciones
        const instructions = this.add.text(
            this.scale.width / 2, 40, "¡Haz clic cuando la flecha esté en una zona oscura!",
            { fontFamily: "VT323, monospace", fontSize: '32px', color: '#ffffff', stroke: '#000000', strokeThickness: 5, align: 'center' }
        ).setOrigin(0.5).setDepth(100);

        // Esperamos 3 segundos y luego empezamos el minijuego con la cuenta atrás
        this.time.delayedCall(3000, () => {
            instructions.destroy();
            this.startCountdownAndGame();
        });
    }

    startCountdownAndGame() {
        const txt = this.add.text(this.scale.width / 2, this.scale.height / 2, '3', { fontFamily: "VT323, monospace", fontSize: '90px', color: '#f2e3d3' }).setOrigin(0.5).setDepth(10);
        this.time.delayedCall(1000, () => txt.setText('2'));
        this.time.delayedCall(2000, () => txt.setText('1'));
        this.time.delayedCall(3000, () => {
            txt.destroy();
            this.startGame();
        });
    }

    startGame() {
        // Reiniciamos contadores por si es una repetición del tutorial
        this.clicks = 0;
        this.cutsMade = 0;
        
        this.input.on('pointerdown', this.tryCut, this);

        this.tweens.add({
            targets: this.arrow,
            x: this.bar.x + this.bar.displayWidth - 14,
            duration: 2500, 
            onComplete: () => this.evaluateResult()
        });
    }

    // --- LÓGICA DEL JUEGO ---

    tryCut() {
        if (this.clicks >= 3) return; // No permitir más de 3 clics

        this.clicks++;
        const hitZone = this.zones.find(z => !z.isCut && z.getBounds().contains(this.arrow.x, z.y));

        if (hitZone) {
            // Acierto
            hitZone.isCut = true;
            this.cutsMade++;
            hitZone.setFillStyle(0x476237);
            this.playCutAnimation(hitZone);
        } else {
            // Fallo (solo penaliza si no es tutorial)
            if (!this.isTutorial) {
                this.cameras.main.flash(200, 102, 14, 14);
                GameState.reducePotionQuality(10);
            }
        }
    }

    evaluateResult() {
        this.input.off('pointerdown');
        this.tweens.killTweensOf(this.arrow);

        // Si es el tutorial, preguntamos si quiere repetir
        if (this.isTutorial) {
            this.showTutorialEndOptions();
        } else {
            // Si es juego normal, calculamos puntuación y salimos
            const unmadeCuts = 3 - this.cutsMade;
            if (unmadeCuts > 0) {
                GameState.reducePotionQuality(unmadeCuts * 10);
            }
            this.exitScene();
        }
    }

    // --- LÓGICA DEL TUTORIAL ---

    showTutorialEndOptions() {
        // Texto de felicitación
        this.add.text(this.scale.width / 2, 80, "¡Bien hecho!", { fontFamily: "VT323, monospace", fontSize: '40px', color: '#ffffff', stroke: '#000000', strokeThickness: 5 }).setOrigin(0.5).setDepth(100);

        // Botón "Reintentar"
        const retryButton = this.add.text(this.scale.width / 2, this.scale.height / 2 - 30, "Volver a intentar", { fontFamily: "VT323, monospace", fontSize: '28px', backgroundColor: '#4f342d', color: '#ffffff', padding: { x: 15, y: 8 } }).setOrigin(0.5).setInteractive().setDepth(100);
        
        retryButton.on('pointerdown', () => {
            // Reinicia la escena para volver a empezar el tutorial
            this.scene.restart({ isTutorial: true, ingredient: this.ingredientId });
        });

        // Botón "Continuar"
        const continueButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 30, "Continuar", { fontFamily: "VT323, monospace", fontSize: '28px', backgroundColor: '#4f342d', color: '#ffffff', padding: { x: 15, y: 8 } }).setOrigin(0.5).setInteractive().setDepth(100);

        continueButton.on('pointerdown', () => {
            // Avisamos a la cocina y salimos
            this.scene.get('kitchen').events.emit('minigame:tutorial:finished');
            this.exitScene();
        });
    }

    // --- FUNCIONES DE AYUDA Y VISUALES ---

    exitScene() {
        const cutsArray = this.zones.map(z => z.isCut);
        let kitchenScene = this.scene.get('kitchen');
        kitchenScene.returnFromMinigame(this.ingredientId, 'cut', cutsArray);
        this.scene.resume('kitchen');
        this.scene.stop();
    }
    
    playCutAnimation(hitZone) {
        const cutIndex = this.zones.indexOf(hitZone);
        const visualIngredientWidth = this.textures.getFrame(this.ingredientId).width * this.sc;
        const baseKnifeX = this.ingredientStartX + (visualIngredientWidth / 4) * (cutIndex + 1);
        const offset = this.ingredientPieces[cutIndex + 1].x - this.ingredientXBase;
        const finalKnifeX = baseKnifeX + offset;
        
        let anim = this.add.sprite(finalKnifeX, this.ingredientYBase, 'knife', 'cuchillo_anim-0').setScale(this.sc).setDepth(4);
        anim.play('cut').on('animationcomplete', () => anim.destroy());
        
        for (let p = cutIndex + 1; p < 4; p++) {
            this.ingredientPieces[p].x += (3 * this.sc); 
        }
    }

    createAnimations() {
        if (!this.anims.exists('cut')) {
            this.anims.create({ key: 'cut', frames: this.anims.generateFrameNames('knife', { prefix: 'cuchillo_anim-', start: 0, end: 10 }), frameRate: 50, repeat: 0 });
        }
    }

    createIngredient(x, y) {
        const tex = this.textures.getFrame(this.ingredientId);
        const pieceW = tex.width / 4;
        this.ingredientStartX = x - (tex.width * this.sc / 2);
        this.ingredientXBase = x;
        this.ingredientYBase = y;
        this.ingredientPieces = [];
        for (let i = 0; i < 4; i++) {
            let piece = this.add.sprite(x, y, this.ingredientId).setScale(this.sc).setDepth(2);
            piece.setCrop(i * pieceW, 0, pieceW, tex.height);
            this.ingredientPieces.push(piece);
        }
    }

    createBar(x, y) {
        this.bar = this.add.image(x, y, 'cuttingBar').setOrigin(0).setDepth(2).setScale(this.sc);
        const barW = this.bar.displayWidth;
        const barH = this.bar.displayHeight;
        const segmentW = (barW - (12 * this.sc)) / 3;
        const rectangleW = 15 * this.sc;
        this.zones = [];
        for (let i = 0; i < 3; i++) {
            let randomX = Phaser.Math.Snap.To(Phaser.Math.Between(this.bar.x + (6 * this.sc) + (i * segmentW) + (rectangleW / 2), this.bar.x + (6 * this.sc) + ((i + 1) * segmentW) - (rectangleW / 2)), 3 * this.sc);
            let zone = this.add.rectangle(randomX, this.bar.y + (barH / 2), rectangleW, barH - 18, 0x422c26).setDepth(3);
            zone.isCut = false;
            this.zones.push(zone);
        }
    }

    createArrow(y) {
        this.arrow = this.add.sprite(this.bar.x + 13, y, 'cutArrow').setScale(this.sc).setDepth(4).setOrigin(0.5, 0);
    }
}