import { TableContainerProps } from "@chakra-ui/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { Key, useContext, useEffect, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { PopupStateContext } from "../../../contexts/popup";
import { defaultTop100 } from "../../../features/data/top100/constants";
import { useTop100 } from "../../../features/data/top100/context-manager";
import { Query } from "../../../interfaces/pages/top100";
import { useColors } from "../../../lib/chakra/colorMode";
import { createSupabaseDOClient } from "../../../lib/supabase";
// import { DrawerDex } from "../../../components/drawer/dex";
import { TABLE_ASSETS_QUERY } from "../../../features/data/top100/utils";
import { TableContext } from "../context-manager";
import { OrderBy, TableAsset } from "../model";
import { Entry } from "./entry-test";
import { SkeletonTable } from "./skeletons";
import { TableHeaderEntry } from "./table-header-entry";
import { MenuCommom } from "./ui/menu";

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
}: {
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
} & TableContainerProps) {
  const { text60, borders, bgMain, bgTable } = useColors();
  const headerRef = useRef(null);
  const router = useRouter();
  const isBalance = resultsData?.data?.find((entry) => entry.amount_usd);
  const { activeView, setIsLoading, isLoading } = useTop100();
  const { isConnected } = useAccount();
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
      bg: isTop100 ? bgTable : bgMain,
      orderBy,
      setOrderBy,
      isBalance,
      hideDEXVolume,
    }),
    [lastColumn, isBalance, props.bg, orderBy, hideDEXVolume]
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
  }, [filters, router, orderBy]);

  const showMinimalMobile =
    (isMobile &&
      JSON.stringify(activeView?.display) ===
        JSON.stringify(defaultTop100.display) &&
      JSON.stringify(activeView?.filters) ===
        JSON.stringify(defaultTop100.filters)) ||
    (activeView?.name === "Portfolio" && isMobile);

  const pathname = usePathname();
  const params = useParams();
  const page = params.page;

  return (
    <TableContext.Provider value={value}>
      <div className="overflow-auto relative top-0 w-full min-h-[680px] lg:min-h-[450px] sm:min-h-[300px]">
        <table className="scroll mb-[28px] max-w-[1300px] cursor-pointer my-0 mx-auto relative w-full md:w-auto overflow-x-scroll">
          <thead
            className="border-t border-light-border-primary dark:border-dark-border-primary text-light-font-80 dark:text-dark-font-80 sticky top-0 "
            ref={headerRef}
          >
            <tr
              className={`text-left sticky top-0 table-row ${
                pathname === "/" || pathname === `/?page=${page}`
                  ? "lg:hidden"
                  : "lg:table-row"
              } ${
                pathname !== "/" && pathname !== `/?page=${page}`
                  ? "md:table-row"
                  : "md:hidden"
              }`}
            >
              <TableHeaderEntry
                title="Rank"
                canOrder
                extraCss={`${
                  isTop100
                    ? "bg-light-bg-table dark:bg-dark-bg-table"
                    : "bg-light-bg-primary dark:bg-dark-bg-primary"
                } w-[86px] z-10 table-cell md:hidden`}
              />
              <TableHeaderEntry
                title=""
                extraCss={`z-10 hidden md:table-cell ${
                  isTop100
                    ? "bg-light-bg-table dark:bg-dark-bg-table"
                    : "bg-light-bg-primary dark:bg-dark-bg-primary"
                }`}
              />
              <TableHeaderEntry
                title="Name"
                extraCss={`text-start w-[170px] z-10 ${
                  isTop100
                    ? "bg-light-bg-table dark:bg-dark-bg-table"
                    : "bg-light-bg-primary dark:bg-dark-bg-primary"
                } left-[73px] md:left-[24px]`}
              />
              {activeView?.display &&
              (pathname === "/" || pathname === `/?page=${page}`) ? (
                <>
                  {activeView?.display?.map((entry) => (
                    <TableHeaderEntry
                      key={entry.value}
                      title={
                        entry.value === "Price USD" ? "Price" : entry.value
                      }
                      canOrder
                      extraCss={`${
                        entry.value === "24h Chart" ? "text-center" : "text-end"
                      }`}
                    />
                  ))}

                  <TableHeaderEntry
                    extraCss="w-[89px] table-cell md:hidden"
                    title="Interact"
                  />
                </>
              ) : (
                <>
                  <TableHeaderEntry
                    extraCss="w-[140px] text-end"
                    title="Price"
                    canOrder
                  />
                  <TableHeaderEntry title="24h (%)" canOrder />
                  <TableHeaderEntry title="Market Cap" canOrder />
                  <TableHeaderEntry
                    extraCss="w-[162.41px]"
                    title={isBalance ? "Balance" : "Volume (24h)"}
                    canOrder
                  />
                  {pathname !== "/" && pathname !== `/?page=${page}` ? (
                    <TableHeaderEntry extraCss="w-[175px]" title={lastColumn} />
                  ) : null}
                  {pathname === "/" ||
                  pathname === `/?page=${page}` ||
                  isBalance ? (
                    <TableHeaderEntry
                      extraCss="w-[89px] table-cell md:hidden text-center"
                      title="Chart 24h"
                    />
                  ) : null}
                  <TableHeaderEntry
                    title="Interact"
                    extraCss="w-[89px] table-cell md:hidden"
                  />
                </>
              )}
            </tr>
            <tr
              className={`text-left sticky top-0 hidden ${
                pathname === "/" || pathname === `/?page=${page}`
                  ? "lg:table-row"
                  : "lg:hidden"
              } ${
                pathname !== "/" && pathname !== `/?page=${page}`
                  ? "md:hidden"
                  : "md:table-row"
              }`}
            >
              {!showMinimalMobile &&
              (pathname === "/" || pathname === `/?page=${page}`) ? (
                <>
                  <TableHeaderEntry
                    title=""
                    extraCss={`z-10 hidden lg:table-cell ${
                      isTop100
                        ? "bg-light-bg-table dark:bg-dark-bg-table"
                        : "bg-light-bg-primary dark:bg-dark-bg-primary"
                    }`}
                  />
                  <TableHeaderEntry
                    title="Name"
                    extraCss={`z-10 w-[170px] text-start left-[88px] md:left-[24px] ${
                      isTop100
                        ? "bg-light-bg-table dark:bg-dark-bg-table"
                        : "bg-light-bg-primary dark:bg-dark-bg-primary"
                    }`}
                  />
                  {activeView?.display?.map((entry) => (
                    <TableHeaderEntry
                      key={entry.value as Key}
                      title={
                        entry.value === "Price USD" ? "Price" : entry.value
                      }
                      canOrder
                    />
                  ))}

                  <TableHeaderEntry
                    className="w-[89px] table-cell md:hidden"
                    title="Interact"
                  />
                </>
              ) : (
                <>
                  <TableHeaderEntry
                    title="Rank"
                    className={`z-10 w-[86px] table-cell md:hidden ${
                      isTop100
                        ? "bg-light-bg-table dark:bg-dark-bg-table"
                        : "bg-light-bg-primary dark:bg-dark-bg-primary"
                    }`}
                    canOrder
                  />
                  <TableHeaderEntry
                    title=""
                    extraCss={`z-10 hidden md:table-cell ${
                      isTop100
                        ? "bg-light-bg-table dark:bg-dark-bg-table"
                        : "bg-light-bg-primary dark:bg-dark-bg-primary"
                    }`}
                  />
                  <TableHeaderEntry
                    title="Name"
                    className={`${
                      isTop100
                        ? "bg-light-bg-table dark:bg-dark-bg-table"
                        : "bg-light-bg-primary dark:bg-dark-bg-primary"
                    } text-start w-[170px] z-10 left-[88px] md:left-[24px]`}
                  />
                  <TableHeaderEntry title="Price" canOrder />
                  <TableHeaderEntry
                    title={
                      activeView?.name === "Portfolio" ? "Balance" : "24h %"
                    }
                    canOrder
                  />
                </>
              )}
            </tr>
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
      {/* <DrawerDex /> */}
      {showMenuTableMobileForToken && showMenuTableMobile ? (
        <MenuCommom />
      ) : null}
    </TableContext.Provider>
  );
}
