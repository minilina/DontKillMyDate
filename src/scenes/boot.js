import Phaser from 'phaser';
import GameState from '../state/GameState.js';

// configuración días
import daysConfig from "../../assets/json/daysConfig.json";

// script de los npcs especiales
import scriptedNpcs from "../../assets/json/scriptedNpcs.json";

// sprites mapa top-down (casa)
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

// sprites mapa top-down (cueva)
import letrero from '../../assets/tiled/letrero.png';
import bonfireFish from '../../assets/tiled/bonfireFish.png';
import caveWaterGroundAnimationsTiles from '../../assets/tiled/caveWaterGroundAnimationsTiles.png';
import caves from '../../assets/tiled/caves.png';
import chest from '../../assets/tiled/chest.png';
import entering from '../../assets/tiled/entering.png';
import exteriorBeach from '../../assets/tiled/exteriorBeach.png';
import exterior from '../../assets/tiled/exterior.png';
import lightEffect from '../../assets/tiled/lightEffect.png';
import mineProps from '../../assets/tiled/mineProps.png';
import propsMine from '../../assets/tiled/propsMine.png';
import stoneWithMinerals from '../../assets/tiled/stoneWithMinerals.png';
import tilesetGrassCaves from '../../assets/tiled/tilesetGrassCaves.png';

// objetos casa
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

// objetos cueva
import barril from '../../assets/tiled/barril.png';
import tendedero from '../../assets/tiled/tendedero.png';
import lamp from '../../assets/tiled/lamp.png';
import dogBathtub from '../../assets/tiled/dogBathtub.png';
import pilaBarriles from '../../assets/tiled/pilaBarriles.png';

import playerRun from '../../assets/anims/run.png';
import playerIdle from '../../assets/anims/idle.png';
import casa from '../../assets/tiled/casa.json';
import cueva from '../../assets/tiled/cueva.json';


// sprites escena tienda
import store from '../../assets/sprites/store.jpg';

