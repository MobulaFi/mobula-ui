import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import React from "react";
import { AiOutlineLineChart } from "react-icons/ai";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { Tds, Ths } from "../../../../../../../components/table";
import { getFormattedAmount } from "../../../../../../../utils/formaters";
import { BoxContainer } from "../../../../../common/components/box-container";
import { TokenDivs } from "../../../../models";
import { thStyles } from "../../../../style";

const EChart = dynamic(() => import("../../../../../../../lib/echart/line"), {
  ssr: false,
});

interface VestingInformationProps {
  token: TokenDivs;
}

export const VestingInformation = ({ token }: VestingInformationProps) => {
  const { resolvedTheme } = useTheme();
  const whiteMode = resolvedTheme === "dark";

  function formatDate(timestamp: number) {
    const date = new Date(timestamp);
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  const formatVesting = () => {
    const vesting: [number, number][] = token?.tokenomics?.vestingSchedule?.map(
      (v) => [v[0], v[1]]
    );
    return vesting;
  };

  const getDisplay = () => {
    const vesting = token?.tokenomics?.vestingSchedule;
    if (vesting?.length > 0) return "flex";
    return "hidden";
  };

  const display = getDisplay();
  const vestingFormatted = formatVesting();

  return (
    <BoxContainer
      extraCss={`mb-5 relative transition-all duration-200 py-[15px] md:py-2.5 px-5 lg:px-[15px] md:px-2.5 rounded-2xl sm:rounded-0 ${display}`}
    >
      <div className="flex items-center pb-5 lg:pb-[15px] md:pb-2.5">
        <AiOutlineLineChart className="text-blue dark:text-blue text-lg" />
        <MediumFont extraCss="ml-2.5"> Vesting Information</MediumFont>
      </div>
      <div className="w-full overflow-x-scroll scroll">
        <table className="w-full">
          <thead>
            <tr>
              <Ths extraCss={thStyles}>Unlocked Amount</Ths>
              <Ths extraCss={`${thStyles} text-end`}>Date</Ths>
              <Ths extraCss={`${thStyles} text-end`}>Breakdown</Ths>
            </tr>
          </thead>
          <tbody>
            {token?.tokenomics?.vestingSchedule?.map((vesting) => (
              <tr key={vesting[1]}>
                <Tds extraCss="px-2.5 py-[15px]">
                  {getFormattedAmount(vesting?.tokens_to_unlock)}{" "}
                  {token?.symbol}
                </Tds>
                <Tds extraCss="px-2.5 py-[15px] text-end">
                  {formatDate(vesting?.unlock_date)}
                </Tds>
                <Tds extraCss="px-2.5 py-[15px] text-end">
                  {Object.keys(vesting.allocation_details)?.length > 0
                    ? Object.entries(vesting.allocation_details)?.map?.(
                        (entry) => (
                          <SmallFont key={entry[0]}>
                            {entry[0]}: {getFormattedAmount(entry[1])}
                            {token?.symbol}
                          </SmallFont>
                        )
                      )
                    : "--"}
                </Tds>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex w-full mt-5 relative">
        {vestingFormatted?.length >= 2 &&
        vestingFormatted?.[1]?.[0] &&
        vestingFormatted?.[1]?.[1] ? (
          <>
            <SmallFont extraCss="absolute font-normal left-0 top-0 z-[1]">
              Vesting schedule chart
            </SmallFont>
            <EChart
              data={vestingFormatted}
              leftMargin={["0%", "0%"]}
              height={300}
              timeframe="ALL"
              bg={whiteMode ? "#F7F7F7" : "#151929"}
            />
            {/* #151929 */}
          </>
        ) : null}
      </div>
    </BoxContainer>
  );
};
