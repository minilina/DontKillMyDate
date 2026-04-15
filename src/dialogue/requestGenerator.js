import Phaser from "phaser";
import Diccionario from "../../assets/json/diccionario.json";

export function generateRandomRequest(difficulty = "facil") {
  const reqSabor = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.sabores),
  );
  const reqColor = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.colores),
  );
  const reqConsist = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.consistencias),
  );
  const reqTemp = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.temperaturas),
  );
  const reqFrasco = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.formas_frasco),
  );

  const reqRazaCliente = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.razas_cliente),
  );
  const reqRazaObjetivo = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.razas_objetivo),
  );
  const reqSaludo = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.saludos),
  );

  // pista segun dificultad
  const txtSabor = Phaser.Utils.Array.GetRandom(
    Diccionario.sabores[reqSabor][difficulty],
  );
  const txtColor = Phaser.Utils.Array.GetRandom(
    Diccionario.colores[reqColor][difficulty],
  );
  const txtConsist = Phaser.Utils.Array.GetRandom(
    Diccionario.consistencias[reqConsist][difficulty],
  );
  const txtTemp = Phaser.Utils.Array.GetRandom(
    Diccionario.temperaturas[reqTemp][difficulty],
  );
  const txtFrasco = Phaser.Utils.Array.GetRandom(
    Diccionario.formas_frasco[reqFrasco][difficulty],
  );
  const txtRazaObjetivo = Phaser.Utils.Array.GetRandom(
    Diccionario.razas_objetivo[reqRazaObjetivo][difficulty],
  );

  // Estos no tienen dificultad en el diccionario
  const txtSaludo = Phaser.Utils.Array.GetRandom(
    Diccionario.saludos[reqSaludo],
  );
  const txtDespedida = Phaser.Utils.Array.GetRandom(Diccionario.despedidas);


  const template = Phaser.Utils.Array.GetRandom(Diccionario.templates[difficulty],);

  // los * son para marcar dnd van las animaciones
  const text = template
    .replace("{raza_objetivo}", `*${txtRazaObjetivo}*`)
    .replace("{color}", `*${txtColor}*`)
    .replace("{sabor}", `*${txtSabor}*`)
    .replace("{consistencia}", `*${txtConsist}*`)
    .replace("{temperatura}", `*${txtTemp}*`)
    .replace("{forma_frasco}", `*${txtFrasco}*`)
    .replace("{saludo}", txtSaludo)
    .replace("{despedida}", txtDespedida);

  return {
    text,
    requirements: {
      raza: reqRazaCliente,
      raza_objetivo: reqRazaObjetivo,
      sabor: reqSabor,
      color: reqColor,
      consistencia: reqConsist,
      temperatura: reqTemp,
      forma_frasco: reqFrasco,
    },
    literalWords: {
      raza_objetivo: txtRazaObjetivo,
      color: txtColor,
      sabor: txtSabor,
      consistencia: txtConsist,
      temperatura: txtTemp,
      forma_frasco: txtFrasco,
    },
  };
}

export function processScriptedDialogue(specialData, difficulty = "facil") {
  const reqs = specialData.requirements;

  // pista según dificultad 
  const txtSabor = Phaser.Utils.Array.GetRandom(
    Diccionario.sabores[reqs.sabor][difficulty],
  );
  const txtColor = Phaser.Utils.Array.GetRandom(
    Diccionario.colores[reqs.color][difficulty],
  );
  const txtConsist = Phaser.Utils.Array.GetRandom(
    Diccionario.consistencias[reqs.consistencia][difficulty],
  );
  const txtTemp = Phaser.Utils.Array.GetRandom(
    Diccionario.temperaturas[reqs.temperatura][difficulty],
  );
  const txtFrasco = Phaser.Utils.Array.GetRandom(
    Diccionario.formas_frasco[reqs.forma_frasco][difficulty],
  );
  const txtRazaObjetivo = Phaser.Utils.Array.GetRandom(
    Diccionario.razas_objetivo[reqs.raza_objetivo][difficulty],
  );

  // Reemplazamos las etiquetas en sus líneas de diálogo
  const processedLines = specialData.dialogue.map((line) => {
    return line
      .replace("{raza_objetivo}", txtRazaObjetivo)
      .replace("{color}", txtColor)
      .replace("{sabor}", txtSabor)
      .replace("{consistencia}", txtConsist)
      .replace("{temperatura}", txtTemp)
      .replace("{forma_frasco}", txtFrasco);
  });

  return {
    requirements: reqs,
    literalWords: {
      raza_objetivo: txtRazaObjetivo,
      color: txtColor,
      sabor: txtSabor,
      consistencia: txtConsist,
      temperatura: txtTemp,
      forma_frasco: txtFrasco,
    },
    dialogueLines: processedLines,
  };
}
