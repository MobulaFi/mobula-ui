import { useRouter } from "next/navigation";
import React from "react";
import { AddressAvatar } from "../../../../../components/avatar";
import { SmallFont } from "../../../../../components/fonts";
import { TagPercentage } from "../../../../../components/tag-percentage";
import { useTimeAgo } from "../../../../../hooks/time-ago";
import { Segment } from "../../../../../layouts/new-tables/segments";
import {
  convertScientificNotation,
  getFormattedAmount,
} from "../../../../../utils/formaters";
import { useChains } from "../../context-manager";

export const TableTbody = () => {
  const { pairs } = useChains();
  const router = useRouter();

  return (
    <>
      {pairs?.map((item, i) => {
        const pair = item?.pair;
        const timeAgo = useTimeAgo(item?.last_trade);
        if (pair?.[pair?.baseToken]?.symbol === "SPONGE")
          console.log("item?.price_change_24h", item?.price_change_24h);

        return (
          <tbody
            key={i}
            onClick={() => router.push(`/pair/${pair?.address}`)}
            className="cursor-pointer hover:bg-light-bg-terciary hover:dark:bg-dark-bg-terciary transition-all duration-100 ease-linear"
          >
            <Segment>
              <div className="flex items-center">
                <div className="flex items-center md:flex-col md:items-start">
                  <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-start">
                    {pair?.[pair?.baseToken]?.symbol} /{" "}
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
              {" "}
              <div className="w-full flex justify-end">
                <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                  $
                  {getFormattedAmount(item?.price, 0, {
                    canUseHTML: true,
                  })}
                </SmallFont>
              </div>
            </Segment>
            {/* <Segment>
                            <div className="w-full flex justify-end">
                              <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                                {getFormattedAmount(pair?.trades)}
                              </SmallFont>
                            </div>
                          </Segment> */}
            <Segment>
              <div className="w-full flex justify-end">
                <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                  ${getFormattedAmount(pair?.volume24h)}
                </SmallFont>
              </div>
            </Segment>
            <Segment>
              <div className="w-full flex justify-end">
                <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                  ${getFormattedAmount(pair?.liquidity)}
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
                <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                  {timeAgo || "--"}
                </SmallFont>
              </div>
            </Segment>
          </tbody>
        );
      })}
    </>
  );
};
