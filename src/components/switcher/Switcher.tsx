import { useState } from 'react';
import useModeChange from 'src/hooks/useModeChange';
import scssTransitions from 'src/styles/transitions.module.scss';
import { Mode } from 'src/types';
const { transitionDuration, transitionTimingFunction } = scssTransitions;

interface Link {
  label: string;
  mode: Mode;
  activeBgClass: string;
}

const links: Link[] = [
  { label: 'Stake', mode: Mode.stake, activeBgClass: 'bg-highlight-primary' },
  { label: 'Unstake', mode: Mode.unstake, activeBgClass: 'bg-highlight-secondary' },
  { label: 'Govern', mode: Mode.governance, activeBgClass: 'bg-action-secondary-callout' },
  { label: 'Vote', mode: Mode.validators, activeBgClass: 'bg-action-secondary-callout' },
];

interface SwitcherProps {
  mode: Mode;
}

export const Switcher = ({ mode }: SwitcherProps) => {
  const [activeLink, setActiveLink] = useState<Link | null>(null);
  const [activeLinkNode, setActiveLinkNode] = useState<HTMLElement | null>(null);
  const onModeChange = useModeChange();

  console.log({ left: activeLinkNode?.offsetLeft, width: activeLinkNode?.offsetWidth });
  return (
    <div className="flex justify-center mb-[8px] ml-[8px]">
      <nav className="w-full">
        <div className="flex items-center justify-start relative opacity-90">
          {links.map((link) => {
            const active = link.mode === mode;
            const className = `text-[18px] leading-[24px] ${
              active ? 'font-medium' : 'font-regular'
            }`;
            return (
              <div
                key={link.label}
                className="flex flex-col items-center justify-center mr-[24px] cursor-pointer"
                onClick={() => onModeChange(link.mode)}
                ref={(linkNode) => {
                  if (!active) return;
                  setActiveLink(link);
                  setActiveLinkNode(linkNode);
                }}
              >
                <span className={className}>{link.label}</span>
              </div>
            );
          })}
          <div
            className={`w-full h-px bottom-[-8px] border-none absolute ${activeLink?.activeBgClass}`}
            style={{
              transition: `all ${transitionDuration} ${transitionTimingFunction}`,
              left: activeLinkNode?.offsetLeft,
              width: activeLinkNode?.offsetWidth,
            }}
          />
        </div>
      </nav>
    </div>
  );
};
