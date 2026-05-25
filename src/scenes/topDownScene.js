import Phaser from 'phaser';
import Player from '../game-objects/player.js';
import NPC from '../game-objects/topdownNPC.js';
import npcData from "../../assets/json/scriptedNpcs.json";
import GameState from "../state/GameState.js";

export default class TopDownScene extends Phaser.Scene {
    constructor(key) {
        super({ key });
    }

    // Metodo generico para inicializar mapas topDown
    initScene(mapKey) {
        this.game.canvas.style.cursor = 'default';
        this.game.canvas.classList.remove('cursor-far');
        
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

    setupPlayer(startX, startY, direccion = 'down') {
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
        this.player.zElevacion = 0; // Para el tema de las escaleras de la ciudad
        if (this.player.setDireccion) { this.player.setDireccion(direccion); }

        // Camara
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.fadeIn(600, 0, 0, 0); // todas las escenas empiezan con un fadeIn

        if (this.capaColisiones) {
            this.physics.add.collider(
                this.player,
                this.capaColisiones,
                null,
                () => { return this.player.zElevacion === 0; }, // Solo colisionas si no estas elevado (zElevacion)
                this
            );
        }

        // Input generico de movimiento
        this.input.on('pointerdown', (pointer, gameObjects) => {
            if (gameObjects && gameObjects.length > 0) {
                const tocandoUI = gameObjects.some(obj => obj.scrollFactorX === 0 || obj.scrollFactorY === 0);
                if (tocandoUI) return;
            }

            if (this.game.canvas.style.cursor === 'pointer') { // para evitar que el jugador se mueva al hacer click en un objeto interactivo,
            // el movimiento solo se activa si el cursor no es de interactuar
                if (this.player && this.player.setPath) {
                    this.player.setPath([]);
                    if (this.player.body) this.player.body.setVelocity(0, 0);
                }
                return;
            }

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
                this.player.setDepth(this.player.y + 4 + this.player.zElevacion);
            }
        });
    }

    setupDefaultFootstepSounds() {

        this.capaCamino =
            this.map.getLayer('Suelo/Camino')?.tilemapLayer;

        this.capaCesped =
            this.map.getLayer('Suelo/Cesped')?.tilemapLayer;

        this.capaTierra =
            this.map.getLayer('Suelo/Tierra')?.tilemapLayer;

        this.setupFootstepSounds({

            camino: {
                layer: this.capaCamino,
                key: 'tilesSound',
                volume: 2
            },

            cesped: {
                layer: this.capaCesped,
                key: 'grassSound',
                volume: 1
            },

            tierra: {
                layer: this.capaTierra,
                key: 'groundSound',
                volume: 1
            }
        });
    }

    setupFootstepSounds(config) {

        this.footstepConfigs = config;

        this.currentFootstep = null;

        Object.values(this.footstepConfigs).forEach(cfg => {

            cfg.sound = this.sound.add(cfg.key, {
                loop: true,
                volume: cfg.volume ?? 1
            });
        });

        // Limpiar sonidos
        this.events.on('shutdown', () => {

            Object.values(this.footstepConfigs).forEach(cfg => {
                cfg.sound.stop();
            });
        });
    }

    updateFootstepSounds() {

        if (!this.player || !this.footstepConfigs) return;

        const tileX =
            this.map.worldToTileX(this.player.x);

        const tileY =
            this.map.worldToTileY(this.player.y);

        const moviendose =
            this.player.body.speed > 0;

        let nuevoSonido = null;

        for (const cfg of Object.values(this.footstepConfigs)) {

            const enCapa =
                moviendose &&
                !!cfg.layer?.getTileAt(tileX, tileY);

            if (enCapa) {
                nuevoSonido = cfg;
                break;
            }
        }

        // Cambio de suelo
        if (this.currentFootstep !== nuevoSonido) {

            if (this.currentFootstep) {
                this.currentFootstep.sound.stop();
            }

            if (nuevoSonido) {
                nuevoSonido.sound.play();
            }

            this.currentFootstep = nuevoSonido;
        }

        // Parado
        if (!moviendose && this.currentFootstep) {

            this.currentFootstep.sound.stop();
            this.currentFootstep = null;
        }
    }

