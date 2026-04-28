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

        const capaVallas = this.map.getLayer('Vertical/Vallas')?.tilemapLayer;
        const capaEfectos = this.map.getLayer('Decoracion/Efectos')?.tilemapLayer;

        if (capaVallas) capaVallas.setDepth(9999);
        if (capaEfectos) capaEfectos.setDepth(9999);

        this.setupPlayer(168, 290);

        this.setupUI();

        this.cameras.main.fadeIn(1000, 0, 0, 0);

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
        this.grupoCosas = this.physics.add.staticGroup();
        this.map.getObjectLayer('spawnCosas')?.objects.forEach(obj => {
            // Al topo y al fuego al tener animacion en tiled, le ponemos una imagen cualquiera y lo hacemos invisible
            const n = obj.name || 'lampara';
            const imgKeys = { 
                'barril': 'barril', 'lampara': 'lamp', 'topo': 'dogBathtub', 
                'cesto': 'dogBathtub', 'tendedero': 'tendedero', 'fuego': 'dogBathtub', 
                'pilaBarriles': 'pilaBarriles' 
            };

            if (imgKeys[n]) {
                const objSprite = this.grupoCosas.create(obj.x, obj.y, imgKeys[n]).setOrigin(0.5, 1).setDepth(obj.y);
                // Ajuste de X (si es fuego o topo, el tiled usa ancho 16, si no, usa el ancho de la imagen)
                objSprite.x += (n === 'fuego' || n === 'topo') ? 8 : objSprite.width / 2;
                if (n === 'fuego' || n === 'topo') objSprite.setVisible(false);
                objSprite.refreshBody();

                // DICCIONARIO DE COLISIONES: { Ancho, Alto, OffsetX, OffsetY }
                const fisicas = {
                    'lampara':      { w: 9,  h: 8,  ox: -5,  oy: -10 },
                    'barril':       { w: 16, h: 10, ox: -8,  oy: -13 },
                    'cesto':        { w: 20, h: 12, ox: -10, oy: -14 },
                    'fuego':        { w: 24, h: 16, ox: 0,   oy: -16 },
                    'tendedero':    { w: 36, h: 10, ox: -18, oy: -10 },
                    'topo':         { w: 18, h: 12, ox: 0,   oy: -16 },
                    'pilaBarriles': { w: 44, h: 12, ox: -22, oy: -15 }
                }[n];

                // Aplicamos las fisicas leyendo el diccionario
                if (fisicas) {
                    objSprite.body.setSize(fisicas.w, fisicas.h)
                    .setOffset(objSprite.width / 2 + fisicas.ox, objSprite.height + fisicas.oy);
                }
            }
        });
        this.physics.add.collider(this.player, this.grupoCosas);
    }
}