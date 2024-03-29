import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { decodeAbiParameters, parseAbiParameters } from "viem";
import { useAccount, useNetwork } from "wagmi";
import { disconnect, getPublicClient, getWalletClient } from "wagmi/actions";
import { PopupUpdateContext } from "../../../contexts/popup";
import { pushData } from "../../../lib/mixpanel";
import { triggerAlert } from "../../../lib/toastify";
import { GET } from "../../../utils/fetch";
import { generateTxError } from "../utils";
import { useButtonStatus } from "./useButtonStatus";
import { useMetaContext } from "./useSwapCommon";

export const useButtonClick = () => {
  const {
    tokenIn,
    approvalAddress,
    setApprovalAddress,
    setButtonLoading,
    tokenOut,
    setTxError,
    setCompletedTx,
    showSummary,
    setShowSummary,
    amountIn,
    manualQuote,
    setManualQuote,
    amountOut,
  } = useMetaContext();
  const { buttonStatus, tx, quotes } = useButtonStatus();
  const { setConnect, setShowSwitchNetwork } = useContext(PopupUpdateContext);
  const { chain } = useNetwork();
  const { isConnected, address } = useAccount();
  const pathname = usePathname();

  // Syntaxic sugar
  const route = pathname.toUpperCase().split("/")[1] || "HOME";

  const handleButtonClick = async () => {
    // TODO: wallet
    if (!isConnected || !chain) {
      setConnect(true);
      return;
    }

    const walletClient = await getWalletClient({
      chainId: chain.id,
    });

    const publicClient = getPublicClient({
      chainId: chain.id,
    });

    const dataProperties = {
      sold_crypto_name: tokenIn?.name,
      bought_crypto_name: tokenOut?.name,
      bought_crypto_ticker: tokenOut?.symbol,
      trade_type: route,
      sold_crypto_ticker: tokenIn?.symbol,
      amount_sold_crypto: amountIn,
      amount_sold_usd: (tokenIn?.price || 0) * parseFloat(amountIn),
      dex_name: (manualQuote || quotes[0]).protocol,
      chain_name: blockchainsIdContent[String(chain.id)]?.name,
    };
    switch (buttonStatus) {
      case "Approve":
        pushData("Trade Approve Clicked", dataProperties);
        if (tokenIn && "address" in tokenIn && isConnected) {
          try {
            const hash = await walletClient?.writeContract({
              chain: walletClient.chain,
              address: tokenIn.address as never,
              account: address as never,
              abi: [
                {
                  inputs: [
                    {
                      internalType: "address",
                      name: "spender",
                      type: "address",
                    },
                    {
                      internalType: "uint256",
                      name: "amount",
                      type: "uint256",
                    },
                  ],
                  name: "approve",
                  outputs: [],
                  stateMutability: "nonpayable",
                  type: "function",
                },
              ] as never,
              functionName: "approve" as never,
              args: [
                approvalAddress,
                BigInt("1000000000000000000000000000000000000000000"),
              ] as never,
            });

            setManualQuote({ ...(manualQuote || quotes[0]), error: null });
            setButtonLoading("Approving...");

            let success = false;
            while (!success) {
              try {
                // eslint-disable-next-line no-await-in-loop
                await publicClient.getTransactionReceipt({
                  hash: hash as never,
                });
                success = true;
              } catch (e) {
                // Do nothing
              }
            }

            setApprovalAddress(undefined);
            setButtonLoading((button) => {
              if (button === "Approving...") return undefined;
              return button;
            });
            pushData("Trade Approved", dataProperties);
          } catch (e: any) {
            setButtonLoading((button) => {
              if (button === "Approving...") return undefined;
              return button;
            });
            if (e?.message?.includes("underlying network changed")) {
              triggerAlert("Error", "Please reconnect your wallet.");
              disconnect();
            } else {
              triggerAlert("Error", `Error while approving ${tokenIn.symbol}`);
            }
          }
        }
        break;
      case "Confirm":
        if (!showSummary) {
          pushData("Trade Mobula Popup Confirmed", dataProperties);
          setShowSummary(true);
          return;
        }
        if (!tx || !tokenOut) {
          triggerAlert(
            "Error",
            "No transaction to confirm. Please refresh the page."
          );
          return;
        }
        try {
          setButtonLoading("Processing...");
          setTxError(undefined);
          pushData("Trade Mobula Button Confirmed", dataProperties);

          const transaction = await walletClient?.sendTransaction(tx as any);
          pushData("Trade Wallet Confirmed", dataProperties);

          let completedTx: any;
          while (!completedTx) {
            try {
              completedTx = await publicClient.getTransactionReceipt({
                hash: transaction,
              });
            } catch (e) {
              // Do nothing
            }
          }

          if (completedTx.status === "reverted") throw new Error("Reverted");

          pushData("Trade Succeed", dataProperties);

          setButtonLoading((button) => {
            if (button === "Processing...") return undefined;
            return button;
          });

          let volume: number;
          if (tokenIn && tokenIn.price)
            volume = tokenIn.price * parseFloat(amountIn);
          else if (tokenOut && tokenOut.price)
            volume = tokenOut.price * parseFloat(amountOut);
          else volume = 0;

          GET("/user/process-transaction", {
            account: address || null,
            hash: transaction || null,
            blockchain: encodeURIComponent(
              blockchainsIdContent[String(chain.id)]?.name
            ),
            value: volume,
            router: (manualQuote || quotes[0]).protocol,
            in: tokenIn?.symbol || null,
            out: tokenOut.symbol,
            page: pathname.split("/")[1],
          });

          setCompletedTx({
            ...completedTx,
            timestamp: Date.now(),
          });
        } catch (e: any) {
          pushData("Trade Failed", {
            ...dataProperties,
            failure_reason: e.message,
          });
          setButtonLoading((button) => {
            if (button === "Processing...") return undefined;
            return button;
          });
          if (e?.message?.includes("underlying network changed")) {
            setTxError({
              title: "Network changed",
              hint: "Please reconnect your wallet.",
            });
            disconnect();
          } else {
            let decodedErrorMessage: string;
            try {
              const { data: rawError } = await publicClient.call(tx as any);
              const result = decodeAbiParameters(
                parseAbiParameters("string"),
                `0x${(rawError || "").slice(10)}`
              );
              [decodedErrorMessage] = result;
            } catch (callError: any) {
              decodedErrorMessage = callError?.message;
            }
            setTxError(generateTxError(e, decodedErrorMessage));

            if (e?.transactionHash) {
              const completedTx = await publicClient.getTransactionReceipt(
                e.transactionHash
              );
              setCompletedTx({
                ...completedTx,
                timestamp: Date.now(),
              });
            }
          }
          console.warn(
            "Something went wrong while signing transaction",
            e,
            Object.keys(e),
            e?.transactionHash,
            tx
          );
        }
        break;
      default:
        if (buttonStatus.includes("Switch to ")) {
          setShowSwitchNetwork(
            blockchainsContent[buttonStatus.split("Switch to ")[1]].evmChainId
          );
        }
    }
  };

  return {
    handleButtonClick,
    buttonStatus,
    quotes,
    tx,
  };
};
