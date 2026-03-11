import Phaser from 'phaser';

export default class Book extends Phaser.GameObjects.Container {

    constructor(scene) {
        super(scene, 0, 0);
        scene.add.existing(this);

        // Fondo del libro
        const libroImg = scene.add.image(0, 0, 'libro')
            .setOrigin(0, 0)
            .setDisplaySize(scene.scale.width, scene.scale.height);
        this.add(libroImg);

        // Título del libro
        document.fonts.ready.then(() => {
            const title = scene.add.text(
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
            this.add(title);
        });

        // Botones
        const elements = ['humanos', 'kitsunes', 'ninfas', 'hadas', 'elfos', 'gnomos'];
        const positions = [
            { x: 318, y: 165 },
            { x: 423, y: 225 },
            { x: 423, y: 315 },
            { x: 318, y: 370 },
            { x: 213, y: 315 },
            { x: 213, y: 225 }
        ];

        // Calculamos el centro del hexágono
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
                    fontFamily: "VT323, monospace",
                    fontSize: "20px",
                    color: "#4f342d"
                }
            ).setOrigin(0.5);

            icon.on('pointerdown', () => {
                this.selections.push(element);

                if (this.selections.length === 2) {
                    const key = this.getKey(this.selections[0], this.selections[1]);
                    const resultImage = this.afinidadDict[key];

                    if (resultImage) {
                        // Crear imagen en el centro con alpha=0 y escala pequeña
                        const res = scene.add.image(center.x, center.y, resultImage)
                            .setOrigin(0.5)
                            .setAlpha(0)
                            .setScale(4);
                        this.add(res);

                        // Tween de pop + fade-in
                        scene.tweens.add({
                            targets: res,
                            alpha: 1,
                            scale: 3,
                            duration: 1200,
                            ease: 'Power2',
                            onComplete: () => {
                                // Después de 1.2s, fade-out
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

                    // Limpiar selección para la siguiente combinación
                    this.selections = [];
                }
            });

            this.add(icon);
            this.add(label);
        });

        this.setVisible(false);
    }

    getKey(a, b) {
        return [a, b].sort().join("-");
    }

    open() { this.setVisible(true); }
    close() { this.setVisible(false); }
}