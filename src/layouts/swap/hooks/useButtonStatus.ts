import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useEffect, useState } from "react";
import { useAccount, useBalance, useFeeData, useNetwork } from "wagmi";
import { getFormattedAmount } from "../../../utils/formaters";
import { cleanNumber } from "../utils";
import { useQuote } from "./useQuote";
import { useMetaContext } from "./useSwapCommon";

export const useButtonStatus = () => {
  const {
    tokenIn,
    tokenOut,
    amountIn,
    buttonLoading,
    chainNeeded,
    approvalAddress,
    settings,
  } = useMetaContext();
  const { tx, swapStatus, quotes } = useQuote();

  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: balanceData } = useBalance({ address });
  const { data: gasData } = useFeeData({
    chainId: chainNeeded || chain?.id,
  });
  const [buttonStatus, setButtonStatus] = useState("Loading...");

  // Syntaxic sugar
  const gasBalance = balanceData?.formatted
    ? parseFloat(balanceData.formatted)
    : null;
  const gasCost = tx?.gasLimit
    ? cleanNumber(tx.gasLimit, 9) *
      cleanNumber(gasData?.gasPrice, 9) *
      settings.gasPriceRatio
    : 0;
  const gasSpent =
    gasCost + (tokenIn && "coin" in tokenIn ? parseFloat(amountIn) : 0);

  useEffect(() => {
    if (!address) {
      setButtonStatus("Connect");
      return;
    }

    if (chainNeeded && chain?.id !== Number(chainNeeded) && tokenOut) {
      setButtonStatus(
        blockchainsIdContent[String(chainNeeded)]?.name
          ? `Switch to ${blockchainsIdContent[String(chainNeeded)]?.name}`
          : "Unsupported chain"
      );
      return;
    }

    if (buttonLoading) {
      setButtonStatus(buttonLoading);
      return;
    }

    if (parseFloat(amountIn) > parseFloat(tokenIn?.balance || "0")) {
      setButtonStatus("Balance too low");
      return;
    }

    if (gasBalance !== null && gasBalance - gasSpent < 0) {
      setButtonStatus(
        `Not enough ${
          blockchainsIdContent[String(chain?.id as number)].eth?.symbol
        } (${getFormattedAmount(gasSpent)} needed total)`
      );
      return;
    }

    if (approvalAddress) {
      setButtonStatus("Approve");
      return;
    }

    if (parseFloat(amountIn) === 0) {
      setButtonStatus("Input an amount");
      return;
    }

    if (swapStatus) {
      setButtonStatus(swapStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    approvalAddress,
    buttonLoading,
    amountIn,
    address,
    swapStatus,
    chainNeeded,
    chain,
    tokenOut,
    gasBalance,
    gasBalance,
    gasCost,
  ]);

  return {
    buttonStatus,
    setButtonStatus,
    tx,
    swapStatus,
    quotes,
  };
};
