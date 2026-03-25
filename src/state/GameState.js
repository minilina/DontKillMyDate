
const GameState = {

    // VARIABLES GLOBALES
    reputation: 0,
    currentDay: 1,
    currentCustomer: 0, // índice del cliente en la cola
    daysData: null,

    // VARIABLES POCIONES
    currentPotion: {
        quality: 100
    },

    initData(jsonConfig) {
        this.daysData = jsonConfig;
    },

    isDayOver() {
        const today = this.daysData[this.currentDay - 1];
        return this.currentCustomer >= today.customers.length;
    },

    prepareNewCustomer() {
        this.currentPotion.quality = 100;
    },

    advanceDay() {
        this.currentDay++;
        this.currentCustomer = 0;
    },

    deliverPotion() { 
        if (this.currentPotion.quality > 50) {
            this.reputation += 5;
        } else if (this.currentPotion.quality < 50) {
            this.reputation -= 10;
        }
        
        this.currentCustomer++;
    },

    reducePotionQuality(penalty) {
        this.currentPotion.quality -= penalty;

        if (this.currentPotion.quality < 0) {
            this.currentPotion.quality = 0;
        }
    }
};

export default GameState;