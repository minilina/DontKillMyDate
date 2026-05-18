import Phaser from "phaser";

export default class Note extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, 0, 0);
    scene.add.existing(this);

    this.setDepth(1000);

    const width = scene.scale.width;
    const height = scene.scale.height;

    const overlay = scene.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0.4)
      .setInteractive();

    overlay.on("pointerdown", () => {
      this.close();
    });

    this.add(overlay);

    const paperImg = scene.add
      .image(width / 2, height / 2, "open_note")
      .setDisplaySize(width, height);

    this.add(paperImg);

    const textAreaX = width / 2 - 130;
    const textAreaY = height / 2 - 175;
    const textAreaWidth = 300;


    this.titleText = scene.add
      .text(textAreaX, textAreaY, "NOTAS ALQUÍMICAS:", {
        fontFamily: "VT323, monospace",
        fontSize: "28px",
        color: "#f9ce2a",
        stroke: "#623100",
        strokeThickness: 5,
        align: "left",
      })
      .setOrigin(0, 0);

    this.add(this.titleText);

    this.orderText = scene.add
      .text(textAreaX, textAreaY + 65, "", {
        fontFamily: "VT323, monospace",
        fontSize: "25px",
        color: "#623100",
        align: "left",
        lineSpacing: 18,
        wordWrap: { width: textAreaWidth },
      })
      .setOrigin(0, 0);

    this.add(this.orderText);

    this.setVisible(false);
  }

  open() {
    const currentOrder = this.scene.registry.get("currentOrder");

    // Ahora el "noteTextContent" solo guarda la parte de los ingredientes
    let noteTextContent = "No hay pedidos actuales.";

    if (currentOrder && currentOrder.literalWords) {
      const w = currentOrder.literalWords;

      noteTextContent =
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
    this.scene.events.emit("note:closed");
    this.setVisible(false);
  }
}