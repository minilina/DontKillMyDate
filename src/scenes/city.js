import Phaser from 'phaser';
import topDownScene from './topDownScene.js';
import DialogueManager from '../dialogue/dialogueManager.js';
import NPCManager from '../game-objects/NPCManager.js';

export default class City extends topDownScene {
    constructor() {
        super('city');
    }

    preload() { }

    create(data = {}) {
        this.initScene('ciudad');

        const capaMuroPuente = this.map.getLayer('Delimitacion Mundo/Muro Puente')?.tilemapLayer;
        const capaSueloPuente = this.map.getLayer('Suelo/Puente')?.tilemapLayer;
        const capaDecoracionPuente = this.map.getLayer('Suelo/Decoracion Puente')?.tilemapLayer;
        const capaColisionesPuente = this.map.getLayer('Colisiones Puente')?.tilemapLayer;

        if (capaMuroPuente) capaMuroPuente.setDepth(2000);
        if (capaSueloPuente) capaSueloPuente.setDepth(2000);
        if (capaDecoracionPuente) capaDecoracionPuente.setDepth(2000);

        this.setupPlayer(this.map.widthInPixels - 32, 288, 'left');
        this.setupUI();
        this.crearNPCs();

        this.dialogueManager = new DialogueManager(this);

        this.npcManager = new NPCManager(
            this,
            this.dialogueManager
        );

        this.npcManager.createFromLayer('Objetos/NPCs');

        this.setupDefaultFootstepSounds();
        this.player.zElevacion = 3000;

        if (capaColisionesPuente) {
            capaColisionesPuente.setCollisionByExclusion([-1]);
            capaColisionesPuente.setVisible(false);
            this.physics.add.collider(
                this.player,
                capaColisionesPuente,
                null,
                () => { return this.player.zElevacion > 0; }, // Solo colisionas si estas elevado (zElevacion)
                this
            );


        }

        // ZONA PARA SUBIR
        const zonaSubir = this.add.zone(512, 344, 48, 8).setOrigin(0, 0);
        this.physics.add.existing(zonaSubir, true);
        this.physics.add.overlap(this.player, zonaSubir, () => { this.player.zElevacion = 3000; });

        // ZONA PARA BAJAR
        const zonaBajar = this.add.zone(512, 360, 48, 8).setOrigin(0, 0);
        this.physics.add.existing(zonaBajar, true);
        this.physics.add.overlap(this.player, zonaBajar, () => { this.player.zElevacion = 0; });

        // Decoracion (hierba y cultivos) con depth dinamico
        this.crearDecoracionDinamica(['Objetos/SpawnFlores']);
        this.crearDecoracionDinamica(['Objetos/SpawnFloresPuente'], 3000);

        // Creamos una zona para la transicion a la casa
        const zonaCasa = this.add.zone(this.map.widthInPixels - 8, 272, 8, 48).setOrigin(0, 0);
        this.physics.add.existing(zonaCasa, true);
        this.physics.add.overlap(this.player, zonaCasa, () => {
            this.cambiarEscena('house', { spawnX: 32, spawnY: 464, direccion: 'right' });
        });

        // CREACION DE ARBOLES DINAMICOS
        const configArboles = {
            'arbustoFeo': { key: 'arbustoFeo', w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
            'arbusto': { key: 'arbustoMedio', w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
            'arbustoBonito': { key: 'arbustoBonito', w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
            'peque': { key: 'arbol_peque', w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true, spriteOffsetX: 8 },
            'grande': { key: 'arbol_grande', w: 16, h: 14, ox: -8, oy: -14, centrarOffset: true, spriteOffsetX: 8 }
        };
        this.grupoArboles = this.crearObjetos('Objetos/SpawnArboles', configArboles);

        // CREACION DE ESTRUCTURAS
        const configEstructuras = {
            'luz': { key: 'farola', w: 11, h: 10, ox: -5, oy: -19, centrarOffset: true },
            'luzBonita': { key: 'farolaBonita', w: 11, h: 10, ox: -5, oy: -19, centrarOffset: true },
            'papeleraSucia': { key: 'papeleraSucia', w: 15, h: 10, ox: -8, oy: -13, centrarOffset: true },
            'papelera': { key: 'papelera', w: 15, h: 10, ox: -8, oy: -13, centrarOffset: true },
            'sillaBlanca': { key: 'sillaBlanca', w: 15, h: 13, ox: -7, oy: -14, centrarOffset: true },
            'sillaRosa': { key: 'sillaRosa', w: 15, h: 13, ox: -7, oy: -14, centrarOffset: true },
            'agua': { key: 'water box', w: 26, h: 25, ox: -13, oy: -28, centrarOffset: true },
            'tendedero rosa': { key: 'tendederoRosa', w: 36, h: 10, ox: -18, oy: -10, centrarOffset: true },
            'fuente': { key: 'fuente', w: 45, h: 40, ox: -23, oy: -41, centrarOffset: true },
            'banco': { key: 'banco', w: 24, h: 12, ox: -12, oy: -14, centrarOffset: true },
            'banco girado': { key: 'bancoGirado', w: 12, h: 24, ox: -6, oy: -24, centrarOffset: true },
            'casaRota': { key: '2', dw: -14, h: 52, ox: 8, oy: -53 }
        };

        this.grupoEstructuras = this.crearObjetos('Objetos/SpawnEstructuras', configEstructuras);

        this.activarTransparencias([this.grupoArboles, this.grupoEstructuras]);
    }
}