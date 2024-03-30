import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { useCallback, useContext } from "react";
import { createPublicClient, getContract, http } from "viem";
import { Chain, erc20ABI, useAccount, useNetwork } from "wagmi";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { idToWagmiChain } from "../../../utils/chains";
import { MetaSwapContext } from "../meta";
import { Coin, ISwapContext, Loaded } from "../model";
import { SearchTokenProps } from "../popup/select/model";

export const useLoadToken = () => {
  const defaultContext = useContext(MetaSwapContext);
  const { address: account } = useAccount();
  const { chain: defaultChain } = useNetwork();

  const loadToken = useCallback(
    async (
      position: "in" | "out",
      tokenParam: SearchTokenProps,
      {
        contextBuffer,
        chainBuffer,
      }: {
        contextBuffer?: Partial<ISwapContext>;
        chainBuffer?: Chain;
      } = {}
    ) => {
      /**
       * Don't delete logs
       */

      if (!tokenParam) return;
      let token = tokenParam;

      const context = {
        ...defaultContext,
        ...contextBuffer,
      };
      const evmChainId =
        context.chainNeeded || chainBuffer?.id || defaultChain?.id || 1;

      const supabase = createSupabaseDOClient();
      const dbQuery = supabase
        .from("assets")
        .select("price,contracts,blockchains");

      if ("address" in token) {
        dbQuery.contains("contracts", [(token.address || "").toLowerCase()]);
      } else {
        dbQuery.eq("symbol", token.symbol);
      }

      dbQuery.order("market_cap", { ascending: false });

      const client = createPublicClient({
        chain: idToWagmiChain[evmChainId],
        transport: http(blockchainsIdContent[String(evmChainId)].rpcs[0]),
      });

      let balance: string | null = null;
      let balanceQuery: Promise<bigint> | null = null;
      let decimalsQuery: Promise<number> | null = null;

      const isCoin =
        blockchainsContent[token.blockchain].eth?.symbol === token.symbol;

      const newToken: SearchTokenProps = {
        ...token,
      };

      if (isCoin && "address" in newToken) {
        delete newToken.address;
        (newToken as unknown as Coin).coin = true;
      }

      token = newToken;

      if ("address" in token) {
        const contract = getContract({
          abi: erc20ABI,
          address: token.address as never,
          publicClient: client as never,
        }) as any;

        if (account) {
          balanceQuery = contract.read.balanceOf([account]);
        }
        decimalsQuery = contract.read.decimals();
      } else {
        if (account) {
          balanceQuery = client.getBalance({ address: account });
        }
        decimalsQuery = Promise.resolve(18);
      }

      const [{ data }, balanceResult, decimalsResult] = await Promise.all([
        dbQuery,
        balanceQuery,
        decimalsQuery,
      ]);

      if (balanceResult && decimalsResult) {
        balance = (
          Number(
            (balanceResult * 10000n) / BigInt(`1${"0".repeat(decimalsResult)}`)
          ) / 10000
        ).toFixed(6);
      }
      // Setting token in context
      context[position === "in" ? "setTokenIn" : "setTokenOut"]({
        ...newToken,
        price: data?.[0]?.price,
        balance,
        decimals: decimalsResult || 18,
        blockchains: data?.[0]?.blockchains,
        contracts: data?.[0]?.contracts,
      } as SearchTokenProps & Loaded);

      // Setting buffer to undefined
      context[position === "in" ? "setTokenInBuffer" : "setTokenOutBuffer"](
        undefined
      );
      const otherToken = position === "in" ? context.tokenOut : context.tokenIn;

      if (
        (context.chainNeeded && defaultChain?.id === context.chainNeeded) ||
        (context.chainNeeded &&
          evmChainId &&
          token?.blockchain === otherToken?.blockchain &&
          otherToken?.blockchain ===
            blockchainsIdContent[
              String(chainBuffer?.id || defaultChain?.id || 1)
            ]?.name)
      ) {
        context.setChainNeeded(undefined);
      } else if (
        !context.chainNeeded &&
        (defaultChain?.id || 1) !==
          blockchainsContent[token.blockchain]?.evmChainId
      ) {
        context.setChainNeeded(
          blockchainsContent[token.blockchain]?.evmChainId
        );
      }

      context.setManualQuote(undefined);
    },
    [defaultContext, defaultChain, account]
  );

  return { loadToken };
};
