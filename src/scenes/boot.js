import Phaser from 'phaser';

// sprites mapa top-down
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


// sprites escena tienda
import store from '../../assets/sprites/store.jpg';
import customer from '../../assets/sprites/modelo_prueba_1.png'; // (ALBA) esto se cambiará para que los clientes tengan sprites únicos, pero por ahora es un placeholder.
import customer2 from '../../assets/sprites/modelo_prueba_2.png';
// Ejemplos de futuras capas para generar los NPCS (ALBA):
// import npc_eyes_1 from '../../assets/sprites/ojos_1.png';
// import npc_hair_1 from '../../assets/sprites/pelo_1.png';
import dialog from "../../assets/sprites/dialog.png";
import dialogArrow from "../../assets/sprites/dialog_arrow.png";



// sprites escena cocina
import kitchen from '../../assets/sprites/kitchen/cocina.png';
import bookOnTable from '../../assets/sprites/kitchen/libro_mesa.png';
import bookOnTableB from '../../assets/sprites/kitchen/libro_mesa_b.png';
import mortar from '../../assets/sprites/kitchen/mortero.png';
import mortarB from '../../assets/sprites/kitchen/mortero_b.png';
import cauldron from '../../assets/sprites/kitchen/caldero.png';
import cauldronB from '../../assets/sprites/kitchen/caldero_b.png';
import cuttingBoard from '../../assets/sprites/kitchen/tabla.png';
import cuttingBoardB from '../../assets/sprites/kitchen/tabla_b.png';
import crystalJar from '../../assets/sprites/kitchen/frasco_cristal.png';
import crystalJarB from '../../assets/sprites/kitchen/frasco_cristal_b.png';
import algaeJar from '../../assets/sprites/kitchen/frasco_algas.png';
import algaeJarB from '../../assets/sprites/kitchen/frasco_algas_b.png';
import mushroomJar from '../../assets/sprites/kitchen/frasco_setas.png';
import mushroomJarB from '../../assets/sprites/kitchen/frasco_setas_b.png';
import rootsJar from '../../assets/sprites/kitchen/frasco_raices.png';
import rootsJarB from '../../assets/sprites/kitchen/frasco_raices_b.png';
import berriesJar from '../../assets/sprites/kitchen/frasco_bayas.png';
import berriesJarB from '../../assets/sprites/kitchen/frasco_bayas_b.png';
import redBowl from '../../assets/sprites/kitchen/cuenco_rojo.png';
import redBowlB from '../../assets/sprites/kitchen/cuenco_rojo_b.png';
import blueBowl from '../../assets/sprites/kitchen/cuenco_azul.png';
import blueBowlB from '../../assets/sprites/kitchen/cuenco_azul_b.png';
import yellowBowl from '../../assets/sprites/kitchen/cuenco_amarillo.png';
import yellowBowlB from '../../assets/sprites/kitchen/cuenco_amarillo_b.png';
import redTestTube from '../../assets/sprites/kitchen/probeta_roja.png';
import redTestTubeB from '../../assets/sprites/kitchen/probeta_roja_b.png';
import greenTestTube from '../../assets/sprites/kitchen/probeta_verde.png';
import greenTestTubeB from '../../assets/sprites/kitchen/probeta_verde_b.png';
import grayTestTube from '../../assets/sprites/kitchen/probeta_gris.png';
import grayTestTubeB from '../../assets/sprites/kitchen/probeta_gris_b.png';

import hotFireAnim from '../../assets/anims/fuego_caliente.png';
import hotFireAnimJson from '../../assets/anims/fuego_caliente_atlas.json';

