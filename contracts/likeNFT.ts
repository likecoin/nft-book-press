import type { Abi } from 'viem'

export const LIKE_NFT_CONTRACT_ADDRESS = '0x1678d667f76439Ce25b327724832D38B6b2Db852'

export const LIKE_NFT_ABI: Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'target',
        type: 'address'
      }
    ],
    name: 'AddressEmptyCode',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'ERC1967InvalidImplementation',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ERC1967NonPayable',
    type: 'error'
  },
  {
    inputs: [],
    name: 'EnforcedPause',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ErrNftClassAlreadyExists',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ErrNftClassNotFound',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ExpectedPause',
    type: 'error'
  },
  {
    inputs: [],
    name: 'FailedCall',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InvalidInitialization',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotInitializing',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'OwnableInvalidOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error'
  },
  {
    inputs: [],
    name: 'UUPSUnauthorizedCallContext',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'slot',
        type: 'bytes32'
      }
    ],
    name: 'UUPSUnsupportedProxiableUUID',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint64',
        name: 'version',
        type: 'uint64'
      }
    ],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Paused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'Unpaused',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address'
      }
    ],
    name: 'Upgraded',
    type: 'event'
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'UPGRADE_INTERFACE_VERSION',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'initialOwner',
        type: 'address'
      }
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'class_id',
            type: 'string'
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'uri',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'uri_hash',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'metadata',
                type: 'string'
              }
            ],
            internalType: 'struct NFTInput',
            name: 'input',
            type: 'tuple'
          }
        ],
        internalType: 'struct MsgMintNFT',
        name: 'msgMintNFT',
        type: 'tuple'
      }
    ],
    name: 'mintNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address'
          },
          {
            components: [
              {
                internalType: 'enum ClassParentType',
                name: 'type_',
                type: 'uint8'
              },
              {
                internalType: 'string',
                name: 'iscn_id_prefix',
                type: 'string'
              }
            ],
            internalType: 'struct ClassParentInput',
            name: 'parent',
            type: 'tuple'
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'symbol',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'description',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'uri',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'uri_hash',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'metadata',
                type: 'string'
              },
              {
                components: [
                  {
                    internalType: 'bool',
                    name: 'burnable',
                    type: 'bool'
                  },
                  {
                    internalType: 'uint64',
                    name: 'max_supply',
                    type: 'uint64'
                  },
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'uint64',
                            name: 'start_time',
                            type: 'uint64'
                          },
                          {
                            internalType: 'string[]',
                            name: 'allowed_addresses',
                            type: 'string[]'
                          },
                          {
                            internalType: 'uint64',
                            name: 'mint_price',
                            type: 'uint64'
                          }
                        ],
                        internalType: 'struct MintPeriod[]',
                        name: 'mint_periods',
                        type: 'tuple[]'
                      },
                      {
                        internalType: 'uint64',
                        name: 'reveal_time',
                        type: 'uint64'
                      }
                    ],
                    internalType: 'struct BlindBoxConfig',
                    name: 'blind_box_config',
                    type: 'tuple'
                  }
                ],
                internalType: 'struct ClassConfig',
                name: 'config',
                type: 'tuple'
              }
            ],
            internalType: 'struct ClassInput',
            name: 'input',
            type: 'tuple'
          }
        ],
        internalType: 'struct MsgNewClass',
        name: 'msgNewClass',
        type: 'tuple'
      },
      {
        internalType: 'string',
        name: 'id',
        type: 'string'
      }
    ],
    name: 'newClass',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address'
          },
          {
            internalType: 'string',
            name: 'class_id',
            type: 'string'
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'symbol',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'description',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'uri',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'uri_hash',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'metadata',
                type: 'string'
              },
              {
                components: [
                  {
                    internalType: 'bool',
                    name: 'burnable',
                    type: 'bool'
                  },
                  {
                    internalType: 'uint64',
                    name: 'max_supply',
                    type: 'uint64'
                  },
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'uint64',
                            name: 'start_time',
                            type: 'uint64'
                          },
                          {
                            internalType: 'string[]',
                            name: 'allowed_addresses',
                            type: 'string[]'
                          },
                          {
                            internalType: 'uint64',
                            name: 'mint_price',
                            type: 'uint64'
                          }
                        ],
                        internalType: 'struct MintPeriod[]',
                        name: 'mint_periods',
                        type: 'tuple[]'
                      },
                      {
                        internalType: 'uint64',
                        name: 'reveal_time',
                        type: 'uint64'
                      }
                    ],
                    internalType: 'struct BlindBoxConfig',
                    name: 'blind_box_config',
                    type: 'tuple'
                  }
                ],
                internalType: 'struct ClassConfig',
                name: 'config',
                type: 'tuple'
              }
            ],
            internalType: 'struct ClassInput',
            name: 'input',
            type: 'tuple'
          }
        ],
        internalType: 'struct MsgUpdateClass',
        name: 'msgUpdateClass',
        type: 'tuple'
      }
    ],
    name: 'updateClass',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
]

