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