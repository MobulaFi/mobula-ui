import {Button, Flex, Text} from "@chakra-ui/react";
import {useCallback, useContext, useEffect} from "react";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {
  TextExtraSmall,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";

export const NextUnlockEvent = () => {
  const {text80, boxBg3, text60, borders, hover} = useColors();
  const {baseAsset, setTimeRemaining, timeRemaining} =
    useContext(BaseAssetContext);

  const getNextUnlock = useCallback(() => {
    const now = new Date().getTime();
    const nextEvent = baseAsset?.release_schedule?.find(
      entry => entry[0] > now,
    );
    if (nextEvent) {
      return {
        totalAmount: nextEvent[1],
        date: nextEvent[0],
        percentageOfSupply: (
          (nextEvent[1] / (baseAsset?.total_supply || 1)) *
          100
        ).toFixed(3),
      };
    }
    return {
      totalAmount: 0,
      date: null,
      percentageOfSupply: 0,
    };
  }, [baseAsset?.release_schedule, baseAsset?.total_supply]);

  const {totalAmount, date, percentageOfSupply} = getNextUnlock();

  const timeBoxStyle = {
    align: "center",
    justify: "center",
    w: "57.5px",
    h: "50px",
    borderRadius: "8px",
    bg: hover,
    mb: "5px",
    fontWeight: "500",
  };

  const getPercentageFromMarketCap = () => {
    const amountUSD = totalAmount * (baseAsset?.price || 0);
    const percentage = (100 / (baseAsset?.market_cap || 1)) * amountUSD;
    return percentage.toFixed(2);
  };

  const percentageOfMC = getPercentageFromMarketCap();
  const getZero = number => (number < 10 ? `0${number}` : number);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const timeDifference = date - now;

      if (timeDifference <= 0) {
        clearInterval(intervalId);
      } else {
        const days = getZero(
          Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        );
        const hours = getZero(
          Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
        );
        const minutes = getZero(
          Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
        );
        const seconds = getZero(
          Math.floor((timeDifference % (1000 * 60)) / 1000),
        );

        setTimeRemaining({days, hours, minutes, seconds});
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  if (date)
    return (
      <Flex
        p="20px"
        borderRadius={["16px"]}
        border={[borders]}
        bg={boxBg3}
        mb="10px"
        w="100%"
        mx="auto"
        mt={["10px", "10px", "10px", "0px"]}
        direction="column"
      >
        <Flex direction="column">
          <Flex direction="column">
            <Text
              fontSize={["16px", "16px", "16px", "18px"]}
              fontWeight="500"
              color={text80}
              textAlign={["center", "center", "center", "left"]}
            >
              Next Unlock Event
            </Text>
          </Flex>
          <Flex
            align="center"
            w="100%"
            justify="space-between"
            maxW="300px"
            mx="auto"
            mt="15px"
          >
            <Flex direction="column">
              <Flex {...timeBoxStyle}>{timeRemaining.days}</Flex>
              <TextExtraSmall textAlign="center">Days</TextExtraSmall>
            </Flex>
            <Flex direction="column">
              <Flex {...timeBoxStyle}>{timeRemaining.hours}</Flex>
              <TextExtraSmall textAlign="center">Hours</TextExtraSmall>
            </Flex>
            <Flex direction="column">
              <Flex {...timeBoxStyle}>{timeRemaining.minutes}</Flex>
              <TextExtraSmall textAlign="center">Min</TextExtraSmall>
            </Flex>
            <Flex direction="column">
              <Flex {...timeBoxStyle}>{timeRemaining.seconds}</Flex>
              <TextExtraSmall textAlign="center">Sec</TextExtraSmall>
            </Flex>
          </Flex>
        </Flex>
        <TextLandingSmall
          fontWeight="500"
          color={text80}
          mt="10px"
          textAlign={["center", "center", "center", "left"]}
        >
          Unlock of {getFormattedAmount(totalAmount)} {baseAsset?.symbol} (
          {percentageOfSupply}% of Total Supply)
        </TextLandingSmall>
        <TextSmall
          mt="5px"
          color={text60}
          textAlign={["center", "center", "center", "left"]}
        >
          ${getFormattedAmount(totalAmount * (baseAsset?.price || 0))} (
          {percentageOfMC}% of M.Cap)
        </TextSmall>
        <Button
          bg={hover}
          w="100%"
          h="40px"
          borderRadius="4px"
          mt="20px"
          color={text80}
          fontWeight="500"
          border={borders}
          maxW="300px"
          isDisabled
          mx="auto"
        >
          Set an alert for this event
        </Button>
      </Flex>
    );
  return null;
};
