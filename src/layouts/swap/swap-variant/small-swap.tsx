import { BaseAssetContext } from "features/asset/context-manager";
import {
  blockchainsContent,
  blockchainsIdContent,
} from "mobula-lite/lib/chains/constants";
import { Dispatch, SetStateAction, useContext, useRef, useState } from "react";
import { AiOutlineSetting, AiOutlineThunderbolt } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { VscArrowSwap } from "react-icons/vsc";
import { useNetwork } from "wagmi";
import { SwapContext } from "..";
import { LargeFont, MediumFont, SmallFont } from "../../../components/fonts";
import { Spinner } from "../../../components/spinner";
import { Asset } from "../../../interfaces/swap";
import { pushData } from "../../../lib/mixpanel";
import { SmallSwapLine } from "../common/popup/settings/components/small-swap-line";
import { useLoadToken } from "../hooks/useLoadToken";
import { InfoPopupQuotes } from "../popup/quotes";
import { Select } from "../popup/select";
import { Settings } from "../popup/settings";

interface SmallSwapProps {
  asset?: Asset;
  extraCss?: string;
}

export const SmallSwap = ({ asset, extraCss }: SmallSwapProps) => {
  const { loadToken } = useLoadToken();
  const inputInRef = useRef<HTMLInputElement>(null);
  const [selectVisible, setSelectVisible] = useState<string | boolean>();
  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const { baseAsset } = useContext(BaseAssetContext);
  const [isHover, setIsHover] = useState(false);
  const { chain } = useNetwork();
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
    setLockToken,
    chainNeeded,
  } = useContext(SwapContext);

  const chainData =
    blockchainsIdContent[String(chainNeeded || (chain?.id as number))];
  const checkValidity = () => {
    if (asset)
      return !blockchainsContent?.[asset?.blockchains?.[0] || asset?.blockchain]
        ?.supportedProtocols?.length;
    return !chainData?.supportedProtocols?.length;
  };

  const isValid = checkValidity();

  return (
    <div
      className={`flex flex-col mt-0 lg:mt-2.5 w-full max-w-[380px] lg:max-w-full min-w-[250px]
    h-fit min-h-auto bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary
     dark:border-dark-border-primary rounded-2xl mb-2.5 ${extraCss}`}
    >
      <div
        className="flex w-full justify-between items-center px-4 py-2 border-b border-light-border-primary
       dark:border-dark-border-primary h-[40px] rounded-t-2xl relative bg-light-bg-terciary dark:bg-dark-bg-terciary p-2.5"
      >
        <LargeFont extraCss="text-start w-fit mr-auto">Swap</LargeFont>
        <button
          className="w-[18px] h-[18px] opacity-80 lg:w-[17px] lg:h-[17px] md:w-[16px] md:h-[16px]"
          onClick={() => setSettingsVisible(true)}
        >
          <AiOutlineSetting className="text-light-font-80 dark:text-dark-font-80 text-lg hover:text-blue hover:dark:text-blue transition-colors" />
        </button>
      </div>
      {isValid ? (
        <div className="flex items-center justify-center p-[15px] h-full">
          <MediumFont extraCss="max-w-[200px] text-center">
            {asset ? asset?.name : baseAsset?.name} can’t be traded on Mobula
            for now.
          </MediumFont>
        </div>
      ) : (
        <div className="p-2.5 flex flex-col relative">
          <SmallSwapLine
            setSelectVisible={setSelectVisible}
            inputRef={inputInRef}
            position="in"
          />
          <button
            className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary
           rounded-full w-[30px] h-[30px] absolute top-[40px] left-[50%] transform translate-x-[-50%] flex justify-center items-center
            text-light-font-40 dark:text-dark-font-40 hover:text-blue hover:dark:text-blue transition-colors p-0.5"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
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
            <div className="flex absolute h-2.5 w-2.5 right-[-5px] top-[11px] bg-light-bg-secondary dark:bg-dark-bg-secondary" />
            <div className="flex absolute h-2.5 w-2.5 left-[-5px] top-[11px] bg-light-bg-secondary dark:bg-dark-bg-secondary" />
            <VscArrowSwap className="text-lg rotate-90 hover:text-light-font-100 text-light-font-60 dark:text-dark-font-60 hover:dark:text-dark-font-100 transition-all" />
          </button>
          <SmallSwapLine position="out" />
          <button
            className="flex items-center justify-center text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs font-normal border
             border-darkblue mt-2.5 rounded-lg h-[37px] hover:border-blue transition-all duration-200"
            onClick={handleButtonClick}
          >
            {buttonLoading || isFeesLoading ? (
              <Spinner extraCss="w-[15px] h-[15px] mr-[15px]" />
            ) : null}
            {buttonStatus}
          </button>
          <div className="flex text-center mt-[15px] mx-auto justify-center">
            {!quotes?.length ? (
              <div className="flex items-center cursor-pointer mx-auto">
                <AiOutlineThunderbolt className="text-light-font-100 text-sm dark:text-dark-font-100 mr-[5px]" />
                <SmallFont>Best Price, 0 fees from Mobula</SmallFont>
                <BsChevronDown className="text-light-font-100 text-xs dark:text-dark-font-100 ml-[5px]" />
              </div>
            ) : null}
            <InfoPopupQuotes isSwapRouter>
              {quotes?.length ? (
                <div className="flex items-center cursor-pointer mx-auto w-fit">
                  <AiOutlineThunderbolt className="text-light-font-100 text-sm dark:text-dark-font-100 mr-[5px]" />
                  <SmallFont>Best Price, 0 fees from Mobula</SmallFont>
                  <BsChevronDown className="text-light-font-100 text-xs dark:text-dark-font-100 ml-[5px]" />
                </div>
              ) : null}
            </InfoPopupQuotes>
          </div>
        </div>
      )}
      {settingsVisible && (
        <Settings visible={settingsVisible} setVisible={setSettingsVisible} />
      )}
      {selectVisible && (
        <Select
          visible={!!selectVisible}
          setVisible={setSelectVisible as Dispatch<SetStateAction<boolean>>}
          position={"in"}
        />
      )}
    </div>
  );
};
