import { PropsWithChildren } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';

interface Props {
  name: string;
  highlighted?: boolean;
  href: string;
}

export const Row = (props: PropsWithChildren<Props>) => {
  const layoutStyles = 'list-none flex flex-initial flex-row justify-between items-center';
  const spacingStyles = 'gap-5  py-1 px-2 my-3 mx-1';
  const styleStyles = 'bg-secondary rounded-lg';
  const highLightedStyles = 'border border-solid border-emerald-200 color-emerald-200';

  return (
    <li
      className={`${layoutStyles} ${spacingStyles} ${styleStyles} ${
        props.highlighted ? highLightedStyles : ''
      }`}
    >
      <span className="truncate">{props.name}</span>
      <span className={`flex flex-initial flex-shrink-0 flex-row items-center gap-2`}>
        {props.children}
        <a
          href={props.href}
          target={props.href?.startsWith('http') ? '_blank' : '_self'}
          rel="noreferrer"
        >
          <ThemedIcon name="arrow" alt="open" classes="rotate-[270deg]" />
        </a>
      </span>
    </li>
  );
};
