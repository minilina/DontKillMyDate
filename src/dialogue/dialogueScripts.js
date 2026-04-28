export function splitIntoLines(text, maxLen = 300) {
  if (!text) return [];

  // 1. Limpiamos y convertimos en un array de palabras
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  
  const pages = [];
  let currentPage = "";

  // 2. Vamos metiendo palabras una a una
  for (const word of words) {
    // Probamos si la palabra cabe en la página actual
    const candidate = currentPage ? `${currentPage} ${word}` : word;
    
    // Si el texto acumulado supera los 145 caracteres, cerramos página.
    // 145 caracteres son unas 3 lineas y media en tu UI, lo justo para no salirse.
    if (candidate.length > maxLen) {
      pages.push(currentPage);
      currentPage = word;
    } else {
      currentPage = candidate;
    }
  }

  // 3. Empujamos lo último que haya quedado
  if (currentPage) {
    pages.push(currentPage);
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