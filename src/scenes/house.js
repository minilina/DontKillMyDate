import Phaser from 'phaser';
import topDownScene from './topDownScene.js';

export default class House extends topDownScene {
    constructor() {
        super('house');
    }

    preload() { }

    create(data = {}) {
        this.initScene('casa');

        // Capas especificas que usamos
        // Usamos ?. para que si un dia borramos una capa en Tiled, el codigo no pete
        const capaVallas = this.map.getLayer('Delimitacion Mundo/Vallas')?.tilemapLayer;
        const capaPilares = this.map.getLayer('Mas Colisiones/Pilares')?.tilemapLayer;
        const capaFondoFalso = this.map.getLayer('Suelo/Fondo Falso')?.tilemapLayer;
        const capaTapar = this.map.getLayer('Mas Colisiones/Tapar')?.tilemapLayer;
        const capaHierbaEncima = this.map.getLayer('Suelo/Hierba Encima Agua')?.tilemapLayer;
        const capaCesped = this.map.getLayer('Suelo/Cesped')?.tilemapLayer;

        // CONFIGURAR PROFUNDIDADES (DEPTH / Z-INDEX)
        if (capaTapar) capaTapar.setDepth(9999);
        if (capaHierbaEncima) capaHierbaEncima.setDepth(9999);

        // Poner al jugador
        const startX = data.spawnX ?? 400;
        const startY = data.spawnY ?? 300;

        this.setupPlayer(startX, startY); // Crea NavMesh, Player, Camara y Fisicas
        this.setupUI();                   // Crea el boton de pausa y la tecla ESC

        // Decoracion (flores y demas) con depth dinamico
        this.crearDecoracionDinamica(['Objetos/SpawnFlores']);

        // HOVER PARA LAS VALLAS Y LA PIEDRA
        this.hover([
            { capa: capaVallas,  ids: [1393, 1394, 1395, 1405, 1406, 1407] },
            { capa: capaPilares, ids: [3852, 3868, 3869, 3870, 3871] }
        ]);

        // CUEVA
        this.cuevaAbierta = false;

        // Abrir cueva (funcion reutilizable)
        const abrirCueva = (cX, cY, conTemblor = false) => {
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
                this.cambiarEscena('cueva', { returnX: pX + 8, returnY: pY + 32, cuevaTileX: cX, cuevaTileY: cY });
            });

            // TEMBLOR DE CAMARA
            if (conTemblor) this.cameras.main.shake(200, 0.010);
        };

        // Si venimos de la cueva, la abrimos sin temblor
        if (data.cuevaTileX !== undefined) {
            abrirCueva(data.cuevaTileX, data.cuevaTileY, false);
        }

        // Abrir/cerrar vallas (funcion reutilizable)
        const interactuarValla = (tileValla) => {
            const IDs = { cerrado: [1393, 1394, 1395], abierto: [1405, 1406, 1407], colision: 1210 };

            if (IDs.cerrado.includes(tileValla.index)) {
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
                // Buscamos la gema (id 3852) en un 3x3 alrededor del que hacemos click para usar su Y
                let anchorY = tile.y;
                for (let i = -3; i <= 3; i++) {
                    let t = capaPilares?.getTileAt(tile.x, tile.y + i);
                    if (t && t.index === 3852) {
                        anchorY = tile.y + i; 
                        break;
                    }
                }
                abrirCueva(tile.x - 1, anchorY, true);
            } else if (tipo === 'valla') {
                interactuarValla(tile);
            }
        });        

        // CREACION DE ARBOLES DINAMICOS
        const configArboles = {
            'grande':    { key: 'arbol_grande',  w: 16, h: 14, ox: -8, oy: -14, centrarOffset: true, spriteOffsetX: 8 },
            'mediano':   { key: 'arbol_mediano', w: 16, h: 12, ox: -8, oy: -12, centrarOffset: true, spriteOffsetX: 8 },
            'peque':     { key: 'arbol_peque',   w: 12, h: 10, ox: -6, oy: -10, centrarOffset: true, spriteOffsetX: 8 },
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
            'templo':  { dw: -16, h: 80, ox: 8, oy: -80, tOffsetY: 80 }
        };
        this.grupoEstructuras = this.crearObjetos('Objetos/SpawnEstructuras', configEstructuras);

        // Templo
        const spriteTemplo = this.grupoEstructuras.getChildren().find(e => e.tipoObjeto === 'templo');
        if (spriteTemplo) {
            // Creamos la zona en la base del templo
            const zonaX = spriteTemplo.x;
            const zonaY = spriteTemplo.y + 5;
            const z = this.add.zone(zonaX, zonaY, 40, 20).setOrigin(0.5, 1);
            this.physics.add.existing(z, true);
            this.physics.add.overlap(this.player, z, () => {
                this.cambiarEscena('store', { returnX: zonaX, returnY: zonaY + 20 });
            });
        }

        // TRANSPARENCIAS
        this.activarTransparencias([this.grupoArboles, this.grupoEstructuras]);

        // HERRAMIENTA DE DEBUG: VER IDS TIENE LA VALLA, EL MURO...
        this.debugTiles([
            { nombre: "VALLA",       capa: capaVallas },
            { nombre: "MURO",        capa: capaCesped },
            { nombre: "PIEDRA AGUA", capa: capaPilares },
            { nombre: "COLISION",    capa: this.capaColisiones }
        ]);
    }
}