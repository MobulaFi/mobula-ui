import React, { useMemo, useState } from "react";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { Ths } from "../../../../../components/table";
import { OrderBy } from "../../../../../interfaces/assets";
import { TableContext } from "../../../../../layouts/new-tables/context-manager";
import { BasicThead } from "../../../../../layouts/new-tables/ui/basic-thead";
import { useChains } from "../../context-manager";

interface TableHeaderProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export const TableHeader = ({
  children,
  isLoading = false,
}: TableHeaderProps) => {
  const { switchedToNative, setSwitchedToNative } = useChains();
  const [orderBy, setOrderBy] = useState<OrderBy>({
    type: "last_trade",
    ascending: false,
    first: true,
  });
  const value = useMemo(
    () => ({
      orderBy,
      setOrderBy,
    }),
    [orderBy]
  );
  return (
    <TableContext.Provider value={value}>
      <div className="overflow-auto relative top-0 w-full min-h-[680px] lg:min-h-[450px] sm:min-h-[300px] lg:mt-0">
        <table className="caption-bottom scroll mb-[28px] max-w-[1300px] cursor-pointer my-0 mx-auto relative w-full overflow-x-scroll">
          <thead className="border-t border-light-border-primary dark:border-dark-border-primary text-light-font-80 dark:text-dark-font-80 sticky top-0 ">
            {isLoading ? (
              <tr className="text-left table-row">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Ths key={i} extraCss="px-5 md:px-2.5" children={undefined} />
                ))}
              </tr>
            ) : (
              <>
                <tr className="text-left">
                  <BasicThead
                    title="Token"
                    extraCss="text-start sticky left-0 z-[1] bg-light-bg-primary dark:bg-dark-bg-primary"
                    titleCssPosition="justify-start"
                  />
                  <BasicThead
                    extraCss="static"
                    title={
                      <>
                        <HiOutlineSwitchHorizontal className="mr-1 text-sm" />
                        {!switchedToNative ? "Price USD" : "Price Native"}
                      </>
                    }
                    canOrder
                    callback={() => setSwitchedToNative((prev) => !prev)}
                  />
                  {/* <BasicThead extraCss="static" title="Txns" canOrder /> */}
                  <BasicThead extraCss="static" title="Volume" canOrder />
                  <BasicThead extraCss="static" title="Liquidity" canOrder />
                  <BasicThead extraCss="static" title="Market Cap" canOrder />
                  <BasicThead extraCss="static" title="5m" canOrder />
                  <BasicThead extraCss="static" title="1h" canOrder />
                  <BasicThead extraCss="static" title="4h" canOrder />
                  <BasicThead extraCss="static" title="24h" canOrder />
                  <BasicThead extraCss="static" title="Last Tx" canOrder />
                </tr>
              </>
            )}
          </thead>
          {children}
        </table>
      </div>
    </TableContext.Provider>
  );
};
