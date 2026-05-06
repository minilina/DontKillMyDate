import Phaser from 'phaser';

import Book from '../game-objects/book.js';
import Cauldron from '../game-objects/cauldron.js';
import Note from '../game-objects/note.js';
import KitchenTutorial from '../tutorial/kitchenTutorial.js';
import DialogueManager from '../dialogue/dialogueManager.js';
import GameState from '../state/GameState.js';


export default class Kitchen extends Phaser.Scene {
    constructor() {
        super({ key: 'kitchen' }); // id escena
    }

    init(data) {
        // TUTORIAL
        // comprobar si ya completamos el tutorial en el registro global
        const tutorialDone = this.registry.get('tutorialDone');

        if (tutorialDone) {
            this.shouldStartInTutorialMode = false;
        } else {
            this.shouldStartInTutorialMode = data?.startInTutorialMode || false;
        }

        // limpiar la variable para que Phaser no la recicle si la escena se reinicia
        if (data) {
            data.startInTutorialMode = false;
        }
    }

    create() {

        // variables tutorial
        this.hooks = {};
        this.tutorialMode = false;
        const startTutorial = this.shouldStartInTutorialMode;
        this.shouldStartInTutorialMode = false;

        // variables generales
        this.isDraggingItem = false;
        this.indicatorArrows = [];

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

        this.crystalJar = this.createKitchenItem(62, 54, 'crystalJar', 'crystalJarB');
        this.algaeJar = this.createKitchenItem(38, 54, 'algaeJar', 'algaeJarB');
        this.mushroomJar = this.createKitchenItem(27, 21, 'mushroomJar', 'mushroomJarB');
        this.rootsJar = this.createKitchenItem(73, 21, 'rootsJar', 'rootsJarB');
        this.berriesJar = this.createKitchenItem(50, 21, 'berriesJar', 'berriesJarB');

        this.redBowl = this.createKitchenItem(81, 113, 'redBowl', 'redBowlB');
        this.blueBowl = this.createKitchenItem(101, 113, 'blueBowl', 'blueBowlB');
        this.yellowBowl = this.createKitchenItem(91, 125, 'yellowBowl', 'yellowBowlB');

        this.emptyNormalPotion = this.createKitchenItem(130, 12, 'emptyNormalPotion', 'emptyNormalPotionB');
        this.emptyHeartPotion = this.createKitchenItem(174, 12, 'emptyHeartPotion', 'emptyHeartPotionB');
        this.emptyStarPotion = this.createKitchenItem(151, 12, 'emptyStarPotion', 'emptyStarPotionB');

        this.redTestTube = this.createKitchenItem(233, 98, 'redTestTube', 'redTestTubeB');
        this.greenTestTube = this.createKitchenItem(253, 98, 'greenTestTube', 'greenTestTubeB');
        this.grayTestTube = this.createKitchenItem(243, 98, 'grayTestTube', 'grayTestTubeB');
        this.createKitchenItem(231, 102, 'testTubeRack', 'testTubeRackB', false);

        this.trash = this.createKitchenItem(294, 113, 'trash', 'trashB', false);
        this.delivery = this.createKitchenItem(281, 133, 'delivery', 'deliveryB', false);

        this.note = this.createKitchenItem(150, 44, "note", "noteB");

        this.cauldronImg = this.createKitchenItem(129, 86, 'cauldron', 'cauldronB');
        this.bookImg = this.createKitchenItem(205, 125, 'bookOnTable', 'bookOnTableB');



        this.mixPlateColor = this.add.image(93 * 3, 146 * 3, 'redPlate').setOrigin(0, 0).setScale(3).setVisible(false).setDepth(1);
        this.mixPlate = this.createKitchenItem(88, 141, 'plate', 'plateB', false);
        this.mixPlate.on('pointerover', () => {
            // se pone el borde en el plato solo si NO estamos arrastrando algo y SÍ tiene algún color dentro
            if (!this.isDraggingItem && this.selectedColors.size > 0) {
                this.mixPlate.setTexture('plateB');
            }
        });
        this.mixPlate.on('pointerout', () => {
            if (!this.isDraggingItem) {
                this.mixPlate.setTexture('plate');
            }
        });

        this.stone = this.createKitchenItem(170, 120, 'stone', 'stone');
        this.stone.setScale(.2);


        this.stone.on('pointerdown', () => {
            // Si acaba de hacer clic hace un instante, ignoramos este clic extra
            if (this.isClickLocked) return;

            if (!this.isDraggingItem) {
                this.isClickLocked = true; // Bloqueamos temporalmente

                const heatHook = this.runHook('kitchen:cauldron:heat');
                if (!heatHook.cancelled) {
                    this.cauldron.toggleFire(); // Llamamos al caldero directamente
                }

                // Desbloqueamos después de 250 milisegundos (1/4 de segundo)
                this.time.delayedCall(250, () => {
                    this.isClickLocked = false;
                });
            }
        });

        this.cauldron = new Cauldron(this, this.cauldronImg);

        /* Escuchamos el evento del caldero y lo convertimos en un hook
        this.events.on('cauldron:tryheat', () => {
            const heatHook = this.runHook('kitchen:cauldron:heat');
            if (!heatHook.cancelled) {
                this.cauldron.toggleFire();
            }
        });*/

        this.book = new Book(this);
        this.bookImg.on('pointerdown', () => {
            // DISPARAMOS HOOK "ABRIR LIBRO"
            const bookHook = this.runHook('kitchen:book:open');
            if (bookHook.cancelled) return;

            this.book.open();
        });

        this.noteUI = new Note(this);
        this.note.on("pointerdown", () => {
            this.hideIndicators();
            this.noteUI.open();
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
        this.grab(this.mushroomJar, 'mushroomB', 'taste', 'cutMushroom');
        this.grab(this.berriesJar, 'berryB', 'taste', 'cutBerry');
        this.grab(this.rootsJar, 'rootB', 'taste', 'cutRoot');
        this.grab(this.algaeJar, 'algaeB', 'taste', 'cutAlgae');
        this.grab(this.crystalJar, 'crystalB', 'taste', 'cutCrystal');

        // polvos (color)
        this.grab(this.redBowl, 'redPowder', 'color', 'red');
        this.grab(this.blueBowl, 'bluePowder', 'color', 'blue');
        this.grab(this.yellowBowl, 'yellowPowder', 'color', 'yellow');
        this.grab(this.mixPlate, 'dynamic', 'color', null); // dynamic porque el sprite que arrastra depende de lo que haya mezclado el jugador

        // compatibilidad (olor)
        this.grab(this.redTestTube, 'redTestTubeB', 'smell', 'redTestTube');
        this.grab(this.grayTestTube, 'grayTestTubeB', 'smell', 'grayTestTube');
        this.grab(this.greenTestTube, 'greenTestTubeB', 'smell', 'greenTestTube');

        // pociones (forma)
        this.grab(this.emptyNormalPotion, 'emptyNormalPotionB', 'shape', 'Normal');
        this.grab(this.emptyHeartPotion, 'emptyHeartPotionB', 'shape', 'Heart');
        this.grab(this.emptyStarPotion, 'emptyStarPotionB', 'shape', 'Star');

        // pausa
        this.pauseKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC
        );

        this.dialogue = new DialogueManager(this);
        this.kitchenTutorial = new KitchenTutorial(this, this.dialogue);

        console.log("Kitchen.create() -> Comprobando si hay que iniciar el tutorial...");
        if (startTutorial) {
            console.log("Kitchen.create() -> SÍ, iniciando tutorial 'full'.");
            this.startTutorial('full');
        } else {
            console.log("Kitchen.create() -> NO, modo de juego normal.");
            const noteArrow = this.add.sprite(this.note.x + 18, this.note.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(noteArrow);

            this.indicatorTween = this.tweens.add({
                targets: this.indicatorArrows,
                y: '-=10',
                duration: 600,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        // Pausa
        this.pauseKey = this.input.keyboard.addKey(
            Phaser.Input.Keyboard.KeyCodes.ESC,
        );
        this.createPauseButton();

    }
    createPauseButton() {
        const btnX = this.scale.width - 25;
        const btnY = 25;

        // Sprite botón
        this.pauseBtnBg = this.add.image(btnX, btnY, 'pauseBtn')
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5)
            .setScale(3)
            .setDepth(1000);



        // Animación hover
        this.pauseBtnBg.on('pointerover', () => {
            this.pauseBtnBg.setTexture('pauseBtnPressed');
        });

        this.pauseBtnBg.on('pointerout', () => {
            this.pauseBtnBg.setTexture('pauseBtn');
        });

        // Acción al hacer clic
        this.pauseBtnBg.on('pointerdown', () => {
            this.sound.play('buttonSound', { volume: 0.2 });
            this.openPauseMenu();
        });
    }
    update(time, delta) {
        this.flowManager?.update(time, delta);
        if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
            this.openPauseMenu();
        }
    }

    openPauseMenu() {
        this.scene.launch("Menu", { parentScene: this.scene.key });
        this.scene.pause();
    }

    finishKitchen(potionShape) {
        this.input.keyboard.enabled = false;
        this.input.enabled = false;
        this.isDraggingItem = false;

        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            let cauldronColor = this.cauldron.currentPotion.color.replace('Liquid', '');
            let finalTexture = cauldronColor + potionShape + 'Potion';

            const currentOrder = this.registry.get("currentOrder");
            const finalQuality = GameState.evaluatePotion(this.cauldron.currentPotion, currentOrder, potionShape);

            this.cauldron.resetCauldron();

            let storeScene = this.scene.get("store");
            storeScene.scene.wake();

            storeScene.showPotionResult(finalTexture, finalQuality);

            this.input.keyboard.enabled = true;
            this.input.enabled = true;

            this.scene.sleep("kitchen");
        });
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

            // DISPARAMOS HOOK "GRAB:START"
            const grabHook = this.runHook('kitchen:grab:start', { sourceSprite, itemType, itemData });
            if (grabHook.cancelled) return;

            if (itemType === 'taste') {
                const jarSounds = ['jarSound1', 'jarSound2', 'jarSound3'];
                const randomSound = Phaser.Math.RND.pick(jarSounds);
                this.sound.play(randomSound, { volume: 1 });
            }

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

            if (itemType === 'smell') {
                sourceSprite.setVisible(false);
                this.sound.play('testTubeSound', { volume: 1 });
            }
            if (itemType === 'processedTaste') {
                sourceSprite.setVisible(false);
            }

            this.showIndicators(itemType, sourceSprite);

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

            } else {
                // para el resto de objetos (jarra, botes, etc.)
                dragItem = this.add.image(pointer.x, pointer.y, currentDragItemKey).setScale(3).setDepth(100);
            }

            // arrastar
            const onPointerMove = (ptr) => {
                if (!this.isDraggingItem) return;
                dragItem.x = ptr.x;
                dragItem.y = ptr.y;
                this.updateBorders(ptr, itemType, dragItem, currentDropData);
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
    updateBorders(ptr, itemType, dragItem = null, dropData = null) {
        const objectsUnderMouse = this.input.hitTestPointer(ptr);
        this.resetBorders();

        if (itemType === 'taste') {
            this.cuttingBoard.setTexture(objectsUnderMouse.includes(this.cuttingBoard) ? 'cuttingBoardB' : 'cuttingBoard');
            this.mortar.setTexture(objectsUnderMouse.includes(this.mortar) ? 'mortarB' : 'mortar');
            this.cauldronImg.setTexture(objectsUnderMouse.includes(this.cauldronImg) ? 'cauldronB' : 'cauldron');

        } else if (itemType === 'processedTaste' || itemType === 'color' || itemType === 'smell') {
            this.cauldronImg.setTexture(objectsUnderMouse.includes(this.cauldronImg) ? 'cauldronB' : 'cauldron');
            if (itemType === 'color') {
                this.mixPlate.setTexture(objectsUnderMouse.includes(this.mixPlate) ? 'plateB' : 'plate');
            }

        } else if (itemType === 'shape') {
            this.cauldronImg.setTexture(objectsUnderMouse.includes(this.cauldronImg) ? 'cauldronB' : 'cauldron');
            this.delivery.setTexture(objectsUnderMouse.includes(this.delivery) ? 'deliveryB' : 'delivery');

            // si está sobre el caldero y el sprite actual es una poción vacía
            if (objectsUnderMouse.includes(this.cauldronImg) && dragItem && dragItem.texture.key.includes('empty')) {
                let cauldronColor = this.cauldron.currentPotion.color;

                // rellenar poción con el color del caldero (si tiene)
                if (cauldronColor) {

                    // DISPARAMOS HOOK "RELLENAR POCION"
                    const fillHook = this.runHook('kitchen:potion:fill', { color: cauldronColor, shape: dropData });
                    if (fillHook.cancelled) return;

                    cauldronColor = cauldronColor.replace('Liquid', '');
                    const newTexture = cauldronColor + dropData + 'PotionB'; // ej: 'blue' + 'Heart' + 'PotionB'
                    dragItem.setTexture(newTexture);
                    this.cauldronImg.setTexture('cauldron'); // quitar borde caldero para que no confunda con la poción
                    this.cauldron.liquidSprite.setVisible(false);

                    // mostrar indicador de entrega
                    this.hideIndicators();
                    const arrowDelivery = this.add.sprite(this.delivery.x + 60, this.delivery.y - 15, 'indicator').setDepth(100).setScale(3);
                    this.indicatorArrows.push(arrowDelivery);

                    this.indicatorTween = this.tweens.add({
                        targets: this.indicatorArrows,
                        y: '-=10',
                        duration: 600,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            }
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
                // DISPARAMOS HOOK "DROP EN LA TABLA"
                const dropHook = this.runHook('kitchen:drop:cuttingBoard', { itemType, dropData });
                if (dropHook.cancelled) return false;

                // minijuego cortar
                this.scene.pause();
                this.scene.launch('cuttingMinigame', { ingredient: dropData });
                isDroppedSuccessfully = true;

            }
            else if (objectsUnderMouse.includes(this.mortar)) {
                const dropHook = this.runHook('kitchen:drop:mortar', { itemType, dropData });


                if (dropHook && dropHook.cancelled) {

                    return;
                }


                // minijuego machacar
                this.scene.pause();
                this.scene.launch('mortarMinigame', { ingredient: dropData });
                isDroppedSuccessfully = true;


            } else if (objectsUnderMouse.includes(this.cauldronImg)) {
                // DISPARAMOS HOOK "DROP EN CALDERO"
                this.runHook('kitchen:drop:cauldron', { itemType, dropData });
                this.sound.play('dropCauldronSound', { volume: 1 });

                // añadir al caldero
                this.cauldron.addIngredient('taste', this.tasteDict[dropData.replace('cut', '').toLowerCase()]);
                this.cauldron.addIngredient('consistency', 'whole');
                isDroppedSuccessfully = true;

            }
        } else if (itemType === 'processedTaste') {
            if (objectsUnderMouse.includes(this.cauldronImg)) {
                // DISPARAMOS HOOK "DROP EN CALDERO"
                this.runHook('kitchen:drop:cauldron', { itemType, dropData });

                this.cauldron.addIngredient('taste', this.tasteDict[dropData.name]);
                this.cauldron.addIngredient('consistency', dropData.consistency);
                isDroppedSuccessfully = true;
                this.sound.play('dropCauldronSound', { volume: 1 });

            }
        } else if (itemType === 'color') {
            // si dropData es un color base ('red', 'blue', 'yellow'), es un polvo sacado directo del cuenco
            // si lo soltamos en el plato
            if (['red', 'blue', 'yellow'].includes(dropData) && objectsUnderMouse.includes(this.mixPlate)) {
                // DISPARAMOS HOOK "AÑADIR A PLATO DE MEZCLA"
                const mixHook = this.runHook('kitchen:add', { color: dropData });
                if (mixHook.cancelled) return;

                this.addPowderToPlate(dropData);
                isDroppedSuccessfully = true;


            }
            // si soltamos algo de color al caldero (ya sea base o mezclado)
            else if (objectsUnderMouse.includes(this.cauldronImg)) {
                // si ya hay un color en el caldero, cancelar la acción
                if (this.cauldron.currentPotion.color !== null) return false;

                this.runHook('kitchen:drop:cauldron', { itemType, dropData });

                this.cauldron.addIngredient('color', dropData + 'Liquid');
                isDroppedSuccessfully = true;
                this.sound.play('dropCauldronSound', { volume: 1 });

            }
        } else if (itemType == 'smell') {
            if (objectsUnderMouse.includes(this.cauldronImg)) {
                // DISPARAMOS HOOK "DROP EN CALDERO"
                this.runHook('kitchen:drop:cauldron', { itemType, dropData });

                this.cauldron.addIngredient('smell', dropData);
                isDroppedSuccessfully = true;
                this.sound.play('dropCauldronSound', { volume: 1 });

            }
        } else if (itemType === 'shape') {
            if (objectsUnderMouse.includes(this.delivery)) {
                if (this.cauldron.currentPotion.color) {
                    // DISPARAMOS HOOK "ENTREGAR POCION"
                    const deliverHook = this.runHook('kitchen:deliver', { shape: dropData });
                    if (deliverHook.cancelled) return false;

                    if (this.cauldron.currentPotion.color) {
                        this.finishKitchen(dropData);
                        isDroppedSuccessfully = true;
                    }
                }
            }
        }
        return isDroppedSuccessfully;
    }

    // muestra indicadores sobre las estaciones de la cocina
    showIndicators(itemType, sourceSprite) {
        this.hideIndicators();
        // si es un SABOR: flechas en mortero, caldero y tabla
        if (itemType === 'taste') {
            const arrow1 = this.add.sprite(this.mortar.x + 36, this.mortar.y - 15, 'indicator').setDepth(100).setScale(3);
            const arrow2 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            const arrow3 = this.add.sprite(this.cuttingBoard.x + 99, this.cuttingBoard.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1, arrow2, arrow3);
        } else if (itemType === 'processedTaste') {
            // si es un SABOR PROCESADO: flecha en caldero
            const arrow1 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1);
        } else if (itemType === 'color') {
            // si es un COLOR: flechas en platito (si NO hemos cogido el polvo de él) y caldero
            if (sourceSprite !== this.mixPlate) {
                const arrow1 = this.add.sprite(this.mixPlate.x + 30, this.mixPlate.y - 15, 'indicator').setDepth(100).setScale(3);
                this.indicatorArrows.push(arrow1);
            }
            const arrow2 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow2);
        } else if (itemType === 'smell') {
            // si es un OLOR: flecha en caldero
            const arrow1 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1);
        } else if (itemType === 'shape') {
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

        } else if (processType === 'mortar') {

            const baseName = ingredient.replace('cut', '').toLowerCase();

            // diccionario para encontrar la llave de la textura correcta
            const mortarSprites = {
                'algae': { inMortar: 'algaeInMortar', smashed: 'smashedAlgae' },
                'berry': { inMortar: 'berriesInMortar', smashed: 'smashedBerries' },
                'mushroom': { inMortar: 'mushroomInMortar', smashed: 'smashedMushroom' },
                'root': { inMortar: 'rootInMortar', smashed: 'smashedRoot' },
                'crystal': { inMortar: 'crystalInMortar', smashed: 'smashedCrystal' }
            };

            const spriteKeys = mortarSprites[baseName];

            // crear el sprite del ingrediente machacado sobre el mortero
            const mashedIngredient = this.add.sprite(
                14 * 3,
                112 * 3,
                spriteKeys.inMortar
            )
                .setOrigin(0, 0)
                .setScale(3)
                .setInteractive({
                    useHandCursor: true,
                    pixelPerfect: true
                });

            this.grab(mashedIngredient, spriteKeys.smashed, 'processedTaste', {
                name: baseName,
                consistency: 'mashed'
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

    // ---------------------------
    // Tutorial
    // ---------------------------

    // Nuevos métodos para activar / desactivar los tutoriales
    startTutorial(id) {
        if (this.tutorialMode) return;
        this.tutorialMode = true;
        this.kitchenTutorial.start(id);
    }

    stopTutorial() {
        if (!this.tutorialMode) return;
        this.kitchenTutorial.finish();
    }

    // METODOS DE HOOKS EN KITCHEN

    // Registrar una función que se ejecute cuando ocurra un hook, esta función espera el nombre del hook y la función a ejecutar
    addHook(name, fn) {
        if (!this.hooks[name]) {
            this.hooks[name] = [];
        }
        this.hooks[name].push(fn);

        // Devolvemos una función para eliminar el hook registrado
        return () => this.removeHook(name, fn);
    }

    removeHook(name, fn) {
        if (!this.hooks[name]) return;
        this.hooks[name] = this.hooks[name].filter(hookFn => hookFn !== fn);
    }

    // Ejecuta los hooks registrados para un evento con el nombre y los datos que se pasan (el ingrediente...)
    // Si algún hook devuelve {cancelled: true}, se detiene la acción normal
    runHook(name, data) {
        const hookFunctions = this.hooks[name];
        if (!hookFunctions || hookFunctions.length === 0)
            return { cancelled: false };

        let isCancelled = false;
        for (const fn of [...hookFunctions]) {
            const result = fn(data);
            // Convención: si el hook devuelve un objeto con `cancel: true`, se cancela la acción.
            if (result && result.cancel === true) {
                isCancelled = true;
            }
        }

        return { cancelled: isCancelled };
    }
}
