import Phaser from 'phaser';
import GameState from '../state/GameState.js';

export default class CuttingMinigame extends Phaser.Scene {
    constructor() {
        super({ key: 'cuttingMinigame' });
    }

    init(data) {
        this.isTutorial = data.isTutorial || false;
        this.isRetry = data.isRetry || false;
        this.ingredientId = data.ingredient;
        this.cutsMade = 0;
        this.clicks = 0;
        this.misses = 0;
        this.zones = [];
        this.sc = 3; // escala
    }

    create() {
        this.createAnimations();

        // fondo oscuro y mesa con tabla
        this.bg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.5).setOrigin(0).setDepth(9);
        this.add.image(0, 0, 'cuttingBg').setOrigin(0).setDepth(1).setScale(this.sc);

        // --- GESTIÓN DE MÚSICA (CREATE) ---
        // Pausamos la música global si está sonando
        if (this.game.bgMusic && this.game.bgMusic.isPlaying) {
            this.game.bgMusic.pause();
        }
        
        // Iniciamos el sonido del minijuego
        let miniMusic = this.sound.get('minigameSound');
        if (!miniMusic || !miniMusic.isPlaying) {
            this.sound.play('minigameSound', { loop: true, volume: 0.3 });
        }
        // -------------------------

        // crear elementos minijuego
        this.createIngredient(141 * this.sc, 67 * this.sc);
        this.createBar(74 * this.sc, 132 * this.sc);
        this.createArrow(151 * this.sc);

