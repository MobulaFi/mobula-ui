import { getFormattedAmount } from "@utils/formaters";
import { AddressAvatar } from "components/avatar";
import { Skeleton } from "components/skeleton";
import { TagPercentage } from "components/tag-percentage";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { Font, MediumFont } from "../../../../../components/fonts";
import { EntryContext } from "../../../../../layouts/new-tables/context-manager";
import { Segment } from "../../../../../layouts/new-tables/segments/index";
import { cn } from "../../../../../lib/shadcn/lib/utils";
import { GET } from "../../../../../utils/fetch";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const ChainBox = ({ blockchain }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pairsData, setPairsData] = useState([]);
  const [history, setHistory] = useState([]);

  const header = {
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
    },
  };

  const fetchPairs = async () => {
    if (pairsData?.length > 0) return;
    GET(
      `/api/1/market/blockchain/pairs`,
      {
        blockchain: blockchain?.shortName || blockchain.name,
      },
      false,
      header
    )
      .then((response) => response.json())
      .then((r) => {
        setIsLoading(false);
        if (r.data) {
          setPairsData(r.data.slice(0, 6));
        }
      });

    GET(
      "/api/1/market/blockchain/stats",
      {
        blockchain: blockchain?.shortName || blockchain.name,
      },
      false,
      header
    )
      .then((r) => r.json())
      .then((r) => {
        if (r.data) {
          setHistory(r.data.volume_history);
        }
      });
  };

  //   const fetchChain = fetch(
  //   `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/blockchain/stats?blockchain=${blockchain}`,
  //   {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
  //     },
  //   }
  // );

  useEffect(() => {
    fetchPairs();
  }, []);

  console.log("voleelele", history);

  return (
    <div
      className="flex flex-col w-[49%] md:w-full bg-light-bg-secondary dark:bg-dark-bg-secondary 
    rounded-lg border border-light-border-primary dark:border-dark-border-primary mb-5 md:mb-2.5 sm:rounded-none"
    >
      <div className="flex items-center justify-between w-full p-5 relative">
        <div className="flex items-center">
          <img
            className="h-[60px] w-[60px] lg:h-[40px] lg:w-[40px] mr-4 lg:mr-2.5 rounded-full object-cover bg-light-bg-hover dark:bg-light-bg-hover"
            src={blockchain.logo}
            alt={blockchain.name}
          />
          <div>
            <MediumFont extraCss="leading-tight text-2xl">
              {blockchain?.shortName || blockchain.name}
            </MediumFont>
            <MediumFont extraCss="text-light-font-60 dark:text-dark-font-60 leading-tighter text-lg">
              {blockchain.eth.symbol}
            </MediumFont>
          </div>
        </div>
        <div className="w-[200px] absolute -top-9 right-5">
          <EChart
            data={history || []}
            timeframe="24H"
            leftMargin={["0%", "0%"]}
            height="120px"
            bg="transparent"
            type="Volume"
            noDataZoom
            noAxis
            width="100%"
          />{" "}
        </div>
      </div>
      <table>
        {(isLoading ? Array.from({ length: 6 }) : pairsData)?.map((data, i) => {
          const baseToken = data?.pair?.[data.pair.baseToken];
          const quoteToken = data?.pair?.[data.pair.quoteToken];
          const segmentStyle = `py-2 border-light-border-secondary dark:border-dark-border-secondary px-2.5 ${
            i === 5 ? "border-0" : ""
          } ${i === 0 ? "border-t" : ""}`;
          return (
            <>
              <EntryContext.Provider
                value={{ url: `/pair/${data?.pair?.address}`, isHover: false }}
              >
                <tbody
                  key={i}
                  className="hover:bg-light-bg-terciary hover:dark:bg-dark-bg-terciary cursor-pointer transition-all duration-200 ease-in-out"
                >
                  <tr>
                    <Segment extraCss={cn("text-start", segmentStyle)}>
                      <div className="flex w-full items-center">
                        {isLoading ? (
                          <Skeleton extraCss="h-[35px] w-[35px] rounded-full mr-2.5" />
                        ) : (
                          <>
                            {baseToken?.logo ? (
                              <img
                                className="w-[35px] h-[35px] lg:w-[25px] lg:h-[25px] mr-2.5 rounded-full object-cover bg-light-bg-hover dark:bg-light-bg-hover"
                                src={baseToken?.logo}
                                alt={baseToken?.name}
                              />
                            ) : (
                              <AddressAvatar
                                address={data?.pair?.address}
                                extraCss="w-[35px] h-[35px] lg:w-[25px] lg:h-[25px] mr-2.5 rounded-full"
                              />
                            )}
                          </>
                        )}
                        {isLoading ? (
                          <div>
                            <Skeleton extraCss="h-4 w-[100px]" />
                            <Skeleton extraCss="h-3 mt-1 w-[120px]" />
                          </div>
                        ) : (
                          <div>
                            <Font extraCss="font-medium text-sm lg:text-[13px]">
                              {baseToken?.symbol} /{" "}
                              <span className="text-light-font-40 dark:text-dark-font-40 font-normal">
                                {quoteToken?.symbol}
                              </span>
                            </Font>
                            <Font extraCss="text-light-font-60 dark:text-dark-font-60 lg:text-[13px] truncate max-w-[130px]">
                              {baseToken?.name}
                            </Font>
                          </div>
                        )}
                      </div>
                    </Segment>
                    <Segment extraCss={segmentStyle}>
                      {isLoading ? (
                        <Skeleton extraCss="h-3.5 w-[100px]" />
                      ) : (
                        <Font extraCss="font-medium text-sm lg:text-[13px]">
                          $
                          {getFormattedAmount(data?.price, 0, {
                            canUseHTML: true,
                          })}
                        </Font>
                      )}
                    </Segment>
                    <Segment extraCss={segmentStyle}>
                      <div className="flex justify-end w-full">
                        <TagPercentage
                          percentage={data?.price_change_24h}
                          isUp={data?.price_change_24h > 0}
                          inhert={data?.price_change_24h === 0}
                          isLoading={isLoading}
                        />
                      </div>
                    </Segment>
                  </tr>
                </tbody>
              </EntryContext.Provider>
            </>
          );
        })}
      </table>
    </div>
  );
};
