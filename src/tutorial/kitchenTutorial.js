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
        this.step1(); 
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
                this.step4();
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
                            this.step4();
                        });
                    });
                   
                    return { cancel: true }; 
                }
            });
        });
    }

      // PASO 3: MINIJUEGO MORTERO
    step3(){
        this.disableAllInteractions();

        this.stop(); 
        this.k.tutorialMode = true; 

        this.say("Para practicar con el mortero necesito que me traigas unas *raíces*. Cógelas de su frasco y arrástralas al mortero.", () => {
            this.k.rootsJar.setInteractive();
            this.k.mortar.setInteractive();
            
            
            this.hook('kitchen:drop:mortar', (payload) => {
                
                if (payload.dropData === 'grindRoots') {
                    this.k.scene.launch('mortarMinigame', { isTutorial: true, ingredient: payload.dropData });

                    this.k.events.once('minigame:tutorial:finished', () => {
                        this.stop();

                        this.say("¡Estupendo! Ahora ya sabemos cómo usar ambas herramientas. Los clientes podrán pedirte que dejes el ingrediente entero, lo machaques o lo cortes. Para sabes qué opción elegir siempre podrás consultarlo en el libro.", () => {
                            this.step4();
                        });
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
        
        this.say("Cada probeta representa un tipo de afinidad: la roja es para afinidades de fuego, la verde para afinidades de naturaleza y la gris para afinidades neutrales. Prueba a arrastrar la probeta roja al caldero.", () => {
            this.k.bookImg.setInteractive(); 
            this.k.redTestTube.setInteractive();
            this.k.greenTestTube.setInteractive();
            this.k.grayTestTube.setInteractive();
        });
    }

}