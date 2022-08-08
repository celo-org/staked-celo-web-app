import { Mode } from '../types';

interface NavLink {
  label: string;
  mode: Mode;
  activeClass: string;
}

const navLinks: NavLink[] = [
  { label: 'Stake', mode: 'stake', activeClass: 'bg-highlight-primary' },
  { label: 'Unstake', mode: 'unstake', activeClass: 'bg-highlight-secondary' },
];

interface SwitcherProps {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

export const Switcher = ({ mode, onModeChange }: SwitcherProps) => {
  return (
    <div className="flex justify-center mt-[16px] mb-[8px] ml-[8px]">
      <nav className="w-full">
        <ul className="flex items-center justify-start list-none overflow-hidden opacity-90">
          {navLinks.map((l) => {
            const active = l.mode === mode;
            const className = `text-[18px] leading-[24px] ${
              active ? 'font-medium' : 'font-regular'
            }`;
            return (
              <li
                key={l.label}
                className="flex flex-col items-center justify-center mr-[24px] cursor-pointer"
                onClick={() => onModeChange(l.mode)}
              >
                <span className={className}>{l.label}</span>
                <hr className={`w-full h-px mt-[8px] border-none ${active ? l.activeClass : ''}`} />
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
