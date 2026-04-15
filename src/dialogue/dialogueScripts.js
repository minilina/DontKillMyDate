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