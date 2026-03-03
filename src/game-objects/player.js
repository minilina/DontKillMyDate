import Phaser from 'phaser';

/**
 * Clase que representa el jugador del juego. El jugador se mueve por el mundo usando WASD.
 */
export default class Player extends Phaser.GameObjects.Sprite { // TODO HECHO POR IA, TODO CAMBIAR

    constructor(scene, x, y) {
        super(scene, x, y, 'player'); // Asegúrate de tener cargada la imagen 'player'
        
        // Añadimos el jugador a la escena y le damos físicas
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        // Queremos que el jugador no se salga de los límites del mundo
        this.body.setCollideWorldBounds(true);

        //Al ser Top Down queremos que no tenga gravedad
        this.body.setAllowGravity(false);

        // --- AQUÍ ESTÁ EL ARREGLO ---
        // 1. Hacemos la caja de colisión más pequeña (ej: 12 de ancho, 14 de alto)
        this.body.setSize(12, 12); 
        
        // 2. Centramos la caja (si tu sprite original es de 16x16, para que una caja de 12 
        // quede en el medio, la movemos 2 píxeles a la derecha y 4 hacia abajo para los pies)
        this.body.setOffset(2, 4); 
        // -----------------------------
        
        // Velocidad
        this.speed = 150; 
        
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

        // --- ARREGLO DEL DESLIZAMIENTO ---
        // Solo normalizamos si la velocidad es mayor que 0
        if (this.body.velocity.length() > 0) {
            this.body.velocity.normalize().scale(this.speed);
        }
    }
}