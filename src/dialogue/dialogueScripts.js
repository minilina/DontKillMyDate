export function splitIntoLines(text, maxLen = 2000) {
  if (!text) return [];

  // 1. Limpiamos el texto de espacios extra
  const cleanText = text.replace(/\s+/g, " ").trim();

  // 2. IMPORTANTE: No cortamos por frases ni por caracteres.
  // Enviamos el bloque de texto completo. 
  // Phaser (en dialogueUI.js) ya tiene configurado el 'wordWrapWidth: 480',
  // por lo que él solo se encargará de que las palabras bajen de línea.
  
  // Si el texto es extremadamente largo (más de 400 caracteres), 
  // podrías querer dividirlo en dos párrafos, pero para tus tutoriales
  // lo mejor es mandarlo entero y que Phaser lo coloque.
  
  return [cleanText]; 
}




















/*
export function splitIntoLines(text, maxLen = 120) {
  if (!text) return [];

  // Separación por frase
  const raw = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?…])\s+/);

  // Re-empaquetar si alguna frase se pasa de maxLen
  const lines = [];
  for (const phrase of raw) {
    if (phrase.length <= maxLen) {
      lines.push(phrase);
      continue;
    }

    // cortar por palabras si es muy larga
    const words = phrase.split(" ");
    let current = "";
    for (const w of words) {
      const candidate = current ? `${current} ${w}` : w;
      if (candidate.length > maxLen) {
        if (current) lines.push(current);
        current = w;
      } else {
        current = candidate;
      }
    }
    if (current) lines.push(current);
  }

  return lines;
}*/

/**
 * Construye un diálogo completo (varias líneas) a partir de un request procedural.
 */
export function buildDialogueFromRequest(request) {
  const orderLines = splitIntoLines(request.text);

  return {
    lines: orderLines,
  };
}