import { BlockchainName } from "mobula-lite/lib/model";
import { Dispatch, SetStateAction } from "react";
import { TransactionReceipt } from "viem";
import { HoldingsResponse } from "./holdings";

export interface TemporaryTransaction {
  to: `0x${string}`;
  from: `0x${string}`;
  data: `0x${string}`;
  value: number;
  gasLimit: number;
}

export type SyntaxicTokens = Record<
  "in" | "out",
  ((Asset | Coin) & Loaded) | undefined
>;

export type SyntaxicTokensBuffer = Record<
  "in" | "out",
  (Asset | Coin) | undefined
>;

export interface IMetaSwapContext {
  tokenIn: ((Asset | Coin) & Loaded) | undefined;
  tokenOut: ((Asset | Coin) & Loaded) | undefined;
  setTokenIn: Dispatch<SetStateAction<((Asset | Coin) & Loaded) | undefined>>;
  setTokenOut: Dispatch<SetStateAction<((Asset | Coin) & Loaded) | undefined>>;
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
  tokenInBuffer: (Asset | Coin) | undefined;
  setTokenInBuffer: Dispatch<SetStateAction<(Asset | Coin) | undefined>>;
  tokenOutBuffer: (Asset | Coin) | undefined;
  setTokenOutBuffer: Dispatch<SetStateAction<(Asset | Coin) | undefined>>;
  manualQuote: Quote | undefined;
  setManualQuote: Dispatch<SetStateAction<Quote | undefined>>;
  wishedAmountOut: string;
  setWishedAmountOut: Dispatch<SetStateAction<string>>;
  lockToken: ("in" | "out")[];
  setLockToken: Dispatch<SetStateAction<("in" | "out")[]>>;
  completedTx:
    | ((TransactionReceipt & { timestamp: number }) & { hash: string })
    | undefined;
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
