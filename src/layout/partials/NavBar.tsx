import Link from 'next/link';

const navLinks = [
  { label: 'Stake', to: '/' },
  { label: 'Unstake', to: '/unstake' },
];

export const NavBar = ({ pathName }: { pathName: string }) => {
  return (
    <nav>
      <ul className="flex items-center justify-center list-none rounded-full bg-white shadow-md overflow-hidden opacity-90 mr-3">
        {navLinks.map((l) => {
          const active = pathName === l.to;
          const padding = `py-1.5 px-7`;
          const colors = ` ${active && 'bg-blue-800 text-white rounded-full'} text-lg ${
            active ? 'font-medium' : 'font-base'
          }`;
          const className = `${padding} ${colors}`;
          return (
            <li key={l.label} className="flex items-center justify-center">
              <Link href={l.to}>
                <a className={className}>{l.label}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
