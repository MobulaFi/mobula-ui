"use client";
import { getFormattedAmount } from "@utils/formaters";
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
import { colors } from "features/asset/constant";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuid } from "uuid";
import { CategoriesProps } from "../../../features/asset/models";

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
  data: CategoriesProps;
  height?: string;
  width?: string;
}

const AreaChart: React.FC<DataProps> = ({ data, height, width }: DataProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const id = useMemo(() => uuid(), []);

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
    title: {
      show: false,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: resolvedTheme === "dark" ? "#222531" : "#F5F5F5",
      confine: true,
      textStyle: {
        color:
          resolvedTheme === "dark"
            ? "rgba(255,255,255,0.8)"
            : "rgba(0,0,0,0.8)",
      },
      padding: 15,
      borderRadius: 12,
      borderColor: "rgba(255,255,255,0.05)",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: resolvedTheme === "dark" ? "#222531" : "#F5F5F5",
          color:
            resolvedTheme === "dark"
              ? "rgba(255,255,255,0.8)"
              : "rgba(0,0,0,0.8)",
        },
      },
      formatter(params) {
        const tooltipText = params
          .map((entry) => `${entry?.marker} ${entry?.seriesName} `)
          .join("<br/>");
        const value = params
          .map((entry) => `${getFormattedAmount(entry?.value[1])}`)
          .join("<br/>");
        return `<div style="display:flex;flex-direction:column;"><div style="display:flex;justify-content:space-between;"><div style="max-width:210px;white-space:pre-wrap;text-align: start;margin-right:20px">${tooltipText}</div><p style="text-align:end">${value}</p></div></div>`;
      },
    },
    legend: {
      show: false,
      padding: [0, 0, 0, 0],
      orient: "horizontal",
      x: "left",
      y: "bottom",
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: "0%",
      right: "0%",
      bottom: "0%",
      top: "5%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "time",
        boundaryGap: false,
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
    series: Object.entries(data)?.map((entry, i) => ({
      name: entry[0],
      type: "line",
      stack: "Total",
      lineStyle: { width: 1 },
      areaStyle: { borderWidth: 1 },
      //   emphasis: {
      //     focus: "series",
      //   },
      markLine: {
        data: [
          {
            xAxis: new Date().getTime(),
            lineStyle: {
              type: "dotted",
              color:
                resolvedTheme === "dark"
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
            },
            symbol: "none",
            label: {
              show: true,
              position: "middle",
              formatter() {
                return "Today";
              },
              backgroundColor: "rgba(255,255,255,0.1)",
              textStyle: {
                color: "rgba(0,0,0,0.8)",
                letterSpacing: 20,
                fontWeight: "400",
                padding: [3, 6, 3, 6],
                textAlign: "center",
              },
            },
          },
        ],
      },
      itemStyle: {
        color: colors[i],
        borderRadius: [500, 500, 500, 500],
      },
      symbolSize: 0,
      data: entry[1],
    })),
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
      style={{ height: "300px", width: "100%" }}
    />
  );
};

export default AreaChart;
