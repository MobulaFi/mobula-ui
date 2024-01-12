import { useTheme } from "next-themes";
import React, { useEffect, useRef } from "react";
import {
  IChartingLibraryWidget,
  ResolutionString,
  Timezone,
} from "../../../../../../../../public/static/charting_library/charting_library";
import { cn } from "../../../../../../../lib/shadcn/lib/utils";
import { Asset } from "../../../../../models";
import { overrides } from "./theme";
import { Datafeed } from "./utils/";

interface ChartBoxProps {
  baseAsset: Asset;
  mobile?: boolean;
  custom_css_url?: string;
  extraCss?: string;
}

const ChartBox = ({
  baseAsset,
  mobile = false,
  custom_css_url = "../themed.css",
  extraCss,
}: ChartBoxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isWhiteMode = resolvedTheme === "light";

  useEffect(() => {
    if (!baseAsset) return () => {};

    let freshWidget: IChartingLibraryWidget | null = null;
    import("../../../../../../../../public/static/charting_library").then(
      ({ widget: Widget }) => {
        if (!ref.current) return;

        freshWidget = new Widget({
          // Datafeed
          datafeed: Datafeed(baseAsset),
          symbol: baseAsset?.symbol + "/USD",
          interval: "60" as ResolutionString,

          // Settings
          container: ref.current,
          container_id: ref.current.id,
          library_path: "/static/charting_library/",

          // UI & Behavior
          locale: "en",
          fullscreen: false,
          disabled_features: [
            "header_saveload",
            "header_symbol_search",
            ...(mobile ? ["left_toolbar"] : []),
          ],
          timezone: Intl.DateTimeFormat().resolvedOptions()
            .timeZone as Timezone,
          autosize: true,

          // Theme
          theme: isWhiteMode ? "Light" : "Dark",
          // TO DO: Overrites don't work rn.
          overrides: overrides(isWhiteMode),
          custom_css_url,
        });
      }
    );

    return () => {
      freshWidget?.remove();
    };
  }, [baseAsset, custom_css_url, mobile]);

  return (
    <div
      className={cn(
        `flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary rounded w-full
     border border-light-border-primary dark:border-dark-border-primary lg:bg-inherit lg:dark:bg-inherit lg:border-0
      items-center justify-center mt-0 relative mb-0 mb-2.5 p-[5px] lg:p-0`,
        extraCss
      )}
      ref={ref}
    ></div>
  );
};

export default ChartBox;
