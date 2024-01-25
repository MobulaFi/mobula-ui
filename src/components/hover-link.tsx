import React, { useState } from "react";
import { NextChakraLink } from "./link";

interface HoverLinkProps {
  children: React.ReactNode;
}

export const HoverLink = ({ children, ...props }: HoverLinkProps) => {
  const [isHover, setIsHover] = useState(false);
  return (
    <NextChakraLink
      extraCss="mx-[5px] font-medium cursor-pointer"
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      {...props}
    >
      <div className="flex flex-col w-fit">
        {children}
        <div
          className="h-[1px] bg-light-font-100 dark:bg-dark-font-100 transition-all"
          style={{ width: isHover ? "100%" : "0%" }}
        />
      </div>
    </NextChakraLink>
  );
};
