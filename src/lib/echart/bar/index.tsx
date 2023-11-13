import { Flex, useColorMode } from "@chakra-ui/react";
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
import useDarkMode from "hooks/useDarkMode";
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

const BarChartComponent: React.FC<DataProps> = ({
  data,
  height,
  width,
}: DataProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { colorMode } = useColorMode();
  const id = useMemo(() => uuid(), []);
  const [colorTheme] = useDarkMode();

  const createInstance = useCallback(() => {
    const instance = echarts.getInstanceByDom(document.getElementById(id));

    return (
      instance ||
      echarts.init(document.getElementById(id), null, {
        renderer: "canvas",
      })
    );
  }, [id]);

  const getColor = () => {
    const colors = Object.entries(data)?.map((entry, i) => {
      console.log("ENTRY", entry);
      if (entry[1][1] > 0) return "#0ECB81";
      return "#ea3943";
    });
    console.log("COLOR", colors);
    return colors;
  };

  const options = {
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
            colorTheme === "dark" ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)",
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
      name: "RFE",
      type: "bar",
      itemStyle: {
        color: getColor(),
      },
      data: data,
    },
  };

  useEffect(() => {
    const chart = createInstance();
    if (chart) chart.setOption(options);
  }, [data, colorMode]);

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
  }, [colorMode]);

  return (
    <Flex
      ref={parentRef}
      id={id}
      className="no-swipe"
      style={{ height: "170px", width: "100%" }}
    />
  );
};

export default BarChartComponent;
