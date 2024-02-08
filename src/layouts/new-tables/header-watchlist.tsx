import React from "react";
import { BasicThead } from "./ui/basic-thead";

export const HeaderWatchlist = () => {
  return (
    <tr className="text-left">
      <BasicThead
        title="Follow"
        extraCss="static px-0 lg:pr-2"
        titleCssPosition="justify-center"
      />
      <BasicThead
        title="Name"
        extraCss="text-start static px-0"
        titleCssPosition="justify-start"
      />
      <BasicThead
        title="Followers"
        extraCss="text-start static px-0"
        titleCssPosition="justify-start"
      />
      <BasicThead
        title="Avg. Score"
        extraCss="text-start static px-0"
        titleCssPosition="justify-start"
      />
      <BasicThead
        title="Total Market Cap"
        extraCss="text-start static px-0"
        titleCssPosition="justify-start"
      />
      <BasicThead
        title="24h%"
        extraCss="text-start static  px-0"
        titleCssPosition="justify-start"
      />
      <BasicThead
        title="Made By"
        extraCss="text-start static  px-0"
        titleCssPosition="justify-end"
      />
      <BasicThead title="Assets" extraCss="text-end  px-0" />
    </tr>
  );
};
