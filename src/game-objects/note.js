import Phaser from "phaser";

export default class Note extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.setDepth(1000);

    const width = scene.scale.width;
    const height = scene.scale.height;

    // 1. Overlay oscuro de fondo que ocupa TODA la pantalla
    const overlay = scene.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.4)
      .setInteractive();

    // Como el overlay ocupa toda la pantalla, cualquier click lo cerrará
    overlay.on("pointerdown", () => {
      this.close();
    });

    this.add(overlay);

    // 2. Carta tamaño pantalla
    // ¡OJO! Le hemos QUITADO el .setInteractive().
    // Ahora el papel es "transparente" a los clicks, dejando que golpeen el overlay.
    const paperImg = scene.add
      .image(width / 2, height / 2, "open_note")
      .setDisplaySize(width, height);

    this.add(paperImg);

    // 3. TEXTO DE LAS PISTAS (Mismas medidas y área que en letter.js)
    const textAreaX = width / 2 - 130;
    const textAreaY = height / 2 - 175;
    const textAreaWidth = 260;

    this.orderText = scene.add
      .text(textAreaX, textAreaY, "", {
        fontFamily: "VT323, monospace",
        fontSize: "25px",
        color: "#4f342d",
        align: "left",
        lineSpacing: 5,
        wordWrap: { width: textAreaWidth },
      })
      .setOrigin(0, 0);

    this.add(this.orderText);

    this.setVisible(false);
  }

  open() {
    const currentOrder = this.scene.registry.get("currentOrder");
    let noteTextContent = "No hay pedidos actuales.";

    if (currentOrder && currentOrder.literalWords) {
      const w = currentOrder.literalWords;

      noteTextContent =
        `NOTAS DEL HECHICERO:\n\n` +
        `- "${w.raza_objetivo}"\n` +
        `- "${w.color}"\n` +
        `- "${w.sabor}"\n` +
        `- "${w.consistencia}"\n` +
        `- "${w.temperatura}"\n` +
        `- "${w.forma_frasco}"`;
    }

    this.orderText.setText(noteTextContent);
    this.setVisible(true);
  }

  close() {
    this.scene.events.emit('note:closed');
    this.setVisible(false);
  }
}