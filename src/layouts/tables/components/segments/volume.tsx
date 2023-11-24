import React from "react";
import { SmallFont } from "../../../../components/fonts";
import { useTop100 } from "../../../../features/data/top100/context-manager";
import { Asset } from "../../../../interfaces/assets";
import { getFormattedAmount } from "../../../../utils/formaters";
import { Segment } from "../segment";

interface VolumeSegmentProps {
  token: Asset;
  display: string;
  metricsChanges: {
    market_cap: boolean | null;
    price: boolean | null;
    rank: boolean | null;
    volume: boolean | null;
  };
}

export const VolumeSegment = ({
  token,
  display,
  metricsChanges,
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
    if (display === "1m Volume" && token.global_volume_1m)
      return `$${getFormattedAmount(token.global_volume_1m)}`;
    return "-";
  };
  const renderVolumeOrBalance = getVolumeOrBalance();

  return (
    <Segment>
      <div
        className={`flex items-center justify-end font-medium ${
          isBalance
            ? "text-light-font-100 dark:text-dark-font-100"
            : volumeColor
        }`}
      >
        {isBalance ? (
          <div className="flex flex-col pr-0 sm:pr-2.5">
            <SmallFont extraCsss="font-medium">{`${getFormattedAmount(
              token.amount
            )} ${token.symbol.slice(0, 10)}${
              token.symbol.length > 10 ? "..." : ""
            }`}</SmallFont>
            <SmallFont extraCsss="font-medium">{`${getFormattedAmount(
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
