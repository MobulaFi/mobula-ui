import * as echarts from "echarts";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useTheme } from "next-themes";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { LargeFont, SmallFont } from "../../../../../components/fonts";
import { Skeleton } from "../../../../../components/skeleton";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { getChainsBreakdownFromPortfolio } from "./utils";

export const HoldingChart = ({ ...props }) => {
  const MAX_DISPLAY = 4;
  const { wallet, asset, manager, isLoading } = useContext(PortfolioV2Context);
  const [biggestPairs, setBiggestPairs] = useState<[string, number][]>([]);
  type EChartsOption = echarts.EChartsOption;
  const id = useMemo(() => uuid(), [isLoading]);
  const [title, setTitle] = useState("asset");
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const sortedHoldings = useMemo(
    () =>
      wallet?.portfolio
        ?.filter((entry) => entry.price > 0 && entry.estimated_balance > 0)
        .sort((a, b) => b.estimated_balance - a.estimated_balance)
        .slice(0, 5) || [],
    [isLoading]
  );

  const getHoldingListValue = (entry, isAssets) => {
    if (isAssets) return `${getTokenPercentage(entry.allocation)}%`;
    if (manager.privacy_mode) return "****";
    return `$${getFormattedAmount(entry[1])}`;
  };

  const otherHoldings =
    wallet?.portfolio
      ?.filter((entry) => entry.price > 0 && entry.estimated_balance > 0)
      .sort((a, b) => b.estimated_balance - a.estimated_balance)
      .filter((_, i) => i >= MAX_DISPLAY) || [];

  const initialChains = getChainsBreakdownFromPortfolio(wallet?.portfolio);
  const sortedBlockchains = Object.entries(initialChains)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_DISPLAY);

  const blockchains = {};
  sortedBlockchains.forEach((entry) => {
    blockchains[entry[0]] = entry[1];
  });

  const total = sortedBlockchains.reduce((acc, chain) => acc + chain[1], 0);

  const seen = new Set();
  let data;

  if (title !== "chain")
    data = sortedHoldings
      ?.concat(otherHoldings)
      .map((token) => {
        if (!seen.has(token.symbol)) {
          seen.add(token.symbol);
          return {
            name: token.symbol,
            value: getTokenPercentage(Number(token.allocation)),
            logo: token.image,
            amount: token.estimated_balance,
          };
        }
      })
      .filter(Boolean);
  else
    data = sortedBlockchains.map((chain) => {
      const percentage = (chain[1] / total) * 100;
      return {
        name: chain[0],
        value: getTokenPercentage(Number(percentage)),
        logo: blockchainsContent[chain[0]]?.logo,
        amount: chain[1],
      };
    });

  const options: EChartsOption = {
    legend: {
      show: true,
      bottom: data?.length < 3 ? "4%" : "3%",
      orient: "horizontal",
      textStyle: {
        color: isDarkMode ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.95)",
        fontWeight: 500,
      },
      itemWidth: 10,
      itemHeight: 10,
      data: data.filter((_, i) => i < 7),
      borderRadius: 100,
      formatter(params) {
        const foundData = data.find((item) => item.name === params);
        let name = foundData ? foundData.name : null;
        if (name === "BNB Smart Chain (BEP20)") name = "BNB";
        if (name === "Arbitrum") name = "ARB";
        if (name === "Ethereum") name = "ETH";
        if (name === "Polygon") name = "MATIC";
        if (name === "Avalanche C-Chain") name = "Avalanche";
        return name;
      },
    },
    tooltip: {
      alwaysShowContent: false,
      show: true,
      backgroundColor: "transparent",
      borderColor: "transparent",
      trigger: "item",
      position: ["23%", "20%"],
      shadowColor: "none",
      extraCssText:
        "width: 150px; height: auto;display:flex;align-items:center;justify-content:center;flex-direction:column;box-shadow:none",
      formatter(params) {
        let { name } = params;
        let newLogo = params.data.logo;
        const { amount } = params.data;

        if (params.name === "BNB Smart Chain (BEP20)") name = "BNB";
        if (params.name === "Avalanche C-Chain") name = "Avalanche";
        if (params.name === "Off-chain") newLogo = "/icon/unknown.png";
        return `<div style="display:flex;flex-direction:column;align-items:center"><img src="${newLogo}" style="width:30px;height:30px;border-radius:20px;margin-bottom:10px;"/><p class="text-light-font-60 dark:text-dark-font-60" style="font-weight:600;margin-bottom:0px"> ${name}</p><p class="text-light-font-100 dark:text-dark-font-100" style="font-weight:600;font-size:18px;margin:0px">$${getFormattedAmount(
          amount
        )}</p></div>`;
      },
    },
    padding: 20,
    series: [
      {
        name: "Liquidity",
        type: "pie",
        radius: ["55%", "70%"],
        center: ["50%", "42%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        data: data as any[],
        color: [
          "#165DFF",
          "#D91AD9",
          "#F7BA1E",
          "#722ED1",
          "#0ECB81",
          "#EE5858",
          "#B4CFFF",
          "#2F3658",
        ],
      },
    ],
  };

  const createInstance = () => {
    if (!sortedHoldings.length || !sortedBlockchains?.length || !id) return;
    const element = document.getElementById(id) as HTMLElement;
    if (!element) return;
    const instance = echarts.getInstanceByDom(element);
    return (
      instance ||
      echarts.init(element, null, {
        renderer: "canvas",
      })
    );
  };

  useEffect(() => {
    if (!isLoading && data.length > 0) {
      const chart = createInstance();
      if (chart) {
        chart.setOption(options);
        const handleResize = () => chart.resize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }
    }
  }, [isLoading, data, id, sortedHoldings, sortedBlockchains, options, title]);

  return (
    <div
      className="flex bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-2xl md:rounded-none mb-2.5 w-full flex-col"
      {...props}
    >
      <LargeFont extraCss="text-light-font-100 dark:text-dark-font-100 mb-0 ml-[5px] font-medium">
        Holdings
      </LargeFont>
      <div
        className="flex w-full h-fit bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-lg p-[1px] relative border 
      border-light-border-primary dark:border-dark-border-primary items-center mt-2.5"
      >
        <div
          className={`flex absolute w-calc-half-2 h-[32px] lg:h-[30px] md:h-[28px] rounded-md
         bg-light-bg-hover dark:bg-dark-bg-hover transition-all duration-300`}
          style={{
            left: title === "asset" ? "calc(0% + 3px)" : "calc(50% - 2px)",
          }}
        />
        <button
          className={`w-2/4 h-[36px] lg:h-[34px] md:h-[32px] ${
            title === "asset"
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          } 
         transition-all duration-200 font-normal text-sm lg:text-[13px] md:text-xs bg-transparent z-[1]`}
          onClick={() => setTitle("asset")}
        >
          Assets
        </button>
        <button
          className={`w-2/4 h-[36px] lg:h-[34px] md:h-[32px] ${
            title === "chain"
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          }  
          transition-all duration-200 font-normal text-sm lg:text-[13px] md:text-xs bg-transparent z-[1]`}
          onClick={() => setTitle("chain")}
        >
          Blockchains
        </button>
      </div>
      <div className="min-h-[300px]">
        {data.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center mt-5 mx-auto h-[300px] ">
            <img
              className="w-[150px] h-[150px] min-w-[150px]"
              src={
                isDarkMode
                  ? "/asset/empty-roi.png"
                  : "/asset/empty-roi-light.png"
              }
              alt="empty roi logo"
            />
            <SmallFont extraCss="mt-[15px] mb-2.5">No data available</SmallFont>
          </div>
        ) : null}
        {data.length > 0 && !isLoading ? (
          <div className="flex h-[300px] md:w-[278px] mx-auto flex-col">
            <div id={id} className="h-[300px] w-[278px] min-w-[278px]" />
          </div>
        ) : null}
        {isLoading ? (
          <>
            <div className="relative h-[185px] mt-8 w-full flex items-center justify-center mb-5">
              <Skeleton extraCss="h-[185px] w-[185px] rounded-full" />
              <div className="h-[140px] w-[140px] rounded-full bg-light-bg-secondary dark:bg-dark-bg-secondary absolute" />
            </div>
            <div className="w-full flex items-center mt-2.5 flex-wrap">
              {Array.from({ length: 5 }).map((_, i) => (
                <>
                  <Skeleton extraCss="h-[14px] w-[14px] rounded-md mt-2.5" />
                  <Skeleton extraCss="h-[14px] w-[40px] rounded-md ml-2 mr-2.5 mt-2.5" />
                </>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};
