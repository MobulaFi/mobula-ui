import React from "react";

interface LeftBoxProps {
  showPageMobile: number;
}

export const LeftBox = ({ showPageMobile }: LeftBoxProps) => {
  return (
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
        border-light-border-primary dark:border-dark-border-primary flex-col relative overflow-hidden
        min-w-[407px] md:min-w-full w-[31.5%] mr-2.5 lg:w-full transition duration-500 md:overflow-visible ${
          showPageMobile === 0 ? "z-[3]" : "z-[1]"
        }] py-2.5`}
      style={{ transform: `translateX(-${showPageMobile * 100}%)` }}
    >
      fkorofd
    </div>
  );
};
