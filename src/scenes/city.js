import Phaser from 'phaser';
import topDownScene from './topDownScene.js';
import GameState from '../state/GameState.js';

export default class City extends topDownScene {
    constructor() {
        super('city');
    }

    preload() { }

    create(data = {}) {
        let mapKey = 'ciudad';
        
        if (GameState.reputation >= 100) {
            mapKey = 'ciudad2';
        }

        this.initScene(mapKey);

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

        // REGAR
        this.capaMojado1 = this.map.getLayer('Suelo/Regado')?.tilemapLayer;
        this.capaMojado2 = this.map.getLayer('Suelo/Regado 2')?.tilemapLayer;
        this.capaHuerto1 = this.map.getLayer('Suelo/Huerto')?.tilemapLayer;
        this.capaHuerto2 = this.map.getLayer('Suelo/Huerto 2')?.tilemapLayer;

        if (this.capaMojado1) this.capaMojado1.setVisible(GameState.huertosRegadosHoy.huerto1);
        if (this.capaMojado2) this.capaMojado2.setVisible(GameState.huertosRegadosHoy.huerto2);

        const configHuertos = [
            {
                capa: this.capaHuerto1,
                ids: [4716, 4644, 4647, 4719],
                tipo: 'huerto1',
                condicion: () => !GameState.huertosRegadosHoy.huerto1,
                fixedEX: 632, 
                fixedEY: 88
            },
            {
                capa: this.capaHuerto2,
                ids: [4646, 4647, 4695, 4719, 4717, 4716, 4693, 4668, 4644, 4666],
                tipo: 'huerto2',
                condicion: () => !GameState.huertosRegadosHoy.huerto2,
                fixedEX: 472, 
                fixedEY: 184
            }
        ];

        this.hover(configHuertos);
        this.crearSistemaInteraccion(configHuertos, (tipo) => {
            if (tipo === 'huerto1') this.regar(1, this.capaMojado1);
            if (tipo === 'huerto2') this.regar(2, this.capaMojado2);
        });

        // ZONA PARA SUBIR
        const zonaSubir = this.add.zone(512, 344, 48, 8).setOrigin(0, 0);
        this.physics.add.existing(zonaSubir, true);
        this.physics.add.existing(zonaSubir, true);
        this.physics.add.overlap(this.player, zonaSubir, () => { this.cambiarPiso(true); });  // Cambia zElevacion y el NavMesh a la vez

        // ZONA PARA BAJAR
        const zonaBajar = this.add.zone(512, 360, 48, 8).setOrigin(0, 0);
        this.physics.add.existing(zonaBajar, true);
        this.physics.add.overlap(this.player, zonaBajar, () => { this.cambiarPiso(false); });

        // Decoracion (hierba y cultivos) con depth dinamico
        this.crearDecoracionDinamica(['Objetos/SpawnFlores']);
        this.crearDecoracionDinamica(['Objetos/SpawnFloresArriba'], 3000);

        // Creamos una zona para la transicion a la casa
        const zonaCasa = this.add.zone(this.map.widthInPixels - 8, 272, 8, 48).setOrigin(0, 0);
        this.physics.add.existing(zonaCasa, true);
        this.physics.add.overlap(this.player, zonaCasa, () => {
            this.cambiarEscena('house', { spawnX: 32, spawnY: 464, direccion: 'right' });
        });

        // CREACION DE ARBOLES DINAMICOS
        const configArboles = {
            'arbustoFeo':    { key: 'arbustoFeo',    w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
            'arbusto':       { key: 'arbustoMedio',  w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
            'arbustoBonito': { key: 'arbustoBonito', w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
            'peque':         { key: 'arbol_peque',   w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true, spriteOffsetX: 8 },
            'grande':        { key: 'arbol_grande',  w: 16, h: 14, ox: -8, oy: -14, centrarOffset: true, spriteOffsetX: 8 }
        };

        this.grupoArbolesAbajo = this.crearObjetos('Objetos/SpawnArboles', configArboles);
        this.grupoArbolesArriba = this.crearObjetos('Objetos/SpawnArbolesArriba', configArboles, 3000);

        // CREACION DE ESTRUCTURAS
        const configEstructuras = {
            'luz':              { key: 'farola',            w: 11, h: 10, ox: -5,   oy: -19, centrarOffset: true },
            'luzBonita':        { key: 'farolaBonita',      w: 11, h: 10, ox: -5,   oy: -19, centrarOffset: true },
            'papeleraSucia':    { key: 'papeleraSucia',     w: 15, h: 11, ox: -8,   oy: -13, centrarOffset: true },
            'papelera':         { key: 'papelera',          w: 15, h: 11, ox: -8,   oy: -13, centrarOffset: true },
            'sillaBlanca':      { key: 'sillaBlanca',       w: 15, h: 13, ox: -7,   oy: -14, centrarOffset: true },
            'sillaRosa':        { key: 'sillaRosa',         w: 15, h: 13, ox: -7,   oy: -14, centrarOffset: true },
            'agua':             { key: 'water box',         w: 26, h: 25, ox: -13,  oy: -28, centrarOffset: true },
            'tendedero rosa':   { key: 'tendederoRosa',     w: 36, h: 10, ox: -18,  oy: -10, centrarOffset: true },
            'fuente':           { key: 'fuente',            w: 45, h: 40, ox: -23,  oy: -41, centrarOffset: true },
            'banco':            { key: 'banco',             w: 24, h: 12, ox: -12,  oy: -14, centrarOffset: true },
            'banco girado':     { key: 'bancoGirado',       w: 12, h: 24, ox: -6,   oy: -24, centrarOffset: true },
            'tronco':           { key: 'tronco',            w: 56, h: 22, ox: -27,  oy: -22, centrarOffset: true },
            'hamacaRoja':       { key: 'hamacaRoja',        w: 21, h: 18, ox: -10,  oy: -18, centrarOffset: true },
            'hamacaAmarilla':   { key: 'hamacaAmarilla',    w: 21, h: 18, ox: -10,  oy: -18, centrarOffset: true },
            'barbacoa':         { key: 'barbacoa',          w: 28, h: 16, ox: -14,  oy: -14, centrarOffset: true },
            'sombrilla':        { key: 'sombrilla',         w: 8,  h: 6,  ox: -4,   oy: -6,  centrarOffset: true },
            'construction area':{ key: 'Construction area', w: 96, h: 34, ox: -48,  oy: -37, centrarOffset: true },
            'casaRota':         { key: '2',             dw: -14,   h: 52, ox: 8,   oy: -53 },
            'casaBlanca':       { key: 'casaBlanca',    dw: -8,    h: 56, ox: 2,   oy: -55 },
            'casaAzul':         { key: 'casaAzul',      dw: -9,    h: 56, ox: 6,   oy: -78 }   
        };

        this.grupoEstructurasAbajo = this.crearObjetos('Objetos/SpawnEstructuras', configEstructuras);
        this.grupoEstructurasArriba = this.crearObjetos('Objetos/SpawnEstructurasArriba', configEstructuras, 3000);

        this.activarTransparencias([this.grupoArbolesAbajo, this.grupoArbolesArriba, this.grupoEstructurasAbajo, this.grupoEstructurasArriba]);

        const casaAzulObj = this.grupoEstructurasAbajo.getChildren().find(obj => obj.tipoObjeto === 'casaAzul') || 
                            this.grupoEstructurasArriba.getChildren().find(obj => obj.tipoObjeto === 'casaAzul');

        if (casaAzulObj) { // como tiene forma de L hay que crear 2 rectangulos de colision
            const alaIzquierda = this.add.zone(casaAzulObj.x - 23, casaAzulObj.y - 5, 70, 45).setOrigin(0.5, 1);
            this.physics.add.existing(alaIzquierda, true); 
            this.physics.add.collider(this.player, alaIzquierda);
        }

        this.debugTiles([
            { nombre: 'Huerto Seco 1', capa: this.capaHuerto1 },
            { nombre: 'Huerto Seco 2', capa: this.capaHuerto2 }
        ]);
    }

    regar(idHuerto, capaMojada) {
        // Bloqueamos interfaz y empezamos animacion
        this.bloquearClic = true;
        this.player.bloquearAnimaciones = true; // para que no se solapen las animaciones
        if (this.player.setPath) this.player.setPath([]); 
        if (this.player.body) this.player.body.setVelocity(0, 0);

        // Guardamos posicion original para volver al terminar
        const origX = this.player.x;
        const origY = this.player.y;
        const origFlip = this.player.flipX;
        const origDir = this.player.lastDirection;

        // Lugares de la animacion
        let secuenciaMontaje = [];

        if (idHuerto === 1) {
            secuenciaMontaje = [
                { px: (36 * 16) + 8, py: (6 * 16) + 8, dir: 'right' },
                { px: (39 * 16) + 8, py: (6 * 16) + 8, dir: 'left' }
            ];
        } else if (idHuerto === 2) {
            secuenciaMontaje = [
                { px: (22 * 16) + 8, py: (11 * 16) + 8, dir: 'right' },
                { px: (29 * 16) + 8, py: (13 * 16) + 8, dir: 'left' },
                { px: (26 * 16) + 8, py: (11 * 16) + 8, dir: 'down' },
                { px: (24 * 16) + 8, py: (14 * 16) + 8, dir: 'up' }
            ];
        }
        
        let pasoActual = 0;

        const ejecutarCorte = () => {
            if (pasoActual >= secuenciaMontaje.length) { // Si ya no quedan cortes, finalizamos
                this.player.setPosition(origX, origY);
                this.player.setFlipX(origFlip);
                
                // Devolvemos el control al jugador
                this.player.bloquearAnimaciones = false;
                if (this.player.setDireccion) this.player.setDireccion(origDir);

                // Desbloqueamos controles y mojamos la tierra
                this.bloquearClic = false;
                if (capaMojada) capaMojada.setVisible(true);
                GameState.huertosRegadosHoy[`huerto${idHuerto}`] = true;
                
                this.cameras.main.flash(200, 100, 200, 255);
                return;
            }

            // Aplicamos el corte actual
            const frame = secuenciaMontaje[pasoActual];
            this.player.setPosition(frame.px, frame.py);

            // Reproducimos la animacion
            if (frame.dir === 'left') {
                this.player.setFlipX(true);
                this.player.anims.play('water-right', false); 
            } else if (frame.dir === 'right') {
                this.player.setFlipX(false);
                this.player.anims.play('water-right', false);
            } else {
                this.player.setFlipX(false);
                this.player.anims.play(`water-${frame.dir}`, false);
            }

            pasoActual++;

            // Saltamos de animacion cada 800ms
            this.time.delayedCall(800, ejecutarCorte);
        };

        ejecutarCorte();
    }
}