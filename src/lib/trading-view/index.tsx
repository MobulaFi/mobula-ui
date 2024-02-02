import { useTheme } from "next-themes";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Timezone } from "../../../public/static/charting_library/charting_library";
import { Asset, Trade } from "../../features/asset/models";
import { cn } from "../shadcn/lib/utils";
import { DISABLED_FEATURES, ENABLED_FEATURES } from "./constant";
import { widgetOptionsDefault } from "./helper";
import { overrides } from "./theme";
import { Datafeed } from "./utils/";

interface TradingViewChartProps {
  baseAsset: Asset;
  mobile?: boolean;
  custom_css_url?: string;
  extraCss?: string;
  isPair?: boolean;
  setPairTrades?: Dispatch<SetStateAction<Trade[] | null | undefined>>;
}

function generateUserId() {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
}

const TradingViewChart = ({
  baseAsset,
  mobile = false,
  custom_css_url = "../themed.css",
  extraCss,
  isPair = false,
  setPairTrades,
}: TradingViewChartProps) => {
  // State variable to store the userId
  const [userId, setUserId] = useState("");
  // This useEffect hook will run when the component mounts.
  useEffect(() => {
    let localUserId = localStorage.getItem("userId");
    if (!localUserId) {
      localUserId = generateUserId();
      localStorage.setItem("userId", localUserId);
    }
    setUserId(localUserId);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isWhiteMode = resolvedTheme === "light";
  const chartInit = () => {
    if (!baseAsset && !userId) return () => {};
    import("../../../public/static/charting_library").then(
      ({ widget: Widget }) => {
        if (!ref.current) return;

        const tvWidget = new Widget({
          datafeed: Datafeed(baseAsset, isPair, setPairTrades),
          symbol: baseAsset?.symbol + "/USD",
          container: ref.current,
          container_id: ref.current.id,
          locale: "en",
          fullscreen: false,
          user_id: userId,
          client_id: "tradingview.com",
          charts_storage_url: "https://chart.mobula.io",
          charts_storage_api_version: "1.1",
          load_last_chart: true,
          auto_save_delay: 10,
          enabled_features: ENABLED_FEATURES,
          disabled_features: [
            ...DISABLED_FEATURES,
            ...(mobile ? ["left_toolbar"] : []),
          ],
          timezone: Intl.DateTimeFormat().resolvedOptions()
            .timeZone as Timezone,
          autosize: true,
          theme: isWhiteMode ? "Light" : "Dark",
          studies_overrides: {
            "volume.volume.color.0": "#ea3943",
            "volume.volume.color.1": "#0ECB81",
          },
          ...widgetOptionsDefault,
        });

        (window as any).tvWidget = tvWidget;

        (window as any).tvWidget.onChartReady(() => {
          // setIsChartLoaded(true);
          tvWidget.subscribe("onAutoSaveNeeded", handleAutoSave);
          function handleAutoSave() {
            console.log("Auto save triggered!");
            const saveOptions = {
              chartName: "MyChartName_Ex",
            };
            // Call saveChartToServer with the chart name options
            tvWidget.saveChartToServer(
              () => {
                console.log("Chart successfully saved!");
              },
              () => {
                console.error("Failed to save the chart!");
              },
              saveOptions
            );
          }
          (window as any).tvWidget?.applyOverrides(
            overrides(isWhiteMode) || {}
          );
        });
        console.log("onAutoSaveNeeded event subscription set");
      }
    );
  };

  useEffect(() => {
    (window as any).tvWidget = null;

    chartInit();

    return () => {
      if ((window as any).tvWidget !== null) {
        (window as any).tvWidget?.remove();
        (window as any).tvWidget = null;
      }
    };
  }, [baseAsset?.id, custom_css_url, mobile, isWhiteMode]);

  return (
    <div className="relative">
      <div
        className={cn(
          `flex flex-col rounded-md w-full lg:bg-inherit lg:dark:bg-inherit lg:border-0
      items-center justify-center relative`,
          extraCss
        )}
        ref={ref}
      />
    </div>
  );
};

export default TradingViewChart;
