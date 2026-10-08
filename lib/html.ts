/** HTML-escaping helpers for building email bodies from user-supplied input. */

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return entities[character];
  });
}

/** Strips CR/LF so a value cannot inject email headers. */
export function safeEmailSubject(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}
