// ruta: src/tutorial/kitchenTutorial.js

// Asegúrate de que esta ruta de importación es correcta para tu proyecto
import { splitIntoLines } from "../dialogue/dialogueScripts.js";

export default class KitchenTutorial {
    constructor(kitchenScene, dialogueManager) {
        this.k = kitchenScene;
        this.dm = dialogueManager;

        this.activeUnsubscriptions = [];
        this.activeTweens = [];
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
                tween.targets[0].setAlpha(1);
            }
            tween.destroy();
        });
        this.activeTweens = [];
    }

    finish() {
        this.stop();
        this.enableAllInteractions();
        this.k.tutorialMode = false;

    }

    // --- MÉTODOS DE AYUDA ---
    // BLOQUEO DE OBJETOS
    disableAllInteractions() {
                // Creamos una lista de todos los objetos que queremos bloquear.
                // Añade aquí cualquier otro objeto interactivo que tengas.
                const itemsToDisable = [
                        this.k.mortar, this.k.cuttingBoard,
                        this.k.crystalJar, this.k.algaeJar, this.k.mushroomJar,this.k.berriesJar,this.k.rootsJar, 
                        this.k.redBowl, this.k.blueBowl, this.k.yellowBowl,
                        this.k.mixPlate,
                        this.k.redTestTube, this.k.greenTestTube, this.k.grayTestTube,
                        this.k.trash, this.k.delivery, this.k.note,
                        this.k.cauldronImg, this.k.bookImg,
                        this.k.emptyStarPotion, this.k.emptyHeartPotion, this.k.emptyNormalPotion,
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
        // Detenemos otros resaltados
        this.activeTweens.forEach(t => t.destroy());
        this.activeTweens = [];

        const tween = this.k.tweens.add({
            targets: obj,
            alpha: 0.6,
            duration: 400,
            yoyo: true,
            repeat: -1,
        });
        this.activeTweens.push(tween);
    }

    say(text, onDoneCallback) {
        
        const dialoguePayload = { lines: splitIntoLines(text) };

        const onDialogueFinished = () => {
            this.k.events.off("dialogue:finished", onDialogueFinished);
            if (onDoneCallback) {
                onDoneCallback();
            }
        };
        
        this.k.events.on("dialogue:finished", onDialogueFinished);
        this.dm.start(dialoguePayload);
    }

    // --- LÓGICA DE LOS TUTORIALES ---

    startFullFlow() {
        this.disableAllInteractions();
        this.say("¡Bienvenida a la cocina! Me llamo Castiel y hoy seré el encargado de enseñarte todo lo que necesitas saber para comenzar a preparar tu primera poción.", () => {
                // PASO 1: HACER UBICAR LAS BAYAS
                this.step6(); 
                });
    }

    // PASO 1: HACER UBICAR LAS BAYAS
    step1(){
        this.disableAllInteractions();
        this.say("Primero, vamos a familiarizarnos con los ingredientes. Las *bayas* están en la estantería de la izquierda. Intenta cogerlas.", () => {

                // Desactivamos la interacción con TODO excepto las bayas
                this.k.berriesJar.setInteractive();

                this.hook('kitchen:grab:start', (payload) => {
                        if(payload.sourceSprite == this.k.berriesJar){
                                // Una vez coja las bayas, indicaremos que debe colocarlas en la tabla de cortar
                                this.step2();
                        }
                });
        });
        
    }

    // PASO 2: MINIJUEGO TABLA CORTAR
    step2() {
        this.disableAllInteractions();
        this.stop(); 
                this.k.tutorialMode = true; // stop() lo pone a false, lo reactivamos.

                this.say("¡Perfecto! Ahora arrastra las bayas hasta la *tabla de cortar*.", () => {
                        this.k.cuttingBoard.setInteractive();
                        this.k.berriesJar.setInteractive();
                        
                        this.hook('kitchen:drop:cuttingBoard', (payload) => {
                                // Nos aseguramos de que está soltando las bayas (por si acaso)
                                if (payload.dropData === 'cutBerry') {
                                        // ¡Correcto! Lanzamos el minijuego.
                                        this.k.scene.launch('cuttingMinigame', { isTutorial: true, ingredient: payload.dropData });

                                        // Esperamos la señal de que el minijuego ha terminado.
                                        this.k.events.once('minigame:tutorial:finished', () => {

                                                this.stop();
                                                
                                                // Al terminar, continuamos con el siguiente paso del tutorial.
                                                this.say("¡Genial! Ya sabes cómo usar la tabla. Vamos al siguiente paso. Ahora vamos a utilizar el mortero.", () => {
                                                        this.step3();
                                                });
                                        });
                                     
                                        return { cancel: true }; 
                                }
                        });
                });
    }

    // PASO 3: MINIJUEGO MORTERO
    step3(){
        this.stop();
        this.disableAllInteractions();
        this.k.tutorialMode = true;

        this.say("Para practicar con el mortero necesito que me traigas unas *raíces*. Cógelas de su frasco y arrástralas al mortero.", () => {
            this.k.rootsJar.setInteractive();
            this.k.mortar.setInteractive();

            this.hook('kitchen:drop:mortar', (payload) => {
                    //console.log("Hook 'kitchen:drop:mortar' disparado con data:", payload);
                if (payload.dropData === 'cutRoot') {

                    // lanzar minijuego
                    //console.log("Minijuego del mortero lanzado");
                    this.k.scene.launch('mortarMinigame', { ingredient: payload.dropData });
                    // esperar evento
                    this.k.events.once('minigame:tutorial:finished', () => {
                            //console.log("Minijuego del mortero terminado");
                        this.stop();
                        this.say("¡Estupendo! Ahora ya sabes cómo usar las dos herramientas. Los clientes podrán pedirte que dejes el ingrediente intacto, que lo cortes o lo machaques. Si no recuerdas para qué sirve alguna herramienta, siempre puedes consultar el libro de recetas.", () => this.step4());
                    });

                    return { cancel: true };
                }
            });
        });
    }

    // PASO 4: USAR EL LIBRO DE RECETAS
    step4(){
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;
        this.say("El libro de recetas es tu mejor amigo. En él podrás consultar qué ingredientes hay, las afinidades entre las distintas razas y para qué sirve cada herramienta. También podrás regresar a los tutoriales siempre que necesites practicar o que te refresquen la memoria ", () => {

            this.k.bookImg.setInteractive();
            this.k.bookImg.once('pointerdown', () => {
                this.k.events.emit('book');
                this.k.events.once('book:closed', () => {
                    this.say("¡Perfecto! Ahora que ya sabes dónde mirar las compatibilidades entre razas podemos pasar a las tres probetas que se encuentran a mi derecha. Dependiendo de la afinidad que obtengamos, deberás elegir una u otra y arrastrarlas al caldero.", () => {
                        this.step5();
                    });
                });
            });
        });
    }

    // PASO 5: USAR LAS PROBETAS
    step5(){
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true; 
        
        this.say("Cada probeta representa un tipo de afinidad. Cuando tengas dudas entre las afinidades de dos razas, consúltalo en el libro. Vamos a practicar esto, por ejemplo, comprueba la afinidad entre gnomos y hadas, selecciona la probeeta adecuada y arrástrala hacia el caldero", () => {
            this.k.bookImg.setInteractive(); 
            this.k.redTestTube.setInteractive();
            this.k.greenTestTube.setInteractive();
            this.k.grayTestTube.setInteractive();
            this.k.cauldronImg.setInteractive();

            const expected = 'redTestTube';

            this.hook('kitchen:drop:cauldron', ({ itemType, dropData }) => {
             
                if (dropData !== expected) return;

                // Correcto: avanzamos
                this.stop();
                this.say("¡Perfecto! Has elegido la probeta correcta.", () => {
                    this.step6();
                });
            });
        });
    }

    // PASO 6: FINAL DEL TUTORIAL
    step6(){
        this.disableAllInteractions();
        this.stop();
        this.k.tutorialMode = true;

        this.say("¡Ánimo que ya queda poco! Vamos con el siguiente paso: los colores. ¿Ves los 3 pequeños polvos de colores a mi izquierda? Estos sirven para aportar color a la poción. Puedes poner un solo color (rojo, azul o amarillo) o bien mezclarlos en el plato de abajo para crear un nuevo color (morado, verde o naranja). Vamos a probar esto, utiliza el rojo y el amarillo para crear naranja y échalo al caldero", () => {
            this.k.redBowl.setInteractive();
            this.k.yellowBowl.setInteractive();
            this.k.mixPlate.setInteractive();
            this.k.cauldronImg.setInteractive();

            let locked = false;

            this.hook('kitchen:drop:cauldron', ({ itemType, dropData }) => {
                if (locked) return;
                if (dropData === 'orange') {
                    locked = true;
                    this.stop();
                    this.say("¡Perfecto! Has creado naranja y lo has añadido al caldero.", () => {
                        // siguiente paso:
                        this.step7();
                    });
                } else {
                    locked = true;
                    this.say("Ese no es el color correcto. Recuerda: rojo + amarillo = *naranja*. Vuelve a intentarlo.", () => {
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

        this.say(
            "Y llegamos al último paso: Rellenar la poción y entregarla al cliente. Para vaciar el contenido del caldero y poder entregarlo, arrastra una de las pociones vacías de formas que puedes encontrar en la balda superior. Tan solo tendrás que arrastrar la elegida sobre el caldero (¡sin soltarla!). Esta automáticamente se rellenará y deberás colocarla en la estación de entrega de la parte inferior derecha. Nota: Esto solo funcionará si el caldero contiene ingredientes. Rellena la poción y déjala en la estación de entrega.",
            () => {
                // Habilitar lo necesario
                this.k.cauldronImg.setInteractive();
                this.k.delivery.setInteractive();

                // formas (pociones vacías)
                this.k.emptyNormalPotion.setInteractive();
                this.k.emptyHeartPotion.setInteractive();
                this.k.emptyStarPotion.setInteractive();



                // Esperar a que entregue UNA poción
                this.hook('kitchen:deliver', ({shape }) => {
                    this.say("¡Perfecto! Has completado el tutorial. Ya puedes preparar y entregar pociones por tu cuenta.", () => {
                        this.finish(); 
                        this.k.scene.sleep('kitchen');
                        this.k.scene.start('store');
                    });
                    return { cancel: true };

                });
            }
        );
    }
}