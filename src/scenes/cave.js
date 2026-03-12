import Phaser from 'phaser';
import Player from '../game-objects/player.js';

export default class Cueva extends Phaser.Scene {
    constructor() {
        super({ key: 'cueva' }); 
    }

    preload() {}

    create() {
        var map = this.make.tilemap({ key: 'cueva' });

        var bonfireFish = map.addTilesetImage('bonfire Fish', 'bonfireFish');
        var caveWaterGroundAnimationsTiles = map.addTilesetImage('Cave Water Ground animations tiles', 'caveWaterGroundAnimationsTiles');
        var caves = map.addTilesetImage('Caves', 'caves');
        var chest = map.addTilesetImage('chest', 'chest');
        var dogBathtub = map.addTilesetImage('dog bathtub', 'dogBathtub');
        var entering = map.addTilesetImage('entering', 'entering');
        var exteriorBeach = map.addTilesetImage('Exterior Beach', 'exteriorBeach');
        var exterior = map.addTilesetImage('Exterior', 'exterior');
        var lamp = map.addTilesetImage('Lamp ', 'lamp');
        var lightEffect = map.addTilesetImage('Light Effect', 'lightEffect');
        var mineProps = map.addTilesetImage('Mine props', 'mineProps');
        var propsMine = map.addTilesetImage('Props Mine', 'propsMine');
        var stoneWithMinerals = map.addTilesetImage('stone with minerals', 'stoneWithMinerals');
        var tilesetGrassCaves = map.addTilesetImage('Tileset Grass Caves', 'tilesetGrassCaves');
        
        const tilesetsArray = [
            bonfireFish, caveWaterGroundAnimationsTiles, caves,
            chest, dogBathtub, entering, exteriorBeach, exterior,
            lamp, lightEffect, mineProps, propsMine,
            stoneWithMinerals, tilesetGrassCaves
        ];

        // CREAR CAPAS (De abajo hacia arriba)
        const capaAgua = map.createLayer('Agua/Agua', tilesetsArray, 0, 0);
        const capaDecoracionAgua = map.createLayer('Agua/Decoracion Agua', tilesetsArray, 0, 0);
        const capaRoca = map.createLayer('Suelo/Roca', tilesetsArray, 0, 0);
        const capaTierra = map.createLayer('Suelo/Tierra', tilesetsArray, 0, 0);
        const capaDecoracionSuelo = map.createLayer('Suelo/Decoracion Suelo', tilesetsArray, 0, 0);
        const capaParedes = map.createLayer('Vertical/Paredes', tilesetsArray, 0, 0);
        const capaVallas = map.createLayer('Vertical/Vallas', tilesetsArray, 0, 0);
        const capaDecoracionDetras = map.createLayer('Decoracion/Decoracion Detras', tilesetsArray, 0, 0);
        const capaDecoracion = map.createLayer('Decoracion/Decoracion', tilesetsArray, 0, 0);
        const capaDecoracionVallas = map.createLayer('Decoracion/Decoracion Vallas', tilesetsArray, 0, 0);
        const capaLamparas = map.createLayer('Decoracion/Lamparas', tilesetsArray, 0, 0);
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
        //Descomentar esto cuando queramos mirar la posición del jugador para colocar cosas
        //window.player = this.player;

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
    }

    update() {
        this.player.setDepth(this.player.y + 4);
    }
}