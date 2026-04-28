import Phaser from 'phaser';
import Player from '../game-objects/player.js';
import GameState from '../state/GameState.js'; // Importante para leer la reputación

export default class Ciudad extends Phaser.Scene {
    constructor() {
        super({ key: 'ciudad' });
    }

    preload() { }

    create(data = {}) {
        // ELEGIR EL MAPA SEGUN LA REPUTACION
        let mapKey = 'ciudad_normal'; 
        if (GameState.reputation > 70) {
            mapKey = 'ciudad_lujo';
        } else if (GameState.reputation < 30) {
            mapKey = 'ciudad_pobre';
        }

        var map = this.make.tilemap({ key: mapKey });

        // 2. CARGAR TILESETS 
        // (Ajusta estos nombres según los que hayas puesto en tu Tiled de la ciudad)
        var allPropsSeasons = map.addTilesetImage('ALL props seasons', 'allPropsSeasons');
        var pathTiles = map.addTilesetImage('Path tiles', 'pathTiles');
        var road = map.addTilesetImage('Road', 'road');
        // Añade aquí el resto de tilesets que use tu ciudad...

        const tilesetsArray = [
            allPropsSeasons, pathTiles, road
        ];

        // 3. CREAR CAPAS (Ajusta los nombres según tu Tiled)
        const capaSuelo = map.createLayer('Suelo', tilesetsArray, 0, 0);
        const capaDecoracion = map.createLayer('Decoracion', tilesetsArray, 0, 0);
        const capaColisiones = map.createLayer('Colisiones', tilesetsArray, 0, 0);

        // ACTIVAR COLISIONES Y OCULTARLAS
        capaColisiones.setCollisionByExclusion([-1]);
        capaColisiones.setVisible(false);

        // 4. NAVMESH
        this.navMesh = this.navMeshPlugin.buildMeshFromTilemap("mesh", map, [capaColisiones], null, 4.5);

        // ANIMACION DE LAS TILES
        if (this.animatedTiles) {
            this.animatedTiles.init(map);
            this.animatedTiles.setRate(0.5);
        }

        // 5. CREAR AL JUGADOR
        // Si venimos de la casa, data.spawnX existirá. Si no, usamos valores por defecto.
        const startX = data.spawnX !== undefined ? data.spawnX : 400;
        const startY = data.spawnY !== undefined ? data.spawnY : 400;

        this.player = new Player(this, startX, startY);
        this.player.setNavmesh(this.navMesh);

        // MOVIMIENTO CON CLIC (Igual que en la casa)
        this.input.on('pointerdown', (pointer) => {
            const worldPoint = pointer.positionToCamera(this.cameras.main);
            const path = this.player.navMesh.findPath(
                { x: this.player.x, y: this.player.y },
                { x: worldPoint.x, y: worldPoint.y }
            );

            if (path && path.length > 0) {
                this.player.setPath(path);
            }
        });

        // 6. CONFIGURAR CÁMARA Y FÍSICAS
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.physics.add.collider(this.player, capaColisiones);

        // PAUSA
        this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        this.isTransitioning = false; // Nuestro cerrojo anti-bugs

        // ==========================================
        // 7. ZONA DE SALIDA (VOLVER A LA CASA)
        // ==========================================
        
        // Creamos una alfombra invisible en la parte superior o inferior del mapa.
        // Aquí la he puesto en la parte de ARRIBA (Y: 20) asumiendo que vas hacia el norte para volver a casa.
        const zonaSalidaCasa = this.add.zone(map.widthInPixels / 2, 20, map.widthInPixels, 40).setOrigin(0.5, 0.5);
        this.physics.add.existing(zonaSalidaCasa, true);

        this.physics.add.overlap(this.player, zonaSalidaCasa, () => {
            if (this.isTransitioning) return;
            this.isTransitioning = true;
            
            // Volvemos a la casa y aparecemos en la parte inferior del mapa
            this.scene.start('house', { 
                spawnX: 400, 
                spawnY: 800 // Pon aquí la Y que corresponda a la parte de abajo de tu casa
            });
        });
    }

    update() {
        this.player.setDepth(this.player.y + 4);

        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.openPauseMenu();
        }
    }

    openPauseMenu() {
        this.scene.launch("Menu", { parentScene: this.scene.key });
        this.scene.pause();
    }
}