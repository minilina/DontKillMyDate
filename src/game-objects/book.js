import Phaser from 'phaser';

export default class Book extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        this.setDepth(300);
        const width = scene.scale.width;
        const height = scene.scale.height;
        const scale = 3;

        // Capa de fondo para cerrar libro al hacer click fuera de él
        const overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x4d322c, 0.3).setInteractive();

        overlay.on('pointerdown', () => {
            this.close();
        });

        this.add(overlay);

        // Libro
        const libroImg = scene.add.image(width / 2, height / 2, 'openBook').setInteractive().setScale(scale);

        this.add(libroImg);

        // SISTEMA DE PÁGINAS
        this.pages = [];
        this.currentPage = 0;

        const page1 = scene.add.container(0, 0);
        const page2 = scene.add.container(0, 0);
        const page3 = scene.add.container(0, 0);
        const page4 = scene.add.container(0, 0);

        this.pages.push(page1);
        this.pages.push(page2);
        this.pages.push(page3);
        this.pages.push(page4)

        this.add(page1);
        this.add(page2);
        this.add(page3);
        this.add(page4);

        page2.setVisible(false);
        page3.setVisible(false);
        page4.setVisible(false);

        // =========================
        // PAGINA 1 (AFINIDADES)
        // =========================

        const title1 = scene.add.text(
            318,
            100,
            "Afinidad",
            {
                fontFamily: "VT323, monospace",
                fontSize: "48px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const instruccion = scene.add.text(640, 100, "¡Selecciona 2 razas para\nsaber la afinidad entre ellas!", 
            {
                fontFamily: "VT323, monospace",
                fontSize: "22px",
                color: "#4f342d",
            }
        ).setOrigin(0.5);
        
        const afin = scene.add.image(555, 180, 'afin').setScale(3);
        const igual = scene.add.image(555, 275, 'igual').setScale(3);
        const hostil = scene.add.image(555, 370, 'hostil').setScale(3);
        const nextButton1 = scene.add.image(645, 180, 'next').setScale(3);
        const nextButton2 = scene.add.image(645, 275, 'next').setScale(3);
        const nextButton3 = scene.add.image(645, 370, 'next').setScale(3);
        const verde = scene.add.image(725, 180, 'greenTestTube').setScale(3);
        const gris = scene.add.image(725, 275, 'grayTestTube').setScale(3);
        const rojo = scene.add.image(725, 370, 'redTestTube').setScale(3);


        const elements = ['humanos', 'kitsunes', 'ninfas', 'hadas', 'elfos', 'gnomos'];

        const positions = [
            { x: 318, y: 165 },
            { x: 423, y: 225 },
            { x: 423, y: 315 },
            { x: 318, y: 370 },
            { x: 213, y: 315 },
            { x: 213, y: 225 }
        ];

        const center = {
            x: positions.reduce((sum, p) => sum + p.x, 0) / positions.length,
            y: positions.reduce((sum, p) => sum + p.y, 0) / positions.length
        };

        this.afinidadDict = {

            "humanos-humanos": "afin",
            "hadas-hadas": "afin",
            "ninfas-ninfas": "afin",
            "kitsunes-kitsunes": "afin",
            "elfos-elfos": "afin",
            "gnomos-gnomos": "afin",

            "hadas-humanos": "afin",
            "humanos-ninfas": "igual",
            "humanos-kitsunes": "igual",
            "elfos-humanos": "hostil",
            "gnomos-humanos": "hostil",

            "hadas-ninfas": "hostil",
            "hadas-kitsunes": "igual",
            "elfos-hadas": "igual",
            "gnomos-hadas": "hostil",

            "kitsunes-ninfas": "hostil",
            "elfos-ninfas": "afin",
            "gnomos-ninfas": "igual",

            "elfos-kitsunes": "hostil",
            "gnomos-kitsunes": "afin",

            "elfos-gnomos": "igual"
        };

        this.selections = [];

        elements.forEach((element, index) => {

            const icon = scene.add.image(
                positions[index].x,
                positions[index].y,
                element
            )
                .setScale(3)
                .setInteractive({ useHandCursor: true });

            const label = scene.add.text(
                positions[index].x,
                positions[index].y + 40,
                element,
                {
                    fontFamily: "VT323",
                    fontSize: "20px",
                    color: "#4f342d"
                }
            ).setOrigin(0.5);

            // Asegurarnos de que la lista existe desde el principio
            // Asegurarnos de que la lista existe desde el principio
            if (!this.iconosTocados) this.iconosTocados = [];

            icon.on("pointerover", () => {
                icon.setScale(3.2);
            });

            icon.on("pointerout", () => {
                // Solo se encoge si NO está en la lista de seleccionados
                if (!this.iconosTocados.includes(icon)) {
                    icon.setScale(3);
                }
            });

            icon.on('pointerdown', () => {

                icon.setScale(3.2);

                if (!icon.rebordeVisual) {
                    // Creamos la imagen en la misma posición relativa
                    const reborde = scene.add.image(icon.x, icon.y, icon.texture.key)
                        .setScale(3.5)
                        .setTintFill(0xffffff); // Silueta blanca sólida


                    if (icon.parentContainer) {
                        icon.parentContainer.add(reborde);
                        icon.parentContainer.moveBelow(reborde, icon);
                    } else {
                        reborde.setDepth(icon.depth - 1);
                    }

                    icon.rebordeVisual = reborde;
                }


                this.selections.push(element);
                this.iconosTocados.push(icon);

                if (this.selections.length === 2) {

                    const key = this.getKey(this.selections[0], this.selections[1]);
                    const resultImage = this.afinidadDict[key];

                    if (resultImage) {
                        const res = scene.add.image(center.x, center.y, resultImage)
                            .setOrigin(0.5).setAlpha(0).setScale(4);

                        // Asumo que page1 es tu contenedor principal
                        page1.add(res);

                        scene.tweens.add({
                            targets: res, alpha: 1, scale: 3, duration: 1200, ease: 'Power2',
                            onComplete: () => {
                                scene.tweens.add({
                                    targets: res, alpha: 0, duration: 600, ease: 'Power2',
                                    onComplete: () => res.destroy()
                                });
                            }
                        });
                    }

                    // 4. Limpieza: Destruimos los rebordes y encogemos
                    this.iconosTocados.forEach(i => {
                        if (i.rebordeVisual) {
                            i.rebordeVisual.destroy();
                            i.rebordeVisual = null;
                        }
                        i.setScale(3);
                    });

                    // Vaciamos las listas
                    this.selections = [];
                    this.iconosTocados = [];
                }
            });

            page1.add(icon);
            page1.add(label);
            page1.add(title1);
            page1.add(instruccion);
            page1.add(afin);
            page1.add(igual);
            page1.add(hostil);
            page1.add(nextButton1);
            page1.add(nextButton2);
            page1.add(nextButton3);
            page1.add(verde);
            page1.add(gris);
            page1.add(rojo);

        });

        // =========================
        // PAGINA 2 
        // =========================

        const title2 = scene.add.text(
            318,
            100,
            "Ingredientes",
            {
                fontFamily: "VT323, monospace",
                fontSize: "48px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const mushroom = scene.add.image(235, 170, 'mushroom').setScale(3);
        const berry = scene.add.image(235, 225, 'berry').setScale(3);
        const root = scene.add.image(235, 280, 'root').setScale(3);
        const algae = scene.add.image(235, 335, 'algae').setScale(3);
        const crystal = scene.add.image(235, 390, 'crystal').setScale(3);
        const nextButton4 = scene.add.image(310, 170, 'next').setScale(3);
        const nextButton5 = scene.add.image(310, 225, 'next').setScale(3);
        const nextButton6 = scene.add.image(310, 280, 'next').setScale(3);
        const nextButton7 = scene.add.image(310, 335, 'next').setScale(3);
        const nextButton8 = scene.add.image(310, 390, 'next').setScale(3);

        const umami = scene.add.text(
            360,
            153,
            "Umami",
            {
                fontFamily: "VT323, monospace",
                fontSize: "30px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        );
        const acido = scene.add.text(
            360,
            208,
            "Ácido",
            {
                fontFamily: "VT323, monospace",
                fontSize: "30px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        );
        const amargo = scene.add.text(
            360,
            263,
            "Amargo",
            {
                fontFamily: "VT323, monospace",
                fontSize: "30px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        );
        const dulce = scene.add.text(
            360,
            318,
            "Dulce",
            {
                fontFamily: "VT323, monospace",
                fontSize: "30px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        );
        const salado = scene.add.text(
            360,
            373,
            "Salado",
            {
                fontFamily: "VT323, monospace",
                fontSize: "30px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        );

        // 1. Los estilos se quedan igual
        const estiloTitulo = {
            fontFamily: "VT323, monospace",
            fontSize: "30px",
            color: "#4f342d",
            fontStyle: "bold"
        };

        const estiloDesc = {
            fontFamily: "VT323, monospace",
            fontSize: "22px",
            color: "#4f342d"
        };

        // 2. COLUMNAS (Reculamos un poco a la izquierda)
        const centroX = 640;   // Ni muy al centro, ni muy al borde
        const imagenX = 530;
        const descX = 560;

        // --- BLOQUE 1: SIN PROCESAR (Todo sube 10px) ---
        const noProcess = scene.add.text(centroX, 90, "Textura sólida", estiloTitulo).setOrigin(0.5);
        const mushroomJar = scene.add.image(imagenX, 140, 'mushroomJar').setScale(2);
        const descNoProcess = scene.add.text(descX, 140, "Agrega los ingredientes\ndirectamente del frasco.", estiloDesc).setOrigin(0, 0.5);

        // --- BLOQUE 2: TABLA DE CORTAR (Todo sube 10px) ---
        const cuttingText = scene.add.text(centroX, 200, "Textura masticable", estiloTitulo).setOrigin(0.5);
        // Nota: Respeto tus coordenadas manuales X, solo resto 10 a la Y
        const cutting = scene.add.image(580, 270, 'cuttingBoard').setScale(1.25);
        const descCutting = scene.add.text(630, 265, "Picar los \ningredientes\nen la tabla.", estiloDesc).setOrigin(0, 0.5);

        // --- BLOQUE 3: MORTERO (Título sube 10px, resto intacto) ---
        const mortarText = scene.add.text(centroX, 340, "Textura cremosa", estiloTitulo).setOrigin(0.5);
        const mortar = scene.add.image(545, 390, 'mortar').setScale(2);
        const descMortar = scene.add.text(580, 390, "Reducir a polvo fino \ncon el mortero.", estiloDesc).setOrigin(0, 0.5);

        page2.add(title2);
        page2.add(mushroom);
        page2.add(berry);
        page2.add(root);
        page2.add(algae);
        page2.add(crystal);
        page2.add(nextButton4);
        page2.add(nextButton5);
        page2.add(nextButton6);
        page2.add(nextButton7);
        page2.add(nextButton8);
        page2.add(salado);
        page2.add(dulce);
        page2.add(amargo);
        page2.add(acido);
        page2.add(umami);
        page2.add(cutting);
        page2.add(mortar);
        page2.add(mushroomJar);
        page2.add(noProcess);
        page2.add(cuttingText);
        page2.add(mortarText);
        page2.add(descNoProcess);
        page2.add(descCutting);
        page2.add(descMortar);

        // =========================
        // PAGINA 3 
        // =========================

        const title3 = scene.add.text(
            318,
            100,
            "Tintes",
            {
                fontFamily: "VT323, monospace",
                fontSize: "48px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const descTintes = scene.add.text(180, 180, "Para determinar el color de la \npoción puedes utilizar los \ntintes disponibles directamente \nen el caldero.", estiloDesc).setOrigin(0, 0.5);
        const esqColor = scene.add.image(643, 230, 'esqColor').setScale(3);
        const redBowl = scene.add.image(268, 260, 'redBowl').setScale(3);
        const blueBowl = scene.add.image(318, 260, 'blueBowl').setScale(3);
        const yellowBowl = scene.add.image(368, 260, 'yellowBowl').setScale(3);
        const descTintesMez = scene.add.text(180, 325, "Para crear colores más complejos \nmezcla los tintes en el plato \ny luego añadelos al caldero.", estiloDesc).setOrigin(0, 0.5);
        const plate = scene.add.image(318, 395, 'plate').setScale(3);

        const esq = scene.add.text(
            640,
            90,
            "Leyenda de colores",
            {
                fontFamily: "VT323, monospace",
                fontSize: "30px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const notaTintes = scene.add.text(643, 385, "¡Cuidado! Una vez añadas un color al\ncaldero no se puede cambiar, tendrás\nque tirar la poción metiéndola en\nun frasco.", {
            fontFamily: "VT323, monospace",
            fontSize: "19px",
            color: "#4f342d"
        }).setOrigin(0.5);

        page3.add(title3);
        page3.add(esqColor);
        page3.add(plate);
        page3.add(descTintes);
        page3.add(redBowl);
        page3.add(blueBowl);
        page3.add(yellowBowl);
        page3.add(descTintesMez);
        page3.add(notaTintes);
        page3.add(esq);

        // =========================
        // PAGINA 4 
        // =========================

        const title4 = scene.add.text(
            318,
            100,
            "Temperatura",
            {
                fontFamily: "VT323, monospace",
                fontSize: "48px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const title5 = scene.add.text(
            640,
            100,
            "Vestimenta",
            {
                fontFamily: "VT323, monospace",
                fontSize: "48px",
                color: "#4f342d",
                fontStyle: "bold"
            }
        ).setOrigin(0.5);

        const descCauldron = scene.add.text(180, 160, "Para cocinar la poción enciende \nel fuego chocando las piedras.", estiloDesc).setOrigin(0, 0.5);
        const cauldron = scene.add.image(250, 240, 'cauldron').setScale(1.5);
        const stones = scene.add.image(390, 240, 'stones').setScale(1.5);
        const descHeat = scene.add.text(180, 320, "Apaga el fuego cuando la \nflecha llegue a la temperatura \ndeseada.", estiloDesc).setOrigin(0, 0.5);
        const heatBar = scene.add.image(318, 380, 'heatBar').setScale(4);
        const frio = scene.add.text(
            210,
            395,
            "Helado",
            {
                fontFamily: "VT323, monospace",
                fontSize: "25px",
                color: "#376482",
                fontStyle: "bold"
            }
        );

        const templado = scene.add.text(
            275,
            395,
            "Templado",
            {
                fontFamily: "VT323, monospace",
                fontSize: "25px",
                color: "#bd6b00",
                fontStyle: "bold"
            }
        );

        const caliente = scene.add.text(
            360,
            395,
            "Caliente",
            {
                fontFamily: "VT323, monospace",
                fontSize: "25px",
                color: "#7c1c1c",
                fontStyle: "bold"
            }
        );

        const baseX = 560;
        const baseY = 150; // más arriba

        const spacingY = 90; // más espaciado

        // columna izquierda
        const ropa_elfo = scene.add.image(baseX, baseY, 'ropa_elfo').setScale(1);
        const title_elfo = scene.add.text(baseX - 20, baseY + 50, "Elfo", { fontFamily: "VT323, monospace", fontSize: "25px", color: "#4f342d", fontStyle: "bold" });

        const ropa_hada = scene.add.image(baseX, baseY + spacingY, 'ropa_hada').setScale(1);
        const title_hada = scene.add.text(baseX - 20, baseY + spacingY + 50, "Hada", { fontFamily: "VT323, monospace", fontSize: "25px", color: "#4f342d", fontStyle: "bold" });

        const ropa_kit = scene.add.image(baseX, baseY + spacingY * 2, 'ropa_kitsune').setScale(1);
        const title_kit = scene.add.text(baseX - 33, baseY + spacingY * 2 + 50, "Kitsune", { fontFamily: "VT323, monospace", fontSize: "25px", color: "#4f342d", fontStyle: "bold" });

        // columna derecha
        const ropa_gnomo = scene.add.image(baseX + 160, baseY, 'ropa_gnomo').setScale(1);
        const title_gnomo = scene.add.text(baseX + 137, baseY + 50, "Gnomo", { fontFamily: "VT323, monospace", fontSize: "25px", color: "#4f342d", fontStyle: "bold" });

        const ropa_ninfa = scene.add.image(baseX + 160, baseY + spacingY, 'ropa_ninfa').setScale(1);
        const title_ninfa = scene.add.text(baseX + 137, baseY + spacingY + 50, "Ninfa", { fontFamily: "VT323, monospace", fontSize: "25px", color: "#4f342d", fontStyle: "bold" });

        const ropa_humano = scene.add.image(baseX + 160, baseY + spacingY * 2, 'ropa_humano').setScale(1);
        const title_humano = scene.add.text(baseX + 132, baseY + spacingY * 2 + 50, "Humano", { fontFamily: "VT323, monospace", fontSize: "25px", color: "#4f342d", fontStyle: "bold" });

        page4.add(cauldron);
        page4.add(descCauldron)
        page4.add(heatBar);
        page4.add(descHeat)
        page4.add(frio);
        page4.add(templado);
        page4.add(caliente);
        page4.add(stones);
        page4.add(ropa_elfo);
        page4.add(ropa_hada);
        page4.add(ropa_kit);
        page4.add(ropa_gnomo);
        page4.add(ropa_ninfa);
        page4.add(ropa_humano);
        page4.add(title_elfo);
        page4.add(title_hada);
        page4.add(title_kit);
        page4.add(title_gnomo);
        page4.add(title_ninfa);
        page4.add(title_humano);


        page4.add(title4);
        page4.add(title5);
        // =========================
        // ETIQUETAS DE PAGINA
        // =========================

        const redTagButton = scene.add.image(279 * scale, 50 * scale, 'redTag2')
            .setInteractive({
                useHandCursor: true,
                pixelPerfect: true
            })
            .setScale(scale);

        const blueTagButton = scene.add.image(279 * scale, 74 * scale, 'blueTag1')
            .setInteractive({
                useHandCursor: true,
                pixelPerfect: true
            })
            .setScale(scale);

        const greenTagButton = scene.add.image(279 * scale, 98 * scale, 'greenTag1')
            .setInteractive({
                useHandCursor: true,
                pixelPerfect: true
            })
            .setScale(scale);

        const purpleTagButton = scene.add.image(279 * scale, 122 * scale, 'purpleTag1')
            .setInteractive({
                useHandCursor: true,
                pixelPerfect: true
            })
            .setScale(scale);

        this.add(redTagButton);
        this.add(blueTagButton);
        this.add(greenTagButton);
        this.add(purpleTagButton);

        redTagButton.on("pointerdown", () => {
            this.showPage(0);
            redTagButton.setTexture('redTag2');
            blueTagButton.setTexture('blueTag1');
            greenTagButton.setTexture('greenTag1');
            purpleTagButton.setTexture('purpleTag1');
            const bookSounds = ['bookSound1', 'bookSound2'];
            const randomSound = Phaser.Math.RND.pick(bookSounds);
            this.scene.sound.play(randomSound, { volume: 1 });
        });

        redTagButton.on("pointerover", () => {
            redTagButton.setTexture('redTag2');
        });

        redTagButton.on("pointerout", () => {
            if (this.currentPage !== 0) {
                redTagButton.setTexture('redTag1');
            }
        });

        blueTagButton.on("pointerdown", () => {
            this.showPage(1);
            blueTagButton.setTexture('blueTag2');
            redTagButton.setTexture('redTag1');
            greenTagButton.setTexture('greenTag1');
            purpleTagButton.setTexture('purpleTag1');
            const bookSounds = ['bookSound1', 'bookSound2'];
            const randomSound = Phaser.Math.RND.pick(bookSounds);
            this.scene.sound.play(randomSound, { volume: 1 });
        });

        blueTagButton.on("pointerover", () => {
            blueTagButton.setTexture('blueTag2');
        });

        blueTagButton.on("pointerout", () => {
            if (this.currentPage !== 1) {
                blueTagButton.setTexture('blueTag1');
            }
        });

        greenTagButton.on("pointerdown", () => {
            this.showPage(2);
            redTagButton.setTexture('redTag1');
            blueTagButton.setTexture('blueTag1');
            greenTagButton.setTexture('greenTag2');
            purpleTagButton.setTexture('purpleTag1');
            const bookSounds = ['bookSound1', 'bookSound2'];
            const randomSound = Phaser.Math.RND.pick(bookSounds);
            this.scene.sound.play(randomSound, { volume: 1 });
        });

        greenTagButton.on("pointerover", () => {
            greenTagButton.setTexture('greenTag2');
        });

        greenTagButton.on("pointerout", () => {
            if (this.currentPage !== 2) {
                greenTagButton.setTexture('greenTag1');
            }
        });

        purpleTagButton.on("pointerdown", () => {
            this.showPage(3);
            redTagButton.setTexture('redTag1');
            blueTagButton.setTexture('blueTag1');
            greenTagButton.setTexture('greenTag1');
            purpleTagButton.setTexture('purpleTag2');
            const bookSounds = ['bookSound1', 'bookSound2'];
            const randomSound = Phaser.Math.RND.pick(bookSounds);
            this.scene.sound.play(randomSound, { volume: 1 });
        });

        purpleTagButton.on("pointerover", () => {
            purpleTagButton.setTexture('purpleTag2');
        });

        purpleTagButton.on("pointerout", () => {
            if (this.currentPage !== 3) {
                purpleTagButton.setTexture('purpleTag1');
            }
        });


        // =========================
        // BOTONES DE PAGINA
        // =========================

        // const nextButton = scene.add.image(755, 400, 'next')
        // .setInteractive({ useHandCursor: true })
        // .setScale(scale);

        // const prevButton = scene.add.image(200, 400, 'prev')
        // .setInteractive({ useHandCursor: true })
        // .setScale(scale);

        // this.add(nextButton);
        // this.add(prevButton);

        // nextButton.on("pointerdown", () => {
        //     // this.showPage(this.currentPage + 1);
        // });

        // prevButton.on("pointerdown", () => {
        // this.showPage(this.currentPage - 1);
        // });

        this.setVisible(false);
    }

    getKey(a, b) {
        return [a, b].sort().join("-");
    }

    showPage(index) {

        if (index < 0 || index >= this.pages.length) return;

        this.pages[this.currentPage].setVisible(false);

        this.currentPage = index;

        this.pages[this.currentPage].setVisible(true);
    }

    open() { this.setVisible(true); }
    close() {
        this.scene.events.emit('book:closed');
        this.setVisible(false);
    }

}