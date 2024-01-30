import React, { useContext } from "react";
import { LargeFont } from "../../../../../../components/fonts";
import { BaseAssetContext } from "../../../../context-manager";
import { useTrendings } from "../../../../hooks/use-trendings";
import { SimilarAssetTemplate } from "../../../ui/similar-asset-template";

export const SimilarAsset = () => {
  const trendings = useTrendings();
  const { isAssetPage, assetPairs } = useContext(BaseAssetContext);

  return (
    <div className="flex flex-col mt-[50px] md:mt-[30px] w-full md:w-[95%] mx-auto">
      <LargeFont extraCss="mb-[15px]">Similar Assets</LargeFont>
      <div className="flex">
        <div className="flex overflow-x-scroll scroll">
          {(isAssetPage ? trendings : assetPairs?.pairs)?.map((item) => {
            if (item?.name || item?.protocol)
              return (
                <SimilarAssetTemplate
                  key={item?.address || item?.id}
                  content={{
                    id: item?.id || 12343,
                    name: item?.name || item?.protocol || "",
                    logo: item?.logo || "/empty/unknown.png",
                    price: item?.price || 0,
                    price_change_24h: item?.price_change_24h || 0,
                  }}
                />
              );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
