import { useTheme } from "next-themes";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  IChartingLibraryWidget,
  ResolutionString,
  Timezone,
} from "../../../../../../../public/static/charting_library";
import { Spinner } from "../../../../../../components/spinner";
import { MarketMetrics } from "../../../../../../interfaces/trades";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../../context-manager";
import { Asset, Bar, HistoryData } from "../../../../models";

interface ChartBoxProps {
  baseAsset: Asset;
  historyData: HistoryData | null;
  marketMetrics: MarketMetrics;
  mobile?: boolean;
  background?: string;
  custom_css_url?: string;
  extraCss?: string;
}

const supportedResolutions = [
  "1",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "24H",
  "7D",
  "30D",
];

let lastBar: Bar | null = null;
let firstBar: Bar | null = null;

async function generateBars(
  data,
  resolution,
  periodParams,
  onResult,
  type
  // bars,
  // setBars,
) {
  if (data) {
    const bars: Bar[] = [];

    // const bars = [];
    const timeframe = data.filter(
      (entry) =>
        entry[0] > periodParams.from * 1000 && entry[0] < periodParams.to * 1000
    );

    const finalResolution = resolution.includes("D")
      ? parseInt(resolution.split("D")[0], 10) * 24 * 60
      : resolution;

    let j = timeframe.length - 1;

    if (timeframe.length > 0) {
      for (
        let i = periodParams.to;
        i > timeframe[0][0] / 1000;
        i -= parseInt(finalResolution, 10) * 60
      ) {
        if (timeframe[j]) {
          const close =
            bars[0]?.open ||
            ((firstBar?.time || 0) > i * 1000
              ? firstBar?.open
              : timeframe[j][1]);

          let low = timeframe[j][1];
          let high = timeframe[j][1];
          let open = timeframe[j][1];

          while (timeframe[j] && timeframe[j][0] > i * 1000) {
            const value = timeframe[j][1];
            if (value < low) low = value;
            if (value > high) high = value;
            open = value;
            j -= 1;
          }

          bars.unshift({
            time: i * 1000,
            low,
            high,
            open,
            close,
          });

          // if (!firstBar) {
          //   console.log("NO FIRST BAR");
          // }

          if (!firstBar || i * 1000 < firstBar.time) {
            firstBar = {
              time: i * 1000,
              low,
              high,
              open,
              close,
            };
          }
        }
      }
    }

    if (
      bars[bars.length - 1] &&
      (!lastBar || bars[bars.length - 1].time > lastBar.time)
    ) {
      // console.log("Last bar", lastBar);
      lastBar = { ...bars[bars.length - 1], type };
    }

    // setBars(bars);
    onResult(bars);
  }
}

const Datafeed = (
  baseAsset,
  historyData,
  setUpdateCallback
  // bars,
  // setBars,
) => ({
  onReady: (callback) => {
    setTimeout(() => callback({ supported_resolutions: supportedResolutions }));
  },
  resolveSymbol: (symbolName, onResolve) => {
    setTimeout(() => {
      const params = {
        name: symbolName,
        description: "",
        type: "crypto",
        session: "24x7",
        ticker: symbolName,
        minmov: 1,
        pricescale:
          symbolName === "RANK"
            ? 1
            : Math.min(
                10 **
                  String(
                    Math.round(10000 / baseAsset[symbolName.toLowerCase()])
                  ).length,
                10000000000000000
              ),
        has_intraday: true,
        intraday_multipliers: ["1", "15", "30", "60"],
        supported_resolution: supportedResolutions,
        volume_precision: 8,
        data_status: "streaming",
      };
      onResolve(params);
    }, 0);
  },
  getBars: (symbolInfo, resolution, periodParams, onResult) => {
    const data = historyData
      ? historyData[`${symbolInfo.name.toLowerCase()}_history`]?.concat(
          baseAsset[`${symbolInfo.name.toLowerCase()}_history`]?.[
            symbolInfo.name.toLowerCase()
          ]
        )
      : baseAsset[`${symbolInfo.name.toLowerCase()}_history`]?.[
          symbolInfo.name.toLowerCase()
        ];

    generateBars(
      data,
      resolution,
      periodParams,
      onResult,
      symbolInfo.name
      // bars,
      // setBars,
    );
  },
  searchSymbols: (_, __, ___, onResult) => {
    onResult([
      {
        symbol: "PRICE",
        full_name: `${baseAsset.name}'s price USD`,
        description: `USD price of ${baseAsset.name}`,
        exchange: "",
        ticker: "PRICE",
        type: "crypto",
      },
    ]);
  },
  subscribeBars: (_, __, update) => {
    setUpdateCallback(() => update);
  },
  unsubscribeBars: () => ({}),
  getMarks: () => ({}),
  getTimeScaleMarks: () => ({}),
  getServerTime: () => ({}),
});

