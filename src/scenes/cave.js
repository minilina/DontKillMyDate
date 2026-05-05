import Phaser from 'phaser';
import topDownScene from './topDownScene.js';

export default class Cueva extends topDownScene {
    constructor() {
        super('cueva');
    }

    preload() { }

    create(data = {}) {
        this.datosDeLaCasa = data;
        this.initScene('cueva');

        const capaEfectos = this.map.getLayer('Decoracion/Efectos')?.tilemapLayer;
        const capaDecoracionVallas = this.map.getLayer('Decoracion/Decoracion Vallas')?.tilemapLayer;

        if (capaEfectos) capaEfectos.setDepth(9999);
        if (capaDecoracionVallas) capaDecoracionVallas.setDepth(9999);

        this.setupPlayer(168, 290);
        this.setupUI();

        // Decoracion (valla) con depth dinamico
        this.crearDecoracionDinamica(['Objetos/SpawnValla']);

        // Zona salida
        const zonaSalida = this.add.zone(168, 318, 48, 16).setOrigin(0.5, 0.5);
        this.physics.add.existing(zonaSalida, true);
        this.physics.add.overlap(this.player, zonaSalida, () => {
            this.cambiarEscena('house', {
                spawnX: this.datosDeLaCasa.returnX,
                spawnY: this.datosDeLaCasa.returnY,
                cuevaTileX: this.datosDeLaCasa.cuevaTileX,
                cuevaTileY: this.datosDeLaCasa.cuevaTileY
            });
        });

        // CREACION DE OBJETOS DINAMICOS
        const configCosas = {
            'lampara':      { key: 'lamp',         w: 9,  h: 8,  ox: -5,  oy: -10, centrarOffset: true },
            'barril':       { key: 'barril',       w: 16, h: 10, ox: -8,  oy: -13, centrarOffset: true },
            'cesto':        { key: 'dogBathtub',   w: 20, h: 12, ox: -10, oy: -14, centrarOffset: true },
            'tendedero':    { key: 'tendedero',    w: 36, h: 10, ox: -18, oy: -10, centrarOffset: true },
            'pilaBarriles': { key: 'pilaBarriles', w: 44, h: 12, ox: -22, oy: -15, centrarOffset: true },
            // Fuego y Topo al tener animaciones tienen un key generico que se oculta y necesitamos el ofset para la colision
            'fuego':        { key: 'dogBathtub',   w: 24, h: 16, ox: 0,   oy: -16, spriteOffsetX: 8, centrarOffset: true },
            'topo':         { key: 'dogBathtub',   w: 18, h: 12, ox: 0,   oy: -16, spriteOffsetX: 8, centrarOffset: true }
        };

        this.grupoCosas = this.crearObjetos('Objetos/SpawnCosas', configCosas);

        // Ocultamos el fuego y el topo iterando sobre el grupo que nos devuelve la funcion
        this.grupoCosas.getChildren().forEach(obj => {
            if (obj.tipoObjeto === 'fuego' || obj.tipoObjeto === 'topo') {
                obj.setVisible(false);
            }
        });
    }
}