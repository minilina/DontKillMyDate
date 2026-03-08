import Phaser from 'phaser';

import Player from '../game-objects/player.js';

import allPropsSeasons from '../../assets/tiled/allPropsSeasons.png';
import bestFishPoint from '../../assets/tiled/bestFishPoint.png';
import deepForestStones from '../../assets/tiled/deepForestStones.png';
import duckMallad from '../../assets/tiled/duckMallad.png';
import extraVillageTilesets from '../../assets/tiled/extraVillageTilesets.png';
import fenceWood from '../../assets/tiled/fenceWood.png';
import halloweenContent from '../../assets/tiled/halloweenContent.png';
import pathTiles from '../../assets/tiled/pathTiles.png';
import propsWater from '../../assets/tiled/propsWater.png';
import road from '../../assets/tiled/road.png';
import stoneStructures from '../../assets/tiled/stoneStructures.png';
import stoneStructuresWater from '../../assets/tiled/stoneStructuresWater.png';
import tilesetGrassCliffTilesetSpring from '../../assets/tiled/tilesetGrassCliffTilesetSpring.png';
import tilesetGrassSpring from '../../assets/tiled/tilesetGrassSpring.png';
import tilesetGrassWaterSpring from '../../assets/tiled/tilesetGrassWaterSpring.png';
import treeTrunks from '../../assets/tiled/treeTrunks.png';
import waterGroundAnimationsTiles from '../../assets/tiled/waterGroundAnimationsTiles.png';

import pine from '../../assets/tiled/pine.png';
import pine2 from '../../assets/tiled/pine2.png';
import pine3 from '../../assets/tiled/pine3.png';
import mushroom1 from '../../assets/tiled/mushroom1.png';
import mushroom2 from '../../assets/tiled/mushroom2.png';
import mushroom3 from '../../assets/tiled/mushroom3.png';
import templo from '../../assets/tiled/templo.png';
import pilar1 from '../../assets/tiled/pilar1.png';
import pilar2 from '../../assets/tiled/pilar2.png';
import roca from '../../assets/tiled/roca.png';
import estatua from '../../assets/tiled/estatua.png';

import playerRun from '../../assets/anims/run.png';
import playerIdle from '../../assets/anims/idle.png';
import casa from '../../assets/tiled/casa.json';

export default class House extends Phaser.Scene {
    constructor() {
        super({ key: 'house' }); 
    }