function generateUserId() {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
}

const ChartBox = ({
  baseAsset,
  historyData,
  marketMetrics,
  mobile = false,
  background,
  custom_css_url = "../themed.css",
  extraCss,
}: ChartBoxProps) => {
  const [userId, setUserId] = useState("");
  // This useEffect hook will run when the component mounts.
  const [tradingWidget, setTradingWidget] =
    useState<IChartingLibraryWidget | null>(null);
  const [widgetReady, setWidgetReady] = useState(false);
  const [updateCallback, setUpdateCallback] = useState<any | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { borders } = useColors();
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";

  useEffect(() => {
    let localUserId = localStorage.getItem("userId");
    if (!localUserId) {
      localUserId = generateUserId();
      localStorage.setItem("userId", localUserId);
    }
    setUserId(localUserId);
  }, []);

  useEffect(() => {
    if (baseAsset && baseAsset.price_history && userId) {
      let freshWidget: IChartingLibraryWidget | null = null;
      import("../../../../../../../public/static/charting_library").then(
        ({ widget: Widget }) => {
          if (!ref.current) return;
          freshWidget = new Widget({
            charts_storage_url: "https://tdv.mobula.fi",
            charts_storage_api_version: "1.1",
            load_last_chart: true,
            auto_save_delay: 10,
            symbol: "PRICE",
            datafeed: Datafeed(
              baseAsset,
              historyData,
              setUpdateCallback
              // bars,
              // setBars,
            ),
            interval: "60" as ResolutionString,
            container_id: ref.current.id,

            // symbol: baseAsset?.symbol + "USD",
            container: ref.current,
            library_path: "/static/charting_library/",
            locale: "en",
            disabled_features: [
              "header_saveload", // Remove the save/load buttons from the toolbar
              ...(mobile
                ? ["use_localstorage_for_settings", "left_toolbar"]
                : ["use_localstorage_for_settings"]),
            ],
            enabled_features: ["study_templates"],
            client_id: "tradingview.com",
            user_id: userId,
            fullscreen: false,
            timezone: Intl.DateTimeFormat().resolvedOptions()
              .timeZone as Timezone, // ,
            autosize: true,
            theme: isWhiteMode ? "Light" : "Dark",
            toolbar_bg: background,
            custom_css_url,
            overrides: {
              "paneProperties.background": `${background}`,
              "paneProperties.backgroundType": "solid",
              "paneProperties.vertGridProperties.color": isWhiteMode
                ? "#0D0D0D08"
                : "rgba(255, 255, 255, 0.03)",
              "paneProperties.horzGridProperties.color": isWhiteMode
                ? "#0D0D0D08"
                : "rgba(255, 255, 255, 0.03)",
              "symbolWatermarkProperties.transparency": 90,
              "scalesProperties.textColor": isWhiteMode
                ? "rgba(0,0,0,0.8)"
                : "rgba(255,255,255,0.8)",
              "mainSeriesProperties.candleStyle.wickUpColor": "#0CCB81",
              "mainSeriesProperties.candleStyle.width": "190px",
              "mainSeriesProperties.candleStyle.wickDownColor": "#F6465D",
              "mainSeriesProperties.candleStyle.upColor": "#0CCB81",
              "mainSeriesProperties.candleStyle.downColor": "#F6465D",
              "scalesProperties.backgroundColor": `${background}`,
              "paneProperties.legendProperties.showStudyArguments": true,
              "paneProperties.legendProperties.showStudyTitles": true,
              "paneProperties.legendProperties.showStudyValues": true,
              "paneProperties.legendProperties.showSeriesTitle": true,
              "paneProperties.legendProperties.showSeriesOHLC": true,
              "paneProperties.legendProperties.showLegend": true,
              "paneProperties.legendProperties.showBarChange": true,
              "paneProperties.legendProperties.showBackground": true,
              "paneProperties.legendProperties.backgroundTransparency": 50,
            },
          });
          setTradingWidget(freshWidget);

          freshWidget.onChartReady(() => {
            setWidgetReady(true);
            // Subscribe to the onAutoSaveNeeded event
            freshWidget?.subscribe("onAutoSaveNeeded", handleAutoSave);
            function handleAutoSave() {
              console.log("Auto save triggered!");
              const saveOptions = {
                chartName: "MyChartName_Ex",
              };
              // Call saveChartToServer with the chart name options
              freshWidget?.saveChartToServer(
                () => {
                  console.log("Chart successfully saved!");
                },
                () => {
                  console.error("Failed to save the chart!");
                },
                saveOptions
              );
            }
          });
          console.log("onAutoSaveNeeded event subscription set");
        }
      );

      return () => {
        freshWidget?.remove();
      };
    }

    return () => {};
  }, [background, baseAsset, custom_css_url, historyData, mobile, userId]);

  useEffect(() => {
    if (tradingWidget && marketMetrics && widgetReady && lastBar) {
      try {
        const resolution = tradingWidget?.activeChart().resolution();
        const numberResolution = resolution.includes("D")
          ? parseInt(resolution.split("D")[0], 10) * 24 * 60
          : parseInt(resolution, 10);

        if (lastBar && marketMetrics && updateCallback) {
          if (
            Date.now() -
              (lastBar.time - (lastBar.time % (numberResolution * 60 * 1000))) <
            numberResolution * 60 * 1000
          ) {
            lastBar = {
              time: lastBar.time,
              open: lastBar.open,
              close: marketMetrics.price,
              high: Math.max(lastBar.high, marketMetrics.price),
              low: Math.min(lastBar.low, marketMetrics.price),
            };
          } else {
            lastBar = {
              time: Date.now() - (Date.now() % (numberResolution * 60 * 1000)),
              open: lastBar.close,
              close: marketMetrics.price,
              high: Math.max(marketMetrics.price, lastBar.close),
              low: Math.min(lastBar.close, marketMetrics.price),
            };
          }

          updateCallback(lastBar);
        }
      } catch (e) {
        // console.log(e);
      }
    }
  }, [marketMetrics, tradingWidget, updateCallback, widgetReady]);

  useEffect(
    () => () => {
      firstBar = null;
    },
    []
  );

  const { activeChart } = useContext(BaseAssetContext);

  return (
    <div
      className={cn(
        `flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary rounded w-full
     border border-light-border-primary dark:border-dark-border-primary lg:bg-inherit lg:dark:bg-inherit lg:border-0
      items-center justify-center mt-0 relative mb-0 ${
        activeChart === "Trading view" ? "mb-2.5" : ""
      } p-[5px] lg:p-0`,
        extraCss
      )}
      ref={ref}
    >
      <div>
        {tradingWidget !== null ? (
          <div />
        ) : (
          <Spinner extraCss="w-[60px] h-[60px]" />
        )}
      </div>
    </div>
  );
};

export default ChartBox;
