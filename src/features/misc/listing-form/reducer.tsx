/* eslint-disable no-param-reassign */

import { pushData } from "../../../lib/mixpanel";

export const INITIAL_STATE = {
  name: "",
  symbol: "",
  type: "",
  image: {
    loading: false,
    uploaded_logo: false,
    logo: "",
  },
  description: "",
  categories: [],
  completed: false,
  links: {
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    github: "",
    audits: [],
    kycs: [],
  },
  team: [],
  contracts: [
    {
      address: "",
      blockchain: "",
      blockchain_id: 1,
    },
  ],
  totalSupplyContracts: [],
  excludedFromCirculationAddresses: [
    {
      address: "",
      blockchain: "",
      blockchain_id: 1,
    },
  ],
  tokenomics: {
    distribution: [],
    launch: {
      date: "",
      lag: 7200,
      exchange: "",
      vsToken: "",
    },
    sales: [],
    vestingSchedule: [["", "", [{ name: "", amount: 0 }]]],
    fees: [
      {
        name: "",
        percentage: 0,
        details: "",
        side: "buy",
      },
    ],
  },
};

export const ACTIONS = {
  SET_INPUT: "SET_INPUT",
  SET_INPUT_LINKS: "SET_INPUT_LINKS",
  SET_LOGO: "SET_LOGO",
  ADD_TO_ARRAY: "ADD_TO_ARRAY",
  REMOVE_FROM_ARRAY: "REMOVE_FROM_ARRAY",
  ADD_ELEMENT: "ADD_ELEMENT",
  REMOVE_ELEMENT: "REMOVE_ELEMENT",
  SET_ELEMENT: "SET_ELEMENT",
  ADD_FIRST_CONTRACT: "ADD_FIRST_CONTRACT",
  ADD_ALL_CONTRACTS: "ADD_ALL_CONTRACTS",
  CLEAR_TOTAL_SUPPLY_CONTRACTS: "CLEAR_TOTAL_SUPPLY_CONTRACTS",
  INITIAL_CONTRACT: "INITIAL_CONTRACT",
  ADD_DISTRIBUTION: "ADD_DISTRIBUTION",
  ADD_DISTRIBUTION_ADDRESS: "ADD_DISTRIBUTION_ADDRESS",
  REMOVE_DISTRIBUTION_ADDRESS: "REMOVE_DISTRIBUTION_ADDRESS",
  ADD_DISTRIBUTION_INPUT_ADDRESS: "ADD_DISTRIBUTION_INPUT_ADDRESS",
  SET_DISTRIBUTION: "SET_DISTRIBUTION",
  SET_LAUNCH: "SET_LAUNCH",
  SET_ELEMENT_TOKENOMICS: "SET_ELEMENT_TOKENOMICS",
  ADD_ELEMENT_TOKENOMICS: "ADD_ELEMENT_TOKENOMICS",
  REMOVE_ELEMENT_TOKENOMICS: "REMOVE_ELEMENT_TOKENOMICS",
  ADD_VESTING: "ADD_VESTING",
  DELETE_VESTING: "DELETE_VESTING",
  UPDATE_VESTING: "UPDATE_VESTING",
  REMOVE_CATEGORIE: "REMOVE_CATEGORIE",
  ADD_CATEGORIES: "ADD_CATEGORIES",
  SET_ARRAY: "SET_ARRAY",
};

