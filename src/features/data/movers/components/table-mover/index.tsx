import React from "react";
import { MoversType } from "../../models";
import { TbodyMovers } from "../tbody";

interface MoversTableProps {
  assets: MoversType[];
  isGainer: boolean;
}

export const MoversTable = ({ assets, isGainer }: MoversTableProps) => {
  const thStyle =
    "border-b border-light-border-secondary dark:border-dark-border-secondary text-sm md:text-xs text-light-font-100 dark:text-dark-font-100 px-[5px] py-2.5";

  return (
    <table className="lg:mt-2.5 w-full">
      <thead className="border-t border-light-border-primary dark:border-dark-border-primary text-sm md:text-[12px]">
        <tr className="text-light-font-100 dark:text-dark-font-100">
          <th
            className={`${thStyle} max-w-[150px] sticky left-0 bg-none font-normal text-start`}
          >
            Name
          </th>
          <th className={`${thStyle} text-end font-normal`}>Price</th>
          <th className={`${thStyle} text-end font-normal whitespace-nowrap`}>
            Volume (24h)
          </th>
          <th className={`${thStyle} text-end font-normal`}>24h %</th>
        </tr>
      </thead>
      {assets?.map((asset) => (
        <TbodyMovers key={asset.id} asset={asset} />
      ))}
    </table>
  );
};
