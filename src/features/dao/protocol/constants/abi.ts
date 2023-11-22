// export const PROTOCOL_SHORTENED_ABI = [
//   {
//     inputs: [],
//     name: "getFirstSortTokens",
//     outputs: [
//       {
//         components: [
//           {
//             internalType: "string",
//             name: "ipfsHash",
//             type: "string",
//           },
//           {
//             internalType: "address[]",
//             name: "contractAddresses",
//             type: "address[]",
//           },
//           {
//             internalType: "uint256",
//             name: "id",
//             type: "uint256",
//           },
//           {
//             internalType: "address[]",
//             name: "totalSupply",
//             type: "address[]",
//           },
//           {
//             internalType: "address[]",
//             name: "excludedFromCirculation",
//             type: "address[]",
//           },
//           {
//             internalType: "uint256",
//             name: "lastUpdate",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "utilityScore",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "socialScore",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "trustScore",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "marketScore",
//             type: "uint256",
//           },
//         ],
//         internalType: "struct API.Token[]",
//         name: "",
//         type: "tuple[]",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   "function firstSortVotes(address voter, uint256 tokenId) external view returns (bool)",
//   {
//     inputs: [],
//     name: "getFinalValidationTokens",
//     outputs: [
//       {
//         components: [
//           {
//             internalType: "string",
//             name: "ipfsHash",
//             type: "string",
//           },
//           {
//             internalType: "address[]",
//             name: "contractAddresses",
//             type: "address[]",
//           },
//           {
//             internalType: "uint256",
//             name: "id",
//             type: "uint256",
//           },
//           {
//             internalType: "address[]",
//             name: "totalSupply",
//             type: "address[]",
//           },
//           {
//             internalType: "address[]",
//             name: "excludedFromCirculation",
//             type: "address[]",
//           },
//           {
//             internalType: "uint256",
//             name: "lastUpdate",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "utilityScore",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "socialScore",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "trustScore",
//             type: "uint256",
//           },
//           {
//             internalType: "uint256",
//             name: "marketScore",
//             type: "uint256",
//           },
//         ],
//         internalType: "struct API.Token[]",
//         name: "",
//         type: "tuple[]",
//       },
//     ],
//     stateMutability: "view",
//     type: "function",
//   },
//   "function finalDecisionVotes(address voter, uint256 tokenId) external view returns (bool)",
// ];

