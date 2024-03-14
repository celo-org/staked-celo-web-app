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
    return null;
  }
}

export function getRawGithubUrl(descriptionURL: string) {
  return restrictToCeloGovernanceLink(descriptionURL)
    .replace('github.com', 'raw.githubusercontent.com')
    .replace('/blob/', '/');
}

// use governance category of celo forum as fallback url
const GOVERNANCE_URL_FALLBACK = 'https://forum.celo.org/c/governance/12';

export function restrictToCeloGovernanceLink(descriptionURL: string) {
  try {
    // will throw if not a url
    const strictURL = new URL(descriptionURL);
    if (
      strictURL.protocol === 'https:' &&
      strictURL.host === 'github.com' &&
      strictURL.pathname.startsWith('/celo-org/governance/blob/main/CGPs/') &&
      strictURL.pathname.endsWith('.md')
    ) {
      return descriptionURL;
    } else {
      return GOVERNANCE_URL_FALLBACK;
    }
  } catch (e) {
    // TODO should we have a fallback like to the forum?
    return GOVERNANCE_URL_FALLBACK;
  }
}
