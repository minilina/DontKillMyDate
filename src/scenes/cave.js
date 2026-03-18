import Phaser from 'phaser';
import Player from '../game-objects/player.js';

export default class Cueva extends Phaser.Scene {
    constructor() {
        super({ key: 'cueva' });
    }

    preload() { }

    create() {
        var map = this.make.tilemap({ key: 'cueva' });

        var allPropsSeasons = map.addTilesetImage('ALL props seasons', 'allPropsSeasons');
        var bonfireFish = map.addTilesetImage('bonfire Fish', 'bonfireFish');
        var caveWaterGroundAnimationsTiles = map.addTilesetImage('Cave Water Ground animations tiles', 'caveWaterGroundAnimationsTiles');
        var caves = map.addTilesetImage('Caves', 'caves');
        var chest = map.addTilesetImage('chest', 'chest');
        var entering = map.addTilesetImage('entering', 'entering');
        var exteriorBeach = map.addTilesetImage('Exterior Beach', 'exteriorBeach');
        var exterior = map.addTilesetImage('Exterior', 'exterior');
        var lightEffect = map.addTilesetImage('Light Effect', 'lightEffect');
        var mineProps = map.addTilesetImage('Mine props', 'mineProps');
        var pathTiles = map.addTilesetImage('pathTiles', 'pathTiles');
        var propsMine = map.addTilesetImage('Props Mine', 'propsMine');
        var stoneWithMinerals = map.addTilesetImage('stone with minerals', 'stoneWithMinerals');
        var tilesetGrassCaves = map.addTilesetImage('Tileset Grass Caves', 'tilesetGrassCaves');        

        const tilesetsArray = [
            allPropsSeasons, bonfireFish, caveWaterGroundAnimationsTiles, caves,
            chest, entering, exteriorBeach, exterior,
            lightEffect, mineProps, pathTiles, propsMine,
            stoneWithMinerals, tilesetGrassCaves
        ];

        //Pausa
        this.pauseKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

        // CREAR CAPAS (De abajo hacia arriba)
        const capaAgua = map.createLayer('Agua/Agua', tilesetsArray, 0, 0);
        const capaDecoracionAgua = map.createLayer('Agua/Decoracion Agua', tilesetsArray, 0, 0);
        const capaRoca = map.createLayer('Suelo/Roca', tilesetsArray, 0, 0);
        const capaTierra = map.createLayer('Suelo/Tierra', tilesetsArray, 0, 0);
        const capaDecoracionSuelo = map.createLayer('Suelo/Decoracion Suelo', tilesetsArray, 0, 0);
        const capaParedes = map.createLayer('Vertical/Paredes', tilesetsArray, 0, 0);
        const capaVallas = map.createLayer('Vertical/Vallas', tilesetsArray, 0, 0);
        const capaDecoracion = map.createLayer('Decoracion/Decoracion', tilesetsArray, 0, 0);
        const capaDecoracionVallas = map.createLayer('Decoracion/Decoracion Vallas', tilesetsArray, 0, 0);
        const capaEfectos = map.createLayer('Decoracion/Efectos', tilesetsArray, 0, 0);
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
        this.player = new Player(this, 168, 305);
        // Descomentar esto cuando queramos mirar la posición del jugador para colocar cosas
        // window.player = this.player;

        // CONFIGURAR CAMARA Y LIMITES
        this.cameras.main.setZoom(3);
        this.cameras.main.roundPixels = true;
        this.cameras.main.startFollow(this.player);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // AÑADIR COLISION FISICA
        this.physics.add.collider(this.player, capaColisiones);

        // FUNDIDO A NEGRO AL ENTRAR
        this.cameras.main.fadeIn(1000, 0, 0, 0);

        // CREACION DE OBJETOS DINAMICOS
        this.grupoCosas = this.physics.add.staticGroup();
        const capaSpawn = map.getObjectLayer('spawnCosas');

        if (capaSpawn) {
            const imagenesCueva = {
                'barril': 'barril',
                'lampara': 'lamp', 
                'topo': 'caves', // Le ponemos una imagen cualquiera, luego lo hacemos invisible
                'cesto': 'chest',         
                'tendedero': 'dogBathtub', 
                'fuego': 'caves' // Le ponemos una imagen cualquiera, luego lo hacemos invisible
            };

            capaSpawn.objects.forEach(obj => {
                const nombre = obj.name || 'lampara'; // Si no tiene nombre, sera una lampara por defecto

                if (imagenesCueva[nombre]) {
                    const imagenKey = imagenesCueva[nombre];
                    
                    const objeto = this.grupoCosas.create(obj.x + 8, obj.y, imagenKey);
                    objeto.setOrigin(0.5, 1);
                    objeto.setDepth(objeto.y);
                    objeto.tipoObjeto = nombre;

                    if (nombre === 'fuego' || nombre === 'topo') {
                        objeto.setVisible(false);
                    }

                    objeto.refreshBody();

                    // AJUSTE DE COLISIONES (¡Todo usa 'objeto' ahora!)
                    if (nombre === 'lampara') {
                        objeto.body.setSize(10, 10);
                        objeto.body.setOffset((objeto.width / 2) - 5, objeto.height - 10);
                    } 
                    else if (nombre === 'barril' || nombre === 'cesto') {
                        objeto.body.setSize(14, 10);
                        objeto.body.setOffset((objeto.width / 2) - 7, objeto.height - 10);
                    } 
                    else if (nombre === 'fuego') {
                        objeto.body.setSize(20, 16);
                        objeto.body.setOffset((objeto.width / 2) - 10, objeto.height - 16);
                    }
                    else if (nombre === 'tendedero') {
                        objeto.body.setSize(30, 10);
                        objeto.body.setOffset((objeto.width / 2) - 15, objeto.height - 10);
                    }
                    else if (nombre === 'topo') {
                        objeto.body.setSize(16, 12);
                        objeto.body.setOffset((objeto.width / 2) - 8, objeto.height - 12);
                    }
                }
            });
        }
        
        this.physics.add.collider(this.player, this.grupoCosas);
    }

    update() {
        this.player.setDepth(this.player.y + 4);

        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.openPauseMenu();
        }
    }
    openPauseMenu() {
        this.scene.launch('Menu', { parentScene: this.scene.key });
        this.scene.pause();
    }
}