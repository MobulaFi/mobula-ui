import { useContext, useRef, useState } from "react";
import { useFeeData, useNetwork } from "wagmi";
import { SwapContext } from "../../../..";
import { SmallFont } from "../../../../../../components/fonts";
import { Skeleton } from "../../../../../../components/skeleton";
import { Tooltip } from "../../../../../../components/tooltip";
import { pushData } from "../../../../../../lib/mixpanel";
import {
  getFormattedAmount,
  getRightPrecision,
} from "../../../../../../utils/formaters";
import { ISwapContext } from "../../../../model";
import { BlockchainSelector } from "../../../../popup/blockchain-selector";
import { Select } from "../../../../popup/select";
import { cleanNumber } from "../../../../utils";
import { BlockchainChanger } from "../blockchain-changer";
import { SelectedToken } from "../selected-token";
import { ContainerInOut } from "../ui";

interface SwapBoxProps {
  position: "in" | "out";
  isDex?: boolean;
}

export const SwapBox = ({ position, isDex }: SwapBoxProps) => {
  const {
    tokenIn,
    tokenOut,
    buttonStatus,
    amountIn,
    amountOut,
    setAmountIn,
    tx,
    settings,
    chainNeeded,
  } = useContext<ISwapContext>(SwapContext);
  const [select, setSelect]: [string | boolean, any] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showBlockchainSelector, setShowBlockchainSelector] =
    useState<boolean>(false);
  const { chain } = useNetwork();
  const { data: gasData } = useFeeData({
    chainId: chainNeeded || chain?.id || 1,
  });

  // Syntax sugar
  const isFrom = position === "in";
  const amount = isFrom ? amountIn : amountOut;
  const setAmount = isFrom ? setAmountIn : undefined;
  const gasCost = tx?.gasLimit
    ? cleanNumber(tx.gasLimit, 9) *
      cleanNumber(gasData?.gasPrice, 9) *
      settings.gasPriceRatio
    : 0;

  const renderSelectedToken = () => {
    if (tokenOut && !isFrom) {
      return <SelectedToken isTokenIn={false} />;
    }
    if (!isFrom) {
      return <SelectedToken isDefault />;
    }

    return null;
  };

  return (
    <ContainerInOut
      extraCss={`${isDex ? "h-[130px]" : "h-[115px] md:h-[105px]"} ${
        position === "in" ? "mb-[5px]" : ""
      } ${position === "out" ? "mt-[5px]" : ""}`}
    >
      <BlockchainSelector
        showBlockchainSelector={showBlockchainSelector}
        setShowBlockchainSelector={setShowBlockchainSelector}
        isFrom={isFrom}
      />
      <div className="flex items-center justify-between w-full">
        {isFrom ? (
          <div className="flex items-center">
            <SmallFont extraCss="mr-2.5 whitespace-nowrap font-medium -mt-0.5 text-light-font-40 dark:text-dark-font-40">
              Chain:
            </SmallFont>
            <BlockchainChanger
              setShowBlockchainSelector={setShowBlockchainSelector}
            />
          </div>
        ) : (
          <div className="flex items-center">
            <SmallFont extraCss="mr-2.5 whitespace-nowrap font-medium -mt-0.5 text-light-font-40 dark:text-dark-font-40">
              Chain:
            </SmallFont>
            <BlockchainChanger
              setShowBlockchainSelector={setShowBlockchainSelector}
              selector={false}
            />
          </div>
        )}
        {tokenIn && tokenIn.balance !== null && isFrom && (
          <div className="flex items-end flex-col ml-2.5 flex-wrap justify-end">
            <p className="text-xs text-light-font-40 dark:text-dark-font-40">
              Balance: {getFormattedAmount(tokenIn?.balance)}
            </p>
            <div className="flex mt-0.5">
              <button
                className="text-xs ml-2.5 text-light-font-100 dark:text-dark-font-100 font-medium"
                onClick={() => {
                  pushData("Trade Swap", {
                    type: "Max Balance",
                  });
                  setAmount!(
                    tokenIn && "coin" in tokenIn
                      ? String(
                          Math.max(parseFloat(tokenIn.balance!) - gasCost, 0)
                        )
                      : tokenIn.balance!
                  );
                }}
              >
                MAX
              </button>
              <Tooltip
                tooltipText="Inputs your maximum holdings minus gas fees, which could go to 0 if you have a low balance."
                extraCss="top-[20px] right-0"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center w-full">
        {((buttonStatus !== "Loading best price..." || isFrom) &&
          !Number.isNaN(parseFloat(amount)) &&
          !Number.isNaN(getRightPrecision(amount))) ||
        amount === "" ? (
          <input
            className="bg-light-bg-terciary dark:bg-dark-bg-terciary text-light-font-100 dark:text-dark-font-100 w-full pl-2.5"
            placeholder="0"
            ref={inputRef}
            type="number"
            lang="en"
            onChange={(e) => {
              if (
                (!Number.isNaN(parseFloat(e.target.value)) ||
                  e.target.value === "") &&
                isFrom
              ) {
                setAmount!(e.target.value);
              }
            }}
            value={
              typeof window !== "undefined" &&
              inputRef.current === document?.activeElement
                ? amount
                : getRightPrecision(amount)
            }
          />
        ) : (
          <div className="w-full">
            <Skeleton extraCss="w-[70px] h-[22px]" />
          </div>
        )}
        <button
          onClick={() => {
            if (isFrom && select !== "tokenIn") setSelect("tokenIn");
            else if (isFrom) setSelect("");
            if (!isFrom && select !== "tokenOut") setSelect("tokenOut");
            else if (!isFrom) setSelect("");
          }}
        >
          {/* IN */}
          {tokenIn && isFrom ? (
            <SelectedToken isTokenIn />
          ) : (
            isFrom && <SelectedToken isDefault />
          )}
          {/* OUT */}
          {renderSelectedToken()}
        </button>
      </div>
      {select && (
        <Select visible={!!select} setVisible={setSelect} position={position} />
      )}
    </ContainerInOut>
  );
};
