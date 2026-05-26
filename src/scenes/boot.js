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
import mushroomTree from '../../assets/tiled/Mushroom Tree.png';
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

// flores y decoracion
import amarillo from '../../assets/tiled/amarillo.png';
import blanco from '../../assets/tiled/blanco.png';
import brote from '../../assets/tiled/brote.png';
import bushes from '../../assets/tiled/bushes.png';
import campana from '../../assets/tiled/campana.png';
import flores from '../../assets/tiled/flores.png';
import hierbaVerde from '../../assets/tiled/hierba verde.png';
import hierba from '../../assets/tiled/hierba.png';
import setaAmarilla from '../../assets/tiled/seta amarilla.png';
import setaRoja from '../../assets/tiled/seta roja.png';
import setaVerde from '../../assets/tiled/seta verde.png';
import setaTiled from '../../assets/tiled/seta.png';

// objetos cueva
import barril from '../../assets/tiled/barril.png';
import tendedero from '../../assets/tiled/tendedero.png';
import lamp from '../../assets/tiled/lamp.png';
import dogBathtub from '../../assets/tiled/dogBathtub.png';
import pilaBarriles from '../../assets/tiled/pilaBarriles.png';

// valla cueva
import vallaMina from '../../assets/tiled/vallaMina.png';

// sprites mapa top-down (ciudad)
import dosPng from '../../assets/tiled/2.png';
import barnTileset from '../../assets/tiled/Barn tileset.png';
import baseHouses from '../../assets/tiled/Base houses.png';
import bigOldTree from '../../assets/tiled/Big old Tree.png';
import leaf from '../../assets/tiled/Leaf.png';
import pineTree from '../../assets/tiled/Pine Tree copiar.png';
import springCrops from '../../assets/tiled/Spring Crops.png';
import tableTiled from '../../assets/tiled/Table.png';
import tilledSoil from '../../assets/tiled/Tilled Soil and wet soil.png';
import waterBox from '../../assets/tiled/water box.png';
import waterFountain from '../../assets/tiled/Water fountain.png';
import wheat from '../../assets/tiled/Wheat.png';
import wood from '../../assets/tiled/wood.png';

// objetos ciudad
import arbustoFeo from '../../assets/tiled/arbustoFeo.png';
import arbustoMedio from '../../assets/tiled/arbustoMedio.png';
import arbustoBonito from '../../assets/tiled/arbustoBonito.png';
import farola from '../../assets/tiled/farola.png';
import farolaBonita from '../../assets/tiled/farolaBonita.png';
import papeleraSucia from '../../assets/tiled/papeleraSucia.png';
import papelera from '../../assets/tiled/papelera.png';
import sillaBlanca from '../../assets/tiled/sillaBlanca.png';
import sillaRosa from '../../assets/tiled/sillaRosa.png';
import tendederoRosa from '../../assets/tiled/tendedero Rosa.png';
import fuente from '../../assets/tiled/fuente.png';
import banco from '../../assets/tiled/banco.png';
import bancoGirado from '../../assets/tiled/banco girado.png';
import tronco from '../../assets/tiled/tronco.png';
import casaBlanca from '../../assets/tiled/casaBlanca.png';
import casaAzul from '../../assets/tiled/casaAzul.png';
import hamacaRoja from '../../assets/tiled/hamacaRoja.png';
import hamacaAmarilla from '../../assets/tiled/hamacaAmarilla.png';
import constructionArea from '../../assets/tiled/Construction area.png';
import barbacoa from '../../assets/tiled/barbacoa.png';
import sombrilla from '../../assets/tiled/sombrilla.png';

