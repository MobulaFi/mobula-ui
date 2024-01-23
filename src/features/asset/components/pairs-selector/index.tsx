import React, { useContext, useEffect } from "react";
import { LargeFont, MediumFont } from "../../../../components/fonts";
import { Popover } from "../../../../components/popover";
import { GET } from "../../../../utils/fetch";
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
          setAssetPairs(r.data);
        }
      });
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  console.log("assetPairs", assetPairs);

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
            <LargeFont extraCss="leading-tight">
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
        </div>
      }
      hiddenContent={
        <div className="p-2.5 flex flex-col bg-red">
          {assetPairs?.pairs?.map((pair, i) => (
            <div className="flex items-center mb-1 md:mb-0" key={i}>
              <img
                className="w-[38px] h-[38px] min-w-[38px] lg:w-[22px] lg:h-[22px] lg:min-w-[22px] md:w-[20px] md:h-[20px] md:min-w-[20px] mr-2.5 rounded-full"
                src={"/logo/bitcoin.png"}
                alt={`${baseAsset?.name} logo`}
              />
              <div className="flex flex-col">
                <LargeFont extraCss="leading-tight">
                  <span className="font-medium">BTC</span>{" "}
                  <span className="text-light-font-60 dark:text-dark-font-60">
                    /
                  </span>{" "}
                  ETH
                </LargeFont>
                <MediumFont extraCss="text-light-font-60 dark:text-dark-font-60 text-start leading-[16px]">
                  Bitcoin
                </MediumFont>
              </div>
            </div>
          ))}
        </div>
      }
    />
  );
};
