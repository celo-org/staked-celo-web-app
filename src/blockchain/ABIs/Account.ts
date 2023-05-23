const AccountABI = [
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
    name: 'AccountCreationFailed',
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
    name: 'ActivatePendingVotesFailed',
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
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'CeloTransferFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'GroupsAndVotesArrayLengthsMismatch',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'localPendingWithdrawalTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockedGoldPendingWithdrawalTimestamp',
        type: 'uint256',
      },
    ],
    name: 'InconsistentPendingWithdrawalTimestamps',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'localPendingWithdrawalValue',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockedGoldPendingWithdrawalValue',
        type: 'uint256',
      },
    ],
    name: 'InconsistentPendingWithdrawalValues',
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
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'InsufficientRevokableVotes',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
    ],
    name: 'NoScheduledWithdrawal',
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
        internalType: 'uint256',
        name: 'pendingWithdrawalIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pendingWithdrawalsLength',
        type: 'uint256',
      },
    ],
    name: 'PendingWithdrawalIndexTooHigh',
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
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'RevokeActiveFailed',
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
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'RevokePendingFailed',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'sentValue',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expectedValue',
        type: 'uint256',
      },
    ],
    name: 'TotalVotesMismatch',
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
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'VoteFailed',
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
        name: 'celoAvailable',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'celoToWindraw',
        type: 'uint256',
      },
    ],
    name: 'WithdrawalAmountTooHigh',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    name: 'CeloWithdrawalFinished',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawalAmount',
        type: 'uint256',
      },
    ],
    name: 'CeloWithdrawalScheduled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'withdrawalAmount',
        type: 'uint256',
      },
    ],
    name: 'CeloWithdrawalStarted',
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
        indexed: true,
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'VotesScheduled',
    type: 'event',
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
        name: 'voteLesser',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'voteGreater',
        type: 'address',
      },
    ],
    name: 'activateAndVote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'localPendingWithdrawalIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'lockedGoldPendingWithdrawalIndex',
        type: 'uint256',
      },
    ],
    name: 'finishPendingWithdrawal',
    outputs: [
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
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
    name: 'getCeloForGroup',
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
        name: 'beneficiary',
        type: 'address',
      },
    ],
    name: 'getNumberPendingWithdrawals',
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
        name: 'beneficiary',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getPendingWithdrawal',
    outputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
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
        name: 'beneficiary',
        type: 'address',
      },
    ],
    name: 'getPendingWithdrawals',
    outputs: [
      {
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: 'timestamps',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalCelo',
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
        name: '_registry',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_manager',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'pendingWithdrawals',
    outputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'registry',
    outputs: [
      {
        internalType: 'contract IRegistry',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
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
    name: 'scheduleVotes',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: 'groups',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'withdrawals',
        type: 'uint256[]',
      },
    ],
    name: 'scheduleWithdrawals',
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
    name: 'scheduledVotesForGroup',
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
    name: 'scheduledWithdrawalsForGroup',
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
      {
        internalType: 'address',
        name: 'beneficiary',
        type: 'address',
      },
    ],
    name: 'scheduledWithdrawalsForGroupAndBeneficiary',
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
    inputs: [],
    name: 'totalScheduledWithdrawals',
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
        name: 'beneficiary',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'group',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'lesserAfterPendingRevoke',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'greaterAfterPendingRevoke',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'lesserAfterActiveRevoke',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'greaterAfterActiveRevoke',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
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

export default AccountABI;
