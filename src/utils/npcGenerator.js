import NPCParts from "../../assets/json/npc_parts.json";

export default class NPCGenerator {
  static generateLooks(raza) {
    // Función auxiliar para elegir al azar
    const pickRandom = (array) =>
      array[Math.floor(Math.random() * array.length)];

    // 1. ELEGIMOS EL ADN BÁSICO DEL PERSONAJE desde el JSON
    let adnPiel = pickRandom(NPCParts.TONOS_PIEL);
    let adnColor = pickRandom(NPCParts.COLORES_MAGICOS);

    // 2. CONSTRUIMOS EL ASPECTO BASE
    let aspecto = {
      base: adnPiel.base,
      boca: adnPiel.boca,
      nariz: adnPiel.nariz,
      orejas: null,
      ojos: pickRandom(NPCParts.UNIVERSAL_EYES),
      cejas: adnColor.cejas,
      pelo: pickRandom(adnColor.pelos), // Elegimos un peinado del color seleccionado
      ropa: null,
      rasgoDetras: null,
      rasgoFrente: null,
    };

    // 3. APLICAMOS LAS REGLAS DE LA RAZA
    switch (raza) {
      case "humanos":
        aspecto.ropa = "ropa_humano";
        break;

      case "elfos":
        aspecto.orejas = adnPiel.orejas_elfo_hada;
        aspecto.ropa = "ropa_elfo";
        break;

      case "ninfas":
        aspecto.orejas = adnPiel.orejas_ninfa; // Tienen sus orejas
        aspecto.rasgoFrente = "ninfa_feautures";
        aspecto.ropa = "ropa_ninfa";
        break;

      case "kitsunes":
        aspecto.rasgoDetras = adnColor.cola;
        aspecto.ropa = "ropa_kitsune";
        break;

      case "hadas":
        aspecto.orejas = adnPiel.orejas_elfo_hada; // Tienen sus orejas
        aspecto.rasgoDetras = "hada_feautures"; // Y sus alas detrás
        aspecto.ropa = "ropa_hada";
        break;

      case "gnomos":
        aspecto.ropa = "ropa_gnomo";
        aspecto.rasgoFrente = "gnomo_features";
        break;
    }

    // Devolvemos el personaje perfectamente coordinado
    return aspecto;
  }
}