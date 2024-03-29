import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useContext, useEffect, useState } from "react";
import { stringify } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { getPublicClient } from "wagmi/actions";
import { GET } from "../../../utils/fetch";
import { MetaSwapContext } from "../meta";
import { Quote, ViemTransaction } from "../model";

export const useQuote = () => {
  const {
    tokenIn,
    tokenOut,
    amountIn,
    setAmountIn,
    setAmountOut,
    setButtonLoading,
    chainNeeded,
    setApprovalAddress,
    settings,
    manualQuote,
    slippageTokenIn,
    slippageTokenOut,
  } = useContext(MetaSwapContext);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [swapStatus, setSwapStatus] = useState<string>();
  const [tx, setTx] = useState<ViemTransaction>();
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // Syntaxic sugar
  const currentChain = chainNeeded || chain?.id || 1;
  const protocols =
    blockchainsIdContent[String(currentChain)]?.supportedProtocols;

  const computeTx = async (quote: Quote) => {
    if (!quote || !quote.tx || !blockchainsIdContent[String(currentChain)])
      return;

    setButtonLoading((button) => {
      if (!button) return "Computing gas...";
      return button;
    });

    const provider = getPublicClient({
      chainId: currentChain,
    });

    provider
      .estimateGas({
        account: quote.tx.from,
        to: quote.tx.to,
        value: BigInt(quote.tx.value),
      })
      .catch(() => 1000000n)
      .then((gasLimit) => {
        setTx({
          account: quote.tx.from,
          to: quote.tx.to,
          value: BigInt(quote.tx.value),
          gasLimit: quote.tx.gasLimit || Number(gasLimit * 110n) / 110,
          data: quote.tx.data,
        });

        setButtonLoading((button) => {
          if (button === "Computing gas...") return undefined;
          return button;
        });
      });
  };

  useEffect(() => {
    if (manualQuote && tokenOut) {
      delete tx?.gasLimit;
      delete tx?.gasPrice;
      if (stringify(tx) === stringify(manualQuote.tx)) return;
      computeTx(manualQuote);
      setAmountOut(String(manualQuote.amountOut / 10 ** tokenOut.decimals));
      if (manualQuote.error?.includes("allowance"))
        setApprovalAddress(manualQuote.tx.to);
      else setApprovalAddress(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualQuote]);

  useEffect(() => {
    if (!blockchainsIdContent[String(currentChain)]) return () => {};

    let shouldStop = false;
    let freshQuotes: Quote[] = [];

    if (tokenIn && tokenOut && amountIn) {
      const numberAmountIn = parseFloat(amountIn);

      if (numberAmountIn <= 0) {
        console.warn("updateQuote: Invalid amount", numberAmountIn);
        setSwapStatus("Input an amount");
        setAmountOut("0");
        if (numberAmountIn < 0) setAmountIn("0");
        return () => {};
      }

      const processSwap = async (
        r: { error: string } | { success: Quote[] }
      ) => {
        if (shouldStop) return;
        setButtonLoading((button) => {
          if (button === "Fetching price...") return undefined;
          return button;
        });

        if (!r || "error" in r || r.success.length === 0) {
          if (freshQuotes.length === 0) {
            setSwapStatus("No route found");
            setAmountOut("0");
          }

          console.warn("Invalid response from Quote", r);
          return;
        }

        setSwapStatus("Confirm");

        const quote = r.success[0];

        let bestQuote = manualQuote
          ? freshQuotes.find(
              (freshQuote) => freshQuote.protocol === manualQuote.protocol
            )
          : freshQuotes[0];

        if (
          (!manualQuote &&
            (!bestQuote || quote.amountOut > bestQuote.amountOut)) ||
          (manualQuote && quote.protocol === manualQuote.protocol)
        ) {
          bestQuote = quote;

          computeTx(bestQuote);
          setAmountOut(String(bestQuote.amountOut / 10 ** tokenOut.decimals));

          if (bestQuote.error && bestQuote.error.includes("allowance")) {
            setApprovalAddress(bestQuote.tx.to);
          } else {
            setApprovalAddress(undefined);
          }
        }

        const newQuotes = freshQuotes.filter(
          (q) => q.protocol !== quote.protocol
        );
        newQuotes.push(quote);
        newQuotes.sort((a, b) => b.amountOut - a.amountOut);

        freshQuotes = newQuotes;
        setQuotes(freshQuotes);
      };

      const fetchSwap = async () => {
        if (shouldStop) return;

        const filteredProtocols = protocols.filter(
          (entry) =>
            (slippageTokenIn <= 0.25 && slippageTokenOut <= 0.25) ||
            entry === "forkV2"
        );

        filteredProtocols.forEach((protocol) => {
          GET("/api/1/quote", {
            fromToken:
              "address" in tokenIn
                ? tokenIn.address || null
                : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            toToken:
              "address" in tokenOut
                ? tokenOut.address || null
                : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            fromAddress:
              address || "0x1eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
            amount: BigInt(
              Math.round(
                parseFloat(amountIn) *
                  10 ** ("decimals" in tokenIn ? tokenIn.decimals : 18) || 0
              )
            ) as unknown as number,
            formattedAmount: amountIn,
            slippage: settings.slippage || 0.5,
            chain: tokenOut.blockchain || chainNeeded || chain?.id || 1,
            check: true,
            onlyProtocols: protocol,
          })
            .then((r) => r.json())
            .then((r) => {
              processSwap(r);
            });
        });
      };

      // setQuotes([]); TODO: CHECK WITH @SACHA IF THIS IS NEEDED

      fetchSwap();

      const interval = setInterval(() => {
        fetchSwap();
      }, settings.routeRefresh * 1000);

      setButtonLoading((button) => {
        if (!button) return "Fetching price...";
        return button;
      });

      return () => {
        shouldStop = true;
        clearInterval(interval);
      };
    }

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenIn, tokenOut, amountIn, settings, address, manualQuote]);

  return { quotes, tx, swapStatus };
};
