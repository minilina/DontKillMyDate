import Phaser from 'phaser';
import background from '../../assets/sprites/background.png';
import clouds from '../../assets/sprites/nubes.png';
import button from '../../assets/sprites/button.png';
import logo from '../../assets/sprites/logo.png';

export default class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        this.load.image('background', background);
        this.load.image('clouds', clouds);
        this.load.image('button', button);
        this.load.image('logo', logo);
    }

    create() {
        // Fondo
        this.add.image(0, 0, 'background')
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);



        // Nubes con repetición y escala
        this.clouds = this.add.tileSprite(
            0,              // x
            50,             // y (altura inicial para que no esté pegada al borde)
            this.scale.width,  // ancho del tileSprite
            200,            // alto del tileSprite (ajusta según tus nubes)
            'clouds'        // key de la textura
        )
            .setOrigin(0, 0)
            .setScale(2);      // escala para hacerlas más grandes sin deformarlas

        // Logo
        this.add.image(this.scale.width / 2, this.scale.height / 2.5, 'logo');
        // Botón
        const boton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 100, 'button')
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5).setScale(3);

        // Texto "Start game"
        const botonTexto = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 97,
            'JUGAR',
            {
                fontFamily: 'VT323, monospace',
                fontSize: '25px',
                fill: '#ffffff'
            }
        ).setOrigin(0.5);

        // Animación hover
        boton.on('pointerover', () => {
            boton.setScale(2.9);
            botonTexto.setColor('#ffcc00'); // color en hover
        });

        boton.on('pointerout', () => {
            boton.setScale(3);
            botonTexto.setColor('#ffffff'); // color normal
        });

        // Click → iniciar Boot
        boton.on('pointerdown', () => {
            this.scene.start('Boot');
        });
    }

    update() {
        this.clouds.tilePositionX += 0.3; // movimiento nubes
    }
}