export const PROTOCOL_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct SubmitQuery",
        name: "token",
        type: "tuple",
      },
    ],
    name: "DataSubmitted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct SubmitQuery",
        name: "token",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "validations",
        type: "uint256",
      },
    ],
    name: "FinalDecisionRejected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct SubmitQuery",
        name: "token",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "validations",
        type: "uint256",
      },
    ],
    name: "FinalDecisionValidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct SubmitQuery",
        name: "token",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "validated",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "utilityScore",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "socialScore",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "trustScore",
        type: "uint256",
      },
    ],
    name: "FinalValidationVote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct SubmitQuery",
        name: "token",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "validations",
        type: "uint256",
      },
    ],
    name: "FirstSortRejected",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct SubmitQuery",
        name: "token",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "validations",
        type: "uint256",
      },
    ],
    name: "FirstSortValidated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        indexed: false,
        internalType: "struct SubmitQuery",
        name: "token",
        type: "tuple",
      },
      {
        indexed: false,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "validated",
        type: "bool",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "utilityScore",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "socialScore",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "trustScore",
        type: "uint256",
      },
    ],
    name: "FirstSortVote",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "badFinalVotes",
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
  // function badFinalVotes(address coucou) public view returns(uint256)
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "badFirstVotes",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_stableAddress",
        type: "address",
      },
    ],
    name: "changeWhitelistedStable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "claimRewards",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "demoted",
        type: "address",
      },
    ],
    name: "demote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "demoteVotes",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "demoted",
        type: "address",
      },
    ],
    name: "emergencyDemote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "emergencyKillRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "promoted",
        type: "address",
      },
    ],
    name: "emergencyPromote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "finalDecisionMaxVotes",
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
  {
    inputs: [],
    name: "finalDecisionValidationsNeeded",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "validate",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "utilityScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "socialScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "trustScore",
        type: "uint256",
      },
    ],
    name: "finalDecisionVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "finalDecisionVotes",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "finalValidationTokens",
    outputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "utilityScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "socialScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "trustScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "coeff",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "firstSortMaxVotes",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "firstSortTokens",
    outputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "utilityScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "socialScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "trustScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "coeff",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "firstSortValidationsNeeded",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "validate",
        type: "bool",
      },
      {
        internalType: "uint256",
        name: "utilityScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "socialScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "trustScore",
        type: "uint256",
      },
    ],
    name: "firstSortVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "firstSortVotes",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFinalValidationTokens",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        internalType: "struct SubmitQuery[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getFirstSortTokens",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        internalType: "struct SubmitQuery[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSubmittedTokens",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "address[]",
            name: "contractAddresses",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address[]",
            name: "totalSupply",
            type: "address[]",
          },
          {
            internalType: "address[]",
            name: "excludedFromCirculation",
            type: "address[]",
          },
          {
            internalType: "uint256",
            name: "lastUpdate",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "utilityScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "socialScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "trustScore",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "coeff",
            type: "uint256",
          },
        ],
        internalType: "struct SubmitQuery[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "goodFinalVotes",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "goodFirstVotes",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "indexOfFinalValidationTokens",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "indexOfFirstSortTokens",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "_mobulaTokenAddress",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "membersToDemoteFromRankI",
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
  {
    inputs: [],
    name: "membersToDemoteFromRankII",
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
  {
    inputs: [],
    name: "membersToPromoteToRankI",
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
  {
    inputs: [],
    name: "membersToPromoteToRankII",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "owedRewards",
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
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "paidRewards",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "promoted",
        type: "address",
      },
    ],
    name: "promote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "promoteVotes",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "rank",
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
  {
    inputs: [],
    name: "submitFloorPrice",
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
  {
    inputs: [
      {
        internalType: "address[]",
        name: "contractAddresses",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "totalSupplyAddresses",
        type: "address[]",
      },
      {
        internalType: "address[]",
        name: "excludedCirculationAddresses",
        type: "address[]",
      },
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "address",
        name: "paymentTokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "paymentAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "assetId",
        type: "uint256",
      },
    ],
    name: "submitIPFS",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "submittedTokens",
    outputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "lastUpdate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "utilityScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "socialScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "trustScore",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "coeff",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenFinalRejections",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenFinalValidations",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenFirstRejections",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenFirstValidations",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenSocialScore",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenTrustScore",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenUtilityScore",
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
  {
    inputs: [],
    name: "tokensPerVote",
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
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_finalDecisionMaxVotes",
        type: "uint256",
      },
    ],
    name: "updateFinalDecisionMaxVotes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_finalDecisionValidationsNeeded",
        type: "uint256",
      },
    ],
    name: "updateFinalDecisionValidationsNeeded",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_firstSortMaxVotes",
        type: "uint256",
      },
    ],
    name: "updateFirstSortMaxVotes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_firstSortValidationsNeeded",
        type: "uint256",
      },
    ],
    name: "updateFirstSortValidationsNeeded",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_membersToDemoteToRankI",
        type: "uint256",
      },
    ],
    name: "updateMembersToDemoteFromRankI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_membersToDemoteToRankII",
        type: "uint256",
      },
    ],
    name: "updateMembersToDemoteFromRankII",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_membersToPromoteToRankI",
        type: "uint256",
      },
    ],
    name: "updateMembersToPromoteToRankI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_membersToPromoteToRankII",
        type: "uint256",
      },
    ],
    name: "updateMembersToPromoteToRankII",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_protocolAPIAddress",
        type: "address",
      },
    ],
    name: "updateProtocolAPIAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_submitFloorPrice",
        type: "uint256",
      },
    ],
    name: "updateSubmitFloorPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokensPerVote",
        type: "uint256",
      },
    ],
    name: "updateTokensPerVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_voteCooldown",
        type: "uint256",
      },
    ],
    name: "updateVoteCooldown",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_votesNeededToRankIDemotion",
        type: "uint256",
      },
    ],
    name: "updateVotesNeededToRankIDemotion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_votesNeededToRankIIDemotion",
        type: "uint256",
      },
    ],
    name: "updateVotesNeededToRankIIDemotion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_votesNeededToRankIIPromotion",
        type: "uint256",
      },
    ],
    name: "updateVotesNeededToRankIIPromotion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_votesNeededToRankIPromotion",
        type: "uint256",
      },
    ],
    name: "updateVotesNeededToRankIPromotion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "voteCooldown",
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
  {
    inputs: [],
    name: "votesNeededToRankIDemotion",
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
  {
    inputs: [],
    name: "votesNeededToRankIIDemotion",
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
  {
    inputs: [],
    name: "votesNeededToRankIIPromotion",
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
  {
    inputs: [],
    name: "votesNeededToRankIPromotion",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "whitelistedStable",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
    ],
    name: "withdrawERC20Funds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawFunds",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const VAULT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_protocolAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "lastClaim",
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
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "totalClaim",
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
  {
    stateMutability: "payable",
    type: "receive",
  },
];
