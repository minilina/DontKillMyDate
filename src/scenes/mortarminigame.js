import Phaser from 'phaser';

export default class MortarMinigame extends Phaser.Scene {

    constructor() {
        super({ key: 'mortarminigame' });
    }

    init(data) {
        this.parentScene = data.parentScene;
    }

    create() {
        // Fondo overlay
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7)
            .setOrigin(0);

        // Score
        this.score = 0;
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '32px',
            color: '#ffffff'
        });

        // Barra de tiempo
        this.totalTime = 10000;
        this.timeRemaining = this.totalTime;
        this.barWidth = 400;
        this.barHeight = 20;

        this.timeBarBackground = this.add.rectangle(
            this.scale.width / 2,
            40,
            this.barWidth,
            this.barHeight,
            0x555555
        ).setOrigin(0.5);

        this.timeBar = this.add.rectangle(
            this.scale.width / 2 - this.barWidth / 2,
            40,
            this.barWidth,
            this.barHeight,
            0x00ff00
        ).setOrigin(0, 0.5);

        this.gameActive = true;

        this.circles = [];

        // Timer de juego
        this.timerEvent = this.time.addEvent({
            delay: 1000 / 60,
            loop: true,
            callback: () => {
                if (!this.gameActive) return;
                this.timeRemaining -= 1000 / 60;
                this.updateTimeBar();
                if (this.timeRemaining <= 0) {
                    this.endGame(false);
                }
            }
        });

        // Intentar crear un círculo nuevo cada 0.5s
        this.time.addEvent({
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
        if (this.circles.length >= 6) return; // máximo 6 simultáneos

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

        if (overlaps) return; // no pudo colocarse sin superponer

        const circle = this.add.circle(x, y, radius, 0xff0000).setInteractive();
        this.circles.push(circle);

        const duration = Phaser.Math.Between(800, 1500);

        circle.on('pointerdown', () => {
            if (!this.gameActive) return;
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
            this.removeCircle(circle);
        });

        this.time.delayedCall(duration, () => {
            if (!this.gameActive) return;
            this.removeCircle(circle);
        });
    }

    removeCircle(circle) {
        const index = this.circles.indexOf(circle);
        if (index !== -1) this.circles.splice(index, 1);
        if (circle.active) circle.destroy();
    }

    endGame(success) {
        this.gameActive = false;

        this.circles.forEach(c => c.destroy());
        this.circles = [];

        this.children.list.forEach(child => {
            if (child.input) child.disableInteractive();
        });

        this.add.text(this.scale.width / 2, this.scale.height / 2,
            success ? 'SUCCESS' : 'FAIL', {
                fontSize: '40px',
                color: success ? 0x00ff00 : 0xff0000
            }).setOrigin(0.5);

        this.time.delayedCall(1000, () => {
            this.parentScene.returnFromMinigame(success);
            this.parentScene.scene.resume();
            this.scene.stop();
        });
    }
}