import Phaser from 'phaser';

export default class topdownNPC extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, npcId, npcData) {

        super(scene, x, y, npcData.anim);

        this.scene = scene;
        this.npcId = npcId;
        this.npcData = npcData;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Hitbox
        this.body.setSize(12, 10);
        this.body.setOffset(10, 22);

        // Depth dinámico
        this.setDepth(this.y);

        // Estado diálogo
        this.firstDialogueDone = false;

        // Crear animación
        this.createAnimation();

        // Reproducir animación
        this.play(this.npcData.anim);
    }

    preUpdate(time, delta) {

        super.preUpdate(time, delta);

        this.setDepth(this.y);
    }

    createAnimation() {

        // La key será EXACTAMENTE el nombre del anim del JSON
        // Ejemplo: NPCmadre

        if (this.scene.anims.exists(this.npcData.anim)) return;

        this.scene.anims.create({

            key: this.npcData.anim,

            frames: this.scene.anims.generateFrameNumbers(
                this.npcData.anim,
                {
                    start: 0,
                    end: 3
                }
            ),

            frameRate: 6,
            repeat: -1
        });
    }

    interact() {

        const lines = !this.firstDialogueDone
            ? this.npcData.firstDialogue
            : this.npcData.dialogue;

        this.scene.dialogueManager.start({

            speakerName: this.npcData.name,

            lines
        });

        this.firstDialogueDone = true;
    }
}