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
}: ContainerProps) => {
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
      className={`mx-auto w-90per lg:95per max-w-[1200px] ${extraCss}`}
      {...props}
    >
      {children}
    </div>
  );
};
