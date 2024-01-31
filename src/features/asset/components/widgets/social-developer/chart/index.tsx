import React, { useContext, useState } from "react";
import { BsGithub } from "react-icons/bs";
import { LargeFont, MediumFont } from "../../../../../../components/fonts";
import { NextChakraLink } from "../../../../../../components/link";
import { Menu } from "../../../../../../components/menu";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../../context-manager";
import { getData } from "../constant";

interface ChartProps {
  chartId: string;
  dividor?: number;
  isGithub?: boolean;
  extraCss?: string;
  [key: string]: any;
}

export const Charts = ({
  chartId,
  dividor = 1,
  isGithub,
  extraCss,
  ...props
}: ChartProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const [chartType, setChartType] = useState("Commit Activity");
  const data = getData(chartType, chartId);
  const types = [
    "Commit Activity",
    "Code Add/Del",
    "Developer Trend",
    "Issues",
  ];

  return (
    <div className="flex flex-col w-full mt-5">
      {isGithub ? (
        <div className="flex flex-col mt-0 lg:mt-2.5">
          <div className="flex items-center justify-between w-full mb-2.5">
            <div className="flex items-center flex-wrap">
              <LargeFont>Github Activity</LargeFont>
              <BsGithub className="mx-2.5 w-[22px] lg:w-5 md:w-4.5  h-[22px] lg:h-5 md:h-4.5 text-light-font-100 dark:text-dark-font-100" />
              <NextChakraLink
                href={baseAsset?.assets_social?.github}
                target="_blank"
                rel="noreferrer"
                extraCss="text-lg lg:text-sm md:text-sm text-blue dark:text-blue"
              >
                random-name/random
              </NextChakraLink>
            </div>
            <Menu title={chartType} extraCss="min-w-[145px]">
              {types.map((type) => (
                <button
                  className={`bg-light-bg-terciary dark:bg-dark-bg-terciary h-full transition-all duration-200 ease-in-out ${
                    chartType === type
                      ? "text-light-font-100 dark:text-dark-font-100"
                      : "text-light-font-40 dark:text-dark-font-40"
                  }`}
                  key={type}
                  onClick={() => setChartType(type)}
                >
                  {type}
                </button>
              ))}
            </Menu>
          </div>
        </div>
      ) : (
        <LargeFont extraCss="mb-2.5">Website Visitors</LargeFont>
      )}
      <div
        className={cn(
          "flex justify-center mt-5 w-full items-center relative h-[310px]",
          extraCss
        )}
        {...props}
      >
        MIGRATE CHART
      </div>
      {!isGithub ? (
        <div className="flex items-center mr-[15px] mt-2.5">
          <div className="w-2.5 h-2.5 bg-green dark:bg-green rounded-full" />
          <MediumFont extraCss="ml-[7.5px]">Unique visitors</MediumFont>
        </div>
      ) : null}
    </div>
  );
};
