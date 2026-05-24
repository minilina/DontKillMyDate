import Phaser from 'phaser';
import GameState from '../state/GameState.js';

export default class topdownNPC extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, npcId, npcData) {
        super(scene, x, y, npcData.anim);

        this.scene  = scene;
        this.npcId  = npcId;
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
        const yaHabló = GameState.hasTopdownNpcTalked(this.npcId);

        const lines = !yaHabló
            ? this.npcData.firstDialogueTopdown
            : this.npcData.dialogueTopdown;

        // Marcamos como "ya habló" en GameState antes de lanzar la escena
        // (así si el jugador recarga la escena topdown, sigue marcado)
        GameState.markTopdownNpcTalked(this.npcId);

        callerScene.scene.launch("DialogueScene", {
            parentScene: callerScene.scene.key,
            npcData:     this.npcData,   // lleva .looks, .name, etc.
            dialogue: {
                speakerName: this.npcData.name,
                lines,
            },
        });

        callerScene.scene.pause();
    }
}