export function splitIntoLines(text, maxLen = 250) {
  if (!text) return [];

  // 1. Separamos el texto por frases usando puntos, exclamaciones e interrogaciones
  // El "split" mantiene el signo de puntuación al final de la frase
  const phrases = text.replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/);
  
  const pages = [];
  let currentPage = "";

  for (const phrase of phrases) {
    // Si la frase es absurdamente larga (más que el máximo de la caja ella sola)
    // tenemos que cortarla por palabras obligatoriamente para que no rompa la UI
    if (phrase.length > maxLen) {
      if (currentPage) pages.push(currentPage.trim());
      
      const words = phrase.split(" ");
      let tempLine = "";
      for (const w of words) {
        if ((tempLine + " " + w).length > maxLen) {
          pages.push(tempLine.trim());
          tempLine = w;
        } else {
          tempLine = tempLine ? `${tempLine} ${w}` : w;
        }
      }
      currentPage = tempLine;
      continue;
    }

    // LÓGICA "TODO O NADA"
    // Calculamos cómo quedaría la página si añadiéramos la frase siguiente
    const testPage = currentPage ? `${currentPage} ${phrase}` : phrase;

    if (testPage.length <= maxLen) {
      // SI CABE: La añadimos y seguimos acumulando
      currentPage = testPage;
    } else {
      // NO CABE: Guardamos la página actual y mandamos la frase ENTERA a la siguiente
      if (currentPage) {
        pages.push(currentPage.trim());
      }
      currentPage = phrase;
    }
  }

  // Guardamos lo que haya quedado en la última página
  if (currentPage) {
    pages.push(currentPage.trim());
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