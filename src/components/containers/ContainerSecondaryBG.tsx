import { PropsWithChildren } from 'react';

export const ContainerSecondaryBG = (props: PropsWithChildren) => {
  return (
    <div className="w-full flex flex-col items-center mt-[24px] bg-secondary p-[8px] rounded-[16px] gap-4">
      {props.children}
    </div>
  );
};
