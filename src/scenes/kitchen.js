import Phaser from 'phaser';

import Book from '../game-objects/book.js';
import Cauldron from '../game-objects/cauldron.js';
import Note from '../game-objects/note.js';
import KitchenTutorial from '../tutorial/kitchenTutorial.js';
//import DialogueManager from '../dialogue/dialogueManager.js';
import TutorialDialogueManager from '../tutorial/tutorialDialogueManager.js';
import GameState from '../state/GameState.js';
import StoppableScene from './stoppableScene.js';


export default class Kitchen extends StoppableScene {
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
            // si es el Día 1 se activa automáticamente, si no, depende de lo que mande el data
            this.shouldStartInTutorialMode = (GameState.currentDay === 1) || (data?.startInTutorialMode || false);
        }

        // limpiar la variable para que Phaser no la recicle si la escena se reinicia
        if (data) {
            data.startInTutorialMode = false;
        }
    }

    create() {
        // asegurarnos de que el cursor es el correcto al entrar en la cocina
        this.game.canvas.style.cursor = 'default';

        // variables tutorial
        this.hooks = {};
        this.tutorialMode = false;
        const startTutorial = this.shouldStartInTutorialMode;
        this.shouldStartInTutorialMode = false;

        // variables generales
        this.isDraggingItem = false;
        this.indicatorArrows = [];

        this.tablePotion = null; // guarda la poción de la mesa si se te cae en el vacío sin querer
        this.isPotionPending = false; // bloquea la cocina si hay poción en la mesa esperando a ser recogida

        this.boardItem = null;
        this.mortarItem = null;
        this.isCuttingBoardOccupied = false;
        this.isMortarOccupied = false;

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

        this.note = this.createKitchenItem(150, 44, "note", "noteB", true, true);
        this.cauldronImg = this.createKitchenItem(129, 86, 'cauldron', 'cauldronB', false).setDepth(1);
        this.bookImg = this.createKitchenItem(205, 125, 'bookOnTable', 'bookOnTableB', true, true);

        this.stones = this.createKitchenItem(125, 119, 'stones', 'stonesB').setDepth(2);

        this.stones.on('pointerdown', () => {
            if (this.isPotionPending) return;

            if (!this.isDraggingItem) {
                const heatHook = this.runHook('kitchen:cauldron:heat');

                if (!heatHook.cancelled) {
                    this.cauldron.toggleFire();
                    this.sound.play('flintSound', { volume: 1 });
                }
            }
        });

        this.mixPlateColor = this.add.image(93 * 3, 146 * 3, 'redPlate').setOrigin(0, 0).setScale(3).setVisible(false).setDepth(1);
        this.mixPlate = this.createKitchenItem(88, 141, 'plate', 'plateB', false);
        this.mixPlate.on('pointerover', () => {
            // se pone el borde en el plato solo si NO estamos arrastrando algo y SÍ tiene algún color dentro
            if (!this.isDraggingItem && !this.isPotionPending && this.selectedColors.size > 0) {
                this.mixPlate.setTexture('plateB');
            }
        });
        this.mixPlate.on('pointerout', () => {
            if (!this.isDraggingItem) {
                this.mixPlate.setTexture('plate');
            }
        });

        this.cauldron = new Cauldron(this, this.cauldronImg);

        this.book = new Book(this);
        this.bookImg.on('pointerdown', () => {
            // DISPARAMOS HOOK "ABRIR LIBRO"
            const bookHook = this.runHook('kitchen:book:open');
            if (bookHook.cancelled) return;
            const bookSounds = ['bookSound1', 'bookSound2'];
            const randomSound = Phaser.Math.RND.pick(bookSounds);
            this.sound.play(randomSound, { volume: 1 });
            this.book.open();
        });

        this.noteUI = new Note(this);
        this.note.on("pointerdown", () => {
            this.hideIndicators();
            this.noteUI.open();
            const bookSounds = ['bookSound1', 'bookSound2'];
            const randomSound = Phaser.Math.RND.pick(bookSounds);
            this.sound.play(randomSound, { volume: 1 });
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


        if (startTutorial) {
            this.dialogue = this.dialogue = new TutorialDialogueManager(this);
            this.kitchenTutorial = new KitchenTutorial(this, this.dialogue);
            this.startTutorial('full');
        } else {
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

        this.isMinigameActive = false;

        this.events.on('pause', () => {
            // solo pausa el cronómetro si NO estamos en un minijuego
            if (!this.isMinigameActive) {
                GameState.pauseTimer();
            }
        });
        
        this.events.on('resume', () => {
            GameState.resumeTimer();
            this.isMinigameActive = false; 
        });

        this.setupPause();

    }
    
    update(time, delta) {
        super.update(time, delta);
        this.flowManager?.update(time, delta);
    }

    finishKitchen(potionShape, finalTexture) {
        
        GameState.stopTimer();
        
        this.input.keyboard.enabled = false;
        this.input.enabled = false;
        this.isDraggingItem = false;

        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            const currentOrder = this.registry.get("currentOrder");
            let finalQuality;

            if (finalTexture.includes('empty')) {
                finalQuality = 0;
                GameState.currentPotion.quality = 0;
            } else {
                const potionData = this.bottledPotion ? this.bottledPotion : this.cauldron.currentPotion;
                console.log('Entregando poción con estos datos:', JSON.stringify(potionData, null, 2));
                finalQuality = GameState.evaluatePotion(potionData, currentOrder, potionShape);
            }

            this.resetKitchen();
            this.bottledPotion = null;

            let storeScene = this.scene.get("store");
            storeScene.scene.wake();

            storeScene.showPotionResult(finalTexture, finalQuality);

            this.input.keyboard.enabled = true;
            this.input.enabled = true;

            this.scene.sleep("kitchen");
        });
    }

    // crea un item interactivo de la cocina
    createKitchenItem(x, y, normalKey, borderKey, border = true, alwaysHover = false) {
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
            item.on('pointerover', () => {
                if (this.isDraggingItem) return;
                if (this.isPotionPending && !alwaysHover) return;

                item.setTexture(borderKey);
            });

            item.on('pointerout', () => {
                item.setTexture(normalKey);
            });
        }

        return item;
    }

    // coger ingrediente para arrastrarlo
    grab(sourceSprite, dragItemKey, itemType, itemData = null) {
        sourceSprite.on('pointerover', () => {
            if (!this.isDraggingItem) {
                this.game.canvas.classList.add('cursor-takeable');
            }
        });

        sourceSprite.on('pointerout', () => {
            this.game.canvas.classList.remove('cursor-takeable');
        });

        sourceSprite.on('pointerdown', (pointer) => {

            if (this.isDraggingItem) return;

            // si hay una poción en la mesa esperando decisión, no puedes coger nada más
            if (this.isPotionPending && sourceSprite !== this.tablePotion) return;

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

            let isFromPlate = false;

            if (itemType === 'color') {
                if (!itemData) {
                    // si está vacío, no hacer nada
                    if (this.selectedColors.size === 0) return;

                    isFromPlate = true;
                    // coger polvos
                    currentDropData = this.currentMixedColor;
                    currentDragItemKey = this.currentMixedColor + 'Powder';
                    this.mixPlateColor.setVisible(false);
                }
                this.sound.play('colorDustSound', { volume: 1 });
            }

            this.isDraggingItem = true;

            this.game.canvas.classList.remove('cursor-takeable');
            this.game.canvas.classList.add('cursor-take');

            if (itemType === 'smell') {
                sourceSprite.setVisible(false);
                this.sound.play('testTubeSound', { volume: 1 });
            }
            if (itemType === 'processedTaste') {
                sourceSprite.setVisible(false);
            }
            if (sourceSprite === this.tablePotion) {
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

            } else if (itemType === 'shape') {
                this.sound.play('bottleSound', { volume: 1 });
                dragItem = this.add.image(pointer.x, pointer.y, currentDragItemKey).setScale(3).setDepth(100);

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

                this.game.canvas.classList.remove('cursor-take');
                this.game.canvas.classList.remove('cursor-takeable');

                if (sourceSprite && sourceSprite.active && sourceSprite.getBounds().contains(ptr.x, ptr.y)) {
                    this.game.canvas.classList.add('cursor-takeable');
                }
                
                this.hideIndicators();
                this.input.off('pointermove', onPointerMove);
                this.resetBorders();

                let finalTexture = dragItem.texture ? dragItem.texture.key : currentDragItemKey;
                if (finalTexture && finalTexture.endsWith('B')) finalTexture = finalTexture.slice(0, -1);

                const success = this.handleItemDrop(ptr, itemType, currentDropData, sourceSprite, finalTexture); // mirar dónde ha caído
                dragItem.destroy();

                // lógica de desaparición según el éxito
                if (success) {
                    if (itemType === 'color' && isFromPlate) {
                        this.selectedColors.clear();
                        this.currentMixedColor = null;

                    } else if (itemType === 'processedTaste') {
                        if (currentDropData.source === 'board') {
                            this.isCuttingBoardOccupied = false;
                            this.boardItem = null;
                        } else if (currentDropData.source === 'mortar') {
                            this.isMortarOccupied = false;
                            this.mortarItem = null;
                        }
                        sourceSprite.destroy();
                    }
                } else {
                    // vuelven a su sitio original
                    if (itemType === 'color' && isFromPlate) {
                        this.mixPlateColor.setVisible(true);

                    } else if (itemType === 'smell' || itemType === 'processedTaste') {
                        sourceSprite.setVisible(true);
                    }
                }

                // sistema por si sueltas la poción en el vacío sin querer (ni en delivery ni en la basura)
                if (itemType === 'shape') {
                    if (success) {
                        // si se entregó o se tiró a la basura y venía de la mesa...
                        if (sourceSprite === this.tablePotion) {
                            this.tablePotion.destroy();
                            this.tablePotion = null;
                            this.isPotionPending = false;
                        }
                    } else {
                        // si se soltó mal
                        if (sourceSprite !== this.tablePotion) {
                            // poción nueva
                            if (dragItem.texture.key.includes('empty')) {
                                // si la poción está vacía no dejar en la mesa
                                return;
                            }

                            let currentKey = dragItem.texture.key;
                            if (currentKey.endsWith('B')) currentKey = currentKey.slice(0, -1);

                            const potionOnTable = this.add.image(ptr.x, ptr.y, currentKey).setScale(3).setDepth(2);
                            this.tablePotion = potionOnTable;

                            this.isPotionPending = true;

                            // animación volando a la mesa
                            this.tweens.add({
                                targets: potionOnTable,
                                x: 266 * 3,
                                y: 148 * 3,
                                duration: 300,
                                ease: 'Power2',
                                onComplete: () => this.showTablePotionIndicator(potionOnTable)
                            });

                            potionOnTable.setInteractive({ useHandCursor: true, pixelPerfect: true });

                            potionOnTable.on('pointerover', () => {
                                if (!this.isDraggingItem) {
                                    potionOnTable.setTexture(currentKey + 'B');
                                }
                            });

                            potionOnTable.on('pointerout', () => {
                                if (!this.isDraggingItem) {
                                    potionOnTable.setTexture(currentKey);
                                }
                            });

                            this.grab(potionOnTable, currentKey + 'B', 'shape', currentDropData);

                        } else {
                            // poción que ya estaba en la mesa y se ha soltado mal, volver a ponerla encima de la mesa
                            sourceSprite.setVisible(true);
                            this.tweens.add({
                                targets: sourceSprite,
                                x: 266 * 3,
                                y: 148 * 3,
                                duration: 300,
                                ease: 'Power2',
                                onComplete: () => this.showTablePotionIndicator(sourceSprite) // FLECHA ON
                            });
                        }
                    }
                }
            };

            this.input.on('pointermove', onPointerMove);
            this.input.once('pointerup', onPointerUp);
        });

        this.input.on('pointermove', (pointer, gameObjects) => {
            // Si no estamos tocando ningún objeto interactivo y tampoco estamos arrastrando nada...
            if (gameObjects.length === 0 && !this.isDraggingItem) {
                // Forzamos a que vuelva a la normalidad
                this.game.canvas.style.cursor = 'default';
            }
        });
    }

    // añadir borde a los items debajo del cursor
    updateBorders(ptr, itemType, dragItem = null, dropData = null) {
        const objectsUnderMouse = this.input.hitTestPointer(ptr);
        this.resetBorders();

        const isCauldronBlocked = (itemType === 'color' && this.cauldron.currentPotion.color !== null);

        if (objectsUnderMouse.includes(this.cauldronImg) && !isCauldronBlocked) {
            this.cauldronImg.setTexture('cauldronB');
            this.cauldronImg.setDepth(3);
        } else {
            this.cauldronImg.setTexture('cauldron');
            this.cauldronImg.setDepth(1);
        }

        if (itemType === 'taste') {
            this.cuttingBoard.setTexture(objectsUnderMouse.includes(this.cuttingBoard) && !this.isCuttingBoardOccupied ? 'cuttingBoardB' : 'cuttingBoard');
            this.mortar.setTexture(objectsUnderMouse.includes(this.mortar) && !this.isMortarOccupied ? 'mortarB' : 'mortar');

        } else if (itemType === 'processedTaste' || itemType === 'color' || itemType === 'smell') {
            if (itemType === 'processedTaste' || itemType === 'color') {
                this.trash.setTexture(objectsUnderMouse.includes(this.trash) ? 'trashB' : 'trash');
            }
            if (itemType === 'color') {
                const isPlateFull = (this.selectedColors.size >= this.maxColors) ||
                    (this.currentMixedColor && !['red', 'blue', 'yellow'].includes(this.currentMixedColor));

                this.mixPlate.setTexture(objectsUnderMouse.includes(this.mixPlate) && !isPlateFull ? 'plateB' : 'plate');
            }

        } else if (itemType === 'shape') {
            this.delivery.setTexture(objectsUnderMouse.includes(this.delivery) ? 'deliveryB' : 'delivery');
            this.trash.setTexture(objectsUnderMouse.includes(this.trash) ? 'trashB' : 'trash');

            // si está sobre el caldero y el sprite actual es una poción vacía y hay líquido
            if (objectsUnderMouse.includes(this.cauldronImg) && dragItem && dragItem.texture.key.includes('empty') && this.cauldron.hasLiquid) {
                let cauldronColor = this.cauldron.currentPotion.color;

                // DISPARAMOS HOOK "RELLENAR POCION"
                const fillHook = this.runHook('kitchen:potion:fill', { color: cauldronColor, shape: dropData });
                if (fillHook.cancelled) return;

                this.bottledPotion = JSON.parse(JSON.stringify(this.cauldron.currentPotion));

                this.cauldron.hasLiquid = false;

                let colorPrefix = cauldronColor ? cauldronColor.replace('Liquid', '') : 'noColor';
                const newTexture = colorPrefix + dropData + 'PotionB'; // ej: 'noColorHeartPotionB'
                dragItem.setTexture(newTexture);

                this.cauldronImg.setTexture('cauldron'); // quitar borde caldero
                this.cauldronImg.setDepth(1);

                this.cauldron.liquidSprite.setVisible(false);
                this.sound.play('fillBottleSound', { volume: 1 });

                // mostrar indicador de entrega
                this.hideIndicators();
                const arrowDelivery = this.add.sprite(this.delivery.x + 60, this.delivery.y - 15, 'indicator').setDepth(100).setScale(3);
                const arrowTrash = this.add.sprite(this.trash.x + 40, this.trash.y - 15, 'indicator').setDepth(100).setScale(3);
                this.indicatorArrows.push(arrowDelivery, arrowTrash);

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

    // quitar bordes
    resetBorders() {
        this.cuttingBoard.setTexture('cuttingBoard');
        this.mortar.setTexture('mortar');
        this.cauldronImg.setTexture('cauldron');
        this.mixPlate.setTexture('plate');
        this.trash.setTexture('trash');

        this.cauldronImg.setDepth(1);
    }

    // resetear caldero y probetas (usado al tirar poción a la basura)
    resetKitchen() {
        this.cauldron.resetCauldron();

        this.redTestTube.setVisible(true);
        this.greenTestTube.setVisible(true);
        this.grayTestTube.setVisible(true);
    }

    // mirar dónde ha soltado el jugador el item y qué pasa en cada caso
    handleItemDrop(ptr, itemType, dropData, sourceSprite, draggedTexture) {
        const objectsUnderMouse = this.input.hitTestPointer(ptr);
        let isDroppedSuccessfully = false;


        if (itemType === 'taste') {
            if (objectsUnderMouse.includes(this.cuttingBoard)) {
                if (this.isCuttingBoardOccupied) return false;

                // DISPARAMOS HOOK "DROP EN LA TABLA"
                const dropHook = this.runHook('kitchen:drop:cuttingBoard', { itemType, dropData });
                if (dropHook.cancelled) return false;

                // minijuego cortar
                this.isMinigameActive = true;
                this.scene.pause();
                this.scene.launch('cuttingMinigame', { ingredient: dropData });
                isDroppedSuccessfully = true;

            }
            else if (objectsUnderMouse.includes(this.mortar)) {
                if (this.isMortarOccupied) return false;

                // DISPARAMOS HOOK "DROP EN EL MORTERO"
                const dropHook = this.runHook('kitchen:drop:mortar', { itemType, dropData });
                if (dropHook && dropHook.cancelled) return;

                // minijuego machacar
                this.isMinigameActive = true;
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

            } else if (objectsUnderMouse.includes(this.trash)) { // BASURA
                isDroppedSuccessfully = true;
            }

        } else if (itemType === 'color') {
            // si dropData es un color base ('red', 'blue', 'yellow'), es un polvo sacado directo del cuenco
            // si lo soltamos en el plato
            if (sourceSprite !== this.mixPlate && ['red', 'blue', 'yellow'].includes(dropData) && objectsUnderMouse.includes(this.mixPlate)) {
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

            } else if (objectsUnderMouse.includes(this.trash)) {
                isDroppedSuccessfully = true; // BASURA
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
                // DISPARAMOS HOOK "ENTREGAR POCION"
                const deliverHook = this.runHook('kitchen:deliver', { shape: dropData });
                if (deliverHook.cancelled) return false;

                this.finishKitchen(dropData, draggedTexture);
                isDroppedSuccessfully = true;

            } else if (objectsUnderMouse.includes(this.trash)) {
                // DISPARAMOS HOOK "TIRAR POCION"
                const trashHook = this.runHook('kitchen:trash', { shape: dropData });
                if (trashHook.cancelled) return false;

                if (!this.cauldron.hasLiquid) {
                    this.resetKitchen();
                }
                isDroppedSuccessfully = true;
            }
        }
        return isDroppedSuccessfully;
    }

    // muestra indicadores sobre las estaciones de la cocina
    showIndicators(itemType, sourceSprite) {
        this.hideIndicators();
        // si es un SABOR: flechas en mortero, caldero y tabla
        if (itemType === 'taste') {
            // SOLO mostrar si no están ocupados
            if (!this.isMortarOccupied) {
                const arrow1 = this.add.sprite(this.mortar.x + 36, this.mortar.y - 15, 'indicator').setDepth(100).setScale(3);
                this.indicatorArrows.push(arrow1);
            }
            if (!this.isCuttingBoardOccupied) {
                const arrow3 = this.add.sprite(this.cuttingBoard.x + 99, this.cuttingBoard.y - 15, 'indicator').setDepth(100).setScale(3);
                this.indicatorArrows.push(arrow3);
            }
            // el caldero siempre
            const arrow2 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow2);

        } else if (itemType === 'processedTaste') {
            // si es un SABOR PROCESADO: flecha en caldero y BASURA
            const arrow1 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            const arrowTrash = this.add.sprite(this.trash.x + 40, this.trash.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1, arrowTrash);

        } else if (itemType === 'color') {
            // si es un COLOR: flechas en platito (si no viene de él), caldero y BASURA
            if (this.cauldron.currentPotion.color === null) {
                const arrowCauldron = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
                this.indicatorArrows.push(arrowCauldron);
            }
            if (sourceSprite !== this.mixPlate) {
                const isPlateFull = (this.selectedColors.size >= this.maxColors) ||
                    (this.currentMixedColor && !['red', 'blue', 'yellow'].includes(this.currentMixedColor));

                // si viene del CUENCO: indicamos el platito para mezclar (solo si NO está lleno)
                if (!isPlateFull) {
                    const arrowPlate = this.add.sprite(this.mixPlate.x + 30, this.mixPlate.y - 15, 'indicator').setDepth(100).setScale(3);
                    this.indicatorArrows.push(arrowPlate);
                }
            } else {
                // si viene del PLATO: indicamos la BASURA por si quiere limpiar la mezcla fallida
                const arrowTrash = this.add.sprite(this.trash.x + 40, this.trash.y - 15, 'indicator').setDepth(100).setScale(3);
                this.indicatorArrows.push(arrowTrash);
            }

        } else if (itemType === 'smell') {
            // si es un OLOR: flecha en caldero
            const arrow1 = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
            this.indicatorArrows.push(arrow1);

        } else if (itemType === 'shape') {
            // si la poción ya está llena
            if (sourceSprite === this.tablePotion || !this.cauldron.hasLiquid) {
                const arrowDelivery = this.add.sprite(this.delivery.x + 60, this.delivery.y - 15, 'indicator').setDepth(100).setScale(3);
                const arrowTrash = this.add.sprite(this.trash.x + 40, this.trash.y - 15, 'indicator').setDepth(100).setScale(3);
                this.indicatorArrows.push(arrowDelivery, arrowTrash);
            } else {
                // si la poción está vacía, indicamos el caldero
                const arrowCaldero = this.add.sprite(this.cauldronImg.x + 100, this.cauldronImg.y - 15, 'indicator').setDepth(100).setScale(3);
                this.indicatorArrows.push(arrowCaldero);
            }
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

    showTablePotionIndicator(target) {
        this.hideIndicators();
        const tableArrow = this.add.sprite(target.x, target.y - 45, 'indicator').setDepth(100).setScale(3);
        this.indicatorArrows.push(tableArrow);

        this.indicatorTween = this.tweens.add({
            targets: this.indicatorArrows,
            y: '-=10',
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
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
                if (!this.isDraggingItem && !this.isPotionPending) {
                    ingredientContainer.iterate(child => child.setTexture(borderKey));
                }
            });

            ingredientContainer.on('pointerout', () => {
                ingredientContainer.iterate(child => child.setTexture(normalKey));
            });

            this.isCuttingBoardOccupied = true;
            this.boardItem = ingredientContainer;

            // pasar la configuración a grab
            this.grab(ingredientContainer, normalKey, 'processedTaste', {
                name: baseName,
                consistency: 'chopped',
                cuts: cutsArray,
                source: 'board'
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
            const mashedIngredient = this.add.sprite(14 * 3, 111 * 3, spriteKeys.inMortar)
                .setOrigin(0, 0)
                .setScale(3)
                .setInteractive({
                    useHandCursor: true,
                    pixelPerfect: true
                });

            mashedIngredient.on('pointerover', () => {
                if (!this.isDraggingItem && !this.isPotionPending) {
                    mashedIngredient.setTexture(spriteKeys.inMortar + 'B');
                }
            });

            mashedIngredient.on('pointerout', () => {
                mashedIngredient.setTexture(spriteKeys.inMortar);
            });

            this.isMortarOccupied = true;
            this.mortarItem = mashedIngredient;

            this.grab(mashedIngredient, spriteKeys.smashed, 'processedTaste', {
                name: baseName,
                consistency: 'mashed',
                source: 'mortar'
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
