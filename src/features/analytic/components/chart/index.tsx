"use client";
import { BarChart, LineChart, PieChart } from "echarts/charts";
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
import { useAnalytics } from "features/analytic/context-manager";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { v4 as uuid } from "uuid";
import { OptionsProps } from "../../models";
import { getTooltip, graphic, grid, xAxis, yAxis } from "./options";
import { getSeries } from "./utils";

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
  PieChart,
]);

const ChartAnalytic: React.FC<OptionsProps> = ({
  chartOptions,
}: {
  chartOptions: any;
}) => {
  // selectedOption: chartOptions,
  const { setSelectedOption } = useAnalytics();
  const parentRef = useRef<HTMLDivElement>(null);
  const id = useMemo(() => uuid(), []);
  const { resolvedTheme } = useTheme();
  const { data, colors, type, name } = chartOptions;
  const seriesOptions = getSeries(type, data, colors);
  const xOptions = xAxis(resolvedTheme as string);
  const yOptions = yAxis(resolvedTheme as string);
  const tooltip = getTooltip(type);

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

  const legend = {
    orient: "vertical",
    left: "left",
    top: "middle",
    textStyle: {
      color: resolvedTheme === "dark" ? "white" : "black",
    },
  };

  const options = {
    grid,
    graphic,
    tooltip,
    xAxis: type !== "pie" ? xOptions : undefined,
    yAxis: type !== "pie" ? yOptions : undefined,
    // legend: type === "pie" ? legend : undefined,
    series: {
      name,
      data,
      ...seriesOptions,
    },
  };

  useEffect(() => {
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, [data, resolvedTheme, chartOptions]);

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
  }, [resolvedTheme, chartOptions]);

  return (
    <div
      ref={parentRef}
      id={id}
      className="no-swipe"
      style={{ height: "250px", width: "100%" }}
    />
  );
};

export default ChartAnalytic;
