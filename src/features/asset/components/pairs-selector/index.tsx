import React, { useContext, useEffect } from "react";
import { LargeFont, MediumFont, SmallFont } from "../../../../components/fonts";
import { Popover } from "../../../../components/popover";
import { famousContractsLabelFromName } from "../../../../layouts/swap/utils";
import { GET } from "../../../../utils/fetch";
import { getFormattedAmount } from "../../../../utils/formaters";
import { BaseAssetContext } from "../../context-manager";

export const PairsSelector = () => {
  const { baseAsset, setAssetPairs, assetPairs } = useContext(BaseAssetContext);

  const fetchPairs = () => {
    if (assetPairs.length > 0) return;
    GET("/api/1/market/pairs", {
      asset: baseAsset?.[baseAsset?.baseToken]?.name,
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.data) {
          setAssetPairs([baseAsset, ...r.data]);
        }
      });
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  console.log("assetPairs", baseAsset);

  return (
    <Popover
      visibleContent={
        <div className="flex items-center mb-1 md:mb-0">
          <img
            className="w-[38px] h-[38px] min-w-[38px] lg:w-[22px] lg:h-[22px] lg:min-w-[22px] md:w-[20px] md:h-[20px] md:min-w-[20px] mr-2.5 rounded-full"
            src={baseAsset?.[baseAsset?.baseToken]?.logo}
            alt={`${baseAsset?.name} logo`}
          />
          <div className="flex flex-col">
            <LargeFont extraCss="leading-tight font-normal">
              <span className="font-medium">
                {baseAsset?.[baseAsset?.baseToken]?.symbol}
              </span>{" "}
              <span className="text-light-font-60 dark:text-dark-font-60">
                /
              </span>{" "}
              {baseAsset?.[baseAsset?.quoteToken]?.symbol}
            </LargeFont>
            <MediumFont extraCss="text-light-font-60 dark:text-dark-font-60 text-start leading-[16px]">
              {baseAsset?.[baseAsset?.baseToken]?.name}
            </MediumFont>
          </div>

          {/* <LargeFont
            extraCss={`${marketChangeColor} cursor-default text-light-font-100 dark:text-dark-font-100 mr-2.5 flex font-medium text-3xl lg:text-xl md:text-xl`}
          >
            ${getFormattedAmount(marketMetrics.price)}
          </LargeFont>
          <div className="flex items-center"> 
          <div className={`flex mr-2.5 md:mr-1 ${percentageTags(isUp)}`}>
            <MediumFont
              extraCss={`md:text-xs lg:text-xs ${
                isUp ? "text-green dark:text-green" : "text-red dark:text-red"
              }`}
            >
              {isUp ? "+" : ""}
              {getTokenPercentage(priceChange)}%
            </MediumFont>
          </div>
          <Menu
            titleCss="px-[7.5px] h-[28px] md:h-[24px] rounded-md bg-light-bg-terciary dark:bg-dark-bg-terciary
                rounded-md text-light-font-100 dark:text-dark-font-100 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover
                transition-all duration-200 ease-in-out border border-light-border-primary dark:border-dark-border-primary"
            title={
              <div className="flex items-center">
                <SmallFont>{timeSelected}</SmallFont>
                <BsChevronDown className="ml-[7.5px] md:ml-[5px] text-sm md:text-xs text-light-font-100 dark:text-dark-font-100" />
              </div>
            }
          >
            {timestamps.map((time) => (
              <button
                key={time}
                onClick={() => setTimeSelected(time)}
                className={`transition-all duration-200 py-[5px] bg-light-bg-terciary dark:bg-dark-bg-terciary text-sm lg:text-[13px] md:text-xs 
                       rounded-md ${
                         timeSelected === time
                           ? "text-light-font-100 dark:text-dark-font-100"
                           : "text-light-font-40 dark:text-dark-font-40 hover:text-light-font-100 hover:dark:text-dark-font-100"
                       }`}
              >
                {time}
              </button>
            ))}
          </Menu>*/}
        </div>
      }
      hiddenContent={
        <div className="flex flex-col min-w-[300px] max-h-[410px] overflow-y-scroll scroll">
          {assetPairs?.pairs?.map((pair, i) => (
            <div
              className="flex items-center justify-between p-2.5 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover cursor-pointer
               transition-all duration-200 ease-linear rounded-md"
              key={i}
            >
              <div className="flex items-center">
                <div className="relative w-fit h-fit mr-5">
                  <img
                    className="w-[34px] h-[34px] min-w-[34px] lg:w-[22px] lg:h-[22px] lg:min-w-[22px] md:w-[20px] md:h-[20px]
                     md:min-w-[20px] rounded-full bg-light-bg-hover dark:bg-dark-bg-hover border-2 border-blue dark:border-blue"
                    src={
                      pair?.[baseAsset?.quoteToken]?.logo ||
                      "/empty/unknown.png"
                    }
                    alt={`${baseAsset?.name} logo`}
                  />
                  <img
                    className="w-[20px] h-[20px] min-w-[20px] rounded-full absolute bottom-[-2px] right-[-5px] shadow-xl 
                  border-2 border-light-border-primary dark:border-dark-border-primary bg-light-bg-hover dark:bg-dark-bg-hover"
                    src={
                      famousContractsLabelFromName[pair?.protocol]?.logo ||
                      "/empty/unknown.png"
                    }
                    alt={`${baseAsset?.name} logo`}
                  />
                </div>
                <div className="flex flex-col">
                  <LargeFont extraCss="leading-tight">
                    <span className="font-medium">
                      {" "}
                      {pair?.[baseAsset?.baseToken]?.symbol}
                    </span>{" "}
                    <span className="text-light-font-60 dark:text-dark-font-60 font-normal">
                      / {pair?.[baseAsset?.quoteToken]?.symbol}
                    </span>
                  </LargeFont>
                  <div className="flex items-center">
                    <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 text-start text-xs">
                      Liquidity:
                    </SmallFont>
                    <SmallFont extraCss="text-start text-xs ml-2">
                      ${getFormattedAmount(pair?.liquidity, 2)}
                    </SmallFont>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end ml-5">
                <LargeFont extraCss="leading-tight text-light-font-80 dark:text-dark-font-80">
                  $
                  {getFormattedAmount(
                    pair?.price,
                    2,
                    {
                      minifyZeros: true,
                      minifyBigNumbers: true,
                    },
                    true
                  )}
                </LargeFont>
                <div className="flex items-center">
                  <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 text-start text-xs">
                    Volume:
                  </SmallFont>
                  <SmallFont extraCss="text-start text-xs ml-2">
                    ${getFormattedAmount(pair?.volume, 2)}
                  </SmallFont>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
};
