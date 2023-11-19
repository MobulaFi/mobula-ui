import {
  Button,
  Menu,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { TbBellRinging } from "react-icons/tb";
import {
  LargeFont,
  MediumFont,
  SmallFont,
  TextLandingLarge,
} from "../../../../components/fonts";
import { UserContext } from "../../../../contexts/user";
import { IWatchlist } from "../../../../interfaces/pages/watchlist";
import { useColors } from "../../../../lib/chakra/colorMode";
import {
  getClosest,
  getFormattedAmount,
  getTokenPercentage,
  removeScNotation,
} from "../../../../utils/formaters";
import { timestamp, timestamps } from "../../constant";
import { BaseAssetContext } from "../../context-manager";
import { useAthPrice } from "../../hooks/use-athPrice";
import { useMarketMetrics } from "../../hooks/use-marketMetrics";
import { percentageTags, squareBox } from "../../style";

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
  const {
    text80,
    boxBg6,
    boxBg3,
    hover,
    borders,
    bordersActive,
    text40,
    text60,
  } = useColors();
  const watchlist: IWatchlist = user?.main_watchlist;

  const getIconFromWatchlistState = () => {
    if (isLoading) return <Spinner extraCss="h-[13px] w-[13px]" />;
    if (inWl || inWatchlist || isHoverStar)
      return <AiFillStar className="text-base text-yellow dark:text-yellow" />;
    return (
      <AiOutlineStar className="text-base text-light-font-40 dark:text-dark-font-40" />
    );
  };
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
    if (metricsChanges?.price) return "green";
    if (metricsChanges?.price === false) return "red";
    return text80;
  };
  const isUp = priceChange > 0;

  return (
    <div className="flex flex-col w-[60%] lg:w-full">
      <div className="flex items-center justify-start lg:justify-between mb-0 lg:mb-0.5">
        <div className="flex items-center">
          <img
            className="w-[24px] h-[24px] min-w-[24px] lg:w-[22px] lg:h-[22px] lg:min-w-[22px] md:w-[20px] md:h-[20px] md:min-w-[20px] mr-[7.5px] rounded-full"
            src={baseAsset.logo}
            alt={`${baseAsset.name} logo`}
          />
          <div className="flex flex-wrap items-center">
            <Tooltip
              hasArrow
              label={baseAsset?.name}
              bg={boxBg6}
              border={borders}
              borderRadius="8px"
              placement="bottom"
              color={text80}
              py="2.5px"
              px="10px"
            >
              <LargeFont extraCss="mr-[5px] hidden lg:flex">
                {baseAsset.name.length > 15
                  ? `${baseAsset?.name.slice(0, 15)}...`
                  : baseAsset?.name}
              </LargeFont>
            </Tooltip>
            {baseAsset.name.length <= 15 ? (
              <p className="text-2xl lg:text-[22px] md:text-xl font-medium text-light-font-100 dark:text-dark-font-100 mr-[5px] flex lg:hidden">
                {baseAsset?.name}
              </p>
            ) : null}
            {baseAsset.name.length > 15 ? (
              <Popover trigger="hover" matchWidth>
                <PopoverTrigger>
                  <Button>
                    <TextLandingLarge
                      fontWeight="500"
                      color={getColorFromMarketChange()}
                      cursor="default"
                    >
                      <Text
                        fontSize={["20px", "20px", "26px", "32px"]}
                        fontWeight="500"
                        color={text80}
                        mr="10px"
                        display={["none", "none", "none", "flex"]}
                      >
                        {baseAsset.name.length > 13
                          ? `${baseAsset?.name.slice(0, 13)}...`
                          : baseAsset?.name}
                      </Text>
                    </TextLandingLarge>
                  </Button>
                </PopoverTrigger>
                {baseAsset.name.length > 13 ? (
                  <PopoverContent
                    maxW="fit-content"
                    bg={boxBg3}
                    border={borders}
                    p="0px"
                    borderRadius="8px"
                  >
                    <PopoverBody color={text80}>{baseAsset?.name}</PopoverBody>
                  </PopoverContent>
                ) : null}
              </Popover>
            ) : null}
            <LargeFont extraCss="mb-0 md:mb-0.5 mt-[3px] md:mt-0 text-light-font-40 dark:text-dark-font-40">
              {baseAsset?.symbol}
            </LargeFont>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            extraCss={`${squareBox} ml-0`}
            onMouseEnter={() => setIsHoverStar(true)}
            onMouseLeave={() => setIsHoverStar(false)}
            onClick={() => {
              if (inWl) {
                handleAddWatchlist(
                  baseAsset?.id,
                  watchlist?.id,
                  false,
                  setIsLoading
                );
                setInWl(false);
              } else {
                handleAddWatchlist(
                  baseAsset?.id,
                  watchlist?.id,
                  true,
                  setIsLoading
                );
                setInWl(true);
              }
            }}
          >
            {getIconFromWatchlistState()}
          </Button>

          <Button
            extraCss="text-light-font-40 dark:text-dark-font-40 text-xl w-[26px] h-[26px] min-w-[26px] ml-[7.5px] mt-[5px] mr-0"
            onClick={() => setShowTargetPrice(true)}
          >
            <TbBellRinging className="text-lg" />
          </Button>
        </div>
      </div>
      {baseAsset?.tracked ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-start lg:justify-between mt-[5px] mb-[7.5px]">
            <Popover trigger="hover" matchWidth>
              <PopoverTrigger>
                <Button>
                  <TextLandingLarge
                    fontSize={["24px", "24px", "24px", "32px"]}
                    fontWeight="500"
                    color={getColorFromMarketChange()}
                  >
                    ${getFormattedAmount(marketMetrics.price)}
                  </TextLandingLarge>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                maxW="fit-content"
                bg={boxBg3}
                border={borders}
                p="0px"
                borderRadius="8px"
              >
                <PopoverBody color={text80}>
                  {removeScNotation(marketMetrics.price)}
                </PopoverBody>
              </PopoverContent>
            </Popover>
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
              <Menu titleCss="px-[7.5px] h-[28px] rounded" title={timeSelected}>
                {/* <MenuButton
                  border={borders}
                  borderRadius="8px"
                  color={text80}
                  fontWeight="400"
                  h="28px"
                  px="7.5px"
                  bg={boxBg6}
                  _hover={{ border: bordersActive, bg: hover }}
                  transition="all 250ms ease-in-out"
                  fontSize={["12px", "12px", "13px", "14px"]}
                  as={Button}
                  rightIcon={<ChevronDownIcon pl="0px" mr="-2px" ml="-5px" />}
                >
                  {timeSelected}
                </MenuButton> */}
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
