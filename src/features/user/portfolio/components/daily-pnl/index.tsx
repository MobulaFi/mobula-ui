import { Flex, Spinner } from "@chakra-ui/react";
import React, { useContext } from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../components/fonts";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { PortfolioV2Context } from "../../context-manager";
import { UserHoldings, UserHoldingsAsset } from "../../models";
import { boxStyle } from "../../style";
import { getFormattedPNL } from "../../utils";

export const DailyPnl = ({
  chartId,
  wallet,
}: {
  chartId: string;
  wallet: UserHoldings | UserHoldingsAsset;
}) => {
  const { manager, timeframe, isLoading } = useContext(PortfolioV2Context);
  const { boxBg3, borders, text80, text40 } = useColors();

  // const getData = () => {
  //   if (typeof window !== "undefined") {
  //     const formattedPNL = getFormattedPNL(wallet, timeframe);
  //     const canva = document.getElementById(chartId) as HTMLCanvasElement;
  //     // Get canva css width - 300px default, which is only triggered sometimes at first render on Mobile, can't really explain how, but no time to fix it.
  //     const width = canva?.clientWidth || 300;
  //     if (!canva) return {};

  //     return {
  //       type: "bar",
  //       data: {
  //         datasets: [
  //           {
  //             data: formattedPNL,
  //             backgroundColor: formattedPNL.map((e) =>
  //               e.y > 0 ? "#0ECB81" : "#ea3943"
  //             ),
  //             responsive: true,
  //             hoverOpacity: 0,
  //             borderWidth: 0,
  //             hoverBorderWidth: 0,
  //             barThickness: (width * 0.6) / formattedPNL.length,
  //           },
  //         ],
  //       },
  //       options: {
  //         borderWidth: 0,
  //         maintainAspectRatio: false,
  //         legend: {
  //           display: false,
  //         },
  //         tooltips: {
  //           enabled: false,
  //         },
  //         scales: {
  //           xAxes: [
  //             {
  //               offset: true,
  //               gridLines: { display: false },
  //               type: "time",
  //               time: {
  //                 tooltipFormat: "MM/DD/YYYY        HH:MM:SS",
  //                 displayFormats: {
  //                   hour: "HH:mm",
  //                   week: "MMM D",
  //                 },
  //               },
  //               ticks: {
  //                 fontColor: "gray",
  //                 fontFamily: "Poppins",
  //                 maxTicksLimit: formattedPNL.length,
  //                 callback: (value, index, values) => {
  //                   const interval = Math.floor(
  //                     values.length / (formattedPNL.length - 1)
  //                   );
  //                   const realIndex = Math.floor(index / interval);

  //                   if (formattedPNL[realIndex] && formattedPNL[realIndex].t) {
  //                     return formatDateByTimeframe(
  //                       formattedPNL[realIndex].t,
  //                       timeframe.toUpperCase()
  //                     );
  //                   }
  //                   return null;
  //                 },
  //                 autoSkip: true,
  //               },
  //             },
  //           ],
  //           yAxes: [
  //             {
  //               gridLines: { display: false },
  //               ticks: {
  //                 fontColor: "gray",
  //                 fontFamily: "Poppins",
  //                 callback(value: number) {
  //                   return formatBigAmount(value);
  //                 },
  //               },
  //             },
  //           ],
  //         },
  //       },
  //     };
  //   }
  //   return null;
  // };

  // const getChart = async () => {
  //   if (typeof window !== "undefined") {
  //     const data = getData();
  //     try {
  //       window[chartId]?.destroy();
  //     } catch (e) {
  //       // Silent error
  //     }
  //     let ctx;
  //     try {
  //       ctx = (
  //         document.getElementById(chartId) as HTMLCanvasElement
  //       ).getContext("2d");
  //     } catch (e) {
  //       // Silent error
  //     }
  //     const Chart = (await import("chart.js")).default;

  //     try {
  //       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //       // @ts-ignore
  //       window[chartId] = new Chart(ctx, data);
  //     } catch (e) {
  //       console.log(e, data);
  //       // Silent error
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (wallet) getChart();
  // }, [wallet?.uniqueIdentifier, manager, timeframe]);

  return (
    <Flex
      mt="10px"
      {...boxStyle}
      border={borders}
      bg={boxBg3}
      w={["100%", "100%", "100%", "320px"]}
    >
      <TextLandingMedium ml="5px" color={text80} mb="10px" fontWeight="600">
        {timeframe} P&L
      </TextLandingMedium>
      {getFormattedPNL(wallet, timeframe)?.length === 0 && !isLoading ? (
        <Flex
          position="relative"
          maxH="170px"
          minH="170px"
          h="170px"
          w="100%"
          align="center"
          justify="center"
          borderTop={borders}
          mb="5px"
        >
          {Array.from(Array(5).keys()).map((_, i) => (
            <Flex
              h="1px"
              bg="borders.3"
              w="100%"
              position="absolute"
              top={`${(i + 1) * 20}%`}
            />
          ))}
          <TextLandingSmall color={text40}>No data</TextLandingSmall>
        </Flex>
      ) : (
        <Flex mt="15px" mb="5px" h="170px" align="center" justify="center">
          {getFormattedPNL(wallet, timeframe)?.length > 0 && !isLoading ? (
            // <canvas id={chartId} />
          ) : null}
          {isLoading ? (
            <Spinner
              boxSize="50px"
              mb="20px"
              color="var(--chakra-colors-blue)"
            />
          ) : null}
        </Flex>
      )}
    </Flex>
  );
};
