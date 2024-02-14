import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { PairsProps } from "../../models";

export const TableTbody = () => {
  const { pairs: pairsBuffer } = useChains();
  const router = useRouter();
  const [isHover, setIsHover] = useState("");
  const [pairs, setPairs] = useState<{
    pair: PairsProps[];
    newPairs: PairsProps[];
  }>({
    pair: [],
    newPairs: pairsBuffer,
  });

  useEffect(() => {
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_PRICE_WSS_ENDPOINT as string
    );

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          type: "pair",
          authorization: process.env.NEXT_PUBLIC_PRICE_KEY,
          payload: {
            blockchain: pairs?.newPairs?.[0]?.pair?.blockchain,
            interval: 5,
          },
        })
      );
    });

    socket.addEventListener("message", (event) => {
      console.log("Message from server ");
      const { data } = JSON.parse(event.data);
      const newPairsMap = data.reduce((acc, item) => {
        acc[item.pair.address] = item;
        return acc;
      }, {});

      setPairs((prevPairs) => {
        const newWebSocketPairs = prevPairs.newPairs.map((pair) => {
          const newData = newPairsMap[pair.pair.address];
          if (newData) {
            return {
              ...pair,
              ...newData,
            };
          } else {
            return pair;
          }
        });

        return {
          pair: prevPairs.newPairs,
          newPairs: newWebSocketPairs,
        };
      });
    });
  }, []);

  const getColorFromPriceChange = (isUp: boolean | null) => {
    if (isUp === null) return "";
    if (isUp) return "text-green dark:text-green";
    return "text-red dark:text-red";
  };

  return (
    <>
      {pairs?.newPairs
        ?.filter((entry) => entry?.price !== 0)
        ?.map((item, i) => {
          const pair = item?.pair;
          const timeAgo = useTimeAgo(item?.last_trade);
          const prevPair = pairs?.pair?.find(
            (prev) => prev.pair.address === pair.address
          );
          const priceChanged = item.price !== (prevPair?.price || item.price);
          let isUp: boolean | null = null;
          if (priceChanged) {
            isUp = item.price > (prevPair?.price || item.price);
          }

          return (
            <tbody
              key={i}
              onClick={() => router.push(`/pair/${pair?.address}`)}
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
                  <div className="w-full flex justify-end">
                    <SmallFont
                      extraCss={`w-fit mr-2.5 whitespace-nowrap text-end ${getColorFromPriceChange(
                        isUp
                      )} transition-all duration-100 ease-in-out`}
                    >
                      $
                      {getFormattedAmount(item?.price, 0, {
                        canUseHTML: true,
                      })}
                    </SmallFont>
                  </div>
                </Segment>
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
                        item?.price_change_5min === 0 ||
                        !item?.price_change_5min
                      }
                    />
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <TagPercentage
                      isUp={item?.price_change_1h > 0 || false}
                      percentage={convertScientificNotation(
                        item?.price_change_1h
                      )}
                      inhert={
                        item?.price_change_1h === 0 || !item?.price_change_1h
                      }
                    />
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <TagPercentage
                      isUp={item?.price_change_4h > 0 || false}
                      percentage={convertScientificNotation(
                        item?.price_change_4h
                      )}
                      inhert={
                        item?.price_change_4h === 0 || !item?.price_change_4h
                      }
                    />
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <TagPercentage
                      isUp={item?.price_change_24h > 0 || false}
                      percentage={convertScientificNotation(
                        item?.price_change_24h
                      )}
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
              </tr>
            </tbody>
          );
        })}
    </>
  );
};
