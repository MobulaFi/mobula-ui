import { Tr } from "@chakra-ui/react";
import React from "react";
import { TableHeaderEntry } from "./table-header-entry";

export const HeaderWatchlist = () => {
  const positionStyle: any = {
    position: "static !important",
  };
  return (
    <Tr textAlign="left">
      <TableHeaderEntry title="Follow" {...positionStyle} />
      <TableHeaderEntry title="Name" textAlign="left" {...positionStyle} />
      <TableHeaderEntry
        title="Followers"
        textAlign="start"
        {...positionStyle}
      />
      <TableHeaderEntry
        title="Avg. Score"
        textAlign="left"
        {...positionStyle}
      />
      <TableHeaderEntry
        title="Total Market Cap"
        textAlign="left"
        {...positionStyle}
      />
      <TableHeaderEntry title="24h%" textAlign="left" {...positionStyle} />
      <TableHeaderEntry title="Made By" textAlign="left" {...positionStyle} />
      <TableHeaderEntry title="Assets" textAlign="right" />
    </Tr>
  );
};
