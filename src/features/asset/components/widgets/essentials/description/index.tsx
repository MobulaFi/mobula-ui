import React, { useContext } from "react";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { HoverLink } from "../../../../../../components/hover-link";
import { BaseAssetContext } from "../../../../context-manager";

export const Description = () => {
  const { baseAsset } = useContext(BaseAssetContext);
  return (
    <div className="w-full md:w-[95%] mx-auto flex flex-col mt-[50px] md:mt-[30px]">
      <LargeFont extraCss="mb-[15px]">
        About {baseAsset?.name} {baseAsset?.symbol}
      </LargeFont>
      {baseAsset?.description ? (
        <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
          {baseAsset?.description}
        </SmallFont>
      ) : (
        <div className="flex items-center text-sm lg:text-[13px] md:text-xs text-light-font-60 dark:text-dark-font-60">
          No token description provided. Provide one <HoverLink>now</HoverLink>
          to improve Mobula!
        </div>
      )}
    </div>
  );
};
