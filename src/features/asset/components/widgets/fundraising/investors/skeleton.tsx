import React from "react";
import { Skeleton } from "../../../../../../components/skeleton";
import { Tds } from "../../../../../../components/table";

export const InvestorSkeleton = () => {
  return (
    <tr>
      <Tds extraCss="px-0 py-[14px] max-w-[100px] table-cell md:hidden">
        <Skeleton extraCss="h-[14px] md:h-[12px] w-[14px] md:w-[12px] rounded-full" />
      </Tds>
      <Tds extraCss="py-[14px] px-5 md:px-2.5 sm:px-[5px]">
        <div className="flex items-center">
          <div className="flex relative w-fit h-fit">
            <Skeleton extraCss="h-[30px] md:h-[25px] w-[30px] md:w-[25px] rounded-full mr-[7.5px] md:mr-2.5 min-w-[25px]" />
          </div>
          <div className="flex flex-col">
            <Skeleton extraCss="h-[14px] md:h-[12px] w-[160px] md:w-[100px]" />
            <Skeleton extraCss="h-[12px] md:h-[10px] w-[100px] md:w-[60px] mt-1.5" />
          </div>
        </div>
      </Tds>
      <Tds extraCss="py-[14px] px-5 md:px-2.5 sm:px-[5px] text-end">
        <Skeleton extraCss="h-[14px] md:h-[12px] w-[50px] md:w-[40px]" />
      </Tds>
      <Tds extraCss="py-[14px] px-5 md:px-2.5 sm:px-[5px]">
        <Skeleton extraCss="h-[14px] md:h-[12px] w-[130px] md:w-[100px]" />
      </Tds>
      <Tds extraCss="py-[14px] px-5 md:px-2.5 sm:px-[5px] text-end">
        <div className="w-full h-full justify-end flex">
          <Skeleton extraCss="h-[14px] md:h-[12px] w-[50px] md:w-[40px]" />
        </div>
      </Tds>
    </tr>
  );
};
