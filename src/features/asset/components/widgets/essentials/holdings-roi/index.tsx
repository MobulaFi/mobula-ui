/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
import {
  Button,
  Flex,
  Image,
  Img,
  Skeleton,
  useColorMode,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { TextLandingMedium, TextSmall } from "../../../../../../../UI/Text";
import { ButtonSlider } from "../../../../../../User/Portfolio/components/ui/button-slider";
import { boxStyle } from "../../../../../../User/Portfolio/style";
// eslint-disable-next-line import/no-cycle
import { getFormattedAmount } from "../../../../../../../../utils/helpers/formaters";
import { pushData } from "../../../../../../../common/data/utils";
import { useColors } from "../../../../../../../common/utils/color-mode";
import { AddTransactionPopup } from "../../../../../../User/Portfolio/components/popup/add-transaction";
import { TagPercentage } from "../../../../../../User/Portfolio/components/ui/tag-percentage";
import { PortfolioV2Context } from "../../../../../../User/Portfolio/context-manager";
import { UserHoldingsAsset } from "../../../../../../User/Portfolio/models";
// eslint-disable-next-line import/no-cycle
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";
import { ROIChart } from "./chart-roi";

export const HoldingRoi = ({
  chartId,
  asset,
  props,
}: {
  chartId: string;
  asset?: UserHoldingsAsset;
  [props: string]: any;
}) => {
  const [typeSelected, setTypeSelected] = useState("ROI");
  const {wallet, isLoading, baseAsset, timeSelected, setShowSwap, showSwap} =
    useContext(BaseAssetContext);
  const {
    text80,
    hover,
    boxBg6,
    borders,
    text40,
    text60,
    bordersActive,
    boxBg3,
  } = useColors();
  const {setShowAddTransaction, setTokenTsx} = useContext(PortfolioV2Context);
  const switcherOptions = ["ROI", "Total PNL", "Daily PNL"];
  const newAsset = wallet?.find(entry => entry.name === baseAsset.name);
  // const analysis = portfolios ? portfolios[0]?.last_analysis : null;
  // const CumulativePNLData = analysis?.global_pnl?.[timeSelected.toLowerCase()];
  const roiChart = ROIChart();
  const {colorMode} = useColorMode();
  const isWhiteMode = colorMode === "light";

  // const getFormatedCumulativePNL = () => {
  //   if (wallet) {
  //     const newArr = CumulativePNLData?.map(entry => ({
  //       y: entry[1].realized + entry[1].unrealized,
  //       x: entry[0],
  //     }));

  //     const cumulativeArr = newArr?.reduce((accumulator, current, index) => {
  //       const prevCumulativeY = index > 0 ? accumulator[index - 1].y : 0;
  //       const newY = current.y + prevCumulativeY + (index > 0 ? current.y : 0);
  //       accumulator.push({y: newY, x: current.x});
  //       return accumulator;
  //     }, []);
  //     return cumulativeArr;
  //   }
  //   return null;
  // };

  // const cumulativePNL = getFormatedCumulativePNL();

  const getData = () => {
    if (!asset) return {};

    // const formattedPNL = getFormattedPNL(
    //   portfolios[0]?.last_analysis,
    //   timeSelected,
    // );
    // const canva = document.getElementById(chartId) as HTMLCanvasElement;
    // if (typeSelected === "Total PNL")
    //   return {
    //     type: "line",
    //     data: {
    //       datasets: [
    //         {
    //           data: cumulativePNL,
    //           borderColor: "#ea3943",
    //           tension: 0.3,
    //           fill: false,

    //           pointRadius: 0,
    //           pointHitRadius: 20,
    //           responsive: true,
    //         },
    //       ],
    //     },
    //     options: {
    //       maintainAspectRatio: false,
    //       legend: {
    //         display: false,
    //       },
    //       tooltips: {
    //         enabled: false,
    //       },
    //       scales: {
    //         xAxes: [
    //           {
    //             gridLines: {display: false},
    //             type: "time",
    //             time: {
    //               unit: "day",
    //               tooltipFormat: "MM/DD/YYYY        HH:MM:SS",
    //               displayFormats: {
    //                 hour: "HH:mm",
    //                 week: "MMM D",
    //               },
    //             },
    //             ticks: {
    //               fontColor: "gray",
    //               fontFamily: "Poppins",
    //             },
    //           },
    //         ],
    //       },
    //     },
    //   };
    // return {
    //   type: "bar",
    //   data: {
    //     datasets: [
    //       {
    //         data: formattedPNL,
    //         backgroundColor: formattedPNL.map(e =>
    //           e.y > 0 ? "#16c784" : "#ea3943",
    //         ),
    //         responsive: true,
    //         hoverOpacity: 0,
    //         borderWidth: 0,
    //         hoverBorderWidth: 0,
    //         barThickness: (canva.width * 0.6) / formattedPNL.length,
    //       },
    //     ],
    //   },
    //   options: {
    //     borderWidth: 0,
    //     maintainAspectRatio: false,
    //     legend: {
    //       display: false,
    //     },
    //     tooltips: {
    //       enabled: false,
    //     },
    //     scales: {
    //       xAxes: [
    //         {
    //           offset: true,
    //           gridLines: {display: false},
    //           type: "time",
    //           time: {
    //             tooltipFormat: "MM/DD/YYYY        HH:MM:SS",
    //             displayFormats: {
    //               hour: "HH:mm",
    //               week: "MMM D",
    //             },
    //           },
    //           ticks: {
    //             fontColor: "gray",
    //             fontFamily: "Poppins",
    //             maxTicksLimit: formattedPNL.length,
    //             callback: (value, index, values) => {
    //               const interval = Math.floor(
    //                 values.length / (formattedPNL.length - 1),
    //               );
    //               const realIndex = Math.floor(index / interval);

    //               if (formattedPNL[realIndex] && formattedPNL[realIndex].t) {
    //                 return formatDateByTimeframe(
    //                   formattedPNL[realIndex].t,
    //                   timeSelected.toUpperCase(),
    //                 );
    //               }
    //               return null;
    //             },
    //             autoSkip: true,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // };
  };

  const getChart = async () => {
    if (typeof window !== "undefined") {
      try {
        (window as any).holdingsChart.destroy();
        delete (window as any).holdingsChart;
      } catch (e) {
        // Silent error
      }
      const data = typeSelected === "ROI" ? roiChart : getData();
      const canvas = document.getElementById(chartId);
      // removing canvas to avoid duplicates
      if (canvas) {
        canvas.remove();
      }
      const canvasElement = document.createElement("canvas");
      canvasElement.id = chartId;

      const chartContainer = document.getElementById(`${chartId}-container`);
      if (chartContainer) {
        chartContainer.appendChild(canvasElement);
      }

      let ctx;
      try {
        ctx = (
          document.getElementById(chartId) as HTMLCanvasElement
        ).getContext("2d");
      } catch (e) {
        // Silent error
      }

      const Chart = (await import("chart.js")).default;

      try {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        (window as any).holdingsChart = new Chart(ctx, data);
      } catch (e) {
        // Silent error
      }
    }
  };

  useEffect(() => {
    getChart();
  }, [wallet, typeSelected, timeSelected]);

  return (
    <Flex
      {...FlexBorderBox}
      bg={["none", "none", "none", boxBg3]}
      border={["none", "none", "none", borders]}
      {...props}
      w={["100%", "100%", "100%", "320px"]}
      mt={["10px", "10px", "10px", "0px"]}
    >
      <TextLandingMedium
        ml="5px"
        color={text80}
        display={["none", "none", "none", "flex"]}
        mb="15px"
        fontWeight="600"
      >
        ROI / Holdings
      </TextLandingMedium>

      <ButtonSlider
        switcherOptions={switcherOptions}
        typeSelected={typeSelected}
        setTypeSelected={setTypeSelected}
      />

      {Object.keys(roiChart).length > 0 ? (
        <Flex direction="column">
          <Flex
            mt="10px"
            mb="5px"
            h={isLoading ? "0px" : "200px"}
            w={isLoading ? "0px" : "100%"}
            maxW={isLoading ? "0px" : "297.5px"}
            mx="auto"
            id={`${chartId}-container`}
            position="relative"
          >
            <canvas id={chartId} />
          </Flex>
          {/* <Flex align="center">
          <TextSmall>PNL :</TextSmall>
        </Flex> */}
          {isLoading ? (
            <Flex
              boxSize="200px"
              mx="auto"
              borderRadius="full"
              position="relative"
            >
              <Skeleton
                h="100%"
                w="100%"
                startColor={boxBg6}
                endColor={hover}
                borderRadius="full"
              />
              <Flex
                w="100%"
                bg={boxBg3}
                h="100%"
                position="absolute"
                boxSize="150px"
                borderRadius="full"
                left="50%"
                top="50%"
                transform="translateX(-50%) translateY(-50%)"
              />
            </Flex>
          ) : null}
          <Flex wrap="wrap" align="center" mt="5px">
            <Flex align="center" w="50%" mt="10px">
              <Flex
                borderRadius="full"
                boxSize="10px"
                minW="10px"
                bg="#323546"
                mr="5px"
              />
              <TextSmall>Initial Investement</TextSmall>
            </Flex>
            <Flex align="center" w="50%" mt="10px" justify="flex-end">
              <Flex
                borderRadius="full"
                boxSize="10px"
                minW="10px"
                bg={newAsset?.unrealized_roi > 0 ? "#288558" : "#A54147"}
                mr="5px"
              />
              <TextSmall>Unrealized PNL</TextSmall>
            </Flex>
            <Flex align="center" w="50%" mt="10px">
              <Flex
                borderRadius="full"
                boxSize="10px"
                minW="10px"
                bg={newAsset?.realized_roi > 0 ? "#0ECB81" : "#EE5858"}
                mr="5px"
              />
              <TextSmall>Realized PNL</TextSmall>
            </Flex>
          </Flex>

          <Flex
            {...boxStyle}
            direction="row"
            bg={boxBg6}
            mt="15px"
            align="center"
            w="100%"
          >
            <Img
              src={newAsset?.image}
              boxSize="34px"
              borderRadius="full"
              mr="10px"
            />

            <Flex direction="column" w="100%">
              <Flex align="center" justify="space-between">
                <Flex direction="column" mb="4px">
                  <TextSmall
                    color={text40}
                    maxW="120px"
                    textOverlfow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {newAsset?.name}
                  </TextSmall>
                  <TextSmall>
                    ${getFormattedAmount(newAsset?.estimated_balance)}
                  </TextSmall>
                </Flex>

                <Flex align="flex-end" direction="column" ml="15px">
                  <TagPercentage
                    isUp={newAsset?.realized_roi > 0}
                    percentage={newAsset?.realized_roi}
                  />
                  <TextSmall
                    color={newAsset?.realized_usd > 0 ? "green" : "red"}
                  >
                    {getFormattedAmount(newAsset?.realized_usd)}$
                  </TextSmall>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <Flex direction="column" mt="15px">
          <Image
            src={
              isWhiteMode
                ? "/asset/empty-roi-light.png"
                : "/asset/empty-roi.png"
            }
            maxH="190px"
            w="auto"
            objectFit="contain"
          />
          <TextSmall mt="15px" textAlign="center" color={text60}>
            You don&apos;t own any {baseAsset?.name}
          </TextSmall>
          <Flex align="center" w="100%" mt="15px" justify="center">
            <Button
              h="28px"
              mr={["0px", "0px", "0px", "7.5px"]}
              ml={["7.5px", "7.5px", "7.5px", "0px"]}
              borderRadius="8px"
              px="10px"
              bg={boxBg6}
              border={borders}
              _hover={{
                border: bordersActive,
                bg: hover,
              }}
              transition="all 250ms ease-in-out"
              color={text80}
              fontWeight="400"
              fontSize={["12px", "12px", "13px", "14px"]}
              onClick={() => {
                if (showSwap === 0) setShowSwap(2);
                else setShowSwap(0);
              }}
            >
              Buy {baseAsset?.symbol}
            </Button>
            <Button
              h="28px"
              mr={["0px", "0px", "0px", "7.5px"]}
              ml={["7.5px", "7.5px", "7.5px", "0px"]}
              borderRadius="8px"
              px="10px"
              bg={boxBg6}
              border={borders}
              _hover={{
                border: bordersActive,
                bg: hover,
              }}
              transition="all 250ms ease-in-out"
              color={text80}
              fontWeight="400"
              fontSize={["12px", "12px", "13px", "14px"]}
              onClick={() => {
                setTokenTsx(baseAsset);
                setShowAddTransaction(true);
                pushData("Add Asset Button Clicked");
              }}
            >
              Add Transac.
            </Button>
          </Flex>
        </Flex>
      )}
      <AddTransactionPopup />
    </Flex>
  );
};
