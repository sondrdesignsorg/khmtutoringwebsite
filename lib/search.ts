export function tokenizeQuery(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

export function matchesAllTerms(
  fields: (string | null | undefined)[],
  query: string,
): boolean {
  const terms = tokenizeQuery(query);
  if (terms.length === 0) return true;
  const haystack = fields.filter(Boolean).join(' ').toLowerCase();
  return terms.every((term) => haystack.includes(term));
}
