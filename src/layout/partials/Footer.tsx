import Image from 'next/image';
import Link from 'next/link';
import Discord from 'src/images/icons/discord.svg';
import Github from 'src/images/icons/github.svg';
import Twitter from 'src/images/icons/twitter.svg';

export const Footer = () => {
  return (
    <footer className="w-screen bg-gray-800 text-gray-100 flex flex-col p-7 md:flex-row md:justify-between">
      <div className="mt-2 flex flex-col md:order-first">
        <span className="text-l font-light">Total CELO staked</span>
        <span className="text-xl">1,234,567.89</span>
      </div>

      <ul className="my-4 underline md:order-last">
        <li className="my-3">
          <Link href="/faq">FAQ</Link>
        </li>
        <li className="my-3">
          <Link href="/docs">DOCS</Link>
        </li>
      </ul>

      <ul className="flex mt-4 md:order-2">
        <li className="mx-2">
          <a href="/twitter">
            <Image src={Twitter} alt="Twitter logo" quality={100} width={40} height={40} />
          </a>
        </li>
        <li className="mx-2">
          <a href="/discord">
            <Image src={Discord} alt="Discord logo" quality={100} width={40} height={40} />
          </a>
        </li>
        <li className="mx-2">
          <a href="/github">
            <Image src={Github} alt="Github logo" quality={100} width={40} height={40} />
          </a>
        </li>
      </ul>

      <span className="mt-3 w-44 md:order-last">Open source Apache 2 © 2022 cLabs, Inc.</span>
    </footer>
  );
};
