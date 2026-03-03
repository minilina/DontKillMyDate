import Phaser from 'phaser';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando WASD.
 */
export default class Player extends Phaser.GameObjects.Sprite { // TODO CAMBIAR

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
        this.body.setSize(10, 12);
        this.body.setOffset(3, 7);
        
        // Velocidad
        this.speed = 120; 
        
        // CONFIGURACIÓN DE TECLAS WASD
        this.wasd = this.scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    /**
     * Métodos preUpdate de Phaser. Se encarga del movimiento del jugador.
     * @override
     */
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        this.body.setVelocity(0);

        if (this.wasd.left.isDown) {
            this.body.setVelocityX(-this.speed);
        } else if (this.wasd.right.isDown) {
            this.body.setVelocityX(this.speed);
        }

        if (this.wasd.up.isDown) {
            this.body.setVelocityY(-this.speed);
        } else if (this.wasd.down.isDown) {
            this.body.setVelocityY(this.speed);
        }
    }
}