// flores y decoracion
import hierbaAmarilla from '../../assets/tiled/hierba amarilla.png';
import semillaArroz from '../../assets/tiled/semilla arroz.png';
import semillaTrigo from '../../assets/tiled/semilla trigo.png';
import trigo from '../../assets/tiled/trigo.png';
import trigoMedio from '../../assets/tiled/trigo medio.png';
import trigoPrincipio from '../../assets/tiled/trigo principio.png';
import arroz from '../../assets/tiled/arroz.png';
import arrozMedio from '../../assets/tiled/arroz medio.png';
import fresaMedio from '../../assets/tiled/fresa medio.png';
import apio from '../../assets/tiled/apio.png';
import apioMedio from '../../assets/tiled/apio medio.png';
import apioPrincipio from '../../assets/tiled/apio principio.png';
import patata from '../../assets/tiled/patata.png';
import patataMedio from '../../assets/tiled/patata medio.png';
import patataPrincipio from '../../assets/tiled/patata principio.png';
import zanahoriaMedio from '../../assets/tiled/zanahoria medio.png';
import zanahoriaPrincipio from '../../assets/tiled/zanahoria principio.png';
import col from '../../assets/tiled/col.png';
import colMedio from '../../assets/tiled/col medio.png';
import colPrincipio from '../../assets/tiled/col principio.png';
import brocoli from '../../assets/tiled/brocoli.png';
import brocoliMedio from '../../assets/tiled/brocoli medio.png';
import brocoliPrincipio from '../../assets/tiled/brocoli principio.png';

import playerRun from '../../assets/anims/run.png';
import playerIdle from '../../assets/anims/idle.png';
import playerWatering from '../../assets/anims/watering.png';
import NPCmadre from '../../assets/anims/NPCmadre.png';
import NPCelfo from '../../assets/anims/NPCelfo.png';
import NPChada from '../../assets/anims/NPChada.png';
import NPCkitsune from '../../assets/anims/NPCkitsune.png';
import NPCninfa from '../../assets/anims/NPCninfa.png';
import NPCgnomo from '../../assets/anims/NPCgnomo.png';
import NPChumano from '../../assets/anims/NPChumano.png';


import casa from '../../assets/tiled/casa.json';
import cueva from '../../assets/tiled/cueva.json';
import ciudad from '../../assets/tiled/ciudad.json';
import ciudad2 from '../../assets/tiled/ciudad2.json';

// sprites escena tienda
import store from '../../assets/sprites/store.png';
import mostrador from '../../assets/sprites/mostrador.png';
import luzStore from '../../assets/sprites/luzStore.png';
import redPotion from '../../assets/anims/encasedPotion_YELLOW_RED.png';
import bluePotion from '../../assets/anims/smallElixir_CYAN.png';
import yellowPotion from '../../assets/anims/smallVial_GOLD.png';

//sprite resumen diario
import resumenBg from '../../assets/sprites/resumen_dia.png';
import estrella from '../../assets/sprites/estrella.png';
import corazon from '../../assets/sprites/corazon.png';

// sprites escena diálogo
import npcBocaNormal1 from '../../assets/sprites/npcs/boca_normal_1.png';
import npcBocaNormal2 from '../../assets/sprites/npcs/boca_normal_2.png';
import npcBocaNormal3 from '../../assets/sprites/npcs/boca_normal_3.png';
import npcBocaFeliz from '../../assets/sprites/npcs/boca_feliz.png';
import npcBocaEnfadada from '../../assets/sprites/npcs/boca_enfadada.png';
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
import npcRopaMadre from '../../assets/sprites/npcs/ropa_madre.png';
import npcGafas from '../../assets/sprites/npcs/gafas.png';
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
import npcOjosFelices from '../../assets/sprites/npcs/ojos_felices.png';
import npcOjosEnfadados from '../../assets/sprites/npcs/ojos_enfadados.png';
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
import npcGorroInspector from '../../assets/sprites/npcs/gorro_inspector.png';
import npcBigoteInspector from '../../assets/sprites/npcs/bigote_inspector.png'
import npcPelo2Gris from '../../assets/sprites/npcs/pelo_2_gris.png';

import dialog from "../../assets/sprites/dialog.png";
import dialog2 from "../../assets/sprites/dialog2.png";
import dialogArrow from "../../assets/sprites/dialog_arrow.png";

import speechBubble from "../../assets/sprites/kitchen/bocadillo_hablar.png"

