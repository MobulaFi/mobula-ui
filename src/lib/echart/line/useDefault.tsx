"use client";
import { DataZoomComponentOption } from "echarts";
import * as echarts from "echarts/core";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { TimeSelected } from "../../../interfaces/pages/asset";
import { PublicTransaction } from "../../../interfaces/transactions";
import {
  getDate,
  getFormattedAmount,
  getTokenPercentage,
} from "../../../utils/formaters";
import { getTimeStampFromTimeFrame } from "./utils";

interface UseDefaultProps {
  data: [number, number][];
  transactions: PublicTransaction[] | null;
  timeframe: TimeSelected;
  isPercentage?: boolean;
  isMobile: boolean;
  type?: string;
  unit?: string;
  noDataZoom?: boolean;
  noAxis?: boolean;
  unitPosition?: "before" | "after";
  extraData?:
    | { data: [number, number][]; name: string; color?: string }[]
    | null;
  isVesting?: boolean;
}

const getSizeOfBuySellPoint = (timeframe: TimeSelected) => {
  const init = 15;

  switch (timeframe) {
    case "24H":
      return init;
    case "7D":
      return init;
    case "30D":
      return init * 0.78;
    case "3M":
      return init * 0.6;
    case "1Y":
      return init * 0.6;
    case "ALL":
      return init * 0.5;
    default:
      return init;
  }
};

export const getVerb = (status: string) => {
  switch (status) {
    case "buy":
      return "Bought";
    case "sell":
      return "Sold";
    case "transfer":
    default:
      return "Transferred";
  }
};

