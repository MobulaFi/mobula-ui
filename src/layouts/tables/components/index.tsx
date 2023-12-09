import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { Key, useContext, useEffect, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { Ths } from "../../../components/table";
import { PopupStateContext } from "../../../contexts/popup";
import { SettingsMetricContext } from "../../../contexts/settings";
import { defaultTop100 } from "../../../features/data/top100/constants";
import { useTop100 } from "../../../features/data/top100/context-manager";
import { TABLE_ASSETS_QUERY } from "../../../features/data/top100/utils";
import { Query } from "../../../interfaces/pages/top100";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { TableContext } from "../context-manager";
import { OrderBy, TableAsset } from "../model";
import { Entry } from "./entry-main";
import { SkeletonTable } from "./skeletons";
import { TableHeaderEntry } from "./table-header-entry";
import { MenuCommun } from "./ui/menu";

interface AssetsTable {
  resultsData: { data: TableAsset[]; count: number };
  setResultsData: React.Dispatch<
    React.SetStateAction<{ data: TableAsset[]; count: number }>
  >;
  automatedSkeletons?: boolean;
  displaySkeletons?: boolean;
  isBalance?: boolean;
  lastColumn?: string;
  orderBy: OrderBy;
  isTop100?: boolean;
  setOrderBy: React.Dispatch<React.SetStateAction<OrderBy>>;
  hideDEXVolume?: boolean;
  filters?: Query[] | null;
  isMobile?: boolean;
  showRank?: boolean;
}

export function AssetsTable({
  resultsData,
  setResultsData,
  lastColumn = "Chart",
  automatedSkeletons = true,
  displaySkeletons = false,
  orderBy,
  setOrderBy,
  hideDEXVolume = false,
  filters = null,
  isTop100,
  isMobile,
  showRank = false,
  ...props
}: AssetsTable) {
  const headerRef = useRef(null);
  const router = useRouter();
  const { showBuyDrawer } = useContext(SettingsMetricContext);
  const isBalance = resultsData?.data?.find((entry) => entry.amount_usd);
  const { activeView, setIsLoading, isLoading } = useTop100();
  const { isConnected } = useAccount();
  const pathname = usePathname();
  const params = useSearchParams();
  const page = params.get("page");
  const { showMenuTableMobileForToken, showMenuTableMobile } =
    useContext(PopupStateContext);

  const handleSort = (a: TableAsset, b: TableAsset) => {
    if (isBalance) return b.amount_usd - a.amount_usd;
    let orderWith = "";
    if (orderBy.type === "volume") orderWith = "global_volume";
    else orderWith = orderBy.type;
    return b[orderWith] - a[orderWith];
  };

  const entries = useMemo(() => {
    const filteredTokens = resultsData.data?.filter((entry) => {
      if (!isBalance) return true;
      return (
        !entry.name.includes(".") &&
        entry.amount_usd > 0 &&
        Number(entry.price) > 0 &&
        entry.amount_usd
      );
    });

    return filteredTokens
      ?.sort(handleSort)
      .map((token: TableAsset, index) => (
        <Entry
          isTop100={isTop100}
          key={Number(token.price) + Number(token.liquidity) + token.name}
          token={token}
          index={index}
          showRank={showRank}
          isMobile={isMobile}
        />
      ));
  }, [resultsData]);

  const value = useMemo(
    () => ({
      lastColumn,
      bg: isTop100
        ? "bg-light-bg-table dark:bg-dark-bg-table"
        : "bg-light-bg-primary dark:bg-dark-bg-primary",
      orderBy,
      setOrderBy,
      isBalance,
      hideDEXVolume,
    }),
    [lastColumn, isBalance, orderBy, hideDEXVolume]
  );

  const fetchData = async () => {
    setResultsData({ data: [], count: 0 });
    const supabase = createSupabaseDOClient();
    const query = supabase
      .from("assets")
      .select(TABLE_ASSETS_QUERY, { count: "exact" });

    (filters || [])
      .filter((entry) => entry.action)
      .forEach((filter) => {
        query[filter.action](...filter.value);
      });

    let orderWith = "";
    if (orderBy.type === "volume") orderWith = "global_volume";
    else orderWith = orderBy.type;
    query.order(orderWith, { ascending: orderBy.ascending });

    const from = page ? (parseInt(page as string, 10) - 1) * 100 : 0;
    const res = await query.range(from, from + 99);
    if (res.data)
      setResultsData(
        res as unknown as {
          data: TableAsset[];
          count: number;
        }
      );
    setIsLoading(false);
  };

  useEffect(() => {
    const shouldFetchData =
      (activeView?.name !== "Portfolio" &&
        filters &&
        !filters[0]?.isFirst &&
        isConnected) ||
      (page && isConnected && activeView?.name !== "All") ||
      isConnected === false;

    console.log(
      "shouldFetchData",
      shouldFetchData,
      filters,
      !activeView?.isFirst
    );

    const filterOrPaginationChanged =
      (filters && !activeView?.isFirst) || (page && page !== "1");
    console.log("filterOrPaginationChanged", filterOrPaginationChanged);

    if (
      (shouldFetchData && filterOrPaginationChanged) ||
      (orderBy && !orderBy.first)
    ) {
      fetchData();
    }
  }, [filters, router, params, orderBy]);

  const showMinimalMobile =
    (isMobile &&
      JSON.stringify(activeView?.display) ===
        JSON.stringify(defaultTop100.display) &&
      JSON.stringify(activeView?.filters) ===
        JSON.stringify(defaultTop100.filters)) ||
    (activeView?.name === "Portfolio" && isMobile);

  return (
    <TableContext.Provider value={value}>
      <div className="overflow-auto relative top-0 w-full min-h-[680px] lg:min-h-[450px] sm:min-h-[300px] lg:mt-0">
        <table className="caption-bottom scroll mb-[28px] max-w-[1300px] cursor-pointer my-0 mx-auto relative w-full overflow-x-scroll">
          <thead
            className="border-t border-light-border-primary dark:border-dark-border-primary text-light-font-80 dark:text-dark-font-80 sticky top-0 "
            ref={headerRef}
          >
            {isLoading ? (
              <tr className="text-left table-row">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Ths key={i} extraCss="px-5 md:px-2.5" children={undefined} />
                ))}
              </tr>
            ) : (
              <>
                <tr className={`text-left sticky top-0`}>
                  <TableHeaderEntry
                    title="Rank"
                    canOrder
                    extraCss={`${
                      isTop100
                        ? "bg-light-bg-table dark:bg-dark-bg-table"
                        : "bg-light-bg-primary dark:bg-dark-bg-primary"
                    } w-[86px] z-10 table-cell md:hidden`}
                    titleCssPosition="justify-start"
                  />
                  <TableHeaderEntry
                    title=""
                    extraCss={`z-10 hidden md:table-cell ${
                      isTop100
                        ? "bg-light-bg-table dark:bg-dark-bg-table"
                        : "bg-light-bg-primary dark:bg-dark-bg-primary"
                    } md:px-0`}
                  />
                  <TableHeaderEntry
                    title="Name"
                    extraCss={`text-start w-[170px] z-[100] ${
                      isTop100
                        ? "bg-light-bg-table dark:bg-dark-bg-table"
                        : "bg-light-bg-primary dark:bg-dark-bg-primary"
                    } left-[73px] md:left-[28px] md:px-[5px]`}
                    titleCssPosition="justify-start"
                  />
                  {(activeView?.display?.length || 0) > 0 &&
                  (pathname === "/" || pathname === "/?page=" + page) &&
                  activeView?.name !== "All" &&
                  activeView?.name !== "Portfolio" ? (
                    <>
                      {activeView?.display?.map((entry) => (
                        <TableHeaderEntry
                          key={entry.value}
                          title={
                            entry.value === "Price USD" ? "Price" : entry.value
                          }
                          canOrder
                          extraCss={`${
                            entry.value === "24h Chart"
                              ? "text-center"
                              : "text-end"
                          } static md:px-[5px]`}
                        />
                      ))}
                      <TableHeaderEntry
                        extraCss="w-[89px] table-cell md:hidden static"
                        title="Interact"
                      />
                    </>
                  ) : null}
                  {activeView?.name === "Portfolio" ||
                  activeView?.name === "All" ? (
                    <>
                      <TableHeaderEntry
                        extraCss="hidden md:table-cell md:px-[5px]"
                        title="Price"
                      />
                      <TableHeaderEntry
                        extraCss="hidden md:table-cell md:px-[5px]"
                        title={
                          activeView?.name === "Portfolio" ? "Balance" : "24h %"
                        }
                      />
                      {activeView?.name === "All" ? (
                        <>
                          {activeView?.display?.map((entry) => (
                            <TableHeaderEntry
                              extraCss="static md:hidden"
                              key={entry.value as Key}
                              title={
                                entry.value === "Price USD"
                                  ? "Price"
                                  : entry.value
                              }
                              canOrder
                            />
                          ))}
                          <TableHeaderEntry
                            extraCss="w-[89px] table-cell md:hidden static"
                            title="Interact"
                          />
                        </>
                      ) : (
                        <>
                          <TableHeaderEntry
                            extraCss="static md:hidden"
                            title="Price"
                          />
                          <TableHeaderEntry
                            extraCss="static md:hidden"
                            title="24h %"
                          />
                          <TableHeaderEntry
                            extraCss="static md:hidden"
                            title="Market Cap"
                          />
                          <TableHeaderEntry
                            extraCss="static md:hidden"
                            title="Balance"
                          />
                          <TableHeaderEntry
                            extraCss="static md:hidden"
                            title="24h Chart"
                          />
                        </>
                      )}
                    </>
                  ) : null}
                  {pathname !== "/" && pathname !== "/?page=" + page ? (
                    <>
                      <TableHeaderEntry
                        extraCss="static"
                        title="Price"
                        canOrder
                      />
                      <TableHeaderEntry
                        extraCss="static"
                        title="24h %"
                        canOrder
                      />
                      <TableHeaderEntry
                        extraCss="static"
                        title="Market Cap"
                        canOrder
                      />
                      <TableHeaderEntry
                        extraCss="static"
                        title="24h Volume"
                        canOrder
                      />
                      <TableHeaderEntry
                        extraCss="static whitespace-nowrap"
                        title={lastColumn}
                      />
                      <TableHeaderEntry
                        extraCss="w-[89px] table-cell md:hidden static"
                        title="Interact"
                      />
                    </>
                  ) : null}
                </tr>
              </>
            )}
          </thead>
          {((automatedSkeletons && resultsData?.data?.length > 0) ||
            (!automatedSkeletons && !displaySkeletons)) &&
          !isLoading ? (
            entries
          ) : (
            <>
              {Array.from({ length: 10 }).map((_, i) => (
                <SkeletonTable
                  isWatchlist
                  isTable={isTop100 as boolean}
                  i={i}
                  key={i}
                />
              ))}
            </>
          )}
        </table>
      </div>
      {showMenuTableMobileForToken && showMenuTableMobile ? (
        <MenuCommun />
      ) : null}
    </TableContext.Provider>
  );
}
