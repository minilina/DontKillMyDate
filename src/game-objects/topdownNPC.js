import Phaser from 'phaser';

export default class topdownNPC extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, npcId, data, dialogueManager) {
        super(scene, x, y, data.anim);

        this.scene = scene;
        this.npcId = npcId;
        this.dataNpc = data;
        this.dialogueManager = dialogueManager;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Depth dinamico como el player
        this.setDepth(this.y);

        // Hitbox
        this.body.setSize(12, 10);
        this.body.setOffset(10, 22);

        // Guardamos si ya hablo una vez
        this.firstDialogueDone = false;

        // Crear animacion idle automaticamente
        this.createAnimations();

        // Reproducir idle
        this.play(`${npcId}-idle-down`);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // depth dinamico
        this.setDepth(this.y);
    }

    createAnimations() {

        const animKey = `${this.npcId}-idle-down`;

        // Evitar duplicarlas
        if (this.scene.anims.exists(animKey)) return;

        this.scene.anims.create({
            key: animKey,
            frames: this.scene.anims.generateFrameNumbers(this.dataNpc.anim, {
                start: 0,
                end: 3
            }),
            frameRate: 6,
            repeat: -1
        });
    }

    interact() {

        const dialogueLines = !this.firstDialogueDone
            ? this.dataNpc.firstDialogue
            : this.dataNpc.dialogue;

        this.dialogueManager.start({
            speakerName: this.dataNpc.name,
            lines: dialogueLines
        });

        this.firstDialogueDone = true;
    }
}