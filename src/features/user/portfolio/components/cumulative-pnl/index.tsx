/* eslint-disable react-hooks/exhaustive-deps */
import { Flex, Spinner } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../components/fonts";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { formatBigAmount } from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { boxStyle } from "../../style";
import { getFormattedPNL } from "../../utils";

export const CumulativePnl = ({ chartId }: { chartId: string }) => {
  const { wallet, timeframe, manager, asset, isAssetPage, isLoading } =
    useContext(PortfolioV2Context);
  const { boxBg3, borders, text10, text40, text80 } = useColors();

  let gradient;
  const getFormatedCumulativePNL = () => {
    if (wallet) {
      let pnlData;
      if (isAssetPage) {
        pnlData = asset?.pnl_history?.[timeframe.toLowerCase()];
      } else pnlData = wallet?.global_pnl?.[timeframe.toLowerCase()];

      const newArr = pnlData?.map((entry) => ({
        y: entry[1].realized + entry[1].unrealized,
        x: entry[0],
      }));

      const cumulativeArr = newArr?.reduce((accumulator, current, index) => {
        const prevCumulativeY = index > 0 ? accumulator[index - 1].y : 0;
        const newY = current.y + prevCumulativeY + (index > 0 ? current.y : 0);
        accumulator.push({ y: newY, x: current.x });
        return accumulator;
      }, []);
      return cumulativeArr;
    }
    return null;
  };

  const cumulativePNL = getFormatedCumulativePNL();
  const isGainer = cumulativePNL?.[cumulativePNL.length - 1].y > 0;

  const getData = () => ({
    type: "line",
    data: {
      datasets: [
        {
          data: cumulativePNL,
          borderColor: isGainer ? "#0ECB81" : "#ea3943",
          tension: 0.3,
          fill: false,

          pointRadius: 0,
          pointHitRadius: 20,
          responsive: true,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: { display: false },
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "MM/DD/YYYY        HH:MM:SS",
              displayFormats: {
                hour: "HH:mm",
                week: "MMM D",
              },
            },
            ticks: {
              fontColor: "gray",
              fontFamily: "Poppins",
            },
          },
        ],
        yAxes: [
          {
            gridLines: { display: false },
            ticks: {
              fontColor: "gray",
              fontFamily: "Poppins",
              callback(value: number) {
                return formatBigAmount(value);
              },
            },
          },
        ],
      },
    },
  });

  const getChart = async () => {
    if (typeof window !== "undefined") {
      try {
        window[chartId]?.destroy();
      } catch (e) {
        // Silent error
      }
      let ctx;
      const data = getData();

      try {
        ctx = (
          document.getElementById(chartId) as HTMLCanvasElement
        ).getContext("2d");

        if (isGainer) {
          gradient = ctx?.createLinearGradient(0, 0, 0, 700);
          gradient?.addColorStop(0, "rgba(22,199,132,1)");
          gradient?.addColorStop(0.7, "rgba(21,25,41,0)");
        } else {
          gradient = ctx?.createLinearGradient(0, 0, 0, 700);
          gradient?.addColorStop(0, "rgba(234,57,67,1)");
          gradient?.addColorStop(0.7, "rgba(21,25,41,0)");
        }
      } catch (e) {
        // Silent error
      }
      const Chart = (await import("chart.js")).default;

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window[chartId] = new Chart(ctx, data);
      } catch (e) {
        // Silent error
      }
    }
  };

  useEffect(() => {
    getChart();
  }, [wallet?.uniqueIdentifier, asset?.id, isAssetPage, timeframe, manager]);

  return (
    <Flex
      my="10px"
      {...boxStyle}
      border={borders}
      bg={boxBg3}
      w={["100%", "100%", "100%", "320px"]}
    >
      <TextLandingMedium ml="5px" color={text80} mb="10px" fontWeight="600">
        Cumulative P&L
      </TextLandingMedium>
      {getFormattedPNL(wallet, timeframe).length === 0 && !isLoading ? (
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
              bg={text10}
              w="100%"
              position="absolute"
              top={`${(i + 1) * 20}%`}
            />
          ))}
          <TextLandingSmall color={text40}>No data</TextLandingSmall>
        </Flex>
      ) : (
        <Flex mt="15px" mb="5px" h="170px">
          {getFormattedPNL(wallet, timeframe).length > 0 && !isLoading ? (
            <canvas id={chartId} />
          ) : null}
          {isLoading ? (
            <Spinner
              boxSize="50px"
              m="auto"
              mt="40px"
              color="var(--chakra-colors-blue)"
            />
          ) : null}
        </Flex>
      )}
    </Flex>
  );
};
