import Phaser from 'phaser';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando WASD.
 */
export default class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player-idle');

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.body.setCollideWorldBounds(true);
        this.body.setAllowGravity(false);

        this.body.setSize(12, 10);
        this.body.setOffset(10, 16);

        this.speed = 100;
        this.lastDirection = 'down';

        // 👉 NAVMESH
        this.navMesh = null;
        this.path = [];
        this.targetIndex = 0;
        this.isFollowingPath = false;

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
            this.scene.anims.create({ key: 'run-down', frames: this.scene.anims.generateFrameNumbers('player-run', { start: 0, end: 7 }), frameRate: 10, repeat: -1 });
            this.scene.anims.create({ key: 'run-up', frames: this.scene.anims.generateFrameNumbers('player-run', { start: 8, end: 15 }), frameRate: 10, repeat: -1 });
            this.scene.anims.create({ key: 'run-right', frames: this.scene.anims.generateFrameNumbers('player-run', { start: 16, end: 23 }), frameRate: 10, repeat: -1 });

            // ANIMACIONES IDLE 
            this.scene.anims.create({ key: 'idle-down', frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
            this.scene.anims.create({ key: 'idle-up', frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 4, end: 7 }), frameRate: 6, repeat: -1 });
            this.scene.anims.create({ key: 'idle-right', frames: this.scene.anims.generateFrameNumbers('player-idle', { start: 8, end: 11 }), frameRate: 6, repeat: -1 });
        }
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        // Reset de velocidad en cada frame para evitar deslizamientos
        this.body.setVelocity(0);
        let isMoving = false;


        //Deseactiva Navmesh si el jugador usa WASD para moverse manualmente, 
        // para que no haya conflictos entre ambos sistemas de movimiento
        if (this.wasd.left.isDown || this.wasd.right.isDown ||
            this.wasd.up.isDown || this.wasd.down.isDown) {
            this.isFollowingPath = false;

            // MOVIMIENTO CON TECLADO WASD

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


        }


        //Navmesh
        if (this.isFollowingPath && this.path.length > 0) {
            isMoving = true;

            const target = this.path[this.targetIndex];

            const dx = target.x - this.x;
            const dy = target.y - this.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 4) {
                this.targetIndex++;

                if (this.targetIndex >= this.path.length) {
                    this.isFollowingPath = false;
                    this.body.setVelocity(0);
                    return;
                }
            } else {
                const angle = Math.atan2(dy, dx);

                this.body.setVelocity(
                    Math.cos(angle) * this.speed,
                    Math.sin(angle) * this.speed
                );

                // Animaciones básicas
                if (Math.abs(dx) > Math.abs(dy)) {
                    this.anims.play('run-right', true);
                    this.setFlipX(dx < 0);
                    this.lastDirection = dx < 0 ? 'left' : 'right';
                } else {
                    if (dy > 0) {
                        this.anims.play('run-down', true);
                        this.lastDirection = 'down';
                    } else {
                        this.anims.play('run-up', true);
                        this.lastDirection = 'up';
                    }
                }
            }
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

    setNavmesh(navMesh) {
        this.navMesh = navMesh;
    }


    setPath(path) {
        this.path = path;
        this.targetIndex = 0;
        this.isFollowingPath = true;
    }
}