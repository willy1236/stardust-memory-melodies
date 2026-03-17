export function splitConsecutiveBlockquotes(markdown: string): string {
  // Prevent CommonMark lazy continuation from merging adjacent blockquotes.
  const lines = markdown.split(/\r?\n/);
  const normalized: string[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const current = lines[i];
    const prev = normalized[normalized.length - 1] ?? "";

    const prevIsQuote = /^\s{0,3}>/.test(prev);
    const currentIsQuote = /^\s{0,3}>/.test(current);
    const currentIsBlank = current.trim() === "";

    if (prevIsQuote && !currentIsQuote && !currentIsBlank) {
      normalized.push("");
    }

    normalized.push(current);
  }

  return normalized.join("\n");
}
