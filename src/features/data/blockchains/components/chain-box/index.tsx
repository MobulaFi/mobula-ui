import { AddressAvatar } from "components/avatar";
import { Skeleton } from "components/skeleton";
import { TagPercentage } from "components/tag-percentage";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { Font, MediumFont, SmallFont } from "../../../../../components/fonts";
import { Popover } from "../../../../../components/popover";
import { EntryContext } from "../../../../../layouts/new-tables/context-manager";
import { GET } from "../../../../../utils/fetch";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { PairsProps } from "../../../chains/models";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const ChainBox = ({ blockchain }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pairsData, setPairsData] = useState<PairsProps[]>([]);
  const [history, setHistory] = useState<[number, number][]>([]);
  const [showInfo, setShowInfo] = useState(false);

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
          setPairsData(
            r.data?.filter((entry) => entry?.price > 0)?.slice(0, 6)
          );
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

  useEffect(() => {
    fetchPairs();
  }, []);

  return (
    <div
      className="flex flex-col w-[49%] md:w-full bg-light-bg-secondary dark:bg-dark-bg-secondary 
    rounded-lg border border-light-border-primary dark:border-dark-border-primary mb-5 md:mb-2.5 sm:rounded-none overflow-hidden"
    >
      <div
        className={`flex items-center justify-between w-full p-2.5 relative md:px-2.5`}
      >
        <div className="flex items-center rounded-full">
          <img
            className="h-[50px] w-[50px] lg:h-[40px] lg:w-[40px] mr-4 lg:mr-2.5 rounded-full object-cover bg-light-bg-hover dark:bg-light-bg-hover"
            style={{ boxShadow: `1px 2px 13px 3px ${blockchain.color}` }}
            src={blockchain.logo}
            alt={blockchain.name}
          />
          <div>
            <MediumFont extraCss="leading-tight text-xl">
              {blockchain?.shortName || blockchain.name}
            </MediumFont>
            <MediumFont extraCss="text-light-font-60 dark:text-dark-font-60 leading-tighter text-base">
              {blockchain.eth?.symbol || '?'}
            </MediumFont>
          </div>
        </div>
        <div className="flex w-[200px] md:w-[180px] h-full">
          <div className="h-full md:h-fit md:-mt-3">
            <Popover
              isOpen={showInfo}
              onToggle={() => setShowInfo((prev) => !prev)}
              toggleOnHover={() => setShowInfo((prev) => !prev)}
              visibleContent={
                <div className="p-2 pb-0 md:pr-5 flex justify-center items-center md:items-start">
                  <IoInformationCircleOutline className="text-lg text-light-font-100 dark:text-dark-font-100 -mt-6 md:mt-[5px] -ml-2.5" />
                </div>
              }
              hiddenContent={
                <>
                  <SmallFont>
                    {blockchain?.shortName || blockchain.name} Volume (24H)
                  </SmallFont>
                  <div className="my-2 w-full h-[1px] bg-light-border-secondary dark:bg-dark-border-secondary" />
                  <div className="flex justify-between items-center">
                    <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                      Value:
                    </SmallFont>
                    <SmallFont>
                      {getFormattedAmount(history?.[history?.length - 1]?.[1])}
                    </SmallFont>
                  </div>
                </>
              }
            />
          </div>
          <div className="w-[180px] md:w-[160px] absolute -top-[35px] md:-top-[45px] right-2.5 md:right-2.5">
            <EChart
              data={history || []}
              timeframe="24H"
              leftMargin={["0%", "0%"]}
              height="100px"
              bg="transparent"
              type="Volume"
              noDataZoom
              noAxis
              width="100%"
            />{" "}
          </div>
        </div>
      </div>
      <table>
        {(isLoading ? Array.from({ length: 6 }) : pairsData)?.map(
          (data: PairsProps, i: number) => {
            const baseToken = data?.pair?.[data.pair.baseToken];
            const quoteToken = data?.pair?.[data.pair.quoteToken];
            const isLast = i === 5;
            const segmentStyle = `py-2 border-light-border-secondary dark:border-dark-border-secondary px-2.5 ${
              isLast ? "" : "border-b"
            } ${i === 5 ? "border-0" : ""} ${i === 0 ? "border-t" : ""}`;

            return (
              <>
                <EntryContext.Provider
                  value={{
                    url: `/pair/${data?.pair?.address}`,
                    isHover: false,
                  }}
                >
                  <tbody
                    key={i}
                    className="hover:bg-light-bg-terciary hover:dark:bg-dark-bg-terciary cursor-pointer transition-all duration-200 ease-in-out"
                  >
                    <tr>
                      <td className={segmentStyle}>
                        <Link href={`/pair/${data?.pair?.address}`}>
                          <div className="flex w-full items-center">
                            {isLoading ? (
                              <Skeleton extraCss="h-[35px] w-[35px] rounded-full mr-2.5" />
                            ) : (
                              <>
                                {baseToken?.logo ? (
                                  <img
                                    className="w-[30px] h-[30px] lg:w-[25px] lg:h-[25px] mr-2.5 rounded-full object-cover bg-light-bg-hover dark:bg-light-bg-hover"
                                    src={baseToken?.logo}
                                    alt={baseToken?.name}
                                  />
                                ) : (
                                  <AddressAvatar
                                    address={data?.pair?.address}
                                    extraCss="w-[30px] h-[30px] lg:w-[25px] lg:h-[25px] mr-2.5 rounded-full"
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
                                <Font extraCss="font-medium text-[13px] leading-tigher">
                                  {baseToken?.symbol} /{" "}
                                  <span className="text-light-font-40 dark:text-dark-font-40 font-normal">
                                    {quoteToken?.symbol}
                                  </span>
                                </Font>
                                <Font extraCss="leading-tigher text-light-font-60 dark:text-dark-font-60 text-sm lg:text-[13px] truncate max-w-[130px]">
                                  {baseToken?.name}
                                </Font>
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className={segmentStyle}>
                        <Link href={`/pair/${data?.pair?.address}`}>
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
                        </Link>
                      </td>
                      <td className={segmentStyle}>
                        <Link href={`/pair/${data?.pair?.address}`}>
                          <div className="flex justify-end w-full">
                            <TagPercentage
                              percentage={data?.price_change_24h}
                              isUp={data?.price_change_24h > 0}
                              inhert={data?.price_change_24h === 0}
                              isLoading={isLoading}
                            />
                          </div>
                        </Link>
                      </td>
                    </tr>
                  </tbody>
                </EntryContext.Provider>
              </>
            );
          }
        )}
      </table>
    </div>
  );
};
