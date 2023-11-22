export const allowanceAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const balanceOfAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const API_ABI = [
  {
    inputs: [
      { internalType: "address", name: "_protocol", type: "address" },
      { internalType: "address", name: "_owner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "NotProtocolOrOwner",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          { internalType: "string", name: "ipfsHash", type: "string" },
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "lastUpdate", type: "uint256" },
          { internalType: "uint256", name: "utilityScore", type: "uint256" },
          { internalType: "uint256", name: "socialScore", type: "uint256" },
          { internalType: "uint256", name: "trustScore", type: "uint256" },
        ],
        indexed: false,
        internalType: "struct Token",
        name: "token",
        type: "tuple",
      },
    ],
    name: "NewAssetListing",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
    ],
    name: "NewListing",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferStarted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "acceptOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "string", name: "ipfsHash", type: "string" },
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "lastUpdate", type: "uint256" },
          { internalType: "uint256", name: "utilityScore", type: "uint256" },
          { internalType: "uint256", name: "socialScore", type: "uint256" },
          { internalType: "uint256", name: "trustScore", type: "uint256" },
        ],
        internalType: "struct Token",
        name: "token",
        type: "tuple",
      },
    ],
    name: "addAssetData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "uint256", name: "assetId", type: "uint256" },
    ],
    name: "addStaticData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "assetById",
    outputs: [
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "lastUpdate", type: "uint256" },
      { internalType: "uint256", name: "utilityScore", type: "uint256" },
      { internalType: "uint256", name: "socialScore", type: "uint256" },
      { internalType: "uint256", name: "trustScore", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "assets",
    outputs: [
      { internalType: "string", name: "ipfsHash", type: "string" },
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "uint256", name: "lastUpdate", type: "uint256" },
      { internalType: "uint256", name: "utilityScore", type: "uint256" },
      { internalType: "uint256", name: "socialScore", type: "uint256" },
      { internalType: "uint256", name: "trustScore", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllAssets",
    outputs: [
      {
        components: [
          { internalType: "string", name: "ipfsHash", type: "string" },
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "uint256", name: "lastUpdate", type: "uint256" },
          { internalType: "uint256", name: "utilityScore", type: "uint256" },
          { internalType: "uint256", name: "socialScore", type: "uint256" },
          { internalType: "uint256", name: "trustScore", type: "uint256" },
        ],
        internalType: "struct Token[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pendingOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "protocol",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "token", type: "address" }],
    name: "removeStaticData",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_protocol", type: "address" }],
    name: "setProtocolAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "staticData",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "tokenAssetId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
