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
import { boxStyle } from "../../style";
import { getAmountLoseOrWin } from "../../utils";
import { Privacy } from "../ui/privacy";

export const Performers = () => {
  const { wallet, manager, isLoading } = useContext(PortfolioV2Context);
  const router = useRouter();

  const getPerformers = () => {
    const result = [];

    if (!wallet?.portfolio?.length) return result;

    let topGainer = { change_24h: -Infinity };
    let topLoser = { change_24h: Infinity };
    let topGainerUSD = null;
    let topLoserUSD = null;

    wallet.portfolio.forEach((asset) => {
      if (asset.change_24h > topGainer.change_24h) topGainer = asset;
      if (asset.change_24h < topLoser.change_24h) topLoser = asset;
    });

    const topUSD = wallet.portfolio.map((asset) => ({
      ...asset,
      amount: getAmountLoseOrWin(asset.change_24h, asset.estimated_balance),
    }));

    if (topGainer.change_24h > 0) {
      result.push({
        asset: topGainer,
        amount: `+${getFormattedAmount(topGainer.amount)}$`,
        title: "Top Gainer",
      });
    }

    if (topLoser.change_24h < 0) {
      result.push({
        asset: topLoser,
        amount: `${getFormattedAmount(topLoser.amount)}$`,
        title: "Top Loser",
      });
    }

    topGainerUSD = topUSD
      .filter((asset) => asset.amount > 0)
      .sort((a, b) => b.amount - a.amount)[0];

    topLoserUSD = topUSD
      .filter((asset) => asset.amount < 0)
      .sort((a, b) => a.amount - b.amount)[0];

    if (topGainerUSD) {
      result.push({
        asset: topGainerUSD,
        amount: `+${getFormattedAmount(topGainerUSD.amount)}$`,
        title: "Biggest Gainer",
      });
    }

    if (topLoserUSD) {
      result.push({
        asset: topLoserUSD,
        amount: `${getFormattedAmount(topLoserUSD.amount)}$`,
        title: "Biggest Loser",
      });
    }

    return result;
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
          {performers.map((token) => (
            <div
              key={token.title}
              className={`${boxStyle} border border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary
             dark:bg-dark-bg-terciary flex-row items-center mt-[7.5px] w-full hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover 
             transition-all duration-250 cursor-pointer`}
              onClick={() =>
                router.push(`/asset/${getUrlFromName(token?.asset?.name)}`)
              }
            >
              <img
                className="w-[32px] h-[32px] rounded-full mr-2.5 min-w-[32px]"
                src={token?.asset.image}
                alt="token image"
              />
              <div className="flex flex-col w-full">
                <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                  {token.title}
                </SmallFont>
                <div className="flex items-center justify-between">
                  <SmallFont extraCss="font-medium">
                    {token?.asset.symbol}
                  </SmallFont>
                  <div className="flex items-center ml-[15px]">
                    {manager.privacy_mode ? (
                      <Privacy
                        color={"text-light-font-60 dark:text-dark-font-60"}
                        fontSize={["16px", "16px", "18px", "20px"]}
                      />
                    ) : (
                      <SmallFont
                        extraCss={`${
                          token?.asset.change_24h > 0
                            ? "text-green dark:text-green"
                            : "text-red dark:text-red"
                        }`}
                      >
                        {token?.amount}
                      </SmallFont>
                    )}
                    <TagPercentage
                      isUp={token?.asset.change_24h > 0}
                      percentage={(token?.asset.change_24h || 0) as number}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {isLoading ? (
        <div className="flex flex-col">
          {Array.from(Array(4).keys()).map(() => (
            <div
              className={`${boxStyle} border border-light-border-primary dark:border-dark-border-primary
             bg-light-bg-terciary dark:bg-dark-bg-terciary flex items-center mt-[7.5px] w-full py-[15px]`}
            >
              <Skeleton extraCss="w-[32px] h-[32px] rounded-full mr-2.5 min-w-[32px]" />

              <div className="flex flex-col w-full">
                <Skeleton extraCss="w-[100px] h-[12px] mb-[5px] min-w-[100px]" />
                <div className="flex items-center justify-between">
                  <Skeleton extraCss="w-[80px] h-[15px] min-w-[80px]">
                    <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100">
                      $$$
                    </SmallFont>
                  </Skeleton>
                  <div className="flex items-center ml-[15px]">
                    <Skeleton extraCss="w-[20px] h-[15px] min-w-[20px] rounded-full">
                      <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100">
                        $$$
                      </SmallFont>
                    </Skeleton>
                    <Skeleton extraCss="w-[50px] h-[15px] ml-[5px] min-w-[50px] rounded-full">
                      <TagPercentage isUp={0 > 0} percentage={0} />
                    </Skeleton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
      {!isLoading && getPerformers().length === 0 ? (
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
                color={"text-light-font-60 dark:text-dark-font-60"}
                fontSize={["16px", "16px", "18px", "20px"]}
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