export const useDefault = ({
  data,
  transactions = null,
  timeframe,
  isMobile,
  type = "Price",
  unit = "$",
  noDataZoom,
  noAxis,
  unitPosition = "before",
  extraData: extraDataBuffer = null,
  isVesting = false,
  isPercentage = false,
}: UseDefaultProps) => {
  const extraData = extraDataBuffer || [];
  const { theme } = useTheme();
  const lightMode = theme === "light";
  const getTextColorsAxis = () => {
    if (noAxis) return lightMode ? "#f7f7f7" : "#151929";
    return lightMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)";
  };

  const { zoomPercentage, chartColor, spread, firstPointIndex } =
    useMemo(() => {
      // No need to do anything if we want to display all the data
      const coverageNeeded = getTimeStampFromTimeFrame(timeframe);
      const initalTimestamp = data[0]?.[0] || 0;
      const maximumTimestamp = Date.now() - coverageNeeded;
      const totalCoverage = Date.now() - initalTimestamp;
      let minimumValue = Infinity;
      let maximumValue = 0;

      const zoomPercentageBuffer =
        ((totalCoverage - coverageNeeded) / totalCoverage) * 100;

      let pastEntry = data[0];
      let index = 0;

      // We could use findIndex, but as timeframes are sorted and most of the time the timeframe is the last one, we can use a for loop
      for (let i = data.length - 1; i >= 0; i -= 1) {
        if (data[i][1] > maximumValue) {
          maximumValue = data[i][1];
        }

        if (data[i][1] < minimumValue) {
          minimumValue = data[i][1];
        }

        if (data[i][0] < maximumTimestamp) {
          pastEntry = data[i];
          index = i + 1;
          break;
        }
      }

      const isBullish = pastEntry?.[1] < data?.[data.length - 1 || 0]?.[1];
      const spreadBuffer = minimumValue
        ? (maximumValue - minimumValue) / maximumValue
        : 0.1;

      return {
        zoomPercentage: zoomPercentageBuffer,
        chartColor: isBullish ? "#0ECB81" : "#ea3943",
        spread: spreadBuffer,
        firstPointIndex: index,
      };
    }, [timeframe, data]);

  const findNonZero = (array: [number, number][], index: number) => {
    for (let i = index; i < array.length; i += 1) {
      if (array[i][1] !== 0) return [array[i][1], i];
    }

    // If we didn't find any non zero value, we return 0 and Infinity (no valid index)
    return [0, Infinity];
  };

  const finalData = useMemo(() => {
    if (!data.length) return [[], []];
    if (!extraData.length) return [data, []];
    const firstPointIndexes = extraData.map((d) => {
      const coverageNeeded = getTimeStampFromTimeFrame(timeframe);
      const maximumTimestamp = Date.now() - coverageNeeded;

      for (let i = d.data.length - 1; i >= 0; i -= 1) {
        if (d.data[i][0] < maximumTimestamp) {
          return i + 1;
        }
      }
      return 0;
    });

    const formatChange = (
      currentValue: [number, number],
      i: number,
      array: [number, number][],
      firstPointLocalIndex: number
    ) => {
      if (i < firstPointLocalIndex) return null;

      const [initialValue, validIndex] = findNonZero(
        array,
        firstPointLocalIndex
      );

      if (i < validIndex) return null;

      const change = ((currentValue[1] - initialValue) / initialValue) * 100;
      return [currentValue[0], change];
    };

    return [
      data
        .map((...params) => formatChange(...params, firstPointIndex))
        .filter((e) => e),
      ...extraData.map((d, dIndex) =>
        d.data
          .map((...params) =>
            formatChange(...params, firstPointIndexes[dIndex])
          )
          .filter((e) => e)
      ),
    ];
  }, [data, extraData, firstPointIndex]);

  const tooltip = {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        shadowBlur: 0,
        backgroundColor: "red",
        shadowColor: "rgba(0, 0, 0, 0)",
        color: lightMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)",
        // formatter: (axis: any) => {
        //   if (axis.axisDimension !== "x") return getFormattedAmount(axis.value);
        //   return new Date(axis.value).toISOString();
        // },
      },
    },
    backgroundColor: lightMode
      ? "rgba(250, 250, 250, 1)"
      : "rgba(23, 27, 43, 1)",
    borderColor: lightMode ? "#0d0d0d08" : "#ffffff08",
    color: lightMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)",
    textStyle: {
      color: lightMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)",
    },
    confine: true,
    borderWidth: 2,
    borderRadius: 12,
    padding: 10,
    hideDelay: 100,
    formatter(params) {
      const date = new Date(params[0].data[0]);
      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `
      <div style="color:${
        lightMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)"
      };font-weight:600;display:flex;justify-content:space-between"><span>${dateFormatter.format(
        date
      )}</span><span style="font-weight:400;color:${
        lightMode ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)"
      }; margin-left: 5px">${timeFormatter.format(date)}</span></div>
      ${params
        .map(
          (param) =>
            `<div style="font-weight:600;display:flex;align:center;margin-top:7.5px;"><div margin-right:5px; style="border-radius:10px;margin-top:3px;padding:2px;background:${
              lightMode ? "rgba(0,0,0,0.65)" : "rgba(255,255,255,0.65)"
            };height:14px;width:fit-content;margin-right:5px;display:flex;align:center"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background-color:${
              param.color
            };"></span></div> <span style="color:${
              lightMode ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)"
            };margin-right:5px;font-weight:400">${param.seriesName}:</span> ${
              unitPosition === "before" && !isPercentage ? unit : ""
            }${
              isPercentage
                ? getTokenPercentage(param.value[1] * 100)
                : (getFormattedAmount(param.value[1], 0) as number)
            }${isPercentage ? "%" : ""} ${
              unitPosition === "after" ? unit : ""
            }</div>`
        )
        .join("")}`;
    },
  };

  const xAxis = [
    {
      type: "time",
      axisLine: {
        show: !noAxis,
        lineStyle: {
          color: lightMode
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.04)",
        },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      nameTextStyle: {
        color: getTextColorsAxis(), // Invisible title
      },
      axisLabel: {
        color: getTextColorsAxis(),
        show: !noAxis,
      },
      max: "dataMax",
      axisPointer: {
        lineStyle: {
          type: "dashed",
          color: lightMode ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.2",
        },
        label: {
          borderColor: lightMode
            ? "rgba(0,0,0,0.2)"
            : "rgba(255, 255, 255, 0.2)", // No border
          shadowBlur: 0,
          backgroundColor: lightMode ? "#E3E3E3" : "#222531",
          show: !noAxis,
          //   shadowColor: "#000",
        },
      },

      splitNumber: 6,
    },
  ];

  const spreadResolution = Math.abs(Math.floor(Math.log10(spread)) - 1);
  const yAxis = [
    {
      type: "value",
      min: "dataMin",
      max: "dataMax",
      nameTextStyle: {
        color: getTextColorsAxis(), // Cela rendra le titre transparent et donc invisible.
      },
      position: "left",
      axisLine: {
        show: !noAxis,
        lineStyle: {
          color: lightMode
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.04)",
        },
      },
      axisTick: {
        show: !noAxis,

        lineStyle: {
          color: lightMode
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.04)",
        },
      },
      splitLine: {
        show: !noAxis,
        lineStyle: {
          color: lightMode
            ? "rgba(0, 0, 0, 0.04)"
            : "rgba(255, 255, 255, 0.04)",
        },
      },
      axisLabel: {
        color: getTextColorsAxis(),
        formatter: (value: number) => getFormattedAmount(value),
        show: !noAxis,
      },
      axisPointer: {
        show: false,
        lineStyle: {
          type: "dashed",
          color: "rgba(255,255,255,0.1)",
        },
        label: {
          borderColor: "rgba(0, 0, 0, 0)", // Couleur de la bordure
          shadowBlur: 0,
          backgroundColor: lightMode ? "#E3E3E3" : "#222531",
          show: !noAxis,
        },
      },
    },
  ];

  const getColorFromMode = () => {
    if (theme === "light") {
      if (noDataZoom) return "none";
      return "rgba(0, 0, 0, 0.4)";
    }
    if (noDataZoom) return "none";
    return "rgba(255, 255, 255, 0.4)";
  };

  const getBorderDataZoom = () => {
    if (theme === "light") {
      if (noDataZoom) return "none";
      return "rgba(0, 0, 0, 0.1)";
    }
    if (noDataZoom) return "none";
    return "rgba(255, 255, 255, 0.1)";
  };

  const dataZoom: DataZoomComponentOption[] = [
    {
      start: extraData.length ? 0 : zoomPercentage,
      end: 100,
      moveHandleSize: 0,
      xAxisIndex: [0],
      textStyle: {
        color: noDataZoom ? "none" : "white",
      },
      borderColor: getBorderDataZoom(),
      handleStyle: {
        borderColor: noDataZoom ? "none" : "rgba(255, 255, 255, 0.3)",
        color: noDataZoom ? "none" : "rgba(0, 0, 0, 0.15)",
      },
      // Modifie la réplique de la chart
      dataBackground: {
        lineStyle: {
          color: getColorFromMode(),
          width: 0.6,
        },
        areaStyle: {
          color: getColorFromMode(),
        },
      },
      selectedDataBackground: {
        lineStyle: {
          color: noDataZoom ? "none" : chartColor,
          width: 2,
        },
        areaStyle: {
          color: noDataZoom ? "none" : chartColor, // Modifier cette couleur selon vos besoins
        },
      },
      emphasis: {
        handleStyle: {
          borderColor: noDataZoom ? "none" : "rgba(255, 255, 255, 0.8)",
        },
      },
      fillerColor: noDataZoom ? "none" : "rgba(0, 0, 0, 0.1)",
      //   labelFormatter: val => {
      //     const date = new Date(val);
      //     return date.toLocaleDateString();
      //   },
    },
  ];

  if (!isMobile) {
    dataZoom.push({
      type: "inside",
      start: extraData.length ? 0 : zoomPercentage,
      end: 100,
      xAxisIndex: [0],
    });
  }

  const transactionSeries = useMemo(
    () =>
      extraData.length
        ? []
        : transactions
            ?.filter((e) => e.timestamp >= data?.[0]?.[0])
            ?.map((transaction) => ({
              type: "line",
              name: "transaction",
              data: [
                [
                  transaction.timestamp,
                  transaction.amount_usd / transaction.amount,
                  transaction,
                ],
              ],
              markPoint: {
                // symbol:
                //   transaction.type === "buy"
                //     ? "image:///icon/blue-pin.png"
                //     : "image:///icon/red-pin.png",
                symbolSize: 20,
                // itemStyle: {
                //   color: "transparent",
                // },
                z: 10,
                symbol: "none",
                symbolRotate: 0,
                position: "top",
                backgroundColor: "transparent", // Coloriez le symbole visible
                data: [
                  {
                    coord: [
                      transaction.timestamp,
                      transaction.amount_usd / transaction.amount,
                    ],
                  },
                ],
              },
              label: {
                show: true,
                position: "center",
                formatter: () => "{a|}\n",
                rich: {
                  a: {
                    opacity: 1,
                    backgroundColor:
                      transaction.type === "buy" ? "#16C784" : "#ea3943", // Coloriez le symbole visible
                    borderRadius: 12,
                    symbolSize: 15,
                    borderColor: lightMode
                      ? "rgba(49, 61, 80, 0.8)"
                      : "rgba(255, 255, 255, 0.8)",
                    borderWidth: 1.5,
                    width: getSizeOfBuySellPoint(timeframe),
                    height: getSizeOfBuySellPoint(timeframe),
                  },
                },
              },
              tooltip: {
                trigger: "item",
                formatter(params) {
                  const tx: PublicTransaction = params.value[2];
                  return `<span style="margin-right:5px;color:${
                    lightMode ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)"
                  };">Date:</span> <span style="color=${
                    lightMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)"
                  };font-weight:600">${getDate(
                    tx.timestamp
                  )}</span><br/><span style="margin-right:5px;color:${
                    lightMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)"
                  };">${getVerb(tx.type)} at:</span> <span style="color=${
                    lightMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)"
                  };font-weight:600">$${getFormattedAmount(
                    tx.amount_usd / tx.amount,
                    0
                  )}</span><br/><span style="margin-right:5px;color:${
                    lightMode ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)"
                  };">Amount:</span> <span style="color=${
                    lightMode ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)"
                  };font-weight:600">${`${getFormattedAmount(tx.amount, 0, {
                    isScientificNotation: false,
                    canUseHTML: false,
                  })} ${tx.asset?.symbol}`}</span>
        <span style="margin-right:5px;color:${
          lightMode ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)"
        };">($${getFormattedAmount(tx.amount_usd, 0)})</span>`;
                },
              },
            })) || [],
    [transactions, data, timeframe, theme, extraData]
  );

  const series = [
    ...[data, ...extraData].map((d: any, i) => {
      let newColor = "";
      if (d?.color) {
        newColor = d?.color;
        if (d.color.includes("dark:bg-"))
          newColor = d?.color.split("dark:bg-[")?.[1]?.split("]")?.[0];
      }
      return {
        type: "line",
        smooth: false,
        symbol: "circle",

        // animation: false,
        symbolSize: 10,
        showSymbol: false,
        emphasis: {
          // this styles the series when it's focused
          // lineStyle: {
          //   type: "dashed", // Utilisez le style pointillé lors du survol
          //   color: "green", // Couleur des lignes pointillées en pointillé
          // },
          itemStyle: {
            borderColor: "white",
            borderWidth: 2,
          },
        },
        sampling: "lttb",
        itemStyle: {
          color: "color" in d ? newColor : chartColor,
        },
        areaStyle:
          extraData.length || isVesting
            ? null
            : {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: chartColor,
                  },
                  {
                    offset: 1,
                    color: lightMode
                      ? "rgba(255,255,255,0)"
                      : "rgba(19, 22, 39, 0)",
                  },
                ]),
              },
        xAxisIndex: 0,
        yAxisIndex: 0,
        color: "white",
        // To diff between the main data and the extra data
        data: finalData[i],
        name: "name" in d ? d.name : type,
      };
    }),
    ...transactionSeries,
  ];

  return { tooltip, xAxis, yAxis, dataZoom, series };
};
