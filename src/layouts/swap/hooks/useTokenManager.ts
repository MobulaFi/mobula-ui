import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { BlockchainParams } from "mobula-lite/lib/model";
import { useCallback } from "react";
import { Chain, useNetwork } from "wagmi";
import { Coin, Loaded, SyntaxicTokens } from "../model";
import { SearchTokenProps } from "../popup/select/model";
import { useLoadToken } from "./useLoadToken";
import { useMetaContext } from "./useSwapCommon";

export const useTokenManager = () => {
  const { chain } = useNetwork();
  const {
    tokenIn,
    tokenOut,
    chainNeeded,
    tokenInBuffer,
    tokenOutBuffer,
    lockToken,
    setTokenInBuffer,
    setTokenOutBuffer,
  } = useMetaContext();
  const { loadToken } = useLoadToken();

  // Syntaxic sugar
  const currentChain = chainNeeded || chain?.id || 1;
  const chainData = blockchainsIdContent[String(currentChain)];
  const nativeEthereum = (
    chainDataParam: BlockchainParams
  ): Coin | undefined => {
    if (!chainData) return undefined;
    return {
      ...chainDataParam.eth,
      coin: true,
      evmChainId: currentChain,
      blockchain: chainDataParam.name,
    };
  };
  const tokens: SyntaxicTokens = { in: tokenIn, out: tokenOut };

  const initToken = useCallback(
    (position: "in" | "out") => {
      if (!chainData) return;

      const finalChain =
        (position === "in" ? tokens.out?.blockchain : tokens.in?.blockchain) ||
        chainData.name;
      const finalChainData = blockchainsContent[finalChain];

      if (position === "in") {
        if (tokenOut && "coin" in tokenOut) {
          loadToken("in", finalChainData.stable);
        } else {
          loadToken("in", nativeEthereum(finalChainData) as SearchTokenProps);
        }
      } else if (
        tokenIn &&
        "address" in tokenIn &&
        (tokenIn.address || "").toLowerCase() === chainData.stable.address
      ) {
        loadToken("out", nativeEthereum(finalChainData) as SearchTokenProps);
      } else {
        loadToken("out", chainData.stable);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokenIn, tokenOut, chainData, loadToken, chainNeeded, chain]
  );

  const initTokens = useCallback(() => {
    if (
      !tokenIn &&
      !tokenInBuffer &&
      !tokenOutBuffer &&
      !lockToken.includes("in")
    )
      initToken("in");
    if (
      !tokenOut &&
      !tokenOutBuffer &&
      !tokenInBuffer &&
      !lockToken.includes("out")
    )
      initToken("out");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIn, tokenOut, tokenInBuffer, tokenOutBuffer, chainNeeded, chain]);

  const updateToken = useCallback(
    (position: "in" | "out") => {
      let token: SearchTokenProps | (SearchTokenProps & Loaded) | undefined =
        position === "in" ? tokenIn : tokenOut;
      const otherToken:
        | SearchTokenProps
        | (SearchTokenProps & Loaded)
        | undefined = position === "in" ? tokenOut : tokenIn;
      const tokenBuffer = position === "in" ? tokenInBuffer : tokenOutBuffer;
      const otherTokenBuffer =
        position === "in" ? tokenOutBuffer : tokenInBuffer;
      const setTokenBuffer =
        position === "in" ? setTokenInBuffer : setTokenOutBuffer;

      if (tokenBuffer && !token) {
        token = tokenBuffer;
      }

      /**
       * Do not delete log
       */

      if (!token?.blockchain) {
        console.warn(
          "BAD! updateToken without blockchain, initializing token."
        );
        return;
      }

      if (!token) {
        console.warn("BAD! updateToken without token, initializing token.");
        initToken(position);
        return;
      }

      if (
        "coin" in token &&
        (!otherTokenBuffer ||
          (!("coin" in otherTokenBuffer) &&
            nativeEthereum(chainData)?.symbol !== otherTokenBuffer.symbol)) &&
        (!otherToken ||
          (!("coin" in otherToken) &&
            nativeEthereum(chainData)?.symbol !== otherToken.symbol))
      ) {
        loadToken(position, nativeEthereum(chainData) as SearchTokenProps);
      } else if ("coin" in token) {
        setTokenBuffer(chainData.stable);
        loadToken(position, chainData.stable);
      } else if (token.blockchains.includes(chainData?.name)) {
        loadToken(position, {
          ...token,
          blockchain: chainData?.name,
          address: token.contracts[token.blockchains.indexOf(chainData?.name)],
        });
      } else if (!tokenBuffer) {
        initToken(position);
      } else {
        loadToken(position, tokenBuffer, {
          chainBuffer: {
            id: blockchainsContent[token.blockchain]?.evmChainId,
          } as Chain,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokenIn, tokenOut, chainData, loadToken, chainNeeded, chain]
  );

  return {
    initTokens,
    updateToken,
  };
};
