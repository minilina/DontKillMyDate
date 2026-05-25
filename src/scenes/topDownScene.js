import Phaser from 'phaser';
import Player from '../game-objects/player.js';
import NPC from '../game-objects/topdownNPC.js';
import npcData from "../../assets/json/scriptedNpcs.json";
import GameState from "../state/GameState.js";

export default class TopDownScene extends Phaser.Scene {
    constructor(key) {
        super({ key });
    }

    // ==========================================
    // INICIALIZACIÓN DE ESCENA Y MAPA
    // ==========================================
    initScene(mapKey) {
        this.game.canvas.style.cursor = 'default';
        this.game.canvas.classList.remove('cursor-far');
        
        this.map = this.make.tilemap({ key: mapKey });
        this.isTransitioning = false;

        const tilesetsArray = this.map.tilesets.map(tileset => {
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

        // Animaciones de Tiles
        if (this.animatedTiles) {
            this.animatedTiles.init(this.map);
            this.animatedTiles.setRate(0.5);
        }

        return { map: this.map, tilesets: tilesetsArray };
    }

    setupPlayer(startX, startY, direccion = 'down') {
        if (this.capaColisiones) {
            this.navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh", this.map, [this.capaColisiones], null, 4.5);
        }

        // Jugador
        this.player = new Player(this, startX, startY);
        if (this.navMesh) this.player.setNavmesh(this.navMesh);
        this.player.zElevacion = 0;
        if (this.player.setDireccion) { this.player.setDireccion(direccion); }

        // Cámara
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.fadeIn(600, 0, 0, 0);

        if (this.capaColisiones) {
            this.physics.add.collider(
                this.player,
                this.capaColisiones,
                null,
                () => { return this.player.zElevacion === 0; },
                this
            );
        }

        // Input genérico de movimiento (NavMesh click)
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

        // Profundidad automática (Z-sorting)
        this.events.on('update', () => {
            if (this.player && this.player.active) {
                this.player.setDepth(this.player.y + 4 + this.player.zElevacion);
            }
        });
    }

    // ==========================================
    // SISTEMA DE PASOS (FOOTSTEPS)
    // ==========================================
    setupFootstepSounds(configs) {
        // Guardamos las configuraciones pasadas por parámetro
        this.footstepConfigs = configs;
        this.currentFootstep = null;

        // Instanciamos físicamente los audios en Phaser y los guardamos en su config
        for (const key of Object.keys(this.footstepConfigs)) {
            const cfg = this.footstepConfigs[key];
            cfg.sound = this.sound.add(cfg.key, { loop: true, volume: cfg.volume || 1 });
        }

        // Limpieza al salir de la escena
        this.events.on('shutdown', () => {
            for (const cfg of Object.values(this.footstepConfigs || {})) {
                if (cfg.sound) cfg.sound.stop();
            }
        });
    }

    setupDefaultFootstepSounds() {
        this.capaCamino = this.map.getLayer('Suelo/Camino')?.tilemapLayer;
        this.capaCesped = this.map.getLayer('Suelo/Cesped')?.tilemapLayer;
        this.capaTierra = this.map.getLayer('Suelo/Tierra')?.tilemapLayer;
        this.capaRoca = this.map.getLayer('Suelo/Roca')?.tilemapLayer;
        this.capaAgua = this.map.getLayer('Agua/Agua')?.tilemapLayer;

        // Ahora este método ya existe abajo y procesará la info correctamente
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
                layer: [this.capaTierra, this.capaRoca].filter(Boolean),
                key: 'groundSound',
                volume: 1
            }
        });
    }

    updateFootstepSounds() {
        if (!this.player || !this.player.active || !this.footstepConfigs || !this.map) return;

        const tileX = this.map.worldToTileX(this.player.x);
        const tileY = this.map.worldToTileY(this.player.y);
        const moviendose = this.player.body && this.player.body.speed > 0;

        let nuevoSonido = null;

        for (const cfg of Object.values(this.footstepConfigs)) {
            if (!moviendose || !cfg.layer) continue;

            const capas = Array.isArray(cfg.layer) ? cfg.layer : [cfg.layer];
            const enCapa = capas.some(capa => !!capa.getTileAt(tileX, tileY));

            if (enCapa) {
                nuevoSonido = cfg;
                break;
            }
        }

        if (this.currentFootstep !== nuevoSonido) {
            if (this.currentFootstep && this.currentFootstep.sound) {
                this.currentFootstep.sound.stop();
            }

            if (nuevoSonido && nuevoSonido.sound) {
                nuevoSonido.sound.play();
            }

            this.currentFootstep = nuevoSonido;
        }

        if (!moviendose && this.currentFootstep) {
            if (this.currentFootstep.sound) this.currentFootstep.sound.stop();
            this.currentFootstep = null;
        }
    }

    // ==========================================
    // AUDIO AMBIENTAL (AGUA CON CRUISE-CONTROL)
    // ==========================================
    setupAmbientWaterSound(audioKey, maxDistance = 120, maxVolume = 0.05) {
        if (!this.capaAgua && this.map) {
            this.capaAgua = this.map.getLayer('Agua/Agua')?.tilemapLayer;
        }
        if (!this.capaAgua) return;

        this.waterMaxDistance = maxDistance;
        this.waterMaxVolume = maxVolume;

        // Cargamos los audios con volumen 0 puro, pausados.
        this.waterSound1 = this.sound.add(audioKey, { loop: true, volume: 0 });
        this.waterSound2 = this.sound.add(audioKey, { loop: true, volume: 0 });
        this.waterSound2Desfasado = false;

        this.events.on('shutdown', () => {
            if (this.waterSound1) this.waterSound1.stop();
            if (this.waterSound2) this.waterSound2.stop();
        });
    }

    updateAmbientWaterSound() {
        if (!this.player || !this.player.active || !this.capaAgua || !this.waterSound1) return;

        const px = this.player.x;
        const py = this.player.y;

        const maxDist = (this.waterMaxDistance && this.waterMaxDistance > 0) ? this.waterMaxDistance : 120;
        const maxVol = typeof this.waterMaxVolume === 'number' ? this.waterMaxVolume : 0.7;

        const tilesCercanos = this.capaAgua.getTilesWithinWorldXY(
            px - maxDist,
            py - maxDist,
            maxDist * 2,
            maxDist * 2,
            { isNotEmpty: true }
        );

        let distanciaMinima = maxDist;

        if (tilesCercanos && tilesCercanos.length > 0) {
            tilesCercanos.forEach(tile => {
                const tileCenterX = tile.pixelX + (tile.width / 2);
                const tileCenterY = tile.pixelY + (tile.height / 2);
                const dist = Phaser.Math.Distance.Between(px, py, tileCenterX, tileCenterY);

                if (dist < distanciaMinima) {
                    distanciaMinima = dist;
                }
            });
        }

        let volumenObjetivo = 0;
        if (distanciaMinima < maxDist) {
            volumenObjetivo = (1 - (distanciaMinima / maxDist)) * maxVol;
        }

        if (!Number.isFinite(volumenObjetivo) || Number.isNaN(volumenObjetivo)) {
            volumenObjetivo = 0;
        }
        volumenObjetivo = Phaser.Math.Clamp(volumenObjetivo, 0, maxVol);

        // Gestión de encendido dinámico perimetral (Evita soplidos de carga)
        if (volumenObjetivo > 0) {
            if (!this.waterSound1.isPlaying) {
                this.waterSound1.setVolume(0);
                this.waterSound1.play();
            }

            if (!this.waterSound2.isPlaying && !this.waterSound2Desfasado) {
                this.waterSound2Desfasado = true;
                this.time.delayedCall(1500, () => {
                    if (this.waterSound2 && !this.waterSound2.isPlaying && this.waterSound1?.isPlaying) {
                        this.waterSound2.setVolume(0);
                        this.waterSound2.play();
                    }
                    this.waterSound2Desfasado = false;
                });
            }
        } else {
            if (this.waterSound1.isPlaying) this.waterSound1.stop();
            if (this.waterSound2.isPlaying) this.waterSound2.stop();
        }

        // Interpolación fluida
        [this.waterSound1, this.waterSound2].forEach(sound => {
            if (sound && sound.isPlaying) {
                const volActual = sound.volume;
                const diferencia = volumenObjetivo - volActual;

                if (Math.abs(diferencia) > 0.01) {
                    const nuevoVolumen = volActual + diferencia * 0.05;
                    if (Number.isFinite(nuevoVolumen)) {
                        sound.setVolume(Phaser.Math.Clamp(nuevoVolumen, 0, maxVol));
                    }
                } else if (volActual !== volumenObjetivo) {
                    sound.setVolume(volumenObjetivo);
                }
            }
        });
    }

    // ==========================================
    // SISTEMA DE INTERACCIONES Y UI
    // ==========================================
    setupUI() {
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        const zoom = this.cameras.main.zoom;
        const w = this.scale.width;
        const h = this.scale.height;

        const btnX = (w / 2) + ((w / 2) / zoom) - (25 / zoom);
        const btnY = (h / 2) - ((h / 2) / zoom) + (25 / zoom);

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
                const config = configuracionFisicas[obj.name];

                if (config) {
                    const imgKey = config.key || obj.name;
                    const sprite = grupo.create(obj.x, obj.y, imgKey);

                    const offsetX = config.spriteOffsetX !== undefined ? config.spriteOffsetX : (obj.width ? (obj.width / 2) : (sprite.width / 2));
                    sprite.x += offsetX;

                    // La base real del objeto esta en (oy + h). Si no tiene fisicas, el ajuste es 0. Para objetos que tienen mucho espacio vacio debajo
                    const ajusteProfundidad = (config.oy !== undefined && config.h !== undefined) ? (config.oy + config.h) : 0;

                    // Aplicamos el origen y profundidad
                    sprite.setOrigin(0.5, 1).setDepth(obj.y + ajusteProfundidad + elevacionExtra);
                    sprite.tipoObjeto = obj.name;

                    if (obj.properties?.find(p => p.name === 'flipX')?.value) sprite.setFlipX(true);
                    sprite.refreshBody();

                    const anchoFisica = config.dw !== undefined ? sprite.width + config.dw : config.w;
                    const finalOffsetX = config.centrarOffset ? (sprite.width / 2) + config.ox : config.ox;

                    sprite.body.setSize(anchoFisica, config.h).setOffset(finalOffsetX, sprite.height + config.oy);

                    if (config.tOffsetY !== undefined) sprite.tOffsetY = config.tOffsetY;
                }
            });
        }
        this.physics.add.collider(this.player, grupo);
        return grupo;
    }

    activarTransparencias(grupos) {
        this.events.on('update', () => {
            if (!this.player || !this.player.active) return;
            const px = this.player.x;
            const py = this.player.y + 4;

            grupos.forEach(grupo => {
                if (!grupo || !grupo.children) return;

                grupo.getChildren().forEach(obj => {
                    if (!obj || !obj.active || !obj.width || !obj.height) return;

                    let dif = false;

                    if (this.player.y < obj.y) {
                        const scaleX = obj.scaleX || 1;
                        const scaleY = obj.scaleY || 1;
                        const left = obj.x - (obj.displayOriginX * scaleX);
                        const right = left + (obj.width * scaleX);
                        const top = obj.y - (obj.displayOriginY * scaleY);
                        const bottom = top + (obj.height * scaleY);

                        if (px >= left - 3 && px <= right + 3 && py >= top - 3 && py <= bottom + 3) {
                            let localX = Math.floor((px - left) / scaleX);
                            let localY = Math.floor((py - top) / scaleY);

                            if (obj.flipX) { localX = obj.width - localX; }

                            const radio = 3;
                            const paso = 4;
                            let tocoObjeto = false;

                            for (let ix = -radio; ix <= radio; ix += paso) {
                                for (let iy = -radio; iy <= radio; iy += paso) {
                                    const checkX = localX + ix;
                                    const checkY = localY + iy;

                                    if (checkX >= 0 && checkX < obj.width && checkY >= 0 && checkY < obj.height) {
                                        const pixelAlpha = this.textures.getPixelAlpha(checkX, checkY, obj.texture.key, obj.frame.name);

                                        if (pixelAlpha > 0) {
                                            tocoObjeto = true;
                                            break;
                                        }
                                    }
                                }
                                if (tocoObjeto) break;
                            }

                            if (tocoObjeto) { dif = true; }
                        }
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

    cambiarEscena(nuevaEscena, datos = {}) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.game.canvas.style.cursor = 'default'; // Por si cambiamos de escena mientras el cursor es de interactuar, lo reseteamos
        this.game.canvas.classList.remove('cursor-far');
        this.scene.start(nuevaEscena, datos);
    }

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
        this.teclaE_icono = this.add.image(0, 0, 'eBtn').setOrigin(0.5, 0.5).setDepth(10000).setVisible(false);
        this.estadoBotonE = false;

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
                if (!config.capa || !config.capa.scene) continue;
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

        this.input.on('pointerdown', (pointer) => {
            if (!this.player || !this.player.active) return;

            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);

            for (const config of configuraciones) {
                if (!config.capa || !config.capa.scene) continue;
                if (config.condicion !== undefined && !config.condicion()) continue;

                const tile = config.capa.getTileAtWorldXY(worldPoint.x, worldPoint.y);
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

    // ==========================================
    // SISTEMA DE INTERACCIÓN CON NPCs
    // ==========================================
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
        this.teclaE_npc = this.add.image(0, 0, 'eBtn').setOrigin(0.5).setDepth(10000).setVisible(false);
        this.estadoBotonENPC = false;

        this.time.addEvent({
            delay: 400, loop: true,
            callback: () => {
                if (!this.teclaE_npc.visible) return;
                this.estadoBotonENPC = !this.estadoBotonENPC;
                this.teclaE_npc.setTexture(this.estadoBotonENPC ? 'eBtnPressed' : 'eBtn');
            },
        });

        this.npcCercano = null;

        this.events.on('update', () => {
            if (!this.player || !this.player.active) return;

            if (this.scene.manager.isActive("DialogueScene")) {
                this.teclaE_npc.setVisible(false);
                return;
            }

            let npcMasCercano = null;
            let minDist = 40;

            this.npcs?.forEach(npc => {
                if (!npc.active) return;
                const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y);
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

        this.input.keyboard.on('keydown-E', () => {
            if (!this.npcCercano) return;
            if (this.scene.manager.isActive("DialogueScene")) return;
            this.npcCercano.interact(this);
        });

        this.input.on('pointerdown', (pointer) => {
            if (!this.player || !this.player.active) return;
            if (this.scene.manager.isActive("DialogueScene")) return;

            const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
            const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, worldPoint.x, worldPoint.y);
            if (dist > 40) return;

            this.npcs?.forEach(npc => {
                const bounds = npc.getBounds();
                if (Phaser.Geom.Rectangle.Contains(bounds, worldPoint.x, worldPoint.y)) {
                    npc.interact(this);
                }
            });
        });
    }

    // Loop central del juego
    update() {
        this.updateFootstepSounds();
        this.updateAmbientWaterSound();
    }
}