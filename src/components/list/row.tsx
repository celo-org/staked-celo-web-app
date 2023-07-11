import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';

interface Props {
  name: string;
  nameClasses?: string;
  highlighted?: boolean;
  href: string;
}

export const Row = (props: PropsWithChildren<Props>) => {
  const layoutStyles =
    'list-none flex flex-initial flex-row justify-between items-center max-w-full';
  const spacingStyles = 'gap-5 py-1 px-2';
  const styleStyles = 'bg-primary rounded-lg';
  const highLightedStyles = 'border border-solid border-color-tertiary-callout';
  return (
    <li
      className={`${layoutStyles} ${spacingStyles} ${styleStyles} ${
        props.highlighted ? highLightedStyles : ''
      }`}
    >
      {props.highlighted && (
        <span className="absolute -translate-x-8 w-1 h-1 rounded-full border-4 border-solid border-color-tertiary-callout" />
      )}
      <span className={`truncate ${props.nameClasses || ''}`}>{props.name}</span>
      <span className={`flex flex-initial flex-shrink-0 flex-row items-center gap-2`}>
        {props.children}
        <Link
          href={props.href}
          target={props.href?.startsWith('http') ? '_blank' : '_self'}
          rel="noreferrer"
        >
          <ThemedIcon name="arrow" alt="open" classes="rotate-[270deg] cursor-pointer" />
        </Link>
      </span>
    </li>
  );
};
