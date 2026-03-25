import Phaser from "phaser";
import Diccionario from "../../assets/json/diccionario.json";

export function generateRandomRequest() {
  // 1. Elegimos las CLAVES lógicas al azar
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

  // Ojo aquí: Una es la raza del que habla, y otra a la que quiere conquistar
  const reqRazaCliente = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.razas_cliente),
  );
  const reqRazaObjetivo = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.razas_objetivo),
  );

  const reqSaludo = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.saludos),
  );

  // 2. Extraemos los TEXTOS literarios basados en esas claves
  const txtSabor = Phaser.Utils.Array.GetRandom(Diccionario.sabores[reqSabor]);
  const txtColor = Phaser.Utils.Array.GetRandom(Diccionario.colores[reqColor]);
  const txtConsist = Phaser.Utils.Array.GetRandom(
    Diccionario.consistencias[reqConsist],
  );
  const txtTemp = Phaser.Utils.Array.GetRandom(
    Diccionario.temperaturas[reqTemp],
  );
  const txtRazaObjetivo = Phaser.Utils.Array.GetRandom(
    Diccionario.razas_objetivo[reqRazaObjetivo],
  );
  const txtSaludo = Phaser.Utils.Array.GetRandom(
    Diccionario.saludos[reqSaludo],
  );
  const txtDespedida = Phaser.Utils.Array.GetRandom(Diccionario.despedidas);

  // Elegimos una plantilla de frase
  const template = Phaser.Utils.Array.GetRandom(Diccionario.templates);

  // 3. Reemplazamos las etiquetas con los textos
  const text = template
    .replace("{raza_objetivo}", txtRazaObjetivo)
    .replace("{color}", txtColor)
    .replace("{sabor}", txtSabor)
    .replace("{consistencia}", txtConsist)
    .replace("{temperatura}", txtTemp)
    .replace("{saludo}", txtSaludo)
    .replace("{despedida}", txtDespedida);

  // 4. Devolvemos el texto formateado Y los requisitos estrictos
  return {
    text,
    requirements: {
      raza: reqRazaCliente, // <- Esta es para tu npcGenerator (su aspecto visual)
      raza_objetivo: reqRazaObjetivo, // <- De aquí el jugador deducirá la Esencia/Olor
      sabor: reqSabor,
      color: reqColor,
      consistencia: reqConsist,
      temperatura: reqTemp,
    },
  };
}
