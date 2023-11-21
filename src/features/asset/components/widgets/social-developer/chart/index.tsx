import {
  Button,
  Flex,
  FlexProps,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import {ChevronDownIcon} from "@chakra-ui/icons";
import {useContext, useEffect, useState} from "react";
import {BsGithub} from "react-icons/bs";
import {crosshairLine} from "../../../../../../../../utils/charts";
import {getShortenedAmount} from "../../../../../../../../utils/helpers/formaters";
import {
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../../../UI/Text";
import {NextChakraLink} from "../../../../../../../common/components/links";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {mainButtonStyle} from "../../../../style";

export const Charts = ({
  chartId,
  dividor = 1,
  isGithub,
  ...props
}: {
  chartId?: string;
  dividor?: number;
  isGithub?: boolean;
} & FlexProps) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const [chartType, setChartType] = useState("Commit Activity");
  const {text80, boxBg6, borders, text40} = useColors();
  const types = [
    "Commit Activity",
    "Code Add/Del",
    "Developer Trend",
    "Issues",
  ];
  const getData = () => {
    let datas = [];
    if (chartId === "github-chart") {
      if (chartType === "Commit Activity") {
        datas = [
          [1672444800000, 11],
          [1672531200000, 12],
          [1672617600000, 13],
          [1672704000000, 14],
          [1672790400000, 15],
          [1672876800000, 10],
          [1672963200000, 5],
          [1673049600000, 2],
          [1673136000000, 9],
          [1673222400000, 10],
          [1673308800000, 5],
          [1673395200000, 11],
          [1673481600000, 3],
          [1673568000000, 4],
          [1673654400000, 1],
          [1673740800000, 6],
          [1673827200000, 7],
          [1673913600000, 8],
          [1674000000000, 9],
          [1674086400000, 15],
        ];
      } else if (chartType === "Code Add/Del") {
        datas = [
          [1672444800000, 6],
          [1672531200000, 5],
          [1672617600000, 4],
          [1672704000000, 3],
          [1672790400000, 4],
          [1672876800000, 8],
          [1672963200000, 4],
          [1673049600000, 2],
          [1673136000000, 9],
          [1673222400000, 13],
          [1673308800000, 16],
          [1673395200000, 19],
          [1673481600000, 15],
          [1673568000000, 23],
          [1673654400000, 14],
          [1673740800000, 6],
          [1673827200000, 4],
          [1673913600000, 3],
          [1674000000000, 5],
          [1674086400000, 11],
        ];
      } else if (chartType === "Developer Trend") {
        datas = [
          [1672444800000, 1],
          [1672531200000, 2],
          [1672617600000, 3],
          [1672704000000, 4],
          [1672790400000, 5],
          [1672876800000, 6],
          [1672963200000, 7],
          [1673049600000, 8],
          [1673136000000, 9],
          [1673222400000, 10],
          [1673308800000, 11],
          [1673395200000, 12],
          [1673481600000, 13],
          [1673568000000, 14],
          [1673654400000, 15],
          [1673740800000, 16],
          [1673827200000, 17],
          [1673913600000, 18],
          [1674000000000, 19],
          [1674086400000, 20],
        ];
      } else if (chartType === "Issues") {
        datas = [
          [1672444800000, 11],
          [1672531200000, 12],
          [1672617600000, 13],
          [1672704000000, 14],
          [1672790400000, 15],
          [1672876800000, 10],
          [1672963200000, 5],
          [1673049600000, 2],
          [1673136000000, 9],
          [1673222400000, 10],
          [1673308800000, 5],
          [1673395200000, 11],
          [1673481600000, 3],
          [1673568000000, 4],
          [1673654400000, 1],
          [1673740800000, 6],
          [1673827200000, 7],
          [1673913600000, 8],
          [1674000000000, 9],
          [1674086400000, 15],
        ];
      }
    } else {
      datas = [
        [1672444800000, 11],
        [1672531200000, 12],
        [1672617600000, 13],
        [1672704000000, 14],
        [1672790400000, 15],
        [1672876800000, 10],
        [1672963200000, 5],
        [1673049600000, 2],
        [1673136000000, 9],
        [1673222400000, 10],
        [1673308800000, 5],
        [1673395200000, 11],
        [1673481600000, 3],
        [1673568000000, 4],
        [1673654400000, 1],
        [1673740800000, 6],
        [1673827200000, 7],
        [1673913600000, 8],
        [1674000000000, 9],
        [1674086400000, 15],
      ];
    }
    const formattedData = () =>
      datas.map(item => ({
        x: item[0],
        y: item[1],
      }));
    return formattedData();
  };

  useEffect(() => {
    async function loadChart() {
      if (baseAsset) {
        const isMobile = window.innerWidth < 768;
        try {
          window[chartId].destroy();
        } catch (e) {
          // console.log(e);
        }

        let ctx;

        try {
          ctx = (
            document.getElementById(chartId) as HTMLCanvasElement
          ).getContext("2d");
        } catch (e) {
          // console.log(e);
        }

        let gradient;
        const isGainer = false;

        if (isGainer) {
          gradient = ctx?.createLinearGradient(0, 0, 0, isMobile ? 400 : 700);
          gradient?.addColorStop(0, "rgba(22,199,132,1)");
          gradient?.addColorStop(0.7, "rgba(21,25,41,0)");
        } else {
          gradient = ctx?.createLinearGradient(0, 0, 0, isMobile ? 400 : 700);
          gradient?.addColorStop(0, "rgba(234,57,67,1)");
          gradient?.addColorStop(0.7, "rgba(21,25,41,0)");
        }

        try {
          const Chart = (await import("chart.js")).default;
          window[chartId] = new Chart(ctx, {
            type: "line",
            data: {
              datasets: [
                {
                  data: getData(),
                  borderColor: isGainer ? "#0ECB81" : "#ea3943",
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  tension: 0.3,
                  fill: true,
                  backgroundColor: gradient,
                  pointRadius: 0,
                  pointHitRadius: 20,
                },
              ],
            },
            options: {
              hover: {mode: null},
              maintainAspectRatio: false,
              legend: {
                display: false,
              },
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              tooltips: false,
              animation: {
                duration: 750,
              },
              ticks: {
                source: "data",
              },
              scales: {
                yAxes: [
                  {
                    gridLines: {display: false},
                    display: true,
                    ticks: {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      type: "category",
                      beginAtZero: false,
                      font: {size: 20},
                      fontFamily: "Poppins",
                      maxTicksLimit: isMobile ? 6 : 8,
                      callback(tick: number) {
                        return getShortenedAmount(tick / dividor);
                      },
                    },
                  },
                ],
                xAxes: [
                  {
                    gridLines: {display: false},
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
                      maxRotation: 0,
                      minRotation: 0,
                      maxTicksLimit: 8,
                    },
                  },
                ],
              },
            },
          });
          const {
            chartArea: {left, right, top, bottom},
            scales,
          } = window[chartId];

          const handleMouseMove = e => {
            if (baseAsset && !isMobile) {
              crosshairLine(
                e,
                // TODO: fix this
                // unformattedHistoricalData[type][timeSelected],
                scales,
                ctx,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                {left, right, top, bottom},
                isGainer ? "#0ECB81" : "#ea3943",
                chartId,
                dividor,
              );
            }
          };

          window[chartId].canvas.onmousemove = handleMouseMove;

          const handleTouchMove = e => {
            const evt =
              typeof e.originalEvent === "undefined" ? e : e.originalEvent;
            const touch = evt?.touches[0] || evt?.changedTouches[0];
            if (baseAsset) {
              crosshairLine(
                {
                  offsetX: Math.floor(touch.pageX - left),
                  offsetY: Math.floor(touch.pageY - top) - 300,
                },
                // TODO: fix this
                // unformattedHistoricalData[type][timeSelected],
                scales,
                ctx,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                {left, right, top, bottom},
                isGainer ? "#0ECB81" : "#ea3943",
                chartId,
                dividor,
              );
            }
          };

          window[chartId].canvas.ontouchmove = handleTouchMove;
          window[chartId].canvas.onmouseout = () => {
            window[chartId].update(null);
            ctx.restore();
          };
          window[chartId].canvas.ontouchend = () => {
            window[chartId].update(null);
            ctx.restore();
          };
        } catch (e) {
          // console.log(e);
        }
      }
    }
    loadChart();
  }, [baseAsset, chartType]);

  return (
    <Flex direction="column" w="100%" mt="20px">
      {isGithub ? (
        <Flex direction="column" mt={["10px", "10px", "10px", "0px"]}>
          <Flex align="center" justify="space-between" w="100%" mb="10px">
            <Flex align="center" wrap="wrap">
              <TextLandingMedium>Github Activity</TextLandingMedium>
              <Icon
                as={BsGithub}
                mx="10px"
                w={["18px", "18px", "20px", "22px"]}
                h={["18px", "18px", "20px", "22px"]}
                color={text80}
              />
              <NextChakraLink
                href={baseAsset?.assets_social?.github}
                isExternal
                fontSize={["14px", "14px", "16px", "18px"]}
                color="blue"
              >
                random-name/random
              </NextChakraLink>
            </Flex>
            <Menu>
              <MenuButton
                sx={mainButtonStyle}
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {chartType}
              </MenuButton>
              <MenuList
                border={borders}
                boxShadow="1px 2px 13px 4px rgba(0,0,0,0.15)"
                bg={boxBg6}
                zIndex="2"
                py="0px"
                w="fit-content"
                minW="145px"
              >
                {types.map(type => (
                  <MenuItem
                    key={type}
                    bg={boxBg6}
                    h="100%"
                    transition="all 250ms ease-in-out"
                    _hover={{bg: "box_bg.9", color: text80}}
                    color={chartType === type ? text80 : text40}
                    fontWeight="400"
                    onClick={() => setChartType(type)}
                  >
                    {type}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>
      ) : (
        <TextLandingMedium mb="10px">Website Visitors</TextLandingMedium>
      )}
      <Flex
        justify="center"
        mt="20px"
        w="100%"
        align="center"
        position="relative"
        h="310px"
        {...props}
      >
        <canvas
          style={{
            margin: "auto 0px",
            zIndex: 1,
            WebkitUserSelect: "none",
          }}
          width="100%"
          id={chartId}
        />
      </Flex>{" "}
      {!isGithub ? (
        <Flex align="center" mr="15px" mt="10px">
          <Flex boxSize="10px" bg="green" borderRadius="full" />
          <TextLandingSmall ml="7.5px">Unique visitors</TextLandingSmall>
        </Flex>
      ) : null}
    </Flex>
  );
};
