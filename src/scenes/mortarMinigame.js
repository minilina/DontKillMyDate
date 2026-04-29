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
        this.totalTime = 10000;
        this.timeRemaining = this.totalTime;
        this.gameActive = false;
        this.circles = [];
    }

    create() {
        // Fondo overlay
        this.bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7)
            .setOrigin(0)
            .setDepth(0)
            .setInteractive(); // <-- AÑADIDO: Ahora captura clics

        // --- AÑADIDO: Si haces clic en el fondo, cuenta como fallo ---
        this.bg.on('pointerdown', () => {
            if (this.gameActive) {
                this.registerMiss();
            }
        });

        // Score
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontFamily: "VT323, monospace",
            fontSize: '32px',
            color: '#ffffff'
        }).setDepth(1);

        // Barra de tiempo
        this.barWidth = 400;
        this.barHeight = 20;

        this.timeBarBackground = this.add.rectangle(
            this.scale.width / 2,
            40,
            this.barWidth,
            this.barHeight,
            0x555555
        ).setOrigin(0.5).setDepth(1);

        this.timeBar = this.add.rectangle(
            this.scale.width / 2 - this.barWidth / 2,
            40,
            this.barWidth,
            this.barHeight,
            0x00ff00
        ).setOrigin(0, 0.5).setDepth(1);

        if (this.isTutorial) {
            this.runTutorialFlow();
        } else {
            // Empezar minijuego con cuenta atrás
            this.startCountdown();
        }
    }

    // Cuenta atrás antes de empezar el minijuego
    startCountdown() {
        const txt = this.add.text(this.scale.width / 2, this.scale.height / 2, '3', {
            fontFamily: "VT323, monospace",
            fontSize: '90px',
            color: '#f2e3d3'
        }).setOrigin(0.5).setDepth(10);

        this.time.delayedCall(1000, () => txt.setText('2'));
        this.time.delayedCall(2000, () => txt.setText('1'));
        this.time.delayedCall(3000, () => {
            txt.destroy();
            this.startGame(); // Cuando acaba, empieza el juego real
        });
    }

    // Activar input y mecánicas para empezar el minijuego
    startGame() {
        this.gameActive = true;

        // Timer de juego
        this.timerEvent = this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callback: () => {
                if (!this.gameActive) {
                    this.timerEvent.remove();
                    return;
                }
                this.timeRemaining -= 1000 / 60;
                this.updateTimeBar();
                if (this.timeRemaining <= 0) {
                    this.evaluateGame();
                }
            }
        });

        // Intentar crear un círculo nuevo cada 0.5s
        this.spawnEvent = this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => this.spawnCircle()
        });
    }

    updateTimeBar() {
        const ratio = Phaser.Math.Clamp(this.timeRemaining / this.totalTime, 0, 1);
        this.timeBar.width = this.barWidth * ratio;
        if (ratio > 0.5) this.timeBar.fillColor = 0x00ff00;
        else if (ratio > 0.25) this.timeBar.fillColor = 0xffff00;
        else this.timeBar.fillColor = 0xff0000;
    }

    spawnCircle() {
        if (!this.gameActive) return;
        
        // --- AÑADIDO: Si quedan 3 segundos (3000 ms) o menos, ya no salen más círculos ---
        if (this.timeRemaining <= 1000) return; 

        if (this.circles.length >= 6) return; // Máximo 6 simultáneos

        const radius = 40;
        const padding = 10;
        let x, y, tries = 0;
        let overlaps;

        do {
            x = Phaser.Math.Between(radius + padding, this.scale.width - radius - padding);
            y = Phaser.Math.Between(radius + padding, this.scale.height - radius - padding);

            overlaps = this.circles.some(c => {
                const dx = c.x - x;
                const dy = c.y - y;
                return Math.sqrt(dx*dx + dy*dy) < radius*2 + padding;
            });

            tries++;
        } while (overlaps && tries < 20);

        if (overlaps) return; // No pudo colocarse sin superponer

        const circle = this.add.circle(x, y, radius, 0xff0000).setInteractive().setDepth(2);
        this.circles.push(circle);

        // Los círculos ahora duran entre 1.5s y 2.5s
        const duration = Phaser.Math.Between(1500, 2500);
        let clicked = false;

        // Al hacer clic
        circle.on('pointerdown', () => {
            if (!this.gameActive) return;
            clicked = true;
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
            this.removeCircle(circle);
        });

        // Al acabarse el tiempo de vida del círculo
        this.time.delayedCall(duration, () => {
            if (!this.gameActive) return;
            if (!clicked) {
                // FALLO: El círculo desapareció sin que el jugador lo pulsara
                this.registerMiss();
            }
            this.removeCircle(circle);
        });
    }

    removeCircle(circle) {
        if (!circle) return;
        const index = this.circles.indexOf(circle);
        if (index !== -1) this.circles.splice(index, 1);
        if (circle.active) circle.destroy();
    }

    registerMiss() {
        if (!this.gameActive) return;
        
        this.misses++;
        // Flash rojo en la pantalla
        this.cameras.main.flash(200, 102, 14, 14); 
        
        // Penalización (solo si no es el tutorial)
        if (!this.isTutorial) {
            GameState.reducePotionQuality(2); 
        }
    }

    // Terminar minijuego
    evaluateGame() {
        if (!this.gameActive) return;
        this.gameActive = false;

        if (this.timerEvent) this.timerEvent.remove(false);
        if (this.spawnEvent) this.spawnEvent.remove(false);

        this.circles.forEach(c => c.destroy());
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
        kitchenScene.returnFromMinigame(this.ingredientId, 'mortar', this.score);
        
        this.scene.resume('kitchen');
        this.scene.stop();
    }
}