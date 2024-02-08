import React, { ReactNode, useContext, useMemo, useRef } from "react";
import { Ths } from "../../../components/table";
import { PopupStateContext } from "../../../contexts/popup";
import { useTop100 } from "../../../features/data/top100/context-manager";
import { TableContext } from "../context-manager";
import { OrderBy } from "../model";
import { BasicThead } from "../ui/basic-thead";
import { MenuCommun } from "../ui/menu";

interface CommonTableHeaderProps {
  lastColumn?: string;
  orderBy: OrderBy;
  setOrderBy: React.Dispatch<React.SetStateAction<OrderBy>>;
  hideDEXVolume?: boolean;
  children: ReactNode;
}

export function CommonTableHeader({
  lastColumn = "Chart",
  hideDEXVolume = false,
  orderBy,
  setOrderBy,
  children,
}: CommonTableHeaderProps) {
  const headerRef = useRef(null);
  const { isLoading } = useTop100();
  const { showMenuTableMobileForToken, showMenuTableMobile } =
    useContext(PopupStateContext);

  const value = useMemo(
    () => ({
      lastColumn,
      bg: "bg-light-bg-primary dark:bg-dark-bg-primary",
      orderBy,
      setOrderBy,
      isBalance: false,
      hideDEXVolume,
    }),
    [lastColumn, orderBy, hideDEXVolume]
  );

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
                <tr className="text-left sticky top-0">
                  <BasicThead
                    title="Rank"
                    canOrder
                    extraCss="bg-light-bg-primary dark:bg-dark-bg-primary w-[86px] z-10 table-cell md:hidden"
                    titleCssPosition="justify-start"
                  />
                  <BasicThead
                    title=""
                    extraCss="z-10 hidden md:table-cell bg-light-bg-primary dark:bg-dark-bg-primary md:px-0"
                  />
                  <BasicThead
                    title="Name"
                    extraCss="text-start w-[170px] z-[100] bg-light-bg-primary dark:bg-dark-bg-primary left-[73px] md:left-[28px] md:px-[5px]"
                    titleCssPosition="justify-start"
                  />
                  <BasicThead extraCss="static" title="Price" canOrder />
                  <BasicThead extraCss="static" title="24h %" canOrder />
                  <BasicThead extraCss="static" title="Market Cap" canOrder />
                  <BasicThead extraCss="static" title="24h Volume" canOrder />
                  <BasicThead
                    extraCss="static whitespace-nowrap"
                    title={lastColumn}
                  />
                  <BasicThead
                    extraCss="w-[89px] table-cell md:hidden static"
                    title="Swap"
                  />
                </tr>
              </>
            )}
          </thead>
          {children}
        </table>
      </div>
      {showMenuTableMobileForToken && showMenuTableMobile ? (
        <MenuCommun />
      ) : null}
    </TableContext.Provider>
  );
}
