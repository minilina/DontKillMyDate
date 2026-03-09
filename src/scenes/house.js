import Phaser from 'phaser';
import Player from '../game-objects/player.js';

export default class House extends Phaser.Scene {
    constructor() {
        super({ key: 'house' }); 
    }

    preload() {}

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

        // HOVER PARA LAS VALLAS Y LA PIEDRA
        this.input.on('pointermove', (pointer) => {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const tileHoverValla = capaVallas.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            const tileHoverPiedra = capaPilares.getTileAtWorldXY(worldPoint.x, worldPoint.y);

            const idValla = [1393, 1394, 1395, 1405, 1406, 1407]; 
            const idPiedra = [3868, 3870];

            if (tileHoverValla && idValla.includes(tileHoverValla.index)) {
                this.game.canvas.style.cursor = 'pointer';
            } else if (tileHoverPiedra && idPiedra.includes(tileHoverPiedra.index)) {
                this.game.canvas.style.cursor = 'pointer';
            } else {
                this.game.canvas.style.cursor = 'default';
            }
        });

        this.cuevaAbierta = false;

        // ABRIR y CERRAR VALLAS Y ABRIR CUEVA
        this.input.on('pointerdown', (pointer) => {
            // Convertir el clic de la pantalla a coordenadas
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const tileValla = capaVallas.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            const tilePiedra = capaPilares.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            const distancia = Phaser.Math.Distance.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);

            if (tilePiedra) {
                const ID_CUEVA_ARRIBA = 2121;
                const ID_CUEVA_ABAJO = 2146;
                const ID_PIEDRA_RUNICA_ARRIBA = 3868;
                const ID_PIEDRA_RUNICA_ABAJO = 3870;

                // Si hacemos clic en la piedra, estamos cerca y la cueva esta cerrada
                if ((tilePiedra.index === ID_PIEDRA_RUNICA_ARRIBA || tilePiedra.index === ID_PIEDRA_RUNICA_ABAJO) && distancia < 80 && !this.cuevaAbierta) {
                    const cuevaTileX = tilePiedra.x - 1; 
                    const cuevaTileY = tilePiedra.y - 1; 
                    this.cuevaAbierta = true;

                    // DIBUJAR LA CUEVA ABIERTA (quitamos de otra capa porque sino no ponia la animacion del agua)
                    capaTapar.putTileAt(-1, cuevaTileX, cuevaTileY - 1);
                    capaTapar.putTileAt(-1, cuevaTileX, cuevaTileY);

                    // Creamos una zona invisible justo en la entrada de la cueva para entrar en ella
                    const pixelsX = map.tileToWorldX(cuevaTileX);
                    const pixelsY = map.tileToWorldY(cuevaTileY);
                    const zonaEntrada = this.add.zone(pixelsX, pixelsY, 16, 17).setOrigin(0, 0); 
                    this.physics.add.existing(zonaEntrada, true);
                    
                    // ENTRAR A LA CUEVA SI TOCAS LA ZONA Y PULSAS ARRIBA
                    this.physics.add.overlap(this.player, zonaEntrada, () => {
                        if (this.player.wasd.up.isDown) {
                            this.scene.start('Cueva'); 
                        }
                    });

                    // TEMBLOR DE CAMARA
                    this.cameras.main.shake(200, 0.010);
                }
            }

            // Si hacemos clic en una puerta de valla y estamos suficientemente cerca
            if (tileValla) {
                const ID_COLISION = 1210;
                const ID_posteIzquierdo = 1393;
                const ID_Central = 1394;
                const ID_posteDerecho = 1395;
                const ID_posteIzquierdoAbierto = 1405;
                const ID_CentralAbierto = 1406;
                const ID_posteDerechoAbierto = 1407;
                const ID_posteIzquierdoArriba = 1399 ;
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
                        capaTapar.putTileAt(ID_posteDerechoArriba, startX + 2, startY - 1);     // Poste derecho arriba

                        // Fila de abajo (startY)
                        capaVallas.putTileAt(ID_posteIzquierdoAbierto, startX, startY);          // Poste izquierdo abajo
                        capaVallas.putTileAt(ID_CentralAbierto, startX + 1, startY);                            // Hueco central abajo
                        capaVallas.putTileAt(ID_posteDerechoAbierto, startX + 2, startY);        // Poste derecho abajo

                        // CAMBIAR COLISIONES
                        capaColisiones.putTileAt(-1, startX + 1, startY);
                        capaColisiones.putTileAt(-1, startX + 1, startY - 1); // Por si la fila de arriba esta bloqueada
                    }

                    // CERRAR VALLA
                    else if (tileValla.index === ID_posteIzquierdoAbierto || tileValla.index === ID_CentralAbierto || tileValla.index === ID_posteDerechoAbierto) {
                        let startX;
                        if (tileValla.index === ID_posteIzquierdoAbierto) startX = tileValla.x;           // Clic en el poste izquierdo
                        else if (tileValla.index === ID_CentralAbierto) startX = tileValla.x - 1;         // Clic en el hueco transparente
                        else if (tileValla.index === ID_posteDerechoAbierto) startX = tileValla.x - 2;    // Clic en el poste derecho

                        let startY = tileValla.y;

                        // SOLUCION GLITCH ENTRAR EN COLISIONES: Si el jugador esta pisando el hueco central de la puerta, le impedimos cerrarla
                        const jugadorTileX = capaVallas.worldToTileX(this.player.x);
                        const jugadorTileY = capaVallas.worldToTileY(this.player.y);
                        if (jugadorTileX === startX + 1 && (jugadorTileY === startY)) {
                            return;
                        }

                        // DIBUJAR LA PUERTA CERRADA
                        // Borrar fila de arriba (startY - 1)
                        capaTapar.putTileAt(-1, startX, startY - 1);
                        capaTapar.putTileAt(-1, startX + 2, startY - 1);

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
        
        // DIFUMINAR ARBOLES Y ESTRUCTURAS SI PASAS DEBAJO
        const capaZonasCasa = map.getObjectLayer('TransparenciaCasa');
        const zonasCasa = capaZonasCasa ? capaZonasCasa.objects : [];

        let tilesTransparentes = [];

        this.events.on('update', () => {
            // El jugador tiene una profundidad que varia depende de su posicion Y
            this.player.setDepth(this.player.y + 4); // + 4 porque hay calculos raros para los objetos y a veces te pone debajo si te pegas mucho

            // TRANSPARENCIA DE ARBOLES (Sprites)
            this.grupoArboles.getChildren().forEach(arbol => {
                // Calculamos la distancia entre el jugador y el arbol
                const distX = Math.abs(this.player.x - arbol.x);
                const distY = arbol.y - this.player.y;
                let difuminar = false;

                // Si es un pino
                if (!arbol.tipoArbol.includes('mushroom')) {
                    // Limites de transparencia segun el tamaño del arbol
                    let altoArbol = 67;
                    let mitadBase = 30;

                    if (arbol.tipoArbol === 'mediano') { altoArbol = 47; mitadBase = 22; }
                    if (arbol.tipoArbol === 'peque') {altoArbol = 32; mitadBase = 14;}

                    if (distY > 5 && distY < altoArbol) {
                         // Calculamos el % de altura al que estas (0 = base, 1 = punta)
                        const porcentajeAltura = distY / altoArbol;
                        // El ancho permitido se encoge cuanto mas alto estas
                        const anchoPermitidoAEstaAltura = mitadBase * (1 - porcentajeAltura);
                        
                        if (distX < anchoPermitidoAEstaAltura) {
                            difuminar = true;
                        }
                    }
                }
                // Si es una seta
                else {
                    let inicioSombrero = 18; // Tallo
                    let altoSeta = 45;       // Altura total
                    let mitadSombrero = 18;  // Ancho del sombrero

                    if (distY > inicioSombrero && distY < altoSeta && distX < mitadSombrero) {
                        difuminar = true;
                    }
                }

                // Aplicar transparencia
                let targetAlpha = difuminar ? 0.4 : 1;
                arbol.alpha += (targetAlpha - arbol.alpha) * 0.10; // Transicion suave
            });

            // TRANSPARENCIA DE ESTRUCTURAS
            this.grupoEstructuras.getChildren().forEach(estructura => {
                // Calculamos la distancia entre el jugador y las estructuras
                const centroX = estructura.x + (estructura.width / 2);
                const distX = Math.abs(this.player.x - centroX);
                const distY = estructura.y - this.player.y;
                let difuminar = false;

                // Si es la casa (Pentagono)
                if (estructura.tipoEstructura === 'templo') {
                    let inicioPared = 15;        // Altura desde el suelo te empieza a tapar
                    let limiteTejado = 150;      // Altura donde deja de taparte
                    let altoPared = 80;          // Donde empieza el triangulo
                    let mitadAnchoCasa = 62;     // Ancho desde donde te empieza a tapar

                    if (distY > inicioPared && distY < limiteTejado) {
                        // tejado (Triángulo)
                        if (distY > altoPared) {
                            let alturaTriangulo = estructura.height - altoPared; // Altura del triangulo
                            let distYTejado = distY - altoPared;                 // Cuanto has subido por el tejado
                            
                            const porcentajeAltura = distYTejado / alturaTriangulo;
                            const anchoPermitidoAEstaAltura = mitadAnchoCasa * (1 - porcentajeAltura);
                            
                            if (distX < anchoPermitidoAEstaAltura) {
                                difuminar = true;
                            }
                        }
                    }
                }

                // si es un pilar, roca o estatua (rectangulo)
                else {
                    let inicioBase = 15; // Altura donde empieza a tapar
                    let altoFinal = 45;  // Altura total donde deja de tapar
                    let mitadAncho = 20; // Ancho maximo hacia los lados

                    if (estructura.tipoEstructura === 'pilar1' || estructura.tipoEstructura === 'pilar2') {
                        inicioBase = 10;
                        altoFinal = 55;
                        mitadAncho = 12;
                    } 
                    else if (estructura.tipoEstructura === 'roca') {
                        inicioBase = 5;
                        altoFinal = 32;
                        mitadAncho = 10;
                    } 
                    else if (estructura.tipoEstructura === 'estatua') {
                        inicioBase = 20;
                        altoFinal = 50;
                        mitadAncho = 16;
                    }

                    if (distY > inicioBase && distY < altoFinal && distX < mitadAncho) {
                        difuminar = true;
                    }
                }

                // APLICAR TRANSPARENCIA
                let targetAlpha = difuminar ? 0.4 : 1;
                estructura.alpha += (targetAlpha - estructura.alpha) * 0.10;
            });
        });

        // VER QUE IDS TIENE LA VALLA, EL MURO, LA PIEDRA Y EL BLOQUE DE COLISION
        this.input.on('pointerdown', (pointer) => {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            
            // Vallas
            const tileValla = capaVallas.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            if (tileValla) {
                console.log("VALLA - ID:", tileValla.index);
            }

            // Muro
            const tileMuro = capaFondo.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            if (tileMuro) {
                console.log("MURO - ID:", tileMuro.index);
            }

            // Piedra
            const tilePiedraAgua = capaPilares.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            if (tilePiedraAgua) {
                console.log("PIEDRA AGUA - ID:", tilePiedraAgua.index);
            }

            // Colisiones
            const tileColision = capaColisiones.getTileAtWorldXY(worldPoint.x, worldPoint.y);
            if (tileColision) {
                console.log("COLISION - ID:", tileColision.index);
            }
        });
    }
}