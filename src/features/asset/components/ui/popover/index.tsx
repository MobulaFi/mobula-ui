import { Button } from "components/button";
import { Popover } from "components/popover";
import { useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { SmallFont } from "../../../../../components/fonts";
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
          {
            isMobile ? (
              <img
                className="w-[15px] h-[15px] min-w-[15px] ml-2.5 rounded-full mr-[5px]"
                src={logo}
                alt="logo"
              />
            ) : (
              icon
            )
            // <Icon
            //   as={icon}
            //   fontSize="13px"
            //   color={text80}
            //   mr={!isMobile ? "5px" : "0px"}
            // />
          }
          <SmallFont extraCss="font-medium">{title}</SmallFont>
          <BsChevronDown className="text-base ml-[2.5px]" />
        </Button>
      }
      hiddenContent={
        <div className="pr-0 overflow-y-scroll scroll">{children}</div>
      }
      isOpen={showCustomPopover}
      onToggle={() => setShowCustomPopover((prev) => !prev)}
      extraCss={`top-[35px] ${position || ""}`}
    />
  );
};
