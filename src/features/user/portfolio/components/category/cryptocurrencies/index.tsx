import { createSupabaseDOClient } from "lib/supabase";
import { useTheme } from "next-themes";
import React, { Key, useContext, useEffect, useMemo, useState } from "react";
import { MediumFont } from "../../../../../../components/fonts";
import { PortfolioV2Context } from "../../../context-manager";
import { thStyle } from "../../../style";
import { TbodyCryptocurrencies } from "../../ui/tbody-cryptocurrencies";
import { TbodySkeleton } from "../../ui/tbody-skeleton";

export const Cryptocurrencies = () => {
  const {
    wallet,
    hiddenTokens,
    setHiddenTokens,
    isLoading,
    activePortfolio,
    isMobile,
    asset,
  } = useContext(PortfolioV2Context);
  const [showMore, setShowMore] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(null);
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";
  const [tokensData, setTokensData] = useState({});

  const numberOfAsset =
    wallet?.portfolio?.reduce((count, entry) => {
      const meetsBalanceCondition = showMore || entry.estimated_balance > 1;
      return meetsBalanceCondition ? count : count + 1;
    }, 0) ?? 0;
  const isNormalBalance = wallet?.portfolio
    ? wallet?.portfolio.some((entry) => entry.estimated_balance > 1)
    : false;

  const getFilterFromBalance = () => {
    if (!wallet || !wallet?.portfolio) return [];

    return wallet.portfolio.filter((entry) => {
      const meetsBalanceCondition = showMore || entry.estimated_balance > 1;
      return isNormalBalance ? meetsBalanceCondition : true;
    });
  };

  const filteredData = useMemo(
    () => getFilterFromBalance(),
    [wallet, showMore]
  );

  useEffect(() => {
    if (showTokenInfo !== asset?.id || tokensData[asset?.id]) return;
    const supabase = createSupabaseDOClient();
    supabase
      .from("assets")
      .select("name, id, symbol, price_history")
      .eq("id", asset?.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
          return;
        }
        setTokensData({ ...tokensData, [data.id]: data });
      });
  }, [tokensData, showTokenInfo]);

  return (
    <>
      <table className="relative overflow-x-scroll md:pb-5 border-separate border-spacing-0 w-full caption-bottom">
        <thead className="rounded-t-lg">
          <tr>
            {isMobile && (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-start w-2.5`}
              />
            )}
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary sticky top-0 left-[-1px] text-start `}
              // bgColor={bg}
            >
              Asset
            </th>
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
            >
              Holdings
            </th>
            {isMobile ? null : (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
              >
                Price
              </th>
            )}
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
            >
              24h Profit
            </th>
            {isMobile ? null : (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
              >
                Realized PNL
              </th>
            )}
            {isMobile ? null : (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
              >
                Unrealized PNL
              </th>
            )}
            {!isMobile && (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        {!isLoading &&
        filteredData?.sort((a, b) => b.estimated_balance - a.estimated_balance)
          .length > 0 ? (
          <tbody>
            {filteredData
              ?.sort((a, b) => b.estimated_balance - a.estimated_balance)
              .map((asset) => (
                <TbodyCryptocurrencies
                  key={asset.name}
                  asset={asset}
                  setShowTokenInfo={setShowTokenInfo as never}
                  showTokenInfo={showTokenInfo}
                  tokenInfo={tokensData[asset.id]}
                />
              ))}
          </tbody>
        ) : null}
        {isLoading ? (
          <tbody>
            {Array.from(Array(10).keys()).map((_, i) => (
              <TbodySkeleton key={i as Key} />
            ))}
          </tbody>
        ) : null}
        {isNormalBalance && numberOfAsset ? (
          <caption
            className="bg-light-bg-secondary dark:bg-dark-bg-secondary text-start 
          rounded-xl pl-0 h-[40px] border border-light-border-primary dark:border-dark-border-primary 
          hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover cursor-pointer transition-all duration-250
           mt-2.5 md:mt-[-10px] caption-bottom"
          >
            <button
              className="flex items-center font-medium text-light-font-100 dark:text-dark-font-100 text-sm
               lg:text-[13px] md:text-xs h-full pl-5 sticky top-0 left-[-1px] "
              onClick={() => setShowMore(!showMore)}
            >
              {showMore
                ? "Hide low balances "
                : `Show low balances  (${numberOfAsset} assets) `}
            </button>
          </caption>
        ) : null}
      </table>
      {filteredData?.sort((a, b) => b.estimated_balance - a.estimated_balance)
        .length > 0 || isLoading ? null : (
        <div
          className="h-[300px] w-full rounded-r-lg flex items-center justify-center border border-light-border-primary dark:border-dark-border-primary flex-col"
          // bg={boxBg1}
        >
          <img
            className="h-[160px] mb-[-50px] mt-[25px]"
            src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
            alt="empty logo"
          />
          <div className="flex w-[80%] flex-col m-auto mt-[40px] items-center justify-center">
            <MediumFont extraCss="mb-[5px] text-center text-light-font-40 dark:text-dark-font-40">
              No tokens found{" "}
            </MediumFont>
          </div>
        </div>
      )}
    </>
  );
};
