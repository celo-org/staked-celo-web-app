import Link from 'next/link';

const navLinks = [
  { label: 'Stake', to: '/' },
  { label: 'Unstake', to: '/unstake' },
];

export const NavBar = ({ pathName }: { pathName: string }) => {
  return (
    <nav className="w-full md:w-96">
      <ul className="flex items-center justify-start list-none overflow-hidden opacity-90 mr-3">
        {navLinks.map((l, i) => {
          const active = pathName === l.to;
          const sizing = `py-1.5`;
          const colors = `text-white text-lg font-base ${active ? 'font-medium' : 'font-light'}`;
          const className = `${sizing} ${colors}`;
          return (
            <li key={l.label} className="flex flex-col items-center justify-center mx-4">
              <Link href={l.to}>
                <a className={className}>{l.label}</a>
              </Link>
              <hr
                className={`w-full h-0.5 border-none ${
                  active && (i === 0 ? 'bg-purple' : 'bg-orange')
                }`}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
