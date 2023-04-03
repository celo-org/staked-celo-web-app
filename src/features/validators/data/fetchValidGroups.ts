import { newKit } from "@celo/contractkit"
import { Mainnet } from "@celo/react-celo"

export interface ValidatorGroup  {
  name: string
  address: string
}


export default async function fetchValidGroups(): Promise<ValidatorGroup[]> {
  const kit = newKit(Mainnet.rpcUrl);
  const validatorsWrapper = await kit.contracts.getValidators();

  const allPossibleGroups = await validatorsWrapper.getRegisteredValidatorGroups();

  // TODO Filter way block groups and groups with bad health per
  // https://github.com/celo-org/staked-celo/blob/master/contracts/Manager.sol#L348

  return allPossibleGroups.map((validatorGroup) => {
    return {
      name: validatorGroup.name,
      address: validatorGroup.address,
    };
  });
}