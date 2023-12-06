import React from "react";
import { TableHeaderEntry } from "./table-header-entry";

export const HeaderWatchlist = () => {
  return (
    <tr className="text-left">
      <TableHeaderEntry
        title="Follow"
        extraCss="static px-0 lg:pr-2"
        titleCssPosition="justify-center"
      />
      <TableHeaderEntry
        title="Name"
        extraCss="text-start static px-0"
        titleCssPosition="justify-start"
      />
      <TableHeaderEntry
        title="Followers"
        extraCss="text-start static px-0"
        titleCssPosition="justify-start"
      />
      <TableHeaderEntry
        title="Avg. Score"
        extraCss="text-start static px-0"
        titleCssPosition="justify-start"
      />
      <TableHeaderEntry
        title="Total Market Cap"
        extraCss="text-start static px-0"
        titleCssPosition="justify-start"
      />
      <TableHeaderEntry
        title="24h%"
        extraCss="text-start static  px-0"
        titleCssPosition="justify-start"
      />
      <TableHeaderEntry
        title="Made By"
        extraCss="text-start static  px-0"
        titleCssPosition="justify-end"
      />
      <TableHeaderEntry title="Assets" extraCss="text-end  px-0" />
    </tr>
  );
};
