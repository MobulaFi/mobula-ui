import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useContext, useEffect, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { VscArrowSwap } from "react-icons/vsc";
import { useFeeData, useNetwork } from "wagmi";
import { SwapContext } from "../..";
import { Button } from "../../../../components/button";
import { SmallFont } from "../../../../components/fonts";
import { NextChakraLink } from "../../../../components/link";
import { Spinner } from "../../../../components/spinner";
import { pushData } from "../../../../lib/mixpanel";
import { SwitchNetworkPopup } from "../../../../popup/switch-network";
import { DISABLED_STATUS } from "../../constants";
import { useLoadToken } from "../../hooks/useLoadToken";
import { ISwapContext } from "../../model";
import { InfoPopupQuotes } from "../../popup/quotes";
import { Settings } from "../../popup/settings";
import { cleanNumber } from "../../utils";
import { SwapBox } from "./components/swap-box";
// import { InfoPopupQuotes } from "./popup/quotes";

interface MainSwapProps {
  isWidget?: boolean;
  isDex?: boolean;
}

export const MainSwap = ({
  isWidget = false,
  isDex = false,
}: MainSwapProps) => {
  const {
    tokenIn,
    tokenOut,
    buttonStatus,
    buttonLoading,
    isFeesLoading,
    handleButtonClick,
    tokenOutBuffer,
    tokenInBuffer,
    setTokenInBuffer,
    setTokenOutBuffer,
    quotes,
    chainNeeded,
    manualQuote,
    slippageTokenIn,
    slippageTokenOut,
    setLockToken,
    settings,
  } = useContext<ISwapContext>(SwapContext);
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const { loadToken } = useLoadToken();
  const { chain } = useNetwork();
  const [isMounted, setIsMounted] = useState(false);
  const { data } = useFeeData({ chainId: chainNeeded || chain?.id || 1 });

  // Syntaxic sugar
  const currentChain = chainNeeded || chain?.id || 1;
  const chainData = blockchainsIdContent[String(currentChain)];
  const supportedProtocols =
    chainData?.supportedProtocols.filter(
      (entry) =>
        (slippageTokenIn &&
          slippageTokenOut &&
          slippageTokenIn <= 0.25 &&
          slippageTokenOut <= 0.25) ||
        entry === "forkV2"
    ) || [];
  const quotesAmount = quotes.length - 1;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full rounded">
      <div className="flex items-center w-full justify-between p-5 pb-1.5">
        <p className="text-light-font-100 dark:text-dark-font-100 text-lg font-medium">
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
              setSettingsVisible(true);
              pushData("TRADE-ADVANCED-SETTINGS");
            }}
          >
            <AiOutlineSetting className="text-light-font-80 dark:text-dark-font-80 text-lg hover:text-blue hover:dark:text-blue transition-colors" />
          </button>
        </div>
      </div>
      <div className="flex p-5 pt-2.5 items-start bg-light-bg-secondary dark:bg-dark-bg-secondary flex-col w-full">
        {/* IN */}
        <div className="flex flex-col relative w-full">
          <SwapBox position="in" isDex={isDex} />
          {/* ARROW */}
          <Button
            extraCss="mx-auto absolute rounded-full top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-[2] 
            bg-light-bg-secondary dark:bg-dark-bg-secondary"
            onClick={() => {
              if (tokenOutBuffer) setTokenOutBuffer(undefined);
              if (tokenIn && tokenOut && !tokenOutBuffer && !tokenInBuffer) {
                setLockToken([]);
                setTokenOutBuffer(tokenOut);
                setTokenInBuffer(tokenIn);
                loadToken("out", tokenIn);
                loadToken("in", tokenOut);
              }
              pushData("TRADE-INTERACT");
              pushData("TRADE-SWITCH-ARROW");
            }}
            disabled={
              !!buttonLoading ||
              isFeesLoading ||
              !!tokenInBuffer ||
              !!tokenOutBuffer
            }
          >
            <VscArrowSwap className="text-lg rotate-90" />
          </Button>
          <div
            className="flex w-2.5 h-2.5 bg-light-bg-secondary dark:bg-dark-bg-secondary
           absolute top-1/2 left-1/2 z-10 -translate-y-[50%] translate-x-[80%]"
          />
          <div
            className="flex w-2.5 h-2.5 bg-light-bg-secondary dark:bg-dark-bg-secondary
          absolute top-1/2 left-[43%] z-[3] -translate-y-[50%]"
          />
          {/* OUT */}
          <SwapBox position="out" isDex={isDex} />
        </div>
        <div
          className={`flex ${
            isDex ? "items-start flex-col" : "items-center flex-row"
          } `}
        >
          <SmallFont
            extraCss={`
        mb-2.5 mt-1 md:my-[15px] text-center 
        `}
          >
            <div className="flex text-center mt-[15px]">
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 mr-2.5 font-normal">
                Router used:{" "}
              </SmallFont>
              <InfoPopupQuotes isSwapRouter>
                <div className="flex flex-wrap flex-center cursor-pointer">
                  <SmallFont>
                    {manualQuote?.protocol ||
                      quotes?.[0]?.protocol ||
                      "Loading..."}
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
        </div>
        <button
          className={`flex items-center justify-center w-full text-sm lg:text-[13px] md:text-xs font-medium 
          border border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue 
           text-light-font-100 dark:text-dark-font-100 ${
             !!buttonLoading || DISABLED_STATUS.includes(buttonStatus)
               ? "cursor-not-allowed"
               : "cursor-pointer"
           } ${
            isDex ? "h-[40px] md:h-[35px]" : "h-[35px] md:h-[30px]"
          } rounded`}
          onClick={() => handleButtonClick()}
          id={`trade-${buttonStatus.toLowerCase()}`}
        >
          {(buttonLoading || isFeesLoading) && (
            <Spinner extraCss="w-[15px] h-[15px] mr-[15px]" />
          )}{" "}
          {buttonStatus}
        </button>
        {isWidget ? (
          <div className="flex items-center mt-[15px]">
            <img
              className="w-[18px] h-[18px] mr-[7.5px]"
              src="/mobula/coinMobula.png"
              alt="mobula logo"
            />
            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
              Powered by{" "}
              <NextChakraLink
                target="_blank"
                rel="noopener"
                href="https://mobula.fi"
              >
                Mobula.fi
              </NextChakraLink>
            </SmallFont>
          </div>
        ) : null}
        <Settings visible={settingsVisible} setVisible={setSettingsVisible} />
        <SwitchNetworkPopup />
      </div>
    </div>
  );
};
