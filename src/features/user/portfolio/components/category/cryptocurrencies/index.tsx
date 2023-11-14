import React, { Key, useContext, useMemo, useState } from "react";
import { MediumFont } from "../../../../../../components/fonts";
import useDarkMode from "../../../../../../hooks/useDarkMode";
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
  } = useContext(PortfolioV2Context);
  const [showMore, setShowMore] = useState(false);
  const [colorTheme] = useDarkMode();
  const isWhiteMode = colorTheme === "light";

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

  return (
    <>
      <table className="relative pb-[100px] overflow-x-scroll md:pb-5">
        <thead className="rounded-t-lg">
          <tr>
            {isMobile && (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-start`}
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
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
            >
              Price
            </th>
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
            >
              24h Profit
            </th>
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
            >
              Realized PNL
            </th>
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
            >
              Unrealized PNL
            </th>
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
                <TbodyCryptocurrencies key={asset.name} asset={asset} />
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
          <caption className="bg-light-bg-terciary dark:bg-dark-bg-terciary mt-0 text-start rounded-b-lg pl-0">
            <button
              className="font-medium text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs 
              h-full pl-5 sticky top-0 left-[-1px]"
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
