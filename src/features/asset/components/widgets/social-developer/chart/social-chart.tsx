import {Button, Flex, FlexProps} from "@chakra-ui/react";
import dynamic from "next/dynamic";
import {useContext, useEffect} from "react";
import {
  TextLandingMedium,
  TextLandingSmall,
} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {timestamps} from "../../../../constant";
import {BaseAssetContext} from "../../../../context-manager";

const EChart = dynamic(() => import("./multi-echart"), {
  ssr: false,
});

export const MultiChart = ({
  chartId,
  dividor = 1,
  ...props
}: {
  chartId?: string;
  dividor?: number;
} & FlexProps) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {
    timeSelected,
    chartType,
    setTimeSelected,
    shouldLoadHistory,
    loadHistoryData,
  } = useContext(BaseAssetContext);
  const {borders, text80, hover, boxBg3, text40} = useColors();
  useEffect(() => {
    setTimeSelected("ALL");
  }, []);
  const twitter = baseAsset?.twitter_history || [];
  // const telegram = [];
  // const discord = [];

  return (
    <Flex direction="column" w="100%" mt="20px">
      <Flex align="center" justify="space-between" w="100%">
        <TextLandingMedium mb="10px">Socials Analytics</TextLandingMedium>
        <Flex
          h="38px"
          w="260px"
          p="2px"
          borderRadius="8px"
          bg={boxBg3}
          position="relative"
          zIndex={1}
          border={borders}
        >
          <Flex
            h="90%"
            top="50%"
            transform="translateY(-50%)"
            w="16.66%"
            transition="all 250ms ease-in-out"
            borderRadius="8px"
            position="absolute"
            bg={hover}
            left={`${
              (100 / timestamps.length) * timestamps.indexOf(timeSelected)
            }%`}
            ml={timestamps.indexOf(timeSelected) === 0 ? "2px" : "0px"}
            mr={
              timestamps.indexOf(timeSelected) === timestamps.length - 1
                ? "2px"
                : "0px"
            }
          />
          {timestamps.map(time => (
            <Button
              h="100%"
              key={time}
              isDisabled={time !== "ALL"}
              color={timeSelected === time ? text80 : text40}
              fontWeight="400"
              transition="all 400ms ease-in"
              w="16.66%"
              onClick={() => {
                if (shouldLoadHistory(chartType, time))
                  loadHistoryData(chartType, time);

                setTimeSelected(time);
              }}
            >
              {time}
            </Button>
          ))}
        </Flex>
      </Flex>
      <Flex
        justify="center"
        mt="110px"
        w="100%"
        align="center"
        position="relative"
        h="310px"
        mb="100px"
        {...props}
      >
        <EChart
          height={500}
          width={1000}
          data={twitter || []}
          timeframe={timeSelected}
        />
      </Flex>{" "}
      <Flex align="center" mt="10px">
        <Flex align="center" mr="15px">
          <Flex boxSize="10px" bg="green" borderRadius="full" />
          <TextLandingSmall ml="7.5px">Twitter followers</TextLandingSmall>
        </Flex>
        {/* <Flex align="center" mr="15px">
          <Flex boxSize="10px" bg="#64D1FF" borderRadius="full" />
          <TextLandingSmall ml="7.5px">Telegram users</TextLandingSmall>
        </Flex>
        <Flex align="center">
          <Flex boxSize="10px" bg="#4055A7" borderRadius="full" />
          <TextLandingSmall ml="7.5px">Discord users</TextLandingSmall>
        </Flex> */}
      </Flex>
    </Flex>
  );
};
