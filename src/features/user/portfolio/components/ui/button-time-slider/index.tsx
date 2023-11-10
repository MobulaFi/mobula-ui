import { Button, Flex, FlexProps } from "@chakra-ui/react";
import { useContext } from "react";
import { useColors } from "../../../../../../lib/chakra/colorMode";
import { PortfolioV2Context } from "../../../context-manager";

export const ButtonTimeSlider = ({
  isChart = false,
  ...props
}: { isChart?: boolean } & FlexProps) => {
  const timeframes = ["24H", "7D", "30D", "1Y", "ALL"];
  const { timeframe, setTimeframe } = useContext(PortfolioV2Context);
  const { boxBg6, text40, text80, hover } = useColors();

  const getPosition = (time: string) => {
    if (time === "24H") return "4px";
    if (time === "7D") return "20%";
    if (time === "30D") return "40%";
    if (time === "1Y") return "60%";
    return "calc(80% - 4px)";
  };

  return (
    <Flex
      h="38px"
      zIndex="1"
      align="center"
      bg={boxBg6}
      position="relative"
      px="4px"
      mb={isChart ? ["0px", "0px", "70px"] : "0px"}
      borderRadius="8px"
      w={["100%", "fit-content"]}
      {...props}
    >
      <Flex
        w={["20%", "40px"]}
        h="30px"
        bg={hover}
        borderRadius="6px"
        position="absolute"
        transition="all 250ms ease-in-out"
        left={getPosition(timeframe)}
      />
      {timeframes.map((time) => (
        <Button
          h="30px"
          w={["20%", "40px"]}
          fontSize={["12px", "12px", "13px", "14px"]}
          color={timeframe === time ? text80 : text40}
          fontWeight="400"
          transition="all 250ms ease-in-out"
          onClick={() => {
            setTimeframe(time);
          }}
        >
          <Flex w="100%" h="100%" align="center" justify="center">
            {" "}
            {time}
          </Flex>
        </Button>
      ))}
    </Flex>
  );
};
