import { Celo } from '@celo/rainbowkit-celo/chains';
import { useMemo } from 'react';
import { LinkOut } from 'src/components/text/LinkOut';
import { SPECIFIC_GROUP_STRATEGY_MAINNET_ADDRESS } from 'src/config/consts';
import { useAccountContext } from 'src/contexts/account/AccountContext';
import { ValidatorGroupRow } from 'src/features/validators/components/ValidatorGroupRow';
import { ValidatorGroup } from 'src/features/validators/data/fetchValidGroups';
import { CenteredLayout } from 'src/layout/CenteredLayout';
import chainIdToChain from 'src/utils/chainIdToChain';
import { useChainId } from 'wagmi';

interface ValidatorsProps {
  list: ValidatorGroup[];
}

const defaultStrategy: ValidatorGroup = {
  name: 'Default Strategy',
  address: '0x0000000000000000000000000000000000000000',
};

export const Validators = ({ list }: ValidatorsProps) => {
  const { strategy } = useAccountContext();

  const fullList = useMemo(() => {
    return [
      defaultStrategy,
      ...list.sort((a, b) => {
        return a.address === strategy ? -1 : b.address === strategy ? -1 : 0;
      }),
    ];
  }, [list, strategy]);

  const chainId = useChainId();
  const chain = chainIdToChain(chainId);

  // It means the contracts aren't deployed yet
  if (SPECIFIC_GROUP_STRATEGY_MAINNET_ADDRESS === '' && chain === Celo) {
    return (
      <CenteredLayout>
        <div className="inline text-[16px]">
          This is where you'll be select which validator group will be voting on your behalf when
          the contracts are deployed on Mainnet.
          <br />
          You can{' '}
          <LinkOut href="https://github.com/celo-org/staked-celo/issues/131" classes="text-[16px]">
            follow the progress here
          </LinkOut>
        </div>
      </CenteredLayout>
    );
  }

  return (
    <ul className="flex flex-col justify-center w-full bg-secondary mt-[24px] p-2 rounded-[16px] gap-2">
      {fullList.map((vg) => (
        <ValidatorGroupRow
          key={vg.address}
          name={vg.name}
          groupAddress={vg.address}
          isCurrentStrategy={vg.address.toLowerCase() === strategy?.toLowerCase()}
        />
      ))}
    </ul>
  );
};
