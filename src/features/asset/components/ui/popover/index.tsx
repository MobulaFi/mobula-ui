import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
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
}

export const CustomPopOver = ({
  title,
  icon,
  children,
  isMobile,
  position,
  logo,
}: CustomPopOverProps) => {
  const [showCustomPopover, setShowCustomPopover] = useState(false);
  return (
    <Popover
      visibleContent={
        <Button extraCss={`${mainButtonStyle} mb-[5px]`}>
          {isMobile ? (
            <NextImageFallback
              fallbackSrc="/empty/unknown.png"
              height={15}
              width={15}
              className="w-[15px] h-[15px] min-w-[15px] rounded-full mr-[5px]"
              src={logo || "/empty/unknown.png"}
              alt="logo"
            />
          ) : (
            icon
          )}
          <SmallFont extraCss="font-medium">{title}</SmallFont>
          <BsChevronDown className="text-sm ml-[5px]" />
        </Button>
      }
      hiddenContent={
        <div className="pr-0 overflow-y-scroll scroll">{children}</div>
      }
      isOpen={showCustomPopover}
      onToggle={() => setShowCustomPopover((prev) => !prev)}
      extraCss={`top-[35px] ${position || ""} ${
        showCustomPopover
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      } transition-all duration-100 ease-in-out`}
    />
  );
};
