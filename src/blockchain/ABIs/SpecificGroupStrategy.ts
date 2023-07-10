const SpecificGroupStrategyABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
  {
    inputs: [],
    name: 'AddressZeroNotAllowed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerNotManager',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'CantWithdrawAccordingToStrategy',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'FailedToAddGroup',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'FailedToBlockGroup',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'FailedToUnblockGroup',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'GroupAlreadyBlocked',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'GroupBalanced',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'GroupNotBalanced',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'GroupNotEligible',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'GroupNotOverflowing',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'GroupStillOverflowing',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoActiveGroups',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoGroups',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NullAddress',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'GroupBlocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'GroupUnblocked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
    ],
    name: 'ManagerSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'account',
    outputs: [
      {
        internalType: 'contract IAccount',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'blockGroup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultStrategy',
    outputs: [
      {
        internalType: 'contract IDefaultStrategy',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'celoAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stCeloAmount',
        type: 'uint256',
      },
    ],
    name: 'generateDepositVoteDistribution',
    outputs: [
      {
        internalType: 'address[]',
        name: 'finalGroups',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'finalVotes',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'celoWithdrawalAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stCeloWithdrawalAmount',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'isTransfer',
        type: 'bool',
      },
    ],
    name: 'generateWithdrawalVoteDistribution',
    outputs: [
      {
        internalType: 'address[]',
        name: 'groups',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'votes',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getBlockedGroup',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNumberOfBlockedGroups',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNumberOfVotedGroups',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'getStCeloInGroup',
    outputs: [
      {
        internalType: 'uint256',
        name: 'total',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'overflow',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'unhealthy',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVersionNumber',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getVotedGroup',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'groupHealth',
    outputs: [
      {
        internalType: 'contract IGroupHealth',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'isBlockedGroup',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'isVotedGroup',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'manager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'rebalanceOverflowedGroup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'rebalanceWhenHealthChanged',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_groupHealth',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_defaultStrategy',
        type: 'address',
      },
    ],
    name: 'setDependencies',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
    ],
    name: 'setManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'stCeloInGroup',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalStCeloLocked',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalStCeloOverflow',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalStCeloUnhealthy',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'unblockGroup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_logic',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    stateMutability: 'payable',
    type: 'constructor',
  },
] as const;

export default SpecificGroupStrategyABI;
