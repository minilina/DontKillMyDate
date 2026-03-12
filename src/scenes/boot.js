import Phaser from 'phaser';

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

import letrero from '../../assets/tiled/letrero.png';
import bonfireFish from '../../assets/tiled/bonfireFish.png';
import caveWaterGroundAnimationsTiles from '../../assets/tiled/caveWaterGroundAnimationsTiles.png';
import caves from '../../assets/tiled/caves.png';
import chest from '../../assets/tiled/chest.png';
import dogBathtub from '../../assets/tiled/dogBathtub.png';
import entering from '../../assets/tiled/entering.png';
import exteriorBeach from '../../assets/tiled/exteriorBeach.png';
import exterior from '../../assets/tiled/exterior.png';
import lamp from '../../assets/tiled/lamp.png';
import lightEffect from '../../assets/tiled/lightEffect.png';
import mineProps from '../../assets/tiled/mineProps.png';
import propsMine from '../../assets/tiled/propsMine.png';
import stoneWithMinerals from '../../assets/tiled/stoneWithMinerals.png';
import tilesetGrassCaves from '../../assets/tiled/tilesetGrassCaves.png';

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
import cueva from '../../assets/tiled/cueva.json';

import customer from '../../assets/sprites/default.png';// (ALBA) esto se cambiará para que los clientes tengan sprites únicos, pero por ahora es un placeholder.
import customer2 from '../../assets/sprites/modelo_prueba_2.png';
// Ejemplos de futuras capas para generar los NPCS (ALBA):
// import npc_eyes_1 from '../../assets/sprites/ojos_1.png';
// import npc_hair_1 from '../../assets/sprites/pelo_1.png';
import fondo from '../../assets/sprites/fondo.jpg';



export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
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
        this.load.image('letrero', letrero);

        this.load.tilemapTiledJSON('casa', casa);

        this.load.image('bonfireFish', bonfireFish);
        this.load.image('caveWaterGroundAnimationsTiles', caveWaterGroundAnimationsTiles);
        this.load.image('caves', caves);
        this.load.image('chest', chest);
        this.load.image('dogBathtub', dogBathtub);
        this.load.image('entering', entering);
        this.load.image('exteriorBeach', exteriorBeach);
        this.load.image('exterior', exterior);
        this.load.image('lamp', lamp);
        this.load.image('lightEffect', lightEffect);
        this.load.image('mineProps', mineProps);
        this.load.image('propsMine', propsMine);
        this.load.image('stoneWithMinerals', stoneWithMinerals);
        this.load.image('tilesetGrassCaves', tilesetGrassCaves);

        this.load.tilemapTiledJSON('cueva', cueva);

        this.load.image('customer', customer);
        this.load.image('customer2', customer2);
        this.load.image('fondo', fondo);
         // Aquí puedes añadir barra de progreso si quieres
    }

    create() {
        this.scene.start('Letter'); // ⚡ siguiente escena
    }
}