import thinkingBubbleAnim from '../../assets/anims/bocadillo_pensar.png'
import thinkingBubbleAnimJson from '../../assets/anims/bocadillo_pensar_atlas.json'


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
import noColorLiquid from '../../assets/sprites/kitchen/liquido_sincolor.png';
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
import blueNormalPotion from '../../assets/sprites/kitchen/pocion_normal_azul.png';
import blueNormalPotionB from '../../assets/sprites/kitchen/pocion_normal_azul_b.png';
import redNormalPotion from '../../assets/sprites/kitchen/pocion_normal_roja.png';
import redNormalPotionB from '../../assets/sprites/kitchen/pocion_normal_roja_b.png';
import greenNormalPotion from '../../assets/sprites/kitchen/pocion_normal_verde.png';
import greenNormalPotionB from '../../assets/sprites/kitchen/pocion_normal_verde_b.png';
import purpleNormalPotion from '../../assets/sprites/kitchen/pocion_normal_morada.png';
import purpleNormalPotionB from '../../assets/sprites/kitchen/pocion_normal_morada_b.png';
import orangeNormalPotion from '../../assets/sprites/kitchen/pocion_normal_naranja.png';
import orangeNormalPotionB from '../../assets/sprites/kitchen/pocion_normal_naranja_b.png';
import yellowNormalPotion from '../../assets/sprites/kitchen/pocion_normal_amarilla.png';
import yellowNormalPotionB from '../../assets/sprites/kitchen/pocion_normal_amarilla_b.png';
import noColorNormalPotion from '../../assets/sprites/kitchen/pocion_normal_sincolor.png';
import noColorNormalPotionB from '../../assets/sprites/kitchen/pocion_normal_sincolor_b.png';
import emptyHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_vacia.png';
import emptyHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_vacia_b.png';
import blueHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_azul.png';
import blueHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_azul_b.png';
import redHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_roja.png';
import redHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_roja_b.png';
import greenHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_verde.png';
import greenHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_verde_b.png';
import purpleHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_morada.png';
import purpleHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_morada_b.png';
import orangeHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_naranja.png';
import orangeHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_naranja_b.png';
import yellowHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_amarilla.png';
import yellowHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_amarilla_b.png';
import noColorHeartPotion from '../../assets/sprites/kitchen/pocion_corazon_sincolor.png';
import noColorHeartPotionB from '../../assets/sprites/kitchen/pocion_corazon_sincolor_b.png';
import emptyStarPotion from '../../assets/sprites/kitchen/pocion_estrella_vacia.png';
import emptyStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_vacia_b.png';
import blueStarPotion from '../../assets/sprites/kitchen/pocion_estrella_azul.png';
import blueStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_azul_b.png';
import redStarPotion from '../../assets/sprites/kitchen/pocion_estrella_roja.png';
import redStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_roja_b.png';
import greenStarPotion from '../../assets/sprites/kitchen/pocion_estrella_verde.png';
import greenStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_verde_b.png';
import purpleStarPotion from '../../assets/sprites/kitchen/pocion_estrella_morada.png';
import purpleStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_morada_b.png';
import orangeStarPotion from '../../assets/sprites/kitchen/pocion_estrella_naranja.png';
import orangeStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_naranja_b.png';
import yellowStarPotion from '../../assets/sprites/kitchen/pocion_estrella_amarilla.png';
import yellowStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_amarilla_b.png';
import noColorStarPotion from '../../assets/sprites/kitchen/pocion_estrella_sincolor.png';
import noColorStarPotionB from '../../assets/sprites/kitchen/pocion_estrella_sincolor_b.png';
import heatBar from '../../assets/sprites/kitchen/barra_calor.png';
import heatArrow from '../../assets/sprites/kitchen/flecha_barra_calor.png';
import nota from "../../assets/sprites/carta.png";
import stones from "../../assets/sprites/kitchen/piedras.png";
import stonesB from "../../assets/sprites/kitchen/piedras_b.png";

import indicator from '../../assets/sprites/kitchen/indicador.png';
import lightOverlay from '../../assets/sprites/kitchen/capa_luz.png';

import hotFireAnim from '../../assets/anims/fuego_caliente.png';
import hotFireAnimJson from '../../assets/anims/fuego_caliente_atlas.json';
import fireEyesAnim from '../../assets/anims/ojos.png';
import fireEyesAnimJson from '../../assets/anims/ojos_atlas.json';

