import { CeloChains } from '@celo/rainbowkit-celo';
import { PropsWithChildren } from 'react';
import { ThemedIcon } from 'src/components/icons/ThemedIcon';
import { Modal } from 'src/components/modals/Modal';
import { useChainId, useSwitchNetwork } from 'wagmi';

interface ModalProps {
  highlighted: boolean;
  isLoading: boolean;
  onClick: () => void;
}

const NetworkRow = ({
  highlighted,
  isLoading,
  onClick,
  children,
}: PropsWithChildren<ModalProps>) => {
  const layoutStyles =
    'list-none flex flex-initial flex-row justify-between items-center max-w-full';
  const spacingStyles = 'py-2 px-4 w-full';
  const styleStyles = 'bg-primary rounded-lg cursor-pointer';
  const highLightedStyles = 'border border-solid border-color-tertiary-callout';

  return (
    <li
      className={`${layoutStyles} ${spacingStyles} ${styleStyles} ${
        highlighted ? highLightedStyles : ''
      }`}
      onClick={highlighted ? undefined : onClick}
    >
      <span>{children}</span>
      <span className={`flex flex-initial flex-shrink-0 flex-row items-center gap-2`}>
        {highlighted && (
          <div className="flex flex-row items-center gap-2">
            <span>Connected</span>
            <div>
              <div className="rounded-full border-4 border-solid border-color-tertiary-callout" />
            </div>
          </div>
        )}
        {isLoading && (
          <div className="flex flex-row items-center gap-2">
            <span>Confirm in Wallet</span>
            <div>
              <div className="rounded-full border-4 border-solid border-color-secondary-callout" />
            </div>
          </div>
        )}
      </span>
    </li>
  );
};

export const NetworkSwitcherModal = ({ isOpen, close }: { isOpen: boolean; close: () => void }) => {
  const chainId = useChainId();
  const { switchNetwork, isLoading, pendingChainId } = useSwitchNetwork({
    onSuccess() {
      close();
    },
  });
  const title = 'Switch Network';

  return (
    <Modal isOpen={isOpen} screenReaderLabel={title} close={close}>
      <div className="flex flex-col bg-secondary text-color-primary p-[24px]">
        <div className="flex justify-between items-center text-[20px] leading-[24px] mb-[32px]">
          {title}
          <div className="cursor-pointer bg-tertiary rounded-full flex center p-1">
            <ThemedIcon name="close" alt="Dismiss" width={24} height={24} />
          </div>
        </div>
        <div className="font-normal mb-[24px] text-[16px] leading-[24px]">
          <ul className="flex flex-col gap-4 items-center w-full">
            {[CeloChains.Celo, CeloChains.Alfajores].map((chain) => (
              <NetworkRow
                key={chain.id}
                highlighted={chainId === chain.id}
                isLoading={isLoading && pendingChainId === chain.id}
                onClick={() => switchNetwork?.(chain.id)}
              >
                <span>{chain.name}</span>
              </NetworkRow>
            ))}
          </ul>
        </div>
      </div>
    </Modal>
  );
};