    update() {
        this.updateFootstepSounds();
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

    crearObjetos(nombreCapaObjetos, configuracionFisicas, elevacionExtra = 0) {
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

                    // La base real del objeto esta en (oy + h). Si no tiene fisicas, el ajuste es 0. Para objetos que tienen mucho espacio vacio debajo
                    const ajusteProfundidad = (config.oy !== undefined && config.h !== undefined) ? (config.oy + config.h) : 0;

                    // Aplicamos el origen y profundidad
                    sprite.setOrigin(0.5, 1).setDepth(obj.y + ajusteProfundidad + elevacionExtra);
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
            const px = this.player.x;
            const py = this.player.y + 4; // Ajustamos el punto de prueba al cuerpo del jugador

            grupos.forEach(grupo => {
                if (!grupo || !grupo.children) return;

                grupo.getChildren().forEach(obj => {
                    if (!obj || !obj.active || !obj.width || !obj.height) return;

                    let dif = false;

                    // Comprobamos si el jugador esta por detras del objeto (y menor que la base)
                    if (this.player.y < obj.y) {

                        // Calculamos los bordes reales de la imagen en el mundo
                        const scaleX = obj.scaleX || 1;
                        const scaleY = obj.scaleY || 1;
                        const left = obj.x - (obj.displayOriginX * scaleX);
                        const right = left + (obj.width * scaleX);
                        const top = obj.y - (obj.displayOriginY * scaleY);
                        const bottom = top + (obj.height * scaleY);

                        // Solo hacemos la prueba del pixel si el jugador esta dentro del cuadrado que ocupa la imagen (con un poco de margen)
                        if (px >= left - 3 && px <= right + 3 && py >= top - 3 && py <= bottom + 3) {

                            // Traducimos la posicion del mundo a las coordenadas de la foto (de 0 a Width)
                            let localX = Math.floor((px - left) / scaleX);
                            let localY = Math.floor((py - top) / scaleY);

                            // Si le hemos hecho un setFlipX a la imagen, invertimos la X
                            if (obj.flipX) { localX = obj.width - localX; }

                            const radio = 3; // por si el pixel exacto es transparente, miramos un poco alrededor
                            const paso = 4; // para no mirar cada pixel y optimizar (miramos cada 4 pixels, es suficiente para detectar si hay algo solido cerca)
                            let tocoObjeto = false;

                            for (let ix = -radio; ix <= radio; ix += paso) {
                                for (let iy = -radio; iy <= radio; iy += paso) {
                                    const checkX = localX + ix;
                                    const checkY = localY + iy;

                                    // Nos aseguramos de no buscar pixeles fuera de los bordes de la imagen
                                    if (checkX >= 0 && checkX < obj.width && checkY >= 0 && checkY < obj.height) {
                                        const pixelAlpha = this.textures.getPixelAlpha(checkX, checkY, obj.texture.key, obj.frame.name);

                                        if (pixelAlpha > 0) {
                                            tocoObjeto = true;
                                            break; // Si ya toco uno, paramos el bucle para ahorrar rendimiento
                                        }
                                    }
                                }
                                if (tocoObjeto) break;
                            }

                            // Si el radar detecto color, activamos la transparencia
                            if (tocoObjeto) { dif = true; }
                        }
                    }

                    // Aplicamos el cambio de transparencia de forma suave
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
        this.game.canvas.style.cursor = 'default'; // Por si cambiamos de escena mientras el cursor es de interactuar, lo reseteamos
        this.game.canvas.classList.remove('cursor-far');
        this.scene.start(nuevaEscena, datos);
    }

    // para el depth dinamico
    crearDecoracionDinamica(nombresCapasObjetos, elevacionExtra = 0) {
        nombresCapasObjetos.forEach(nombreCapa => {
            const capa = this.map.getObjectLayer(nombreCapa);
            if (capa) {
                capa.objects.forEach(obj => {
                    const imgKey = obj.name;
                    if (imgKey) {
                        const offsetCen = obj.width ? obj.width / 2 : 8;

                        const img = this.add.image(obj.x + offsetCen, obj.y, imgKey);
                        img.setOrigin(0.5, 1);
                        img.setDepth(obj.y - 7 + elevacionExtra);
                    }
                });
            }
        });
    }
    // HOVER PARA LAS VALLAS Y LA PIEDRA
    hover(configuraciones) {
        if (this.isTransitioning) return; // Evitamos configurar el hover si ya estamos en transicion, para no tener conflictos de escenas

        this.input.on('pointermove', (pointer, gameObjects) => {
            if (gameObjects && gameObjects.length > 0) {
                const tocandoUI = gameObjects.some(obj => obj.scrollFactorX === 0 || obj.scrollFactorY === 0);
                if (tocandoUI) {
                    this.game.canvas.classList.remove('cursor-far'); // Si el raton entra en un boton (menu de pausa), quitamos el cursor gris por si acaso
                    return;
                }
            }

            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            let configHovered = null;

            for (const config of configuraciones) {
                if (!config.capa) continue; // Si la capa no existe, pasamos a la siguiente

                if (config.condicion !== undefined && !config.condicion()) continue; // apaño para el riego

                const tile = config.capa.getTileAtWorldXY(worldPoint.x, worldPoint.y);
                if (tile && config.ids.includes(tile.index)) {
                    configHovered = config;
                    break; // Si ya hemos encontrado algo interactivo, dejamos de buscar
                }
            }

            let estaCerca = false;
            if (configHovered) {
                // Si el jugador ya esta cerca del objeto (detectado por la "E"), el cursor se pondra en pointer
                if (this.interactableCercano && this.interactableCercano.tipo === configHovered.tipo) estaCerca = true;
                else if (this.player && this.player.active) { // Si no calculamos a que distancia esta el raton del jugador
                    const distancia = Phaser.Math.Distance.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
                    if (distancia <= 40) estaCerca = true;
                }
                
            }

            if (configHovered) {
                if (estaCerca) {
                    this.game.canvas.style.cursor = 'pointer';
                    this.game.canvas.classList.remove('cursor-far');
                } else {
                    this.game.canvas.style.cursor = 'default';
                    this.game.canvas.classList.add('cursor-far');
                }
            } else {
                this.game.canvas.style.cursor = 'default';
                this.game.canvas.classList.remove('cursor-far');
            }
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
            let configMasCercana = null;

            for (const config of configuraciones) {
                // Para que no crashee
                if (!config.capa || !config.capa.scene) continue;
                // Si le pasamos una condicion y es falsa (la cueva ya esta abierta) lo ignoramos
                if (config.condicion !== undefined && !config.condicion()) continue;

                const tiles = config.capa.getTilesWithinWorldXY(px - distMax, py - distMax, distMax * 2, distMax * 2);
                tiles?.forEach(t => {
                    if (config.ids.includes(t.index)) {
                        const d = Phaser.Math.Distance.Between(px, py, t.pixelX + 8, t.pixelY + 8);
                        if (d < minDist) {
                            minDist = d;
                            tileMasCercano = t;
                            tipoInteractable = config.tipo;
                            offsetBoton = { x: config.offsetX || 0, y: config.offsetY || 0 };
                            configMasCercana = config;
                        }
                    }
                });
            }

            if (tileMasCercano) {
                this.interactableCercano = { tile: tileMasCercano, tipo: tipoInteractable };
                this.teclaE_icono.setVisible(true);
                if (configMasCercana.fixedEX !== undefined && configMasCercana.fixedEY !== undefined) {
                    this.teclaE_icono.setPosition(configMasCercana.fixedEX, configMasCercana.fixedEY);
                } else this.teclaE_icono.setPosition(tileMasCercano.pixelX + 8 + offsetBoton.x, tileMasCercano.pixelY + 8 + offsetBoton.y);
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

            for (const config of configuraciones) {
                if (!config.capa || !config.capa.scene) continue;
                if (config.condicion !== undefined && !config.condicion()) continue;

                const tile = config.capa.getTileAtWorldXY(worldPoint.x, worldPoint.y);
                // Si no tiene idsClic definidos usa los de la E
                const idsPermitidos = config.idsClic || config.ids;

                if (tile && idsPermitidos.includes(tile.index)) {
                    // Verificamos si la "E" ya mira este objeto (para interactuar aunque estemos clickando lejos)
                    if (this.interactableCercano && this.interactableCercano.tipo === config.tipo) {
                        onInteract(config.tipo, tile);
                    }
                    return;
                }
            }
        });
    }

    crearNPCs(nombreCapa = 'Objetos/NPCs') {

        this.npcs = [];

        const capaNPCs = this.map.getObjectLayer(nombreCapa);
        if (!capaNPCs) return;

        this.grupoNPCs = this.physics.add.staticGroup();

        capaNPCs.objects.forEach(obj => {

            const npcId = obj.name;
            const data = npcData[npcId];

            if (!data) {
                console.warn(`NPC '${npcId}' no existe en scriptedNpcs.json`);
                return;
            }

            if (GameState.specialNpcRecords[npcId] > 80 || npcId === "madre") {
                const npc = new NPC(this, obj.x, obj.y, npcId, data);
                this.npcs.push(npc);
                this.grupoNPCs.add(npc);
            }
        });

        this.physics.add.collider(this.player, this.grupoNPCs);
        this.crearSistemaInteraccionNPCs();
    }

    crearSistemaInteraccionNPCs() {

        // ── Icono E ────────────────────────────────────────────────────────────────
        this.teclaE_npc = this.add.image(0, 0, 'eBtn')
            .setOrigin(0.5)
            .setDepth(10000)
            .setVisible(false);

        this.estadoBotonENPC = false;

        this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
                if (!this.teclaE_npc.visible) return;
                this.estadoBotonENPC = !this.estadoBotonENPC;
                this.teclaE_npc.setTexture(this.estadoBotonENPC ? 'eBtnPressed' : 'eBtn');
            },
        });

        this.npcCercano = null;

        // ── Detección del NPC más cercano ──────────────────────────────────────────
        this.events.on('update', () => {

            if (!this.player || !this.player.active) return;

            // Si DialogueScene está activa, ocultamos el icono y no hacemos nada
            if (this.scene.manager.isActive("DialogueScene")) {
                this.teclaE_npc.setVisible(false);
                return;
            }

            let npcMasCercano = null;
            let minDist = 40;

            this.npcs?.forEach(npc => {
                if (!npc.active) return;
                const dist = Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, npc.x, npc.y
                );
                if (dist < minDist) { minDist = dist; npcMasCercano = npc; }
            });

            if (npcMasCercano) {
                this.npcCercano = npcMasCercano;
                this.teclaE_npc.setVisible(true);
                this.teclaE_npc.setPosition(npcMasCercano.x, npcMasCercano.y - 24);
            } else {
                this.npcCercano = null;
                this.teclaE_npc.setVisible(false);
                this.estadoBotonENPC = false;
                this.teclaE_npc.setTexture('eBtn');
            }
        });

        // ── Tecla E ────────────────────────────────────────────────────────────────
        this.input.keyboard.on('keydown-E', () => {
            if (!this.npcCercano) return;
            if (this.scene.manager.isActive("DialogueScene")) return;
            this.npcCercano.interact(this);
        });

        // ── Click ──────────────────────────────────────────────────────────────────
        this.input.on('pointerdown', (pointer) => {

            if (!this.player || !this.player.active) return;
            if (this.scene.manager.isActive("DialogueScene")) return;

            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const dist = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, worldPoint.x, worldPoint.y
            );
            if (dist > 40) return;

            this.npcs?.forEach(npc => {
                const bounds = npc.getBounds();
                if (Phaser.Geom.Rectangle.Contains(bounds, worldPoint.x, worldPoint.y)) {
                    this.npcCercano.interact(this);
                }
            });
        });
    }
}