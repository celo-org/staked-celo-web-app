import Link from 'next/link';

const navLinks = [
  { label: 'Stake', to: '/', class: 'themed:nav__stake' },
  { label: 'Unstake', to: '/unstake', class: 'themed:nav__unstake' },
];

export const NavBar = ({ pathName }: { pathName: string }) => {
  return (
    <nav className="themed:nav w-full md:w-96">
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
              <hr className={`w-full h-0.5 border-none ${l.class} ${active ? 'active' : ''}`} />
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
