import { FlexProps } from "@chakra-ui/react";
import React from "react";

interface ContainerProps {
  extraCss?: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

export const Container = ({
  children,
  isMobile,
  extraCss,
  ...props
}: ContainerProps & FlexProps) => {
  if (
    isMobile === true &&
    typeof window !== "undefined" &&
    window.innerWidth > 990
  ) {
    return null;
  }
  if (
    isMobile === false &&
    typeof window !== "undefined" &&
    window.innerWidth < 990
  ) {
    return null;
  }

  return (
    <div
      className={`flex flex-col mx-auto w-90per lg:95per max-w-[1200px] mb-20 mt-7 md:mt-2.5 ${extraCss}`}
      {...props}
    >
      {children}
    </div>
  );
};
