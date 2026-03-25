import Phaser from 'phaser';
import GameState from '../state/GameState.js';

export default class PotionScore extends Phaser.Scene {
    constructor() {
        super({ key: 'potionScore' });
    }

    create() {
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x222222).setOrigin(0);
        
        const quality = GameState.currentPotion.quality;
        const oldReputation = GameState.reputation;

        GameState.deliverPotion(); // actualizamos reputación

        const repChange = GameState.reputation - oldReputation;
        
        let repChangeText = '';
        if (repChange > 0) repChangeText = `+${repChange}`;
        else if (repChange < 0) repChangeText = `${repChange}`;
        else repChangeText = `(0)`;

        // UI
        this.add.text(this.scale.width / 2, 200, `Calidad de la poción: ${quality}%`, {
            fontFamily: "VT323, monospace",
            fontSize: '40px',
            color: '#f2e3d3'
        }).setOrigin(0.5);

        const repText = this.add.text(this.scale.width / 2, 280, `Reputación total: ${oldReputation}`, {
            fontFamily: "VT323, monospace",
            fontSize: '35px',
            color: '#f2e3d3'
        }).setOrigin(0.5);

        // animación del cambio de reputación
        this.time.delayedCall(1000, () => {
            
            const changeLabel = this.add.text(this.scale.width / 2 + 170, 280, repChangeText, {
                fontFamily: "VT323, monospace",
                fontSize: '40px',
                color: '#f2e3d3'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: changeLabel,
                y: changeLabel.y - 20,
                alpha: 0,
                duration: 1500,
                ease: 'Power2',
                onComplete: () => changeLabel.destroy()
            });

            this.time.delayedCall(800, () => {
                
                // cambiamos el texto al número nuevo
                repText.setText(`Reputación total: ${GameState.reputation}`);

                this.tweens.add({
                    targets: repText,
                    scale: 1.1,
                    duration: 150,
                    yoyo: true
                });

                // después de mostrar el cambio, volvemos a la tienda
                this.time.delayedCall(1000, () => {
                    this.scene.stop('potionScore');
                    const storeScene = this.scene.get('store');
                    storeScene.flowManager.continueShift();
                });
            });
        });
    }
}