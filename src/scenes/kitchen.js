import Phaser from 'phaser';

import Book from '../game-objects/book.js';
import Cauldron from '../game-objects/cauldron.js';

export default class Kitchen extends Phaser.Scene {
    constructor() {
        super({ key: 'kitchen' }); // id escena
    }

    create() {

        this.isDraggingItem = false;

        this.bg = this.add.image(0, 0, 'kitchen').setOrigin(0, 0).setScale(3);
        this.lightOverlay = this.add.image(0, 0, 'lightOverlay').setOrigin(0, 0).setScale(3).setDepth(200);

        // sabores ingredientes
        this.tasteDict = {
            'mushroom': 'umami',
            'berry': 'sour',     // ácido
            'root': 'bitter',    // amargo
            'algae': 'sweet',    // dulce
            'crystal': 'salty'   // salado
        };

        // crear elementos interactivos de la cocina
        this.mortar = this.createKitchenItem(9, 106, 'mortar', 'mortarB', false);
        this.cuttingBoard = this.createKitchenItem(10, 129, 'cuttingBoard', 'cuttingBoardB', false);

        const crystalJar = this.createKitchenItem(62, 54, 'crystalJar', 'crystalJarB');
        const algaeJar = this.createKitchenItem(38, 54, 'algaeJar', 'algaeJarB');
        const mushroomJar = this.createKitchenItem(27, 21, 'mushroomJar', 'mushroomJarB');
        const rootsJar = this.createKitchenItem(73, 21, 'rootsJar', 'rootsJarB');
        const berriesJar = this.createKitchenItem(50, 21, 'berriesJar', 'berriesJarB');

        const redBowl = this.createKitchenItem(81, 113, 'redBowl', 'redBowlB');
        const blueBowl = this.createKitchenItem(101, 113, 'blueBowl', 'blueBowlB');
        const yellowBowl = this.createKitchenItem(91, 125, 'yellowBowl', 'yellowBowlB');

        const emptyNormalPotion = this.createKitchenItem(130, 12, 'emptyNormalPotion', 'emptyNormalPotionB', false);
        const emptyHeartPotion = this.createKitchenItem(174, 12, 'emptyHeartPotion', 'emptyHeartPotionB', false);
        const emptyStarPotion = this.createKitchenItem(151, 12, 'emptyStarPotion', 'emptyStarPotionB', false);

        this.mixPlate = this.createKitchenItem(88, 141, 'plate', 'plateB', false);
        this.mixPlateColor = this.add.image(93 * 3, 146 * 3, 'redPlate').setOrigin(0, 0).setScale(3).setVisible(false).setDepth(1);

        const redTestTube = this.createKitchenItem(233, 98, 'redTestTube', 'redTestTubeB');
        const greenTestTube = this.createKitchenItem(253, 98, 'greenTestTube', 'greenTestTubeB');
        const grayTestTube = this.createKitchenItem(243, 98, 'grayTestTube', 'grayTestTubeB');
        this.createKitchenItem(231, 102, 'testTubeRack', 'testTubeRackB', false);

        const trash = this.createKitchenItem(294, 113, 'trash', 'trashB', false);
        const delivery = this.createKitchenItem(281, 133, 'delivery', 'deliveryB', false);

        const note = this.createKitchenItem(150, 44, 'note', 'noteB');

        this.cauldronImg = this.createKitchenItem(129, 86, 'cauldron', 'cauldronB');
        const bookImg = this.createKitchenItem(205, 125, 'bookOnTable', 'bookOnTableB');

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
            'red': 'red',
            'blue': 'blue',
            'yellow': 'yellow',
            'blue,red': 'purple',
            'red,yellow': 'orange',
            'blue,yellow': 'green'
        };

        // ingredientes (sabor)
        this.grab(mushroomJar, 'mushroomB', 'taste', 'cutMushroom');
        this.grab(berriesJar, 'berryB', 'taste', 'cutBerry');
        this.grab(rootsJar, 'rootB', 'taste', 'cutRoot');
        this.grab(algaeJar, 'algaeB', 'taste', 'cutAlgae');
        this.grab(crystalJar, 'crystalB', 'taste', 'cutCrystal');

        // polvos (color)
        this.grab(redBowl, 'redPowder', 'color', 'red');
        this.grab(blueBowl, 'bluePowder', 'color', 'blue');
        this.grab(yellowBowl, 'yellowPowder', 'color', 'yellow');
        this.grab(this.mixPlate, 'dynamic', 'color', null); // dynamic porque el sprite que arrastra depende de lo que haya mezclado el jugador

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
        this.scene.sleep("kitchen");

