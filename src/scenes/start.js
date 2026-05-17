import Phaser from 'phaser';
import background from '../../assets/sprites/background.png';
import clouds from '../../assets/sprites/nubes.png';
import button from '../../assets/sprites/button.png';
import logo from '../../assets/sprites/logo.png';
import startMusic from '../../assets/sound/startmusic.mp3';
import buttonSound from '../../assets/sound/button.mp3';

export default class Start extends Phaser.Scene {
    constructor() {
        super({ key: 'Start' });
    }

    preload() {
        this.load.image('background', background);
        this.load.image('clouds', clouds);
        this.load.image('button', button);
        this.load.image('logo', logo);
        this.load.audio('startMusic', startMusic);
        this.load.audio('buttonSound', buttonSound);
    }

    create() {
        // Fondo
        this.game.bgMusic = this.sound.add('startMusic', {
            loop: true,
            volume: 0.4
        });

        this.game.bgMusic.play();

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

        // --- SISTEMA DE GUARDADO ---
        const savedData = localStorage.getItem('potionGameSave');
        let newGameBtnY = this.scale.height / 2 + 100;

        if (savedData) {
            // Si hay partida, leemos los datos
            const parsedData = JSON.parse(savedData);
            const day = parsedData.currentDay || 1;
            
            const continueBtnY = this.scale.height / 2 + 70;
            newGameBtnY = this.scale.height / 2 + 140; // Bajamos el otro botón

            // Botón Continuar
            const btnContinuar = this.add.image(this.scale.width / 2, continueBtnY, 'button')
                .setInteractive({ useHandCursor: true })
                .setOrigin(0.5).setScale(3);

            // Texto "Continuar"
            const txtContinuar = this.add.text(this.scale.width / 2, continueBtnY - 3, `CONTINUAR (DÍA ${day})`, {
                fontFamily: 'VT323, monospace',
                fontSize: '25px',
                fill: '#ffffff'
            }).setOrigin(0.5);

            // Animación hover continuar
            btnContinuar.on('pointerover', () => {
                btnContinuar.setScale(2.9);
                txtContinuar.setColor('#ffcc00');
            });

            btnContinuar.on('pointerout', () => {
                btnContinuar.setScale(3);
                txtContinuar.setColor('#ffffff');
            });

            // Click -> iniciar Boot cargando los datos
            btnContinuar.on('pointerdown', () => {
                this.sound.play('buttonSound', { volume: 1 });
                this.scene.start('Boot', { loadSave: true, saveData: parsedData });
            });
        }

        // Botón (Jugar normal o Nueva Partida)
        const btnNueva = this.add.image(this.scale.width / 2, newGameBtnY, 'button')
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5).setScale(3);

        // Texto "Start game" / "Nueva Partida"
        const txtNueva = this.add.text(this.scale.width / 2, newGameBtnY - 3, savedData ? 'NUEVA PARTIDA' : 'JUGAR', {
            fontFamily: 'VT323, monospace',
            fontSize: '25px',
            fill: '#ffffff'
        }).setOrigin(0.5);

        // Animación hover
        btnNueva.on('pointerover', () => {
            btnNueva.setScale(2.9);
            txtNueva.setColor('#ffcc00'); // color en hover
        });

        btnNueva.on('pointerout', () => {
            btnNueva.setScale(3);
            txtNueva.setColor('#ffffff'); // color normal
        });

        // Click -> iniciar Boot
        btnNueva.on('pointerdown', () => {
            this.sound.play('buttonSound', { volume: 1 });
            // Si había partida guardada y elige Nueva Partida, borramos el guardado viejo
            if (savedData) {
                localStorage.removeItem('potionGameSave');
            }
            this.scene.start('Boot', { loadSave: false });
        });
    }

    update() {
        this.clouds.tilePositionX += 0.3; // movimiento nubes
    }
}