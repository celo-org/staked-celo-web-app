import { newKit } from '@celo/contractkit';
import { ChainId } from '@celo/react-celo';
import { ADDRESS_ZERO } from 'src/config/consts';
import chainIdToRPC from 'src/utils/chainIdToRPC';

export default async function getGroupName(chainId: ChainId, address: string): Promise<string> {
  console.info('using', chainId, chainIdToRPC(chainId));
  const kit = newKit(chainIdToRPC(chainId));

  if (address === ADDRESS_ZERO) {
    return 'Default Strategy';
  }

  const validatorWrapper = await kit.contracts.getValidators();

  const group = await validatorWrapper.getValidatorGroup(address, false);

  return group.name;
}
