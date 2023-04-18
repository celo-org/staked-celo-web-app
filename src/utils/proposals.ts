export function camelCasesify(str: string): string {
  const words = str.split(/\W/g);

  return words.map((x, i) => (i === 0 ? x : x.charAt(0).toUpperCase().concat(x.slice(1)))).join('');
}

export type ParsedYAML = {
  cgp: string;
  title: string;
  dateCreated: string;
  author: string;
  status: string;
  discussionsTo: string;
  governanceProposalId: string;
  dateExecuted: string;
};

export function parsedYAMLFromMarkdown(markdown: string): ParsedYAML | null {
  const parsed = markdown.match(/---(.*?)---/s);
  if (!parsed) {
    return null;
  }
  const rows = parsed[1].split('\n');
  const keyValues = rows
    .map((x) =>
      x
        .split(/(.*?):(.*)/)
        .map((x) => x.trim())
        .filter(Boolean)
    )
    .filter((x) => x.length);

  return keyValues.reduce(
    (acc, [key, value]) => ({
      ...acc,
      [camelCasesify(key)]: value,
    }),
    {} as ParsedYAML
  );
}

export function getRawGithubUrl(descriptionURL: string) {
  return descriptionURL.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
}
