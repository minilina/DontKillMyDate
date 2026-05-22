import DialogueManager from "../dialogue/dialogueManager.js";
import TutorialDialogueUI from "./tutorialDialogueUI.js";

export default class TutorialDialogueManager extends DialogueManager {
    constructor(scene) {
        const tutorialUI = new TutorialDialogueUI(scene);
        super(scene, { ui: tutorialUI });
    }

    startAt(dialogue, x, y) {
        this.ui.moveTo(x, y);
        this.start(dialogue);
    }
}