import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { defaultCategories } from "./constants";
import { Payload, Reducer, View } from "./models";

export const maxValue = 100_000_000_000_000_000;

export const INITIAL_VALUE: View = {
  color: "#FF8C00",
  name: "",
  is_favorite: false,
  display: [
    { type: "price", value: "Price USD" },
    { type: "market_cap", value: "Market Cap" },
    { type: "change", value: "24h %" },
    { type: "volume", value: "24h Volume" },
    { type: "chart", value: "24h Chart" },
  ],
  filters: {
    blockchains: Object.keys(blockchainsContent),
    rank: { from: 0, to: maxValue },
    price: { from: 0, to: maxValue },
    price_change: { from: 0, to: maxValue },
    market_cap: { from: 0, to: maxValue },
    volume: { from: 0, to: maxValue },
    liquidity: { from: 0, to: maxValue },
    categories: [...defaultCategories],
  },
};

export const ACTIONS = {
  SET_INPUT: "SET_INPUT",
  ADD_BLOCKCHAINS: "ADD_BLOCKCHAINS",
  REMOVE_BLOCKCHAINS: "REMOVE_BLOCKCHAINS",
  SET_BASIC_INPUT: "SET_BASIC_INPUT",
  SET_FAVORITE: "SET_FAVORITE",
  ADD_DISPLAY: "ADD_DISPLAY",
  REMOVE_DISPLAY: "REMOVE_DISPLAY",
  RESET_FILTER: "RESET_FILTER",
  SET_COLOR: "SET_COLOR",
  SET_USER_VALUE: "SET_USER_VALUE",
  RESET_VIEW: "RESET_VIEW",
  MOVE_ELEMENT: "MOVE_ELEMENT",
  RESET_BLOCKCHAINS: "RESET_BLOCKCHAINS",
  DESELECT_ALL_BLOCKCHAINS: "DESELECT_ALL_BLOCKCHAINS",
  ADD_CATEGORY: "ADD_CATEGORY",
  REMOVE_CATEGORY: "REMOVE_CATEGORY",
  RESET_CATEGORY: "RESET_CATEGORY",
  REMOVE_ALL_CATEGORY: "REMOVE_ALL_CATEGORY",
};

export const reducer = (state: View, action: Reducer) => {
  switch (action.type) {
    case ACTIONS.MOVE_ELEMENT:
      return { ...state, display: action.payload };
    case ACTIONS.SET_USER_VALUE:
      return {
        ...(action.payload as any).value,
      };
    case ACTIONS.SET_BASIC_INPUT:
      return {
        ...state,
        [(action.payload as Payload).name]: (action.payload as Payload).value,
      };
    case ACTIONS.SET_FAVORITE:
      return {
        ...state,
        is_favorite: !state.is_favorite,
      };
    case ACTIONS.SET_COLOR:
      return {
        ...state,
        color: (action.payload as Payload).value,
      };
    case ACTIONS.ADD_DISPLAY:
      return {
        ...state,
        display: [
          ...state.display,
          {
            type: (action.payload as Payload).type,
            value: (action.payload as Payload).value,
          },
        ],
      };
    case ACTIONS.RESET_FILTER:
      return {
        ...state,
        filters: {
          ...state.filters,
          [(action.payload as Payload).name]: { from: 0, to: maxValue },
        },
      };
    case ACTIONS.RESET_BLOCKCHAINS:
      return {
        ...state,
        filters: {
          ...state.filters,
          blockchains: Object.keys(blockchainsContent),
        },
      };
    case ACTIONS.REMOVE_DISPLAY:
      return {
        ...state,
        display: state.display.filter(
          (entry) => entry.value !== (action.payload as Payload).value
        ),
      };
    case ACTIONS.SET_INPUT:
      return {
        ...state,
        filters: {
          ...state.filters,
          [(action.payload as Payload).name]: {
            ...state.filters[(action.payload as Payload).name],
            [(action.payload as Payload).time]: parseFloat(
              (action.payload as any).value
            ),
          },
        },
      };
    case ACTIONS.ADD_BLOCKCHAINS:
      return {
        ...state,
        filters: {
          ...state.filters,
          blockchains: [
            ...state.filters.blockchains,
            (action.payload as Payload).value,
          ],
        },
      };
    case ACTIONS.DESELECT_ALL_BLOCKCHAINS:
      return {
        ...state,
        filters: {
          ...state.filters,
          blockchains: [],
        },
      };
    case ACTIONS.REMOVE_BLOCKCHAINS:
      return {
        ...state,
        filters: {
          ...state.filters,
          blockchains: state.filters.blockchains.filter(
            (chain) => chain !== (action.payload as Payload).value
          ),
        },
      };
    case ACTIONS.RESET_VIEW:
      return {
        ...state,
        filters: {
          blockchains: Object.keys(blockchainsContent),
          rank: { from: 0, to: maxValue },
          price: { from: 0, to: maxValue },
          price_change: { from: 0, to: maxValue },
          market_cap: { from: 0, to: maxValue },
          volume: { from: 0, to: maxValue },
          liquidity: { from: 0, to: maxValue },
          categories: [...defaultCategories],
        },
        display: [
          { type: "price", value: "Price USD" },
          { type: "market_cap", value: "Market Cap" },
          { type: "change", value: "24h %" },
          { type: "volume", value: "24h Volume" },
          { type: "chart", value: "24h Chart" },
        ],
      };
    case ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          categories: [
            ...state.filters.categories,
            (action.payload as Payload).value,
          ],
        },
      };
    case ACTIONS.REMOVE_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          categories: state.filters.categories.filter(
            (category) => category !== (action.payload as Payload).value
          ),
        },
      };
    case ACTIONS.RESET_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          categories: [...defaultCategories],
        },
      };

    case ACTIONS.REMOVE_ALL_CATEGORY:
      return {
        ...state,
        filters: {
          ...state.filters,
          categories: [],
        },
      };

    default:
      return state;
  }
};
