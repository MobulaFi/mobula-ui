import {Button, Flex, Icon} from "@chakra-ui/react";
import Cookies from "js-cookie";
import {useContext, useEffect} from "react";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {MdCandlestickChart, MdShowChart} from "react-icons/md";
import {pushData} from "../../../../../../../common/data/utils";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {CompareButtons} from "../../../../../../User/Portfolio/components/chart/compare-buttons";
import {ComparePopover} from "../../../../../../User/Portfolio/components/chart/compare-popover";
import {BaseAssetContext} from "../../../../context-manager";
import {ChartType} from "../../../../models";
import {TimeSwitcher} from "../time-switcher";

export const ChartHeader = () => {
  const {
    timeSelected,
    chartType,
    shouldLoadHistory,
    loadHistoryData,
    setChartType,
    activeChart,
    untracked,
    setUserActiveChart,
    setHideTx,
    hideTx,
    transactions,
    setComparedEntities,
    comparedEntities,
  } = useContext(BaseAssetContext);
  const {boxBg3, text40, text80, borders, hover} = useColors();

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getPosition = () => {
    if (chartType === "price") return "calc(0% + 1.5px)";
    return "calc(50% - 1px)";
  };

  useEffect(() => {
    const hideTxCookie = Cookies.get("hideTx");
    if (!hideTxCookie || JSON.parse(hideTxCookie) !== hideTx) {
      Cookies.set("hideTx", JSON.stringify(hideTx));
    }
  }, [hideTx]);

  return (
    <>
      <Flex
        align="center"
        justify="space-between"
        mb={[
          activeChart === "Trading view" ? "0px" : "0px",
          activeChart === "Trading view" ? "0px" : "0px",
          activeChart === "Trading view" ? "10px" : "10px",
          activeChart === "Trading view" ? "10px" : "0px",
        ]}
        w={["95%", "95%", "100%", "100%"]}
        mx="auto"
        mt={["5px", "5px", "10px", "0px"]}
        zIndex={5}
      >
        <Flex
          align="center"
          justify={["space-between", "start"]}
          w={["100%", "100%", "100%"]}
          overflowX="scroll"
        >
          <Flex
            h="30px"
            w={["160px", "180px"]}
            p="2px"
            borderRadius="8px"
            bg={boxBg3}
            border={borders}
            position="relative"
            mr="7.5px"
          >
            <Flex
              h="90%"
              top="50%"
              transform="translateY(-50%)"
              w="50%"
              transition="all 250ms ease-in-out"
              borderRadius="8px"
              position="absolute"
              bg={hover}
              left={getPosition()}
            />
            <Button
              h="100%"
              w="50%"
              color={chartType === "price" ? text80 : text40}
              fontWeight="400"
              fontSize={["12px", "12px", "13px", "14px"]}
              isDisabled={activeChart === "Trading view"}
              onClick={() => {
                const newChartType = "price" as ChartType;
                if (shouldLoadHistory(newChartType, timeSelected))
                  loadHistoryData(newChartType, timeSelected);
                setChartType(newChartType);
              }}
            >
              {capitalizeFirstLetter("price")}
            </Button>

            <Button
              h="100%"
              w="50%"
              isDisabled
              color={chartType === "market_cap" ? text80 : text40}
              fontWeight="400"
              fontSize={["12px", "12px", "13px", "14px"]}
              // isDisabled={
              //   (untracked.isUntracked && !untracked.showChart) ||
              //   activeChart === "Trading view"
              // }
              onClick={() => {
                const newChartType = "market_cap" as ChartType;
                if (shouldLoadHistory(newChartType, timeSelected))
                  loadHistoryData(newChartType, timeSelected);

                setChartType(newChartType);
              }}
            >
              {capitalizeFirstLetter("market cap")}
            </Button>
          </Flex>
          <Flex
            h="30px"
            w="70px"
            p="2px"
            borderRadius="8px"
            bg={boxBg3}
            border={borders}
            position="relative"
          >
            <Flex
              h="90%"
              top="50%"
              transform="translateY(-50%)"
              w="50%"
              transition="all 250ms ease-in-out"
              borderRadius="8px"
              position="absolute"
              bg={hover}
              left={
                activeChart !== "Trading view"
                  ? "calc(0% - 1px)"
                  : "calc(50% - 1px)"
              }
              ml={activeChart !== "Trading view" ? "2px" : "0px"}
              mr={activeChart !== "Trading view" ? "0px" : "0px"}
            />
            <Button
              h="100%"
              fontSize={["12px", "12px", "13px", "14px"]}
              w="50%"
              color={activeChart === "Linear" ? text80 : text40}
              fontWeight="400"
              onClick={() => {
                pushData("Chart Button", {
                  "Chart Type": "Linear",
                });
                setUserActiveChart("Linear");
              }}
            >
              <Icon as={MdShowChart} fontSize="20px" />
            </Button>{" "}
            <Button
              h="100%"
              w="50%"
              color={activeChart === "Trading view" ? text80 : text40}
              fontSize={["12px", "12px", "13px", "14px"]}
              fontWeight="400"
              isDisabled={untracked.isUntracked}
              onClick={() => {
                pushData("Chart Button", {
                  "Chart Type": "Trading view",
                });
                setUserActiveChart("Trading view");
              }}
            >
              <Icon as={MdCandlestickChart} fontSize="20px" />
            </Button>
          </Flex>
          {transactions.length > 0 ? (
            <Button
              h="30px"
              fontSize={["12px", "12px", "13px", "14px"]}
              variant="outlined_grey"
              px="10px"
              ml="10px"
              color={text80}
              fontWeight="400"
              onClick={() => {
                setHideTx(prev => !prev);
              }}
            >
              {hideTx ? (
                <>
                  <Icon
                    as={AiOutlineEye}
                    fontSize={["16px", "16px", "18px"]}
                    mr="5px"
                  />{" "}
                  Show tx
                </>
              ) : (
                <>
                  {" "}
                  <Icon
                    as={AiOutlineEyeInvisible}
                    fontSize={["16px", "16px", "18px"]}
                    mr="5px"
                  />
                  Hide tx
                </>
              )}
            </Button>
          ) : null}
        </Flex>
        <ComparePopover
          setComparedEntities={setComparedEntities}
          comparedEntities={comparedEntities}
          ml="10px"
          mb={["4px", "4px", "0px"]}
        />
        {activeChart !== "Trading view" ? (
          <TimeSwitcher display={["none", "none", "flex", "flex"]} />
        ) : null}
      </Flex>
      {activeChart === "Trading view" ? null : (
        <CompareButtons
          buttonH="30px"
          comparedEntities={comparedEntities}
          setComparedEntities={setComparedEntities}
          noMaxW
        />
      )}
    </>
  );
};
