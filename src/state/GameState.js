
const GameState = {
  // VARIABLES GLOBALES
  reputation: 50, // reputación inicial
  currentDay: 1,
  currentCustomer: 0, // índice del cliente en la cola
  daysData: null,
  specialNpcsData: null,
  currentPotion: {
    quality: 100,
  },

  // Puntuación que obtiene cada npc scripted para pasarsela al topdown
  specialNpcRecords: {
    elf: null,
    nymph: null,
    gnomo: null,
    fairy: null,
    human: null,
    kitsune: null,
  },

  // Con esta función guardamos la puntuación en el diccionario de arriba
  saveSpecialNpcRecord(npcId, score) {
    if (this.specialNpcRecords[npcId] !== undefined) {
      this.specialNpcRecords[npcId] = score;
    }
  },

  dailyStats: {
    served: 0,
    good: 0,
    bad: 0,
    repChange: 0,
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

  getSpecialNPC(id) {
    return this.specialNpcsData[id];
  },

  prepareNewCustomer() {
    this.currentPotion.quality = 100;
  },

  advanceDay() {
    this.currentDay++;
    this.currentCustomer = 0;

    this.dailyStats = {
      // reiniciamos las stats diarias
      served: 0,
      good: 0,
      bad: 0,
      repChange: 0,
    };
  },

  reducePotionQuality(penalty) {
    this.currentPotion.quality -= penalty;

    if (this.currentPotion.quality < 0) {
      this.currentPotion.quality = 0;
    }
  },

  // función para calcular calidad poción
  evaluatePotion(cauldronPotion, expectedOrder, potionShape) {
    let quality = 100;
    const req = expectedOrder.requirements;

    // diccionario de traducción palabras caldero - palabras json
    const dict = {
      // sabores
      sweet: "dulce",
      bitter: "amargo",
      salty: "salado",
      umami: "umami",
      sour: "acido",
      // colores
      red: "rojo",
      blue: "azul",
      yellow: "amarillo",
      green: "verde",
      orange: "naranja",
      purple: "morado",
      // consistencias
      whole: "entera",
      chopped: "cortada",
      mashed: "machacada",
      // temperaturas
      cold: "frio",
      hot: "calor",
      warm: "tiempo",
      // formas frascos
      Star: "estrella",
      Heart: "corazon",
      Normal: "normal",
    };

    // calculadora de olores (compatiqbilidad razas)
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

    // función para validar categorías que son arrays (sabor, consistencia, olor)
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

    // validar color
    if (req.color) {
      let finalColor = cauldronPotion.color
        ? cauldronPotion.color.replace("Liquid", "")
        : null;
      let translatedColor = dict[finalColor] || finalColor;
      if (translatedColor !== req.color) {
        quality -= 20;
      }
    }

    // validar sabor
    if (req.sabor) {
      checkArrayCategory(cauldronPotion.taste, req.sabor);
    }

    // validar consistencia
    if (req.consistencia) {
      checkArrayCategory(cauldronPotion.consistency, req.consistencia);
    }

    // validar olor / compatibilidad razas
    const probetaRequerida = getExpectedTestTube(req.raza, req.raza_objetivo);
    if (probetaRequerida) {
      checkArrayCategory(cauldronPotion.smell, probetaRequerida);
    }

    // validar temperatura
    if (req.temperatura) {
      let translatedTemp =
        dict[cauldronPotion.temperature] || cauldronPotion.temperature;
      if (translatedTemp !== req.temperatura) {
        quality -= 20;
      }
    }

    // validar forma frasco
    if (req.forma_frasco) {
      let translatedShape = dict[potionShape] || potionShape;
      if (translatedShape !== req.forma_frasco) {
        quality -= 20;
      }
    }

    this.currentPotion.quality = Math.max(0, quality);

    return this.currentPotion.quality;
  },

  // función para entregar poción y actualizar reputación
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

    this.reputation += change;

    if (this.reputation <= 0) {
      this.reputation = 0;
    }

    this.dailyStats.served++; // sumamos un cliente atendido

    if (q >= 50) {
      this.dailyStats.repChange += change; // gurado rep
      this.dailyStats.good++; // sumamos un éxito
    } else {
      this.dailyStats.repChange += change; // guardamos rep
      this.dailyStats.bad++; // sumamos un fallo
    }

    // avanzar al siguiente cliente
    this.currentCustomer++;
  },

  // funciones para el resumen diario
  getDailyStars() {
    if (this.dailyStats.served === 0) return 0;
    const ratio = this.dailyStats.good / this.dailyStats.served;
    return Math.round(ratio * 5);
  },

  getReputationHearts() {
    const maxRep = 100; // lo ajustaremos cd sepamos el maximo real
    const clampedRep = Math.max(0, Math.min(this.reputation, maxRep));
    return Math.round((clampedRep / maxRep) * 5);
  },
};

export default GameState;