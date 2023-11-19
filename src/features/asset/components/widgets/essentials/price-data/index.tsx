import React, { useContext } from "react";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";

export const PriceData = () => {
  const { baseAsset } = useContext(BaseAssetContext);

  const formatDate = (timestamp: number | undefined) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })?.format(date);
  };

  return (
    <div className="flex flex-col mt-[50px] md:mt-[30px] w-full md:w-[95%] mx-auto">
      <LargeFont extraCss="mb-[15px]">
        {baseAsset?.name} ({baseAsset?.symbol}) Price Data
      </LargeFont>
      <SmallFont extraCss="mb-[7.5px] font-bold">
        {baseAsset?.name} ({baseAsset?.symbol}) price has{" "}
        {baseAsset?.price_change_24h > 0 ? "increased" : "decreased"} today.
      </SmallFont>
      <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 mb-[15px]">
        {baseAsset?.name} price today is ${getFormattedAmount(baseAsset?.price)}{" "}
        with a 24-hours trading volume{" "}
        {baseAsset?.circulating_supply ? "up" : "down"} by{" "}
        {getTokenPercentage(baseAsset?.volume_change_24h)}%. {baseAsset?.symbol}{" "}
        price is {baseAsset?.price_change_24h > 0 ? "up" : "down"} in the last
        24 hours. It has a circulating supply is{" "}
        {getFormattedAmount(baseAsset?.circulating_supply)} {baseAsset?.symbol}{" "}
        coins and a total supply of{" "}
        {getFormattedAmount(baseAsset?.total_supply)}.
      </SmallFont>
      {baseAsset?.ath?.[1] &&
      baseAsset?.ath?.[0] &&
      baseAsset?.atl?.[1] &&
      baseAsset?.atl?.[0] ? (
        <>
          <SmallFont extraCss="mb-[7.5px] font-bold">
            What is the highest price for {baseAsset?.name}?
          </SmallFont>
          <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 mb-[15px]">
            The all-time high price of {baseAsset?.name} is $
            {getFormattedAmount(baseAsset?.ath?.[1])} on{" "}
            {formatDate(baseAsset?.ath?.[0])}.
          </SmallFont>
          <SmallFont extraCss="mb-[7.5px] font-bold">
            What is the lowest price for {baseAsset?.name}?
          </SmallFont>
          <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 mb-[15px]">
            The all-time low price of {baseAsset?.name} is $
            {getFormattedAmount(baseAsset?.atl?.[1])} on{" "}
            {formatDate(baseAsset?.atl?.[0])}.
          </SmallFont>
        </>
      ) : null}
    </div>
  );
};
