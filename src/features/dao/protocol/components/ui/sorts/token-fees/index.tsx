import * as echarts from "echarts";
import { useTheme } from "next-themes";
import React, { useCallback, useEffect, useMemo } from "react";
import { AiOutlinePieChart } from "react-icons/ai";
import { v4 as uuid } from "uuid";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { BoxContainer } from "../../../../../common/components/box-container";
import { DoughnutsChart } from "../../../../chart-options";
import { TokenDivs } from "../../../../models";

interface TokenFeesProps {
  token: TokenDivs;
}

export const TokenFees = ({ token }: TokenFeesProps) => {
  const { theme } = useTheme();
  const whiteMode = theme === "light";

  const id = useMemo(() => uuid(), []);
  const { options1, options2 } = DoughnutsChart({ token, whiteMode });
  const createInstance = useCallback(
    (newId) => {
      const instance = echarts.getInstanceByDom(
        document.getElementById(newId) as HTMLElement
      );
      return (
        instance ||
        echarts.init(document.getElementById(newId), null, {
          renderer: "canvas",
        })
      );
    },
    [id]
  );

  useEffect(() => {
    const chart1 = createInstance("chart1");
    const chart2 = createInstance("chart2");

    if (chart1) chart1.setOption(options1);
    if (chart2) chart2.setOption(options2);
  }, []);

  const getDisplay = () => {
    if (token?.tokenomics?.fees?.length > 0) return "flex";
    return "hidden";
  };
  const display = getDisplay();

  return (
    <BoxContainer
      extraCss={`mb-5 relative transition-all duration-200 py-[15px] md:py-2.5 px-5 lg:px-[15px] md:px-2.5 rounded-2xl sm:rounded-0 ${display}`}
    >
      <div className="flex items-center border-b border-light-border-primary dark:border-dark-border-primary pb-5 lg:pb-[15px] md:pb-2.5">
        <AiOutlinePieChart className="text-yellow dark:text-yellow" />
        <MediumFont extraCss="ml-2.5">Token Fees</MediumFont>
      </div>
      <div className="flex mt-[15px] flex-row lg:flex-col w-full">
        <div className="flex w-2/4 lg:w-full flex-col">
          <SmallFont extraCss="font-normal ml-2.5 -mb-5">Buy Fees</SmallFont>
          <div id="chart1" style={{ height: "250px", width: "100%" }} />
        </div>
        <div className="flex w-2/4 lg:w-full flex-col">
          <SmallFont extraCss="font-normal ml-2.5 -mb-5">Sell Fees</SmallFont>
          <div id="chart2" style={{ height: "250px", width: "100%" }} />
        </div>
      </div>
    </BoxContainer>
  );
};
