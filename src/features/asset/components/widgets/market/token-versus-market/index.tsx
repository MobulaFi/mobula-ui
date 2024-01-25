import { useContext, useEffect, useState } from "react";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { Skeleton } from "../../../../../../components/skeleton";
import { Ths } from "../../../../../../components/table";
import { TagPercentage } from "../../../../../../components/tag-percentage";
import { GET } from "../../../../../../utils/fetch";
import { BaseAssetContext } from "../../../../context-manager";

export const TokenVersusMarket = () => {
  const { baseAsset, tokenVsMarket, setTokenVsMarket } =
    useContext(BaseAssetContext);
  const titles = ["Entity", "24h", "7d", "30d"];
  const [isLoading, setIsLoading] = useState(!tokenVsMarket?.length);

  const getPercentageChange = (time, categorie) => {
    const isBTC = categorie?.name === "Bitcoin";
    switch (time) {
      case "1h": {
        if (isBTC) {
          return (
            (baseAsset?.price_change_1h || 1) -
            (categorie?.price_change_1h || 1)
          );
        }
        return (
          (baseAsset?.price_change_1h || 1) /
          (categorie?.market_cap_change_1h || 1)
        );
      }
      case "24h": {
        if (isBTC)
          return (
            (baseAsset?.price_change_24h || 1) -
            (categorie?.price_change_24h || 1)
          );
        return (
          (baseAsset?.price_change_24h || 1) -
          (categorie?.market_cap_change_24h || 1)
        );
      }
      case "7d": {
        if (isBTC)
          return (
            (baseAsset?.price_change_7d || 1) -
            (categorie?.price_change_7d || 1)
          );
        return (
          (baseAsset?.price_change_7d || 1) -
          (categorie?.market_cap_change_7d || 1)
        );
      }
      case "1m": {
        if (isBTC)
          return (
            (baseAsset?.price_change_1m || 1) -
            (categorie?.price_change_1m || 1)
          );
        return (
          (baseAsset?.price_change_1m || 1) -
          (categorie?.market_cap_change_1m || 1)
        );
      }
      default:
        return (
          (baseAsset?.price_change_1m || 1) -
          (categorie?.market_cap_change_1m || 1)
        );
    }
  };

  useEffect(() => {
    if (baseAsset)
      GET("/api/1/market/token-vs-market", {
        tag: baseAsset?.tags?.[0],
      })
        .then((r) => r.json())
        .then(({ data }) => {
          setIsLoading(false);
          if (data) setTokenVsMarket(data);
        });
  }, [baseAsset]);

  const getStateOfMarket = () => {
    if (!tokenVsMarket)
      return {
        bg: "darkyellow",
        color: "yellow",
        state: "Neutral",
      };

    const feeling = {
      neutral: 0,
      bullish: 0,
      bearish: 0,
    };

    tokenVsMarket
      .filter((entry) => entry?.symbol !== baseAsset?.symbol && entry)
      .forEach((market) => {
        const changes = [
          getPercentageChange("1h", market),
          getPercentageChange("24h", market),
          getPercentageChange("7d", market),
          getPercentageChange("1m", market),
        ];

        changes.forEach((change) => {
          if (change > 0) feeling.bullish += 1;
          else if (change < 0) feeling.bearish += 1;
          else if (change === 0) feeling.neutral += 1;
        });
      });

    if (feeling.bullish > feeling.bearish && feeling.bullish > feeling.neutral)
      return {
        bg: "bg-darkgreen dark:bg-darkgreen",
        color: "text-green dark:text-green",
        state: "Bullish",
      };
    if (feeling.bearish > feeling.bullish && feeling.bearish > feeling.neutral)
      return {
        bg: "bg-darkred dark:bg-darkred",
        color: "text-red dark:text-red",
        state: "Bearish",
      };
    return {
      bg: "bg-darkyellow dark:bg-darkyellow",
      color: "text-yellow dark:text-yellow",
      state: "Neutral",
    };
  };

  const stateOfMarket = getStateOfMarket();

  return (
    <div className="flex flex-col mt-5 w-full">
      <div className="flex items-center mb-[15px]">
        <LargeFont extraCss="ml-0 md:ml-2.5">
          {baseAsset.name} vs Market
        </LargeFont>
        {(tokenVsMarket || [])?.filter(
          (entry) => entry?.symbol !== baseAsset?.symbol && entry
        )?.length > 0 ? (
          <div
            className={`flex h-[23px] lg:h-[21.5px] md:h-[20px] w-fit px-1.5 rounded-md ml-2.5 ${stateOfMarket?.bg} ${stateOfMarket?.color} text-sm lg:text-[13px] md:text-xs items-center`}
          >
            {stateOfMarket?.state}
          </div>
        ) : (
          <Skeleton extraCss="h-[22px] lg:h-[20.5px] md:h-[19px] w-[55px] ml-2.5" />
        )}
      </div>
      <div className="w-full overflow-scroll scroll">
        <table className="max-h-[500px] md:max-h-[350px] w-full relative">
          <thead>
            <tr>
              {titles
                .filter((entry) => entry !== "Unit Price")
                .map((entry, i) => {
                  const isFirst = i === 0;
                  const isLast = i === titles.length - 1;
                  const isOpen = entry === "Open";
                  return (
                    <Ths
                      extraCss={`sticky bg-light-bg-secondary dark:bg-dark-bg-secondary z-[2] top-[-1px] border-t 
                  border-b border-light-border-primary dark:border-dark-border-primary px-2.5 py-2.5 
                  ${
                    isFirst ? "pl-5 md:pl-2.5 text-start" : "pl-2.5 text-end"
                  } ${isLast || isOpen ? "pr-5 md:pr-2.5" : "pr-2.5"} 
                   table-cell ${entry === "Unit Price" ? "hidden" : ""}`}
                      key={entry}
                    >
                      <SmallFont extraCss="font-medium">{entry}</SmallFont>
                    </Ths>
                  );
                })}
            </tr>
          </thead>
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <tbody key={i}>
                  <tr>
                    <td className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 md:pl-2.5 pr-2.5 py-[15px] text-[11px] lg:text-[10px] md:text-[8px] ">
                      <Skeleton extraCss="h-[13px] md:h-[11px] w-[120px]" />
                    </td>
                    <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5 text-end">
                      <div className="flex justify-end w-full">
                        <TagPercentage
                          percentage={0}
                          isUp={false}
                          isLoading={isLoading}
                        />
                      </div>
                    </td>
                    <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5 text-end">
                      <div className="flex justify-end w-full">
                        <TagPercentage
                          percentage={0}
                          isUp={false}
                          isLoading={isLoading}
                        />
                      </div>
                    </td>
                    <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5">
                      <div className="flex justify-end w-full">
                        <TagPercentage
                          percentage={0}
                          isUp={false}
                          isLoading={isLoading}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))
            : tokenVsMarket
                ?.filter(
                  (entry) => entry?.symbol !== baseAsset?.symbol && entry
                )
                ?.map((pair, i) => {
                  const isTokens = pair?.symbol;
                  return (
                    <tbody key={pair?.id + i}>
                      <tr>
                        <td className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 md:pl-2.5 pr-2.5 py-[15px] text-[11px] lg:text-[10px] md:text-[8px] ">
                          <SmallFont extraCss="font-medium -mb-0.5 md:mb-[-5px]">
                            {`${isTokens ? pair?.symbol : pair?.name}`}
                          </SmallFont>
                        </td>
                        <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5 text-end">
                          <div className="flex justify-end w-full">
                            <TagPercentage
                              percentage={getPercentageChange("24h", pair)}
                              isUp={(getPercentageChange("24h", pair) || 0) > 0}
                            />
                          </div>
                        </td>
                        <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5 text-end">
                          <div className="flex justify-end w-full">
                            <TagPercentage
                              percentage={getPercentageChange("7d", pair)}
                              isUp={(getPercentageChange("7d", pair) || 0) > 0}
                            />
                          </div>
                        </td>
                        <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5">
                          <div className="flex justify-end w-full">
                            <TagPercentage
                              percentage={getPercentageChange("1m", pair)}
                              isUp={(getPercentageChange("1m", pair) || 0) > 0}
                            />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
        </table>
      </div>
    </div>
  );
};
