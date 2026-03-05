import Phaser from 'phaser';

import Player from '../game-objects/player.js';

import allPropsSeasons from '../../assets/tiled/allPropsSeasons.png';
import bestFishPoint from '../../assets/tiled/bestFishPoint.png';
import deepForestStones from '../../assets/tiled/deepForestStones.png';
import duckMallad from '../../assets/tiled/duckMallad.png';
import extraVillageTilesets from '../../assets/tiled/extraVillageTilesets.png';
import fenceWood from '../../assets/tiled/fenceWood.png';
import halloweenContent from '../../assets/tiled/halloweenContent.png';
import mushroomTree from '../../assets/tiled/mushroomTree.png';
import pathTiles from '../../assets/tiled/pathTiles.png';
import pineTree from '../../assets/tiled/pineTree.png';
import propsWater from '../../assets/tiled/propsWater.png';
import road from '../../assets/tiled/road.png';
import stoneStructures from '../../assets/tiled/stoneStructures.png';
import stoneStructuresWater from '../../assets/tiled/stoneStructuresWater.png';
import temple from '../../assets/tiled/temple.png';
import tilesetGrassCliffTilesetSpring from '../../assets/tiled/tilesetGrassCliffTilesetSpring.png';
import tilesetGrassSpring from '../../assets/tiled/tilesetGrassSpring.png';
import tilesetGrassWaterSpring from '../../assets/tiled/tilesetGrassWaterSpring.png';
import treeTrunks from '../../assets/tiled/treeTrunks.png';
import waterGroundAnimationsTiles from '../../assets/tiled/waterGroundAnimationsTiles.png';
import player from '../../assets/tiled/run.png';
import casa from '../../assets/tiled/casa.json';

export default class House extends Phaser.Scene {
    constructor() {
        super({ key: 'house' }); 
    }

    preload() {
        this.load.image('player', player);
        this.load.image('allPropsSeasons', allPropsSeasons); 
        this.load.image('bestFishPoint', bestFishPoint);
        this.load.image('deepForestStones', deepForestStones);
        this.load.image('duckMallad', duckMallad);
        this.load.image('extraVillageTilesets', extraVillageTilesets);
        this.load.image('fenceWood', fenceWood);
        this.load.image('halloweenContent', halloweenContent);
        this.load.image('mushroomTree', mushroomTree);
        this.load.image('pathTiles', pathTiles);
        this.load.image('pineTree', pineTree);
        this.load.image('propsWater', propsWater);
        this.load.image('road', road);
        this.load.image('stoneStructures', stoneStructures);
        this.load.image('stoneStructuresWater', stoneStructuresWater);
        this.load.image('temple', temple);
        this.load.image('tilesetGrassCliffTilesetSpring', tilesetGrassCliffTilesetSpring);
        this.load.image('tilesetGrassSpring', tilesetGrassSpring);
        this.load.image('tilesetGrassWaterSpring', tilesetGrassWaterSpring);
        this.load.image('treeTrunks', treeTrunks);
        this.load.image('waterGroundAnimationsTiles', waterGroundAnimationsTiles);
        
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
        var mushroomTree = map.addTilesetImage('Mushroom Tree', 'mushroomTree');
        var pathTiles = map.addTilesetImage('Path tiles', 'pathTiles');
        var pineTree = map.addTilesetImage('Pine Tree copiar', 'pineTree');
        var propsWater = map.addTilesetImage('props water', 'propsWater');
        var road = map.addTilesetImage('Road', 'road');
        var stoneStructures = map.addTilesetImage('Stone structures', 'stoneStructures');
        var stoneStructuresWater = map.addTilesetImage('Stone structures Water', 'stoneStructuresWater');
        var temple = map.addTilesetImage('temple', 'temple');
        var tilesetGrassCliffTilesetSpring = map.addTilesetImage('Tileset Grass Cliff Tileset Spring', 'tilesetGrassCliffTilesetSpring');
        var tilesetGrassSpring = map.addTilesetImage('Tileset Grass Spring', 'tilesetGrassSpring');
        var tilesetGrassWaterSpring = map.addTilesetImage('Tileset Grass Water Spring', 'tilesetGrassWaterSpring');
        var treeTrunks = map.addTilesetImage('TREE TRUNKS copiar', 'treeTrunks');
        var waterGroundAnimationsTiles = map.addTilesetImage('Water Ground animations tiles', 'waterGroundAnimationsTiles');

        const tilesetsArray = [
            allPropsSeasons, bestFishPoint, deepForestStones, duckMallad, 
            extraVillageTilesets, fenceWood, halloweenContent, mushroomTree, 
            pathTiles, pineTree, propsWater, road, stoneStructures, 
            tilesetGrassSpring, tilesetGrassWaterSpring, treeTrunks, 
            waterGroundAnimationsTiles, stoneStructuresWater, temple, tilesetGrassCliffTilesetSpring
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
        const capaArbolesTapar= map.createLayer('Arboles/Arboles Tapar', tilesetsArray, 0, 0);
        const capaArboles = map.createLayer('Arboles/Arboles', tilesetsArray, 0, 0);
        const capaArbolesDelante = map.createLayer('Arboles/Arboles Delante', tilesetsArray, 0, 0);
        const capaArbolesEncima = map.createLayer('Arboles/Arboles Encima', tilesetsArray, 0, 0);
        const capaPilares = map.createLayer('Mas Colisiones/Pilares', tilesetsArray, 0, 0);
        const capaCasa = map.createLayer('Mas Colisiones/Casa', tilesetsArray, 0, 0);
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

        // CREAR AL JUGADOR
        this.player = new Player(this, 400, 300); 
        //TODO ver si esto funciona lo de seguir la camara
        this.cameras.main.startFollow(this.player);

        // CONFIGURAR PROFUNDIDADES (DEPTH / Z-INDEX)
        this.player.setDepth(10);
        
        capaArboles.setDepth(15);
        capaArbolesDelante.setDepth(15);
        capaArbolesEncima.setDepth(15);
        capaTapar.setDepth(15);

        // CONFIGURAR CAMARA Y LIMITES
        this.cameras.main.setZoom(2.5);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08); 
        
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // AÑADIR COLISION FISICA
        this.physics.add.collider(this.player, capaColisiones);
    }
}