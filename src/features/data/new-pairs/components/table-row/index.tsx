import React from "react";
import { AddressAvatar } from "../../../../../components/avatar";
import { SmallFont } from "../../../../../components/fonts";
import { useTimeAgo } from "../../../../../hooks/time-ago";
import { Segment } from "../../../../../layouts/new-tables/segments";
import { getFormattedAmount } from "../../../../../utils/formaters";

export const TableRow = ({ pair: asset, router, isHover, setIsHover }) => {
  const pair = asset?.pairs?.[0];
  const timeAgo = useTimeAgo(asset?.listed_at);
  console.log("asset", asset);
  return (
    <tbody
      onClick={() => router.push(`/pair/${asset?.address}`)}
      className={` ${
        isHover === asset?.address
          ? "bg-light-bg-terciary dark:bg-dark-bg-terciary"
          : "bg-transparent dark:bg-transparent"
      } cursor-pointer relative transition-all duration-100 ease-linear animate-fadeInTrade`}
      onMouseEnter={() => setIsHover(asset?.address)}
      onMouseLeave={() => setIsHover("")}
    >
      <tr className="relative">
        <Segment
          extraCss={`sticky left-[0px] ${
            isHover === asset?.address
              ? "bg-light-bg-terciary dark:bg-dark-bg-terciary"
              : "bg-light-bg-primary dark:bg-dark-bg-primary"
          } z-[1] transition-all duration-100 ease-linear`}
        >
          <div className="flex items-center">
            <div className="flex items-center md:flex-col md:items-start">
              <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-start">
                <span className="max-w-[120px] truncate">
                  {pair?.[pair?.baseToken]?.symbol}
                </span>{" "}
                /{" "}
                <span className="text-light-font-60 dark:text-dark-font-60">
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
            <SmallFont
              extraCss={`w-fit whitespace-nowrap text-end transition-all duration-100 ease-in-out`}
            >
              $
              {getFormattedAmount(pair?.[pair?.baseToken]?.priceToken, 0, {
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
              {getFormattedAmount(pair?.volume24h, 0, {
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
              {getFormattedAmount(pair?.[pair?.baseToken]?.market_cap, 0, {
                canUseHTML: true,
              })}
            </SmallFont>
          </div>
        </Segment>
        {/* <Segment>
          <div className="w-full flex justify-end">
            <TagPercentage
              isUp={asset?.price_change_5min > 0 || false}
              percentage={convertScientificNotation(item?.price_change_5min)}
              inhert={item?.price_change_5min === 0 || !item?.price_change_5min}
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
              inhert={item?.price_change_24h === 0 || !item?.price_change_24h}
            />
          </div>
        </Segment> */}
        <Segment>
          <div className="w-full flex justify-end">
            <SmallFont extraCss="w-fit whitespace-nowrap text-end">
              {timeAgo || "--"}
            </SmallFont>
          </div>
        </Segment>
      </tr>
    </tbody>
  );
};
