import Link from 'next/link';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Label } from 'src/components/text/Label';
import {
  discordUrl,
  docsUrl,
  githubIssuesUrl,
  githubUrl,
  privacyUrl,
  twitterUrl,
} from 'src/config/externalUrls';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';

export const Footer = () => {
  const { totalCeloBalance } = useProtocolContext();

  const footerFlexClasses = 'flex flex-col sm:flex-row sm:items-center sm:justify-between';
  return (
    <footer className={`w-full ${footerFlexClasses} p-base sm:h-[180px] bg-secondary`}>
      <div className="flex flex-col sm:h-[100%] justify-between items-start mb-[16px] sm:mb-0">
        <div className="flex flex-col sm:mb-0 mb-[32px]">
          <Label classes="mb-[4px]">Total CELO staked</Label>
          <span className="text-[27px] leading-[40px]">{totalCeloBalance.displayAsBase()}</span>
        </div>
        <FAQLinks classes="mb-[64px] sm:hidden" />
        <div className="inline-flex">
          <SocialMediaLink type="twitter" url={twitterUrl} classes="mr-[16px]" />
          <SocialMediaLink type="discord" url={discordUrl} classes="mr-[16px]" />
          <SocialMediaLink type="github" url={githubUrl} />
        </div>
      </div>
      <div className="sm:h-[100%] text-[16px] leading-[24px] font-normal sm:text-right">
        <FAQLinks classes="hidden sm:flex flex-row justify-end mb-[24px]" />
        Open source Apache 2 <br /> © 2022 cLabs, Inc.
      </div>
    </footer>
  );
};

interface FAQLinksProps {
  classes: string;
}

const FAQLinks = ({ classes }: FAQLinksProps) => {
  const linkPositionClasses = 'sm:mb-0 mb-[16px] sm:mr-[24px]';
  return (
    <div className={`text-[18px] leading-[32px] font-medium underline ${classes}`}>
      <div className={linkPositionClasses}>
        <a href={githubIssuesUrl} target="_blank" rel="noreferrer">
          Bugs and feature requests
        </a>
      </div>
      <div className={linkPositionClasses}>
        <Link href="/faq">FAQ</Link>
      </div>
      <div className={linkPositionClasses}>
        <a href={docsUrl} target="_blank" rel="noreferrer">
          Docs
        </a>
      </div>
      <div className={linkPositionClasses}>
        <a href={privacyUrl} target="_blank" rel="noreferrer">
          Privacy
        </a>
      </div>
      <div>
        <Link href="/terms">Terms</Link>
      </div>
    </div>
  );
};

interface SocialMediaLinkProps {
  type: 'github' | 'twitter' | 'discord';
  url: string;
  classes?: string;
}

const SocialMediaLink = ({ type, url, classes = '' }: SocialMediaLinkProps) => {
  return (
    <a
      className={`inline-flex w-[40px] h-[40px] sm:w-[32px] sm:h-[32px] ${classes}`}
      href={url}
      target="_blank"
      rel="noreferrer"
    >
      <ThemedIcon name={type} alt={type} quality={100} fill />
    </a>
  );
};
