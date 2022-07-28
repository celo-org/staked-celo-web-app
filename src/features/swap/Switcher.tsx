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
    <div className="flex justify-center py-3">
      <nav className="w-full md:w-96">
        <ul className="flex items-center justify-start list-none overflow-hidden opacity-90 mr-3">
          {navLinks.map((l) => {
            const active = pathName === l.to;
            const sizing = `py-1.5`;
            const colors = `text-lg font-base ${active ? 'font-medium' : 'font-light'}`;
            const className = `${sizing} ${colors}`;
            return (
              <li key={l.label} className="flex flex-col items-center justify-center mx-4">
                <Link href={l.to}>
                  <a className={className}>{l.label}</a>
                </Link>
                <hr className={`w-full h-0.5 border-none ${active ? l.activeClass : ''}`} />
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
