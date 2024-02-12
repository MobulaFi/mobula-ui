import { useRouter, useSearchParams } from "next/navigation";
import React, { Key, useContext, useEffect, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { Ths } from "../../../../../components/table";
import { PopupStateContext } from "../../../../../contexts/popup";
import { OrderBy, TableAsset } from "../../../../../interfaces/assets";
import { TableContext } from "../../../../../layouts/new-tables/context-manager";
import { SkeletonTable } from "../../../../../layouts/new-tables/skeleton-table";
import { BasicThead } from "../../../../../layouts/new-tables/ui/basic-thead";
import { MenuCommun } from "../../../../../layouts/new-tables/ui/menu";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { useTop100 } from "../../context-manager";
import { Query } from "../../models";
import { TABLE_ASSETS_QUERY } from "../../utils";
import { Top100TBody } from "../table-body";

interface Top100TableProps {
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
  isMobile: boolean;
  showRank?: boolean;
  isNews?: boolean;
}

export function Top100Table({
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
  isNews = false,
}: Top100TableProps) {
  const headerRef = useRef(null);
  const router = useRouter();
  const isBalance = resultsData?.data?.find((entry) => entry.amount_usd);
  const { activeView, setIsLoading, isLoading } = useTop100();
  const { isConnected } = useAccount();
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

    const filterOrPaginationChanged =
      (filters && !activeView?.isFirst) || (page && page !== "1");

    if (
      (shouldFetchData && filterOrPaginationChanged) ||
      (orderBy && !orderBy.first)
    ) {
      fetchData();
    }
  }, [filters, router, params, orderBy]);

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
                  <BasicThead
                    title="Rank"
                    canOrder
                    extraCss="bg-light-bg-table dark:bg-dark-bg-table w-[86px] z-10 table-cell md:hidden"
                    titleCssPosition="justify-start"
                  />
                  <BasicThead
                    title=""
                    extraCss="z-10 hidden md:table-cell bg-light-bg-table dark:bg-dark-bg-table md:px-0"
                  />
                  <BasicThead
                    title="Name"
                    extraCss="text-start w-[170px] z-[100] bg-light-bg-table dark:bg-dark-bg-table left-[73px] md:left-[28px] md:px-[5px]"
                    titleCssPosition="justify-start"
                  />
                  {(activeView?.display?.length || 0) > 0 &&
                  activeView?.name !== "All" &&
                  activeView?.name !== "Portfolio" ? (
                    <>
                      {activeView?.display?.map((entry) => (
                        <BasicThead
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
                      <BasicThead
                        extraCss="w-[89px] table-cell md:hidden static"
                        title="Swap"
                      />
                    </>
                  ) : null}
                  {activeView?.name === "Portfolio" ||
                  activeView?.name === "All" ? (
                    <>
                      <BasicThead
                        extraCss="hidden md:table-cell md:px-[5px]"
                        title="Price"
                      />
                      <BasicThead
                        extraCss="hidden md:table-cell md:px-[5px]"
                        title={
                          activeView?.name === "Portfolio" ? "Balance" : "24h %"
                        }
                      />
                      {activeView?.name === "All" ? (
                        <>
                          {activeView?.display?.map((entry) => (
                            <BasicThead
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

                          <BasicThead
                            extraCss="w-[89px] table-cell md:hidden static"
                            title="Swap"
                          />
                        </>
                      ) : (
                        <>
                          <BasicThead
                            extraCss="static md:hidden"
                            title="Price"
                          />
                          <BasicThead
                            extraCss="static md:hidden"
                            title="24h %"
                          />
                          <BasicThead
                            extraCss="static md:hidden"
                            title="Market Cap"
                          />
                          <BasicThead
                            extraCss="static md:hidden"
                            title="Balance"
                          />
                          <BasicThead
                            extraCss="static md:hidden"
                            title="24h Chart"
                          />
                        </>
                      )}
                    </>
                  ) : null}
                </tr>
              </>
            )}
          </thead>
          {((automatedSkeletons && resultsData?.data?.length > 0) ||
            (!automatedSkeletons && !displaySkeletons)) &&
          !isLoading
            ? resultsData.data
                ?.sort(handleSort)
                .map((token: TableAsset, index) => (
                  <Top100TBody
                    key={
                      Number(token.price) + Number(token.liquidity) + token.name
                    }
                    token={token}
                    index={index}
                    showRank={showRank}
                    isMobile={isMobile}
                  />
                ))
            : Array.from({ length: 10 }).map((_, i) => (
                <SkeletonTable
                  isWatchlist
                  isTable={isTop100 as boolean}
                  i={i}
                  key={i}
                  isNews={isNews}
                />
              ))}
        </table>
      </div>
      {showMenuTableMobileForToken && showMenuTableMobile ? (
        <MenuCommun />
      ) : null}
    </TableContext.Provider>
  );
}
