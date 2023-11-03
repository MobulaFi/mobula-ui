import React from "react";

interface SkeletonProps {
  extraCss?: string;
}

export const Skeleton = ({ extraCss }: SkeletonProps) => {
  return (
    <div
      className={`animate-skeleton bg-gradient-to-r from-[#F5F5F5] via-[#E3E3E3] to-[#F5F5F5] dark:from-[#222531] dark:via-[#282B37] dark:to-[#222531] bg-[length:200%_100%] ${extraCss} `}
      style={{
        animation: "skeleton 1.5s infinite linear",
      }}
    />
  );
};