// sprites libro abierto cocina
import openBook from '../../assets/sprites/libro.png';
import normal from '../../assets/sprites/normal.png';
import fuego from '../../assets/sprites/fuego.png';
import agua from '../../assets/sprites/agua.png';
import tierra from '../../assets/sprites/tierra.png';
import aire from '../../assets/sprites/aire.png';
import planta from '../../assets/sprites/planta.png';
import afin from '../../assets/sprites/afin.png';
import igual from '../../assets/sprites/igual.png';
import hostil from '../../assets/sprites/hostil.png';
import next from '../../assets/sprites/next_1.png';
import prev from '../../assets/sprites/prev_1.png';
import redTag1 from '../../assets/sprites/etiqueta_roja_1.png';
import redTag2 from '../../assets/sprites/etiqueta_roja_2.png';
import purpleTag1 from '../../assets/sprites/etiqueta_morada_1.png';
import purpleTag2 from '../../assets/sprites/etiqueta_morada_2.png';
import greenTag1 from '../../assets/sprites/etiqueta_verde_1.png';
import greenTag2 from '../../assets/sprites/etiqueta_verde_2.png';
import blueTag1 from '../../assets/sprites/etiqueta_azul_1.png';
import blueTag2 from '../../assets/sprites/etiqueta_azul_2.png';

//sonidos
import fireSound from '../../assets/sound/fire.mp3';
import bookSound from '../../assets/sound/book.mp3';


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
        this.load.image('store', store);
         this.load.image("dialog", dialog);
        this.load.image("dialogArrow", dialogArrow);

        this.load.image('kitchen', kitchen);
        this.load.image('bookOnTable', bookOnTable);
        this.load.image('bookOnTableB', bookOnTableB);
        this.load.image('mortar', mortar);
        this.load.image('mortarB', mortarB);
        this.load.image('cauldron', cauldron);
        this.load.image('cauldronB', cauldronB);
        this.load.image('cuttingBoard', cuttingBoard);
        this.load.image('cuttingBoardB', cuttingBoardB);
        this.load.image('crystalJar', crystalJar);
        this.load.image('crystalJarB', crystalJarB);
        this.load.image('algaeJar', algaeJar);
        this.load.image('algaeJarB', algaeJarB);
        this.load.image('mushroomJar', mushroomJar);
        this.load.image('mushroomJarB', mushroomJarB);
        this.load.image('rootsJar', rootsJar);
        this.load.image('rootsJarB', rootsJarB);
        this.load.image('berriesJar', berriesJar);
        this.load.image('berriesJarB', berriesJarB);
        this.load.image('redBowl', redBowl);
        this.load.image('redBowlB', redBowlB);
        this.load.image('blueBowl', blueBowl);
        this.load.image('blueBowlB', blueBowlB);
        this.load.image('yellowBowl', yellowBowl);
        this.load.image('yellowBowlB', yellowBowlB);
        this.load.image('redTestTube', redTestTube);
        this.load.image('redTestTubeB', redTestTubeB);
        this.load.image('greenTestTube', greenTestTube);
        this.load.image('greenTestTubeB', greenTestTubeB);
        this.load.image('grayTestTube', grayTestTube);
        this.load.image('grayTestTubeB', grayTestTubeB);
        this.load.atlas('hotFire', hotFireAnim, hotFireAnimJson);
 
        this.load.image('openBook', openBook);
        this.load.image('humanos', normal);
        this.load.image('kitsunes', fuego);
        this.load.image('ninfas', agua);
        this.load.image('gnomos', tierra);
        this.load.image('hadas', aire);
        this.load.image('elfos', planta);
        this.load.image('afin', afin);
        this.load.image('igual', igual);
        this.load.image('hostil', hostil);     
        this.load.image('next', next);
        this.load.image('prev', prev); 
        this.load.image('redTag1', redTag1);
        this.load.image('redTag2', redTag2);
        this.load.image('purpleTag1', purpleTag1);
        this.load.image('purpleTag2', purpleTag2);
        this.load.image('greenTag1', greenTag1);
        this.load.image('greenTag2', greenTag2);
        this.load.image('blueTag1', blueTag1);
        this.load.image('blueTag2', blueTag2);

        this.load.audio('fireSound', fireSound);
        this.load.audio('bookSound', bookSound);
    }

    create() {
        this.scene.start('Letter');
    }
}