
export default class Cauldron {
    constructor(scene, cauldronSprite) {
        this.scene = scene;
        this.cauldronSprite = cauldronSprite;

        this.scene.anims.create({
            key: 'heat',
            frames: this.scene.anims.generateFrameNames('hotFire', { prefix: 'fuego_caliente-', start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });

        this.fire = this.scene.add.sprite(130 * 3, 115 * 3, 'hotFire')
            .setOrigin(0, 0)
            .setScale(3)
            .setVisible(false);

        this.cauldronSprite.on('pointerdown', () => {
            this.toggleFire();
        });
    }

    toggleFire() {
        if (this.fire.visible) {
            this.fire.setVisible(false);
            this.fire.stop();
        } else {
            this.fire.setVisible(true);
            this.fire.play('heat');
        }
    }
}