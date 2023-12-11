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
import { TimeSelected } from "../../../../models";
import { useDefault } from "./multi-options";

interface EChartProps {
  data: [number, number][];
  options?: echarts.EChartsCoreOption;
  width: number;
  height: number;
  extraSeries?: any;
  timeframe: TimeSelected;
  type?: string;
  unit?: string;
  leftMargin?: string[];
}

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

const EChart: React.FC<EChartProps> = ({
  data,
  options,
  extraSeries = [],
  timeframe,
  type,
  unit,
  leftMargin = ["13%", "4.5%"],
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const id = useMemo(() => uuid(), []);
  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;
  const { tooltip, xAxis, yAxis, dataZoom, series } = useDefault({
    data,
    timeframe,
    isMobile,
    type,
    unit,
  });

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

  useEffect(() => {
    const chart = createInstance();
    if (chart)
      chart.setOption({
        backgroundColor:
          resolvedTheme === "dark"
            ? "rgba(19, 22, 39, 1)"
            : "rgba(255,255,255,1)",
        textStyle: {
          color:
            resolvedTheme === "dark"
              ? "rgba(0,0,0,0.8)"
              : "rgba(255,255,255,0.8)",
        },
        grid: {
          bottom: "15%",
          left: isMobile ? leftMargin[0] : leftMargin[1],
          right: "0.5%",
        },
        tooltip,
        xAxis,
        yAxis,
        dataZoom,
        ...options,
        series: [...series, ...extraSeries],
      });
  }, [data, options, timeframe]);

  useEffect(() => {
    const chart = createInstance();
    window.onresize = function () {
      chart.resize();
    };

    const parent = parentRef.current;
    if (parent) {
      parent.addEventListener("touchend", () => {
        chart.dispatchAction({
          type: "hideTip",
        });

        chart.dispatchAction({ type: "showTip", seriesIndex: 0, dataIndex: 1 });
      });
    }
  }, []);

  return (
    <div ref={parentRef} id={id} style={{ height: "500px", width: "100%" }} />
  );
};

export default EChart;
