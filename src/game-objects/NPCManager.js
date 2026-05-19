import NPC from '../game-objects/topdownNPC.js';
import npcData from "../../assets/json/scriptedNpcsTopdown.json";

export default class NPCManager {

    constructor(scene, dialogueManager) {
        this.scene = scene;
        this.dialogueManager = dialogueManager;

        this.npcs = [];

        this.interactionKey = scene.input.keyboard.addKey('E');

        this.currentNpc = null;

        this.createInteractionIcon();
    }

    createFromLayer(layerName) {

        const layer = this.scene.map.getObjectLayer(layerName);

        if (!layer) return;

        layer.objects.forEach(obj => {

            const npcId = obj.name;

            const data = npcData[npcId];

            if (!data) {
                console.warn(`NPC ${npcId} no existe en JSON`);
                return;
            }

            const npc = new NPC(
                this.scene,
                obj.x,
                obj.y - 16,
                npcId,
                data,
                this.dialogueManager
            );

            this.npcs.push(npc);
        });
    }

    createInteractionIcon() {

        this.interactText = this.scene.add.text(0, 0, 'E', {
            fontSize: '16px',
            backgroundColor: '#000',
            color: '#fff',
            padding: {
                x: 6,
                y: 2
            }
        });

        this.interactText.setDepth(99999);
        this.interactText.setVisible(false);
        this.interactText.setOrigin(0.5);
        this.interactText.setScrollFactor(1);
    }

    update() {

        const player = this.scene.player;

        let nearestNpc = null;
        let nearestDistance = 40;

        this.npcs.forEach(npc => {

            const dist = Phaser.Math.Distance.Between(
                player.x,
                player.y,
                npc.x,
                npc.y
            );

            if (dist < nearestDistance) {
                nearestDistance = dist;
                nearestNpc = npc;
            }
        });

        this.currentNpc = nearestNpc;

        if (nearestNpc) {

            this.interactText.setVisible(true);

            this.interactText.setPosition(
                nearestNpc.x,
                nearestNpc.y - 40
            );

            if (
                Phaser.Input.Keyboard.JustDown(this.interactionKey)
                && !this.dialogueManager.active
            ) {
                nearestNpc.interact();
            }

        } else {
            this.interactText.setVisible(false);
        }
    }
}