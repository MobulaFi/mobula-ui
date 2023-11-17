import {Flex} from "@chakra-ui/react";
import {useContext} from "react";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {
  TextLandingMedium,
  TextLandingSmall,
  TextSmall,
} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {calculateDaysRemaining} from "../../../../utils";

export const CalendarEvent = () => {
  const {text80, hover, borders, text60, text40} = useColors();
  const {baseAsset} = useContext(BaseAssetContext);

  const getNextEvents = () => {
    const now = new Date().getTime();
    const nextEvent = baseAsset?.release_schedule?.filter(
      entry => entry[0] >= now,
    );
    const newEvents = nextEvent?.filter((_, i) => i < 7);
    if (newEvents?.length > 0) return newEvents;
    const prevEvents = baseAsset?.release_schedule?.filter(
      entry => entry[0] <= now,
    );
    return prevEvents;
  };

  const getDate = timestamp => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleString("default", {month: "short"});
    const year = date.getFullYear();
    return {day, month, year};
  };

  const sevenNextEvents = getNextEvents();

  const getTextFromDayLeft = daysLeft => {
    if (daysLeft < 0) return `${Math.abs(daysLeft)} days ago`;
    if (daysLeft < 1) return "Today";
    if (daysLeft === 1) return "Tomorrow";
    return `${daysLeft} days left`;
  };

  return (
    <>
      <TextLandingMedium color={text80} mt="25px" mb="20px">
        Unlocking Events
      </TextLandingMedium>
      {sevenNextEvents?.map(([timestamp, value, type]) => {
        const {day, month, year} = getDate(timestamp);
        const daysRemaining = calculateDaysRemaining(timestamp);
        const key = Object.keys(type)[0];
        const typeValue = Object.values(type)[0];
        const percentageOfSupply =
          ((typeValue as number) * 100) / (baseAsset.total_supply || 0);
        const formattedPercentage = percentage =>
          percentage.toString().includes("00")
            ? percentage.toFixed(3)
            : percentage.toFixed(2);
        const percentageOfSupplyFormatted =
          formattedPercentage(percentageOfSupply);
        const amountInPrice = value * (baseAsset?.price || 0);
        const percentageOfMC = formattedPercentage(
          (amountInPrice * 100) / (baseAsset?.market_cap || 0),
        );
        const dayLeftText = getTextFromDayLeft(daysRemaining);
        return (
          <Flex
            direction="column"
            py="10px"
            borderTop={borders}
            borderBottom={borders}
          >
            <Flex align="center">
              <Flex
                bg={hover}
                borderRadius="8px"
                direction="column"
                align="center"
                justify="center"
                py="10px"
                minH={["60px", "60px", "80px"]}
                minW={["60px", "60px", "80px"]}
              >
                <TextSmall color={text60}>{month}</TextSmall>
                <TextLandingSmall color={text80} fontWeight="600">
                  {day}
                </TextLandingSmall>
                <TextSmall color={text40}>{year}</TextSmall>
              </Flex>
              <Flex
                ml={["10px", "10px", "20px"]}
                justify="space-between"
                h="100%"
                w="100%"
                align="center"
              >
                <Flex direction="column">
                  <TextLandingSmall color={text80}>
                    Unlock of {getFormattedAmount(typeValue)}{" "}
                    {baseAsset?.symbol} - {percentageOfSupplyFormatted}% of
                    Total Supply
                  </TextLandingSmall>
                  <TextSmall color={text60}>
                    ${getFormattedAmount(amountInPrice)} ({percentageOfMC}% of
                    M.Cap)
                  </TextSmall>
                  <Flex
                    align="center"
                    h={["22px", "22px", "26px"]}
                    bg={hover}
                    px="8px"
                    borderRadius="full"
                    w="fit-content"
                    fontSize="12px"
                    fontWeight="500"
                    mt="10px"
                    color={text80}
                  >
                    {key}
                  </Flex>
                </Flex>
                <TextLandingSmall
                  fontWeight="500"
                  color={text80}
                  mr="10px"
                  textAlign="end"
                >
                  {dayLeftText}
                </TextLandingSmall>
              </Flex>
            </Flex>
          </Flex>
        );
      })}
    </>
  );
};
