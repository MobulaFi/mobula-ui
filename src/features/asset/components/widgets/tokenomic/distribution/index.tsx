import * as echarts from "echarts";
import { useTheme } from "next-themes";
import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { NextImageFallback } from "../../../../../../components/image";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../../context-manager";

interface DistributionProps {
  extraCss?: string;
}

export const Distribution = ({ extraCss }: DistributionProps) => {
  const { baseAsset, activeTab } = useContext(BaseAssetContext);
  type EChartsOption = echarts.EChartsOption;
  let options: EChartsOption;
  const id = useMemo(() => uuid(), []);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const data =
    baseAsset?.distribution.length > 0
      ? baseAsset?.distribution?.map((entry) => ({
          value: entry.percentage,
          name: entry.name,
        }))
      : [];

  options = {
    legend: {
      show: true,
      bottom: "0%",
      orient: "horizontal",
      textStyle: {
        color: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
      },
      itemWidth: 10,
      itemHeight: 10,
      borderRadius: 100,
    },
    padding: 20,
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["50%", "70%"],
        center: ["50%", "40%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            width: 100,
            align: "center",
            overflow: "break",
            color: isDarkMode
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(0, 0, 0, 0.8)",
            formatter(params) {
              return `${params.name}\n\n${params.value}%`;
            },
          },
        },
        labelLine: {
          show: false,
        },
        data,
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
    if (!baseAsset?.distribution?.length) return null;
    const instance = echarts.getInstanceByDom(
      document.getElementById(id) as HTMLElement
    );
    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id, baseAsset, activeTab]);

  useEffect(() => {
    if (baseAsset?.distribution?.length === 0) return;
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, [baseAsset, activeTab]);

  useEffect(() => {
    if (baseAsset?.distribution?.length === 0) return;
    const chart = createInstance();
    window.onresize = function () {
      if (chart) chart.resize();
    };
  }, [baseAsset, activeTab]);

  return (
    <div
      className={cn(
        "p-5 rounded-2xl mx-auto bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary mb-2.5 w-full flex flex-col",
        extraCss
      )}
    >
      <MediumFont extraCss="flex lg:hidden">Distribution</MediumFont>{" "}
      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-5">
          <NextImageFallback
            width={150}
            height={150}
            src={
              isDarkMode ? "/asset/empty-roi.png" : "/asset/empty-roi-light.png"
            }
            fallbackSrc={""}
            alt="empty roi image"
          />
          <SmallFont extraCss="mt-[15px] mb-2.5">No data available</SmallFont>
        </div>
      ) : (
        <div id={id} style={{ height: "300px", width: "100%" }} />
      )}
    </div>
  );
};
