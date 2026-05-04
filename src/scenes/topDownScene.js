import Phaser from 'phaser';
import Player from '../game-objects/player.js';

export default class TopDownScene extends Phaser.Scene {
    constructor(key) {
        super({ key });
    }

    // Metodo generico para inicializar mapas topDown
    initScene(mapKey) {
        this.map = this.make.tilemap({ key: mapKey });
        this.isTransitioning = false;

        const tilesetsArray = this.map.tilesets.map(tileset => {
            // map.addTilesetImage(Nombre_en_Tiled, Nombre_en_Phaser) (nombre igual en ambos)
            return this.map.addTilesetImage(tileset.name, tileset.name);
        });

        // Carga de capas
        this.map.layers.forEach(layerData => {
            const capa = this.map.createLayer(layerData.name, tilesetsArray, 0, 0);
            
            if (layerData.name === 'Colisiones') {
                capa.setCollisionByExclusion([-1]);
                capa.setVisible(false);
                this.capaColisiones = capa;
            }

            else if (layerData.name.toLowerCase().includes('invisible')) {
                capa.setVisible(false);
            }
        });

        // Animaciones
        if (this.animatedTiles) {
            this.animatedTiles.init(this.map);
            this.animatedTiles.setRate(0.5);
        }

        return { map: this.map, tilesets: tilesetsArray };
    }

    setupPlayer(startX, startY) {
        // NavMesh
        /* const walkableLayer = map.getObjectLayer('Walkable');
        
        this.navMesh = this.navMeshPlugin.buildMeshFromTiled(
            "mesh",
            walkableLayer//,5 //shrink amount (opcional)
        ); */
        
        if (this.capaColisiones) {
            this.navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh", this.map, [this.capaColisiones], null, 4.5);
        }

        //Descomentar esto para debuggear navmesh---------------------------------------------
        /* this.navMesh.enableDebug(); // Creates a Phaser.Graphics overlay on top of the screen
        this.navMesh.debugDrawClear(); // Clears the overlay
        // Visualize the underlying navmesh
        this.navMesh.debugDrawMesh({
            drawCentroid: true,
            drawBounds: false,
            drawNeighbors: true,
            drawPortals: true
        }); */
        //-------------------------------------------------------------------------------------

        // Jugador
        this.player = new Player(this, startX, startY);
        if (this.navMesh) this.player.setNavmesh(this.navMesh);
        
        // Camara
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.fadeIn(600, 0, 0, 0); // todas las escenas empiezan con un fadeIn
        
        if (this.capaColisiones) this.physics.add.collider(this.player, this.capaColisiones);

        // Input generico de movimiento
        this.input.on('pointerdown', (pointer) => {
            const worldPoint = pointer.positionToCamera(this.cameras.main);
            const path = this.player.navMesh.findPath(
                { x: this.player.x, y: this.player.y },
                { x: worldPoint.x, y: worldPoint.y }
            );
            if (path && path.length > 0) this.player.setPath(path);
        });

        // Profundidad automatica
        this.events.on('update', () => {
            // Solo actualiza si el jugador existe y sigue activo
            if (this.player && this.player.active) {
                this.player.setDepth(this.player.y + 4);
            }
        });
    }

    // UI Y MENU DE PAUSA
    setupUI() {
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // Rescatamos el zoom de la camara
        const zoom = this.cameras.main.zoom;
        const w = this.scale.width;
        const h = this.scale.height;

        // Calculamos las coordenadas inversas para que encaje perfecto en la esquina con zoom
        const btnX = (w / 2) + ((w / 2) / zoom) - (25 / zoom);
        const btnY = (h / 2) - ((h / 2) / zoom) + (25 / zoom);

        // Creamos el boton
        this.pauseBtnBg = this.add.image(btnX, btnY, 'pauseBtn')
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5)
            .setScale(3 / zoom) 
            .setDepth(10000)
            .setScrollFactor(0);

        this.pauseBtnBg.on('pointerover', () => this.pauseBtnBg.setTexture('pauseBtnPressed'));
        this.pauseBtnBg.on('pointerout', () => this.pauseBtnBg.setTexture('pauseBtn'));
        
        this.pauseBtnBg.on('pointerdown', () => {
            this.sound.play('buttonSound', { volume: 0.2 });
            this.openPauseMenu();
        });

