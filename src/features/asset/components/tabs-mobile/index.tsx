import React, { useContext } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Button } from "../../../../components/button";
import { BaseAssetContext } from "../../context-manager";

export const TabsMobile = ({ activeTab }) => {
  const {
    activeMetric,
    setActiveMetric,
    setShowMobileMetric,
    showMobileMetric,
  } = useContext(BaseAssetContext);
  const metricsMain = ["Metrics", "ROI/Holdings", "Core Actors"];
  const metricsSocialDev = ["Social Infos", "Github Infos"];
  const metricsMarket = [
    "Price-in-time",
    "Buy/Sell Spread",
    "Liquidity Chain",
    "Liquidity Asset",
  ];

  const getMetricsToShow = () => {
    if (activeTab === "Market") {
      return metricsMarket;
    }
    if (activeTab === "Social & Developer") {
      return metricsSocialDev;
    }
    return metricsMain;
  };
  const metrics = getMetricsToShow();

  return (
    <div className="hidden lg:flex flex-col">
      <div className="flex items-center justify-between h-[40px] border-t border-b border-light-border-primary dark:border-dark-border-primary">
        <div className="flex items-center overflow-x-scroll scroll relative h-full w-full">
          {metrics?.map((metric, i) => (
            <div className="flex items-center" key={metric}>
              <button
                className={`${
                  activeMetric === metric
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-40 dark:text-dark-font-40"
                } text-sm lg:text-[13px] md:text-xs hover:text-light-font-100 hover:dark:text-dark-font-100 ${
                  i === metrics.length - 1 ? "mr-[15px]" : "mr-0"
                }`}
                onClick={() => {
                  if (activeMetric === metric) {
                    setShowMobileMetric(!showMobileMetric);
                  } else setShowMobileMetric(true);
                  setActiveMetric(metric);
                }}
              >
                {metric}
              </button>
              {i !== metrics.length - 1 ? (
                <div className="flex h-[15px] mx-[15px] w-[2px] bg-light-border-primary dark:bg-dark-border-primary" />
              ) : null}
            </div>
          ))}
          <Button
            extraCss="w-[25px] h-[25px] min-w-[25px] sticky ml-autp right-0"
            onClick={() => setShowMobileMetric(!showMobileMetric)}
          >
            <BsChevronDown />
          </Button>
        </div>
      </div>
    </div>
  );
};
