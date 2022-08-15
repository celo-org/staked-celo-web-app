import Link from 'next/link';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Label } from 'src/components/text/Label';
import { discordUrl, docsUrl, githubUrl, twitterUrl } from 'src/config/externalUrls';
import { useProtocolContext } from 'src/contexts/protocol/ProtocolContext';

const FAQLinks = () => {
  const textClasses = 'text-[18px] leading-[32px] font-medium underline';
  return (
    <>
      <div className={`${textClasses} sm:mb-0 mb-[16px] sm:mr-[24px]`}>
        <Link href="/faq">FAQ</Link>
      </div>
      <div className={textClasses}>
        <a href={docsUrl} target="_blank" rel="noreferrer">
          Docs
        </a>
      </div>
    </>
  );
};

export const Footer = () => {
  const { totalCeloBalance } = useProtocolContext();

  const footerFlexClasses = 'flex flex-col sm:flex-row sm:items-center sm:justify-between';
  return (
    <footer className={`w-full ${footerFlexClasses} p-base sm:h-[168px] bg-secondary`}>
      <div className="flex flex-col sm:order-first mb-[32px] sm:mb-0 sm:w-1/3">
        <Label classes="mb-[4px]">Total CELO staked</Label>
        <span className="text-[27px] leading-[40px]">{totalCeloBalance.displayAsBase()}</span>
      </div>

      <div className="mb-[64px] sm:order-last sm:hidden">{FAQLinks()}</div>

      <ul className="flex mb-[16px] sm:mb-0 sm:order-2">
        <li className="mr-[16px]">
          <a href={twitterUrl}>
            <ThemedIcon name="twitter" alt="Twitter logo" quality={100} width={40} height={40} />
          </a>
        </li>
        <li className="mr-[16px]">
          <a href={discordUrl}>
            <ThemedIcon name="discord" alt="Discord logo" quality={100} width={40} height={40} />
          </a>
        </li>
        <li>
          <a href={githubUrl}>
            <ThemedIcon name="github" alt="Github logo" quality={100} width={40} height={40} />
          </a>
        </li>
      </ul>

      <span className="text-[16px] leading-[24px] font-normal sm:order-last sm:w-1/3 sm:text-right">
        <div className="hidden sm:flex flex-row justify-end mb-[24px]">{FAQLinks()}</div>
        Open source Apache 2 <br /> © 2022 cLabs, Inc.
      </span>
    </footer>
  );
};