        this.events.on('update', () => {
            if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
                this.openPauseMenu();
            }
        });
    }

    crearObjetos(nombreCapaObjetos, configuracionFisicas) {
        const grupo = this.physics.add.staticGroup();
        const capa = this.map.getObjectLayer(nombreCapaObjetos);

        if (capa) {
            capa.objects.forEach(obj => {
                // Buscamos la configuracion de este objeto en el diccionario
                const config = configuracionFisicas[obj.name];
                
                if (config) {
                    // La key de la imagen (si no la hemos especificado, usamos el propio obj.name)
                    const imgKey = config.key || obj.name;

                    // Creamos el sprite para saber cuanto mide la imagen en realidad
                    const sprite = grupo.create(obj.x, obj.y, imgKey);

                    // Ajuste visual: Si Tiled no manda tamaño, usamos la mitad de la imagen.
                    const offsetX = config.spriteOffsetX !== undefined ? config.spriteOffsetX : (obj.width ? (obj.width / 2) : (sprite.width / 2));
                    sprite.x += offsetX;

                    // Aplicamos el origen y profundidad
                    sprite.setOrigin(0.5, 1).setDepth(obj.y);
                    sprite.tipoObjeto = obj.name;

                    if (obj.properties?.find(p => p.name === 'flipX')?.value) sprite.setFlipX(true);
                    sprite.refreshBody();

                    // Si configuramos 'centrarOffset: true', calcula desde el centro (para los arboles)
                    // Si no, lo calcula desde la izquierda (para las estructuras)
                    const anchoFisica = config.dw !== undefined ? sprite.width + config.dw : config.w;
                    const finalOffsetX = config.centrarOffset ? (sprite.width / 2) + config.ox : config.ox;
                    
                    sprite.body.setSize(anchoFisica, config.h).setOffset(finalOffsetX, sprite.height + config.oy);
                               
                    if (config.tOffsetY !== undefined) sprite.tOffsetY = config.tOffsetY;
                }
            });
        }
        this.physics.add.collider(this.player, grupo);
        
        return grupo; // Devolvemos el grupo por si la escena quiere añadir cosas
    }

    activarTransparencias(grupos) {
        this.events.on('update', () => {
            if (!this.player || !this.player.active) return;
            
            grupos.forEach(grupo => {
                if (!grupo || !grupo.children) return;
                
                grupo.getChildren().forEach(obj => {
                    if (!obj || !obj.active || !obj.width || !obj.height) return;

                    // Calculamos el centro exacto del objeto
                    const centroX = obj.x + (obj.originX === 0 ? obj.width / 2 : 0);
                    const dX = Math.abs(this.player.x - centroX);
                    
                    // Aplicamos el Offset si el objeto lo requiere
                    const offsetY = obj.tOffsetY || 5; 
                    const dY = (obj.y - offsetY) - this.player.y;
                    
                    let dif = false;
                    
                    // Formula generica que crea un cono detras de cualquier imagen
                    // dY > 0: El jugador esta por detras
                    // dX < ... : Crea una forma triangular basada en el ancho y alto del sprite
                    if (dY > 0 && dY < obj.height && dX < (obj.width * 0.6) * (1 - (dY / obj.height))) {
                        dif = true;
                    }
                    
                    obj.alpha += ((dif ? 0.4 : 1) - obj.alpha) * 0.1;
                });
            });
        });
    }

    openPauseMenu() {
        this.scene.launch("Menu", { parentScene: this.scene.key });
        this.scene.pause();
    }

    // Cambiar escena
    cambiarEscena(nuevaEscena, datos = {}) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.scene.start(nuevaEscena, datos);
    }

    // para el depth dinamico
    crearDecoracionDinamica(nombresCapasObjetos) {
        nombresCapasObjetos.forEach(nombreCapa => {
            const capa = this.map.getObjectLayer(nombreCapa);
            if (capa) {
                capa.objects.forEach(obj => {
                    const imgKey = obj.name; 
                    if (imgKey) {
                        const offsetCen = obj.width ? obj.width / 2 : 8; 
                        
                        const img = this.add.image(obj.x + offsetCen, obj.y, imgKey);
                        img.setOrigin(0.5, 1);
                        img.setDepth(obj.y - 7);
                    }
                });
            }
        });
    }
    // HOVER PARA LAS VALLAS Y LA PIEDRA
    hover(configuraciones) {
        this.input.on('pointermove', (pointer) => {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            let esInteractivo = false;

            // Calculamos a que distancia esta el raton del jugador
            const distancia = Phaser.Math.Distance.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);

            if (distancia <= 40) {
                for (const config of configuraciones) {
                    if (!config.capa) continue; // Si la capa no existe, pasamos a la siguiente
                    
                    const tile = config.capa.getTileAtWorldXY(worldPoint.x, worldPoint.y);
                    if (tile && config.ids.includes(tile.index)) {
                        esInteractivo = true;
                        break; // Si ya hemos encontrado algo interactivo, dejamos de buscar
                    }
                }
            }

            this.game.canvas.style.cursor = esInteractivo ? 'pointer' : 'default';
        });
    }

    debugTiles(configuracionesCapas) {
        this.input.on('pointerdown', (pointer) => {
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            
            configuracionesCapas.forEach(obj => {
                if (!obj.capa) return;
                const tile = obj.capa.getTileAtWorldXY(worldPoint.x, worldPoint.y);
                if (tile) console.log(`${obj.nombre} - ID:`, tile.index);
            });
        });
    }
    
    crearSistemaInteraccion(configuraciones, onInteract) {
         // Boton E
        this.teclaE_icono = this.add.image(0, 0, 'eBtn').setOrigin(0.5, 0.5).setDepth(10000).setVisible(false);
        this.estadoBotonE = false;

        // animacion del boton E (parpadeo)
        this.time.addEvent({
            delay: 400, loop: true,
            callback: () => {
                if (!this.teclaE_icono.visible) return; 
                this.estadoBotonE = !this.estadoBotonE;
                this.teclaE_icono.setTexture(this.estadoBotonE ? 'eBtnPressed' : 'eBtn');
            }
        });

        this.interactableCercano = null;

        this.events.on('update', () => {
            if (!this.sys || !this.sys.settings.active || !this.player || !this.player.active) return;
            
            const px = this.player.x;
            const py = this.player.y;
            const distMax = 40; 

            let tileMasCercano = null;
            let minDist = distMax;
            let tipoInteractable = null;
            let offsetBoton = { x: 0, y: 0 };

            for (const config of configuraciones) {
                // Para que no crashee
                if (!config.capa || !config.capa.scene) continue;
                // Si le pasamos una condicion y es falsa (la cueva ya esta abierta) lo ignoramos
                if (config.condicion !== undefined && !config.condicion()) continue;

                const tiles = config.capa.getTilesWithinWorldXY(px - distMax, py - distMax, distMax*2, distMax*2);
                tiles?.forEach(t => {
                    if (config.ids.includes(t.index)) {
                        const d = Phaser.Math.Distance.Between(px, py, t.pixelX + 8, t.pixelY + 8);
                        if (d < minDist) { 
                            minDist = d; 
                            tileMasCercano = t; 
                            tipoInteractable = config.tipo;
                            offsetBoton = { x: config.offsetX || 0, y: config.offsetY || 0 };
                        }
                    }
                });
            }

            if (tileMasCercano) {
                this.interactableCercano = { tile: tileMasCercano, tipo: tipoInteractable };
                this.teclaE_icono.setVisible(true);
                this.teclaE_icono.setPosition(tileMasCercano.pixelX + 8 + offsetBoton.x, tileMasCercano.pixelY + 8 + offsetBoton.y);
            } else {
                this.interactableCercano = null;
                this.teclaE_icono.setVisible(false);
                this.estadoBotonE = false;
                this.teclaE_icono.setTexture('eBtn');
            }
        });

        this.input.keyboard.on('keydown-E', () => {
            if (this.interactableCercano) {
                onInteract(this.interactableCercano.tipo, this.interactableCercano.tile);
            }
        });

        // Raton
        this.input.on('pointerdown', (pointer) => {
            if (!this.player || !this.player.active) return;
            
            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);

            if (dist > 40) return;

            for (const config of configuraciones) {
                if (!config.capa || !config.capa.scene) continue;
                if (config.condicion !== undefined && !config.condicion()) continue;

                const tile = config.capa.getTileAtWorldXY(worldPoint.x, worldPoint.y);
                // Si no tiene idsClic definidos usa los de la E
                const idsPermitidos = config.idsClic || config.ids; 

                if (tile && idsPermitidos.includes(tile.index)) {
                    onInteract(config.tipo, tile);
                    return;
                }
            }
        });
    }
}