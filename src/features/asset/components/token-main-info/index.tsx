import React, { useContext, useEffect, useMemo, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { TbBellRinging } from "react-icons/tb";
import { Button } from "../../../../components/button";
import { LargeFont, MediumFont, SmallFont } from "../../../../components/fonts";
import { Menu } from "../../../../components/menu";
import { Popover } from "../../../../components/popover";
import { Spinner } from "../../../../components/spinner";
import { UserContext } from "../../../../contexts/user";
import { IWatchlist } from "../../../../interfaces/pages/watchlist";
import { useWatchlist } from "../../../../layouts/tables/hooks/watchlist";
import {
  getClosest,
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../utils/formaters";
import { timestamp, timestamps } from "../../constant";
import { BaseAssetContext } from "../../context-manager";
import { useAthPrice } from "../../hooks/use-athPrice";
import { useMarketMetrics } from "../../hooks/use-marketMetrics";
import { percentageTags } from "../../style";

export const TokenMainInfo = () => {
  const [isHoverStar, setIsHoverStar] = useState(false);
  const [inWl, setInWl] = useState(false);
  const { priceLow, priceHigh } = useAthPrice();
  const {
    baseAsset,
    historyData,
    timeSelected,
    setUserTimeSelected,
    setShowTargetPrice,
    setShowSwap,
    showSwap,
  } = useContext(BaseAssetContext);
  const { handleAddWatchlist, inWatchlist } = useWatchlist(baseAsset.id);
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { marketMetrics } = useMarketMetrics(baseAsset);
  const [metricsChanges, setMetricsChanges] = useState(null);
  const [showFullName, setShowFullName] = useState(false);
  const watchlist: IWatchlist = user?.main_watchlist;

  const getIconFromWatchlistState = () => {
    if (isLoading) return <Spinner extraCss="h-[13px] w-[13px]" />;
    if (inWl || inWatchlist || isHoverStar)
      return <AiFillStar className="text-yellow dark:text-yellow text-lg" />;
    return (
      <AiOutlineStar className=" text-light-font-40 dark:text-dark-font-40 text-lg" />
    );
  };
  const watchlistIcon = getIconFromWatchlistState();
  //   let interval: NodeJS.Timer;

  //   if (isVisible && !interval) {
  //     interval = setInterval(() => {
  //       setTimeout(() => {
  //         if (isVisible) {
  //           const supabase = createSupabaseDOClient();
  //           supabase
  //             .from("assets")
  //             .select("price,volume,market_cap,price_change_24h")
  //             .match({id: token.id})
  //             .single()
  //             .then(r => {
  //               if (
  //                 r.data &&
  //                 (r.data.price !== token.price ||
  //                   r.data.volume !== token.volume ||
  //                   r.data.market_cap !== token.market_cap)
  //               ) {
  //                 setMarketMetrics({
  //                   ...token,
  //                   price: r.data.price,
  //                   priceChange:
  //                     r.data.price !== token.price
  //                       ? r.data.price > token.price
  //                       : undefined,
  //                   volume: r.data.volume,
  //                   volumeChange:
  //                     r.data.volume !== token.volume
  //                       ? r.data.volume > token.volume
  //                       : undefined,
  //                   market_cap: r.data.market_cap,
  //                   marketCapChange:
  //                     r.data.market_cap !== token.market_cap
  //                       ? r.data.market_cap > token.market_cap
  //                       : undefined,
  //                   price_change_24h: r.data.price_change_24h,
  //                 });
  //               }
  //             });
  //         }
  //       }, 5000);
  //     }, 5000);
  //   }

  //   if (!isVisible && interval) {
  //     clearInterval(interval);
  //   }

  //   return () => {
  //     if (interval) clearInterval(interval);
  //   };
  // }, [isVisible]);

  useEffect(() => {
    setMetricsChanges((newMetricsChange) => {
      let updatedPrice;
      if (marketMetrics?.priceChange) updatedPrice = true;
      else if (marketMetrics?.priceChange !== undefined) updatedPrice = false;
      else updatedPrice = newMetricsChange?.price;
      return {
        ...newMetricsChange,
        price: updatedPrice,
      };
    });
    setTimeout(() => {
      setMetricsChanges((newMarketMetricsChange) => ({
        ...newMarketMetricsChange,
        price: null,
      }));
    }, 800);
  }, [marketMetrics?.price]);

  useEffect(() => {
    if (user?.main_watchlist?.assets?.includes(baseAsset?.id)) setInWl(true);
  }, [user?.main_watchlist, baseAsset]);

  const priceChange = useMemo(() => {
    if (historyData?.price_history) {
      return (
        (baseAsset.price /
          getClosest(
            historyData.price_history.concat(
              baseAsset.price_history?.price || []
            ),
            Math.max(Date.now() - timestamp[timeSelected], 0)
          ) -
          1) *
        100
      );
    }
    return baseAsset?.price_change_24h;
  }, [baseAsset, historyData, timeSelected]);

  const getColorFromMarketChange = () => {
    if (metricsChanges?.price) return "text-green dark:text-green";
    if (metricsChanges?.price === false) return "text-red dark:text-red";
    return "text-light-font-100 dark:text-dark-font-100";
  };
  const marketChangeColor = getColorFromMarketChange();
  const isUp = priceChange > 0;

  const [showPriceUnformatted, setShowPriceUnformatted] = useState(false);
  const [showNameUnformatted, setShowNameUnformatted] = useState(false);

  const triggerWatchlist = () => {
    if (inWl) {
      handleAddWatchlist(baseAsset?.id, watchlist?.id, false, setIsLoading);
      setInWl(false);
    } else {
      handleAddWatchlist(baseAsset?.id, watchlist?.id, true, setIsLoading);
      setInWl(true);
    }
  };

  return (
    <div className="flex flex-col w-[60%] lg:w-full">
      <div className="flex items-center justify-start lg:justify-between mb-0 lg:mb-0.5">
        <div className="flex items-center">
          <img
            className="w-[26px] h-[26px] min-w-[26px] lg:w-[22px] lg:h-[22px] lg:min-w-[22px] md:w-[20px] md:h-[20px] md:min-w-[20px] mr-[7.5px] rounded-full"
            src={baseAsset.logo}
            alt={`${baseAsset.name} logo`}
          />
          <div className="flex flex-wrap items-center">
            <Popover
              visibleContent={
                <LargeFont extraCss="mr-[5px] hidden lg:flex">
                  {baseAsset.name.length > 15
                    ? `${baseAsset?.name.slice(0, 15)}...`
                    : baseAsset?.name}
                </LargeFont>
              }
              hiddenContent={<MediumFont>{baseAsset?.name}</MediumFont>}
              onToggle={() => setShowFullName((prev) => !prev)}
              isOpen={showFullName}
            />
            {baseAsset.name.length <= 15 ? (
              <p className="text-2xl lg:text-[22px] md:text-xl font-medium text-light-font-100 dark:text-dark-font-100 mr-[5px] flex lg:hidden">
                {baseAsset?.name}
              </p>
            ) : null}
            {baseAsset.name.length > 15 ? (
              <Popover
                visibleContent={
                  <LargeFont
                    extraCss={`${marketChangeColor} cursor-default text-light-font-100 dark:text-dark-font-100 mr-2.5 flex lg:hidden font-medium text-3xl lg:text-2xl md:text-xl`}
                  >
                    <p className="text-light-font-100 dark:text-dark-font-100 mr-2.5 flex lg:hidden font-medium text-3xl lg:text-2xl md:text-xl">
                      {baseAsset.name.length > 13
                        ? `${baseAsset?.name.slice(0, 13)}...`
                        : baseAsset?.name}
                    </p>
                  </LargeFont>
                }
                hiddenContent={
                  baseAsset.name.length > 13 ? baseAsset?.name : null
                }
                onToggle={() => setShowNameUnformatted((prev) => !prev)}
                isOpen={showNameUnformatted}
                extraCss="top-[35px]"
              />
            ) : null}
            <LargeFont extraCss="mb-0 md:mb-0.5 mt-1.5 md:mt-0 text-light-font-40 dark:text-dark-font-40">
              {baseAsset?.symbol}
            </LargeFont>
          </div>
        </div>
        <div className="flex items-center ml-2.5">
          <Button
            extraCss="text-light-font-40 dark:text-dark-font-40 text-xl ml-[7.5px]
             mt-[5px] mr-0 lg:text-xl md:text-xl ml-0 w-[25px] h-[25px] p-0"
            onMouseEnter={() => setIsHoverStar(true)}
            onMouseLeave={() => setIsHoverStar(false)}
            onClick={triggerWatchlist}
          >
            {watchlistIcon}
          </Button>
          <Button
            extraCss="text-light-font-40 dark:text-dark-font-40 text-xl ml-[7.5px]
             mt-[5px] mr-0 lg:text-xl md:text-xl hover:text-light-font-100 
             hover:dark:text-dark-font-100 transition-all duration-250 w-[25px] h-[25px] p-0"
            onClick={() => setShowTargetPrice(true)}
          >
            <TbBellRinging className="text-lg" />
          </Button>
        </div>
      </div>
      {baseAsset?.tracked ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-start lg:justify-between mt-[5px] mb-[7.5px]">
            <LargeFont
              extraCss={`${marketChangeColor} cursor-default text-light-font-100 dark:text-dark-font-100 mr-2.5 flex lg:hidden font-medium text-3xl lg:text-2xl md:text-xl`}
            >
              ${getFormattedAmount(marketMetrics.price)}
            </LargeFont>
            <div className="flex items-center">
              <div className={`flex mr-2.5 ${percentageTags(isUp)}`}>
                <MediumFont
                  extraCss={
                    isUp
                      ? "text-green dark:text-green"
                      : "text-red dark:text-red"
                  }
                >
                  {isUp ? "+" : ""}
                  {getTokenPercentage(priceChange)}%
                </MediumFont>
              </div>
              <Menu
                titleCss="px-[7.5px] h-[28px] rounded bg-light-bg-terciary dark:bg-dark-bg-terciary
                rounded text-light-font-100 dark:text-dark-font-100 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover
                transition-all duration-250 ease-in-out border border-light-border-primary dark:border-dark-border-primary"
                title={
                  <div className="flex items-center">
                    <SmallFont>{timeSelected}</SmallFont>
                    <BsChevronDown className="ml-[7.5px] text-light-font-100 dark:text-dark-font-100" />
                  </div>
                }
              >
                {timestamps.map((time) => (
                  <button
                    key={time}
                    onClick={() => setUserTimeSelected(time)}
                    className={`transition-all duration-250 py-[5px] bg-light-bg-terciary dark:bg-dark-bg-terciary text-sm lg:text-[13px] md:text-xs 
                       rounded ${
                         timeSelected === time
                           ? "text-light-font-100 dark:text-dark-font-100"
                           : "text-light-font-40 dark:text-dark-font-40 hover:text-light-font-100 hover:dark:text-dark-font-100"
                       }`}
                  >
                    {time}
                  </button>
                ))}
              </Menu>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex h-[7px] w-[50%] lg:w-full bg-[#87878720] rounded mt-[2.5px]">
              <div
                className={`rounded h-full ${
                  isUp ? "bg-green dark:bg-green" : "bg-red dark:bg-red"
                }`}
                style={{
                  width:
                    priceLow && priceHigh
                      ? `${
                          ((marketMetrics.price - priceLow) /
                            (priceHigh - priceLow)) *
                          100
                        }%`
                      : "0%",
                }}
              />
            </div>
            <div className="flex justify-between mt-[7.5px] md:mt-[5px] w-[50%] lg:w-full">
              <div className="flex items-center">
                <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 mr-[5px]">
                  Low
                </SmallFont>
                <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100 font-medium">
                  ${getFormattedAmount(priceLow)}
                </SmallFont>
              </div>
              <div className="flex items-center">
                <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 mr-[5px]">
                  High
                </SmallFont>
                <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100 font-medium">
                  ${getFormattedAmount(priceHigh)}
                </SmallFont>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-[7px] w-[50%] lg:w-full bg-[#87878720] rounded mt-[25px] md:mt-2.5">
          <div
            className={`rounded h-full ${
              isUp ? "bg-green dark:bg-green" : "bg-red dark:bg-red"
            }`}
            style={{
              width:
                priceLow && priceHigh
                  ? `${
                      ((marketMetrics.price - priceLow) /
                        (priceHigh - priceLow)) *
                      100
                    }%`
                  : "0%",
            }}
          />
        </div>
      )}
    </div>
  );
};
