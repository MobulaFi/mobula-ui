"use client";
import { BarChart, LineChart } from "echarts/charts";
import {
  DataZoomComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuid } from "uuid";
import { getFormattedAmount } from "../../../utils/formaters";

echarts.use([
  CanvasRenderer,
  LineChart,
  BarChart,
  TooltipComponent,
  TitleComponent,
  GridComponent,
  DataZoomComponent,
  GraphicComponent,
  MarkLineComponent,
  LegendComponent,
]);

interface DataProps {
  data: [number, number, [string, number]][];
  height?: string;
  width?: string;
}

const BasicLineChartComponent: React.FC<DataProps> = ({ data }: DataProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const id = useMemo(() => uuid(), []);
  const { resolvedTheme } = useTheme();

  const createInstance = useCallback(() => {
    const instance = echarts.getInstanceByDom(
      document.getElementById(id) as HTMLElement
    );

    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id]);

  const options = {
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "5%",
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      padding: 0,
      backgroundColor: "transparent",
      borderColor: "transparent",
      formatter: (params: any) => {
        const value = params?.[0]?.value[1];
        return `
          <div class="flex items-center p-2.5 rounded-lg bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary
           dark:border-dark-border-primary">
            <div class="flex items-center justify-between text-light-font-100 dark:text-dark-font-100 font-medium">
              <div class="flex items-center mr-2.5 w-full">
                <div class="h-[10px] w-[10px] min-w-[10px] rounded-full mr-2.5 ${
                  (getFormattedAmount(value) as number) > 0
                    ? "bg-green dark:bg-green"
                    : "bg-red dark:bg-red"
                }" />
              </div>
              ${getFormattedAmount(value)}$
            </div>
           </div>`;
      },
    },
    xAxis: [
      {
        type: "time",
        axisLabel: {
          color:
            resolvedTheme === "dark"
              ? "rgba(255,255,255,0.8)"
              : "rgba(0,0,0,0.8)",
        },
        axisLine: {
          lineStyle: {
            color:
              resolvedTheme === "dark"
                ? "rgba(255,255,255,0.03)"
                : "rgba(0,0,0,0.03)",
          },
        },
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          formatter(value: number) {
            return getFormattedAmount(value);
          },
          color:
            resolvedTheme === "dark"
              ? "rgba(255,255,255,0.8)"
              : "rgba(0,0,0,0.8)",
        },
        axisLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.8)",
            borderColor: "red",
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255,255,255,0.05)",
            width: 1,
          },
        },
      },
    ],
    series: {
      name: "Profit",
      type: "line",
      showSymbol: false,
      itemStyle: {
        color: (params) => {
          const value = params?.value?.[1];
          if (value > 0) return "#0ECB81";
          return "#ea3943";
        },
      },
      lineStyle: {
        normal: {
          color: data[data?.length - 1][1] > data[0][1] ? "#0ECB81" : "#ea3943",
        },
      },
      data: data,
    },
  };

  useEffect(() => {
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, [data, resolvedTheme]);

  useEffect(() => {
    const chart = createInstance();
    window.onresize = () => {
      chart.resize();
    };

    const parent = parentRef.current;
    if (parent) {
      parent.addEventListener("touchend", () => {
        chart.dispatchAction({
          type: "hideTip",
        });
      });
    }
  }, [resolvedTheme]);

  return (
    <div
      ref={parentRef}
      id={id}
      className="no-swipe"
      style={{ height: "170px", width: "100%" }}
    />
  );
};

export default BasicLineChartComponent;
