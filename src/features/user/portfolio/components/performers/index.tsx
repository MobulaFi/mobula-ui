import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { MediumFont, SmallFont } from "../../../../../components/fonts";
import { Skeleton } from "../../../../../components/skeleton";
import { TagPercentage } from "../../../../../components/tag-percentage";
import {
  getFormattedAmount,
  getUrlFromName,
} from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { UserHoldingsAsset } from "../../models";
import { boxStyle } from "../../style";
import { getAmountLoseOrWin } from "../../utils";
import { Privacy } from "../ui/privacy";

export const Performers = () => {
  const { wallet, manager, isLoading } = useContext(PortfolioV2Context);
  const router = useRouter();

  const getPerformers = () => {
    if (wallet && (wallet?.portfolio?.length || 0) > 0) {
      const topGainer = wallet?.portfolio?.reduce((acc, curr) => {
        if (curr.change_24h > acc.change_24h) {
          return curr;
        }
        return acc;
      });

      const topLoser = wallet?.portfolio?.reduce((acc, curr) => {
        if (curr.change_24h < acc.change_24h && curr.name !== topGainer?.name) {
          return curr;
        }
        return acc;
      });

      const topUSD =
        wallet?.portfolio?.map((entry) => {
          const amount = getAmountLoseOrWin(
            entry.change_24h,
            entry.estimated_balance
          );
          return { ...entry, amount };
        }) || [];

      const topGainerUSD = topUSD
        .filter((entry) => entry.name !== topLoser?.name && entry.amount > 0)
        .sort((a, b) => b.amount - a.amount)[0];

      const topLoserUSD = topUSD
        .filter((entry) => entry.name !== topGainer?.name && entry.amount < 0)
        .sort((a, b) => a.amount - b.amount)[0];

      const result: {
        asset: UserHoldingsAsset | undefined;
        amount: string;
        title: string;
      }[] = [];

      if ((topGainer?.change_24h as number) > 0) {
        const newTopGainer = {
          asset: topGainer,
          amount: `+${getFormattedAmount(
            getAmountLoseOrWin(
              topGainer?.change_24h as number,
              topGainer?.estimated_balance as number
            )
          )}$`,
          title: "Top Gainer",
        };
        result.push(newTopGainer);
      }

      if ((topLoser?.change_24h || 0) < 0) {
        const newTopLoser = {
          asset: topLoser,
          amount: `${getFormattedAmount(
            getAmountLoseOrWin(
              topLoser?.change_24h as number,
              topLoser?.estimated_balance as number
            )
          )}$`,
          title: "Top Loser",
        };
        result.push(newTopLoser);
      }

      if (
        topGainerUSD &&
        !result.find((entry) => entry?.asset?.name === topGainerUSD.name)
      ) {
        const newTopGainerUSD = {
          asset: topGainerUSD,
          amount: `+${getFormattedAmount(topGainerUSD?.amount)}$`,
          title: "Biggest Gainer",
        };
        result.push(newTopGainerUSD);
      }

      if (
        topLoserUSD &&
        !result.find((entry) => entry?.asset?.name === topLoserUSD.name)
      ) {
        const newTopLoserUSD = {
          asset: topLoserUSD,
          amount: `${getFormattedAmount(topLoserUSD?.amount)}$`,
          title: "Biggest Loser",
        };
        result.push(newTopLoserUSD);
      }

      return result;
    }
    return [];
  };

  const performers = getPerformers();

  // DO NOT REMOVE => DATA FILTER BY ACTIVE NETWORK
  // const filteredData = getPerformers().filter(entry =>
  //   Object.keys(entry.cross_chain_balances).some(chain =>
  //     activeNetworks.includes(chain),
  //   ),
  // );

  return (
    <div
      className={`${boxStyle} flex-col mt-2.5 border border-light-border-primary dark:border-dark-border-primary
     bg-light-bg-secondary dark:bg-dark-bg-secondary w-[320px] lg:w-full`}
    >
      <MediumFont extraCss="text-bold ml-[5px] mb-[5px]">
        Performers (24h)
      </MediumFont>
      {performers?.length > 0 && !isLoading ? (
        <div className="flex flex-col w-full">
          {performers.map(
            (token: {
              asset: UserHoldingsAsset | undefined;
              amount: string;
              title: string;
            }) => (
              <div
                key={token.title}
                className={`${boxStyle} border border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary
             dark:bg-dark-bg-terciary flex-row items-center mt-[7.5px] w-full hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover 
             transition-all duration-200 cursor-pointer`}
                onClick={() =>
                  router.push(
                    `/asset/${getUrlFromName(token?.asset?.name as string)}`
                  )
                }
              >
                <img
                  className="w-[32px] h-[32px] rounded-full mr-2.5 min-w-[32px]"
                  src={token?.asset?.image}
                  alt="token image"
                />
                <div className="flex flex-col w-full">
                  <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                    {token.title}
                  </SmallFont>
                  <div className="flex items-center justify-between">
                    <SmallFont extraCss="font-normal">
                      {token?.asset?.symbol}
                    </SmallFont>
                    <div className="flex items-center ml-[15px]">
                      {manager.privacy_mode ? (
                        <Privacy
                          extraCss={
                            "text-light-font-60 dark:text-dark-font-60 text-xl lg:text-lg md:text-base"
                          }
                        />
                      ) : (
                        <SmallFont
                          extraCss={`${
                            (token?.asset?.change_24h || 0) > 0
                              ? "text-green dark:text-green"
                              : "text-red dark:text-red"
                          }`}
                        >
                          {token?.amount}
                        </SmallFont>
                      )}
                      <TagPercentage
                        isUp={(token?.asset?.change_24h || 0) > 0}
                        percentage={(token?.asset?.change_24h || 0) as number}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : null}
      {isLoading ? (
        <div className="flex flex-col">
          {Array.from(Array(4).keys()).map((_, i) => (
            <div
              key={i}
              className={`${boxStyle} border border-light-border-primary dark:border-dark-border-primary
             bg-light-bg-terciary dark:bg-dark-bg-terciary flex items-center mt-[7.5px] w-full py-[15px]`}
            >
              <Skeleton extraCss="w-[32px] h-[32px] rounded-full mr-2.5 min-w-[32px]" />
              <div className="flex flex-col w-full">
                <Skeleton extraCss="w-[100px] h-[12px] mb-[5px] min-w-[100px]" />
                <div className="flex items-center justify-between">
                  <Skeleton extraCss="w-[80px] h-[15px] min-w-[80px]" />
                  <div className="flex items-center ml-[15px]">
                    <Skeleton extraCss="w-[20px] h-[15px] min-w-[20px] rounded-full" />
                    <Skeleton extraCss="w-[50px] h-[15px] ml-[5px] min-w-[50px] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {!isLoading && performers.length === 0 ? (
        <div
          className={`${boxStyle} border border-light-border-primary dark:border-dark-border-primary
         bg-light-bg-terciary dark:bg-dark-bg-terciary mt-[7.5px] flex items-center w-full justify-between`}
        >
          <div className="flex items-center">
            <img
              className="w-[32px] h-[32px] rounded-full mr-2.5 min-w-[32px]"
              // TODO COLOR MODE IMAGE
              src={"/mobula/mobula-logo.svg"}
              alt="mobula logo"
            />
            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
              Portfolio empty
            </SmallFont>
          </div>
          <div className="flex items-center ml-[15px]">
            {manager.privacy_mode ? (
              <Privacy
                extraCss={
                  "text-light-font-60 dark:text-dark-font-60 text-xl lg:text-lg md:text-base"
                }
              />
            ) : (
              <SmallFont>--</SmallFont>
            )}
            <TagPercentage isUp={false} percentage={0} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
