import * as echarts from "echarts";
import { useTheme } from "next-themes";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { getTokenPercentage } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { getColorAndLogoFromName } from "../../../../utils";

interface LiquidityProps {
  extraCss?: string;
}

export const Liquidity = ({ extraCss }: LiquidityProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const [biggestPairs, setBiggestPairs] = useState<[string, number][]>([]);

  type EChartsOption = echarts.EChartsOption;
  const id = useMemo(() => uuid(), []);
  const [title, setTitle] = useState("asset");
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const data = biggestPairs.map((pair) => ({
    name: pair[0],
    value: getTokenPercentage(pair[1]),
  }));
  const getColorArrayFromData = () =>
    data.map((item) => getColorAndLogoFromName(item.name)?.logo);
  const logos = getColorArrayFromData();

  useEffect(() => {
    if (baseAsset && baseAsset.assets_raw_pairs) {
      if (title === "asset" && baseAsset?.assets_raw_pairs?.pairs_data) {
        setBiggestPairs(
          Object.entries(baseAsset?.assets_raw_pairs?.pairs_data).sort(
            (a, b) => b[1] - a[1]
          )
        );
      } else if (
        title === "chain" &&
        baseAsset?.assets_raw_pairs?.pairs_per_chain
      ) {
        setBiggestPairs(
          Object.entries(baseAsset?.assets_raw_pairs?.pairs_per_chain).sort(
            (a, b) => b[1] - a[1]
          )
        );
      }
    }
  }, [baseAsset, title]);

  const options: EChartsOption = {
    legend: {
      show: true,
      bottom: biggestPairs?.length > 5 ? "0%" : "2%",
      orient: "horizontal",
      textStyle: {
        color: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
      },
      itemWidth: 10,
      itemHeight: 10,
      borderRadius: 100,
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
        if (params.name === "BNB Smart Chain (BEP20)") name = "BNB";
        if (params.name === "Avalanche C-Chain") name = "Avalanche";
        return `<div style="display:flex;flex-direction:column;align-items:center"><img src="${
          getColorAndLogoFromName(name)?.logo
        }" style="width:30px;height:30px;border-radius:20px;margin-bottom:10px;"/><p class="text-light-font-60 dark:text-dark-font-60" style="font-weight:600;margin-bottom:0px"> ${name}</p><p class="text-light-font-100 dark:text-dark-font-100" style="font-weight:600;font-size:18px;margin:0px">${
          params.value
        }%</p></div>`;
      },
    },
    padding: 20,
    series: [
      {
        name: "Liquidity",
        type: "pie",
        radius: ["55%", "70%"],
        center: ["50%", biggestPairs?.length > 5 ? "40%" : "45%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        data: data as any,
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

  const createInstance = useCallback(() => {
    if (!biggestPairs.length) return;
    const instance = echarts.getInstanceByDom(
      document.getElementById(id) as HTMLElement
    );
    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id, biggestPairs, title]);

  useEffect(() => {
    if (!biggestPairs.length) return;
    const chart = createInstance();
    if (chart) chart.setOption(options);
    return () => chart?.dispose();
  }, [biggestPairs, title]);

  useEffect(() => {
    if (!biggestPairs.length) return;
    const chart = createInstance();
    const handleResize = () => chart?.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [biggestPairs, title]);

  return (
    <div
      className={cn(
        "flex p-5 rounded-2xl md:rounded-0 border border-light-border-primary dark:border-dark-border-primary lg:border-0 mb-2.5 w-full mx-auto flex-col bg-light-bg-secondary dark:bg-dark-bg-secondary",
        extraCss
      )}
    >
      <LargeFont>On-Chain liquidity repartition</LargeFont>
      <div className="flex items-center mt-2.5 w-full h-fit bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-md p-[1px] relative border border-light-border-primary dark:border-dark-border-primary">
        <div
          className="flex absolute w-calc-half-2 h-[32px] lg:h-[30px] md:h-[28px] rounded
         bg-light-bg-hover dark:bg-dark-bg-hover border border-light-border-primary
          dark:border-dark-border-primary transition-all duration-200"
          style={{
            left: title === "asset" ? "calc(0% + 3px)" : "calc(50% - 2px)",
          }}
        />
        <button
          className={`w-2/4 h-[36px] lg:h-[34px] md:h-[32px] transition-all duration-200 
        font-medium text-sm lg:text-[13px] md:text-xs ${
          title === "asset"
            ? "text-light-font-100 dark:text-dark-font-100"
            : "text-light-font-40 dark:text-dark-font-40"
        } z-[2]`}
          onClick={() => setTitle("asset")}
        >
          Asset
        </button>
        <button
          onClick={() => setTitle("chain")}
          className={`w-2/4 h-[36px] lg:h-[34px] md:h-[32px] transition-all duration-200 
          font-medium text-sm lg:text-[13px] md:text-xs ${
            title === "chain"
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          } z-[2]`}
        >
          Chain
        </button>
      </div>
      {biggestPairs.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-5">
          <img
            className="w-[150px] h-[150px]"
            src={
              isDarkMode ? "/asset/empty-roi.png" : "/asset/empty-roi-light.png"
            }
            alt="empty ROI image"
          />
          <SmallFont extraCss="mt-[15px] mb-2.5">No data available</SmallFont>
        </div>
      ) : (
        <div
          className={`flex w-full max-w-[278px] mx-auto ${
            biggestPairs?.length > 5 ? "h-[300px]" : "h-[250px]"
          }`}
        >
          <div
            id={id}
            style={{
              height: biggestPairs?.length > 5 ? "300px" : "250px",
              width: "100%",
            }}
          />
        </div>
      )}
    </div>
  );
};
