import Phaser from 'phaser';

import Book from '../game-objects/book.js';
import Cauldron from '../game-objects/cauldron.js';

export default class Kitchen extends Phaser.Scene {
    constructor() {
        super({ key: 'kitchen' }); // id escena
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

        // crear elementos interactivos de la cocina
        const bookButton = this.createKitchenItem(262, 119, 'bookOnTable', 'bookOnTableB');
        this.mortar = this.createKitchenItem(9, 106, 'mortar', 'mortarB');
        this.cauldronImg = this.createKitchenItem(133, 86, 'cauldron', 'cauldronB');
        this.cuttingBoard = this.createKitchenItem(10, 129, 'cuttingBoard', 'cuttingBoardB');
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

        this.cauldron = new Cauldron(this, this.cauldronImg);

        this.grabFromJar(mushroomJar, 'mushrooms', 'mushroom');

        // pausa
        this.pauseKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.openPauseMenu();
        }
    }


    openPauseMenu() {
        this.scene.launch('Menu', { parentScene: this.scene.key });
        this.scene.pause();
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


    // crea un item interactivo de la cocina
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


    // lógica para coger un ingrediente de un tarro y arrastrarlo a una herramienta
    grabFromJar(jarSprite, ingredientId, dragItemKey) {
        
        jarSprite.on('pointerdown', (pointer) => {
            
            // crear el sprite que sigue al cursor
            const dragItem = this.add.image(pointer.x, pointer.y, dragItemKey)
                .setScale(3)
                .setDepth(100);

            let isDragging = true;
            
            // el sprite sigue al cursor mientras se arrastra
            const moveItem = (ptr) => {
                if (isDragging) {
                    dragItem.x = ptr.x;
                    dragItem.y = ptr.y;
                }
            };
            this.input.on('pointermove', moveItem);

            // al soltar el ingrediente, comprobamos dónde (tabla, mortero, caldero o fuera) y qué acción tomar
            const dropItem = (ptr) => {
                isDragging = false;
                this.input.off('pointermove', moveItem);

                // lista de objetos debajo del cursor al soltar el ingrediente
                const objectsUnderMouse = this.input.hitTestPointer(ptr);
                
                if (objectsUnderMouse.includes(this.cuttingBoard)) {
                    // minijuego cortar
                    dragItem.destroy();
                    
                } else if (objectsUnderMouse.includes(this.mortar)) {
                    // minijuego machacar
                    dragItem.destroy();
                    
                } else if (objectsUnderMouse.includes(this.cauldronImg)) {
                    // añadir al caldero
                    dragItem.destroy();
                    
                } else {
                    dragItem.destroy();
                }
            };

            this.input.once('pointerup', dropItem);
        });
    }

}