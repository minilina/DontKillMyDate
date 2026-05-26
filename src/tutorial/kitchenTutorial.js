import { splitIntoLines } from "../dialogue/dialogueScripts.js";

export default class KitchenTutorial {
    constructor(kitchenScene, dialogueManager) {
        this.k = kitchenScene;
        this.dm = dialogueManager;

        this.activeUnsubscriptions = [];
        this.activeTweens = [];

        this.activeHelp = null;
    }

    // --- MÉTODOS DE CONTROL ---

    start(tutorialId) {
        this.stop();
        this.k.tutorialMode = true;

        if (this.k.cauldron) {
            this.k.cauldron.isTutorial = true;
        }

        if (tutorialId === 'full') {
            this.startFullFlow();
        }/* else if (tutorialId === 'knife') {
            this.startKnifeTutorial();
        }*/
    }

    stop() {
        this.activeUnsubscriptions.forEach(unsub => unsub());
        this.activeUnsubscriptions = [];

        this.activeTweens.forEach(tween => {
            if (tween.targets && tween.targets[0]) {
                const obj = tween.targets[0];
                obj.setAlpha(1);

                // Si el objeto tiene la función de limpiar tinte, la usamos
                if (typeof obj.clearTint === 'function') {
                    obj.clearTint();
                    obj.setScale(3); // Importante: tu escala base
                }
            }
            tween.destroy();
        });
        this.activeTweens = [];
    }

    finish() {
        this.stop();
        this.enableAllInteractions();
        this.k.tutorialMode = false;

        if (this.k.cauldron) {
            this.k.cauldron.isTutorial = false;
        }

        // ¡Sello puesto! El juego recordará que ya pasamos el tutorial
        this.k.registry.set('tutorialDone', true);

        // Destruimos el sprite del botón "SALTAR TUTORIAL" y su texto
        if (this.skipBtnBg) {
            this.skipBtnBg.destroy();
            this.skipBtnBg = null;
        }
        if (this.skipBtnText) {
            this.skipBtnText.destroy();
            this.skipBtnText = null;
        }
    }

    // --- MÉTODOS DE AYUDA ---
    // BLOQUEO DE OBJETOS
    disableAllInteractions() {
        const itemsToDisable = [
            this.k.mortar, this.k.cuttingBoard,
            this.k.crystalJar, this.k.algaeJar, this.k.mushroomJar, this.k.berriesJar, this.k.rootsJar,
            this.k.redBowl, this.k.blueBowl, this.k.yellowBowl,
            this.k.mixPlate,
            this.k.redTestTube, this.k.greenTestTube, this.k.grayTestTube,
            this.k.trash, this.k.delivery, this.k.note,
            this.k.cauldronImg, this.k.bookImg,
            this.k.emptyStarPotion, this.k.emptyHeartPotion, this.k.emptyNormalPotion,
            this.k.stones,
        ];

        itemsToDisable.forEach(item => {
            // CAMBIO: Verificamos existencia antes de deshabilitar
            if (item && item.active && item.scene) {
                item.disableInteractive();
            }
        });
    }
    /** Reactiva la interactividad de todos los objetos de forma segura. */
    enableAllInteractions() {
        const itemsToEnable = [
            this.k.mortar, this.k.cuttingBoard,
            this.k.crystalJar, this.k.algaeJar, this.k.mushroomJar,
            this.k.rootsJar, this.k.berriesJar,
            this.k.redBowl, this.k.blueBowl, this.k.yellowBowl,
            this.k.mixPlate,
            this.k.redTestTube, this.k.greenTestTube, this.k.grayTestTube,
            this.k.trash, this.k.delivery, this.k.note,
            this.k.cauldronImg, this.k.bookImg,
            this.k.emptyStarPotion, this.k.emptyHeartPotion, this.k.emptyNormalPotion,
            this.k.stones,
        ];

        itemsToEnable.forEach(item => {
            // CAMBIO: Verificamos que el item exista, esté activo y tenga una escena vinculada
            if (item && item.active && item.scene) {
                item.setInteractive();
            }
        });
    }

