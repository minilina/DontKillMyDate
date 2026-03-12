import Phaser from "phaser";
import Diccionario from "./diccionario.json";

export function generateRandomRequest() {
  const reqSabor = Phaser.Utils.Array.GetRandom(Object.keys(Diccionario.sabores));
  const reqColor = Phaser.Utils.Array.GetRandom(Object.keys(Diccionario.colores));
  const reqConsist = Phaser.Utils.Array.GetRandom(
    Object.keys(Diccionario.consistencias)
  );
  const reqRaza = Phaser.Utils.Array.GetRandom(Object.keys(Diccionario.razas));
  const reqSaludo = Phaser.Utils.Array.GetRandom(Object.keys(Diccionario.saludos));

  const txtSabor = Phaser.Utils.Array.GetRandom(Diccionario.sabores[reqSabor]);
  const txtColor = Phaser.Utils.Array.GetRandom(Diccionario.colores[reqColor]);
  const txtConsist = Phaser.Utils.Array.GetRandom(
    Diccionario.consistencias[reqConsist]
  );
  const txtRaza = Phaser.Utils.Array.GetRandom(Diccionario.razas[reqRaza]);

  // saludos: ojo que es un objeto (neutro/educado/...), primero eliges la "categoría"
  const txtSaludo = Phaser.Utils.Array.GetRandom(Diccionario.saludos[reqSaludo]);

  const txtDespedida = Phaser.Utils.Array.GetRandom(Diccionario.despedidas);

  // Plantillas: ahora vienen del JSON (en vez de const Templates en JS)
  const template = Phaser.Utils.Array.GetRandom(Diccionario.templates);

  const text = template
    .replace("{raza}", txtRaza)
    .replace("{color}", txtColor)
    .replace("{sabor}", txtSabor)
    .replace("{consistencia}", txtConsist)
    .replace("{saludo}", txtSaludo)
    .replace("{despedida}", txtDespedida);

  return {
    text,
    requirements: {
      sabor: reqSabor,
      color: reqColor,
      consistencia: reqConsist,
      raza: reqRaza,
      saludo: reqSaludo
    }
  };
}