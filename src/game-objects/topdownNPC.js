import Phaser from 'phaser';
import GameState from '../state/GameState.js';

export default class topdownNPC extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, npcId, npcData) {
        super(scene, x, y, npcData.anim);

        this.scene = scene;
        this.npcId = npcId;
        this.npcData = npcData;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(12, 10);
        this.body.setOffset(10, 22);
        this.setDepth(this.y);

        this.createAnimation();
        this.play(this.npcData.anim);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        this.setDepth(this.y);
    }

    createAnimation() {
        if (this.scene.anims.exists(this.npcData.anim)) return;

        this.scene.anims.create({
            key: this.npcData.anim,
            frames: this.scene.anims.generateFrameNumbers(
                this.npcData.anim,
                { start: 0, end: 3 }
            ),
            frameRate: 6,
            repeat: -1,
        });
    }

    /**
     * Lanza DialogueScene por encima de la escena que llama.
     * El estado de "primera vez hablado" vive en GameState (persiste entre escenas).
     *
     * @param {Phaser.Scene} callerScene  La TopDownScene que inicia la interacción.
     */
    interact(callerScene) {
        let lines = null;

        if (this.npcId == "madre") {

            GameState.talkToMother();
            let timesTalked = GameState.getTimesTalkedToMother()-1;

            const dialogues = this.npcData.dialogueTopdown;

            // Si existe diálogo para ese número, lo usamos.
            // Si no, usamos el último disponible.
            lines = dialogues[timesTalked] ||
                dialogues[Object.keys(dialogues).length - 1];

            

        } else {

            const alreadyTalked = GameState.hasTopdownNpcTalked(this.npcId);

            lines = !alreadyTalked
                ? this.npcData.firstDialogueTopdown
                : this.npcData.dialogueTopdown;

            GameState.markTopdownNpcTalked(this.npcId);
        }

        callerScene.scene.launch("DialogueScene", {
            parentScene: callerScene.scene.key,
            npcData: this.npcData,
            dialogue: {
                speakerName: this.npcData.name,
                lines,
            },
        });

        callerScene.scene.pause();
    }
}