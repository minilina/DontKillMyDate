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

    this.textStartY = textAreaY + 65;
    this.visibleHeight = 230;
    this.scrollBarWidth = 4;

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
      .text(textAreaX, this.textStartY, "", {
        fontFamily: "VT323, monospace",
        fontSize: "25px",
        color: "#623100",
        align: "left",
        lineSpacing: 18,
        wordWrap: { width: textAreaWidth - this.scrollBarWidth * 2 },
      })
      .setOrigin(0, 0);

    this.add(this.orderText);

    const maskShape = scene.make.graphics();
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(
      textAreaX,
      this.textStartY,
      textAreaWidth,
      this.visibleHeight,
    );
    const mask = maskShape.createGeometryMask();
    this.orderText.setMask(mask);

    const scrollBarX = textAreaX + textAreaWidth - this.scrollBarWidth - 5;
    this.scrollTrack = scene.add
      .rectangle(
        scrollBarX,
        this.textStartY,
        this.scrollBarWidth,
        this.visibleHeight,
        0x623100,
        0.2,
      )
      .setOrigin(0)
      .setVisible(false);
    this.scrollKnob = scene.add
      .rectangle(
        scrollBarX,
        this.textStartY,
        this.scrollBarWidth,
        20,
        0x623100,
        0.8,
      )
      .setOrigin(0)
      .setVisible(false);
    this.add([this.scrollTrack, this.scrollKnob]);

    const arrowY = this.textStartY + this.visibleHeight + 35;
    this.scrollArrow = scene.add
      .text(textAreaX + (textAreaWidth / 2) - 20, arrowY, "▼", {
        fontFamily: "VT323, monospace",
        fontSize: "30px",
        color: "#f9ce2a",
        stroke: "#623100",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setVisible(false);
    this.add(this.scrollArrow);

    scene.tweens.add({
      targets: this.scrollArrow,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Cubic.easeInOut",
    });

    const scrollZone = scene.add
      .zone(textAreaX, this.textStartY, textAreaWidth, this.visibleHeight)
      .setOrigin(0)
      .setInteractive();

    this.add(scrollZone);

    scrollZone.on("wheel", (pointer, deltaX, deltaY, deltaZ) => {
      this.scrollText(deltaY * 0.5);
    });

    let dragStartY = 0;
    scrollZone.on("pointerdown", (pointer, localX, localY, event) => {
      dragStartY = pointer.y;
      event.stopPropagation();
    });

    scrollZone.on("pointermove", (pointer) => {
      if (!pointer.isDown) return;
      const deltaY = dragStartY - pointer.y;
      this.scrollText(deltaY);
      dragStartY = pointer.y;
    });

    this.setVisible(false);
  }

  scrollText(deltaY) {
    const textHeight = this.orderText.height;

    if (textHeight <= this.visibleHeight) {
      this.orderText.setY(this.textStartY);
      this.updateScrollUI(false);
      return;
    }

    let newY = this.orderText.y - deltaY;
    const maxY = this.textStartY; // Tope por arriba
    const minY = this.textStartY - (textHeight - this.visibleHeight);

    newY = Phaser.Math.Clamp(newY, minY, maxY);
    this.orderText.setY(newY);

    this.updateScrollUI(true, newY, minY);
  }

  updateScrollUI(show, currentY, minY) {
    this.scrollTrack.setVisible(show);
    this.scrollKnob.setVisible(show);

    // La flecha solo se ve si no hemos llegado al final
    const arrowVisible = show && currentY > minY + 10;
    this.scrollArrow.setVisible(arrowVisible);

    if (show) {
      const totalScrollable = Math.abs(minY - this.textStartY);
      const currentScroll = Math.abs(currentY - this.textStartY);
      const scrollPercent = currentScroll / totalScrollable;

      const knobHeight = Math.max(
        20,
        (this.visibleHeight / this.orderText.height) * this.visibleHeight,
      );
      this.scrollKnob.setSize(this.scrollBarWidth, knobHeight);

      const availableTrack = this.visibleHeight - knobHeight;
      this.scrollKnob.setY(this.textStartY + availableTrack * scrollPercent);
    }
  }

  open() {
    const currentOrder = this.scene.registry.get("currentOrder");

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

    this.orderText.setY(this.textStartY);

    this.scrollText(0);

    this.setVisible(true);
  }

  close() {
    this.scene.events.emit("note:closed");
    this.setVisible(false);
  }
}