import cuttingBg from '../../assets/sprites/kitchen/tabla_bg.png';
import cuttingBar from '../../assets/sprites/kitchen/barra.png';
import cutArrow from '../../assets/sprites/kitchen/flecha_barra.png';
import cutMushroom from '../../assets/sprites/kitchen/seta_cortar.png';
import cutBerry from '../../assets/sprites/kitchen/baya_cortar.png';
import cutRoot from '../../assets/sprites/kitchen/raiz_cortar.png';
import cutAlgae from '../../assets/sprites/kitchen/alga_cortar.png';
import cutCrystal from '../../assets/sprites/kitchen/cristal_cortar.png';
import cutAnim from '../../assets/anims/cuchillo_anim.png';
import cutAnimJson from '../../assets/anims/cuchillo_anim_atlas.json';

import mortarBg from '../../assets/sprites/kitchen/mortero_bg.png';

import smashedAlgae from '../../assets/sprites/kitchen/alga_machacada.png';
import smashedBerries from '../../assets/sprites/kitchen/baya_machacada.png';
import smashedMushroom from '../../assets/sprites/kitchen/seta_machacada.png';
import smashedRoot from '../../assets/sprites/kitchen/raiz_machacada.png';
import smashedCrystal from '../../assets/sprites/kitchen/cristal_machacado.png';
import algaeInMortar from '../../assets/sprites/kitchen/alga_mortero.png';
import algaeInMortarB from '../../assets/sprites/kitchen/alga_mortero_b.png';
import berriesInMortar from '../../assets/sprites/kitchen/baya_mortero.png';
import berriesInMortarB from '../../assets/sprites/kitchen/baya_mortero_b.png';
import mushroomInMortar from '../../assets/sprites/kitchen/seta_mortero.png';
import mushroomInMortarB from '../../assets/sprites/kitchen/seta_mortero_b.png';
import rootInMortar from '../../assets/sprites/kitchen/raiz_mortero.png';
import rootInMortarB from '../../assets/sprites/kitchen/raiz_mortero_b.png';
import crystalInMortar from '../../assets/sprites/kitchen/cristal_mortero.png';
import crystalInMortarB from '../../assets/sprites/kitchen/cristal_mortero_b.png';

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
import esqColor from '../../assets/sprites/esq-color.png';

//sonidos
import buttonSound from '../../assets/sound/button.mp3';
import fireSound from '../../assets/sound/fire.mp3';
import bookSound1 from '../../assets/sound/book1.mp3';
import bookSound2 from '../../assets/sound/book2.mp3';
import jarSound1 from '../../assets/sound/jar1.mp3';
import jarSound2 from '../../assets/sound/jar2.mp3';
import jarSound3 from '../../assets/sound/jar3.mp3';
import grassSound from '../../assets/sound/grass.mp3';
import fenceSound from '../../assets/sound/fence.mp3';
import tilesSound from '../../assets/sound/tiles.mp3';
import groundSound from '../../assets/sound/ground.mp3';
import dropCauldronSound from '../../assets/sound/dropCauldron.mp3';
import mortarSound from '../../assets/sound/mortar.mp3';
import testTubeSound from '../../assets/sound/testTube.mp3';
import colorDustSound from '../../assets/sound/colorDust.mp3';
import bottleSound from '../../assets/sound/bottle.mp3';
import flintSound from '../../assets/sound/flint.mp3';
import knifeSound from '../../assets/sound/knife.mp3';
import fillBottleSound from '../../assets/sound/fillBottle.mp3';
import errorSound from '../../assets/sound/error.mp3';
import successSound from '../../assets/sound/success.mp3';
import waterAmbientSound from '../../assets/sound/waterAmbient.ogg';
import landSlideSound from '../../assets/sound/landslide.ogg';
import minigameSound from '../../assets/sound/minigame.mp3';
import stompingDoorSound from '../../assets/sound/stompingdoor.mp3';
import knockingDoorSound from '../../assets/sound/knockingdoor.mp3';
import watering1Sound from '../../assets/sound/watering1.mp3';
//import watering2Sound from '../../assets/sound/watering2.mp3';
//UI
import pauseBtn from '../../assets/sprites/pauseBtn.png';
import pauseBtnPressed from '../../assets/sprites/pauseBtnPressed.png';
import btnSoundOn from '../../assets/sprites/btnSoundOn.png';
import btnSoundOff from '../../assets/sprites/btnSoundOff.png';
import blankBtn from '../../assets/sprites/blankBtn.png';
import eBtn from '../../assets/sprites/eBtn.png';
import eBtnPressed from '../../assets/sprites/eBtnPressed.png';

