import React from "react";
import { ExtraLargeFont, MediumFont } from "../../../components/fonts";
import { NextChakraLink } from "../../../components/link";
import { Skeleton } from "../../../components/skeleton";
import { Ths } from "../../../components/table";
import { useTop100 } from "../../../features/data/top100/context-manager";

interface SkeletonTableProps {
  isTable: boolean;
  isWatchlist: boolean;
  i?: number;
  isNews?: boolean;
  isWatchlistLoading?: boolean;
}

export const SkeletonTable = ({
  isTable = false,
  isWatchlist,
  i,
  isNews,
  isWatchlistLoading,
}: SkeletonTableProps) => {
  const { isLoading, isPortfolioLoading, portfolio, activeView } = useTop100();

  return (
    <>
      {isWatchlistLoading || isLoading || isPortfolioLoading ? (
        <tbody className="w-full">
          <tr className="relative w-full">
            {isTable ? (
              <>
                <Ths
                  extraCss={`table-cell md:hidden h-auto ${
                    isTable
                      ? "bg-light-bg-table dark:bg-dark-bg-table"
                      : "bg-light-bg-primary dark:bg-dark-bg-primary"
                  }`}
                >
                  {isWatchlist ? (
                    <div className="flex items-center justify-center">
                      <Skeleton extraCss="h-[16px] lg:h-[15px] md:h-[14px] w-[16px] lg:w-[15px] md:w-[14px] rounded-full" />
                      <Skeleton extraCss="h-[16px] lg:h-[15px] md:h-[14px] ml-[5px] w-[30px]" />
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <Skeleton extraCss="h-[20px] w-[80px]" />{" "}
                    </div>
                  )}
                </Ths>
                <Ths
                  extraCss={`px-5 md:py-2.5 sticky ${
                    isTable
                      ? "bg-light-bg-table dark:bg-dark-bg-table"
                      : "bg-light-bg-primary dark:bg-dark-bg-primary"
                  } top-0 left-[-1px]`}
                >
                  {isWatchlist ? (
                    <div className="flex items-center">
                      <Skeleton extraCss="h-[25px] w-[25px] mr-2.5 rounded-full" />
                      <div className="flex flex-col">
                        <Skeleton extraCss="h-[16px] lg:h-[15px] md:h-[14px] w-[60px] mb-[5px]" />
                        <Skeleton extraCss="h-[16px] lg:h-[15px] md:h-[14px] w-[40px] mb-[5px]" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Skeleton extraCss="h-[25px] w-[25px] mr-2.5 rounded-full" />
                      <div className="flex flex-row md:flex-col">
                        <Skeleton extraCss="h-[20px] w-[80px] mr-[5px] mb-0 md:mb-[3px]" />
                        <Skeleton extraCss="h-[20px] w-[40px] mr-[5px] mb-0 md:mb-[3px]" />
                      </div>
                    </div>
                  )}
                </Ths>
              </>
            ) : (
              <>
                <Ths
                  extraCss={`sticky ${
                    isTable
                      ? "bg-light-bg-table dark:bg-dark-bg-table"
                      : "bg-light-bg-primary dark:bg-dark-bg-primary"
                  } top-0 left-[-1px]`}
                >
                  <div className="flex items-center">
                    <Skeleton extraCss="h-[25px] w-[25px] mr-2.5 rounded-full" />

                    <div className="flex flex-row md:flex-col">
                      <Skeleton extraCss="h-[20px] w-[80px] mr-[5px] mb-0 md:mb-[3px]" />
                      <Skeleton extraCss="h-[20px] w-[40px] mr-[5px] mb-0 md:mb-[3px]" />
                    </div>
                  </div>
                </Ths>
                <Ths>
                  <div
                    className={`flex ${
                      isTable ? "justify-start" : "justify-end"
                    }`}
                  >
                    <Skeleton extraCss="h-[20px] w-[80px]" />
                  </div>
                </Ths>
              </>
            )}
            <Ths extraCss="text-end px-5 md:px-[15px]">
              {isWatchlist ? (
                <div className="flex justify-end">
                  <Skeleton extraCss="h-[16px] lg:h-[15px] md:h-[14px] w-[55px]" />
                </div>
              ) : (
                <div className="flex justify-end">
                  <Skeleton extraCss="h-[20px] w-[50px]" />
                </div>
              )}
            </Ths>
            <Ths extraCss="text-end px-5 md:px-[15px] ">
              {isWatchlist ? (
                <div className="flex justify-end">
                  <Skeleton extraCss="h-[15px] lg:h-[14px] md:h-[13px] w-[45px]" />
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  {!isTable ? <Skeleton extraCss="h-[14px] w-[40px]" /> : null}
                  <Skeleton
                    extraCss={`${
                      isTable ? "h-5" : "h-[14px]"
                    } w-[90px] mt-[5px]`}
                  />
                </div>
              )}
            </Ths>
            <Ths extraCss="text-end px-5 md:px-[15px]">
              {isWatchlist ? (
                <div className="flex justify-end">
                  <Skeleton extraCss="h-[15px] lg:h-[14px] md:h-[13px] w-[110px]" />
                </div>
              ) : (
                <div className="flex justify-end">
                  <Skeleton extraCss="h-[20px] w-[50px]" />
                </div>
              )}
            </Ths>
            <Ths extraCss="text-end px-5 md:px-[15px]">
              {isWatchlist ? (
                <div className="flex justify-end">
                  <Skeleton extraCss="h-[15px] lg:h-[14px] md:h-[13px] w-[90px]" />
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  {!isTable ? <Skeleton extraCss="h-[14px] w-[40px]" /> : null}
                  <Skeleton
                    extraCss={`${
                      isTable ? "h-5" : "h-[14px]"
                    } w-[40px] mt-[5px]`}
                  />
                </div>
              )}
            </Ths>
            <Ths extraCss="text-end px-5 md:px-[15px]">
              {isWatchlist ? (
                <div className="flex justify-end">
                  <Skeleton extraCss="h-[15px] lg:h-[14px] md:h-[13px] w-[70px]" />
                </div>
              ) : (
                <div className="flex items-center justify-end w-full">
                  <Skeleton extraCss="h-[20px] w-[20px] mr-[5px]" />
                  <Skeleton extraCss="h-[20px] w-[20px]" />
                </div>
              )}
            </Ths>
            <Ths extraCss="text-end px-5 md:px-[15px]">
              {isWatchlist ? (
                <div className="flex justify-end">
                  <Skeleton extraCss="h-[15px] lg:h-[14px] md:h-[13px] w-[100px]" />
                </div>
              ) : (
                <Skeleton extraCss="h-[50px] w-[140px]" />
              )}
            </Ths>
            {isWatchlist ? (
              <Ths extraCss="text-end px-5 md:px-[15px]">
                <div className="flex justify-center">
                  <Skeleton extraCss="h-[28px] w-[28px] mr-[7.5px]" />
                  <Skeleton extraCss="h-[28px] w-[28px]" />
                </div>
              </Ths>
            ) : null}
          </tr>
        </tbody>
      ) : null}
      {activeView?.name !== "Portfolio" &&
      !isLoading &&
      !isPortfolioLoading &&
      !isWatchlistLoading ? (
        <caption
          className={`w-full caption-bottom lg:w-screen h-[600px] lg:h-[450px] md:h-[400px] sm:h-[350px] ${
            i === 0 ? "caption" : "hidden"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-[100px] w-full mr-0">
            <ExtraLargeFont extraCss="mb-2.5 w-fit">No results</ExtraLargeFont>
            <MediumFont extraCss="w-fit">
              Try changing your filters or search
            </MediumFont>
          </div>
        </caption>
      ) : null}
      {activeView?.name === "Portfolio" &&
      !isLoading &&
      !portfolio?.length &&
      !isPortfolioLoading &&
      !isNews &&
      !isWatchlistLoading ? (
        <caption
          className={`w-full caption-bottom lg:w-screen h-[600px] lg:h-[450px] md:h-[400px] sm:h-[350px] ${
            i === 0 ? "caption" : "hidden"
          }`}
        >
          <div className="flex flex-col items-center justify-center pt-[100px] w-full mr-0">
            <ExtraLargeFont extraCss="mb-2.5 w-fit">No results</ExtraLargeFont>
            <MediumFont extraCss="w-fit">
              You can add assets to your portfolio{" "}
              <NextChakraLink href="/swap">here</NextChakraLink>
            </MediumFont>
          </div>
        </caption>
      ) : null}
    </>
  );
};