    preload() {
        this.load.spritesheet('player-run', playerRun, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player-idle', playerIdle, { frameWidth: 32, frameHeight: 32 });

        this.load.image('allPropsSeasons', allPropsSeasons); 
        this.load.image('bestFishPoint', bestFishPoint);
        this.load.image('deepForestStones', deepForestStones);
        this.load.image('duckMallad', duckMallad);
        this.load.image('extraVillageTilesets', extraVillageTilesets);
        this.load.image('fenceWood', fenceWood);
        this.load.image('halloweenContent', halloweenContent);
        this.load.image('pathTiles', pathTiles);
        this.load.image('propsWater', propsWater);
        this.load.image('road', road);
        this.load.image('stoneStructures', stoneStructures);
        this.load.image('stoneStructuresWater', stoneStructuresWater);
        this.load.image('tilesetGrassCliffTilesetSpring', tilesetGrassCliffTilesetSpring);
        this.load.image('tilesetGrassSpring', tilesetGrassSpring);
        this.load.image('tilesetGrassWaterSpring', tilesetGrassWaterSpring);
        this.load.image('treeTrunks', treeTrunks);
        this.load.image('waterGroundAnimationsTiles', waterGroundAnimationsTiles);

        this.load.image('arbol_grande', pine);
        this.load.image('arbol_mediano', pine2);
        this.load.image('arbol_peque', pine3);
        this.load.image('seta_azul', mushroom1);
        this.load.image('seta_cyan', mushroom2);
        this.load.image('seta_rosa', mushroom3);
        this.load.image('templo', templo);
        this.load.image('pilar1', pilar1);
        this.load.image('pilar2', pilar2);
        this.load.image('roca', roca);
        this.load.image('estatua', estatua);

        this.load.tilemapTiledJSON('map', casa);
    }

    create() {
        var map = this.make.tilemap({ key: 'map' });

        var allPropsSeasons = map.addTilesetImage('ALL props seasons', 'allPropsSeasons');
        var bestFishPoint = map.addTilesetImage('best fish point 2', 'bestFishPoint');
        var deepForestStones = map.addTilesetImage('deep forest stones', 'deepForestStones');
        var duckMallad = map.addTilesetImage('Duck Mallad', 'duckMallad');
        var extraVillageTilesets = map.addTilesetImage('Extra Village Tilesets', 'extraVillageTilesets');
        var fenceWood = map.addTilesetImage('Fence Wood', 'fenceWood');
        var halloweenContent = map.addTilesetImage('Halloween Content', 'halloweenContent');
        var pathTiles = map.addTilesetImage('Path tiles', 'pathTiles');
        var propsWater = map.addTilesetImage('props water', 'propsWater');
        var road = map.addTilesetImage('Road', 'road');
        var stoneStructures = map.addTilesetImage('Stone structures', 'stoneStructures');
        var stoneStructuresWater = map.addTilesetImage('Stone structures Water', 'stoneStructuresWater');
        var tilesetGrassCliffTilesetSpring = map.addTilesetImage('Tileset Grass Cliff Tileset Spring', 'tilesetGrassCliffTilesetSpring');
        var tilesetGrassSpring = map.addTilesetImage('Tileset Grass Spring', 'tilesetGrassSpring');
        var tilesetGrassWaterSpring = map.addTilesetImage('Tileset Grass Water Spring', 'tilesetGrassWaterSpring');
        var treeTrunks = map.addTilesetImage('TREE TRUNKS copiar', 'treeTrunks');
        var waterGroundAnimationsTiles = map.addTilesetImage('Water Ground animations tiles', 'waterGroundAnimationsTiles');

        const tilesetsArray = [
            allPropsSeasons, bestFishPoint, deepForestStones, duckMallad, 
            extraVillageTilesets, fenceWood, halloweenContent, 
            pathTiles, propsWater, road, stoneStructures, 
            tilesetGrassSpring, tilesetGrassWaterSpring, treeTrunks, 
            waterGroundAnimationsTiles, stoneStructuresWater, tilesetGrassCliffTilesetSpring
        ];

        // CREAR CAPAS (De abajo hacia arriba)
        const capaAgua = map.createLayer('Agua/Agua', tilesetsArray, 0, 0);
        const capaDecoracionAgua = map.createLayer('Agua/Decoracion Agua', tilesetsArray, 0, 0);
        const capaDecoracionAgua2 = map.createLayer('Agua/Decoracion Agua 2', tilesetsArray, 0, 0);
        const capaTierra = map.createLayer('Suelo/Tierra', tilesetsArray, 0, 0);
        const capaCamino = map.createLayer('Suelo/Camino', tilesetsArray, 0, 0);
        const capaCesped = map.createLayer('Suelo/Cesped', tilesetsArray, 0, 0);
        const capaFondo = map.createLayer('Suelo/Fondo', tilesetsArray, 0, 0);
        const capaDecoracionCesped = map.createLayer('Suelo/Decoracion Cesped', tilesetsArray, 0, 0);
        const capaHierbaEncima = map.createLayer('Suelo/Hierba Encima Agua', tilesetsArray, 0, 0);
        const capaVallas = map.createLayer('Delimitacion Mundo/Vallas', tilesetsArray, 0, 0);
        const capaMuro = map.createLayer('Delimitacion Mundo/Muro', tilesetsArray, 0, 0);
        const capaEscalera = map.createLayer('Delimitacion Mundo/Escalera', tilesetsArray, 0, 0);
        const capaPilares = map.createLayer('Mas Colisiones/Pilares', tilesetsArray, 0, 0);
        const capaPiedras = map.createLayer('Mas Colisiones/Piedras', tilesetsArray, 0, 0);
        const capaPiedras2 = map.createLayer('Mas Colisiones/Piedras 2', tilesetsArray, 0, 0);
        const capaHierbaCasa = map.createLayer('Mas Colisiones/Hierba Casa', tilesetsArray, 0, 0);
        const capaTapar = map.createLayer('Mas Colisiones/Tapar', tilesetsArray, 0, 0);
        const capaAnimales = map.createLayer('Animales', tilesetsArray, 0, 0);
        
        // CAPA DE COLISIONES
        const capaColisiones = map.createLayer('Colisiones', tilesetsArray, 0, 0);

        // ACTIVAR LA COLISION Y OCULTARLA
        capaColisiones.setCollisionByExclusion([-1]);
        capaColisiones.setVisible(false); // La hacemos invisible para no ver los cuadros rojos

        // ANIMACION DE LAS TILES
        this.animatedTiles.init(map);
        this.animatedTiles.setRate(0.5);
        
        // CREAR AL JUGADOR
        this.player = new Player(this, 400, 300); 

        // CAMARA SIGUE AL JUGADOR
        this.cameras.main.startFollow(this.player, true);

        // CONFIGURAR PROFUNDIDADES (DEPTH / Z-INDEX)
        capaTapar.setDepth(9999);
        capaHierbaEncima.setDepth(9998);

        // CONFIGURAR CAMARA Y LIMITES
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.player, true); 
        
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // AÑADIR COLISION FISICA
        this.physics.add.collider(this.player, capaColisiones);

        // HOVER PARA LAS VALLAS
        this.input.on('pointermove', (pointer) => {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const tileHover = capaVallas.getTileAtWorldXY(worldPoint.x, worldPoint.y);

            const idValla = [1393, 1394, 1395, 1405, 1406, 1407]; 

            if (tileHover && idValla.includes(tileHover.index)) {
                this.game.canvas.style.cursor = 'pointer';
            } else {
                this.game.canvas.style.cursor = 'default';
            }
        });

        // ABRIR y CERRAR VALLAS
        this.input.on('pointerdown', (pointer) => {
            // Convertir el clic de la pantalla a coordenadas
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const tileValla = capaVallas.getTileAtWorldXY(worldPoint.x, worldPoint.y);

            // Si hacemos clic en una puerta de valla y estamos suficientemente cerca
            if (tileValla) {
                const distancia = Phaser.Math.Distance.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
                const ID_COLISION = 1210;
                const ID_posteIzquierdo = 1393;
                const ID_Central = 1394;
                const ID_posteDerecho = 1395;
                const ID_posteIzquierdoAbierto = 1405;
                const ID_CentralAbierto = 1406;
                const ID_posteDerechoAbierto = 1407;
                const ID_posteIzquierdoArriba = 1399;
                const ID_posteDerechoArriba = 1401;

                if (distancia < 60) { // Distancia para poder abrirla

                    // ABRIR VALLA
                    if (tileValla.index === ID_posteIzquierdo || tileValla.index === ID_Central || tileValla.index === ID_posteDerecho) {                  
                        let startX;
                        if (tileValla.index === ID_posteIzquierdo) startX = tileValla.x;         // Clic en el poste izquierdo
                        else if (tileValla.index === ID_Central) startX = tileValla.x - 1;       // Clic en el centro
                        else if (tileValla.index === ID_posteDerecho) startX = tileValla.x - 2;  // Clic en el poste derecho

                        let startY = tileValla.y; // La fila de la puerta cerrada

                        // DIBUJAR LA PUERTA ABIERTA
                        // Fila de arriba (startY - 1)
                        capaTapar.putTileAt(ID_posteIzquierdoArriba, startX, startY - 1);       // Poste izquierdo arriba
                        capaTapar.putTileAt(ID_posteDerechoArriba, startX + 2, startY - 1);  // Poste derecho arriba

                        // Fila de abajo (startY)
                        capaVallas.putTileAt(ID_posteIzquierdoAbierto, startX, startY);          // Poste izquierdo abajo
                        capaVallas.putTileAt(ID_CentralAbierto, startX + 1, startY);      // Hueco central abajo
                        capaVallas.putTileAt(ID_posteDerechoAbierto, startX + 2, startY);      // Poste derecho abajo

                        // CAMBIAR COLISIONES
                        capaColisiones.removeTileAt(startX + 1, startY);
                        capaColisiones.removeTileAt(startX + 1, startY - 1); // Por si la fila de arriba esta bloqueada
                    }

                    // CERRAR VALLA
                    else if (tileValla.index === ID_posteIzquierdoAbierto || tileValla.index === ID_CentralAbierto || tileValla.index === ID_posteDerechoAbierto) {
                        let startX;
                        if (tileValla.index === ID_posteIzquierdoAbierto) startX = tileValla.x;           // Clic en el poste izquierdo
                        else if (tileValla.index === ID_CentralAbierto) startX = tileValla.x - 1;  // Clic en el hueco transparente
                        else if (tileValla.index === ID_posteDerechoAbierto) startX = tileValla.x - 2;  // Clic en el poste derecho

                        let startY = tileValla.y;

                        // SOLUCION GLITCH ENTRAR EN COLISIONES: Si el jugador esta pisando el hueco central de la puerta, le impedimos cerrarla
                        const jugadorTileX = capaVallas.worldToTileX(this.player.x);
                        const jugadorTileY = capaVallas.worldToTileY(this.player.y);
                        if (jugadorTileX === startX + 1 && (jugadorTileY === startY)) {
                            return;
                        }

                        // DIBUJAR LA PUERTA CERRADA
                        // Borrar fila de arriba (startY - 1)
                        capaTapar.removeTileAt(startX, startY - 1);
                        capaTapar.removeTileAt(startX + 2, startY - 1);

                        // Fila de abajo (startY)
                        capaVallas.putTileAt(ID_posteIzquierdo, startX, startY);
                        capaVallas.putTileAt(ID_Central, startX + 1, startY);
                        capaVallas.putTileAt(ID_posteDerecho, startX + 2, startY);

                        //RESTAURAR COLISIONES
                        capaColisiones.putTileAt(ID_COLISION, startX + 1, startY);     // Volvemos a bloquear el centro para no pasar
                    }
                }
            }
        });

        // CREACION DE ARBOLES DINAMICOS
        // Creamos un grupo fisico estatico para todos los arboles
        this.grupoArboles = this.physics.add.staticGroup();
        const capaSpawn = map.getObjectLayer('SpawnArboles');

        if (capaSpawn) {
            // Miramos el nombre en Tiled (grande, mediano o peque)
            const imagenesArboles = {
                'grande': 'arbol_grande',
                'mediano': 'arbol_mediano',
                'peque': 'arbol_peque',
                'mushroom1': 'seta_azul',
                'mushroom2': 'seta_cyan',
                'mushroom3': 'seta_rosa'
            };

            capaSpawn.objects.forEach(obj => {
                const nombre = obj.name || 'grande'; // Si no tiene nombre, sera un pino grande por defecto
                
                // Si el nombre existe en nuestro diccionario, creamos el árbol
                if (imagenesArboles[nombre]) {
                    const imagenKey = imagenesArboles[nombre];

                    // Origin (0.5, 1): para centrar el tronco
                    const arbol = this.grupoArboles.create(obj.x + 8, obj.y, imagenKey);
                    arbol.setOrigin(0.5, 1);
                    arbol.setDepth(arbol.y);
                    arbol.tipoArbol = nombre;

                    // FLIP (Giro Horizontal)
                    if (obj.properties) {
                        const propFlip = obj.properties.find(p => p.name === 'flipX');
                        if (propFlip && propFlip.value === true) {
                            arbol.setFlipX(true);
                        }
                    }

                    arbol.refreshBody();

                    // AJUSTE DE COLISIONES
                    if (nombre === 'peque') {
                        arbol.body.setSize(12, 10);
                        arbol.body.setOffset(arbol.width / 2 - 6, arbol.height - 10);
                    } else if (nombre === 'mediano') {
                        arbol.body.setSize(16, 12);
                        arbol.body.setOffset(arbol.width / 2 - 8, arbol.height - 12);
                    } else if (nombre === 'grande') {
                        arbol.body.setSize(16, 14);
                        arbol.body.setOffset(arbol.width / 2 - 8, arbol.height - 14);
                    } else { 
                        // Colisión por defecto para cualquier seta
                        arbol.body.setSize(12, 10);
                        arbol.body.setOffset(arbol.width / 2 - 6, arbol.height - 10);
                    }
                }
            });
        }

        // Añadimos la colision entre el jugador y los troncos
        this.physics.add.collider(this.player, this.grupoArboles);

        // CREACION DE ESTRUCTURAS 
        this.grupoEstructuras = this.physics.add.staticGroup();
        const capaEstructuras = map.getObjectLayer('SpawnEstructuras');

        if (capaEstructuras) {
            capaEstructuras.objects.forEach(obj => {
                const nombre = obj.name;
               
                if (['templo', 'pilar1', 'pilar2', 'roca', 'estatua'].includes(nombre)) {
                    // Origin (0, 1): El punto de Tiled es la esquina Abajo-Izquierda
                    const estructura = this.grupoEstructuras.create(obj.x, obj.y, nombre);
                    estructura.setOrigin(0, 1);
                    estructura.setDepth(estructura.y);
                    estructura.tipoEstructura = nombre;

                    estructura.refreshBody();

                    // AJUSTE DE COLISIONES
                    if (nombre === 'pilar1' || nombre === 'pilar2') {
                        estructura.body.setSize(19, 15);
                        estructura.body.setOffset(7, estructura.height - 17);
                    } else if (nombre === 'roca') {
                        estructura.body.setSize(24, 14);
                        estructura.body.setOffset(6, estructura.height - 16);
                    } else if (nombre === 'estatua') {
                        estructura.body.setSize(29, 20);
                        estructura.body.setOffset(1, estructura.height - 24);
                    } else if (nombre === 'templo') {
                        estructura.body.setSize(estructura.width - 16, 80); 
                        estructura.body.setOffset(8, estructura.height - 80);
                    }
                }
            });
        }

        // Añadimos las colisiones contra el jugador
        this.physics.add.collider(this.player, this.grupoEstructuras);
        
        // DIFUMINAR ARBOLES Y TECHOS SI PASAS DEBAJO
        const capaZonasCasa = map.getObjectLayer('TransparenciaCasa');
        const zonasCasa = capaZonasCasa ? capaZonasCasa.objects : [];

        let tilesTransparentes = [];

        this.events.on('update', () => {
            // El jugador tiene una profundidad que varia depende de su posicion Y
            this.player.setDepth(this.player.y);
            // Restaurar la opacidad de los tiles
            tilesTransparentes.forEach(tile => { tile.alpha = 1; });
            tilesTransparentes = []; // Vaciamos la lista

            // TRANSPARENCIA DE ARBOLES (Sprites)
            this.grupoArboles.getChildren().forEach(arbol => {
                // Calculamos la distancia entre el jugador y el arbol
                const distX = Math.abs(this.player.x - arbol.x);
                const distY = arbol.y - this.player.y;

                // Si es un pino
                if (!arbol.tipoArbol.includes('mushroom')) {
                    // Limites de transparencia segun el tamaño del arbol
                    let altoArbol = 65;
                    let mitadBase = 28;

                    if (arbol.tipoArbol === 'mediano') { altoArbol = 45; mitadBase = 20; }
                    if (arbol.tipoArbol === 'peque') {altoArbol = 30; mitadBase = 14;}

                    // distY > 5 asegura que no se difumine si solo le pisas un poco
                    if (distY > 5 && distY < altoArbol) {
                        // Calculamos el % de altura al que estas (0 = base, 1 = punta)
                        const porcentajeAltura = distY / altoArbol;
                        // El ancho permitido se encoge cuanto mas alto estas
                        const anchoPermitidoAEstaAltura = mitadBase * (1 - porcentajeAltura);
                        if (distX < anchoPermitidoAEstaAltura) {
                            arbol.alpha = 0.4;
                        } else {
                            arbol.alpha = 1; // Estas rozando las hojas por fuera
                        }
                    } else {
                        arbol.alpha = 1; // Estas por delante o muy por encima
                    }
                }
                // Si es una seta
                else {
                    let inicioSombrero = 20; // Tallo
                    let altoSeta = 45;       // Altura total
                    let mitadSombrero = 25;  // Ancho del sombrero
                    if (distY > inicioSombrero && distY < altoSeta && distX < mitadSombrero) {
                        arbol.alpha = 0.4;
                    } else {
                        arbol.alpha = 1;
                    }
                }
            });

            // TRANSPARENCIA DE ESTRUCTURAS
            this.grupoEstructuras.getChildren().forEach(estructura => {
                // Comprobamos si las coordenadas del jugador caen DENTRO del rectangulo de la imagen
                // Como el origen es 0,1, la imagen va desde estructura.x hasta estructura.x + width
                // y en altura va desde estructura.y hasta estructura.y - height
                
                const dentroX = this.player.x > estructura.x && this.player.x < (estructura.x + estructura.width);
                const dentroY = this.player.y < estructura.y && this.player.y > (estructura.y - estructura.height);

                // Solo hacemos transparente si estás "detras" del edificio (tu Y es menor) y dentro de su area
                if (dentroX && dentroY && this.player.y < estructura.y) {
                    estructura.alpha = 0.4;
                } else {
                    estructura.alpha = 1;
                }
            });
        });

        // VER QUE IDS TIENE LA VALLA Y EL BLOQUE DE COLISION
        this.input.on('pointerdown', (pointer) => {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            
            // Vallas
            const tileValla = capaVallas.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            if (tileValla) {
                console.log("VALLA - ID:", tileValla.index);
            }

            // Colisiones
            const tileColision = capaColisiones.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            if (tileColision) {
                console.log("COLISION - ID:", tileColision.index);
            }
        });
    }
}