export default class Boot extends Phaser.Scene {
    constructor() {
        super({ key: 'Boot' });
    }

    preload() {

        // TOPDOWN 
        this.load.spritesheet('player-run', playerRun, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player-idle', playerIdle, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player-watering', playerWatering, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('NPCmadre', NPCmadre, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('NPCelfo', NPCelfo, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('NPChada', NPChada, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('NPCkitsune', NPCkitsune, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('NPCninfa', NPCninfa, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('NPCgnomo', NPCgnomo, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('NPChumano', NPChumano, { frameWidth: 32, frameHeight: 32 });

        // CASA
        this.load.image('ALL props seasons', allPropsSeasons);
        this.load.image('best fish point 2', bestFishPoint);
        this.load.image('deep forest stones', deepForestStones);
        this.load.image('Duck Mallad', duckMallad);
        this.load.image('Extra Village Tilesets', extraVillageTilesets);
        this.load.image('Fence Wood', fenceWood);
        this.load.image('Halloween Content', halloweenContent);
        this.load.image('Mushroom Tree', mushroomTree);
        this.load.image('Path tiles', pathTiles);
        this.load.image('pathTiles', pathTiles);
        this.load.image('props water', propsWater);
        this.load.image('Road', road);
        this.load.image('Stone structures', stoneStructures);
        this.load.image('Stone structures Water', stoneStructuresWater);
        this.load.image('Tileset Grass Cliff Tileset Spring', tilesetGrassCliffTilesetSpring);
        this.load.image('Tileset Grass Spring', tilesetGrassSpring);
        this.load.image('Tileset Grass Water Spring', tilesetGrassWaterSpring);
        this.load.image('TREE TRUNKS copiar', treeTrunks);
        this.load.image('Water Ground animations tiles', waterGroundAnimationsTiles);

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
        this.load.image('amarillo', amarillo);
        this.load.image('blanco', blanco);
        this.load.image('brote', brote);
        this.load.image('bushes', bushes);
        this.load.image('campana', campana);
        this.load.image('flores', flores);
        this.load.image('hierba verde', hierbaVerde);
        this.load.image('hierba', hierba);
        this.load.image('seta amarilla', setaAmarilla);
        this.load.image('seta roja', setaRoja);
        this.load.image('seta verde', setaVerde);
        this.load.image('seta', setaTiled);

        this.load.tilemapTiledJSON('casa', casa);

        // CUEVA
        this.load.image('bonfire Fish', bonfireFish);
        this.load.image('Cave Water Ground animations tiles', caveWaterGroundAnimationsTiles);
        this.load.image('Caves', caves);
        this.load.image('chest', chest);
        this.load.image('entering', entering);
        this.load.image('Exterior Beach', exteriorBeach);
        this.load.image('Exterior', exterior);
        this.load.image('Light Effect', lightEffect);
        this.load.image('Mine props', mineProps);
        this.load.image('Props Mine', propsMine);
        this.load.image('stone with minerals', stoneWithMinerals);
        this.load.image('Tileset Grass Caves', tilesetGrassCaves);

        this.load.image('dogBathtub', dogBathtub);
        this.load.image('lamp', lamp);
        this.load.image('barril', barril);
        this.load.image('tendedero', tendedero);
        this.load.image('pilaBarriles', pilaBarriles);
        this.load.image('vallaMina', vallaMina);

        this.load.tilemapTiledJSON('cueva', cueva);

        // CIUDAD
        this.load.image('2', dosPng);
        this.load.image('Barn tileset', barnTileset);
        this.load.image('Base houses', baseHouses);
        this.load.image('Big old Tree', bigOldTree);
        this.load.image('Leaf', leaf);
        this.load.image('Pine Tree copiar', pineTree);
        this.load.image('Spring Crops', springCrops);
        this.load.image('Table', tableTiled);
        this.load.image('Tilled Soil and wet soil', tilledSoil);
        this.load.image('water box', waterBox);
        this.load.image('Water fountain', waterFountain);
        this.load.image('Wheat', wheat);
        this.load.image('wood', wood);

        this.load.image('arbustoFeo', arbustoFeo);
        this.load.image('arbustoMedio', arbustoMedio);
        this.load.image('arbustoBonito', arbustoBonito);
        this.load.image('farola', farola);
        this.load.image('farolaBonita', farolaBonita);
        this.load.image('papeleraSucia', papeleraSucia);
        this.load.image('papelera', papelera);
        this.load.image('sillaBlanca', sillaBlanca);
        this.load.image('sillaRosa', sillaRosa);
        this.load.image('tendederoRosa', tendederoRosa);
        this.load.image('fuente', fuente);
        this.load.image('banco', banco);
        this.load.image('bancoGirado', bancoGirado);
        this.load.image('tronco', tronco);
        this.load.image('casaBlanca', casaBlanca);
        this.load.image('casaAzul', casaAzul);
        this.load.image('hamacaRoja', hamacaRoja);
        this.load.image('hamacaAmarilla', hamacaAmarilla);
        this.load.image('Construction area', constructionArea);
        this.load.image('barbacoa', barbacoa);
        this.load.image('sombrilla', sombrilla);

        this.load.image('hierba amarilla', hierbaAmarilla);
        this.load.image('semilla arroz', semillaArroz);
        this.load.image('semilla trigo', semillaTrigo);
        this.load.image('trigo', trigo);
        this.load.image('trigo medio', trigoMedio);
        this.load.image('trigo principio', trigoPrincipio);
        this.load.image('arroz', arroz);
        this.load.image('arroz medio', arrozMedio);
        this.load.image('fresa medio', fresaMedio);
        this.load.image('apio', apio);
        this.load.image('apio medio', apioMedio);
        this.load.image('apio principio', apioPrincipio);
        this.load.image('patata', patata);
        this.load.image('patata medio', patataMedio);
        this.load.image('patata principio', patataPrincipio);
        this.load.image('zanahoria medio', zanahoriaMedio);
        this.load.image('zanahoria principio', zanahoriaPrincipio);
        this.load.image('col', col);
        this.load.image('col medio', colMedio);
        this.load.image('col principio', colPrincipio);
        this.load.image('brocoli', brocoli);
        this.load.image('brocoli medio', brocoliMedio);
        this.load.image('brocoli principio', brocoliPrincipio);

        this.load.tilemapTiledJSON('ciudad', ciudad);
        this.load.tilemapTiledJSON('ciudad2', ciudad2);

        // TIENDA

        this.load.image('resumenBg', resumenBg);
        this.load.image('estrella', estrella);
        this.load.image('corazon', corazon);

        this.load.image('store', store);
        this.load.image('mostrador', mostrador);
        this.load.image('luzStore', luzStore);
        this.load.spritesheet('pocion_roja', redPotion, { frameWidth: 14, frameHeight: 25 });
        this.load.spritesheet('pocion_amarilla', yellowPotion, { frameWidth: 14, frameHeight: 24 });
        this.load.spritesheet('pocion_azul', bluePotion, { frameWidth: 15, frameHeight: 30 });

        this.load.image('dialog', dialog);
        this.load.image('dialog2', dialog2);
        this.load.image('dialogArrow', dialogArrow);
        this.load.image('speechBubble', speechBubble);
        this.load.atlas('thinkingBubble', thinkingBubbleAnim, thinkingBubbleAnimJson);

        // --- CARGA DE CAPAS DE NPCs ---
        this.load.image('boca_normal_1', npcBocaNormal1);
        this.load.image('boca_normal_2', npcBocaNormal2);
        this.load.image('boca_normal_3', npcBocaNormal3);
        this.load.image('boca_feliz', npcBocaFeliz);
        this.load.image('boca_enfadada', npcBocaEnfadada);
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
        this.load.image('ojos_felices', npcOjosFelices);
        this.load.image('ojos_enfadados', npcOjosEnfadados);
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
        this.load.image('gorro_inspector', npcGorroInspector);
        this.load.image('bigote_inspector', npcBigoteInspector);
        this.load.image('ropa_madre', npcRopaMadre);
        this.load.image('gafas', npcGafas);
        this.load.image('pelo_2_gris', npcPelo2Gris);



        // COCINA
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
        this.load.atlas('fireEyes', fireEyesAnim, fireEyesAnimJson);
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
        this.load.image('noColorLiquid', noColorLiquid);
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
        this.load.image('blueNormalPotion', blueNormalPotion);
        this.load.image('blueNormalPotionB', blueNormalPotionB);
        this.load.image('redNormalPotion', redNormalPotion);
        this.load.image('redNormalPotionB', redNormalPotionB);
        this.load.image('greenNormalPotion', greenNormalPotion);
        this.load.image('greenNormalPotionB', greenNormalPotionB);
        this.load.image('purpleNormalPotion', purpleNormalPotion);
        this.load.image('purpleNormalPotionB', purpleNormalPotionB);
        this.load.image('orangeNormalPotion', orangeNormalPotion);
        this.load.image('orangeNormalPotionB', orangeNormalPotionB);
        this.load.image('yellowNormalPotion', yellowNormalPotion);
        this.load.image('yellowNormalPotionB', yellowNormalPotionB);
        this.load.image('noColorNormalPotion', noColorNormalPotion);
        this.load.image('noColorNormalPotionB', noColorNormalPotionB);
        this.load.image('emptyHeartPotion', emptyHeartPotion);
        this.load.image('emptyHeartPotionB', emptyHeartPotionB);
        this.load.image('blueHeartPotion', blueHeartPotion);
        this.load.image('blueHeartPotionB', blueHeartPotionB);
        this.load.image('redHeartPotion', redHeartPotion);
        this.load.image('redHeartPotionB', redHeartPotionB);
        this.load.image('greenHeartPotion', greenHeartPotion);
        this.load.image('greenHeartPotionB', greenHeartPotionB);
        this.load.image('purpleHeartPotion', purpleHeartPotion);
        this.load.image('purpleHeartPotionB', purpleHeartPotionB);
        this.load.image('orangeHeartPotion', orangeHeartPotion);
        this.load.image('orangeHeartPotionB', orangeHeartPotionB);
        this.load.image('yellowHeartPotion', yellowHeartPotion);
        this.load.image('yellowHeartPotionB', yellowHeartPotionB);
        this.load.image('noColorHeartPotion', noColorHeartPotion);
        this.load.image('noColorHeartPotionB', noColorHeartPotionB);
        this.load.image('emptyStarPotion', emptyStarPotion);
        this.load.image('emptyStarPotionB', emptyStarPotionB);
        this.load.image('blueStarPotion', blueStarPotion);
        this.load.image('blueStarPotionB', blueStarPotionB);
        this.load.image('redStarPotion', redStarPotion);
        this.load.image('redStarPotionB', redStarPotionB);
        this.load.image('greenStarPotion', greenStarPotion);
        this.load.image('greenStarPotionB', greenStarPotionB);
        this.load.image('purpleStarPotion', purpleStarPotion);
        this.load.image('purpleStarPotionB', purpleStarPotionB);
        this.load.image('orangeStarPotion', orangeStarPotion);
        this.load.image('orangeStarPotionB', orangeStarPotionB);
        this.load.image('yellowStarPotion', yellowStarPotion);
        this.load.image('yellowStarPotionB', yellowStarPotionB);
        this.load.image('noColorStarPotion', noColorStarPotion);
        this.load.image('noColorStarPotionB', noColorStarPotionB);
        this.load.image('heatBar', heatBar);
        this.load.image('heatArrow', heatArrow);
        this.load.image("open_note", nota);
        this.load.image('smashedAlgae', smashedAlgae);
        this.load.image('smashedBerries', smashedBerries);
        this.load.image('smashedMushroom', smashedMushroom);
        this.load.image('smashedRoot', smashedRoot);
        this.load.image('smashedCrystal', smashedCrystal);
        this.load.image('algaeInMortar', algaeInMortar);
        this.load.image('algaeInMortarB', algaeInMortarB);
        this.load.image('berriesInMortar', berriesInMortar);
        this.load.image('berriesInMortarB', berriesInMortarB);
        this.load.image('mushroomInMortar', mushroomInMortar);
        this.load.image('mushroomInMortarB', mushroomInMortarB);
        this.load.image('rootInMortar', rootInMortar);
        this.load.image('rootInMortarB', rootInMortarB);
        this.load.image('crystalInMortar', crystalInMortar);
        this.load.image('crystalInMortarB', crystalInMortarB);

        this.load.image('stones', stones);
        this.load.image('stonesB', stonesB);

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
        this.load.image('esqColor', esqColor)

        this.load.image('cuttingBg', cuttingBg);
        this.load.image('cuttingBar', cuttingBar);
        this.load.image('cutMushroom', cutMushroom);
        this.load.image('cutBerry', cutBerry);
        this.load.image('cutRoot', cutRoot);
        this.load.image('cutAlgae', cutAlgae);
        this.load.image('cutCrystal', cutCrystal);
        this.load.image('cutArrow', cutArrow);
        this.load.atlas('knife', cutAnim, cutAnimJson);

        this.load.image('mortarBg', mortarBg);

        this.load.audio('fireSound', fireSound);
        this.load.audio('bookSound1', bookSound1);
        this.load.audio('bookSound2', bookSound2);
        this.load.audio('jarSound1', jarSound1);
        this.load.audio('jarSound2', jarSound2);
        this.load.audio('jarSound3', jarSound3);
        this.load.audio('buttonSound', buttonSound);
        this.load.audio('grassSound', grassSound);
        this.load.audio('fenceSound', fenceSound);
        this.load.audio('tilesSound', tilesSound);
        this.load.audio('groundSound', groundSound);
        this.load.audio('dropCauldronSound', dropCauldronSound);
        this.load.audio('mortarSound', mortarSound);
        this.load.audio('testTubeSound', testTubeSound);
        this.load.audio('colorDustSound', colorDustSound);
        this.load.audio('bottleSound', bottleSound);
        this.load.audio('flintSound', flintSound);
        this.load.audio('knifeSound', knifeSound);
        this.load.audio('fillBottleSound', fillBottleSound);
        this.load.audio('errorSound', errorSound);
        this.load.audio('successSound', successSound);
        this.load.audio('waterAmbientSound', waterAmbientSound);
        this.load.audio('landSlideSound', landSlideSound);
        this.load.audio('minigameSound', minigameSound);   
        this.load.audio('stompingDoorSound', stompingDoorSound); 
        this.load.audio('knockingDoorSound', knockingDoorSound);
        this.load.audio('watering1Sound', watering1Sound);
        //this.load.audio('watering2Sound', watering2Sound);
        
        this.load.image('pauseBtn', pauseBtn);
        this.load.image('pauseBtnPressed', pauseBtnPressed);
        this.load.image('btnSoundOn', btnSoundOn);
        this.load.image('btnSoundOff', btnSoundOff);
        this.load.image('blankBtn', blankBtn);
        this.load.image('eBtn', eBtn);
        this.load.image('eBtnPressed', eBtnPressed);

    }

    create(data) {
        GameState.initData(daysConfig, scriptedNpcs);

        if (data && data.loadSave && data.saveData) {
            GameState.currentDay = data.saveData.currentDay;
            GameState.reputation = data.saveData.reputation;

            if (data.saveData.specialNpcRecords) {
                GameState.specialNpcRecords = data.saveData.specialNpcRecords;
            }

            if (data.saveData.tutorialDone) {
                this.registry.set('tutorialDone', true);
            }

            if (data.saveData.topdownNpcFirstDialogueDone) {
                GameState.topdownNpcFirstDialogueDone = data.saveData.topdownNpcFirstDialogueDone;
            }
            GameState.timesMotherTalkedToPlayer = data.saveData.timesMotherTalkedToPlayer || 0;
            GameState.lastDayTalkedToMother = data.saveData.lastDayTalkedToMother || 0;

            this.scene.start('house');
        } else {
            this.scene.start('Letter');
        }
    }
}