    hook(name, fn) {
        const unsub = this.k.addHook(name, fn);
        this.activeUnsubscriptions.push(unsub);
    }

    highlight(obj) {
        if (!obj) return;

        this.activeTweens = this.activeTweens.filter(t => {
            if (t.targets && t.targets[0] === obj) {
                obj.clearTint();
                obj.setScale(3);
                t.destroy();
                return false;
            }
            return true;
        });

        const tween = this.k.tweens.add({
            targets: obj,
            scaleX: 3.15,
            scaleY: 3.15,
            duration: 800,
            yoyo: true,
            repeat: -1,
            onStart: () => {
                obj.setTint(0xF7EB9C);
            }
        });

        this.activeTweens.push(tween);
    }

    say(text, x, y, onDoneCallback) {

        const dialoguePayload = { lines: splitIntoLines(text) };

        const onDialogueFinished = () => {
            this.k.events.off("dialogue:finished", onDialogueFinished);
            if (onDoneCallback) {
                onDoneCallback();
            }
        };

        this.k.events.on("dialogue:finished", onDialogueFinished);

        if (this.dm.ui.moveTo) {
            this.dm.ui.moveTo(x, y);
        }

        this.dm.start(dialoguePayload);
    }

    // AYUDA TUTORIAL
    showHelp(text) {
        if (this.activeHelp) this.activeHelp.destroy();

        // 1. Posición
        const x = 512;
        const y = 490;

        const container = this.k.add.container(x, y);

        container.setDepth(10000);

        const txt = this.k.add.text(0, 0, text, {
            fontFamily: 'VT323, monospace',
            fontSize: '24px',
            fill: '#ffffff',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        const bg = this.k.add.graphics();
        const width = txt.width + 20;
        const height = txt.height + 10;

        bg.fillStyle(0x000000, 0.8);
        bg.fillRoundedRect(-width / 2, -height / 2, width, height, 8);
        bg.lineStyle(2, 0xffffff, 0.3);
        bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 8);

        container.add([bg, txt]);

        // Animación
        this.k.tweens.add({
            targets: container,
            y: y - 8,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.activeHelp = container;
    }

    // Método para limpiar la ayuda
    clearHelp() {
        if (this.activeHelp) {
            this.activeHelp.destroy();
            this.activeHelp = null;
        }
    }

    showStartPopup(onConfirm) {
        const { width, height } = this.k.scale;

        // 1. Limpieza de seguridad por si acaso
        if (this.popupElements) {
            this.popupElements.forEach(el => el.destroy());
        }
        this.popupElements = [];

        // 2. EL OVERLAY (El truco es que sea interactivo pero NO apague el input global)
        const overlay = this.k.add.rectangle(0, 0, width, height, 0x000000, 0.7)
            .setOrigin(0)
            .setInteractive() // Captura clics
            .setDepth(30000);

        // Evita que el clic pase a lo que hay detrás (la cocina)
        overlay.on('pointerdown', (pointer, localX, localY, event) => {
            if (event) event.stopPropagation();
        });

        const border = this.k.add.rectangle(width / 2, height / 2, 310, 160, 0xf2e3d3).setDepth(30001);
        const panel = this.k.add.rectangle(width / 2, height / 2, 300, 150, 0x2b1b16).setDepth(30002);

        const title = this.k.add.text(width / 2, height / 2 - 35, "COMENZAR TUTORIAL", {
            fontFamily: "VT323, monospace", fontSize: "30px", color: "#ffffff"
        }).setOrigin(0.5).setDepth(30003);

        const startButton = this.k.add.text(width / 2, height / 2 + 35, " ¡VAMOS! ", {
            fontFamily: "VT323, monospace", fontSize: "32px", backgroundColor: "#4f342d", color: "#ffffff", padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(30004);

        this.popupElements = [overlay, border, panel, title, startButton];

        // 3. Lógica con pointerup (más seguro para evitar que el clic se "arrastre" al fondo)
        startButton.once('pointerup', (pointer, localX, localY, event) => {
            if (event) event.stopPropagation();

            // Destrucción total inmediata
            this.popupElements.forEach(el => {
                if (el) el.destroy();
            });
            this.popupElements = null;

            // Pequeño delay para asegurar que el input se limpie antes de empezar el Step 1
            this.k.time.delayedCall(150, () => {
                onConfirm();
            });
        });

        // Feedback visual para estar seguros de que el botón recibe el ratón
        startButton.on('pointerover', () => startButton.setTint(0xffff00));
        startButton.on('pointerout', () => startButton.clearTint());
    }
    // --- LÓGICA DE LOS TUTORIALES ---

    startFullFlow() {
        this.createSkipButton();
        this.disableAllInteractions();


        if (this.k.cauldron) {
            this.k.cauldron.toggleFire(false);

            // Ahora inicia el diálogo de bienvenida

            const saludo = `¡Hola! Tú debes de ser la sobrina de Agatha. Me llamo Castiel y tu tía me ha encomendado la tarea de enseñarte todo lo que necesitas saber para preparar tu primera poción. ¿Comenzamos?`

            this.k.cauldron.forceSpeech(saludo, 5000);


            this.k.events.once('cauldron:speech:finished', () => {
                this.showStartPopup(() => {
                    this.step1();
                });
            });
        };

    }

    // PASO 1: HACER UBICAR LAS BAYAS
    step1() {
        this.disableAllInteractions();
        this.say("Primero, vamos a familiarizarnos con los ingredientes. Las *bayas* están en la estantería de la izquierda. Intenta cogerlas.", -100, -50, () => {
            this.showHelp("Haz clic en el frasco de bayas");

            // Desactivamos la interacción con TODO excepto las bayas
            this.highlight(this.k.berriesJar);
            this.k.berriesJar.setInteractive();

            this.hook('kitchen:grab:start', (payload) => {
                if (payload.sourceSprite == this.k.berriesJar) {
                    // Una vez coja las bayas, indicaremos que debe colocarlas en la tabla de cortar
                    this.clearHelp();
                    this.stop();
                    this.say("¡Perfecto!", -100, -50, () => {
                        this.step2();
                    });
                }
            });
        });

    }

    // PASO 2: MINIJUEGO TABLA CORTAR
    step2() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say("¡Ahora arrastra las bayas hasta la *tabla de cortar*.", -176, 235, () => {
            this.showHelp("Arrastra las bayas hasta la tabla de cortar");
            this.k.cuttingBoard.setInteractive();
            this.k.berriesJar.setInteractive();
            this.highlight(this.k.cuttingBoard);

            this.hook('kitchen:drop:cuttingBoard', (payload) => {
                // Nos aseguramos de que está soltando las bayas (por si acaso)
                if (payload.dropData === 'cutBerry') {
                    this.k.scene.launch('cuttingMinigame', { isTutorial: true, ingredient: payload.dropData });

                    // Esperamos la señal de que el minijuego ha terminado.
                    this.k.events.once('minigame:tutorial:finished', () => {

                        this.clearHelp();
                        this.stop();

                        this.say("¡Bien cortadas! Ahora arrastra las *bayas troceadas* al caldero.", -176, 235, () => {
                            this.showHelp("Echa las bayas troceadas al caldero");
                            this.highlight(this.k.cauldronImg);
                            this.k.cauldronImg.setInteractive();
                            // Nota: El objeto cortado suele estar en la tabla, nos aseguramos de que sea interactivo
                            this.k.cuttingBoard.setInteractive();

                            this.hook('kitchen:drop:cauldron', (dropPayload) => {

                                this.stop();
                                this.clearHelp();
                                this.say("¡Genial! Al caldero van. Vamos ahora con el mortero.", -176, 235, () => {
                                    this.step3();
                                });
                                return { cancel: true };

                            });
                        });
                    });

                    return { cancel: true };
                }
            });
        });
    }

    // PASO 3: MINIJUEGO MORTERO
    step3() {
        this.stop();
        this.disableAllInteractions();
        this.k.tutorialMode = true;

        this.say("Para practicar con el mortero necesito que me traigas unas *raíces*. Cógelas de su frasco y arrástralas al mortero.", -279, 176, () => {
            this.showHelp("Arrastra las raíces al mortero");
            this.k.rootsJar.setInteractive();
            this.k.mortar.setInteractive();

            this.highlight(this.k.rootsJar);
            this.highlight(this.k.mortar);

            this.hook('kitchen:drop:mortar', (payload) => {

                if (payload.dropData === 'cutRoot') {
                    this.k.scene.launch('mortarMinigame', { isTutorial: true, ingredient: payload.dropData });

                    this.k.events.once('minigame:tutorial:finished', () => {
                        this.clearHelp();
                        this.stop();
                        this.say("¡Buen trabajo! Ahora echa el *polvo de raíces* al caldero.", -279, 176, () => {
                            this.showHelp("Arrastra el contenido del mortero al caldero");
                            this.highlight(this.k.cauldronImg);
                            this.k.cauldronImg.setInteractive();
                            this.k.mortar.setInteractive();

                            this.hook('kitchen:drop:cauldron', (dropPayload) => {

                                this.stop();
                                this.clearHelp();
                                this.say("¡Estupendo! Ya dominas las herramientas básicas.", -279, 176, () => {
                                    this.step4();
                                });
                                return { cancel: true };

                            });
                        });
                    });

                    return { cancel: true };
                }
            });
        });
    }

    // PASO 4: USAR EL LIBRO DE RECETAS 
    step4() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;
        this.say("El libro de recetas es tu mejor amigo. En él podrás consultar qué ingredientes hay, afinidades entre  razas y muchas cosas más.", 176, 118, () => {
            this.showHelp("Abre el libro de recetas");

            this.k.bookImg.setInteractive();
            this.highlight(this.k.bookImg);
            this.k.bookImg.once('pointerdown', () => {
                this.clearHelp();
                this.stop();
                this.k.events.emit('book');
                this.k.events.once('book:closed', () => {
                    this.say("¡Perfecto! Ahora podemos pasar a las tres probetas que se encuentran a mi derecha. Dependiendo de la afinidad que obtengamos, deberás elegir una u otra y arrastrarlas al caldero.", 176, 35, () => {

                        this.stop();
                        this.step5();
                    });
                });
            });
        });
    }

    // PASO 5: USAR LAS PROBETAS
    step5() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say("Cada probeta representa un tipo de afinidad. Puedes consultar en el libro estas afinidades. Vamos a practicar: comprueba la afinidad entre gnomos y hadas, selecciona la probeta adecuada y arrástrala en el caldero", 176, 35, () => {
            this.showHelp("Comprueba la afinidad entre gnomos y hadas y arrastra la probeta hacia el caldero");

            this.k.bookImg.setInteractive();
            this.k.cauldronImg.setInteractive();

            const expected = 'redTestTube';

            this.highlight(this.k.bookImg);

            this.k.bookImg.once('pointerdown', () => {
                // ESTO BORRA EL BRILLO DEL LIBRO (Y CUALQUIER HOOK ANTERIOR)
                this.stop();

                this.k.events.emit('book');
                this.k.events.once('book:closed', () => {

                    this.k.redTestTube.setInteractive();
                    this.k.greenTestTube.setInteractive();
                    this.k.grayTestTube.setInteractive();

                    this.highlight(this.k.redTestTube);
                    this.highlight(this.k.greenTestTube);
                    this.highlight(this.k.grayTestTube);
                    this.highlight(this.k.cauldronImg);

                    this.hook('kitchen:drop:cauldron', ({ itemType, dropData }) => {
                        if (dropData !== expected) {
                            // Si se equivoca de probeta, devolvemos cancel: false 
                            // para que la cocina normal no haga nada (o le lance el error normal)
                            return { cancel: false };
                        }

                        // Correcto: avanzamos
                        this.say("¡Perfecto! Has elegido la probeta correcta.", 176, 35, () => {
                            this.clearHelp();
                            this.stop(); // Limpiamos la pantalla para el siguiente paso
                            this.step6();
                        });

                        return { cancel: true };
                    });
                });
            });
        });
    }

    // PASO 6: POLVOS DE COLOR
    step6() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say("Vamos con el siguiente paso: los colores. ¿Ves los 3 pequeños polvos de colores a mi izquierda? Estos sirven para aportar color a la poción. Puedes poner un solo color o bien mezclarlos en el plato de abajo para crear uno nuevo. Vamos a probar esto, utiliza el rojo y el amarillo para crear naranja y échalo al caldero", -275, 74, () => {

            this.showHelp("Echa polvos naranjas en el caldero");


            this.k.redBowl.setInteractive();
            this.k.yellowBowl.setInteractive();
            this.k.blueBowl.setInteractive();

            this.k.mixPlate.setInteractive();
            this.k.cauldronImg.setInteractive();

            this.highlight(this.k.redBowl);
            this.highlight(this.k.yellowBowl);
            this.highlight(this.k.mixPlate);
            this.highlight(this.k.cauldronImg);

            let locked = false;

            this.hook('kitchen:drop:cauldron', ({ itemType, dropData }) => {
                if (locked) return;
                if (dropData === 'orange') {
                    locked = true;
                    this.stop();
                    this.clearHelp();
                    this.say("¡Perfecto! Has creado naranja y lo has añadido al caldero.", -275, 74, () => {
                        // siguiente paso:
                        this.step7();
                    });
                } else {
                    locked = true;
                    this.say("Ese no es el color correcto. Recuerda: rojo + amarillo = *naranja*. Vuelve a intentarlo.", -275, 74, () => {
                        this.k.cauldron.resetInside();
                        locked = false;
                    });
                    return { cancel: true };
                }
            });
        });
    }

    step7() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say("Los clientes también pueden pedirte una temperatura específica. Para ajustar la temperatura haz clic sobre las piedras alrededor del caldero. Pero, ¡cuidado! La temperatura sube con el fuego encendido y baja cuando lo apagas. ¡Uy espera! Para que puedas probar esto voy a apagarme primero", -368, 221, () => {
            this.showHelp("Haz clic en las piedras para encender el fuego");
            this.k.cauldron.resetCauldron();

            this.k.stones.setInteractive();


            this.k.stones.once('pointerdown', () => {
                this.clearHelp();
                this.disableAllInteractions();
                this.stop();
                this.say("¡Perfecto! Ya sabes cómo ajustar la temperatura. ", -368, 221, () => {
                    this.k.cauldron.resetCauldron();
                    this.k.cauldron.toggleFire(false);

                    this.step8();
                });
            });
        });
    }

