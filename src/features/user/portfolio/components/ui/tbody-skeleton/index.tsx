import React from "react";
import { Skeleton } from "../../../../../../components/skeleton";
import { tdStyle } from "../../../style";

interface TbodySkeletonProps {
  isActivity?: boolean;
}

export const TbodySkeleton = ({ isActivity }: TbodySkeletonProps) => {
  return (
    <tr>
      <td
        className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary top-0 sticky left-[-1px]`}
      >
        <div className="flex items-center">
          {isActivity ? (
            <div className="flex flex-col">
              <div className="bg-light-bg-hover dark:bg-dark-bg-hover rounded-full z-[1] w-fit h-fit">
                <Skeleton extraCss="rounded-full border border-light-border-primary dark:border-dark-border-primary min-w-[24px] min-h-[24px] w-[24px] h-[24px]" />
              </div>
              <div className="bg-light-bg-hover dark:bg-dark-bg-hover rounded-full ml-2.5 mt-[-8px] z-[0]">
                <Skeleton extraCss="rounded-full border border-light-border-primary dark:border-dark-border-primary min-w-[24px] min-h-[24px] w-[24px] h-[24px]" />
              </div>
            </div>
          ) : (
            <Skeleton extraCss="w-[28px] h-[28px] rounded-full" />
          )}

          <div className="flex flex-col">
            <Skeleton
              extraCss={`h-[12px] mb-[5px] rounded-md ${
                isActivity ? "ml-2.5" : "ml-[7.5px]"
              } ${isActivity ? "w-[60px]" : "w-[100px]"}`}
            />
            <Skeleton
              extraCss={`h-[15px] ml-[7.5px] mb-[5px] rounded-md ${
                isActivity ? "w-[100px]" : "w-[60px]"
              }`}
            />
          </div>
        </div>
      </td>
      <td
        className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary`}
      >
        <div className="flex flex-col items-end w-full">
          <Skeleton
            extraCss={`h-[12px] mb-[5px] rounded-md ml-[7.5px] ${
              isActivity ? "w-[100px]" : "w-[65px]"
            }`}
          />
          <Skeleton
            extraCss={`h-[15px] mb-[5px] rounded-md ml-[7.5px] ${
              isActivity ? "w-[65px]" : "w-[100px]"
            }`}
          />
        </div>
      </td>
      <td
        className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary`}
      >
        {isActivity ? (
          <div className="flex flex-col items-end w-full">
            <Skeleton extraCss="h-[15px] mb-[5px] rounded-md ml-[7.5px] w-[60px]" />
          </div>
        ) : (
          <div className="flex flex-col items-end w-full">
            <Skeleton extraCss="h-[12px] mb-[5px] rounded-md ml-[7.5px] w-[65px]" />
            <Skeleton extraCss="h-[15px] mb-[5px] rounded-md ml-[7.5px] w-[40px]" />
          </div>
        )}
      </td>
      <td
        className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary`}
      >
        <div className="flex justify-end w-full">
          <Skeleton
            extraCss={`h-[15px] mb-[5px] rounded-md ml-auto ${
              isActivity ? "w-[90px]" : "w-[30px]"
            }`}
          />
        </div>
      </td>
      <td
        className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary`}
      >
        <div className="flex w-full justify-end">
          <Skeleton
            extraCss={`h-[15px] mb-[5px] rounded-md ${
              isActivity ? "w-[90px]" : "w-[50px]"
            }`}
          />
        </div>
      </td>
      <td
        className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary`}
      >
        {isActivity ? (
          <div className="flex flex-col items-end">
            <Skeleton extraCss="h-[12px] mb-[5px] rounded-md w-[70px]" />
            <Skeleton extraCss="h-[15px] mb-[5px] rounded-md w-[50px]" />
          </div>
        ) : (
          <div className="flex items-end justify-end">
            <Skeleton extraCss="h-[15px] mb-[5px] ml-auto rounded-md w-[50px]" />
          </div>
        )}
      </td>
      <td
        className={`${tdStyle} border-b border-light-border-primary dark:border-dark-border-primary`}
      >
        <div className="flex justify-end">
          <Skeleton
            extraCss={`${
              isActivity
                ? "h-[24px] w-[24px] rounded-full"
                : "h-[20px] w-[20px] rounded"
            } mr-2.5 ml-auto mb-[5px]`}
          />
          <div
            className={`flex flex-col h-[20px] justify-between mr-[5px] ${
              isActivity ? "ml-[5px]" : ""
            }`}
          >
            <Skeleton extraCss="h-[4px] ml-auto rounded-full min-w-[4px] min-h-[4px] w-[4px]" />
            <Skeleton extraCss="h-[4px] ml-auto rounded-full min-w-[4px] min-h-[4px] w-[4px]" />
            <Skeleton extraCss="h-[4px] ml-auto rounded-full min-w-[4px] min-h-[4px] w-[4px]" />
          </div>
        </div>
      </td>
    </tr>
  );
};
