import Phaser from 'phaser';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando WASD.
 */
export default class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player-idle');

        // Añadimos el jugador a la escena y le damos físicas
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds(true);

        // Al ser Top Down queremos que no tenga gravedad
        this.body.setAllowGravity(false);

        // Hacemos la caja de colisión más pequeña. Bloque físico de tus pies.
        this.body.setSize(12, 10);
        this.body.setOffset(10, 16);

        // Velocidad
        this.speed = 100;

        this.lastDirection = 'down';

        this.wasd = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // ANIMACIONES
        // "if" es para evitar crear las animaciones cada vez que se instancia el jugador (en cada escena). Solo se crean la primera vez."
        if (!this.scene.anims.exists('run-down')) {

            // ANIMACIONES RUN
            this.scene.anims.create({ key: 'run-down',  frames: this.scene.anims.generateFrameNumbers('player-run', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
            this.scene.anims.create({ key: 'run-up',    frames: this.scene.anims.generateFrameNumbers('player-run', { start: 8, end: 15 }), frameRate: 10, repeat: -1 });
            this.scene.anims.create({ key: 'run-right', frames: this.scene.anims.generateFrameNumbers('player-run', { start: 16, end: 23 }), frameRate: 10, repeat: -1 });

            // ANIMACIONES IDLE 
            this.scene.anims.create({ key: 'idle-down',  frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
            this.scene.anims.create({ key: 'idle-up',    frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 4, end: 7 }), frameRate: 6, repeat: -1 });
            this.scene.anims.create({ key: 'idle-right', frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 8, end: 11 }), frameRate: 6, repeat: -1 });
        }
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        // Reset de velocidad en cada frame para evitar deslizamientos
        this.body.setVelocity(0);
        let isMoving = false;

        // MOVIMIENTO HORIZONTAL
        if (this.wasd.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.setFlipX(true); 
            this.anims.play('run-right', true); 
            this.lastDirection = 'left';
            isMoving = true;
        } 
        else if (this.wasd.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.setFlipX(false); 
            this.anims.play('run-right', true);
            this.lastDirection = 'right';
            isMoving = true;
        }

        // MOVIMIENTO VERTICAL
        if (this.wasd.up.isDown) {
            this.body.setVelocityY(-this.speed);
            if (!this.wasd.left.isDown && !this.wasd.right.isDown) {
                this.setFlipX(false);
                this.anims.play('run-up', true);
                this.lastDirection = 'up';
            }
            isMoving = true;
        } 
        else if (this.wasd.down.isDown) {
            this.body.setVelocityY(this.speed);
            if (!this.wasd.left.isDown && !this.wasd.right.isDown) {
                this.setFlipX(false);
                this.anims.play('run-down', true);
                this.lastDirection = 'down';
            }
            isMoving = true;
        }

        // NORMALIZAR VELOCIDAD (IR SIEMPRE A LA MISMA VELOCIDAD AUNQUE ESTES EN DIAGONAL)
        if (this.body.velocity.length() > 0) {
            this.body.velocity.normalize().scale(this.speed);
        }

        // IDLE
        if (!isMoving) {
            if (this.lastDirection === 'left') {
                this.setFlipX(true);
                this.anims.play('idle-right', true); 
            } else if (this.lastDirection === 'right') {
                this.setFlipX(false);
                this.anims.play('idle-right', true);
            } else {
                this.setFlipX(false);
                this.anims.play('idle-' + this.lastDirection, true); 
            }
        }
    }
}