export const reducer = (state, action) => {
  if (!state.init) {
    pushData("Listing Form Interacted");
  }
  state.init = true;

  switch (action.type) {
    case ACTIONS.SET_INPUT:
      return { ...state, [action.payload.name]: action.payload.value };
    case ACTIONS.SET_INPUT_LINKS:
      return {
        ...state,
        links: { ...state.links, [action.payload.name]: action.payload.value },
      };
    case ACTIONS.SET_LOGO:
      return {
        ...state,
        image: { ...state.image, [action.payload.name]: action.payload.value },
      };
    case ACTIONS.ADD_CATEGORIES: {
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    }
    case ACTIONS.REMOVE_CATEGORIE: {
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category !== action.payload
        ),
      };
    }
    case ACTIONS.ADD_TO_ARRAY: {
      const { name, value } = action.payload;
      return {
        ...state,
        links: {
          ...state.links,
          [name]: [...state.links[name], value],
        },
      };
    }
    case ACTIONS.SET_ARRAY:
      return {
        ...state,
        links: {
          ...state.links,
          [action.payload.name]: state.links[action.payload.name].map(
            (item, i) => {
              if (i !== action.payload.i) return item;
              return action.payload.value;
            }
          ),
        },
      };
    case ACTIONS.REMOVE_FROM_ARRAY:
      return {
        ...state,
        links: {
          ...state.links,
          [action.payload.name]: state.links[action.payload.name].filter(
            (item, i) => i !== action.payload.i
          ),
        },
      };
    case ACTIONS.SET_ELEMENT:
      return {
        ...state,
        [action.payload.object]: state[action.payload.object].map(
          (member, i) => {
            if (i !== action.payload.i) return member;
            return {
              ...member,
              [action.payload.name]: action.payload.value,
            };
          }
        ),
      };
    case ACTIONS.ADD_ELEMENT:
      return {
        ...state,
        [action.payload.object]: [
          ...state[action.payload.object],
          action.payload.template,
        ],
      };
    case ACTIONS.REMOVE_ELEMENT:
      return {
        ...state,
        [action.payload.object]: state[action.payload.object].filter(
          (_, i) => i !== action.payload.i
        ),
      };
    case ACTIONS.INITIAL_CONTRACT:
      return {
        ...state,
        totalSupplyContracts: [
          {
            address: action.payload.address,
            blockchain: action.payload.blockchain,
            blockchain_id: action.payload.blockchain_id,
          },
        ],
      };
    case ACTIONS.ADD_FIRST_CONTRACT:
      return {
        ...state,
        totalSupplyContracts: [
          ...state.totalSupplyContracts,
          { ...state.contracts[0] },
        ],
      };

    case ACTIONS.ADD_ALL_CONTRACTS:
      return {
        ...state,
        totalSupplyContracts: [
          ...state.totalSupplyContracts,
          ...state.contracts.map((contract) => ({ ...contract })),
        ],
      };
    case ACTIONS.CLEAR_TOTAL_SUPPLY_CONTRACTS:
      return {
        ...state,
        totalSupplyContracts: [],
      };
    case ACTIONS.ADD_DISTRIBUTION:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          distribution: [
            ...state.tokenomics.distribution,
            {
              name: "",
              percentage: 0,
              addresses: [],
            },
          ],
        },
      };
    case ACTIONS.SET_DISTRIBUTION: {
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          distribution: state.tokenomics.distribution.map((member, i) => {
            if (i !== action.payload.i) return member;
            return {
              ...member,
              [action.payload.name]: action.payload.value,
            };
          }),
        },
      };
    }
    case ACTIONS.ADD_DISTRIBUTION_ADDRESS:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          distribution: state.tokenomics.distribution.map((member, i) => {
            if (i !== action.payload.i) return member;
            const memberBuffer = member.addresses;
            memberBuffer[action.payload.j] = action.payload.address;
            return {
              ...member,
              addresses: [...memberBuffer],
            };
          }),
        },
      };
    case ACTIONS.ADD_DISTRIBUTION_INPUT_ADDRESS:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          distribution: state.tokenomics.distribution.map((item, index) => {
            if (index !== action.payload.i) return item;
            return {
              ...item,
              addresses: [
                ...item.addresses,
                {
                  address: "",
                  blockchain: "",
                  blockchain_id: 1,
                },
              ],
            };
          }),
        },
      };

    case ACTIONS.REMOVE_DISTRIBUTION_ADDRESS:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          distribution: state.tokenomics.distribution.map((member, i) => {
            if (i !== action.payload.i) return member;
            return {
              ...member,
              addresses: member.addresses.filter(
                (_, j) => j !== action.payload.k
              ),
            };
          }),
        },
      };
    case ACTIONS.SET_LAUNCH:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          launch: {
            ...state.tokenomics.launch,
            [action.payload.name]: action.payload.value,
          },
        },
      };
    case ACTIONS.SET_ELEMENT_TOKENOMICS:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          [action.payload.object]: state.tokenomics[action.payload.object].map(
            (member, i) => {
              if (i !== action.payload.i) return member;
              return {
                ...member,
                [action.payload.name]: action.payload.value,
              };
            }
          ),
        },
      };
    case ACTIONS.ADD_ELEMENT_TOKENOMICS:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          [action.payload.object]: [
            ...state.tokenomics[action.payload.object],
            action.payload.template,
          ],
        },
      };

    case ACTIONS.REMOVE_ELEMENT_TOKENOMICS:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          [action.payload.object]: state.tokenomics[
            action.payload.object
          ].filter((_, i) => i !== action.payload.i),
        },
      };
    case ACTIONS.ADD_VESTING:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          vestingSchedule: [
            ...state.tokenomics.vestingSchedule,
            action.payload,
          ],
        },
      };
    case ACTIONS.UPDATE_VESTING:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          vestingSchedule: state.tokenomics.vestingSchedule.map((item, index) =>
            index === action.index ? action.payload : item
          ),
        },
      };
    case ACTIONS.DELETE_VESTING:
      return {
        ...state,
        tokenomics: {
          ...state.tokenomics,
          vestingSchedule: state.tokenomics.vestingSchedule.filter(
            (_, index) => index !== action.index
          ),
        },
      };

    default:
      return state;
  }
};
