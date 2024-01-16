import React, { useContext } from "react";
import { MediumFont, SmallFont } from "../../../../../components/fonts";
import { Modal } from "../../../../../components/modal-container";
import { BaseAssetContext } from "../../../context-manager";

export const PopupAllTags = () => {
  const { baseAsset, showSeeAllTags, setShowSeeAllTags } =
    useContext(BaseAssetContext);
  return (
    <Modal
      extraCss="max-w-[400px]"
      isOpen={showSeeAllTags}
      onClose={() => setShowSeeAllTags(false)}
      title={`${baseAsset?.name} Tags`}
    >
      <MediumFont extraCss="text-[15px] mb-1">Category</MediumFont>
      <div className="flex flex-wrap">
        {baseAsset?.tags?.map((tag: string) => (
          <div
            className="h-[24px] mt-[7.5px] w-fit px-2.5 mr-[7.5px] rounded-md items-center justify-center bg-light-bg-tags dark:bg-dark-bg-tags"
            key={tag}
          >
            <SmallFont extraCss="h-full mt-0.5 lg:mt-[3px] md:mt-[5px] mb-0.5 lg:mb-0">
              {tag}
            </SmallFont>
          </div>
        ))}
      </div>
    </Modal>
  );
};
