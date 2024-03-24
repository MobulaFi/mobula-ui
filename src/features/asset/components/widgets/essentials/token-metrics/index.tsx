import { useContext, useState } from "react";
import { BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";
import { Button } from "../../../../../../components/button";
import { Collapse } from "../../../../../../components/collapse";
import { SmallFont } from "../../../../../../components/fonts";
import { NextChakraLink } from "../../../../../../components/link";
import { Tooltip } from "../../../../../../components/tooltip";
import { pushData } from "../../../../../../lib/mixpanel";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import {
  formatAmount,
  getFormattedDate,
} from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { Metrics } from "../../../../models";
import { FlexBorderBox } from "../../../../style";

interface TokenMetricsProps {
  isMobile?: boolean;
  extraCss?: string;
}

export const TokenMetrics = ({ isMobile, extraCss }: TokenMetricsProps) => {
  const [showMore, setShowMore] = useState(false);
  const { baseAsset, isAssetPage } = useContext(BaseAssetContext);
  const metrics: Metrics[] = [
    {
      title: "Total Volume (24h)",
      value:
        (baseAsset?.off_chain_volume || 0) + (Number(baseAsset?.volume) || 0),
      info: "The Total Volume is the sum of the CEX & DEX Volume (24h)",
    },
    {
      title: "Market Cap",
      value: baseAsset?.market_cap,
      info: "The Market Cap is the product of the current price and the total supply of the asset.",
    },
    {
      title: "Fully Diluted Val.",
      value: baseAsset?.market_cap_diluted || "-",
      info: "The Diluted Market Cap is the Market Cap including all locked tokens.",
    },
    {
      title: "CEX Volume (24h)",
      value: baseAsset?.off_chain_volume,
      info: "The CEX Volume is the total amount worth of asset traded on centralized exchanges in the last 24 hours.",
    },
    {
      title: "DEX Volume (24h)",
      value: baseAsset?.volume,
      info: "The DEX Volume is the total amount worth of asset traded on decentralized exchanges (Uniswap V2-forks only yet) in the last 24 hours.",
    },
    {
      title: "Liquidity",
      value: baseAsset?.liquidity,
      info: "The Liquidity is the total amount locked in the asset's on-chain liquidity pools.",
    },
    {
      title: "Circ. Supply",
      value: baseAsset?.circulating_supply,
      info: "The Circulating Supply is the total amount of tokens in circulation.",
      dollar: false,
    },
    {
      title: "Total Supply",
      value: baseAsset?.total_supply || "-",
      info: "The Total Supply is the total amount of tokens that can be created.",
      dollar: false,
    },
    {
      title: "Rank",
      value: baseAsset?.rank,
      info: "The Rank is the position of the asset in the ranking of all assets by market cap.",
      dollar: false,
    },
  ];

  const isLargerThan991 =
    typeof window !== "undefined" && window.innerWidth > 991;

  type pairMetricsType = {
    title: string;
    value: number | string;
    extra?: string;
    dollar?: boolean;
  };

  const pairsMetrics: pairMetricsType[] = [
    {
      title: "Total Supply",
      value: baseAsset?.[baseAsset.baseToken]?.totalSupply || "-",
      extra: " " + baseAsset?.[baseAsset.baseToken]?.symbol,
      dollar: false,
    },
    {
      title: baseAsset?.token0?.symbol + " Pooled",
      value: baseAsset?.token0?.approximateReserveToken,
      extra: " " + baseAsset?.token0?.symbol,
      dollar: false,
    },
    {
      title: baseAsset?.token1?.symbol + " Pooled",
      value: baseAsset?.token1?.approximateReserveToken,
      extra: " " + baseAsset?.token1?.symbol,
      dollar: false,
    },
    {
      title: "Liquidity",
      value:
        baseAsset?.token0?.approximateReserveUSD +
        baseAsset?.token1?.approximateReserveUSD,
    },
    {
      title: "Volume",
      value: baseAsset?.volume_24h,
    },
    {
      title: "Market Cap",
      value:
        baseAsset?.[baseAsset.baseToken]?.circulatingSupply *
        baseAsset?.[baseAsset.baseToken]?.price,
    },
    // {
    //   title: "Pair created at",
    //   value: getFormattedDate(new Date(baseAsset?.createdAt).getTime()),
    //   info: "The date of the pair creation",
    // },
  ];

  if (
    baseAsset?.createdAt &&
    baseAsset?.createdAt !== "1970-01-01T00:00:00.000Z"
  ) {
    pairsMetrics.push({
      title: "Pair created at",
      value: getFormattedDate(baseAsset?.createdAt),
      dollar: false,
    });
  }

  return (
    <div className={cn(`${FlexBorderBox} w-full`, extraCss)}>
      <div className="z-[1] text-lg lg:text-base font-medium mb-2.5 text-light-font-100 dark:text-dark-font-100 items-center flex px-0 md:px-[2.5%] pt-0 md:pt-[15px]">
        {isAssetPage ? "Token Metrics" : "Pair Metrics"}
        <div className="flex items-center ml-auto text-xs">
          Need data?
          <NextChakraLink
            href="https://developer.mobula.fi/reference/market-api?utm_source=website&utm_medium=asset&utm_campaign=asset"
            target="_blank"
            rel="noreferrer"
            extraCss="ml-[5px] text-blue dark:text-blue text-xs"
            onClick={() => {
              pushData("API Clicked");
            }}
          >
            Our API
          </NextChakraLink>
        </div>
      </div>
      <Collapse
        startingHeight={isLargerThan991 ? "max-h-full" : "max-h-[129px]"}
        isOpen={showMore}
      >
        {(isAssetPage ? metrics : pairsMetrics).map((entry, i) => {
          const isNotDollar = entry.dollar === false;
          const noLiquidity = entry.title === "Liquidity" && entry.value === 0;
          const isDate = entry.title === "Pair created at";
          return (
            <div
              className={`z-[1] flex w-full justify-between items-center ${
                i === 0 ? "border-0" : "border-t"
              } border-light-border-primary dark:border-dark-border-primary py-2.5 px-0 md:px-[2.5%] ${
                metrics.length - 1 === i ? "pb-0" : "pb-2.5"
              } `}
              key={entry.title}
            >
              <div className="flex items-center">
                <SmallFont
                  extraCss={`text-light-font-60 dark:text-dark-font-60 font-medium text-sm lg:text-[13px] ${
                    noLiquidity ? "opacity-50" : ""
                  }`}
                >
                  {entry.title}
                </SmallFont>
                {entry?.info ? (
                  <Tooltip
                    tooltipText={entry.info as string}
                    extraCss="left-0 max-w-[200px] top-[20px]"
                    // info={entry.info}
                    // extraCss=""
                    // mb="3px"
                    // cursor="pointer"
                    // position={
                    //   "right" as PlacementWithLogical & ResponsiveValue<any>
                    // }
                    // noClose
                  />
                ) : null}
              </div>
              <div
                className={`${
                  noLiquidity ? "opacity-50" : ""
                } flex items-center`}
              >
                {isDate ? (
                  <p className="text-[13px] text-light-font-100 dark:text-dark-font-100 font-medium">
                    {entry.value}
                  </p>
                ) : (
                  <p className="text-[13px] text-light-font-100 dark:text-dark-font-100 font-medium">
                    {(!isNotDollar ? "$" : "") +
                      formatAmount(entry.value) +
                      (entry.extra ?? "")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </Collapse>
      {isMobile ? (
        <Button
          extraCss={`h-[30px] w-full mt-0 ${
            showMore ? "mt-2.5" : "mt-0"
          } md:rounded-0`}
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? (
            <>
              Less Data
              <BiSolidChevronUp className="text-sm ml-[5px]" />
            </>
          ) : (
            <>
              More Data
              <BiSolidChevronDown className="text-sm ml-[5px]" />
            </>
          )}
        </Button>
      ) : null}
    </div>
  );
};
