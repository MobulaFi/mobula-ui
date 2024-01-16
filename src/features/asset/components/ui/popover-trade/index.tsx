import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React from "react";
import { BiSolidChevronDown } from "react-icons/bi";
import { Button } from "../../../../../components/button";
import { SmallFont } from "../../../../../components/fonts";
import { NextImageFallback } from "../../../../../components/image";
import { Popover } from "../../../../../components/popover";
import { mainButtonStyle } from "../../../style";

interface PopoverTradeProps {
  title: string | string[];
  isImage?: boolean;
  children: React.ReactNode;
  extraCss?: string;
}

export const PopoverTrade = ({
  title,
  isImage,
  children,
  extraCss = "",
}: PopoverTradeProps) => {
  const [showContent, setShowContent] = React.useState(false);
  const onClose = () => setShowContent(false);
  return (
    <Popover
      isFilters
      visibleContent={
        <Button
          extraCss={`${mainButtonStyle} ${
            title === "All Liquidity Pool"
              ? "cursor-not-allowed opacity-50"
              : ""
          }`}
          disabled={title === "All Liquidity Pool"}
        >
          {!isImage || !Array.isArray(title) ? title : null}
          {isImage && title?.length > 0 ? (
            <div className="flex items-center">
              {Array.isArray(title)
                ? title
                    .filter((_, i) => i < 4)
                    .map((item, i) => (
                      <NextImageFallback
                        height={18}
                        width={18}
                        className="rounded-full bg-light-bg-primary dark:bg-dark-bg-primary ml-[-5px]"
                        key={item}
                        alt={blockchainsContent[title[i]]?.name}
                        src={
                          blockchainsContent[title[i]]?.logo ||
                          `/logo/${title[i]?.toLowerCase().split(" ")[0]}.png`
                        }
                        fallbackSrc={"/empty/unknown.png"}
                      />
                    ))
                : null}
            </div>
          ) : null}
          {isImage && title?.length > 4 ? (
            <SmallFont extraCss="mx-[5px]">+{title.length - 4}</SmallFont>
          ) : null}
          <BiSolidChevronDown className="text-sm ml-[5px] text-light-font-100 dark:text-dark-font-100" />
        </Button>
      }
      hiddenContent={React.cloneElement(children as never, { onClose })}
      isOpen={showContent}
      onToggle={() => setShowContent((prev) => !prev)}
      extraCss="max-w-[235px]"
    />
  );
};
