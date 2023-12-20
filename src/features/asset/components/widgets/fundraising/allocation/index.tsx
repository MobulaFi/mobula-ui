import * as echarts from "echarts";
import { useTheme } from "next-themes";
import { useCallback, useContext, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { NextImageFallback } from "../../../../../../components/image";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { colors, nonMatchingColors } from "../../../../constant";
import { BaseAssetContext } from "../../../../context-manager";

interface AllocationProps {
  extraCss?: string;
}

export const Allocation = ({ extraCss }: AllocationProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  type EChartsOption = echarts.EChartsOption;
  const id = useMemo(() => uuid(), []);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const getHeight = () => {
    if (baseAsset?.distribution?.length > 7) return { h: "380px", y: "33%" };
    if (baseAsset?.distribution?.length >= 5) return { h: "350px", y: "38%" };
    return { h: "300px", y: "43%" };
  };

  const getPositionTooltip = () => {
    if (baseAsset?.distribution?.length > 7) return ["23%", "21%"];
    if (baseAsset?.distribution?.length >= 5) return ["23%", "25%"];
    return ["23%", "29%"];
  };

  const { h, y } = getHeight();

  const data =
    baseAsset?.distribution.length > 0
      ? baseAsset?.distribution?.map((entry) => ({
          value: entry.percentage,
          name: entry.name,
        }))
      : [];

  const getNameWithColors = () => {
    const vestings =
      baseAsset?.release_schedule?.length > 0
        ? baseAsset?.release_schedule
        : [];
    const types = [];
    const seen = new Set();
    vestings?.forEach(([, , type], idx) => {
      if (idx === 0) {
        Object.keys(type)?.forEach((key) => {
          types.push(key);
          seen.add(key);
        });
      } else {
        Object.keys(type)?.forEach((key) => {
          if (!seen.has(key)) {
            seen.add(key);
            types.push(key);
          }
        });
      }
    });
    const typeWithColor = [];
    types.forEach((type, i) => {
      typeWithColor.push({ name: type, color: colors[i] });
    });

    return typeWithColor;
  };

  const getFinalColors = () => {
    const newColors = [];
    data.forEach((e, i) => {
      getNameWithColors().forEach((vesting) => {
        if (e.name === vesting.name) {
          newColors[i] = vesting.color;
        }
      });
      if (newColors[i] === undefined) {
        newColors[i] = nonMatchingColors[i];
      }
    });
    return newColors;
  };

  const newColors = getFinalColors();
  const options: EChartsOption = {
    legend: {
      show: true,
      bottom: baseAsset?.distribution?.length > 5 ? "0%" : "2%",
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
      position: getPositionTooltip(),
      shadowColor: "none",
      extraCssText:
        "width: 150px; height: auto;display:flex;align-items:center;justify-content:center;flex-direction:column;box-shadow:none",
      formatter(params) {
        let { name } = params;

        if (params.name.length > 25) name = `${name.slice(0, 25)}...`;
        return `<div style="display:flex;flex-direction:column;align-items:center"><p class="text-light-font-60 dark:text-dark-font-60 font-bold" style="font-size:12px;margin-bottom:0px;max-width:150px;white-space:pre-wrap;text-align:center"> ${name}</p><p class="text-light-font-100 dark:text-dark-font-100" style="font-weight:600;font-size:18px;margin:0px">${params.value}%</p></div>`;
      },
    },
    padding: 20,
    series: [
      {
        name: "Liquidity",
        type: "pie",
        radius: ["55%", "70%"],
        center: ["50%", y],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        data,
        color: newColors,
      },
    ],
  };

  const createInstance = useCallback(() => {
    if (!data?.length) return;
    const instance = echarts.getInstanceByDom(
      document.getElementById(id) as HTMLElement
    );
    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id, baseAsset?.distribution, theme]);

  useEffect(() => {
    if (!baseAsset?.distribution.length) return;
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, [baseAsset?.distribution, theme]);

  useEffect(() => {
    if (!baseAsset?.distribution.length) return;
    const chart = createInstance();
    if (chart) {
      const handleResize = () => chart.resize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [baseAsset?.distribution, theme]);

  return (
    <div
      className={cn(
        "p-5 rounded-2xl border border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary flex-col flex mb-2.5 w-full mx-auto",
        extraCss
      )}
    >
      <LargeFont>Token Allocation</LargeFont>
      {baseAsset?.distribution?.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-5">
          <NextImageFallback
            src={
              isDarkMode ? "/asset/empty-roi.png" : "/asset/empty-roi-light.png"
            }
            alt="empty ROI"
            height={150}
            width={150}
            fallbackSrc={""}
          />
          <SmallFont extraCss="mt-[15px] mb-2.5">No data available</SmallFont>
        </div>
      ) : (
        <div
          className="flex w-full max-w-[278px] mx-auto"
          style={{
            height: h,
          }}
        >
          <div
            id={id}
            style={{
              height: h,
              width: "100%",
            }}
          />
        </div>
      )}
    </div>
  );
};
