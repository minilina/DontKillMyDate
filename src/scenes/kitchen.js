import Phaser from 'phaser';
import Book from '../game-objects/book.js';
import Cauldron from '../game-objects/cauldron.js';

// sprites cocina
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

// sprites libro abierto
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


export default class Kitchen extends Phaser.Scene {
    constructor() {
        super({ key: 'kitchen' }); // id escena
    }

    preload() {
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
    }

    create() {

        const bg = this.add.image(0, 0, 'kitchen')
            .setOrigin(0, 0)
            .setScale(3)
            .setInteractive(); // PROVISIONAL

        // PROVISIONAL: para pasar a top-down cuando se haga click en la cocina
        bg.on('pointerdown', () => {
            this.finishKitchen();
        });

        const bookButton = this.createKitchenItem(262, 119, 'bookOnTable', 'bookOnTableB');
        const mortar = this.createKitchenItem(9, 106, 'mortar', 'mortarB');
        const cauldron = this.createKitchenItem(133, 86, 'cauldron', 'cauldronB');
        const cuttingBoard = this.createKitchenItem(10, 129, 'cuttingBoard', 'cuttingBoardB');
        const crystalJar = this.createKitchenItem(57, 54, 'crystalJar', 'crystalJarB');
        const algaeJar = this.createKitchenItem(33, 54, 'algaeJar', 'algaeJarB');
        const mushroomJar = this.createKitchenItem(22, 21, 'mushroomJar', 'mushroomJarB');
        const rootsJar = this.createKitchenItem(68, 21, 'rootsJar', 'rootsJarB');
        const berriesJar = this.createKitchenItem(45, 21, 'berriesJar', 'berriesJarB');
        const redBowl = this.createKitchenItem(87, 113, 'redBowl', 'redBowlB');
        const blueBowl = this.createKitchenItem(107, 113, 'blueBowl', 'blueBowlB');
        const yellowBowl = this.createKitchenItem(97, 125, 'yellowBowl', 'yellowBowlB');
        const redTestTube = this.createKitchenItem(214, 121, 'redTestTube', 'redTestTubeB');
        const greenTestTube = this.createKitchenItem(236, 121, 'greenTestTube', 'greenTestTubeB');
        const grayTestTube = this.createKitchenItem(225, 121, 'grayTestTube', 'grayTestTubeB');

        this.book = new Book(this);

        bookButton.on('pointerdown', () => {
            this.book.open();
        });

        this.cauldron = new Cauldron(this, cauldron);

    }

    finishKitchen() {
        // 1) cerrar cocina
        this.scene.stop("kitchen");
        this.scene.wake("store");

        // 2) continuar turno (nuevo cliente / nuevo diálogo)
        const storeScene = this.scene.get("store");

        // Si por lo que sea no existe la tienda, fallback
        if (!storeScene) {
            this.scene.start("house");
            return;
        }

        // Si el flow existe, seguimos el turno.
        // Si no existe, fallback.
        if (storeScene.flow && typeof storeScene.flow.continueShift === "function") {
            storeScene.flow.continueShift();
            return;
        }

        this.scene.start("house");
    }

    //  crea un item interactivo de la cocina
    createKitchenItem(x, y, normalKey, borderKey) {
        const scale = 3;

        // añadir imagen
        const item = this.add.image(x * scale, y * scale, normalKey)
            .setOrigin(0, 0)
            .setScale(scale)
            .setInteractive({
                useHandCursor: true,
                pixelPerfect: true
            });

        // efecto ratón encima del objeto
        item.on('pointerover', () => {
            item.setTexture(borderKey);
        });

        // efecto ratón fuera del objeto
        item.on('pointerout', () => {
            item.setTexture(normalKey);
        });

        return item;
    }

}