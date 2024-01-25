import React, { useContext, useState } from "react";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { Tds, Ths } from "../../../../../../components/table";
import { BaseAssetContext } from "../../../../context-manager";
import { Investors as InvestorProps } from "../../../../models";
import { InvestorSkeleton } from "./skeleton";

export const Investors = () => {
  const { baseAsset, isLoading } = useContext(BaseAssetContext);
  const [isHover, setIsHover] = useState("");
  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  const investorsPerSales = baseAsset?.sales?.map((sale) => ({
    name: sale.name,
    investors: sale.investors,
  }));

  const getStageForInvestors = (investorID: string) => {
    const investors: string[] = [];
    investorsPerSales.forEach((sale) => {
      sale?.investors?.forEach((investor) => {
        if (investorID === investor.name) {
          investors.push(sale.name);
        }
      });
    });
    return investors;
  };

  const getNameTypeFormatted = (type: string) => {
    if (!isMobile) return type;
    switch (type) {
      case "Ventures Capital":
        return "VC";
      case "Angel Investor":
        return "BA";
      case "Exchange":
        return "CEX";
      default:
        return type;
    }
  };

  return (
    <>
      <LargeFont extraCss="mb-[15px] mt-5">Investors</LargeFont>
      <table>
        <thead>
          <tr>
            <Ths extraCss="text-center max-w-[50px] px-0 table-cell md:hidden">
              Rank
            </Ths>
            <Ths extraCss="px-5 md:px-2.5 sm:px-[5px] text-start">Name</Ths>
            <Ths extraCss="px-5 md:px-2.5 sm:px-[5px] text-start">Tier</Ths>
            <Ths extraCss="px-5 md:px-2.5">Type</Ths>
            <Ths extraCss="px-5 md:px-2.5 sm:px-[5px] text-end">Stage</Ths>
          </tr>
        </thead>
        {baseAsset?.investors?.length > 0 ? (
          <tbody>
            {baseAsset?.investors
              ?.sort((a, b) => b.rating - a.rating)
              ?.map((investor: InvestorProps, i: number) => {
                const stages = getStageForInvestors(investor.name);
                const hasMoreThanOneStage = stages?.length > 1;
                const typeFormatted = getNameTypeFormatted(investor.type);
                return (
                  <tr key={investor.name}>
                    <Tds extraCss="px-0 py-[14px] max-w-[100px] table-cell md:hidden">
                      <SmallFont extraCss="text-center w-full">
                        {i + 1}
                      </SmallFont>
                    </Tds>
                    <Tds extraCss="py-[14px] px-5 md:px-2.5 sm:px-[5px]">
                      <div className="flex items-center">
                        <div className="flex relative w-fit h-fit">
                          <img
                            className="w-[30px] h-[30px] md:w-[25px] md:h-[25px] rounded-full mr-[7.5px] md:mr-2.5 min-w-[25px]"
                            src={investor.image || "/icon/unknown.png"}
                            alt={`${investor.name} logo`}
                          />
                          <img
                            src={investor?.country?.flag}
                            className="w-[14px] h-[14px] rounded-full absolute z-[1] -bottom-[5px] right-[5px]
                           hidden md:flex border border-light-border-primary dark:border-dark-border-primary"
                            alt={`${investor.name} flag`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <SmallFont extraCss="font-medium min-w-auto sm:min-w-[110px] whitespace-pre-wrap">
                            {investor.name}
                          </SmallFont>
                          <SmallFont extraCss="flex md:hidden text-xs lg:text-[11px] md:text-[10px] text-light-font-60 dark:text-dark-font-60">
                            {investor?.country?.name}
                          </SmallFont>
                        </div>
                      </div>
                    </Tds>
                    <Tds extraCss="py-[14px] px-5 md:px-2.5 sm:px-[5px] text-end">
                      <SmallFont extraCss="font-medium text-start whitespace-nowrap">
                        {investor.tier || "--"}
                      </SmallFont>
                    </Tds>
                    <Tds extraCss="py-[14px] px-5 md:px-2.5 sm:px-[5px]">
                      <SmallFont extraCss="font-medium text-start md:text-center">
                        {typeFormatted}
                      </SmallFont>
                    </Tds>
                    <Tds extraCss="py-[14px] px-5 md:px-2.5 sm:px-[5px] text-end">
                      <div className="w-full h-full justify-end flex">
                        <div
                          className={`${
                            hasMoreThanOneStage
                              ? "cursor-pointer"
                              : "cursor-default"
                          } bg-light-bg-terciary 
                    dark:bg-dark-bg-terciary px-2 rounded-md font-medium flex items-center justify-end w-fit text-sm lg:text-[13px] md:text-xs 
                    text-light-font-100 dark:text-dark-font-100 relative border border-light-border-primary whitespace-nowrap dark:border-dark-border-primary `}
                          onMouseLeave={() => setIsHover("")}
                          onMouseEnter={() => {
                            if (hasMoreThanOneStage) setIsHover(investor.name);
                          }}
                        >
                          {hasMoreThanOneStage
                            ? `${stages?.length || 0} Rounds`
                            : stages?.[0] || "--"}
                          {isHover === investor.name ? (
                            <div
                              className="absolute z-[1] bg-light-bg-hover dark:bg-dark-bg-hover shadow-md border
                         border-light-border-primary dark:border-dark-border-primary rounded-md px-2.5 
                         py-[5px] max-w-fit min-w-fit w-full flex flex-col"
                              style={{ top: "calc(100% + 5px)" }}
                              onMouseLeave={() => setIsHover("")}
                            >
                              {stages?.map((entry) => (
                                <SmallFont extraCss="font-medium" key={entry}>
                                  {entry}
                                </SmallFont>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Tds>
                  </tr>
                );
              })}
          </tbody>
        ) : null}
        {!baseAsset?.investors?.length || !isLoading ? (
          <caption className="caption-bottom border border-light-border-primary dark:border-dark-border-primary mt-0 rounded-b border-t-0">
            <div className="h-[250px] flex flex-col w-full items-center justify-center">
              <img src="/empty/ray.png" alt="No trade image" />
              <MediumFont extraCss="font-medium text-light-font-60 dark:text-dark-font-60 mt-5 mb-2.5">
                No data available
              </MediumFont>
            </div>
          </caption>
        ) : null}
        {!baseAsset?.investors?.length && !baseAsset?.sales && isLoading ? (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <InvestorSkeleton key={i} />
            ))}
          </>
        ) : null}
      </table>
    </>
  );
};