export const LIKE_NFT_CONTRACT = {
  address: LIKE_NFT_CONTRACT_ADDRESS,
  abi: LIKE_NFT_ABI
}

export const LIKE_NFT_CLASS_ABI: Abi = [
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'creator',
            type: 'address'
          },
          {
            components: [
              {
                internalType: 'enum ClassParentType',
                name: 'type_',
                type: 'uint8'
              },
              {
                internalType: 'string',
                name: 'iscn_id_prefix',
                type: 'string'
              }
            ],
            internalType: 'struct ClassParentInput',
            name: 'parent',
            type: 'tuple'
          },
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'symbol',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'description',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'uri',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'uri_hash',
                type: 'string'
              },
              {
                internalType: 'string',
                name: 'metadata',
                type: 'string'
              },
              {
                components: [
                  {
                    internalType: 'bool',
                    name: 'burnable',
                    type: 'bool'
                  },
                  {
                    internalType: 'uint64',
                    name: 'max_supply',
                    type: 'uint64'
                  },
                  {
                    components: [
                      {
                        components: [
                          {
                            internalType: 'uint64',
                            name: 'start_time',
                            type: 'uint64'
                          },
                          {
                            internalType: 'string[]',
                            name: 'allowed_addresses',
                            type: 'string[]'
                          },
                          {
                            internalType: 'uint64',
                            name: 'mint_price',
                            type: 'uint64'
                          }
                        ],
                        internalType: 'struct MintPeriod[]',
                        name: 'mint_periods',
                        type: 'tuple[]'
                      },
                      {
                        internalType: 'uint64',
                        name: 'reveal_time',
                        type: 'uint64'
                      }
                    ],
                    internalType: 'struct BlindBoxConfig',
                    name: 'blind_box_config',
                    type: 'tuple'
                  }
                ],
                internalType: 'struct ClassConfig',
                name: 'config',
                type: 'tuple'
              }
            ],
            internalType: 'struct ClassInput',
            name: 'input',
            type: 'tuple'
          }
        ],
        internalType: 'struct MsgNewClass',
        name: 'msgNewClass',
        type: 'tuple'
      },
      {
        internalType: 'string',
        name: 'id',
        type: 'string'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'ERC721IncorrectOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'ERC721InsufficientApproval',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'approver',
        type: 'address'
      }
    ],
    name: 'ERC721InvalidApprover',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'ERC721InvalidOperator',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'ERC721InvalidOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address'
      }
    ],
    name: 'ERC721InvalidReceiver',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address'
      }
    ],
    name: 'ERC721InvalidSender',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'ERC721NonexistentToken',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ErrCannotUpdateClassWithMintedTokens',
    type: 'error'
  },
  {
    inputs: [],
    name: 'ErrNftNoSupply',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'OwnableInvalidOwner',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'Approval',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'ApprovalForAll',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'ContractURIUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'Transfer',
    type: 'event'
  },
  {
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      }
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'contractURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'string',
        name: 'metadata',
        type: 'string'
      }
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes'
      }
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address'
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool'
      }
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'tokenId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_tokenId',
        type: 'uint256'
      }
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256'
      }
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'symbol',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'description',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'uri',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'uri_hash',
            type: 'string'
          },
          {
            internalType: 'string',
            name: 'metadata',
            type: 'string'
          },
          {
            components: [
              {
                internalType: 'bool',
                name: 'burnable',
                type: 'bool'
              },
              {
                internalType: 'uint64',
                name: 'max_supply',
                type: 'uint64'
              },
              {
                components: [
                  {
                    components: [
                      {
                        internalType: 'uint64',
                        name: 'start_time',
                        type: 'uint64'
                      },
                      {
                        internalType: 'string[]',
                        name: 'allowed_addresses',
                        type: 'string[]'
                      },
                      {
                        internalType: 'uint64',
                        name: 'mint_price',
                        type: 'uint64'
                      }
                    ],
                    internalType: 'struct MintPeriod[]',
                    name: 'mint_periods',
                    type: 'tuple[]'
                  },
                  {
                    internalType: 'uint64',
                    name: 'reveal_time',
                    type: 'uint64'
                  }
                ],
                internalType: 'struct BlindBoxConfig',
                name: 'blind_box_config',
                type: 'tuple'
              }
            ],
            internalType: 'struct ClassConfig',
            name: 'config',
            type: 'tuple'
          }
        ],
        internalType: 'struct ClassInput',
        name: 'classInput',
        type: 'tuple'
      }
    ],
    name: 'update',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
