import Phaser from "phaser";

// Diccionario completo de expresiones y sinónimos
const Diccionario = {
  sabores: {
    dulce: ["algo dulce", "con un toque azucarado", "que empalague", "con sabor a miel", "bien acaramelado"],
    amargo: ["amargo como la hiel", "con un sabor fuerte y amargo", "nada de dulzuras, lo quiero amargo", "que deje un regusto rudo"],
    salado: ["con un toque de sal", "bien salado", "que sepa a mar", "con ese gusto salobre"],
    picante: ["que queme al tragar", "bien picante", "con fuego en su sabor", "especiado y ardiente", "que haga sudar"],
    acido: ["con un toque ácido", "que haga fruncir el ceño", "avinagrado", "cítrico y punzante"],
  },
  colores: {
    rojo: ["color sangre", "carmesí", "de un tono rojizo", "rojo pasión", "como el fuego"],
    azul: ["azul como el cielo", "de un tono zafiro", "celeste", "azul profundo como el océano", "color cobalto"],
    verde: ["color esmeralda", "verde como el bosque", "de un tono verdoso", "como la hierba fresca"],
    amarillo: ["amarillo brillante", "color oro", "como la luz del sol", "de un tono dorado puro"],
    morado: ["púrpura real", "color amatista", "de un tono violáceo", "morado místico"],
    naranja: ["color atardecer", "de un tono anaranjado", "color cobre", "naranja vibrante"],
    negro: ["como el azabache", "oscuro como la noche", "color carbon", "tono cafe"],
  },
  consistencias: {
    entero: ["entero, ni se te ocurra cortarlo", "de una sola pieza", "intacto", "en su forma natural"],
    picado: ["bien picadito", "cortado en trozos pequeños", "en daditos", "troceado con cuidado"],
    molido: ["hecho polvo", "completamente triturado", "molido hasta que sea arena", "machacado en el mortero"],
  },
  razas: {
    ninfas: ["las ninfas del agua", "las hijas de la naturaleza", "las ninfas de los bosques", "nuestra etérea especie"],
    humanos: ["los simples mortales", "los humanos de la ciudad", "la gente del pueblo", "los de mi condición"],
    kitsunes: ["los espíritus zorro", "los kitsunes", "nuestra mística estirpe", "los zorros de nueve colas"],
    hadas: ["las hadas del claro", "el pueblo feérico", "las criaturas aladas", "la corte de las hadas"],
    gnomos: ["los gnomos de las minas", "mis hermanos gnomos", "nuestro gremio de manitas", "la gente de la tierra"],
    elfos: ["los altos elfos", "mi gente del bosque", "nuestra estirpe élfica", "los guardianes antiguos"],
  },
};

// Plantillas de personalidad (string largo)
const Templates = [
  "He viajado mucho para encontrar esto. Para {raza} es vital una mezcla {color}. Solo asegúrate de que sepa {sabor} y me lo entregues {consistencia}.",
  "Escucha bien, alquimista. No tengo todo el día. Prepárame algo {sabor}, que sea {color}. Y más te vale que esté {consistencia}, {raza} no toleramos errores.",
  "¡Por favor, rápido! Necesito algo {sabor}... tiene que ser {color} o no funcionará. ¡Ah! Y dámelo {consistencia}, es para {raza}, ¡me va la vida en ello!",
  "Buenas. Vengo a pedir un encargo para {raza}. Ya sabes, {color}, un poquito {sabor} y todo {consistencia}. Gracias.",
  "Los astros se alinean y {raza} requerimos de tu arte. Buscamos una esencia {color}, que al paladar resulte {sabor}. Y recuerda, el ingrediente debe presentarse {consistencia}.",
];

/**
 * Genera un pedido (request) con texto procedural + requisitos lógicos
 */
export function generateRandomRequest() {
  const reqSabor = Phaser.Utils.Array.GetRandom(Object.keys(Diccionario.sabores));
  const reqColor = Phaser.Utils.Array.GetRandom(Object.keys(Diccionario.colores));
  const reqConsist = Phaser.Utils.Array.GetRandom(Object.keys(Diccionario.consistencias));
  const reqRaza = Phaser.Utils.Array.GetRandom(Object.keys(Diccionario.razas));

  const txtSabor = Phaser.Utils.Array.GetRandom(Diccionario.sabores[reqSabor]);
  const txtColor = Phaser.Utils.Array.GetRandom(Diccionario.colores[reqColor]);
  const txtConsist = Phaser.Utils.Array.GetRandom(Diccionario.consistencias[reqConsist]);
  const txtRaza = Phaser.Utils.Array.GetRandom(Diccionario.razas[reqRaza]);

  const template = Phaser.Utils.Array.GetRandom(Templates);

  const text = template
    .replace("{raza}", txtRaza)
    .replace("{color}", txtColor)
    .replace("{sabor}", txtSabor)
    .replace("{consistencia}", txtConsist);

  return {
    text,
    requirements: {
      sabor: reqSabor,
      color: reqColor,
      consistencia: reqConsist,
      raza: reqRaza,
    },
  };
}