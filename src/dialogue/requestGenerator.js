import Phaser from "phaser";
import Diccionario from "../../assets/json/diccionario.json";

export function generateRandomRequest() {
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

  const txtSabor = Phaser.Utils.Array.GetRandom(Diccionario.sabores[reqSabor]);
  const txtColor = Phaser.Utils.Array.GetRandom(Diccionario.colores[reqColor]);
  const txtConsist = Phaser.Utils.Array.GetRandom(
    Diccionario.consistencias[reqConsist],
  );
  const txtTemp = Phaser.Utils.Array.GetRandom(
    Diccionario.temperaturas[reqTemp],
  );
  const txtFrasco = Phaser.Utils.Array.GetRandom(
    Diccionario.formas_frasco[reqFrasco],
  );
  const txtRazaObjetivo = Phaser.Utils.Array.GetRandom(
    Diccionario.razas_objetivo[reqRazaObjetivo],
  );
  const txtSaludo = Phaser.Utils.Array.GetRandom(
    Diccionario.saludos[reqSaludo],
  );
  const txtDespedida = Phaser.Utils.Array.GetRandom(Diccionario.despedidas);

  const template = Phaser.Utils.Array.GetRandom(Diccionario.templates);

  // Envolvemos en asteriscos (*) las palabras clave para que la UI sepa animarlas
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
    // ¡NUEVO! Aquí se guardan las palabras sin asteriscos para tu papel de cocina
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

export function processScriptedDialogue(specialData) {
  const reqs = specialData.requirements;

  // 1. Buscamos un sinónimo aleatorio basado ESTRICTAMENTE en lo que pide el NPC
  const txtSabor = Phaser.Utils.Array.GetRandom(
    Diccionario.sabores[reqs.sabor],
  );
  const txtColor = Phaser.Utils.Array.GetRandom(
    Diccionario.colores[reqs.color],
  );
  const txtConsist = Phaser.Utils.Array.GetRandom(
    Diccionario.consistencias[reqs.consistencia],
  );
  const txtTemp = Phaser.Utils.Array.GetRandom(
    Diccionario.temperaturas[reqs.temperatura],
  );
  const txtFrasco = Phaser.Utils.Array.GetRandom(
    Diccionario.formas_frasco[reqs.forma_frasco],
  );
  const txtRazaObjetivo = Phaser.Utils.Array.GetRandom(
    Diccionario.razas_objetivo[reqs.raza_objetivo],
  );

  // 2. Reemplazamos las etiquetas en sus líneas de diálogo
  const processedLines = specialData.dialogue.map((line) => {
    return line
      .replace("{raza_objetivo}", txtRazaObjetivo)
      .replace("{color}", txtColor)
      .replace("{sabor}", txtSabor)
      .replace("{consistencia}", txtConsist)
      .replace("{temperatura}", txtTemp)
      .replace("{forma_frasco}", txtFrasco);
  });

  // 3. Devolvemos los requisitos originales, las palabras literales nuevas, y el diálogo procesado
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