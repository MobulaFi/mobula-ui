import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { Button } from "../../../../../components/button";
import { SmallFont } from "../../../../../components/fonts";
import { NextImageFallback } from "../../../../../components/image";
import { Popover } from "../../../../../components/popover";
import { mainButtonStyle } from "../../../style";

interface CustomPopOverProps {
  title: string;
  icon?: any;
  children: JSX.Element | JSX.Element[] | string;
  isMobile?: boolean;
  logo?: string;
  position?: string;
  isPair?: boolean;
}

export const CustomPopOver = ({
  title,
  icon,
  children,
  isMobile,
  logo,
  isPair,
}: CustomPopOverProps) => {
  const [showCustomPopover, setShowCustomPopover] = useState(false);
  return (
    <Popover
      visibleContent={
        <Button
          extraCss={`${mainButtonStyle} ${
            isPair ? "" : "mb-[5px]"
          } font-normal`}
        >
          {isMobile ? (
            <NextImageFallback
              fallbackSrc="/empty/unknown.png"
              height={15}
              width={15}
              className="w-[15px] h-[15px] min-w-[15px] rounded-full mr-[5px] object-cover"
              src={logo || "/empty/unknown.png"}
              alt="logo"
            />
          ) : (
            icon
          )}
          <SmallFont extraCss="font-medium">{title}</SmallFont>
          <BiChevronDown className="text-base ml-[2px]" />
        </Button>
      }
      hiddenContent={
        <div className="pr-0 overflow-y-scroll scroll">{children}</div>
      }
      position="center"
      isOpen={showCustomPopover}
      onToggle={() => setShowCustomPopover((prev) => !prev)}
    />
  );
};