        let storeScene = this.scene.get("store");
        storeScene.scene.wake();

        storeScene.showPotionResult();
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
            let currentDragItemKey = dragItemKey;

            // platito de mezclas
            if (itemType === 'color' && !itemData) {
                // si está vacío, no hacer nada
                if (this.selectedColors.size === 0) return;

                // coger polvos y quitar color platito
                currentDropData = this.currentMixedColor;
                currentDragItemKey = this.currentMixedColor + 'Powder'; // ej. 'purplePowder'

                this.selectedColors.clear();
                this.currentMixedColor = null;
                this.mixPlateColor.setVisible(false);
            }

            this.isDraggingItem = true;

            if (itemType === 'smell' || itemType === 'processedTaste') {
                sourceSprite.setVisible(false);
            }

            this.showIndicators(itemType);

            // crear el sprite que sigue al cursor
            let dragItem;
            if (itemType === 'processedTaste' && currentDropData.cuts) {
                const borderKey = currentDragItemKey + 'B';

                dragItem = this.createChoppedContainer(
                    pointer.x,
                    pointer.y,
                    borderKey,
                    currentDropData.cuts
                );
                dragItem.setDepth(100);

            }
            else {
                // para el resto de objetos (jarra, botes, etc.)
                dragItem = this.add.image(pointer.x, pointer.y, currentDragItemKey).setScale(3).setDepth(100);
            }

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

                const success = this.handleItemDrop(ptr, itemType, currentDropData); // mirar dónde ha caído
                dragItem.destroy();

