import Phaser from 'phaser';

// IMPORTANTE: Asegúrate de que la ruta hacia tu Player.js es correcta
import Player from './Player.js'; 

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
import player from  '../../assets/tiled/run.png'
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

        const capaAgua = map.createLayer('Agua', tilesetsArray, 0, 0);
        const capaAgua2 = map.createLayer('Agua 2', tilesetsArray, 0, 0);
        const capaDecoracionAgua = map.createLayer('Decoracion Agua', tilesetsArray, 0, 0);
        const capaDecoracionAgua2 = map.createLayer('Decoracion Agua 2', tilesetsArray, 0, 0);
        const capaTierra = map.createLayer('Tierra', tilesetsArray, 0, 0);
        const capaCamino = map.createLayer('Camino', tilesetsArray, 0, 0);
        const capaCesped = map.createLayer('Cesped', tilesetsArray, 0, 0);
        const capaFondo = map.createLayer('Fondo', tilesetsArray, 0, 0);
        const capaDecoracionCesped = map.createLayer('Decoracion Cesped', tilesetsArray, 0, 0);
        const capaColision = map.createLayer('Colision', tilesetsArray, 0, 0);
        const capaVallas = map.createLayer('Vallas', tilesetsArray, 0, 0);
        const capaMuro = map.createLayer('Muro', tilesetsArray, 0, 0);
        const capaEscalera = map.createLayer('Escalera', tilesetsArray, 0, 0);
        const capaArboles = map.createLayer('Arboles', tilesetsArray, 0, 0);
        const capaArbolesDelante = map.createLayer('Arboles Delante', tilesetsArray, 0, 0);
        const capaArbolesEncima = map.createLayer('Arboles Encima', tilesetsArray, 0, 0);
        const capaPilares = map.createLayer('Pilares', tilesetsArray, 0, 0);
        const capaCasa = map.createLayer('Casa', tilesetsArray, 0, 0);
        const capaCasaColision = map.createLayer('Casa Colision', tilesetsArray, 0, 0);
        const capaPiedras = map.createLayer('Piedras', tilesetsArray, 0, 0);
        const capaColisiones2 = map.createLayer('Colisiones 2', tilesetsArray, 0, 0);
        const capaHierbaEncima = map.createLayer('Hierba Encima', tilesetsArray, 0, 0);
        const capaAnimales = map.createLayer('Animales', tilesetsArray, 0, 0);

        // ACTIVAR COLISIONES EN LOS TILES
        capaAgua.setCollisionByExclusion([-1]);
        capaFondo.setCollisionByExclusion([-1]);
        capaColision.setCollisionByExclusion([-1]);
        capaVallas.setCollisionByExclusion([-1]);
        capaMuro.setCollisionByExclusion([-1]);
        capaPilares.setCollisionByExclusion([-1]);
        capaCasaColision.setCollisionByExclusion([-1]); // CAMBIO APLICADO
        capaPiedras.setCollisionByExclusion([-1]);
        capaColisiones2.setCollisionByExclusion([-1]);
        capaAnimales.setCollisionByExclusion([-1]);

        // 3. CREAR AL JUGADOR
        // Se instancia pasándole esta escena (this) y las coordenadas X e Y
        this.player = new Player(this, 400, 300); 

        // 4. CONFIGURAR PROFUNDIDADES (DEPTH / Z-INDEX)
        // Hacemos que el jugador pase por DEBAJO de los techos y copas de los árboles
        this.player.setDepth(10);
        capaArbolesEncima.setDepth(15);
        capaArbolesDelante.setDepth(15);
        capaArboles.setDepth(15);
        capaCasa.setDepth(15); 

        // 5. CONFIGURAR CÁMARA Y LÍMITES
        this.cameras.main.setZoom(2.5); // Nivel de Zoom estilo Stardew Valley
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08); // Seguimiento suave
        
        // Evitamos que la cámara y el jugador salgan del mundo
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // 6. AÑADIR COLISIONES FÍSICAS (JUGADOR vs CAPAS)
        this.physics.add.collider(this.player, capaAgua);
        this.physics.add.collider(this.player, capaFondo);
        this.physics.add.collider(this.player, capaColision);
        this.physics.add.collider(this.player, capaVallas);
        this.physics.add.collider(this.player, capaMuro);
        this.physics.add.collider(this.player, capaPilares);
        this.physics.add.collider(this.player, capaCasaColision);
        this.physics.add.collider(this.player, capaPiedras);
        this.physics.add.collider(this.player, capaColisiones2);
        this.physics.add.collider(this.player, capaAnimales);
    }
}