import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useContext, useEffect, useRef, useState } from "react";
import { useFeeData, useNetwork } from "wagmi";
// import {InfoPopup} from "../../../../components/popup-hover";
import { AiOutlineSetting } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { VscArrowSwap } from "react-icons/vsc";
import { SwapContext } from "..";
import { SmallFont } from "../../../components/fonts";
import { Spinner } from "../../../components/spinner";
import { Tooltip } from "../../../components/tooltip";
import { pushData } from "../../../lib/mixpanel";
import {
  getFormattedAmount,
  getRightPrecision,
} from "../../../utils/formaters";
import { useLoadToken } from "../hooks/useLoadToken";
import { ISwapContext } from "../model";
import { InfoPopupQuotes } from "../popup/quotes";
import { Select } from "../popup/select";
import { Settings } from "../popup/settings";
import { cleanNumber } from "../utils";

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
    "h-[35px] rounded-full w-fit ml-auto p-[5px] bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-250 ease-in-out";
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

  return (
    <div className="flex flex-col max-w-[420px] min-w-[300px] w-full rounded-2xl border border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary p-5">
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
       bg-light-bg-terciary dark:bg-dark-bg-terciary px-[15px] py-5 z-[${
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
              className="text-md mr-2.5 rounded px-2 text-light-font-100 dark:text-dark-font-100 border border-darkblue hover:border-blue transition-all duration-250"
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
            value={
              typeof window !== "undefined" &&
              inputInRef.current === document?.activeElement
                ? amountOut
                : (getRightPrecision(amountOut) as number)
            }
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
                src={tokenOut?.logo || tokenOut?.image || "/empty/unknown.png"}
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
      <SmallFont
        extraCss={`${
          activeStep === 3
            ? "text-light-font-100 dark:text-dark-font-100"
            : "text-light-font-40 dark:text-dark-font-40"
        }
        mb-2.5 mt-1 md:my-[15px] text-center ${
          activeStep === 3 ? "z-[5]" : "z-[1]"
        }
        `}
      >
        <div className="flex text-center mt-[15px]">
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 mr-2.5 font-normal">
            Router used:{" "}
          </SmallFont>
          <InfoPopupQuotes isSwapRouter>
            <div className="flex flex-wrap flex-center cursor-pointer">
              <SmallFont>
                {manualQuote?.protocol || quotes?.[0]?.protocol || "Loading..."}
              </SmallFont>{" "}
              {quotes?.length ? (
                <>
                  <SmallFont className="ml-[5px] text-light-font-60 dark:text-dark-font-60">
                    {` (${quotesAmount || "no"} other${
                      quotesAmount > 1 ? "s" : ""
                    }${
                      supportedProtocols.length - quotes.length > 0
                        ? `, +${
                            supportedProtocols.length - quotes.length
                          } loading...`
                        : " available"
                    })`}
                  </SmallFont>
                  <BsChevronDown
                    className={`text-light-font-60 dark:text-dark-font-60 text-xs ml-1.5 mt-1`}
                  />
                </>
              ) : null}
            </div>
          </InfoPopupQuotes>
        </div>
      </SmallFont>
      <button
        className="flex items-center justify-center text-sm text-medium w-full rounded-lg text-light-font-100 dark:text-dark-font-100 border
         border-darkblue hover:border-blue h-[48px] md:h-[38px] transition-all duration-250"
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
  );
};
