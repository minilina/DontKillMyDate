
const GameState = {
  // VARIABLES GLOBALES
  reputation: 0,
  currentDay: 1,
  currentCustomer: 0, // índice del cliente en la cola
  daysData: null,
  specialNpcsData: null,
  currentPotion: {
    quality: 100,
  },

  initData(jsonConfig, specialNpcsConfig) {
    this.daysData = jsonConfig;
    this.specialNpcsData = specialNpcsConfig;
  },

  getCurrentDifficulty() {
    const todayConfig = this.daysData[this.currentDay - 1];

    if (todayConfig && todayConfig.difficulty) {
      return todayConfig.difficulty;
    }

    return "facil"; 
  },
  isDayOver() {
    const today = this.daysData[this.currentDay - 1];
    return this.currentCustomer >= today.customers.length;
  },

  getCurrentCustomerType() {
    const today = this.daysData[this.currentDay - 1];
    return today.customers[this.currentCustomer];
  },

  // NUEVO: Devuelve los datos del JSON para ese NPC
  getSpecialNPC(id) {
    return this.specialNpcsData[id];
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
  },
};

export default GameState;