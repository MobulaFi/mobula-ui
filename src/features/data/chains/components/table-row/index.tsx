import { AddressAvatar } from "../../../../../components/avatar";
import { SmallFont } from "../../../../../components/fonts";
import { TagPercentage } from "../../../../../components/tag-percentage";
import { useTimeAgo } from "../../../../../hooks/time-ago";
import { EntryContext } from "../../../../../layouts/new-tables/context-manager";
import { Segment } from "../../../../../layouts/new-tables/segments";
import {
  convertScientificNotation,
  getFormattedAmount,
} from "../../../../../utils/formaters";
import { useChains } from "../../context-manager";

export const TableRow = ({
  pair,
  item,
  oldPairInfo,
  router,
  isHover,
  setIsHover,
}) => {
  const { switchedToNative } = useChains();
  const getColorFromChange = (isUp: boolean | null) => {
    if (isUp === null) return "";
    if (isUp) return "text-green dark:text-green";
    return "text-red dark:text-red";
  };

  const priceChanged =
    item?.price !== oldPairInfo?.[0] &&
    oldPairInfo &&
    oldPairInfo?.[0] !== null;
  const isPriceUp = priceChanged ? item?.price > oldPairInfo?.[0] : null;

  const liquidityChanged =
    item?.pair?.liquidity !== oldPairInfo?.[1] &&
    oldPairInfo &&
    oldPairInfo?.[1] !== null;
  const isLiquidityUp = liquidityChanged
    ? item?.pair?.liquidity > oldPairInfo?.[1]
    : null;

  const volumeChanged =
    item?.pair?.volume24h !== oldPairInfo?.[2] &&
    oldPairInfo &&
    oldPairInfo?.[2] !== null;
  const isVolumeUp = volumeChanged
    ? item?.pair?.volume24h > oldPairInfo?.[2]
    : null;

  const priceColorClass = getColorFromChange(isPriceUp);
  const liquidityColorClass = getColorFromChange(isLiquidityUp);
  const volumeColorClass = getColorFromChange(isVolumeUp);
  const timeAgo = useTimeAgo(item?.last_trade);

  return (
    <>
      <EntryContext.Provider
        value={{ url: `/pair/${pair?.address}`, isHover: isHover }}
      >
        <tbody
          className={` ${
            isHover === pair?.address
              ? "bg-light-bg-terciary dark:bg-dark-bg-terciary"
              : "bg-transparent dark:bg-transparent"
          } cursor-pointer relative transition-all duration-100 ease-linear animate-fadeInTrade`}
          onMouseEnter={() => setIsHover(pair?.address)}
          onMouseLeave={() => setIsHover("")}
        >
          <tr className="relative">
            <Segment
              extraCss={`sticky left-[0px] ${
                isHover === pair?.address
                  ? "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                  : "bg-light-bg-primary dark:bg-dark-bg-primary"
              } z-[1] transition-all duration-100 ease-linear`}
            >
              <div className="flex items-center">
                <div className="flex items-center md:flex-col md:items-start">
                  <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-start">
                    <span className="max-w-[120px] truncate">
                      {pair?.[pair?.baseToken]?.symbol?.length > 10
                        ? pair?.[pair?.baseToken]?.symbol.slice(0, 10) + "..."
                        : pair?.[pair?.baseToken]?.symbol}
                    </span>{" "}
                    /{" "}
                    <span className="text-light-font-60 dark:text-dark-font-60 max-w-[100px] truncate">
                      {pair?.[pair?.quoteToken]?.symbol}
                    </span>
                  </SmallFont>
                  <div className="flex items-center">
                    {pair?.[pair?.baseToken]?.logo ? (
                      <img
                        className="w-[20px] h-[20px] md:w-[15px] md:h-[15px] rounded-full"
                        alt="token logo"
                        src={pair?.[pair?.baseToken]?.logo || ""}
                      />
                    ) : (
                      <AddressAvatar
                        address={pair?.address}
                        extraCss="w-[20px] h-[20px] md:w-[15px] md:h-[15px] rounded-full"
                      />
                    )}
                    <SmallFont extraCss="w-fit ml-2 md:ml-1 whitespace-nowrap text-start max-w-[150px] truncate">
                      {pair?.[pair?.baseToken]?.name}
                    </SmallFont>
                  </div>
                </div>
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                {switchedToNative ? (
                  <SmallFont
                    extraCss={`w-fit whitespace-nowrap text-end ${priceColorClass} transition-all duration-100 ease-in-out`}
                  >
                    {getFormattedAmount(
                      pair?.[pair?.baseToken]?.priceToken,
                      0,
                      {
                        canUseHTML: true,
                      }
                    )}{" "}
                    {pair?.[pair?.quoteToken]?.symbol}
                  </SmallFont>
                ) : (
                  <SmallFont
                    extraCss={`w-fit whitespace-nowrap text-end ${priceColorClass} transition-all duration-100 ease-in-out`}
                  >
                    $
                    {getFormattedAmount(item?.price, 0, {
                      canUseHTML: true,
                    })}
                  </SmallFont>
                )}
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <SmallFont
                  extraCss={`w-fit whitespace-nowrap text-end ${volumeColorClass} transition-all duration-100 ease-in-out`}
                >
                  $
                  {getFormattedAmount(pair?.volume24h, 0, {
                    canUseHTML: true,
                  })}
                </SmallFont>
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <SmallFont
                  extraCss={`w-fit whitespace-nowrap text-end ${liquidityColorClass} transition-all duration-100 ease-in-out`}
                >
                  $
                  {getFormattedAmount(pair?.liquidity, 0, {
                    canUseHTML: true,
                  })}
                </SmallFont>
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <SmallFont
                  extraCss={`w-fit whitespace-nowrap text-end transition-all duration-100 ease-in-out`}
                >
                  $
                  {getFormattedAmount(
                    pair?.[pair?.baseToken]?.circulatingSupply *
                      pair?.[pair?.baseToken]?.price,
                    0,
                    {
                      canUseHTML: true,
                    }
                  )}
                </SmallFont>
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <TagPercentage
                  isUp={item?.price_change_5min > 0 || false}
                  percentage={convertScientificNotation(
                    item?.price_change_5min
                  )}
                  inhert={
                    item?.price_change_5min === 0 || !item?.price_change_5min
                  }
                />
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <TagPercentage
                  isUp={item?.price_change_1h > 0 || false}
                  percentage={convertScientificNotation(item?.price_change_1h)}
                  inhert={item?.price_change_1h === 0 || !item?.price_change_1h}
                />
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <TagPercentage
                  isUp={item?.price_change_4h > 0 || false}
                  percentage={convertScientificNotation(item?.price_change_4h)}
                  inhert={item?.price_change_4h === 0 || !item?.price_change_4h}
                />
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <TagPercentage
                  isUp={item?.price_change_24h > 0 || false}
                  percentage={convertScientificNotation(item?.price_change_24h)}
                  inhert={
                    item?.price_change_24h === 0 || !item?.price_change_24h
                  }
                />
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <SmallFont extraCss="w-fit whitespace-nowrap text-end">
                  {timeAgo || "--"}
                </SmallFont>
              </div>
            </Segment>
          </tr>
        </tbody>
      </EntryContext.Provider>
    </>
  );
};
