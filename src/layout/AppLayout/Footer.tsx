import Link from 'next/link';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Label } from 'src/components/text/Label';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { discordUrl, githubUrl, twitterUrl } from 'src/config/externalUrls';
import { useExchangeContext } from 'src/contexts/exchange/ExchangeContext';

const FAQLinks = () => {
  const textClasses = 'text-[18px] leading-[32px] font-medium underline';
  return (
    <>
      <div className={`${textClasses} md:mb-0 mb-[16px] md:mr-[24px]`}>
        <Link href="/faq">FAQ</Link>
      </div>
      <div className={textClasses}>
        <Link href="/docs">Docs</Link>
      </div>
    </>
  );
};

export const Footer = () => {
  const { totalCeloBalance } = useExchangeContext();

  const footerFlexClasses = 'flex flex-col md:flex-row md:items-center md:justify-between';
  return (
    <footer className={`w-screen ${footerFlexClasses} p-base md:h-[168px] bg-secondary`}>
      <div className="flex flex-col md:order-first mb-[32px] md:mb-0">
        <Label classes="mb-[4px]">Total CELO staked</Label>
        <span className="text-[27px] leading-[40px]">
          {totalCeloBalance.toFixed(DISPLAY_DECIMALS)}
        </span>
      </div>

      <div className="mb-[64px] md:order-last md:hidden">{FAQLinks()}</div>

      <ul className="flex mb-[16px] md:mb-0 md:order-2">
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

      <span className="text-[16px] leading-[24px] font-normal md:order-last md:w-1/5 md:text-right">
        <div className="hidden md:flex flex-row justify-end mb-[24px]">{FAQLinks()}</div>
        Open source Apache 2 <br /> © 2022 cLabs, Inc.
      </span>
    </footer>
  );
};