        if (this.isTutorial) {
            this.runTutorialFlow();
        } else {
            // empezar minijuego con cuenta atrás
            this.startCountdown();
        }
    }

    // cuenta atrás antes de empezar el minijuego
    startCountdown() {
        GameState.pauseTimer();

        const txt = this.add.text(this.scale.width / 2, this.scale.height / 2, '3', {
            fontFamily: "VT323, monospace",
            fontSize: '90px',
            color: '#f2e3d3'
        }).setOrigin(0.5).setDepth(10);

        this.time.delayedCall(1000, () => txt.setText('2'));
        this.time.delayedCall(2000, () => txt.setText('1'));
        this.time.delayedCall(3000, () => {
            txt.destroy();
            this.bg.setDepth(0);
            GameState.resumeTimer();
            this.startGame(); // cuando acaba, empieza el movimiento y los clicks
        });
    }

    // activar input y movimiento de la flecha para empezar el minijuego
    startGame() {
        // detectar clicks
        this.input.on('pointerdown', this.tryCut, this);

        // movimiento de la flecha
        this.tweens.add({
            targets: this.arrow,
            x: this.bar.x + this.bar.displayWidth - 14,
            duration: 2500,
            onComplete: () => this.evaluateCut()
        });
    }

    // crear animación del corte
    createAnimations() {
        if (!this.anims.exists('cut')) {
            this.anims.create({
                key: 'cut',
                frames: this.anims.generateFrameNames('knife', { prefix: 'cuchillo_anim-', start: 0, end: 10 }),
                frameRate: 50,
                repeat: 0
            });
        }
    }

    // crear trozos del ingrediente
    createIngredient(x, y) {
        const tex = this.textures.getFrame(this.ingredientId);
        const pieceW = tex.width / 4; // cortamos el ingrediente en 4 partes iguales

        this.ingredientStartX = x - (tex.width * this.sc / 2);
        this.ingredientXBase = x;
        this.ingredientYBase = y;
        this.ingredientPieces = [];

        for (let i = 0; i < 4; i++) {
            let piece = this.add.sprite(x, y, this.ingredientId).setScale(this.sc).setDepth(2);
            piece.setCrop(i * pieceW, 0, pieceW, tex.height);
            this.ingredientPieces.push(piece);
        }
    }

    // crear zonas de la barra
    createBar(x, y) {
        this.bar = this.add.image(x, y, 'cuttingBar').setOrigin(0).setDepth(2).setScale(this.sc);

        const barW = this.bar.displayWidth;
        const barH = this.bar.displayHeight;

        const segmentW = (barW - (12 * this.sc)) / 3; // dividir la barra en 3 segmentos
        const rectangleW = 15 * this.sc; // ancho de los rectángulos de corte

        // crear 3 zonas de corte aleatorias dentro de cada segmento
        for (let i = 0; i < 3; i++) {
            // buscar un punto random dentro de cada tercio de la barra
            let randomX = Phaser.Math.Snap.To( // para que respete la dimensión de los píxeles
                Phaser.Math.Between(
                    this.bar.x + (6 * this.sc) + (i * segmentW) + (rectangleW / 2),
                    this.bar.x + (6 * this.sc) + ((i + 1) * segmentW) - (rectangleW / 2)
                ),
                3 * this.sc
            );

            // crear el rectángulo de la zona en la barra
            let zone = this.add.rectangle(randomX, this.bar.y + (barH / 2), rectangleW, barH - 18, 0x422c26).setDepth(3);

            // estado inicial y guardado en el array de zonas
            zone.isCut = false;
            this.zones.push(zone);
        }
    }

    // crear flecha
    createArrow(y) {
        this.arrow = this.add.sprite(this.bar.x + 13, y, 'cutArrow').setScale(this.sc).setDepth(4).setOrigin(0.5, 0);
    }

    // comprobar acierto o fallo al cortar
    tryCut() {
        this.clicks++;

        // buscar si la flecha está dentro de alguna zona no cortada
        const hitZone = this.zones.find(z => !z.isCut && z.getBounds().contains(this.arrow.x, z.y));

        if (hitZone) {
            hitZone.isCut = true; // marcar como cortada
            this.cutsMade++; // sumar acierto
            hitZone.setFillStyle(0x476237); // cambiar color a verde

            // TRADUCIR LA POSICIÓN DEL CORTE
            // índice del corte (0, 1 o 2)
            const cutIndex = this.zones.indexOf(hitZone);

            // ancho del ingrediente en pantalla
            const visualIngredientWidth = this.textures.getFrame(this.ingredientId).width * this.sc;

            // calcular la posición base del cuchillo para el corte, que es el centro del segmento correspondiente al corte
            const baseKnifeX = this.ingredientStartX + (visualIngredientWidth / 4) * (cutIndex + 1);

            // calcular el offset real para que el cuchillo caiga en la posición correcta del ingrediente, teniendo en cuenta los trozos ya cortados
            const offset = this.ingredientPieces[cutIndex + 1].x - this.ingredientXBase;

            // posición X final real para el sprite del cuchillo
            const finalKnifeX = baseKnifeX + offset;

            // ANIMACIÓN
            // crear y ejecutar la animación del corte en esa posición
            let anim = this.add.sprite(finalKnifeX, this.ingredientYBase, 'knife', 'cuchillo_anim-0').setScale(this.sc).setDepth(4);
            anim.play('cut').on('animationcomplete', () => anim.destroy());
            this.sound.play('knifeSound', { volume: 1 });

            // mover hacia la derecha todos los trozos que quedan tras el corte (separación)
            for (let p = cutIndex + 1; p < 4; p++) {
                this.ingredientPieces[p].x += (3 * this.sc);
            }

        } else {
            this.misses++;
            this.cameras.main.flash(200, 102, 14, 14); // flash rojo
            // penalización por fallo
            GameState.reducePotionQuality(5);
            this.sound.play('errorSound', { volume: 1 });
        }

        // máximo 3 clicks !!
        if (this.clicks >= 3) {
            this.input.off('pointerdown');
            this.tweens.killTweensOf(this.arrow);
            this.evaluateCut();
        }
    }

    // terminar minijuego
    evaluateCut() {
        this.input.off('pointerdown');

        if (this.isTutorial) {
            this.showTutorialEndOptions();
        } else {
            // penalización por cortes no realizados
            const unmadeCuts = 3 - this.cutsMade;
            if (unmadeCuts > 0) {
                GameState.reducePotionQuality(unmadeCuts * 10);
            }

            this.time.delayedCall(1500, () => {
                // Hemos sustituido la repetición de código por la llamada directa a exitScene
                this.exitScene();
            });
        }
    }


    // ---------------------------
    // Tutorial
    // ---------------------------

    runTutorialFlow() {
        const waitTime = this.isRetry ? 1500 : 8000;
        // Mostramos el texto de instrucciones
        const instructions = this.add.text(
            this.scale.width / 2, 40, "Haz clic cuando la flecha esté en una zona oscura.\nDebes hacer 3 cortes.",
            { fontFamily: "VT323, monospace", fontSize: '32px', color: '#ffffff', stroke: '#000000', strokeThickness: 5, align: 'center' }
        ).setOrigin(0.5).setDepth(100);

        // Esperamos 8 segundos y luego empezamos el minijuego con la cuenta atrás
        this.time.delayedCall(waitTime, () => {
            instructions.destroy();
            this.startCountdown();
        });
    }

    showTutorialEndOptions() {
        const { width, height } = this.scale;

        this.input.off('pointerdown');

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
            this.scene.restart({
                isTutorial: true,
                ingredient: this.ingredientId,
                isRetry: true
            });
        });

        continueButton.on('pointerdown', () => {
            closePopup();
            this.scene.get('kitchen').events.emit('minigame:tutorial:finished');
            this.exitScene();
        });
    }

    // --- FUNCIONES DE AYUDA Y VISUALES ---

    exitScene() {
        const cutsArray = this.zones.map(z => z.isCut);
        let kitchenScene = this.scene.get('kitchen');
        kitchenScene.returnFromMinigame(this.ingredientId, 'cut', cutsArray);

        // --- GESTIÓN DE MÚSICA (EXIT) ---
        // 1. Detenemos la música del minijuego
        this.sound.stopByKey('minigameSound');
        
        // 2. Reanudamos la música global
        if (this.game.bgMusic) {
            if (this.game.bgMusic.isPaused) {
                this.game.bgMusic.resume();
            } else if (!this.game.bgMusic.isPlaying) {
                this.game.bgMusic.play();
            }
        }
        // -------------------------

        this.scene.resume('kitchen');
        this.scene.stop();
    }
}