    step8() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say("Si alguna vez no recuerdas la petición del cliente solo tienes que hacer clic en la comanda que encuentras colgada frente a ti. Aquí tendrás las notas más relevantes", 100, 44, () => {
            this.showHelp("Haz clic en la comanda para revisar la petición del cliente");

            this.k.note.setInteractive();
            this.highlight(this.k.note);

            this.k.note.once('pointerdown', () => {
                this.clearHelp();
                this.stop();
                this.k.events.emit('note');
                this.k.events.once('note:closed', () => {
                    this.step9();
                });
            });
        });
    }


    step9() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say(
            "Para recoger el contenido del caldero, debes utilizar los recipientes vacíos de la balda superior. Arrastrarlo sobre el caldero (¡sin soltarlo!). Una vez en el matraz podrás realizar dos acciones con él. Deshecharlo en la papelera o entregalo al cliente desde la estación de entrega que está justo debajo. Si sin querer se te escapa la poción, regresará automáticamente a la mesa y podrás volver a cogerla. Vamos a probar esto.", 191, -59,
            () => {
                this.showHelp("Rellena una poción vacía y colócala en la papelera");
                // Habilitar lo necesario
                this.k.cauldronImg.setInteractive();
                this.k.trash.setInteractive();

                // formas (pociones vacías)
                this.k.emptyNormalPotion.setInteractive();
                this.k.emptyHeartPotion.setInteractive();
                this.k.emptyStarPotion.setInteractive();

                // Esperar a que se desheche UNA poción
                this.hook('kitchen:trash', ({ shape }) => {
                    this.say("¡Perfecto!", 191, -59, () => {
                        this.clearHelp();
                        this.stop();
                        this.step10();
                    });
                });
            }
        );
    }

    step10() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;
        this.k.cauldron.toggleFire(false);

        this.say(
            "Y llegamos al último paso: entregar al cliente. Rellena otra poción y déjala esta vez en la estación de entrega", 191, -59,
            () => {
                this.showHelp("Rellena una poción vacía y colócala en la estación de entrega");
                this.k.cauldronImg.setInteractive();
                this.k.delivery.setInteractive();

                this.k.emptyNormalPotion.setInteractive();
                this.k.emptyHeartPotion.setInteractive();
                this.k.emptyStarPotion.setInteractive();

                // Esperar a que entregue UNA poción
                this.hook('kitchen:deliver', (payload) => {

                    if (payload.sourceSprite) payload.sourceSprite.destroy(); // <--- ¡ADIÓS POCIÓN!

                    this.say("¡Perfecto! Has completado el tutorial. Ya puedes preparar y entregar pociones por tu cuenta.", 191, -59, () => {

                        this.finish();

                        // LIMPAMOS EL CALDERO PARA LA PARTIDA REAL
                        this.k.cauldron.resetCauldron();

                        this.k.scene.sleep('kitchen');
                        this.k.scene.start('store');
                    });
                    return { cancel: true };

                });
            }
        );
    }

    createSkipButton() {
        const btnX = this.k.scale.width - 120;
        const btnY = this.k.scale.height - 40;

        // Sprite botón
        this.skipBtnBg = this.k.add.image(btnX, btnY, 'button')
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5)
            .setScale(3)
            .setDepth(1000);

        // Texto "SALTAR TUTORIAL"
        this.skipBtnText = this.k.add.text(btnX, btnY - 3, 'SALTAR TUTORIAL', {
            fontFamily: 'VT323, monospace',
            fontSize: '25px',
            fill: '#ffffff'
        })
            .setOrigin(0.5)
            .setDepth(1001);

        // Animación hover
        this.skipBtnBg.on('pointerover', () => {
            this.skipBtnBg.setScale(2.9);
            this.skipBtnText.setColor('#ffcc00'); // color en hover
        });

        this.skipBtnBg.on('pointerout', () => {
            this.skipBtnBg.setScale(3);
            this.skipBtnText.setColor('#ffffff'); // color normal
        });

        // Acción al hacer clic
        this.skipBtnBg.on('pointerdown', () => {
            this.skipTutorial();
        });
    }

    skipTutorial() {
        // 1. Apagamos los eventos para que el tutorial no intente avanzar en segundo plano
        this.k.events.off("dialogue:finished");

        // 2. Cerramos la caja de texto usando DialogueManager
        this.dm.finish();

        // 3. Limpiamos el tutorial y reactivamos la cocina
        this.finish();

        // 4. Limpiamos el caldero por si el jugador ya había echado algo
        this.k.cauldron.resetCauldron();

        // 5. Volvemos a la tienda día 1
        this.k.scene.sleep('kitchen');
        this.k.scene.start('store');
    }
}
