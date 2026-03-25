import Phaser from 'phaser';

import Book from '../game-objects/book.js';
import Cauldron from '../game-objects/cauldron.js';

export default class Kitchen extends Phaser.Scene {
    constructor() {
        super({ key: 'kitchen' }); // id escena
    }

    create() {

        this.isDraggingItem = false;

        const bg = this.add.image(0, 0, 'kitchen').setOrigin(0, 0).setScale(3);

        // crear elementos interactivos de la cocina
        this.mortar = this.createKitchenItem(9, 106, 'mortar', 'mortarB', false);
        this.cuttingBoard = this.createKitchenItem(10, 129, 'cuttingBoard', 'cuttingBoardB', false);

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

        this.cauldronImg = this.createKitchenItem(133, 86, 'cauldron', 'cauldronB');
        const bookImg = this.createKitchenItem(262, 119, 'bookOnTable', 'bookOnTableB');

        this.cauldron = new Cauldron(this, this.cauldronImg);
        this.book = new Book(this);

        bookImg.on('pointerdown', () => {
            this.book.open();
        });

        // sistema mezcla colores cuencos
        this.selectedColors = new Set();
        this.maxColors = 2;
        this.currentMixedColor = null;

        this.colorRecipes = {
            'red': 0x7c1c1c,
            'blue': 0x376482,
            'yellow': 0xbfb25c,
            'blue,red': 0x800080,
            'red,yellow': 0xff8800,
            'blue,yellow': 0x00ff00
        };

        this.mixPlate = this.add.rectangle(300, 450, 10 * 3, 10 * 3, 0xffffff).setDepth(2).setInteractive({ useHandCursor: true });

        // ingredientes (sabor)
        this.grab(mushroomJar, 'mushroomB', 'taste', 'mushroom');
        this.grab(berriesJar, 'berryB', 'taste', 'berry');
        this.grab(rootsJar, 'rootB', 'taste', 'root');
        this.grab(algaeJar, 'algaeB', 'taste', 'algae');
        this.grab(crystalJar, 'crystalB', 'taste', 'crystal');

        // polvos (color)
        this.grab(redBowl, 'redBowlB', 'color', 'red');
        this.grab(blueBowl, 'blueBowlB', 'color', 'blue');
        this.grab(yellowBowl, 'yellowBowlB', 'color', 'yellow');
        this.grab(this.mixPlate, 'redBowlB', 'color', null);

        // compatibilidad (olor)
        this.grab(redTestTube, 'redTestTubeB', 'smell', 'redTestTube');
        this.grab(grayTestTube, 'grayTestTubeB', 'smell', 'grayTestTube');
        this.grab(greenTestTube, 'greenTestTubeB', 'smell', 'greenTestTube');

        // pausa
        this.pauseKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

        // PROVISIONAL: pasar escena con enter
        this.enterKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ENTER
        );
    }


    update() {
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.openPauseMenu();
        }

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.finishKitchen();
        }
    }


    openPauseMenu() {
        this.scene.launch('Menu', { parentScene: this.scene.key });
        this.scene.pause();
    }


    finishKitchen() {
        this.scene.stop("kitchen");
        this.scene.start("potionScore");
    }


    // crea un item interactivo de la cocina
    createKitchenItem(x, y, normalKey, borderKey, border = true) {
        const scale = 3;

        // añadir imagen
        const item = this.add.image(x * scale, y * scale, normalKey)
            .setOrigin(0, 0)
            .setScale(scale)
            .setInteractive({
                useHandCursor: border,
                pixelPerfect: true
            });

        if (border) {
            // efecto ratón encima del objeto
            item.on('pointerover', () => {
                if (!this.isDraggingItem) {
                    item.setTexture(borderKey);
                }
            });

            // efecto ratón fuera del objeto
            item.on('pointerout', () => {
                item.setTexture(normalKey);
            });
        }
        
        return item;
    }

    
    // coger ingrediente para arrastrarlo
    grab(sourceSprite, dragItemKey, itemType, itemData = null) {
        sourceSprite.on('pointerdown', (pointer) => {

            let currentDropData = itemData;

            // platito de mezclas
            if (itemType === 'color' && !itemData) {
                // si está vacío, no hacer nada
                if (this.selectedColors.size === 0) return;
                
                // coger polvos y quitar color platito
                currentDropData = this.currentMixedColor;
                this.selectedColors.clear();
                this.currentMixedColor = null;
                this.mixPlate.setFillStyle(0xffffff);
            }

            this.isDraggingItem = true;
            
            if (itemType === 'taste') {
                this.showIndicators();
            }

            // crear el sprite que sigue al cursor
            const dragItem = this.add.image(pointer.x, pointer.y, dragItemKey)
                .setScale(3)
                .setDepth(100);

            // arrastar
            const onPointerMove = (ptr) => {
                if (!this.isDraggingItem) return;
                dragItem.x = ptr.x;
                dragItem.y = ptr.y;
                this.updateBorders(ptr, itemType);
            };

            // soltar
            const onPointerUp = (ptr) => {
                this.isDraggingItem = false;
                this.hideIndicators();
                this.input.off('pointermove', onPointerMove);
                this.resetBorders();
                this.handleItemDrop(ptr, itemType, currentDropData); // mirar dónde ha caído
                dragItem.destroy();
            };

            this.input.on('pointermove', onPointerMove);
            this.input.once('pointerup', onPointerUp);
        });
    }


    // añadir borde a los items debajo del cursor
    updateBorders(ptr, itemType) {
        const objectsUnderMouse = this.input.hitTestPointer(ptr);
        this.resetBorders();

        if (itemType === 'taste') {
            this.cuttingBoard.setTexture(objectsUnderMouse.includes(this.cuttingBoard) ? 'cuttingBoardB' : 'cuttingBoard');
            this.mortar.setTexture(objectsUnderMouse.includes(this.mortar) ? 'mortarB' : 'mortar');
            this.cauldronImg.setTexture(objectsUnderMouse.includes(this.cauldronImg) ? 'cauldronB' : 'cauldron');
        } else if (itemType === 'color') {
            if (objectsUnderMouse.includes(this.mixPlate)) this.mixPlate.setStrokeStyle(4, 0xffffff);
            this.cauldronImg.setTexture(objectsUnderMouse.includes(this.cauldronImg) ? 'cauldronB' : 'cauldron');
        }
    }


    // quitar bordes
    resetBorders() {
        this.cuttingBoard.setTexture('cuttingBoard');
        this.mortar.setTexture('mortar');
        this.cauldronImg.setTexture('cauldron');
        if (this.mixPlate) this.mixPlate.setStrokeStyle(0);
    }


    // mirar dónde ha soltado el jugador el item y qué pasa en cada caso
    handleItemDrop(ptr, itemType, dropData) {
        const objectsUnderMouse = this.input.hitTestPointer(ptr);

        if (itemType === 'taste') {
            if (objectsUnderMouse.includes(this.cuttingBoard)) {
                // minijuego cortar
                this.scene.pause();
                this.scene.launch('cuttingMinigame', { ingredient: dropData });
            } else if (objectsUnderMouse.includes(this.mortar)) {
                // minijuego machacar
                this.scene.pause();
                this.scene.launch('mortarMinigame', { ingredient: dropData });
            } else if (objectsUnderMouse.includes(this.cauldronImg)) {
                // añadir al caldero
            }
        }
        else if (itemType === 'color') {
            // si dropData es un texto (ej: 'red'), es un polvo sacado directo del cuenco
            if (typeof dropData === 'string') {
                if (objectsUnderMouse.includes(this.mixPlate)) { // si el jugador lo suelta en el platito
                    this.addPowderToPlate(dropData);
                } else if (objectsUnderMouse.includes(this.cauldronImg)) { // si el jugador lo suelta en el caldero
                    const hexColor = this.colorRecipes[dropData];
                    this.cauldron.addIngredient('color', hexColor);
                }
            }
            // si dropData es un número (ej: 0x800080), es la mezcla que sacamos del plato
            else if (typeof dropData === 'number') {
                if (objectsUnderMouse.includes(this.cauldronImg)) {
                    this.cauldron.addIngredient('color', dropData);
                }
            }
        }
        else if (itemType == 'smell'){
            if (objectsUnderMouse.includes(this.cauldronImg)) {
                this.cauldron.addIngredient('smell', dropData);
            }
        }
    }


    // muestra indicadores sobre las estaciones de la cocina
    showIndicators() {
        const arrow1 = this.add.sprite(this.mortar.x + 36, this.mortar.y - 15, 'indicator').setDepth(100).setScale(3);
        const arrow2 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
        const arrow3 = this.add.sprite(this.cuttingBoard.x + 99, this.cuttingBoard.y - 15, 'indicator').setDepth(100).setScale(3);

        this.indicatorArrows = [arrow1, arrow2, arrow3];

        // animación flechas
        this.indicatorTween = this.tweens.add({
            targets: this.indicatorArrows,
            y: '-=10',
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

    }


    // quita los indicadores
    hideIndicators() {
        if (this.indicatorArrows) {
            this.indicatorArrows.forEach(arrow => arrow.destroy());
            this.indicatorArrows = [];
        }

        if (this.indicatorTween) {
            this.indicatorTween.remove();
        }
    }


    // añadir colores al plato
    addPowderToPlate(colorName) {
        if (this.selectedColors.size < this.maxColors) {
            this.selectedColors.add(colorName);
            const recipeKey = [...this.selectedColors].sort().join(',');
            this.currentMixedColor = this.colorRecipes[recipeKey];
            
            if (this.currentMixedColor !== undefined) {
                this.mixPlate.setFillStyle(this.currentMixedColor);
            }
        }
    }

}