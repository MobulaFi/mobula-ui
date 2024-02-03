import { DataZoomComponentOption } from "echarts";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { getTimeStampFromTimeFrame } from "../../../../../../lib/echart/line/utils";
import {
  getFormattedAmount,
  getShortenedAmount,
} from "../../../../../../utils/formaters";
import { TimeSelected } from "../../../../models";

interface UseDefaultProps {
  data: [number, number][];
  timeframe: TimeSelected;
  isMobile: boolean;
  type?: string;
  unit?: string;
}

export const useDefault = ({
  data,
  timeframe,
  isMobile,
  type = "Price",
  unit = "$",
}: UseDefaultProps) => {
  const { resolvedTheme } = useTheme();
  const lightMode = resolvedTheme === "light";
  const { zoomPercentage, chartColor } = useMemo(() => {
    // No need to do anything if we want to display all the data
    const coverageNeeded = getTimeStampFromTimeFrame(timeframe);
    const initalTimestamp = data[0]?.[0] || 0;
    const maximumTimestamp = Date.now() - coverageNeeded;
    const totalCoverage = Date.now() - initalTimestamp;

    const zoomPercentageBuffer =
      ((totalCoverage - coverageNeeded) / totalCoverage) * 100;

    let pastEntry = data[0];

    // We could use findIndex, but as timeframes are sorted and most of the time the timeframe is the last one, we can use a for loop
    for (let i = data.length - 1; i >= 0; i -= 1) {
      if (data[i][0] < maximumTimestamp) {
        pastEntry = data[i];
        break;
      }
    }

    const isBullish = pastEntry?.[1] < data?.[data.length - 1 || 0]?.[1];

    return {
      zoomPercentage: zoomPercentageBuffer,
      chartColor: isBullish ? "grey" : "grey",
    };
  }, [timeframe]);

  const tooltip = {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        shadowBlur: 0,
        backgroundColor:
          resolvedTheme === "dark"
            ? "rgba(23, 27, 43, 1)"
            : "rgba(250, 250, 250, 1)",
        shadowColor: "rgba(0, 0, 0, 0)",
        color: lightMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        // formatter: (axis: any) => {
        //   if (axis.axisDimension !== "x") return getFormattedAmount(axis.value);
        //   return new Date(axis.value).toISOString();
        // },
      },
    },
    backgroundColor:
      resolvedTheme === "dark"
        ? "rgba(23, 27, 43, 1)"
        : "rgba(250, 250, 250, 1)",
    borderColor: lightMode
      ? "rgba(0, 0, 0, 0.03)"
      : "rgba(255, 255, 255, 0.03)",
    color:
      resolvedTheme === "dark"
        ? "rgba(255, 255, 255, 0.95)"
        : "rgba(0, 0, 0, 0.95)",
    textStyle: {
      color:
        resolvedTheme === "dark"
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(0, 0, 0, 0.95)",
    },
    borderWidth: 3,
    borderRadius: 8,
    padding: 20,
    hideDelay: 100,
    formatter(params) {
      const date = new Date(params[0].data[0]);
      const followers = params[0].data[1];
      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${dateFormatter.format(
        date
      )} &nbsp;&nbsp; &nbsp;&nbsp;&nbsp; ${timeFormatter.format(
        date
      )}<br>Followers: ${getFormattedAmount(followers, 0, {
        shouldNotMinifyBigNumbers: true,
      })}`;
    },
  };

  const xAxis = [
    {
      type: "time",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      nameTextStyle: {
        color: lightMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)", // Invisible title
      },
      axisLabel: {
        color: lightMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
      },
      max: "dataMax",
      axisPointer: {
        lineStyle: {
          type: "dashed",
        },
        label: {
          borderColor: "#rgba(0, 0, 0, 0)", // No border
          shadowBlur: 0,
          backgroundColor: lightMode ? "#E3E3E3" : "#222531",

          //   shadowColor: "#000",
        },
      },
      splitNumber: 5,
    },
  ];

  const yAxis = [
    {
      type: "value",
      min: "dataMin",
      max: "dataMax",
      nameTextStyle: {
        color: lightMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)", // Cela rendra le titre transparent et donc invisible.
      },
      position: "left",
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: lightMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        formatter: (value: number) => getShortenedAmount(value),
      },
      axisPointer: {
        lineStyle: {
          type: "dashed",
        },
        label: {
          borderColor: "rgba(0, 0, 0, 0)", // Couleur de la bordure
          shadowBlur: 0,
        },
      },
    },
  ];

  const dataZoom: DataZoomComponentOption[] = [
    {
      start: zoomPercentage,
      end: 100,
      //   showDetail: false,
      //   backgroundColor: "rgb(19, 23, 39)",
      //   handleIcon: "",
      //   handleSize: "80%",
      moveHandleSize: 0,
      xAxisIndex: [0],
      textStyle: {
        color: "white",
      },
      borderColor: "rgba(255, 255, 255, 0.2)",
      handleStyle: {
        borderColor: "rgba(255, 255, 255, 0.4)",
        color: "rgba(0, 0, 0, 0.2)",
      },

      selectedDataBackground: {
        lineStyle: {
          color: chartColor,
        },
        areaStyle: {
          color: chartColor,
        },
      },
      emphasis: {
        handleStyle: {
          //   borderColor: "white",
          borderColor: "rgba(255, 255, 255, 0.8)",
        },
      },
      fillerColor: "rgba(0, 0, 0, 0.1)",
      //   labelFormatter: val => {
      //     const date = new Date(val);
      //     return date.toLocaleDateString();
      //   },
    },
  ];

  if (!isMobile) {
    dataZoom.push({
      type: "inside",
      start: zoomPercentage,
      end: 100,
      xAxisIndex: [0],
    });
  }

  const series = [
    {
      type: "line",
      smooth: true,
      symbol: "circle",
      // animation: false,
      symbolSize: 10,
      showSymbol: false,
      emphasis: {
        itemStyle: {
          borderColor: "white",
          borderWidth: 2,
        },
      },
      sampling: "average",
      xAxisIndex: 0,
      yAxisIndex: 0,
      color: "white",
      lineStyle: {
        width: 2,
        color: "#0ECB81",
      },
      areaStyle: {
        color: "none",
        opacity: 0.1,
      },
      data,
    },
  ];

  return { tooltip, xAxis, yAxis, dataZoom, series };
};