// sprites escena diálogo
import npcBocaNormal1 from '../../assets/sprites/npcs/boca_normal_1.png';
import npcBocaNormal2 from '../../assets/sprites/npcs/boca_normal_2.png';
import npcBocaNormal3 from '../../assets/sprites/npcs/boca_normal_3.png';
import npcCejasNormalesAzules from '../../assets/sprites/npcs/cejas_normales_azules.png';
import npcCejasNormalesNegras from '../../assets/sprites/npcs/cejas_normales_negras.png';
import npcCejasNormalesRojas from '../../assets/sprites/npcs/cejas_normales_rojas.png';
import npcCejasNormalesRosas from '../../assets/sprites/npcs/cejas_normales_rosas.png';
import npcCejasNormalesRubias from '../../assets/sprites/npcs/cejas_normales_rubias.png';
import npcCejasNormalesVerdes from '../../assets/sprites/npcs/cejas_normales_verdes.png';
import npcCuerpo1 from '../../assets/sprites/npcs/cuerpo_1.png';
import npcCuerpo2 from '../../assets/sprites/npcs/cuerpo_2.png';
import npcCuerpo3 from '../../assets/sprites/npcs/cuerpo_3.png';
import npcRopaELfo from '../../assets/sprites/npcs/ropa_elfo.png';
import npcRopaHada from '../../assets/sprites/npcs/ropa_hada.png';
import npcRopaNinfa from '../../assets/sprites/npcs/ropa_ninfa.png';
import npcRopaKitsune from '../../assets/sprites/npcs/ropa_kitsune.png';
import npcRopaHumano from '../../assets/sprites/npcs/ropa_humano.png';
import npcRopaGnomo from '../../assets/sprites/npcs/ropa_gnomo.png';
import npcHadaFeautures from '../../assets/sprites/npcs/hada_feautures.png';
import npcKitsuneFeauturesAzul from '../../assets/sprites/npcs/kitsune_feautures_azul.png';
import npcKitsuneFeauturesNegro from '../../assets/sprites/npcs/kitsune_feautures_negro.png';
import npcKitsuneFeauturesRojol from '../../assets/sprites/npcs/kitsune_feautures_rojol.png';
import npcKitsuneFeauturesRosa from '../../assets/sprites/npcs/kitsune_feautures_rosa.png';
import npcKitsuneFeauturesRubiol from '../../assets/sprites/npcs/kitsune_feautures_rubiol.png';
import npcKitsuneFeauturesVerde from '../../assets/sprites/npcs/kitsune_feautures_verde.png';
import npcGnomoFeatures from '../../assets/sprites/npcs/gnomo_features.png';
import npcNariz from '../../assets/sprites/npcs/nariz.png';
import npcNariz1 from '../../assets/sprites/npcs/nariz_1.png';
import npcNariz2 from '../../assets/sprites/npcs/nariz_2.png';
import npcNariz3 from '../../assets/sprites/npcs/nariz_3.png';
import npcNinfaFeautures from '../../assets/sprites/npcs/ninfa_feautures.png';
import npcOjosAmarillos from '../../assets/sprites/npcs/ojos_amarillos.png';
import npcOjosAzules from '../../assets/sprites/npcs/ojos_azules.png';
import npcOjosMarrones from '../../assets/sprites/npcs/ojos_marrones.png';
import npcOjosRojos from '../../assets/sprites/npcs/ojos_rojos.png';
import npcOjosRosas from '../../assets/sprites/npcs/ojos_rosas.png';
import npcOjosVerdes from '../../assets/sprites/npcs/ojos_verdes.png';
import npcOrejas1ElfoHada from '../../assets/sprites/npcs/orejas_1_elfo_hada.png';
import npcOrejas2ElfoHada from '../../assets/sprites/npcs/orejas_2_elfo_hada.png';
import npcOrejas3ElfoHada from '../../assets/sprites/npcs/orejas_3_elfo_hada.png';
import npcOrejas1Ninfa from "../../assets/sprites/npcs/orejas_ninfa_1.png";
import npcOrejas2Ninfa from "../../assets/sprites/npcs/orejas_ninfa_2.png";
import npcOrejas3Ninfa from "../../assets/sprites/npcs/orejas_ninfa_3.png";
import npcPelo1 from '../../assets/sprites/npcs/pelo_1.png';
import npcPelo1Azul from '../../assets/sprites/npcs/pelo_1_azul.png';
import npcPelo1Negro from '../../assets/sprites/npcs/pelo_1_negro.png';
import npcPelo1Rojo from '../../assets/sprites/npcs/pelo_1_rojo.png';
import npcPelo1Rosa from '../../assets/sprites/npcs/pelo_1_rosa.png';
import npcPelo1Rubiol from '../../assets/sprites/npcs/pelo_1_rubiol.png';
import npcPelo1Verde from '../../assets/sprites/npcs/pelo_1_verde.png';
import npcPelo2Azul from '../../assets/sprites/npcs/pelo_2_azul.png';
import npcPelo2Negro from '../../assets/sprites/npcs/pelo_2_negro.png';
import npcPelo2Rojo from '../../assets/sprites/npcs/pelo_2_rojo.png';
import npcPelo2Rosa from '../../assets/sprites/npcs/pelo_2_rosa.png';
import npcPelo2Rubio from '../../assets/sprites/npcs/pelo_2_rubio.png';
import npcPelo2Verde from '../../assets/sprites/npcs/pelo_2_verde.png';
import npcPelo3Azul from '../../assets/sprites/npcs/pelo_3_azul.png';
import npcPelo3Negro from '../../assets/sprites/npcs/pelo_3_negro.png';
import npcPelo3Rojo from '../../assets/sprites/npcs/pelo_3_rojo.png';
import npcPelo3Rosa from '../../assets/sprites/npcs/pelo_3_rosa.png';
import npcPelo3Rubio from '../../assets/sprites/npcs/pelo_3_rubio.png';
import npcPelo3Verde from '../../assets/sprites/npcs/pelo_3_verde.png';
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
import mushroom from '../../assets/sprites/kitchen/seta.png';
import mushroomB from '../../assets/sprites/kitchen/seta_b.png';
import berry from '../../assets/sprites/kitchen/baya.png';
import berryB from '../../assets/sprites/kitchen/baya_b.png';
import root from '../../assets/sprites/kitchen/raiz.png';
import rootB from '../../assets/sprites/kitchen/raiz_b.png';
import algae from '../../assets/sprites/kitchen/alga.png';
import algaeB from '../../assets/sprites/kitchen/alga_b.png';
import crystal from '../../assets/sprites/kitchen/cristal.png';
import crystalB from '../../assets/sprites/kitchen/cristal_b.png';
import trash from '../../assets/sprites/kitchen/estacion_basura.png';
import trashB from '../../assets/sprites/kitchen/estacion_basura_b.png';
import delivery from '../../assets/sprites/kitchen/estacion_entregar.png';
import deliveryB from '../../assets/sprites/kitchen/estacion_entregar_b.png';
import yellowLiquid from '../../assets/sprites/kitchen/liquido_amarillo.png';
import blueLiquid from '../../assets/sprites/kitchen/liquido_azul.png';
import redLiquid from '../../assets/sprites/kitchen/liquido_rojo.png';
import greenLiquid from '../../assets/sprites/kitchen/liquido_verde.png';
import purpleLiquid from '../../assets/sprites/kitchen/liquido_morado.png';
import orangeLiquid from '../../assets/sprites/kitchen/liquido_naranja.png';
import plate from '../../assets/sprites/kitchen/platito.png';
import plateB from '../../assets/sprites/kitchen/platito_b.png';
import yellowPlate from '../../assets/sprites/kitchen/platito_amarillo.png';
import bluePlate from '../../assets/sprites/kitchen/platito_azul.png';
import redPlate from '../../assets/sprites/kitchen/platito_rojo.png';
import greenPlate from '../../assets/sprites/kitchen/platito_verde.png';
import purplePlate from '../../assets/sprites/kitchen/platito_morado.png';
import orangePlate from '../../assets/sprites/kitchen/platito_naranja.png';
import yellowPowder from '../../assets/sprites/kitchen/polvo_amarillo.png';
import bluePowder from '../../assets/sprites/kitchen/polvo_azul.png';
import redPowder from '../../assets/sprites/kitchen/polvo_rojo.png';
import greenPowder from '../../assets/sprites/kitchen/polvo_verde.png';
import purplePowder from '../../assets/sprites/kitchen/polvo_morado.png';
import orangePowder from '../../assets/sprites/kitchen/polvo_naranja.png';
import testTubeRack from '../../assets/sprites/kitchen/soporte_probetas.png';
import note from '../../assets/sprites/kitchen/nota.png';
import noteB from '../../assets/sprites/kitchen/nota_b.png';
import emptyNormalPotion from '../../assets/sprites/kitchen/pocion_normal_vacia.png';
import emptyNormalPotionB from '../../assets/sprites/kitchen/pocion_normal_vacia_b.png';
import emptyHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_vacia.png';
import emptyHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_vacia_b.png';
import emptyStarPotion from '../../assets/sprites/kitchen/pocion_estrella_vacia.png';
import emptyStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_vacia_b.png';
import heatBar from '../../assets/sprites/kitchen/barra_calor.png';
import heatArrow from '../../assets/sprites/kitchen/flecha_barra_calor.png';

