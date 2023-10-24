/* eslint-disable no-param-reassign */
"use client";
import {
  Flex,
  Table,
  TableContainer,
  TableContainerProps,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useContext, useEffect, useMemo, useRef } from "react";
import { useAccount } from "wagmi";
import { PopupStateContext } from "../../../contexts/popup";
import { defaultTop100 } from "../../../features/data/Home/constants";
import { useTop100 } from "../../../features/data/Home/context-manager";
import { Query } from "../../../interfaces/pages/top100";
import { useColors } from "../../../lib/chakra/colorMode";
import { createSupabaseDOClient } from "../../../lib/supabase";
// import { DrawerDex } from "../../../components/drawer/dex";
import { TABLE_ASSETS_QUERY } from "../../../app/page";
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
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  return (
    <TableContext.Provider value={value}>
      <Flex
        display="block"
        overflow="auto"
        position="relative"
        top="0px"
        w="100%"
        minH={["300px", "450px", "450px", "680px"]}
      >
        <TableContainer
          mb="28px"
          mx="auto"
          flexDirection="column"
          alignItems="center"
          position="relative"
          overflow="auto"
          isfixed="1"
          top="0px"
          className="scroll"
          {...props}
        >
          <Table
            w={["auto", "auto", "100%"]}
            minW={["100%", "100%", "100%", "100%"]}
            maxW={["1400px", "1400px", "1280px", "1280px", "1600px"]}
            cursor="pointer"
            margin="0px auto"
            position="relative"
          >
            <Thead
              textTransform="capitalize"
              fontFamily="Inter"
              borderTop={borders}
              color={text60}
              position="sticky"
              top="0px"
              ref={headerRef}
            >
              <Tr
                textAlign="left"
                position="sticky"
                top="0px"
                display={[
                  pathname !== "/" &&
                  pathname !== "/home" &&
                  pathname !== `/?page=${page}`
                    ? "table-row"
                    : "none",
                  pathname !== "/" &&
                  pathname !== "/home" &&
                  pathname !== `/?page=${page}`
                    ? "table-row"
                    : "none",
                  pathname === "/" ||
                  pathname !== "/home" ||
                  pathname === `/?page=${page}`
                    ? "none"
                    : "table-row",
                  "table-row",
                ]}
              >
                <TableHeaderEntry
                  title="Rank"
                  w="86px"
                  canOrder
                  zIndex="102"
                  display={["none", "none", "table-cell"]}
                  bg={isTop100 ? bgTable : bgMain}
                />
                <TableHeaderEntry
                  title=""
                  zIndex="102"
                  display={["table-cell", "table-cell", "none"]}
                  bg={isTop100 ? bgTable : bgMain}
                />
                <TableHeaderEntry
                  title="Name"
                  textAlign="start"
                  w="170px"
                  zIndex="102"
                  bg={isTop100 ? bgTable : bgMain}
                  left={["24px", "24px", "73px"]}
                />
                {activeView?.display &&
                (pathname === "/" ||
                  pathname !== "/home" ||
                  pathname !== `/?page=${page}`) ? (
                  <>
                    {activeView?.display?.map((entry) => (
                      <TableHeaderEntry
                        key={entry.value}
                        title={
                          entry.value === "Price USD" ? "Price" : entry.value
                        }
                        canOrder
                        textAlign={
                          entry.value === "24h Chart" ? "center" : "end"
                        }
                      />
                    ))}

                    <TableHeaderEntry
                      w="89px"
                      title="Interact"
                      display={["none", "none", "table-cell"]}
                    />
                  </>
                ) : (
                  <>
                    <TableHeaderEntry
                      w="140px"
                      title="Price"
                      canOrder
                      isNumeric
                    />
                    <TableHeaderEntry title="24h (%)" canOrder />
                    <TableHeaderEntry title="Market Cap" canOrder />
                    <TableHeaderEntry
                      w="162.41px"
                      title={isBalance ? "Balance" : "Volume (24h)"}
                      canOrder
                    />
                    {pathname !== "/" &&
                    pathname !== "/home" &&
                    pathname !== `/?page=${page}` ? (
                      <TableHeaderEntry w="175px" title={lastColumn} />
                    ) : null}
                    {pathname === "/" ||
                    pathname !== "/home" ||
                    pathname === `/?page=${page}` ||
                    isBalance ? (
                      <TableHeaderEntry
                        w="89px"
                        title="Chart 24h"
                        textAlign="center"
                        display={["none", "none", "table-cell"]}
                      />
                    ) : null}
                    <TableHeaderEntry
                      w="89px"
                      title="Interact"
                      display={["none", "none", "table-cell"]}
                    />
                  </>
                )}
              </Tr>
              <Tr
                textAlign="left"
                position="sticky"
                top="0px"
                display={[
                  pathname !== "/" &&
                  pathname !== "/home" &&
                  pathname !== `/?page=${page}`
                    ? "none"
                    : "table-row",
                  pathname !== "/" &&
                  pathname !== "/home" &&
                  pathname !== `/?page=${page}`
                    ? "none"
                    : "table-row",
                  pathname === "/" ||
                  pathname !== "/home" ||
                  pathname === `/?page=${page}`
                    ? "table-row"
                    : "none",
                  "none",
                ]}
              >
                {!showMinimalMobile &&
                (pathname === "/" ||
                  pathname !== "/home" ||
                  pathname === `/?page=${page}`) ? (
                  <>
                    <TableHeaderEntry
                      title=""
                      zIndex="102"
                      display={[
                        "table-cell",
                        "table-cell",
                        "table-cell",
                        "none",
                      ]}
                      bg={isTop100 ? bgTable : bgMain}
                    />
                    <TableHeaderEntry
                      title="Name"
                      textAlign="start"
                      w="170px"
                      zIndex="102"
                      bg={isTop100 ? bgTable : bgMain}
                      left={["24px", "24px", "88px"]}
                    />
                    {activeView?.display?.map((entry) => (
                      <TableHeaderEntry
                        key={Math.random()}
                        title={
                          entry.value === "Price USD" ? "Price" : entry.value
                        }
                        canOrder
                      />
                    ))}

                    <TableHeaderEntry
                      w="89px"
                      title="Interact"
                      display={["none", "none", "table-cell"]}
                    />
                  </>
                ) : (
                  <>
                    <TableHeaderEntry
                      title="Rank"
                      w="86px"
                      canOrder
                      zIndex="102"
                      display={["none", "none", "table-cell"]}
                      bg={isTop100 ? bgTable : bgMain}
                    />
                    <TableHeaderEntry
                      title=""
                      zIndex="102"
                      display={["table-cell", "table-cell", "none"]}
                      bg={isTop100 ? bgTable : bgMain}
                    />
                    <TableHeaderEntry
                      title="Name"
                      textAlign="start"
                      w="170px"
                      zIndex="102"
                      bg={isTop100 ? bgTable : bgMain}
                      left={["24px", "24px", "88px"]}
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
              </Tr>
            </Thead>

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
          </Table>
        </TableContainer>
      </Flex>
      {/* <DrawerDex /> */}
      {showMenuTableMobileForToken && showMenuTableMobile ? (
        <MenuCommom />
      ) : null}
    </TableContext.Provider>
  );
}
