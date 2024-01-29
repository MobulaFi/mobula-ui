import React, { useContext } from "react";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { getDate, getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";

export const LaunchDate = () => {
  const { unformattedHistoricalData, baseAsset } = useContext(BaseAssetContext);
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
  const globalATL = baseAsset?.atl?.[1] || 0;
  const globalATH = baseAsset?.ath?.[1] || 0;

  const getPercentage = (price: number) => {
    const percentage = (100 / (globalATL - globalATH)) * (price - globalATL);
    return percentage.toFixed(2);
  };

  // 0% === ATL
  // 100% === ATH
  // actualPrice === x%

  function getPricePercentage(currentPrice, atl, ath) {
    if (ath === atl) {
      // Pour éviter la division par zéro
      return 0; // ou un autre traitement selon le cas d'usage
    }
    return ((currentPrice - atl) / (ath - atl)) * 100;
  }

  // Exemple d'utilisation
  const actualPricePercentage = getPricePercentage(
    baseAsset?.price,
    globalATL,
    globalATH
  ); // ATL = 100, ATH = 500, Prix Actuel = 300

  const listingPricePercentage = getPricePercentage(
    listingPrice,
    globalATL,
    globalATH
  );

  const atlListingPercentage = getPricePercentage(ATL, globalATL, globalATH);

  const athListingPercentage = getPricePercentage(ATH, globalATL, globalATH);

  const listingRange = athListingPercentage - atlListingPercentage;

  const [showRangeInfo, setShowRangeInfo] = React.useState(false);
  const [showPriceInfo, setShowPriceInfo] = React.useState(false);
  const [showListingPriceInfo, setShowListingPriceInfo] = React.useState(false);

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
        <MediumFont extraCss="font-bold mb-0">
          {launchDate ? date : "--/--/--"}
        </MediumFont>{" "}
        <SmallFont extraCss="font-medium mb-0 text-sm text-light-font-60 dark:text-dark-font-60">
          {daysAgo} days ago
        </SmallFont>{" "}
      </div>
      <MediumFont>Volatility</MediumFont>
      <div
        className="flex h-3 mt-3 relative border-r-[3px] border-l-[3px]
       border-light-font-10 dark:border-dark-font-10 items-center w-full "
      >
        <div
          className="flex z-[2] bg-light-font-100 dark:bg-dark-font-100 w-1 h-2.5 absolute rounded"
          onMouseEnter={() => setShowListingPriceInfo(true)}
          onMouseLeave={() => setShowListingPriceInfo(false)}
          style={{
            left: `${listingPricePercentage}%`,
          }}
        >
          {showListingPriceInfo ? (
            <div
              className="py-0.5 px-1.5 shadow-md bg-light-bg-hover dark:bg-dark-bg-hover border
           border-light-border-primary dark:border-dark-border-primary rounded-md 
           absolute bottom-[15px] left-1/2 transform -translate-x-1/2"
            >
              <p className="text-light-font-100 dark:text-dark-font-100 whitespace-nowrap max-w-[150px]">
                Listing Price
              </p>
            </div>
          ) : null}
        </div>
        {/* {atlListingPercentage !== athListingPercentage ? (
          <>
            <div
              className="flex bg-light-font-60 dark:bg-dark-font-60 w-[3px] h-2.5 absolute rounded"
              style={{
                left: `${atlListingPercentage}%`,
              }}
            />
            <div
              className="flex bg-light-font-60 dark:bg-dark-font-60 w-[3px] h-2.5 absolute rounded"
              style={{
                left: `${athListingPercentage}%`,
              }}
            />
          </>
        ) : null} */}
        <div
          className="flex bg-blue dark:bg-blue w-1 h-2.5 absolute rounded"
          onMouseEnter={() => setShowPriceInfo(true)}
          onMouseLeave={() => setShowPriceInfo(false)}
          style={{
            left: `${actualPricePercentage}%`,
          }}
        >
          {showPriceInfo ? (
            <div
              className="py-0.5 px-1.5 shadow-md bg-light-bg-hover dark:bg-dark-bg-hover border
             border-light-border-primary dark:border-dark-border-primary rounded-md 
             absolute bottom-[15px] left-1/2 transform -translate-x-1/2"
            >
              <p className="text-light-font-100 dark:text-dark-font-100 whitespace-nowrap max-w-[150px]">
                Actual Price
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex w-full h-[3px] bg-light-font-10 dark:bg-dark-font-10" />
        {/* <div
          className="flex h-[3px] bg-light-font-60 dark:bg-dark-font-60 relative"
          onMouseEnter={() => setShowRangeInfo(true)}
          onMouseLeave={() => setShowRangeInfo(false)}
          style={{
            width: `${listingRange}%`,
          }}
        >
          {showRangeInfo ? (
            <div
              className="py-0.5 px-1.5 shadow-md bg-light-bg-hover dark:bg-dark-bg-hover border
             border-light-border-primary dark:border-dark-border-primary rounded-md 
             absolute bottom-[15px] left-1/2 transform -translate-x-1/2"
            >
              <p className="text-light-font-100 dark:text-dark-font-100 whitespace-nowrap max-w-[150px]">
                Listing Ratio ATL / ATH
              </p>
            </div>
          ) : null}
        </div> */}
      </div>
      <div className="flex flex-col mt-2.5">
        <div className="flex justify-between items-center w-full mb-2">
          <SmallFont extraCss="text-start text-light-font-60 dark:text-dark-font-60 mb-0">
            ATL (24h after listing):
          </SmallFont>{" "}
          <SmallFont extraCss="text-start font-medium mb-0">
            {ATL ? `$${ATL}` : "--"}
          </SmallFont>
        </div>
        <div className="flex justify-between items-center w-full mb-2">
          <SmallFont extraCss="text-start text-light-font-60 dark:text-dark-font-60 mb-0">
            ATH (24h after listing):
          </SmallFont>{" "}
          <SmallFont extraCss="text-start font-medium mb-0">
            {ATH ? `$${ATH}` : "--"}
          </SmallFont>
        </div>
        <div className="flex justify-between items-center w-full">
          <SmallFont extraCss="text-start text-light-font-60 dark:text-dark-font-60 mb-0">
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
