import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
  { label: 'Stake', to: '/', activeClass: 'bg-highlight-primary' },
  { label: 'Unstake', to: '/unstake', activeClass: 'bg-highlight-secondary' },
];

export const Switcher = () => {
  const router = useRouter();
  const { pathname: pathName } = router;

  return (
    <div className="flex justify-center mt-[16px] mb-[8px]">
      <nav className="w-full">
        <ul className="flex items-center justify-start list-none overflow-hidden opacity-90">
          {navLinks.map((l) => {
            const active = pathName === l.to;
            const className = `text-[18px] leading-[24px] ${
              active ? 'font-medium' : 'font-regular'
            }`;
            return (
              <li key={l.label} className="flex flex-col items-center justify-center mr-[24px]">
                <Link href={l.to}>
                  <a className={className}>{l.label}</a>
                </Link>
                <hr className={`w-full h-px mt-[8px] border-none ${active ? l.activeClass : ''}`} />
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
