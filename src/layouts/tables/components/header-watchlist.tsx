import React from "react";
import { TableHeaderEntry } from "./table-header-entry";

export const HeaderWatchlist = () => {
  return (
    <tr className="text-left">
      <TableHeaderEntry title="Follow" extraCss="static" />
      <TableHeaderEntry title="Name" extraCss="text-start static" />
      <TableHeaderEntry title="Followers" extraCss="text-start static" />
      <TableHeaderEntry title="Avg. Score" extraCss="text-start static" />
      <TableHeaderEntry title="Total Market Cap" extraCss="text-start static" />
      <TableHeaderEntry title="24h%" extraCss="text-start static" />
      <TableHeaderEntry title="Made By" extraCss="text-start static" />
      <TableHeaderEntry title="Assets" extraCss="text-end" />
    </tr>
  );
};
