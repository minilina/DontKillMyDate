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

        if (tutorialId === 'full') {
            this.startFullFlow();
        } else if (tutorialId === 'knife') {
            this.startKnifeTutorial();
        }
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
        // Creamos una lista de todos los objetos que queremos bloquear.
        // Añade aquí cualquier otro objeto interactivo que tengas.
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
            if (item) {
                item.disableInteractive();
            }
        });
    }

    /** Reactiva la interactividad de todos los objetos. */
    enableAllInteractions() {
        const itemsToEnable = [
            this.k.mortar, this.k.cuttingBoard,
            this.k.crystalJar, this.k.algaeJar, this.k.mushroomJar,
            this.k.rootsJar, this.k.berriesJar,
            this.k.redBowl, this.k.blueBowl, this.k.yellowBowl,
            this.k.mixPlate,
            this.k.redTestTube, this.k.greenTestTube, this.k.grayTestTube,
            this.k.trash, this.k.delivery, this.k.note,
            this.k.cauldronImg, this.k.bookImg
        ];

        itemsToEnable.forEach(item => {
            if (item) {
                item.setInteractive(); // Reactivamos los clics.
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
        const y = 420;

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
        const overlay = this.k.add.rectangle(0, 0, width, height, 0x000000, 0.6)
            .setOrigin(0)
            .setInteractive();

        const panelW = 300;
        const panelH = 150;

        const border = this.k.add.rectangle(width / 2, height / 2, panelW + 8, panelH + 8, 0xf2e3d3, 1);
        const panel = this.k.add.rectangle(width / 2, height / 2, panelW, panelH, 0x2b1b16, 0.95);

        const title = this.k.add.text(width / 2, height / 2 - 35, "COMENZAR TUTORIAL", {
            fontFamily: "VT323, monospace",
            fontSize: "30px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 5
        }).setOrigin(0.5);

        const btnStyle = {
            fontFamily: "VT323, monospace",
            fontSize: "28px",
            backgroundColor: "#4f342d",
            color: "#ffffff",
            padding: { x: 20, y: 10 }
        };

        const startButton = this.k.add.text(width / 2, height / 2 + 30, "¡VAMOS!", btnStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        startButton.on('pointerover', () => startButton.setTint(0xdddddd));
        startButton.on('pointerout', () => startButton.clearTint());

        const popup = this.k.add.container(0, 0, [overlay, border, panel, title, startButton]).setDepth(20000);

        popup.setScale(0.9);
        popup.setAlpha(0);
        this.k.tweens.add({
            targets: popup,
            scale: 1,
            alpha: 1,
            duration: 140,
            ease: 'Sine.Out'
        });

        startButton.once('pointerdown', () => {
            popup.destroy(true);
            onConfirm();
        });
    }

    // --- LÓGICA DE LOS TUTORIALES ---

    startFullFlow() {
        this.createSkipButton();
        this.disableAllInteractions();

        let playerName = this.k.registry.get("playerName");
        if (!playerName || playerName.toLowerCase() === "sobrina") {
            playerName = "la sobrina de Agatha";
        }

        this.k.cauldronImg.setInteractive({ useHandCursor: true });
        this.burbujaPensar = this.k.add.sprite(
            this.k.cauldronImg.x + 60,
            this.k.cauldronImg.y - 80,
            "thinkingBubble"
        );

        this.burbujaPensar.setDepth(2000); // Para que se vea POR ENCIMA de todo
        this.burbujaPensar.setScale(3);    // Tu escala
        this.burbujaPensar.play("think")

        this.k.cauldronImg.once('pointerdown', () => {

            if (this.burbujaPensar) {
                this.burbujaPensar.destroy();
                this.burbujaPensar = null;
            }
            this.disableAllInteractions();

            this.say(`¡Hola! Tú debes de ser ${playerName}. Me llamo Castiel y tu tía me ha encomendado la tarea de enseñarte todo lo que necesitas saber para comenzar a preparar tu primera poción. ¿Comenzamos?`, 200, 100, () => {
                // POP UP TUTORIAL + PASO 1: HACER UBICAR LAS BAYAS
                this.showStartPopup(() => {
                    this.step1();
                });
            });
        });
    }

    // PASO 1: HACER UBICAR LAS BAYAS
    step1() {
        this.disableAllInteractions();
        this.say("Primero, vamos a familiarizarnos con los ingredientes. Las *bayas* están en la estantería de la izquierda. Intenta cogerlas.", 100, 100, () => {
            this.showHelp("Haz clic en el frasco de bayas");

            // Desactivamos la interacción con TODO excepto las bayas
            this.highlight(this.k.berriesJar);
            this.k.berriesJar.setInteractive();

            this.hook('kitchen:grab:start', (payload) => {
                if (payload.sourceSprite == this.k.berriesJar) {
                    // Una vez coja las bayas, indicaremos que debe colocarlas en la tabla de cortar
                    this.clearHelp();
                    this.stop();
                    this.step2();
                }
            });
        });

    }

    // PASO 2: MINIJUEGO TABLA CORTAR
    step2() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say("¡Perfecto! Ahora arrastra las bayas hasta la *tabla de cortar*.", 100, 200, () => {
            this.showHelp("Arrastra las bayas hasta la tabla de cortar");
            this.k.cuttingBoard.setInteractive();
            this.k.berriesJar.setInteractive();
            this.highlight(this.k.cuttingBoard);

            this.hook('kitchen:drop:cuttingBoard', (payload) => {
                // Nos aseguramos de que está soltando las bayas (por si acaso)
                if (payload.dropData === 'cutBerry') {
                    // ¡Correcto! Lanzamos el minijuego.
                    this.k.scene.launch('cuttingMinigame', { isTutorial: true, ingredient: payload.dropData });

                    // Esperamos la señal de que el minijuego ha terminado.
                    this.k.events.once('minigame:tutorial:finished', () => {

                        this.clearHelp();
                        this.stop();

                        // Al terminar, continuamos con el siguiente paso del tutorial.
                        this.say("¡Genial! Ya sabes cómo usar la tabla. Vamos al siguiente paso. Ahora vamos a utilizar el mortero.", 100, 200, () => {
                            this.step3();
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

        this.say("Para practicar con el mortero necesito que me traigas unas *raíces*. Cógelas de su frasco y arrástralas al mortero.", 100, 150, () => {
            this.showHelp("Arrastra las raíces al mortero");
            this.k.rootsJar.setInteractive();
            this.k.mortar.setInteractive();

            this.highlight(this.k.rootsJar);
            this.highlight(this.k.mortar);

            this.hook('kitchen:drop:mortar', (payload) => {

                if (payload.dropData === 'cutRoot') {
                    console.log("B ---> Condición cumplida. Lanzando minijuego.");
                    this.k.scene.launch('mortarMinigame', { isTutorial: true, ingredient: payload.dropData });

                    console.log("C ---> Adjuntando el 'listener' para esperar a que termine.");
                    this.k.events.once('minigame:tutorial:finished', () => {
                        console.log("D ---> ¡¡¡BINGO!!! Evento recibido en el tutorial");
                        this.clearHelp();
                        this.stop();
                        this.say("¡Estupendo! Ahora ya sabes cómo usar las dos herramientas...", 100, 150, () => this.step4());
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
        this.say("El libro de recetas es tu mejor amigo. En él podrás consultar qué ingredientes hay, las afinidades entre las distintas razas y para qué sirve cada herramienta. También podrás regresar a los tutoriales siempre que necesites practicar o que te refresquen la memoria.", 250, 100, () => {
            this.showHelp("Abre el libro de recetas");

            this.k.bookImg.setInteractive();
            this.highlight(this.k.bookImg);
            this.k.bookImg.once('pointerdown', () => {
                this.clearHelp();
                this.stop();
                this.k.events.emit('book');
                this.k.events.once('book:closed', () => {
                    this.say("¡Perfecto! Ahora que ya sabes dónde mirar las compatibilidades entre razas podemos pasar a las tres probetas que se encuentran a mi derecha. Dependiendo de la afinidad que obtengamos, deberás elegir una u otra y arrastrarlas al caldero.", 250, 50, () => {

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

        this.say("Cada probeta representa un tipo de afinidad. Cuando tengas dudas entre las afinidades de dos razas, consúltalo en el libro. Vamos a practicar esto, por ejemplo, comprueba la afinidad entre gnomos y hadas, selecciona la probeta adecuada y arrástrala hacia el caldero", 100, 50, () => {
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

                    // 👇 AHORA SÍ: CREAMOS EL HOOK AQUÍ ADENTRO, A SALVO DEL 'STOP'
                    this.hook('kitchen:drop:cauldron', ({ itemType, dropData }) => {
                        console.log("Hook de drop en caldero disparado. itemType:", itemType, "dropData:", dropData);

                        if (dropData !== expected) {
                            // Si se equivoca de probeta, devolvemos cancel: false 
                            // para que la cocina normal no haga nada (o le lance el error normal)
                            return { cancel: false };
                        }

                        // Correcto: avanzamos
                        this.say("¡Perfecto! Has elegido la probeta correcta.", 100, 50, () => {
                            this.clearHelp();
                            this.stop(); // Limpiamos la pantalla para el siguiente paso
                            this.step6();
                        });

                        // IMPORTANTE: Frenamos a la cocina base para evitar doble lanzamiento
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

        this.say("¡Ánimo que ya queda poco! Vamos con el siguiente paso: los colores. ¿Ves los 3 pequeños polvos de colores a mi izquierda? Estos sirven para aportar color a la poción. Puedes poner un solo color (rojo, azul o amarillo) o bien mezclarlos en el plato de abajo para crear un nuevo color (morado, verde o naranja). Vamos a probar esto, utiliza el rojo y el amarillo para crear naranja y échalo al caldero", 50, 100, () => {

            this.showHelp("Echa polvos naranjas en el caldero");


            this.k.redBowl.setInteractive();
            this.k.yellowBowl.setInteractive();
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
                    this.say("¡Perfecto! Has creado naranja y lo has añadido al caldero.", 50, 100, () => {
                        // siguiente paso:
                        this.step7();
                    });
                } else {
                    locked = true;
                    this.say("Ese no es el color correcto. Recuerda: rojo + amarillo = *naranja*. Vuelve a intentarlo.", 50, 100, () => {
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

        this.say("Los clientes también pueden pedirte que la temperatura sea una específica. Para ajustar la temperatura haz clic sobre las piedras que encuentras al lado del caldero. Pero, ¡cuidado! La temperatura solo sube, no puede bajar así que estate atento de no pasarte.", 50, 200, () => {
            this.showHelp("Haz clic en las piedras para subir la temperatura");

            this.k.stones.setInteractive();
            //this.highlight(this.k.stone);

            this.k.stones.once('pointerdown', () => {
                this.stop();
                this.say("¡Perfecto! Ya sabes cómo ajustar la temperatura. ", 50, 200, () => {
                    this.step8();
                });
            });
        });
    }

    step8() {
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say("Si alguna vez no recuerdas la petición del cliente solo tienes que hacer clic en la comanda que encuentras colgada frente a ti. Aquí tendrás las notas resaltando lo importante que te ha pedido el cliente", 100, 200, () => {
            this.showHelp("Haz clic en la comanda para revisar la petición del cliente");

            this.k.note.setInteractive();
            this.highlight(this.k.note);

            this.k.note.once('pointerdown', () => {
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
            "Y llegamos al último paso: Rellenar la poción y entregarla al cliente. Para vaciar el contenido del caldero y poder entregarlo, arrastra una de las pociones vacías de formas que puedes encontrar en la balda superior. Tan solo tendrás que arrastrar la elegida sobre el caldero (¡sin soltarla!). Esta automáticamente se rellenará y deberás colocarla en la estación de entrega de la parte inferior derecha. Nota: Esto solo funcionará si el caldero contiene ingredientes. Rellena la poción y déjala en la estación de entrega.", 150, 150,
            () => {
                this.showHelp("Rellena una poción vacía y colócala en la estación de entrega");
                // Habilitar lo necesario
                this.k.cauldronImg.setInteractive();
                this.k.delivery.setInteractive();

                // formas (pociones vacías)
                this.k.emptyNormalPotion.setInteractive();
                this.k.emptyHeartPotion.setInteractive();
                this.k.emptyStarPotion.setInteractive();



                // Esperar a que entregue UNA poción
                this.hook('kitchen:deliver', ({ shape }) => {
                    this.say("¡Perfecto! Has completado el tutorial. Ya puedes preparar y entregar pociones por tu cuenta.", 50, 200, () => {
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
