import {Flex, Icon, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {SiConvertio} from "react-icons/si";
import {TextLandingSmall, TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BoxContainer} from "../../../../../common/components/box-container";

function getCountdown(targetDate) {
  const target = new Date(targetDate);
  const now = new Date();
  const difference = target.getTime() - now.getTime();

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export const LaunchInformation = ({token}) => {
  const {text80, boxBg6, borders, text40} = useColors();

  const [timeLeft, setTimeLeft] = useState(
    getCountdown(token?.tokenomics?.launch?.date),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getCountdown(token?.tokenomics?.launch?.date));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timeBoxStyle = {
    h: ["35px", "35px", "40px"],
    px: ["8px", "12px"],
    w: "fit-content",
    bg: boxBg6,
    border: borders,
    borderRadius: "8px",
    align: "center",
    justify: "center",
    minW: ["40px", "45px", "55px"],
  };

  const getDisplay = () => {
    if (token?.tokenomics.launch?.vsToken || token?.tokenomics.launch?.exchange)
      return "flex";
    return "none";
  };

  return (
    <BoxContainer
      mb="20px"
      position="relative"
      transition="all 300ms ease-in-out"
      p={["10px", "10px", "15px", "15px 20px"]}
      borderRadius={["0px", "16px"]}
      display={getDisplay()}
    >
      <Flex
        align="center"
        pb={["10px", "10px", "15px", "20px"]}
        borderBottom={borders}
      >
        <Icon as={SiConvertio} color="blue" />
        <Text fontSize={["14px", "14px", "16px", "18px"]} ml="10px">
          Launch Information
        </Text>
      </Flex>
      <Flex align="center" justify="space-between" mt="20px" mb="20px">
        <Flex w="fit-content" direction="column" h="fit-content">
          <Flex
            align={["start", "center"]}
            direction={["column", "row"]}
            mb="15px"
          >
            <TextLandingSmall mr="5px" color={text40}>
              Exchange:
            </TextLandingSmall>
            <TextLandingSmall color={text80} fontWeight="500">
              {token?.tokenomics.launch?.exchange}
            </TextLandingSmall>
          </Flex>
          <Flex align={["start", "center"]} direction={["column", "row"]}>
            <TextLandingSmall mr="5px" color={text40}>
              Pair:
            </TextLandingSmall>
            <TextLandingSmall color={text80} fontWeight="500">
              {`${token?.symbol}/${token?.tokenomics.launch?.vsToken}`}
            </TextLandingSmall>
          </Flex>
        </Flex>
        <Flex
          w={["fit-content", "fit-content", "50%"]}
          direction="column"
          align="center"
        >
          <TextLandingSmall color={text80} fontWeight="500" mb="15px">
            Launch in:
          </TextLandingSmall>
          <Flex>
            <Flex {...timeBoxStyle} mr="10px">
              <TextSmall>{timeLeft.days}d</TextSmall>
            </Flex>

            <Flex {...timeBoxStyle} mr="10px">
              <TextSmall>{timeLeft.hours}h</TextSmall>
            </Flex>
            <Flex {...timeBoxStyle} mr="10px">
              <TextSmall>{timeLeft.minutes}m</TextSmall>
            </Flex>
            <Flex {...timeBoxStyle} mr="10px">
              <TextSmall>{timeLeft.seconds}s</TextSmall>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </BoxContainer>
  );
};
