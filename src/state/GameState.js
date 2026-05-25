const GameState = {
  // VARIABLES GLOBALES
  endingType: null,
  reputation: 50,
  currentDay: 1,
  huertosRegadosHoy: {
    huerto1: false,
    huerto2: false
  },
  currentCustomer: 0,
  daysData: null,
  specialNpcsData: null,
  currentPotion: {
    quality: 100,
  },

  orderStartTime: 0,
  orderEndTime: 0,
  totalPausedTime: 0,
  pauseStartTime: 0,

  hasCompletedSpecialEvent: false,

  specialNpcRecords: {
    elf: null,
    nymph: null,
    gnomo: null,
    fairy: null,
    human: null,
    kitsune: null,
    madre: null,
  },

  /**
   * Registro de si el jugador ya habló por primera vez con cada NPC en el topdown.
   * La clave es el npcId (igual que en specialNpcRecords).
   * false = aún no ha hablado → se usará firstDialogueTopdown
   * true  = ya habló → se usará dialogueTopdown
   */
  topdownNpcFirstDialogueDone: {},

  timesMotherTalkedToPlayer: 0,
  lastDayTalkedToMother: 0,

  getTimesTalkedToMother() {
    return this.timesMotherTalkedToPlayer;
  },
  talkToMother() {
    //solo incrementamos las veces habladas con la madre si es un dia nuevo
    if (this.lastDayTalkedToMother !== this.currentDay) {
      this.timesMotherTalkedToPlayer++;
      this.lastDayTalkedToMother = this.currentDay;
    }
  },

  saveSpecialNpcRecord(npcId, score) {
    if (this.specialNpcRecords[npcId] !== undefined) {
      this.specialNpcRecords[npcId] = score;
    }
  },

  /**
   * Devuelve true si ya se habló con este NPC en el topdown al menos una vez.
   */
  hasTopdownNpcTalked(npcId) {
    return !!this.topdownNpcFirstDialogueDone[npcId];
  },

  /**
   * Marca que el jugador ya habló con este NPC en el topdown.
   */
  markTopdownNpcTalked(npcId) {
    this.topdownNpcFirstDialogueDone[npcId] = true;
  },

  dailyStats: {
    served: 0,
    good: 0,
    bad: 0,
    repChange: 0,
    wateringPenalty: 0
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
    if (!today) return true;
    return this.currentCustomer >= today.customers.length;
  },

  isGameOver() {
    return this.currentDay > this.daysData.length;
  },

  isNeutralEnding() {
    return this.getTimesTalkedToMother() < 5;
  },

  getCurrentCustomerType() {
    const today = this.daysData[this.currentDay - 1];
    return today.customers[this.currentCustomer];
  },

  getSpecialNPC(id) {
    return this.specialNpcsData[id];
  },

  prepareNewCustomer() {
    this.currentPotion.quality = 100;
    this.orderStartTime = Date.now();
    this.orderEndTime = 0;
    this.totalPausedTime = 0;
    this.pauseStartTime = 0;
  },

  pauseTimer() {
    if (this.orderStartTime > 0 && this.pauseStartTime === 0) {
      this.pauseStartTime = Date.now();
    }
  },

  resumeTimer() {
    if (this.pauseStartTime > 0) {
      const timePaused = Date.now() - this.pauseStartTime;
      this.totalPausedTime += timePaused;
      this.pauseStartTime = 0;
    }
  },

  stopTimer() {
    if (this.orderStartTime > 0 && this.orderEndTime === 0) {
      this.orderEndTime = Date.now();
    }
  },

  advanceDay() {
    this.currentDay++;
    this.currentCustomer = 0;

    this.huertosRegadosHoy.huerto1 = false;
    this.huertosRegadosHoy.huerto2 = false;

    this.dailyStats = {
      served: 0,
      good: 0,
      bad: 0,
      repChange: 0,
      wateringPenalty: 0
    };
  },

  reducePotionQuality(penalty) {
    this.currentPotion.quality -= penalty;
    if (this.currentPotion.quality < 0) {
      this.currentPotion.quality = 0;
    }
  },

  evaluatePotion(cauldronPotion, expectedOrder, potionShape) {
    let quality = 100;
    const req = expectedOrder.requirements;

    const dict = {
      sweet: "dulce",
      bitter: "amargo",
      salty: "salado",
      umami: "umami",
      sour: "acido",
      red: "rojo",
      blue: "azul",
      yellow: "amarillo",
      green: "verde",
      orange: "naranja",
      purple: "morado",
      whole: "entera",
      chopped: "cortada",
      mashed: "machacada",
      cold: "frio",
      hot: "calor",
      warm: "tiempo",
      Star: "estrella",
      Heart: "corazon",
      Normal: "normal",
    };

    const getExpectedTestTube = (raza1, raza2) => {
      if (!raza1 || !raza2) return null;

      const key = [raza1.toLowerCase(), raza2.toLowerCase()].sort().join("-");

      const afinidadDict = {
        "humanos-humanos": "afin",
        "hadas-hadas": "afin",
        "ninfas-ninfas": "afin",
        "kitsunes-kitsunes": "afin",
        "elfos-elfos": "afin",
        "gnomos-gnomos": "afin",
        "hadas-humanos": "afin",
        "humanos-ninfas": "igual",
        "humanos-kitsunes": "igual",
        "elfos-humanos": "hostil",
        "gnomos-humanos": "hostil",
        "hadas-ninfas": "hostil",
        "hadas-kitsunes": "igual",
        "elfos-hadas": "igual",
        "gnomos-hadas": "hostil",
        "kitsunes-ninfas": "hostil",
        "elfos-ninfas": "afin",
        "gnomos-ninfas": "igual",
        "elfos-kitsunes": "hostil",
        "gnomos-kitsunes": "afin",
        "elfos-gnomos": "igual",
      };

      const afinidad = afinidadDict[key] || "igual";

      if (afinidad === "afin") return "greenTestTube";
      if (afinidad === "hostil") return "redTestTube";
      return "grayTestTube";
    };

    const checkArrayCategory = (actualArray, requiredValue) => {
      const translatedArray = actualArray.map((item) => dict[item] || item);
      if (!translatedArray.includes(requiredValue)) {
        quality -= 20;
      }
      const extraIngredients = translatedArray.filter(
        (item) => item !== requiredValue,
      );
      quality -= 20 * extraIngredients.length;
    };

    if (req.color) {
      let finalColor = cauldronPotion.color
        ? cauldronPotion.color.replace("Liquid", "")
        : null;
      let translatedColor = dict[finalColor] || finalColor;
      if (translatedColor !== req.color) {
        quality -= 20;
      }
    }

    if (req.sabor) {
      checkArrayCategory(cauldronPotion.taste, req.sabor);
    }

    if (req.consistencia) {
      checkArrayCategory(cauldronPotion.consistency, req.consistencia);
    }

    const probetaRequerida = getExpectedTestTube(req.raza, req.raza_objetivo);
    if (probetaRequerida) {
      checkArrayCategory(cauldronPotion.smell, probetaRequerida);
    }

    if (req.temperatura) {
      let translatedTemp =
        dict[cauldronPotion.temperature] || cauldronPotion.temperature;
      if (translatedTemp !== req.temperatura) {
        quality -= 20;
      }
    }

    if (req.forma_frasco) {
      let translatedShape = dict[potionShape] || potionShape;
      if (translatedShape !== req.forma_frasco) {
        quality -= 20;
      }
    }

    this.currentPotion.quality = Math.max(0, quality);
    return this.currentPotion.quality;
  },

  deliverPotion() {
    const q = this.currentPotion.quality;
    let change = 0;

    if (q === 100) {
      change = 10;
    } else if (q >= 80) {
      change = 5;
    } else if (q >= 50) {
      change = 1;
    } else if (q >= 20) {
      change = -5;
    } else {
      change = -15;
    }

    // --- SISTEMA DE TIEMPO ---
    if (this.orderStartTime > 0) {
      const endTime = this.orderEndTime > 0 ? this.orderEndTime : Date.now();
      const timeSpentSeconds =
        (endTime - this.orderStartTime - this.totalPausedTime) / 1000;

      if (q >= 50) {
        if (timeSpentSeconds <= 30) {
          change += 2;
          console.log(
            "Tiempo rápido:",
            Math.round(timeSpentSeconds),
            "segundos. Reputación extra.",
          );
        } else if (timeSpentSeconds >= 120) {
          change -= 2;
          console.log(
            "Tiempo lento:",
            Math.round(timeSpentSeconds),
            "segundos. Reputación reducida.",
          );
        } else {
          // tiempo normal, sin cambios
          console.log(`Tiempo normal: ${Math.round(timeSpentSeconds)}s.`);
        }
      }
    }

    this.reputation += change;

    this.dailyStats.served++;

    if (q >= 50) {
      this.dailyStats.repChange += change;
      this.dailyStats.good++;
    } else {
      this.dailyStats.repChange += change;
      this.dailyStats.bad++;
    }

    this.currentCustomer++;

    if (this.isDayOver()) {
      let penalizacionHuertos = 0;
      if (this.currentDay > 1) { // el primer dia no se puede regar, asi que no penalizamos
        if (!this.huertosRegadosHoy.huerto1) penalizacionHuertos += 5; // 5 puntos por huerto (10 en total)
        if (!this.huertosRegadosHoy.huerto2) penalizacionHuertos += 5;
      }

      if (penalizacionHuertos > 0) {
        this.reputation -= penalizacionHuertos;
        this.dailyStats.repChange -= penalizacionHuertos;
        this.dailyStats.wateringPenalty = penalizacionHuertos; // Lo guardamos para el resumen del dia
      }
    }
  },

  getDailyStars() {
    if (this.dailyStats.served === 0) return 0;
    const ratio = this.dailyStats.good / this.dailyStats.served;
    return Math.round(ratio * 5);
  },

  getReputationHearts() {
    const maxRep = 100;
    const clampedRep = Math.max(0, Math.min(this.reputation, maxRep));
    return Math.round((clampedRep / maxRep) * 5);
  },
};

export default GameState;