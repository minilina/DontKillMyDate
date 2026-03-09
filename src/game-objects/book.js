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
                scene.scale.width / 2,
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

        // Diccionario de combinaciones → imagen resultante
        this.afinidadDict = {
            "elfos-gnomos": "afin",
            "hadas-ninfas": "afin",
            "humanos-kitsunes": "afin",
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
                if (!this.selections.includes(element)) {
                    this.selections.push(element);
                }

                if (this.selections.length === 2) {
                    const key = this.selections.sort().join('-');
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

    open() { this.setVisible(true); }
    close() { this.setVisible(false); }
}