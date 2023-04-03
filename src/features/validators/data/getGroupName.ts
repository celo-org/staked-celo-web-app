import { newKit } from '@celo/contractkit';
import { Mainnet } from '@celo/react-celo';

export default async function getGroupName(address: string): Promise<string> {
  const kit = newKit(Mainnet.rpcUrl);

  const validatorWrapper = await kit.contracts.getValidators();

  const group = await validatorWrapper.getValidatorGroup(address, false);

  return group.name;
}
