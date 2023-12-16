/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import React, { useContext, useState } from "react";
import { PortfolioV2Context } from "../../context-manager";
import { boxStyle } from "../../style";
import { HoldingChart } from "./chart";
import { getChainsBreakdownFromPortfolio } from "./utils";

interface HoldingsProps {
  chartId: string;
  asset?: boolean;
}

export const Holdings = ({
  chartId,
  asset: isAsset = false,
}: HoldingsProps) => {
  const { wallet, isLoading } = useContext(PortfolioV2Context);
  const [typeSelected, setTypeSelected] = useState("Assets");
  const MAX_DISPLAY = 4;
  const initialChains = getChainsBreakdownFromPortfolio(wallet?.portfolio);

  const sortedBlockchains = Object.entries(initialChains)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_DISPLAY);

  return (
    <div
      className={`${boxStyle} flex-col mt-2.5 border border-light-border-primary dark:border-dark-border-primary
    bg-light-bg-secondary dark:bg-dark-bg-secondary w-[320px] lg:w-full font-medium`}
    >
      {(!wallet && !isLoading) ||
      ((isAsset || typeSelected === "Blockchains") &&
        sortedBlockchains?.length === 0) ? (
        <img
          className="mt-[2.5] ml-[2.5px]"
          // light mode TODO
          src={"/asset/holding.png"}
          alt="no holdings logo"
        />
      ) : (
        <HoldingChart />
      )}
    </div>
  );
};
