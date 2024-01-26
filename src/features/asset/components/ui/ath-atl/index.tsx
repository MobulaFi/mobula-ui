import React, { useContext } from "react";
import { SmallFont } from "../../../../../components/fonts";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { BaseAssetContext } from "../../../context-manager";

interface ATHnATLProps {
  content: {
    atl: number | undefined;
    ath: number | undefined;
    price: number;
  };
  isUp: boolean;
}

export const ATHnATL = ({ content, isUp }: ATHnATLProps) => {
  const { isAssetPage } = useContext(BaseAssetContext);
  return (
    <>
      <div
        className={`flex h-[7px] ${
          isAssetPage ? "w-2/4" : "w-full"
        } lg:w-full bg-[#87878720] rounded-md mt-[2.5px]`}
      >
        <div
          className={`rounded-md h-full ${
            isUp ? "bg-green dark:bg-green" : "bg-red dark:bg-red"
          }`}
          style={{
            width:
              content?.atl && content?.ath
                ? `${
                    ((content.price - content?.atl?.[1]) /
                      (content?.ath?.[1] - content?.atl?.[1])) *
                    100
                  }%`
                : "0%",
          }}
        />
      </div>
      <div
        className={`flex justify-between mt-[7.5px] md:mt-[5px] ${
          isAssetPage ? "w-2/4" : "w-full"
        } lg:w-full`}
      >
        <div className="flex items-center">
          <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 mr-[5px]">
            Low
          </SmallFont>
          <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100 font-medium">
            ${getFormattedAmount(content?.atl?.[1])}
          </SmallFont>
        </div>
        <div className="flex items-center">
          <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 mr-[5px]">
            High
          </SmallFont>
          <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100 font-medium">
            ${getFormattedAmount(content?.ath?.[1])}
          </SmallFont>
        </div>
      </div>
    </>
  );
};
