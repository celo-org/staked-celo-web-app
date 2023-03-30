import { PropsWithChildren } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';

interface LabelProps {
  classes?: string;
  href: string;
}
// TODO hover style
export const LinkOut = ({ children, classes = '', href }: PropsWithChildren<LabelProps>) => {
  return (
    <a
      href={href}
      rel="nofollow noreferrer"
      target="_blank"
      className={`text-[14px] align-middle text-color-callout-modal leading-[16px] font-medium ${classes}`}
    >
      {children}
      &nbsp;
      <ThemedIcon name="caret-purple" alt="" height={12} width={12} classes="rotate-[270deg]" />
    </a>
  );
};
