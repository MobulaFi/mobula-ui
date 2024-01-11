import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useContext, useEffect, useRef, useState } from "react";
import { useFeeData, useNetwork } from "wagmi";
// import {InfoPopup} from "../../../../components/popup-hover";
import React from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { VscArrowSwap } from "react-icons/vsc";
import { SwapContext } from "..";
import { LargeFont, SmallFont } from "../../../components/fonts";
import { Spinner } from "../../../components/spinner";
import { Tooltip } from "../../../components/tooltip";
import { pushData } from "../../../lib/mixpanel";
import {
  getFormattedAmount,
  getRightPrecision,
} from "../../../utils/formaters";
import { useLoadToken } from "../hooks/useLoadToken";
import { ISwapContext } from "../model";
import { Select } from "../popup/select";
import { Settings } from "../popup/settings";
import { cleanNumber, famousContractsLabelFromName } from "../utils";

interface BasicSwapProps {
  activeStep: number;
}

export const BasicSwap = ({ activeStep }: BasicSwapProps) => {
  const {
    tokenIn,
    tokenOut,
    amountIn,
    setAmountIn,
    amountOut,
    setAmountOut,
    buttonStatus,
    buttonLoading,
    isFeesLoading,
    handleButtonClick,
    tokenOutBuffer,
    tx,
    chainNeeded,
    quotes,
    slippageTokenOut,
    slippageTokenIn,
    manualQuote,
    settings,
    setLockToken,
    setManualQuote,
  } = useContext<ISwapContext>(SwapContext);
  const [isTokenIn, setIsTokenIn] = useState(true);
  const [showSelector, setShowSelector] = useState<boolean>(false);
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const inputInRef = useRef<HTMLInputElement>(null);
  const { chain } = useNetwork();
  const { data: gasData } = useFeeData({ chainId: chainNeeded || chain?.id });
  const { loadToken } = useLoadToken();
  const { data } = useFeeData({ chainId: chainNeeded || chain?.id || 1 });
  const [isMounted, setIsMounted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const switchTokenButtonStyle =
    "h-[35px] rounded-full w-fit ml-auto p-[5px] bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-200 ease-in-out";
  const gasCost = tx?.gasLimit
    ? cleanNumber(tx.gasLimit, 9) *
      cleanNumber(gasData?.gasPrice, 9) *
      settings.gasPriceRatio
    : 0;
  const currentChain = chainNeeded || chain?.id || 1;
  const chainData = blockchainsIdContent[currentChain];
  const supportedProtocols =
    chainData?.supportedProtocols.filter(
      (entry) =>
        (slippageTokenIn &&
          slippageTokenOut &&
          slippageTokenIn <= 0.25 &&
          slippageTokenOut <= 0.25) ||
        entry === "forkV2"
    ) || [];
  const quotesAmount = quotes?.length - 1;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [show, setShow] = useState(false);

  const getActiveProtocol = (i: number): boolean => {
    if (manualQuote) {
      if (manualQuote?.protocol === quotes?.[i]?.protocol) return true;
      return false;
    }
    if (i === 0) return true;
    return false;
  };

  const getChainName = (chain: string) => {
    if (chain === "BNB Smart Chain (BEP20)") return "Binaace Smart Chain";
  };

  console.log("quotes", quotes);

  return (
    <div
      className={`flex w-full justify-center ${
        quotes?.length > 0 ? "w-auto  min-w-[420px]" : "w-full max-w-[420px]"
      } transition-all duration-300 ease-in-out overflow-x-hidden`}
    >
      <div
        className="flex flex-col max-w-[420px] w-full rounded-2xl border border-light-border-primary
     dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary p-5 "
      >
        <div className="flex items-center w-full mb-5 justify-between">
          <p className="text-light-font-100 dark:text-dark-font-100 text-xl font-medium">
            Swap
          </p>
          <div className="flex">
            <button
              className="bg-light-bg-terciary dark:bg-dark-bg-terciary text-light-font-100 dark:text-dark-font-100 py-1.5 px-2 min-w-[47px] 
            h-[25px] rounded-full flex items-center justify-center nowrap text-xs border-light-border-primary font-normal 
             dark:border-dark-border-primary border"
            >
              {isMounted && data?.gasPrice
                ? `${(
                    cleanNumber(data.gasPrice, 9) * settings.gasPriceRatio
                  ).toFixed(2)} Gwei`
                : null}
            </button>
            <button
              className="ml-2.5"
              onClick={() => {
                setShowSettings(true);
                pushData("TRADE-ADVANCED-SETTINGS");
              }}
            >
              <AiOutlineSetting className="text-light-font-80 dark:text-dark-font-80 text-lg hover:text-blue hover:dark:text-blue transition-colors" />
            </button>
          </div>
        </div>
        <div
          className={`flex flex-col rounded-lg border border-light-border-primary dark:border-dark-border-primary
       bg-light-bg-terciary dark:bg-dark-bg-terciary px-[15px] py-5 relative z-[${
         activeStep === 1 ? "z-[5]" : "z-[1]"
       }`}
        >
          <div className="flex items-center justify-between">
            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
              From
            </SmallFont>
            {tokenIn && tokenIn.balance !== null && (
              <div className="flex items-center justify-center">
                <p className="text-light-font-40 dark:text-dark-font-40 text-xs text-normal">
                  Balance: {getFormattedAmount(tokenIn?.balance)}
                </p>
                <Tooltip
                  tooltipText="Inputs your maximum holdings minus gas fees, which could go to 0 if you have a low balance."
                  extraCss="top-[20px] right-0 mb-[5px]"
                />
              </div>
            )}
          </div>
          <div className="mt-5 flex items-center">
            <input
              className="w-full max-w-[220px] lg:max-w-[150px] text-light-font-100 dark:text-dark-font-100 text-[20px]
             lg:text-[18px] md:text-[16px] font-medium bg-light-bg-terciary dark:bg-dark-bg-terciary border-0 outline-none pl-0"
              style={{ border: "none" }}
              placeholder="0"
              onChange={(e) => {
                if (
                  !Number.isNaN(parseFloat(e.target.value)) ||
                  e.target.value === ""
                )
                  setAmountIn(e.target.value);
              }}
              ref={inputInRef}
              value={
                typeof window !== "undefined" &&
                inputInRef.current === document?.activeElement
                  ? amountIn
                  : (getRightPrecision(amountIn) as number)
              }
              type="number"
              lang="en"
            />
            {tokenIn && tokenIn.balance !== null && (
              <button
                className="text-md mr-2.5 rounded px-2 text-light-font-100 dark:text-dark-font-100 border border-darkblue hover:border-blue transition-all duration-200"
                onClick={() => {
                  setAmountIn(
                    tokenIn && "coin" in tokenIn
                      ? String(
                          Math.max(parseFloat(tokenIn.balance!) - gasCost, 0)
                        )
                      : tokenIn?.balance!
                  );
                }}
              >
                MAX
              </button>
            )}
            <button
              className={switchTokenButtonStyle}
              onClick={() => {
                setIsTokenIn(true);
                setShowSelector(true);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <img
                  src={tokenIn?.logo || "/empty/unknown.png"}
                  alt={`${tokenIn?.name} logo`}
                  className="w-[23px] h-[23px] min-w-[23px] rounded-full"
                />
                <SmallFont extraCss="font-normal ml-[7.5px] mr-0">
                  {tokenIn?.symbol}
                </SmallFont>
                {(!tokenOutBuffer || "isTokenIn") && (
                  <BsChevronDown className="text-[13px] text-light-font-100 dark:text-dark-font-100 ml-1 mr-0.5" />
                )}
              </div>
            </button>
          </div>
          {/* <div className="flex items-center justify-between absolute bottom-[10px]">
            <p className="text-light-font-40 dark:text-dark-font-40 text-xs">
              ${getFormattedAmount(amountIn * tokenIn?.price)}
            </p>
          </div> */}
        </div>
        <div className="w-full flex justify-center relative h-[8px] items-center">
          <button
            className="bg-light-bg-secondary dark:bg-dark-bg-secondary w-fit p-2 absolute z-[2] rounded-full translate-y-[-50%]
         top-[50%] border border-light-border-primary dark:border-dark-border-primary"
          >
            <VscArrowSwap className="text-lg rotate-90 text-light-font-60 dark:text-dark-font-60 hover:text-light-font-100 hover:dark:text-dark-font-100 transition" />
          </button>
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary h-full z-[3] w-[15px] absolute left-[42%]" />
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary h-full z-[3] w-[15px] absolute left-[53%]" />
        </div>
        <div
          className={`flex flex-col bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-lg border border-light-border-primary
       dark:border-dark-border-primary px-[15px] py-5 mt-0  ${
         activeStep === 2 ? "z-[5]" : "z-[0]"
       }`}
        >
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
            To (estimated)
          </SmallFont>
          <div className="flex mt-5 items-center w-full">
            <input
              placeholder="0"
              ref={inputInRef}
              type="number"
              lang="en"
              disabled
              className="w-fit max-w-[200px] lg:max-w-[150px] text-light-font-100 dark:text-dark-font-100 text-[20px] 
            lg:text-[18px] md:text-[16px] font-medium bg-light-bg-terciary dark:bg-dark-bg-terciary border-0 outline-none pl-0"
              style={{ border: "none" }}
              onChange={(e) => {
                if (
                  !Number.isNaN(parseFloat(e.target.value)) ||
                  e.target.value === ""
                )
                  setAmountOut(e.target.value);
              }}
              value={getFormattedAmount(
                (manualQuote?.amountOut || quotes?.[0]?.amountOut) /
                  10 ** tokenOut!?.decimals,
                -2
              )}
            />
            <button
              className={switchTokenButtonStyle}
              onClick={() => {
                setIsTokenIn(false);
                setShowSelector(true);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <img
                  className="w-[23px] h-[23px] min-w-[23px] rounded-full"
                  src={
                    tokenOut?.logo || tokenOut?.image || "/empty/unknown.png"
                  }
                  alt={`${tokenOut?.name} logo`}
                />
                <SmallFont extraCss="text-normal ml-[7.5px] mr-0">
                  {tokenOut?.symbol}
                </SmallFont>
                {(!tokenOutBuffer || "isTokenIn") && (
                  <BsChevronDown className="text-[13px] text-light-font-100 dark:text-dark-font-100 ml-1 mr-0.5" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* feijfejif */}
        <div className="md:flex hidden flex-col mt-2.5">
          {quotes?.map((entry, i) => (
            <div
              className={`flex justify-between items-center cursor-pointer p-3 rounded-xl mb-2.5 ${
                getActiveProtocol(i)
                  ? "bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-secondary dark:border-dark-border-secondary"
                  : ""
              }`}
              key={entry.protocol}
              onClick={() => {
                setManualQuote(entry);
                pushData("TRADE-SWITCH-ROUTE");
                setShow(false);
              }}
            >
              <div className="flex items-center">
                <img
                  className="w-[40px] h-[40px] mr-[10px] rounded-full"
                  src={
                    tokenOut?.logo || tokenOut?.image || "/empty/unknown.png"
                  }
                />

                <div className="flex flex-col">
                  <LargeFont>
                    {getFormattedAmount(
                      entry.amountOut / 10 ** tokenOut!.decimals,
                      -2
                    )}
                  </LargeFont>
                  <div className="flex items-center">
                    <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                      $
                      {getFormattedAmount(
                        getFormattedAmount(
                          entry.amountOut / 10 ** tokenOut!.decimals,
                          -2
                        ) * tokenOut?.price
                      )}{" "}
                      -
                    </SmallFont>
                    <div className="flex items-center ml-1">
                      <img
                        src={famousContractsLabelFromName[entry.protocol]?.logo}
                        className="rounded-full w-[14px] h-[14px] min-w-[14px] mr-2"
                      />
                      <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100">
                        {entry.protocol}
                      </SmallFont>
                    </div>
                  </div>
                </div>
                {/* <SmallFont>{entry.protocol}</SmallFont> */}
              </div>
              {/* <div className="flex items-center ml-2.5">
              <p
                className={`text-sm md:text-xs ${getColorOfActiveProtocol(
                  i
                )} mr-[5px] text-medium`}
              >
                {getFormattedAmount(
                  entry.amountOut / 10 ** tokenOut!.decimals,
                  -2
                )}
              </p>
              <img
                src={tokenOut?.logo || "/empty/unknown.png"}
                className="rounded-full w-[14px] h-[14px] min-w-[14px]"
              />
            </div> */}
            </div>
          ))}{" "}
        </div>
        {/* fenhjusuejf */}
        <button
          className="flex items-center justify-center text-sm text-medium w-full rounded-lg text-light-font-100 dark:text-dark-font-100 border
         border-darkblue hover:border-blue h-[48px] md:h-[38px] transition-all duration-200 mt-4 md:mt-0"
          onClick={() => handleButtonClick()}
          id={`trade-${buttonStatus?.toLowerCase()}`}
        >
          {(buttonLoading || isFeesLoading) && (
            <Spinner extraCss="w-[15px] h-[15px] mb-0.5" />
          )}{" "}
          {buttonLoading || isFeesLoading ? "Loading" : buttonStatus}
        </button>
        <Select
          visible={showSelector}
          setVisible={setShowSelector}
          position={isTokenIn ? "in" : "out"}
        />
        <Settings visible={showSettings} setVisible={setShowSettings} />
      </div>
      {!quotes?.length ? null : (
        <div
          className={`flex flex-col bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-2xl border
       border-light-border-primary dark:border-dark-border-primary ml-5 p-5 w-[350px] h-fit ${
         quotes?.length > 0 ? "flex md:hidden" : "hidden"
       }`}
        >
          <LargeFont extraCss="mb-5">Router available</LargeFont>
          {quotes?.map((entry, i) => (
            <div
              className={`flex justify-between items-center cursor-pointer p-3 rounded-xl mb-2.5 ${
                getActiveProtocol(i)
                  ? "bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-secondary dark:border-dark-border-secondary"
                  : ""
              }`}
              key={entry.protocol}
              onClick={() => {
                setManualQuote(entry);
                pushData("TRADE-SWITCH-ROUTE");
                setShow(false);
              }}
            >
              <div className="flex items-center">
                <img
                  className="w-[40px] h-[40px] mr-[10px] rounded-full"
                  src={
                    tokenOut?.logo || tokenOut?.image || "/empty/unknown.png"
                  }
                />

                <div className="flex flex-col">
                  <LargeFont>
                    {getFormattedAmount(
                      entry.amountOut / 10 ** tokenOut!.decimals,
                      -2
                    )}
                  </LargeFont>
                  <div className="flex items-center">
                    <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                      $
                      {getFormattedAmount(
                        getFormattedAmount(
                          entry.amountOut / 10 ** tokenOut!.decimals,
                          -2
                        ) * tokenOut?.price
                      )}{" "}
                      -
                    </SmallFont>
                    <div className="flex items-center ml-1">
                      <img
                        src={famousContractsLabelFromName[entry.protocol]?.logo}
                        className="rounded-full w-[14px] h-[14px] min-w-[14px] mr-2"
                      />
                      <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100">
                        {entry.protocol}
                      </SmallFont>
                    </div>
                  </div>
                </div>
                {/* <SmallFont>{entry.protocol}</SmallFont> */}
              </div>
              {/* <div className="flex items-center ml-2.5">
              <p
                className={`text-sm md:text-xs ${getColorOfActiveProtocol(
                  i
                )} mr-[5px] text-medium`}
              >
                {getFormattedAmount(
                  entry.amountOut / 10 ** tokenOut!.decimals,
                  -2
                )}
              </p>
              <img
                src={tokenOut?.logo || "/empty/unknown.png"}
                className="rounded-full w-[14px] h-[14px] min-w-[14px]"
              />
            </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
