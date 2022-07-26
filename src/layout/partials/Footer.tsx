import Link from 'next/link';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { discordUrl, githubUrl, twitterUrl } from 'src/config/externalUrls';
import { useExchangeContext } from 'src/providers/ExchangeProvider';

const FAQLinks = () => (
  <>
    <div className="my-3 underline font-medium">
      <Link href="/faq">FAQ</Link>
    </div>
    <div className="my-3 md:ml-5 underline font-medium">
      <Link href="/docs">Docs</Link>
    </div>
  </>
);

export const Footer = () => {
  const { totalCeloBalance } = useExchangeContext();

  return (
    <footer className="c-footer w-screen flex flex-col p-7 md:flex-row md:items-center md:justify-between">
      <div className="mt-2 flex flex-col md:order-first md:w-1/5">
        <span className="text-sm font-semibold">Total CELO staked</span>
        <span className="text-2xl">{totalCeloBalance.toFixed(DISPLAY_DECIMALS)}</span>
      </div>

      <div className="my-4 md:order-last md:hidden">{FAQLinks()}</div>

      <ul className="flex mt-4 md:order-2">
        <li className="mr-2">
          <a href={twitterUrl}>
            <ThemedIcon name="twitter" alt="Twitter logo" quality={100} width={40} height={40} />
          </a>
        </li>
        <li className="mr-2">
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

      <span className="mt-3 w-44 text-sm md:order-last md:w-1/5 md:text-right">
        <div className="hidden md:flex flex-row justify-end">{FAQLinks()}</div>
        Open source Apache 2 <br /> © 2022 cLabs, Inc.
      </span>
    </footer>
  );
};
