// 1. DEPENDENCIAS DE PIEL (Cuerpo, Orejas, Boca y Nariz van siempre juntos)
const TONOS_PIEL = [
  {
    base: "cuerpo_1",
    orejas: "orejas_1_ninfa_elfo_hada",
    boca: "boca_normal_1",
    nariz: "nariz_1",
  },
  {
    base: "cuerpo_2",
    orejas: "orejas_2_ninfa_elfo_hada",
    boca: "boca_normal_2",
    nariz: "nariz_2",
  },
  {
    base: "cuerpo_3",
    orejas: "orejas_3_ninfa_elfo_hada",
    boca: "boca_normal_3",
    nariz: "nariz_3",
  },
];

// 2. DEPENDENCIAS DE COLOR (El color de pelo dicta el color de la cola)
const COLORES_MAGICOS = [
  {
    pelos: ["pelo_1_azul", "pelo_2_azul", "pelo_3_azul"],
    cola: "kitsune_feautures_azul",
  },
  {
    pelos: ["pelo_1_negro", "pelo_2_negro", "pelo_3_negro"],
    cola: "kitsune_feautures_negro",
  },
  {
    pelos: ["pelo_1_rojo", "pelo_2_rojo", "pelo_3_rojo"],
    cola: "kitsune_feautures_rojol",
  },
  {
    pelos: ["pelo_1_rosa", "pelo_2_rosa", "pelo_3_rosa"],
    cola: "kitsune_feautures_rosa",
  },
  {
    pelos: ["pelo_1_rubiol", "pelo_2_rubio", "pelo_3_rubio"],
    cola: "kitsune_feautures_rubiol",
  },
  {
    pelos: ["pelo_1_verde", "pelo_2_verde", "pelo_3_verde"],
    cola: "kitsune_feautures_verde",
  },
];

// 3. ELEMENTOS UNIVERSALES
const UNIVERSAL_EYES = [
  "ojos_amarillos",
  "ojos_azules",
  "ojos_marrones",
  "ojos_rojos",
  "ojos_rosas",
  "ojos_verdes",
];

export default class NPCGenerator {
  static generateLooks(raza) {
    // Función auxiliar para elegir al azar
    const pickRandom = (array) =>
      array[Math.floor(Math.random() * array.length)];

    // 1. ELEGIMOS EL ADN BÁSICO DEL PERSONAJE
    let adnPiel = pickRandom(TONOS_PIEL);
    let adnColor = pickRandom(COLORES_MAGICOS);

    // 2. CONSTRUIMOS EL ASPECTO BASE
    let aspecto = {
      base: adnPiel.base,
      boca: adnPiel.boca,
      nariz: adnPiel.nariz,
      orejas: null,
      ojos: pickRandom(UNIVERSAL_EYES),
      pelo: pickRandom(adnColor.pelos), // Elegimos un peinado del color seleccionado
      rasgoDetras: null,
      rasgoFrente: null,
    };

    // 3. APLICAMOS LAS REGLAS DE LA RAZA
    switch (raza) {
      case "humanos":
        break;

      case "elfos":
        aspecto.orejas = adnPiel.orejas;
        break;

      case "ninfas":
        aspecto.orejas = adnPiel.orejas; // Tienen sus orejas
        aspecto.rasgoFrente = "ninfa_feautures"; // Y ADEMÁS sus hojas encima
        break;

      case "kitsunes":
        aspecto.rasgoDetras = adnColor.cola;
        break;

      case "hadas":
        aspecto.orejas = adnPiel.orejas; // Tienen sus orejas
        aspecto.rasgoDetras = "hada_feautures"; // Y sus alas detrás
        break;
    }

    // Devolvemos el personaje perfectamente coordinado
    return aspecto;
  }
}