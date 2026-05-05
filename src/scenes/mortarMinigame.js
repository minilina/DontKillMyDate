import Phaser from 'phaser';
import GameState from '../state/GameState.js';

export default class MortarMinigame extends Phaser.Scene {

    constructor() {
        super({ key: 'mortarMinigame' });
    }

    init(data) {
        this.isTutorial = data.isTutorial || false;
        this.ingredientId = data.ingredient; 
        this.score = 0;
        this.misses = 0;
        this.totalTime = 6000;
        this.timeRemaining = this.totalTime;
        this.gameActive = false;
        this.circles = [];
        this.sc = 3; // escala
    }

    create() {
        // fondo oscuro y mesa con mortero
        this.bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0).setDepth(0).setInteractive();
        this.add.image(0, 0, 'mortarBg').setOrigin(0).setDepth(1).setScale(this.sc);

        this.bg.on('pointerdown', () => {
            if (this.gameActive) this.registerMiss();
        });


        this.ingredientSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2, this.ingredientId)
            .setScale(this.sc)
            .setDepth(1); 

        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontFamily: "VT323, monospace",
            fontSize: '30px',
            color: '#ffffff'
        }).setDepth(1);

        // Barra de tiempo
        this.barWidth = 20;
        this.barHeight = 400;
        const barX = this.scale.width - 74; 
        const barY = this.scale.height / 2;

        this.timeBarBackground = this.add.rectangle(
            barX,
            barY,
            this.barWidth,
            this.barHeight,
            0x555555
        ).setOrigin(0.5, 0.5).setDepth(1);

        this.timeBar = this.add.rectangle(
            barX,
            barY + (this.barHeight / 2), 
            this.barWidth,
            this.barHeight,
            0x00ff00
        ).setOrigin(0.5, 1).setDepth(1);


        if (this.isTutorial) this.runTutorialFlow();
        else this.startCountdown();
    }

    startCountdown() {
        const txt = this.add.text(this.scale.width / 2, this.scale.height / 2, '3', {
            fontFamily: "VT323, monospace",
            fontSize: '90px',
            color: '#f2e3d3'
        }).setOrigin(0.5).setDepth(10);

        this.time.delayedCall(1000, () => txt.setText('2'));
        this.time.delayedCall(2000, () => txt.setText('1'));
        this.time.delayedCall(3000, () => { txt.destroy(); this.startGame(); });
    }

    startGame() {
        this.gameActive = true;

        this.timerEvent = this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callback: () => {
                if (!this.gameActive) return;
                this.timeRemaining -= 1000 / 60;
                this.updateTimeBar();
                if (this.timeRemaining <= 0) this.evaluateGame();
            }
        });

        this.spawnEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () => this.spawnCircle()
        });
    }

    updateTimeBar() {
        const ratio = Phaser.Math.Clamp(this.timeRemaining / this.totalTime, 0, 1);
        
        this.timeBar.scaleY = ratio;
        if (ratio > 0.5) this.timeBar.fillColor = 0x00ff00;
        else if (ratio > 0.25) this.timeBar.fillColor = 0xffff00;
        else this.timeBar.fillColor = 0xff0000;

    }

    spawnCircle() {
        if (!this.gameActive) return;
        if (this.timeRemaining <= 500) return;
        if (this.circles.length >= 6) return;

        const radius = 40;
        const padding = 10;
        let x, y, tries = 0, overlaps;

        do {
            x = Phaser.Math.Between(radius + padding, this.scale.width - radius - padding);
            y = Phaser.Math.Between(radius + padding, this.scale.height - radius - padding);

            overlaps = this.circles.some(c => {
                const dx = c.sprite.x - x;
                const dy = c.sprite.y - y;
                return Math.sqrt(dx*dx + dy*dy) < radius*2 + padding;
            });

            tries++;
        } while (overlaps && tries < 20);

        if (overlaps) return;

        const circle = this.add.circle(x, y, radius, 0xffffff, 0.3)
        .setScale(1.3)
        .setDepth(2)
        .setInteractive({ useHandCursor: true });
        const back = this.add.sprite(x, y, this.ingredientId)
            .setScale(1.6)
            .setDepth(3);

        const circleObj = { sprite: circle, back: back };
        this.circles.push(circleObj);

        const duration = Phaser.Math.Between(1000, 1500);
        let clicked = false;

        circle.on('pointerdown', () => {
            if (!this.gameActive) return;
            clicked = true;
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
            this.sound.play('mortarSound', { volume: 1 });
            this.removeCircle(circleObj);
        });

        this.time.delayedCall(duration, () => {
            if (!this.gameActive) return;
            if (!clicked) this.registerMiss();
            this.removeCircle(circleObj);
        });
    }

    removeCircle(circleObj) {
        if (!circleObj) return;

        const index = this.circles.indexOf(circleObj);
        if (index !== -1) this.circles.splice(index, 1);

        if (circleObj.sprite?.active) circleObj.sprite.destroy();
        if (circleObj.back?.active) circleObj.back.destroy();
    }

    registerMiss() {
    if (!this.gameActive) return;
    
    this.misses++;

    // Flash rojo
    this.cameras.main.flash(200, 102, 14, 14); 

    // ❗ Penalización de score
    this.score = Math.max(0, this.score - 1);
    this.scoreText.setText('Score: ' + this.score);

    // Penalización de la poción (solo fuera del tutorial)
    if (!this.isTutorial) {
        GameState.reducePotionQuality(1); 
    }
}

    evaluateGame() {
        if (!this.gameActive) return;
        this.gameActive = false;

        if (this.timerEvent) this.timerEvent.remove(false);
        if (this.spawnEvent) this.spawnEvent.remove(false);

        this.circles.forEach(c => this.removeCircle(c));
        this.circles = [];

        if (this.isTutorial) {
            this.showTutorialEndOptions();
        } else {
            // Un pequeño delay visual antes de salir
            this.time.delayedCall(1000, () => {
                this.exitScene();
            });
        }
    }


    // ---------------------------
    // Tutorial
    // ---------------------------

    runTutorialFlow() {
        // Mostramos el texto de instrucciones
        const instructions = this.add.text(
            this.scale.width / 2, this.scale.height / 2 + 100, "¡Haz clic en los círculos antes de que desaparezcan!",
            { fontFamily: "VT323, monospace", fontSize: '32px', color: '#ffffff', stroke: '#000000', strokeThickness: 5, align: 'center' }
        ).setOrigin(0.5).setDepth(100);

        // Esperamos 3 segundos y luego empezamos el minijuego con la cuenta atrás
        this.time.delayedCall(2000, () => {
            instructions.destroy();
            this.startCountdown();
        });
    }

    showTutorialEndOptions() {
        const { width, height } = this.scale;

        const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.6)
            .setOrigin(0)
            .setDepth(99)
            .setInteractive(); // captura input y evita clicks "a través"

        const panelW = Math.min(420, width - 40);
        const panelH = 240;

        const panel = this.add.rectangle(width / 2, height / 2, panelW, panelH, 0x2b1b16, 0.95)
            .setDepth(100);

        const border = this.add.rectangle(width / 2, height / 2, panelW + 8, panelH + 8, 0xf2e3d3, 1)
            .setDepth(99.5);

        const title = this.add.text(width / 2, height / 2 - 80, "¡Bien hecho!", {
            fontFamily: "VT323, monospace",
            fontSize: "44px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(101);

        // Botones
        const btnStyle = {
            fontFamily: "VT323, monospace",
            fontSize: "30px",
            backgroundColor: "#4f342d",
            color: "#ffffff",
            padding: { x: 18, y: 10 }
        };

        const retryButton = this.add.text(width / 2, height / 2 + 10, "Volver a intentar", btnStyle)
            .setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(101);

        const continueButton = this.add.text(width / 2, height / 2 + 70, "Continuar", btnStyle)
            .setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(101);

        const popup = this.add.container(0, 0, [overlay, border, panel, title, retryButton, continueButton])
            .setDepth(200);

        popup.setScale(0.9);
        popup.setAlpha(0);
        this.tweens.add({ targets: popup, scale: 1, alpha: 1, duration: 140, ease: 'Sine.Out' });

        const closePopup = () => {
            popup.destroy(true);
        };

        retryButton.on('pointerdown', () => {
            closePopup();
            this.scene.restart({ isTutorial: true, ingredient: this.ingredientId });
        });

        continueButton.on('pointerdown', () => {
            closePopup();
            this.scene.get('kitchen').events.emit('minigame:tutorial:finished');
            this.exitScene();
        });
    }

    // --- FUNCIONES DE AYUDA Y VISUALES ---

    exitScene() {
        let kitchenScene = this.scene.get('kitchen');
        
        // Enviamos la puntuación obtenida a la cocina
        kitchenScene.returnFromMinigame(this.ingredientId, 'mortar');
        
        this.scene.resume('kitchen');
        this.scene.stop();
    }
}