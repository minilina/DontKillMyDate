export function splitIntoLines(text) {
  if (!text) return [];

  // 1. Separamos el texto por frases usando puntos, exclamaciones e interrogaciones
  // El "split" mantiene el signo de puntuación al final de la frase
  const phrases = text
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?…])\s+/);

  const pages = [];

  // 2. Metemos cada frase limpia directamente como una página nueva
  // Así forzamos a que el jugador tenga que hacer un click por cada frase
  for (const phrase of phrases) {
    if (phrase.trim().length > 0) {
      pages.push(phrase.trim());
    }
  }

  return pages;
}


/**
 * Construye un diálogo completo (varias líneas) a partir de un request procedural.
 */
export function buildDialogueFromRequest(request) {
  const orderLines = splitIntoLines(request.text);

  return {
    lines: orderLines,
  };
}