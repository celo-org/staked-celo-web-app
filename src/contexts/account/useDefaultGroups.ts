import { readContract } from '@wagmi/core';
import { useCallback, useEffect, useState } from 'react';
import { useBlockchain } from 'src/contexts/blockchain/useBlockchain';
import { Option } from 'src/types';
import { readFromCache, writeToCache } from 'src/utils/localSave';
import { Address, useContractRead } from 'wagmi';

const FEW_HOURS = 4 * 60 * 60 * 1000;

const cacheKey = 'defaultGroups';

export default function useDefaultGroups(): { activeGroups: Address[]; error: Option<Error> } {
  const { defaultGroupStrategyContract } = useBlockchain();
  const [activeGroups, setActiveGroups] = useState<Address[]>([]);
  const [error, setError] = useState<Error>();

  const { data: activeGroupsLength } = useContractRead({
    ...defaultGroupStrategyContract,
    functionName: 'getNumberOfGroups',
  });

  const { data: groupsHead } = useContractRead({
    ...defaultGroupStrategyContract,
    functionName: 'getGroupsHead',
  });

  const fetchGroups = useCallback(
    async (key: Address, length: bigint) => {
      const groups: Address[] = [];
      for (let i = 0; i < length; i++) {
        groups.push(key);
        const previousAndNext = await readContract({
          address: defaultGroupStrategyContract.address!,
          abi: defaultGroupStrategyContract.abi,
          functionName: 'getGroupPreviousAndNext',
          args: [key],
        });
        [key] = previousAndNext;
      }

      return groups;
    },
    [defaultGroupStrategyContract]
  );

  useEffect(() => {
    const cachedGroups = readFromCache(cacheKey);
    const shouldRefetch = !(cachedGroups && cachedGroups.ts + FEW_HOURS > Date.now());

    if (!shouldRefetch) {
      setActiveGroups(cachedGroups.data as Address[]);
    } else if (groupsHead && activeGroupsLength) {
      void fetchGroups(groupsHead[0], activeGroupsLength)
        .then((groups) => {
          writeToCache(cacheKey, groups);
          setActiveGroups(groups);
        })
        .catch((err) => {
          setError(err as Error);
        });
    }
  }, [groupsHead, activeGroupsLength]);

  return { activeGroups, error };
}
