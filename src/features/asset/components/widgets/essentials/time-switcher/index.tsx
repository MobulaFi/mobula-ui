import {Button, Flex} from "@chakra-ui/react";
import {useContext} from "react";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {timestamps} from "../../../../constant";
import {BaseAssetContext} from "../../../../context-manager";

export const TimeSwitcher = ({...props}) => {
  const {
    timeSelected,
    chartType,
    setUserTimeSelected,
    shouldLoadHistory,
    loadHistoryData,
  } = useContext(BaseAssetContext);
  const {text80, hover, borders, text40, boxBg3} = useColors();

  const getPosition = () => {
    if (timeSelected === "24H") return "calc(0% + 1px)";
    if (timeSelected === "ALL") return "calc(83.34% - 1px)";
    return `${(100 / timestamps.length) * timestamps.indexOf(timeSelected)}%`;
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      mt={["10px", "10px", "0px", "0px"]}
      mb={["25px", "25px", "0px", "0px"]}
      ml={["0px", "0px", "auto", "auto"]}
      zIndex={2}
      w={["95%", "95%", "fit-content", "fit-content"]}
      mx={["auto", "auto", "0px", "0px"]}
      {...props}
    >
      <Flex
        h="34px"
        w={["100%", "100%", "230px", "230px"]}
        p="2px"
        borderRadius="8px"
        bg={boxBg3}
        position="relative"
        border={borders}
      >
        <Flex
          h="90%"
          top="50%"
          transform="translateY(-50%)"
          w="16.66%"
          transition="all 250ms ease-in-out"
          borderRadius="4px"
          position="absolute"
          bg={hover}
          left={getPosition()}
        />
        {timestamps.map(time => (
          <Button
            h="100%"
            key={time}
            color={timeSelected === time ? text80 : text40}
            fontWeight="500"
            transition="all 400ms ease-in"
            w="16.66%"
            fontSize={["12px", "12px", "13px", "14px"]}
            onClick={() => {
              if (shouldLoadHistory(chartType, time))
                loadHistoryData(chartType, time);

              setUserTimeSelected(time);
            }}
          >
            {time}
          </Button>
        ))}
      </Flex>
    </Flex>
  );
};
