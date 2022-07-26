import Image from 'next/image';
import Link from 'next/link';
import { DISPLAY_DECIMALS } from 'src/config/consts';
import { discordUrl, githubUrl, twitterUrl } from 'src/config/externalUrls';
import Discord from 'src/images/icons/discord.svg';
import Github from 'src/images/icons/github.svg';
import Twitter from 'src/images/icons/twitter.svg';
import { useExchangeContext } from 'src/providers/ExchangeProvider';

const FAQLinks = () => (
  <>
    <div className="my-3 underline font-normal">
      <Link href="/faq">FAQ</Link>
    </div>
    <div className="my-3 md:ml-5 underline font-normal">
      <Link href="/docs">Docs</Link>
    </div>
  </>
);

export const Footer = () => {
  const { totalCeloBalance } = useExchangeContext();

  return (
    <footer className="w-screen bg-gray-800 text-gray-100 flex flex-col p-7 md:flex-row md:items-center md:justify-between">
      <div className="mt-2 flex flex-col md:order-first md:w-1/5">
        <span className="text-sm font-light">Total CELO staked</span>
        <span className="text-2xl">{totalCeloBalance.toFixed(DISPLAY_DECIMALS)}</span>
      </div>

      <div className="my-4 md:order-last md:hidden">{FAQLinks()}</div>

      <ul className="flex mt-4 md:order-2">
        <li className="mx-2">
          <a href={twitterUrl}>
            <Image src={Twitter} alt="Twitter logo" quality={100} width={40} height={40} />
          </a>
        </li>
        <li className="mx-2">
          <a href={discordUrl}>
            <Image src={Discord} alt="Discord logo" quality={100} width={40} height={40} />
          </a>
        </li>
        <li className="mx-2">
          <a href={githubUrl}>
            <Image src={Github} alt="Github logo" quality={100} width={40} height={40} />
          </a>
        </li>
      </ul>

      <span className="mt-3 w-44 text-sm font-thin md:order-last md:w-1/5 md:text-right">
        <div className="hidden md:flex flex-row justify-end">{FAQLinks()}</div>
        Open source Apache 2 <br /> © 2022 cLabs, Inc.
      </span>
    </footer>
  );
};
