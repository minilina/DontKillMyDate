import Phaser from 'phaser';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando WASD.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'player');

        // Añadimos el jugador a la escena y le damos físicas
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds(true);

        // Al ser Top Down queremos que no tenga gravedad
        this.body.setAllowGravity(false);

        // Hacemos la caja de colisión más pequeña. Bloque físico de tus pies.
        this.body.setSize(14, 12);
        this.body.setOffset(0, 7);
        // Velocidad
        this.speed = 100;
        this.body.setVelocity(0);

        this.lastDirection = 'down';

        // CONFIGURACIÓN DE TECLAS CURSORES (FLECHAS)
        /*
        this.wasd = this.scene.input.keyboard.createCursorKeys();
        */

        // CONFIGURACIÓN DE TECLAS WASD

        this.wasd = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // --- IDLE ANIMATIONS ---
        // Cambiamos repeat a -1 para que no se detengan nunca
        this.scene.anims.create({
            key: 'idler',
            frames: this.scene.anims.generateFrameNames('player', { prefix: 'idler', start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        // Nota: idlel usa idler + flipX, está bien así.
        this.scene.anims.create({
            key: 'idlel',
            frames: this.scene.anims.generateFrameNames('player', { prefix: 'idler', start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'idleu',
            frames: this.scene.anims.generateFrameNames('player', { prefix: 'idleu', start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'idled',
            frames: this.scene.anims.generateFrameNames('player', { prefix: 'idled', start: 1, end: 4 }),
            frameRate: 10,
            repeat: -1
        });

        // --- run ANIMATIONS ---
        this.scene.anims.create({
            key: 'runr',
            frames: this.scene.anims.generateFrameNames('player', { prefix: 'runr', start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        // Nota: runl usa runr + flipX, está bien así.
        this.scene.anims.create({
            key: 'runl',
            frames: this.scene.anims.generateFrameNames('player', { prefix: 'runr', start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'runu',
            frames: this.scene.anims.generateFrameNames('player', { prefix: 'runu', start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'rund',
            frames: this.scene.anims.generateFrameNames('player', { prefix: 'rund', start: 1, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.play('idled');
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        let newAnim = '';

        // Reset de velocidad en cada frame para evitar deslizamientos
        this.body.setVelocity(0);

        // --- LÓGICA DE MOVIMIENTO ---
        if (this.wasd.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.setFlipX(true);
            this.lastDirection = 'left';
            newAnim = 'runr';
        } else if (this.wasd.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.setFlipX(false);
            this.lastDirection = 'right';
            newAnim = 'runr';
        } else if (this.wasd.up.isDown) {
            this.body.setVelocityY(-this.speed);
            this.lastDirection = 'up';
            newAnim = 'runu';
        } else if (this.wasd.down.isDown) {
            this.body.setVelocityY(this.speed);
            this.lastDirection = 'down';
            newAnim = 'rund';
        } else {
            // --- IDLE ---
            switch (this.lastDirection) {
                case 'left': this.setFlipX(true); newAnim = 'idler'; break;
                case 'right': this.setFlipX(false); newAnim = 'idler'; break;
                case 'up': newAnim = 'idleu'; break;
                case 'down': newAnim = 'idled'; break;
            }
        }

        // --- CAMBIO DE ANIMACIÓN ---
        // 'true' como segundo parámetro ya evita que la animación se reinicie si es la misma
        if (newAnim !== '') {
            this.anims.play(newAnim, true);
        }
    }
}


/*


super.preUpdate(t, dt);

this.body.setVelocity(0);

let moving = false;

// --- MOVIMIENTO SOLO 4 DIRECCIONES ---
if (this.wasd.left.isDown) {

    this.body.setVelocityX(-this.speed);
    this.setFlipX(true);
    this.anims.play('runr', true);
    this.lastDirection = 'left';
    moving = true;

} else if (this.wasd.right.isDown) {

    this.body.setVelocityX(this.speed);
    this.setFlipX(false);
    this.anims.play('runr', true);
    this.lastDirection = 'right';
    moving = true;

} else if (this.wasd.up.isDown) {

    this.body.setVelocityY(-this.speed);
    this.setFlipX(false);
    this.anims.play('runu', true);
    this.lastDirection = 'up';
    moving = true;

} else if (this.wasd.down.isDown) {

    this.body.setVelocityY(this.speed);
    this.setFlipX(false);
    this.anims.play('rund', true);
    this.lastDirection = 'down';
    moving = true;
}

// --- IDLE ---
if (!moving) {

    switch (this.lastDirection) {

        case 'left':
            this.setFlipX(true);
            this.anims.play('idler', true);
            break;

        case 'right':
            this.setFlipX(false);
            this.anims.play('idler', true);
            break;

        case 'up':
            this.setFlipX(false);
            this.anims.play('idleu', true);
            break;

        case 'down':
            this.setFlipX(false);
            this.anims.play('idled', true);
            break;
    }
}
    
}
}
*/