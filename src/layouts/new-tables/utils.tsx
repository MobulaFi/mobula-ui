import React from "react";
import { ChangeSegment } from "./segments/change";
import { ChartSegment } from "./segments/chart";
import { MarketCapSegment } from "./segments/market_cap";
import { PriceSegment } from "./segments/price";
import { VolumeSegment } from "./segments/volume";

export const separator = (numb: number) => {
  if (numb && typeof numb === "number") {
    const str = numb.toString().split(".");
    str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return str.join(".");
  }
};

export const getCountdown = (diff: number) => {
  // Get a countdown from the biggest unit possible, i.e 30 minutes, 1 hour, 1 day, 1 week, 1 month, 1 year
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days} days ago`;
  }
  if (hours > 0) {
    return `${hours} hours ago`;
  }
  if (minutes > 0) {
    return `${minutes} minutes ago`;
  }
};

const ENTRY_TYPE_MAP = {
  price: { component: PriceSegment, key: "priceSegment" },
  market_cap: { component: MarketCapSegment, key: "marketCapSegment" },
  change: { component: ChangeSegment, key: "changeSegment" },
  volume: { component: VolumeSegment, key: "volumeSegment" },
  chart: { component: ChartSegment, key: "chartSegment" },
};

export const getDisplayFromView = (entry, token, metricsChanges) => {
  const mapping = ENTRY_TYPE_MAP[entry.type] || { component: null, key: "" };
  const { component: Component, key } = mapping;
  return Component ? (
    <Component
      token={token}
      metricsChanges={metricsChanges}
      display={entry.value}
      key={`${key}-${token.id}`}
    />
  ) : null;
};