import indicator from '../../assets/sprites/kitchen/indicador.png';
import lightOverlay from '../../assets/sprites/kitchen/capa_luz.png';

import hotFireAnim from '../../assets/anims/fuego_caliente.png';
import hotFireAnimJson from '../../assets/anims/fuego_caliente_atlas.json';

import cuttingBg from '../../assets/sprites/kitchen/tabla_bg.png';
import cuttingBar from '../../assets/sprites/kitchen/barra.png';
import cutArrow from '../../assets/sprites/kitchen/flecha_barra.png';
import cutAnim from '../../assets/anims/cuchillo_anim.png';
import cutAnimJson from '../../assets/anims/cuchillo_anim_atlas.json';

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
        this.load.image('entering', entering);
        this.load.image('exteriorBeach', exteriorBeach);
        this.load.image('exterior', exterior);
        this.load.image('lightEffect', lightEffect);
        this.load.image('mineProps', mineProps);
        this.load.image('propsMine', propsMine);
        this.load.image('stoneWithMinerals', stoneWithMinerals);
        this.load.image('tilesetGrassCaves', tilesetGrassCaves);

        this.load.image('dogBathtub', dogBathtub);
        this.load.image('lamp', lamp);
        this.load.image('barril', barril);
        this.load.image('tendedero', tendedero);
        this.load.image('pilaBarriles', pilaBarriles);

        this.load.tilemapTiledJSON('cueva', cueva);

        this.load.image('store', store);
         this.load.image('dialog', dialog);
        this.load.image('dialogArrow', dialogArrow);
        // --- CARGA DE CAPAS DE NPCs ---
        this.load.image('boca_normal_1', npcBocaNormal1);
        this.load.image('boca_normal_2', npcBocaNormal2);
        this.load.image('boca_normal_3', npcBocaNormal3);
        this.load.image('cejas_normales_azules', npcCejasNormalesAzules);
        this.load.image('cejas_normales_negras', npcCejasNormalesNegras);
        this.load.image('cejas_normales_rojas', npcCejasNormalesRojas);
        this.load.image('cejas_normales_rosas', npcCejasNormalesRosas);
        this.load.image('cejas_normales_rubias', npcCejasNormalesRubias);
        this.load.image('cejas_normales_verdes', npcCejasNormalesVerdes);
        this.load.image('cuerpo_1', npcCuerpo1);
        this.load.image('cuerpo_2', npcCuerpo2);
        this.load.image('cuerpo_3', npcCuerpo3);
        this.load.image('ropa_elfo', npcRopaELfo);
        this.load.image('ropa_hada', npcRopaHada);
        this.load.image('ropa_ninfa', npcRopaNinfa);
        this.load.image('ropa_kitsune', npcRopaKitsune);
        this.load.image('ropa_humano', npcRopaHumano);
        this.load.image('ropa_gnomo', npcRopaGnomo);
        this.load.image('hada_feautures', npcHadaFeautures);
        this.load.image('gnomo_features', npcGnomoFeatures);
        this.load.image('kitsune_feautures_azul', npcKitsuneFeauturesAzul);
        this.load.image('kitsune_feautures_negro', npcKitsuneFeauturesNegro);
        this.load.image('kitsune_feautures_rojol', npcKitsuneFeauturesRojol);
        this.load.image('kitsune_feautures_rosa', npcKitsuneFeauturesRosa);
        this.load.image('kitsune_feautures_rubiol', npcKitsuneFeauturesRubiol);
        this.load.image('kitsune_feautures_verde', npcKitsuneFeauturesVerde);
        this.load.image('nariz', npcNariz);
        this.load.image('nariz_1', npcNariz1);
        this.load.image('nariz_2', npcNariz2);
        this.load.image('nariz_3', npcNariz3);
        this.load.image('ninfa_feautures', npcNinfaFeautures);
        this.load.image('ojos_amarillos', npcOjosAmarillos);
        this.load.image('ojos_azules', npcOjosAzules);
        this.load.image('ojos_marrones', npcOjosMarrones);
        this.load.image('ojos_rojos', npcOjosRojos);
        this.load.image('ojos_rosas', npcOjosRosas);
        this.load.image('ojos_verdes', npcOjosVerdes);
        this.load.image('orejas_1_elfo_hada', npcOrejas1ElfoHada);
        this.load.image('orejas_2_elfo_hada', npcOrejas2ElfoHada);
        this.load.image('orejas_3_elfo_hada', npcOrejas3ElfoHada);
        this.load.image('orejas_ninfa_1', npcOrejas1Ninfa);
        this.load.image('orejas_ninfa_2', npcOrejas2Ninfa);
        this.load.image('orejas_ninfa_3', npcOrejas3Ninfa);
        this.load.image('pelo_1', npcPelo1);
        this.load.image('pelo_1_azul', npcPelo1Azul);
        this.load.image('pelo_1_negro', npcPelo1Negro);
        this.load.image('pelo_1_rojo', npcPelo1Rojo);
        this.load.image('pelo_1_rosa', npcPelo1Rosa);
        this.load.image('pelo_1_rubiol', npcPelo1Rubiol);
        this.load.image('pelo_1_verde', npcPelo1Verde);
        this.load.image('pelo_2_azul', npcPelo2Azul);
        this.load.image('pelo_2_negro', npcPelo2Negro);
        this.load.image('pelo_2_rojo', npcPelo2Rojo);
        this.load.image('pelo_2_rosa', npcPelo2Rosa);
        this.load.image('pelo_2_rubio', npcPelo2Rubio);
        this.load.image('pelo_2_verde', npcPelo2Verde);
        this.load.image('pelo_3_azul', npcPelo3Azul);
        this.load.image('pelo_3_negro', npcPelo3Negro);
        this.load.image('pelo_3_rojo', npcPelo3Rojo);
        this.load.image('pelo_3_rosa', npcPelo3Rosa);
        this.load.image('pelo_3_rubio', npcPelo3Rubio);
        this.load.image('pelo_3_verde', npcPelo3Verde);

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
        this.load.image('mushroom', mushroom);
        this.load.image('mushroomB', mushroomB);
        this.load.image('berry', berry);
        this.load.image('berryB', berryB);
        this.load.image('root', root);
        this.load.image('rootB', rootB);
        this.load.image('algae', algae);
        this.load.image('algaeB', algaeB);
        this.load.image('crystal', crystal);
        this.load.image('crystalB', crystalB);
        this.load.image('trash', trash);
        this.load.image('trashB', trashB);
        this.load.image('delivery', delivery);
        this.load.image('deliveryB', deliveryB);
        this.load.image('yellowLiquid', yellowLiquid);
        this.load.image('blueLiquid', blueLiquid);
        this.load.image('redLiquid', redLiquid);
        this.load.image('greenLiquid', greenLiquid);
        this.load.image('purpleLiquid', purpleLiquid);
        this.load.image('orangeLiquid', orangeLiquid);
        this.load.image('plate', plate);
        this.load.image('plateB', plateB);
        this.load.image('yellowPlate', yellowPlate);
        this.load.image('bluePlate', bluePlate);
        this.load.image('redPlate', redPlate);
        this.load.image('greenPlate', greenPlate);
        this.load.image('purplePlate', purplePlate);
        this.load.image('orangePlate', orangePlate);
        this.load.image('yellowPowder', yellowPowder);
        this.load.image('bluePowder', bluePowder);
        this.load.image('redPowder', redPowder);
        this.load.image('greenPowder', greenPowder);
        this.load.image('purplePowder', purplePowder);
        this.load.image('orangePowder', orangePowder);
        this.load.image('testTubeRack', testTubeRack);
        this.load.image('note', note);
        this.load.image('noteB', noteB);
        this.load.image('emptyNormalPotion', emptyNormalPotion);
        this.load.image('emptyNormalPotionB', emptyNormalPotionB);
        this.load.image('emptyHeartPotion', emptyHeartPotion);
        this.load.image('emptyHeartPotionB', emptyHeartPotionB);
        this.load.image('emptyStarPotion', emptyStarPotion);
        this.load.image('emptyStarPotionB', emptyStarPotionB);
        this.load.image('heatBar', heatBar);
        this.load.image('heatArrow', heatArrow);

        this.load.image('indicator', indicator);
        this.load.image('lightOverlay', lightOverlay);
 
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

        this.load.image('cuttingBg', cuttingBg);
        this.load.image('cuttingBar', cuttingBar);
        this.load.image('cutArrow', cutArrow);
        this.load.atlas('knife', cutAnim, cutAnimJson);

        this.load.audio('fireSound', fireSound);
        this.load.audio('bookSound', bookSound);
        
    }

    create() {
        GameState.initData(daysConfig, scriptedNpcs);
        
        this.scene.start('Letter');
    }
}