import { BlockchainName } from "mobula-lite/lib/model";
import { Dispatch, SetStateAction } from "react";
import { TransactionReceipt } from "viem";
import { HoldingsResponse } from "../../interfaces/holdings";
import { SearchTokenProps } from "./popup/select/model";

export interface TemporaryTransaction {
  to: `0x${string}`;
  from: `0x${string}`;
  data: `0x${string}`;
  value: number;
  gasLimit: number;
}

export type SyntaxicTokens = Record<
  "in" | "out",
  (SearchTokenProps & Loaded) | undefined
>;

export type SyntaxicTokensBuffer = Record<
  "in" | "out",
  SearchTokenProps | undefined
>;

export interface EventProps {
  topics: string[];
  data: string;
  address: string;
}
export interface LogProps {
  address: `0x${string}`;
  blockHash: `0x${string}`;
  blockNumber: bigint;
  data: `0x${string}`;
  logIndex: number;
  transactionHash: `0x${string}`;
  transactionIndex: number;
  removed: boolean;
  logs: [];
}
export interface IMetaSwapContext {
  tokenIn: (SearchTokenProps & Loaded) | undefined;
  tokenOut: (SearchTokenProps & Loaded) | undefined;
  setTokenIn: Dispatch<SetStateAction<(SearchTokenProps & Loaded) | undefined>>;
  setTokenOut: Dispatch<
    SetStateAction<(SearchTokenProps & Loaded) | undefined>
  >;
  chainNeeded: number | undefined;
  setChainNeeded: Dispatch<SetStateAction<number | undefined>>;
  amountIn: string;
  setAmountIn: Dispatch<SetStateAction<string>>;
  amountOut: string;
  setAmountOut: Dispatch<SetStateAction<string>>;
  buttonLoading: string | undefined;
  setButtonLoading: Dispatch<SetStateAction<string | undefined>>;
  approvalAddress: string | undefined;
  setApprovalAddress: Dispatch<SetStateAction<string | undefined>>;
  isFeesLoading: boolean;
  setIsFeesLoading: Dispatch<SetStateAction<boolean>>;
  settings: Settings;
  setSettings: Dispatch<SetStateAction<Settings>>;
  tokenInBuffer: SearchTokenProps | undefined;
  setTokenInBuffer: Dispatch<SetStateAction<SearchTokenProps | undefined>>;
  tokenOutBuffer: SearchTokenProps | undefined;
  setTokenOutBuffer: Dispatch<SetStateAction<SearchTokenProps | undefined>>;
  manualQuote: Quote | undefined;
  setManualQuote: Dispatch<SetStateAction<Quote | undefined>>;
  wishedAmountOut: string;
  setWishedAmountOut: Dispatch<SetStateAction<string>>;
  lockToken: ("in" | "out")[];
  setLockToken: Dispatch<SetStateAction<("in" | "out")[]>>;
  completedTx: (TransactionReceipt & { timestamp: number }) & { hash: string };
  setCompletedTx: Dispatch<
    SetStateAction<(TransactionReceipt & { timestamp: number }) | undefined>
  >;
  showSummary: boolean;
  setShowSummary: Dispatch<SetStateAction<boolean>>;
  txError:
    | {
        title: string;
        hint: string;
      }
    | undefined;
  setTxError: Dispatch<
    SetStateAction<
      | {
          title: string;
          hint: string;
        }
      | undefined
    >
  >;
  slippageTokenOut: number;
  slippageTokenIn: number;
  setSlippageTokenOut: Dispatch<SetStateAction<number>>;
  setSlippageTokenIn: Dispatch<SetStateAction<number>>;
}
export interface ISwapContext extends IMetaSwapContext {
  buttonStatus: string;
  // TODO: remove any by ???
  tx: any | undefined;
  handleButtonClick: () => Promise<void>;
  quotes: Quote[];
  holdings: HoldingsResponse | null;
}

export interface Asset {
  symbol: string;
  logo: string;
  blockchains: BlockchainName[];
  contracts: string[];
  address: string;
  image?: string;
  id?: number;
  blockchain: BlockchainName;
  balance?: number;
  name?: string;
}

export interface Coin {
  symbol: string;
  logo: string;
  coin: true;
  evmChainId: number;
  name?: string;
  image?: string;
  id?: number;
  blockchain: BlockchainName;
  balance?: number;
  blockchains?: BlockchainName[];
  address?: string;
  contracts?: string[];
}
export interface Loaded {
  price: number | null;
  balance: string | null;
  decimals: number;
}

export interface Settings {
  slippage: number;
  autoTax: boolean;
  maxAutoTax: number;
  routeRefresh: number;
  gasPriceRatio: number;
}

export interface Quote {
  error: string | null;
  tx: TemporaryTransaction;
  will_fail: boolean;
  amountOut: number;
  protocol: string;
}

export interface ViemTransaction {
  account: `0x${string}`;
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
  gasLimit: number;
  gasPrice?: bigint;
}
