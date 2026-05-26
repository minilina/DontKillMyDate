import Phaser from 'phaser';
import topDownScene from './topDownScene.js';

export default class House extends topDownScene {
    constructor() {
        super('house');
    }

    preload() { }

    create(data = {}) {
        this.initScene('casa');

        // Capas específicas que usamos
        const capaVallas = this.map.getLayer('Delimitacion Mundo/Vallas')?.tilemapLayer;
        const capaPilares = this.map.getLayer('Mas Colisiones/Pilares')?.tilemapLayer;
        const capaFondoFalso = this.map.getLayer('Suelo/Fondo Falso')?.tilemapLayer;
        const capaTapar = this.map.getLayer('Mas Colisiones/Tapar')?.tilemapLayer;
        const capaHierbaEncima = this.map.getLayer('Suelo/Hierba Encima Agua')?.tilemapLayer;
        const capaCamino = this.map.getLayer('Suelo/Camino')?.tilemapLayer;
        
        // CONFIGURAR PROFUNDIDADES (DEPTH / Z-INDEX)
        if (capaTapar) capaTapar.setDepth(9999);
        if (capaHierbaEncima) capaHierbaEncima.setDepth(9999);

        // Poner al jugador
        const startX = data.spawnX ?? 730;
        const startY = data.spawnY ?? 230;
        const dir = data.direccion ?? 'down';

        this.setupPlayer(startX, startY, dir); // Crea NavMesh, Player, Camara y Fisicas
        this.setupUI();                   // Crea el boton de pausa y la tecla ESC

        // CONFIGURACIÓN DE AUDIO
        this.fenceSound = this.sound.add('fenceSound', { volume: 1 });
        this.setupAmbientWaterSound('waterAmbientSound');
        
        // Evitamos el pico de volumen alto al iniciar la escena bajándolo a 0
        const sonidoAgua = this.sound.get('waterAmbientSound');
        if (sonidoAgua) {
            sonidoAgua.setVolume(0);
        }
        
        this.setupDefaultFootstepSounds();

        // Decoracion (flores y demas) con depth dinamico
        this.crearDecoracionDinamica(['Objetos/SpawnFlores']);

        // HOVER PARA LAS VALLAS Y LA PIEDRA
        this.hover([
            { capa: capaVallas,  ids: [1393, 1394, 1395, 1405, 1406, 1407], tipo: 'valla' },
            { capa: capaPilares, ids: [3852, 3868, 3869, 3870, 3871], tipo: 'cueva', condicion: () => !this.cuevaAbierta}
        ]);

        // CUEVA
        this.cuevaAbierta = false;

        // Abrir cueva (funcion reutilizable con control de sonido)
        const abrirCueva = (cX, cY, conTemblor = false, reproducirSonido = true) => {
            this.cuevaAbierta = true;

            // DIBUJAR LA CUEVA ABIERTA
            capaFondoFalso?.putTileAt(-1, cX, cY - 1);
            capaFondoFalso?.putTileAt(-1, cX, cY);

            // Quitamos la colision y reconstruimos el NavMesh
            this.capaColisiones?.putTileAt(-1, cX, cY - 1);
            this.capaColisiones?.putTileAt(-1, cX, cY);
            this.player.setNavmesh(this.navMeshPlugin.buildMeshFromTilemap("mesh", this.map, [this.capaColisiones]));

            // Creamos una zona invisible justo en la entrada de la cueva
            const pX = this.map.tileToWorldX(cX), pY = this.map.tileToWorldY(cY);
            const zonaEntrada = this.add.zone(pX, pY, 16, 23).setOrigin(0, 0);
            this.physics.add.existing(zonaEntrada, true);

            // ENTRAR A LA CUEVA SI TOCAS LA ZONA
            this.physics.add.overlap(this.player, zonaEntrada, () => {
                this.cambiarEscena('cueva', { cuevaTileX: cX, cuevaTileY: cY });
            });

            // TEMBLOR DE CAMARA Y AUDIO
            if (conTemblor) this.cameras.main.shake(200, 0.010);
            
            if (reproducirSonido) {
                this.sound.play('landSlideSound', { volume: 0.5 });
            }
        };

        // Si venimos de la cueva, la abrimos sin temblor Y SIN SONIDO (false, false)
        if (data.cuevaTileX !== undefined) {
            abrirCueva(data.cuevaTileX, data.cuevaTileY, false, false);
        }

        // Abrir/cerrar vallas (funcion reutilizable)
        const interactuarValla = (tileValla) => {
            const IDs = { cerrado: [1393, 1394, 1395], abierto: [1405, 1406, 1407], colision: 1210 };

            if (IDs.cerrado.includes(tileValla.index)) {
                this.fenceSound.play(); // sonido abrir
                let sX = tileValla.x - (tileValla.index === 1394 ? 1 : (tileValla.index === 1395 ? 2 : 0));
                
                capaTapar?.putTileAt(1399, sX, tileValla.y - 1);
                capaTapar?.putTileAt(1401, sX + 2, tileValla.y - 1);
                capaVallas.putTileAt(1405, sX, tileValla.y);
                capaVallas.putTileAt(1406, sX + 1, tileValla.y);
                capaVallas.putTileAt(1407, sX + 2, tileValla.y);
                this.capaColisiones?.putTileAt(-1, sX + 1, tileValla.y);
                this.player.setNavmesh(this.navMeshPlugin.buildMeshFromTilemap("mesh", this.map, [this.capaColisiones]));
            } else if (IDs.abierto.includes(tileValla.index)) {
                let sX = tileValla.x - (tileValla.index === 1406 ? 1 : (tileValla.index === 1407 ? 2 : 0));
                if (this.map.worldToTileX(this.player.x) === sX + 1 && this.map.worldToTileY(this.player.y) === tileValla.y) return;
                this.fenceSound.play(); // sonido cerrar

                capaTapar?.putTileAt(-1, sX, tileValla.y - 1);
                capaTapar?.putTileAt(-1, sX + 2, tileValla.y - 1);
                capaVallas.putTileAt(1393, sX, tileValla.y);
                capaVallas.putTileAt(1394, sX + 1, tileValla.y);
                capaVallas.putTileAt(1395, sX + 2, tileValla.y);
                this.capaColisiones?.putTileAt(IDs.colision, sX + 1, tileValla.y);
                this.player.setNavmesh(this.navMeshPlugin.buildMeshFromTilemap("mesh", this.map, [this.capaColisiones]));
            }
        };

        // Boton E para interactuar con vallas y piedra
        this.crearSistemaInteraccion([
            { capa: capaVallas, ids: [1394, 1406], idsClic: [1393, 1394, 1395, 1405, 1406, 1407], tipo: 'valla', offsetX: -22, offsetY: -18 },
            { capa: capaPilares, ids: [3852], idsClic: [3852, 3868, 3869, 3870, 3871], tipo: 'cueva', offsetX: 15, offsetY: -2, condicion: () => !this.cuevaAbierta }
        ], (tipo, tile) => {
            if (tipo === 'cueva') {
                let anchorY = tile.y;
                for (let i = -3; i <= 3; i++) {
                    let t = capaPilares?.getTileAt(tile.x, tile.y + i);
                    if (t && t.index === 3852) {
                        anchorY = tile.y + i;
                        break;
                    }
                }
                // Al interactuar manualmente, SÍ queremos temblor y SÍ queremos sonido (true, true)
                abrirCueva(tile.x - 1, anchorY, true, true);
            } else if (tipo === 'valla') {
                interactuarValla(tile);
            }
        });

        // CREACION DE ARBOLES DINAMICOS
        const configArboles = {
            'grande':     { key: 'arbol_grande',  w: 16, h: 14, ox: -8, oy: -14, centrarOffset: true, spriteOffsetX: 8 },
            'mediano':    { key: 'arbol_mediano', w: 16, h: 12, ox: -8, oy: -12, centrarOffset: true, spriteOffsetX: 8 },
            'peque':      { key: 'arbol_peque',   w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true, spriteOffsetX: 8 },
            'mushroom1': { key: 'seta_azul',     w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
            'mushroom2': { key: 'seta_cyan',     w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
            'mushroom3': { key: 'seta_rosa',     w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true },
        };
        this.grupoArboles = this.crearObjetos('Objetos/SpawnArboles', configArboles);

        // CREACION DE ESTRUCTURAS 
        const configEstructuras = {
            'pilar1':  { w: 19, h: 15, ox: 7, oy: -17 },
            'pilar2':  { w: 19, h: 15, ox: 7, oy: -17 },
            'roca':    { w: 24, h: 14, ox: 6, oy: -16 },
            'estatua': { w: 29, h: 20, ox: 1, oy: -24 },
            'letrero': { w: 16, h: 10, ox: 7, oy: -10 },
            'templo':  { dw: -16, h: 80, ox: 8, oy: -80 }
        };
        this.grupoEstructuras = this.crearObjetos('Objetos/SpawnEstructuras', configEstructuras);

        // Templo
        const spriteTemplo = this.grupoEstructuras.getChildren().find(e => e.tipoObjeto === 'templo');
        if (spriteTemplo) {
            const z = this.add.zone(spriteTemplo.x, spriteTemplo.y + 5, 40, 20).setOrigin(0.5, 1);
            this.physics.add.existing(z, true);
            this.physics.add.overlap(this.player, z, () => {
                this.cambiarEscena('store', { returnX: spriteTemplo.x, returnY: spriteTemplo.y + 25 });
            });
        }

        // Transicion a la ciudad
        const zonaCiudad = this.add.zone(0, 448, 8, 48).setOrigin(0, 0);
        this.physics.add.existing(zonaCiudad, true);
        this.physics.add.overlap(this.player, zonaCiudad, () => {
            this.cambiarEscena('city');
        });

        // TRANSPARENCIAS
        this.activarTransparencias([this.grupoArboles, this.grupoEstructuras]);

        // HERRAMIENTA DE DEBUG
        this.debugTiles([
            { nombre: "VALLA",       capa: capaVallas },
            { nombre: "MURO",        capa: this.capaCesped },
            { nombre: "PIEDRA AGUA", capa: capaPilares },
            { nombre: "COLISION",    capa: this.capaColisiones }
        ]);

        // APAGADO GLOBAL DE AUDIOS (SHUTDOWN)
        this.events.on('shutdown', () => {
            this.sound.stopByKey('grassSound');
            this.sound.stopByKey('fenceSound');
            this.sound.stopByKey('tilesSound');
            this.sound.stopByKey('groundSound');
            this.sound.stopByKey('landSlideSound');
            this.sound.stopByKey('waterAmbientSound'); // Asegura que el agua también se detenga
        });
    }
}