                // lógica de desaparición según el éxito
                if ((itemType === 'smell' || itemType === 'processedTaste') && !success) {
                    sourceSprite.setVisible(true);
                } else if (itemType === 'processedTaste' && success) {
                    sourceSprite.destroy();
                }
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
        }
        else if (itemType === 'processedTaste') {
            this.cauldronImg.setTexture(objectsUnderMouse.includes(this.cauldronImg) ? 'cauldronB' : 'cauldron');
        }
        else if (itemType === 'color') {
            this.mixPlate.setTexture(objectsUnderMouse.includes(this.mixPlate) ? 'plateB' : 'plate');
            this.cauldronImg.setTexture(objectsUnderMouse.includes(this.cauldronImg) ? 'cauldronB' : 'cauldron');
        }
        else if (itemType === 'smell') {
            this.cauldronImg.setTexture(objectsUnderMouse.includes(this.cauldronImg) ? 'cauldronB' : 'cauldron');
        }

    }


    // quitar bordes
    resetBorders() {
        this.cuttingBoard.setTexture('cuttingBoard');
        this.mortar.setTexture('mortar');
        this.cauldronImg.setTexture('cauldron');
        this.mixPlate.setTexture('plate');
    }


    // mirar dónde ha soltado el jugador el item y qué pasa en cada caso
    handleItemDrop(ptr, itemType, dropData) {
        const objectsUnderMouse = this.input.hitTestPointer(ptr);
        let isDroppedSuccessfully = false;

        if (itemType === 'taste') {
            if (objectsUnderMouse.includes(this.cuttingBoard)) {
                // minijuego cortar
                this.scene.pause();
                this.scene.launch('cuttingMinigame', { ingredient: dropData });
                isDroppedSuccessfully = true;
            }
            else if (objectsUnderMouse.includes(this.mortar)) {
                // minijuego machacar
                this.scene.pause();
                this.scene.launch('mortarMinigame', { ingredient: dropData });
                isDroppedSuccessfully = true;
            }
            else if (objectsUnderMouse.includes(this.cauldronImg)) {
                // añadir al caldero
                this.cauldron.addIngredient('taste', this.tasteDict[dropData.replace('cut', '').toLowerCase()]);
                this.cauldron.addIngredient('consistency', 'whole');
                isDroppedSuccessfully = true;
            }
        }
        else if (itemType === 'processedTaste') {
            if (objectsUnderMouse.includes(this.cauldronImg)) {
                ;
                this.cauldron.addIngredient('taste', this.tasteDict[dropData.name]);
                this.cauldron.addIngredient('consistency', dropData.consistency);
                isDroppedSuccessfully = true;
            }
        }
        else if (itemType === 'color') {
            // si dropData es un color base ('red', 'blue', 'yellow'), es un polvo sacado directo del cuenco
            // si lo soltamos en el plato
            if (['red', 'blue', 'yellow'].includes(dropData) && objectsUnderMouse.includes(this.mixPlate)) {
                this.addPowderToPlate(dropData);
                isDroppedSuccessfully = true;
            }
            // si soltamos algo de color al caldero (ya sea base o mezclado)
            else if (objectsUnderMouse.includes(this.cauldronImg)) {
                this.cauldron.addIngredient('color', dropData + 'Liquid');
                isDroppedSuccessfully = true;
            }
        }
        else if (itemType == 'smell') {
            if (objectsUnderMouse.includes(this.cauldronImg)) {
                this.cauldron.addIngredient('smell', dropData);
                isDroppedSuccessfully = true;
            }
        }
        return isDroppedSuccessfully;
    }


    // muestra indicadores sobre las estaciones de la cocina
    showIndicators(itemType) {
        this.indicatorArrows = [];
        // si es un SABOR: flechas en mortero, caldero y tabla
        if (itemType === 'taste') {
            const arrow1 = this.add.sprite(this.mortar.x + 36, this.mortar.y - 15, 'indicator').setDepth(100).setScale(3);
            const arrow2 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            const arrow3 = this.add.sprite(this.cuttingBoard.x + 99, this.cuttingBoard.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1, arrow2, arrow3);
        }
        // si es un SABOR PROCESADO: flecha en caldero
        else if (itemType === 'processedTaste') {
            const arrow1 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1);
        }
        // si es un COLOR: flechas en platito y caldero
        else if (itemType === 'color') {
            const arrow1 = this.add.sprite(this.mixPlate.x + 30, this.mixPlate.y - 15, 'indicator').setDepth(100).setScale(3);
            const arrow2 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1, arrow2);
        }
        // si es un OLOR: flecha en caldero
        else if (itemType === 'smell') {
            const arrow1 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1);
        }

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
                this.mixPlateColor.setTexture(this.currentMixedColor + 'Plate');
                this.mixPlateColor.setVisible(true);
            }
        }
    }


    // devolver el ingrediente procesado a la cocina después del minijuego
    returnFromMinigame(ingredient, processType, cutsArray = []) {
        if (processType === 'cut') {

            const baseName = ingredient.replace('cut', '').toLowerCase();
            const normalKey = baseName;       // ej: 'mushroom'
            const borderKey = baseName + 'B'; // ej: 'mushroomB'

            // crear el contenedor con los trozos cortados y hacerlo interactivo
            const ingredientContainer = this.createChoppedContainer(
                this.cuttingBoard.x + 54,
                this.cuttingBoard.y + 15,
                normalKey,
                cutsArray
            );
            ingredientContainer.input.cursor = 'pointer';

            ingredientContainer.on('pointerover', () => {
                if (!this.isDraggingItem) {
                    ingredientContainer.iterate(child => child.setTexture(borderKey));
                }
            });

            ingredientContainer.on('pointerout', () => {
                ingredientContainer.iterate(child => child.setTexture(normalKey));
            });

            // pasar la configuración a grab
            this.grab(ingredientContainer, normalKey, 'processedTaste', {
                name: baseName,
                consistency: 'chopped',
                cuts: cutsArray
            });
        }
    }

    // crear un contenedor con los trozos cortados de un ingrediente para echarlos al caldero
    createChoppedContainer(x, y, spriteKey, cutsArray) {
        const tex = this.textures.getFrame(spriteKey);
        const pieceW = tex.width / 4;
        const container = this.add.container(x, y).setScale(3);

        let start = 0; // índice del primer segmento del bloque actual
        let xPos = 0;  // posición x dentro del contenedor

        for (let i = 0; i < 4; i++) {
            // dibujar solo si el corte i es true o es el último trozo
            if (cutsArray[i] || i === 3) {
                // calcular ancho: si es el final, usar lo que sobre de la imagen
                const width = (i === 3) ? (tex.width - start * pieceW) : (i - start + 1) * pieceW;
                const piece = this.add.sprite(xPos, 0, spriteKey).setOrigin(0, 0);

                // recortar la sección acumulada de la textura
                piece.setCrop(start * pieceW, 0, width, tex.height);
                container.add(piece);

                // avanzar x sumando el ancho
                xPos += width;
                start = i + 1;
            }
        }

        // configurar el tamaño y el área de clic de una sola vez
        return container.setSize(xPos, tex.height).setInteractive(
            new Phaser.Geom.Rectangle(xPos / 2, tex.height / 2, xPos, tex.height),
            Phaser.Geom.Rectangle.Contains
        );
    }
}