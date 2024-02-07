import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import Link from "next/link";
import React, { useContext, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import { AddressAvatar } from "../../../../components/avatar";
import { LargeFont, SmallFont } from "../../../../components/fonts";
import { Popover } from "../../../../components/popover";
import { TagPercentage } from "../../../../components/tag-percentage";
import { GET } from "../../../../utils/fetch";
import { getFormattedAmount } from "../../../../utils/formaters";
import { BaseAssetContext } from "../../context-manager";

export const PairsSelector = () => {
  const { baseAsset, setAssetPairs, assetPairs } = useContext(BaseAssetContext);

  const fetchPairs = () => {
    if (!assetPairs?.pairs?.length && baseAsset?.[baseAsset?.baseToken]?.name) {
      GET("/api/1/market/pairs", {
        asset: baseAsset?.[baseAsset?.baseToken]?.address,
        blockchain: baseAsset?.blockchain,
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.data) {
            setAssetPairs(r.data);
          }
        });
    }
  };

  useEffect(() => {
    if (baseAsset) fetchPairs();
  }, [baseAsset]);

  const showPopover =
    assetPairs?.pairs?.filter(
      (pair) => pair?.token1?.symbol !== "BNB" && pair?.token0?.symbol !== "BNB"
    )?.length > 0;

  return (
    <Popover
      visibleContent={
        <div
          className="flex items-center justify-between cursor-pointer
          rounded-lg transition-all duration-200 ease-linear w-full"
        >
          <div className="flex items-center">
            <div className="relative w-fit h-fit mr-4 md:mr-3.5">
              {baseAsset?.[baseAsset?.baseToken]?.logo ? (
                <img
                  className="w-[40px] h-[40px] min-w-[40px] md:w-[25px] md:h-[25px] md:min-w-[25px] rounded-full"
                  src={baseAsset?.[baseAsset?.baseToken]?.logo}
                  alt={`${baseAsset?.name} logo`}
                />
              ) : (
                <AddressAvatar
                  address={baseAsset?.address}
                  extraCss="w-[40px] h-[40px] min-w-[40px] md:w-[30px] md:h-[30px] md:min-w-[30px] rounded-full"
                />
              )}
              <img
                className="w-[20px] h-[20px] min-w-[20px] md:w-[15px] md:h-[15px] md:min-w-[15px] absolute -bottom-0.5 -right-1 rounded-full border
                 border-blue dark:border-blue bg-light-bg-hover dark:bg-dark-bg-hover"
                src={blockchainsContent[baseAsset?.blockchain]?.logo}
                alt={`${baseAsset?.blockchain} logo`}
              />
            </div>
            <div className="flex justify-start whitespace-nowrap flex-wrap w-max md:w-auto">
              <LargeFont extraCss="leading-tight text-2xl md:text-lg text-start mr-2">
                <span className=" text-light-font-60 dark:text-dark-font-60 max-w-[160px] truncate">
                  {baseAsset?.[baseAsset?.baseToken]?.name?.length > 15
                    ? `${baseAsset?.[baseAsset?.baseToken]?.name?.slice(
                        0,
                        15
                      )}...`
                    : baseAsset?.[baseAsset?.baseToken]?.name}
                </span>
              </LargeFont>
              <LargeFont extraCss="leading-tight text-2xl md:text-lg text-start">
                <span className="font-medium">
                  {baseAsset?.[baseAsset?.baseToken]?.symbol}
                </span>{" "}
                <span className="text-light-font-60 dark:text-dark-font-60 font-normal">
                  / {baseAsset?.[baseAsset?.quoteToken]?.symbol}
                </span>{" "}
              </LargeFont>
            </div>
          </div>
          <div className="flex items-center ml-10 md:ml-5">
            <div className="flex items-center">
              <LargeFont extraCss="font-normal mr-2.5 text-2xl md:text-lg">
                $
                {getFormattedAmount(
                  baseAsset?.[baseAsset?.baseToken]?.price,
                  0,
                  {
                    canUseHTML: true,
                  }
                )}
              </LargeFont>
              <TagPercentage
                percentage={baseAsset?.price_change_24h}
                isUp={baseAsset?.price_change_24h > 0}
                extraCss="ml-1"
                inhert={baseAsset?.price_change_24h === 0}
              />
            </div>
            {showPopover ? (
              <BiChevronDown className="text-xl text-light-font-60 dark:text-dark-font-60 mx-2 md:mr-0" />
            ) : null}
          </div>
        </div>
      }
      hiddenContent={
        <div className="flex flex-col min-w-[300px] max-h-[410px] w-full overflow-y-scroll scroll">
          {assetPairs?.pairs?.map((pair, i) => (
            <Link href={`/pair/${pair.address}`} key={i}>
              <div
                className="flex items-center justify-between p-2.5 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover cursor-pointer
               transition-all duration-200 ease-linear rounded-md"
              >
                <div className="flex items-center">
                  <div className="relative w-fit h-fit mr-5">
                    {pair?.[baseAsset?.quoteToken]?.logo ? (
                      <img
                        className="w-[34px] h-[34px] min-w-[34px] lg:w-[22px] lg:h-[22px] lg:min-w-[22px] md:w-[20px] md:h-[20px]
                     md:min-w-[20px] rounded-full bg-light-bg-hover dark:bg-dark-bg-hover border-2 border-blue dark:border-blue"
                        src={
                          pair?.[baseAsset?.quoteToken]?.logo ||
                          "/empty/unknown.png"
                        }
                        alt={`${baseAsset?.name} logo`}
                      />
                    ) : (
                      <AddressAvatar
                        address={pair?.[baseAsset?.quoteToken]?.address}
                        extraCss="w-[34px] h-[34px] min-w-[34px] lg:w-[22px] lg:h-[22px] lg:min-w-[22px] md:w-[20px] md:h-[20px]
                      md:min-w-[20px] rounded-full bg-light-bg-hover dark:bg-dark-bg-hover border-2 border-blue dark:border-blue"
                      />
                    )}
                    <div className="w-fit h-fit absolute bottom-[-2px] right-[-5px] rounded-full shadow-2xl border border-light-border-primary dark:border-dark-border-primary">
                      <img
                        className="w-[20px] h-[20px] min-w-[20px] rounded-full  shadow-2xl 
                   bg-light-bg-hover dark:bg-dark-bg-hover"
                        src={
                          blockchainsContent[pair?.blockchain]?.logo ||
                          "/empty/unknown.png"
                        }
                        alt={`${baseAsset?.name} logo`}
                      />
                    </div>
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
                        $
                        {getFormattedAmount(
                          (pair?.token0?.approximateReserveUSD as number) +
                            (pair?.token1?.approximateReserveUSD as number),
                          2,
                          {
                            canUseHTML: true,
                          }
                        )}
                      </SmallFont>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end ml-5">
                  <LargeFont extraCss="leading-tight text-light-font-80 dark:text-dark-font-80">
                    $
                    {getFormattedAmount(pair?.price, 2, {
                      isScientificNotation: true,
                    })}
                  </LargeFont>
                  <div className="flex items-center">
                    <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 text-start text-xs">
                      Volume:
                    </SmallFont>
                    <SmallFont extraCss="text-start text-xs ml-2">
                      ${getFormattedAmount(pair?.volume24h, 2)}
                    </SmallFont>
                  </div>
                </div>
              </div>{" "}
            </Link>
          ))}
        </div>
      }
      showContent={showPopover}
    />
  );
};
