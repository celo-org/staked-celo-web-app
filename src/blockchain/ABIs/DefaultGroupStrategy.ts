const DefaultGroupStrategyABI = [
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
        name: 'caller',
        type: 'address',
      },
    ],
    name: 'CallerNotManagerNorStrategy',
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
    name: 'GroupAlreadyAdded',
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
    name: 'GroupNotActive',
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
    name: 'HealthyGroup',
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
    name: 'InvalidFromGroup',
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
    name: 'InvalidToGroup',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoActiveGroups',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotAbleToDistributeVotes',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NotUnsortedGroup',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NullAddress',
    type: 'error',
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
        name: 'actualCelo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expectedCelo',
        type: 'uint256',
      },
    ],
    name: 'RebalanceEnoughStCelo',
    type: 'error',
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
        name: 'actualCelo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expectedCelo',
        type: 'uint256',
      },
    ],
    name: 'RebalanceNoExtraStCelo',
    type: 'error',
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
    name: 'GroupActivated',
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
    name: 'GroupRemoved',
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bool',
        name: 'update',
        type: 'bool',
      },
    ],
    name: 'SortedFlagUpdated',
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
      {
        internalType: 'address',
        name: 'lesser',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'greater',
        type: 'address',
      },
    ],
    name: 'activateGroup',
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
    name: 'deactivateGroup',
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
    name: 'deactivateUnhealthyGroup',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'celoAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'depositGroupToIgnore',
        type: 'address',
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
        internalType: 'uint256',
        name: 'celoAmount',
        type: 'uint256',
      },
    ],
    name: 'generateWithdrawalVoteDistribution',
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
    ],
    name: 'getExpectedAndActualStCeloForGroup',
    outputs: [
      {
        internalType: 'uint256',
        name: 'expectedStCelo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'actualStCelo',
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
    name: 'getGroupPreviousAndNext',
    outputs: [
      {
        internalType: 'address',
        name: 'previousAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'nextAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getGroupsHead',
    outputs: [
      {
        internalType: 'address',
        name: 'head',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'previousAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getGroupsTail',
    outputs: [
      {
        internalType: 'address',
        name: 'tail',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'nextAddress',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNumberOfGroups',
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
    name: 'getNumberOfUnsortedGroups',
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
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getUnsortedGroupAt',
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
    name: 'isActive',
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
    name: 'maxGroupsToDistributeTo',
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
    name: 'maxGroupsToWithdrawFrom',
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
        name: 'fromGroup',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'toGroup',
        type: 'address',
      },
    ],
    name: 'rebalance',
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
        name: '_specificGroupStrategy',
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
        internalType: 'uint256',
        name: 'distributeTo',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'withdrawFrom',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'loopLimit',
        type: 'uint256',
      },
    ],
    name: 'setSortingParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'sorted',
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
    name: 'specificGroupStrategy',
    outputs: [
      {
        internalType: 'contract ISpecificGroupStrategy',
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
    name: 'totalStCeloInStrategy',
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
      {
        internalType: 'address',
        name: 'lesserKey',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'greaterKey',
        type: 'address',
      },
    ],
    name: 'updateActiveGroupOrder',
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

export default DefaultGroupStrategyABI;
