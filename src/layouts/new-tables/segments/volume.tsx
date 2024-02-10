import React from "react";
import { Segment } from ".";
import { SmallFont } from "../../../components/fonts";
import { useTop100 } from "../../../features/data/top100/context-manager";
import { getFormattedAmount } from "../../../utils/formaters";
import { TableAsset } from "../model";
interface VolumeSegmentProps {
  token: TableAsset;
  display: string;
  metricsChanges: {
    market_cap: boolean | null;
    price: boolean | null;
    rank?: boolean | null;
    volume: boolean | null;
  };
  extraCss?: string;
}

export const VolumeSegment = ({
  token,
  display,
  metricsChanges,
  extraCss = "",
}: VolumeSegmentProps) => {
  const { activeView } = useTop100();
  const isBalance = activeView?.name === "Portfolio";

  const getColorFromVolume = () => {
    if (metricsChanges.volume === true) return "text-green dark:text-green";
    if (metricsChanges.volume === false) return "text-red dark:text-red";
    return "text-light-font-100 dark:text-dark-font-100";
  };
  const volumeColor = getColorFromVolume();

  const getVolumeOrBalance = () => {
    if (display === "24h Volume" && token.global_volume)
      return `$${getFormattedAmount(token.global_volume)}`;
    if (display === "7d Volume" && token.global_volume_7d)
      return `$${getFormattedAmount(token.global_volume_7d)}`;
    return "-";
  };
  const renderVolumeOrBalance = getVolumeOrBalance();

  return (
    <Segment extraCss={`${extraCss} md:px-[5px]`}>
      <div
        className={`flex items-center justify-end font-medium ${
          isBalance
            ? "text-light-font-100 dark:text-dark-font-100"
            : volumeColor
        }`}
      >
        {isBalance ? (
          <div className="flex flex-col pr-0 sm:pr-2.5">
            <SmallFont extraCss="font-medium text-sm md:text-xs whitespace-nowrap">{`${getFormattedAmount(
              token.amount
            )} ${token.symbol.slice(0, 10)}${
              token.symbol.length > 10 ? "..." : ""
            }`}</SmallFont>
            <SmallFont extraCss="font-medium text-sm md:text-xs text-light-font-60 dark:text-dark-font-60 whitespace-nowrap">{`${getFormattedAmount(
              token.amount_usd
            )} USD`}</SmallFont>
          </div>
        ) : (
          renderVolumeOrBalance
        )}
      </div>
    </Segment>
  );
};
