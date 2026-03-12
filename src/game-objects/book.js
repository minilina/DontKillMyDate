import Phaser from 'phaser';

export default class Book extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

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

        this.pages.push(page1);
        this.pages.push(page2);

        this.add(page1);
        this.add(page2);

        page2.setVisible(false);

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

            icon.on('pointerdown', () => {

                this.selections.push(element);

                if (this.selections.length === 2) {

                    const key = this.getKey(
                        this.selections[0],
                        this.selections[1]
                    );

                    const resultImage = this.afinidadDict[key];

                    if (resultImage) {

                        const res = scene.add.image(
                            center.x,
                            center.y,
                            resultImage
                        )
                        .setOrigin(0.5)
                        .setAlpha(0)
                        .setScale(4);

                        page1.add(res);

                        scene.tweens.add({
                            targets: res,
                            alpha: 1,
                            scale: 3,
                            duration: 1200,
                            ease: 'Power2',
                            onComplete: () => {

                                scene.tweens.add({
                                    targets: res,
                                    alpha: 0,
                                    duration: 600,
                                    ease: 'Power2',
                                    onComplete: () => res.destroy()
                                });

                            }
                        });
                    }

                    this.selections = [];
                }

            });

            page1.add(icon);
            page1.add(label);
            page1.add(title1);

        });

        // =========================
        // PAGINA 2 (EJEMPLO)
        // =========================

        const page2Text = scene.add.text(
            318,
            260,
            "Bestiario\n(Proximamente)",
            {
                fontFamily: "VT323",
                fontSize: "42px",
                color: "#4f342d",
                align: "center"
            }
        ).setOrigin(0.5);

        page2.add(page2Text);


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
        });

        blueTagButton.on("pointerover", () => {
            blueTagButton.setTexture('blueTag2');
        });

        blueTagButton.on("pointerout", () => {
            if (this.currentPage !== 1) {
                blueTagButton.setTexture('blueTag1');
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
    close() { this.setVisible(false); }

}