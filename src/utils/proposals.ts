import matter from 'gray-matter';

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
  try {
    // Note: the typings seem out of date and don't reference the existing `isEmpty` prop
    // which is true if the front-matter couldn't be parsed
    const parsed = matter(markdown) as matter.GrayMatterFile<string> & { isEmpty: boolean };

    if (parsed.isEmpty) return null;

    const data = {} as ParsedYAML;
    Object.keys(parsed.data).forEach((key) => {
      const newKey = camelCasesify(key) as keyof ParsedYAML;

      data[newKey] = parsed.data[key] ?? '';
      if (typeof data[newKey] === 'object') {
        data[newKey] = parsed.data[newKey].toString();
      }
    });

    return data;
  } catch (error) {
    console.error('Couldnt parse YAML', error);
    return null;
  }
}

export function getRawGithubUrl(descriptionURL: string) {
  return descriptionURL.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
}
