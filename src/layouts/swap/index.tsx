/* eslint-disable import/no-cycle */
"use client";
import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import React, { createContext, useEffect, useMemo, useState } from "react";
import { TransactionReceipt as TransactionReceiptInterface } from "viem";
import { useAccount, useFeeData, useNetwork } from "wagmi";
import { useHoldings } from "../../hooks/holdings";
import { useButtonClick } from "./hooks/useButtonClick";
import { useMetaContext } from "./hooks/useSwapCommon";
import { useTokenManager } from "./hooks/useTokenManager";
import { useUpdateBalance } from "./hooks/useUpdateBalance";
import { MetaSwapContext } from "./meta";
import {
  Asset,
  ISwapContext,
  Loaded,
  Quote,
  Settings,
  SyntaxicTokens,
  SyntaxicTokensBuffer,
} from "./model";
import { TransactionReceipt } from "./popup/receipt";
import { SearchTokenProps } from "./popup/select/model";
import { cleanNumber } from "./utils";

export const SwapContext = createContext({} as ISwapContext);

export const activeStatus = ["Connect", "Approve", "Confirm"];

export const SwapNonMetaProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const context = useMetaContext();
  const {
    tokenIn,
    tokenOut,
    chainNeeded,
    setChainNeeded,
    tokenOutBuffer,
    tokenInBuffer,
    wishedAmountOut,
    lockToken,
    settings,
    setAmountIn,
    txError,
    setTxError,
  } = context;

  const { initTokens, updateToken } = useTokenManager();
  const { handleButtonClick, tx, quotes, buttonStatus } = useButtonClick();

  const { address } = useAccount();
  const holdings = useHoldings(address);

  // User-related hooks
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: gasData } = useFeeData({
    chainId: chainNeeded || chain?.id,
  });

  // Syntaxic sugar
  const currentChain = chainNeeded || chain?.id || 1;
  const currentChainName = blockchainsIdContent[String(currentChain)]?.name;
  const tokens: SyntaxicTokens = { in: tokenIn, out: tokenOut };
  const buffers: SyntaxicTokensBuffer = {
    in: tokenInBuffer,
    out: tokenOutBuffer,
  };

  // useSlippage();

  useUpdateBalance();

  /**
   * Managing wished swap out
   */

  useEffect(() => {
    if (tokenIn?.price && tokenOut?.price && wishedAmountOut) {
      let amount = String(
        parseFloat(wishedAmountOut) * (tokenOut.price / tokenIn.price)
      );

      const gasCost = tx?.gasLimit
        ? cleanNumber(tx.gasLimit, 9) *
          cleanNumber(gasData?.gasPrice, 9) *
          settings.gasPriceRatio
        : 0;

      if (
        tokenIn.balance &&
        parseFloat(amount) >=
          parseFloat(tokenIn.balance) - ("coin" in tokenIn ? gasCost : 0)
      ) {
        amount = String(
          parseFloat(tokenIn.balance) - ("coin" in tokenIn ? gasCost : 0)
        );
      }

      setAmountIn(String(Math.max(0, parseFloat(amount))));
      // setWishedSwapOut({...wishedSwapOut, updated: false});
    }
  }, [wishedAmountOut, tokenIn, tokenOut, tx]);

  // Init buffers
  useEffect(() => {
    if (tokenInBuffer) updateToken("in");
    if (tokenOutBuffer) updateToken("out");
  }, []);

  // Managing chain switches
  useEffect(() => {
    if (isConnected !== undefined) {
      // Cleaning chainNeeded if the user is connected
      if (isConnected && chain?.id === chainNeeded) {
        setChainNeeded(undefined);
      }

      // If the token is not defined, we initialize the tokens
      if (!tokenIn || !tokenOut) {
        initTokens();
        return;
      }

      // A locked token isn't available on the current chain => we require chain switch and don't update the tokens
      const positionRequiredToSwitch = lockToken.find((pos) => {
        const token = tokens[pos];
        return (
          token?.blockchain !== currentChainName &&
          ("coin" in (token || []) ||
            !(token as Asset).blockchains.includes(currentChainName))
        );
      });

      if (positionRequiredToSwitch !== undefined) {
        const wishedChain =
          blockchainsContent[
            (tokens[positionRequiredToSwitch] || { blockchain: "" }).blockchain
          ].evmChainId;

        // If the wished chain is different from the current chain, we set the new one.
        // Elseway, we set the chainNeeded to undefined to clear its effect.
        setChainNeeded(wishedChain !== chain?.id ? wishedChain : undefined);
        return;
      }

      // Elseway, we update the tokens
      Object.entries(tokens).forEach(([position, token]) => {
        if (token?.blockchain !== currentChainName && !buffers[position]) {
          updateToken(position as "in" | "out");
        }
      });
    }
  }, [chain, chainNeeded, tokenIn, tokenOut]);

  useEffect(() => {
    if (
      chain?.id &&
      !blockchainsIdContent[String(chain.id)] &&
      !tokenIn &&
      !tokenOut &&
      !tokenInBuffer &&
      !tokenOutBuffer
    ) {
      setChainNeeded(1);
    }
  }, [chain]);

  useEffect(() => {
    if (address && txError?.title === "Network changed") {
      setTxError(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const value = useMemo(
    () => ({
      handleButtonClick,
      tx,
      quotes,
      buttonStatus,
      holdings,
      ...context,
    }),
    [handleButtonClick, tx, quotes, buttonStatus, holdings, context]
  );

  return (
    <SwapContext.Provider value={value}>
      {children}
      <TransactionReceipt />
    </SwapContext.Provider>
  );
};

export const SwapProvider = ({
  children,
  lockToken: bufferLockToken = [],
  tokenInBuffer: tokenInBufferParam,
  tokenOutBuffer: tokenOutBufferParam,
}: {
  children: React.ReactNode;
  lockToken?: ("in" | "out")[];
  tokenInBuffer?: SearchTokenProps;
  tokenOutBuffer?: SearchTokenProps;
}) => {
  // Token-related hooks
  const [tokenIn, setTokenIn] = useState<
    (SearchTokenProps & Loaded) | undefined
  >();
  const [tokenOut, setTokenOut] = useState<
    (SearchTokenProps & Loaded) | undefined
  >();
  const [tokenOutBuffer, setTokenOutBuffer] = useState<SearchTokenProps>(
    tokenOutBufferParam as SearchTokenProps
  );
  const [tokenInBuffer, setTokenInBuffer] = useState<SearchTokenProps>(
    tokenInBufferParam as SearchTokenProps
  );
  const [lockToken, setLockToken] = useState<("in" | "out")[]>(bufferLockToken);

  // Swap-related hooks
  const [amountIn, setAmountIn] = useState<string>("1");
  const [amountOut, setAmountOut] = useState<string>("0");
  const [wishedAmountOut, setWishedAmountOut] = useState<string>("");

  // Button-related hooks
  const [buttonLoading, setButtonLoading] = useState<string>();
  const [isFeesLoading, setIsFeesLoading] = useState<boolean>(false);

  // Transaction-related hooks
  const [approvalAddress, setApprovalAddress] = useState<string>();
  const [manualQuote, setManualQuote] = useState<Quote>();
  const [completedTx, setCompletedTx] = useState<
    TransactionReceiptInterface & { timestamp: number; hash: string }
  >();
  const [txError, setTxError] = useState<{
    title: string;
    hint: string;
  }>();
  // Multi-chain hooks
  const [chainNeeded, setChainNeeded] = useState<number>();
  const [slippageTokenIn, setSlippageTokenIn] = useState<number>(0.25);
  const [slippageTokenOut, setSlippageTokenOut] = useState<number>(0.25);

  // Settings-related hooks
  const [settings, setSettings] = useState<Settings>({
    autoTax: true,
    maxAutoTax: 25,
    slippage: 1,
    routeRefresh: 10,
    gasPriceRatio: 1,
  });
  const [showSummary, setShowSummary] = useState(false);

  const value = useMemo(
    () => ({
      tokenIn,
      setTokenIn,
      tokenOut,
      setTokenOut,
      chainNeeded,
      setChainNeeded,
      amountIn,
      setAmountIn,
      amountOut,
      setAmountOut,
      buttonLoading,
      setButtonLoading,
      tokenOutBuffer,
      setTokenOutBuffer,
      tokenInBuffer,
      setTokenInBuffer,
      settings,
      setSettings,
      approvalAddress,
      setApprovalAddress,
      isFeesLoading,
      setIsFeesLoading,
      manualQuote,
      setManualQuote,
      lockToken,
      setLockToken,
      wishedAmountOut,
      setWishedAmountOut,
      completedTx,
      setCompletedTx,
      showSummary,
      setShowSummary,
      txError,
      setTxError,
      slippageTokenIn,
      setSlippageTokenIn,
      slippageTokenOut,
      setSlippageTokenOut,
    }),
    [
      tokenIn,
      setTokenIn,
      tokenOut,
      setTokenOut,
      chainNeeded,
      setChainNeeded,
      amountIn,
      setAmountIn,
      amountOut,
      setAmountOut,
      buttonLoading,
      setButtonLoading,
      tokenOutBuffer,
      setTokenOutBuffer,
      tokenInBuffer,
      setTokenInBuffer,
      settings,
      setSettings,
      approvalAddress,
      setApprovalAddress,
      isFeesLoading,
      setIsFeesLoading,
      manualQuote,
      setManualQuote,
      lockToken,
      setLockToken,
      wishedAmountOut,
      setWishedAmountOut,
      completedTx,
      setCompletedTx,
      showSummary,
      setShowSummary,
      txError,
      setTxError,
      slippageTokenIn,
      setSlippageTokenIn,
      slippageTokenOut,
      setSlippageTokenOut,
    ]
  );

  return (
    <MetaSwapContext.Provider value={value}>
      <SwapNonMetaProvider>{children}</SwapNonMetaProvider>
    </MetaSwapContext.Provider>
  );
};
