import React, { useContext } from "react";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { getDate, getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";

export const LaunchDate = () => {
  const { unformattedHistoricalData } = useContext(BaseAssetContext);
  const launchDate = unformattedHistoricalData?.price?.ALL?.[0]?.[0] as number;
  const oneWeekLater = launchDate + 1 * 24 * 60 * 60 * 1000;

  const getDifferenceDate = () => {
    const date = new Date();
    const launch = new Date(launchDate);
    const diff = date.getTime() - launch.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getFirstWeekData = () => {
    const data = unformattedHistoricalData?.price?.ALL?.filter(
      (item) => item[0] <= oneWeekLater
    );
    return data;
  };

  const daysAgo = getDifferenceDate();
  const date = getDate(launchDate);
  const dataOfFirstWeek = getFirstWeekData();
  const sortedAmounts = dataOfFirstWeek?.sort((a, b) => a[1] - b[1]);
  const ATH = getFormattedAmount(
    sortedAmounts?.[sortedAmounts.length - 1]?.[1] || 0
  ) as number;
  const ATL = getFormattedAmount(sortedAmounts?.[0]?.[1] || 0) as number;
  const listingPrice = getFormattedAmount(dataOfFirstWeek?.[0]?.[1] || 0);

  const getPercentage = (price: number) => {
    const percentage = (100 / (ATH - ATL)) * (price - ATL);
    return percentage.toFixed(2);
  };

  const listingPricePercentage = getPercentage(listingPrice as number);

  return (
    <div
      className="flex p-5 rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary 
    border border-light-border-primary dark:border-dark-border-primary mb-2.5 
    w-full mx-auto flex-col mt-0 sm:mt-2.5"
    >
      <div className="flex justify-between">
        <LargeFont extraCss="mb-2.5">Launch Stats</LargeFont>{" "}
      </div>
      <div className="flex justify-center flex-col mb-[15px]">
        <SmallFont extreCss="font-bold mb-0 text-sm">
          {launchDate ? date : "--/--/--"}
        </SmallFont>{" "}
        <SmallFont extreCss="font-medium mb-0 text-sm text-light-font-60 dark:text-dark-font-60">
          {daysAgo} days ago
        </SmallFont>{" "}
      </div>
      <MediumFont>Volatility</MediumFont>
      <div
        className="flex h-[20px] mt-5 relative rounded border-r-[3px] border-l-[3px]
       border-light-border-primary dark:border-dark-border-primary items-center"
      >
        <div
          className="flex bg-blue dark:bg-blue w-[3px] h-5 absolute rounded"
          style={{
            left: `${listingPricePercentage}%`,
          }}
        />
        <div className="flex bg-gray dark:bg-gray w-[3px] h-5 absolute rounded left-0" />
        <div className="flex bg-gray dark:bg-gray w-[3px] h-5 absolute rounded left-[100%" />

        <div className="flex w-full h-[3px] bg-light-font-10 dark:bg-dark-font-10" />
      </div>
      <div className="flex justify-between mt-2.5">
        <div className="flex justify-centr flex-col">
          <SmallFont extraCss="text-start font-medium mb-0">
            ATL (24h after listing):
          </SmallFont>{" "}
          <SmallFont extraCss="text-start font-medium mb-0">
            {ATL ? `$${ATL}` : "--"}
          </SmallFont>
        </div>
        <div className="flex justify-centr flex-col">
          <SmallFont extraCss="text-start font-medium mb-0">
            ATH (24h after listing):
          </SmallFont>{" "}
          <SmallFont extraCss="text-start font-medium mb-0">
            {ATH ? `$${ATH}` : "--"}
          </SmallFont>
        </div>
        <div className="flex justify-centr flex-col">
          <SmallFont extraCss="text-start font-medium mb-0">
            Listing Price:
          </SmallFont>{" "}
          <SmallFont extraCss="text-start font-medium mb-0">
            {`$${listingPrice}` || "--"}
          </SmallFont>
        </div>
      </div>
    </div>
  );
};
