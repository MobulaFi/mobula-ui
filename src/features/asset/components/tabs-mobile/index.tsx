import {ChevronDownIcon} from "@chakra-ui/icons";
import {Button, Flex} from "@chakra-ui/react";
import {useContext} from "react";
import {useColors} from "../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../context-manager";

export const TabsMobile = ({activeTab}) => {
  const {activeMetric, setActiveMetric, setShowMobileMetric, showMobileMetric} =
    useContext(BaseAssetContext);
  const metricsMain = ["Metrics", "ROI/Holdings", "Core Actors"];
  const metricsSocialDev = ["Social Infos", "Github Infos"];
  const {text80, text40, borders, text10, bordersActive, boxBg6, hover} =
    useColors();
  const metricsMarket = [
    "Price-in-time",
    "Buy/Sell Spread",
    "Liquidity Chain",
    "Liquidity Asset",
  ];

  const getMetricsToShow = () => {
    if (activeTab === "Market") {
      return metricsMarket;
    }
    if (activeTab === "Social & Developer") {
      return metricsSocialDev;
    }
    return metricsMain;
  };

  return (
    <Flex direction="column" display={["flex", "flex", "flex", "none"]}>
      <Flex
        align="center"
        justify="space-between"
        h="40px"
        borderTop={borders}
        borderBottom={borders}
      >
        <Flex
          align="center"
          overflowX="scroll"
          className="scroll"
          position="relative"
          w="100%"
          h="100%"
        >
          {getMetricsToShow()?.map((metric, i) => (
            <Flex align="center">
              <Button
                fontWeight="400"
                color={activeMetric === metric ? text80 : text40}
                onClick={() => {
                  if (activeMetric === metric) {
                    setShowMobileMetric(!showMobileMetric);
                  } else setShowMobileMetric(true);
                  setActiveMetric(metric);
                }}
                _hover={{color: text80}}
                mr={i === getMetricsToShow().length - 1 ? "15px" : "0px"}
              >
                {metric}
              </Button>
              {i !== getMetricsToShow().length - 1 ? (
                <Flex h="15px" w="2px" bg={text10} mx="15px" />
              ) : null}
            </Flex>
          ))}
          <Button
            boxSize="25px"
            minW="25px"
            position="sticky"
            ml="auto"
            right="0px"
            bg={boxBg6}
            border={borders}
            borderRadius="8px"
            _hover={{
              bg: hover,
              border: bordersActive,
            }}
            transition="all 250ms ease-in-out"
            onClick={() => setShowMobileMetric(!showMobileMetric)}
          >
            <ChevronDownIcon />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
