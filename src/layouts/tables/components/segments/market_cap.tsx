import {
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import {
  formatAmount,
  getFormattedAmount,
  getTokenPercentage,
} from "@utils/formaters";
import { TextSmall } from "components/fonts";
import { useColors } from "lib/chakra/colorMode";
import { Segment } from "../segment";

export const MarketCapSegment = ({ token, display, metricsChanges }) => {
  const { text80, text10, text60, text20, borders, hover } = useColors();
  const { onToggle, onClose, isOpen } = useDisclosure();

  const marketMoveColor = () => {
    if (display === "Market Cap") {
      if (metricsChanges.market_cap === true) return "green";
      if (metricsChanges.market_cap === false) return "red";
    }
    return text80;
  };

  const getMarketCapFromType = () => {
    if (display === "Market Cap" && token.market_cap)
      return `$${getFormattedAmount(token?.market_cap)}`;
    if (display === "Full. Dil. Valuation" && token.market_cap_diluted)
      return `${getFormattedAmount(token.market_cap_diluted)}`;
    if (display === "Circ. Supply" && token.circulating_supply)
      return `${getFormattedAmount(token.circulating_supply)}`;
    if (display === "Liquidity" && token.liquidity)
      return `$${getFormattedAmount(token.liquidity)}`;
    return "-";
  };

  const getPercentage = () => {
    const parsedCirculating = parseFloat(token?.circulating_supply);
    const parsedMax = parseFloat(token?.max_supply);
    if (parsedCirculating && parsedMax) {
      const percentage = (parsedCirculating / parsedMax) * 100;
      return percentage;
    }
    return 0;
  };

  return (
    <Segment>
      {display === "Circ. Supply" ? (
        <Popover
          isOpen={isOpen}
          onClose={onClose}
          placement="bottom"
          closeOnBlur={false}
        >
          <PopoverTrigger>
            <Flex
              direction="column"
              align="end"
              w="100%"
              h="100%"
              onMouseEnter={() => {
                if (token?.circulating_supply < token?.max_supply) onToggle();
              }}
              onMouseLeave={() => onClose()}
            >
              <TextSmall color={marketMoveColor()} mb="5px">
                {`${getMarketCapFromType()} ${token?.symbol}`}
              </TextSmall>
              {(getPercentage() || 0) > 0 &&
              token?.circulating_supply < token?.max_supply ? (
                <Flex w="100%" bg={text10} h="6px" borderRadius="full">
                  <Flex
                    w={`${getPercentage()}%`}
                    bg={text20}
                    h="100%"
                    borderRadius="full"
                  />
                </Flex>
              ) : null}{" "}
            </Flex>
          </PopoverTrigger>
          <PopoverContent
            borderRadius="8px"
            border={borders}
            bg={hover}
            w="fit-content"
          >
            <PopoverArrow bg={hover} />
            <PopoverBody>
              <Flex direction="column" align="center">
                <Flex justify="space-between" align="center" w="100%">
                  <Text
                    color={text80}
                    mb="5px"
                    fontSize="13px"
                    fontWeight="500"
                    mr="10px"
                  >
                    Circulating supply
                  </Text>
                  <Text color={text60} mb="5px" fontSize="13px">
                    {`${formatAmount(token?.circulating_supply)} ${
                      token?.symbol
                    }`}
                  </Text>
                </Flex>
                <Flex justify="space-between" align="center" w="100%">
                  <Text
                    color={text80}
                    mb="5px"
                    fontSize="13px"
                    fontWeight="500"
                    mr="10px"
                  >
                    Max supply
                  </Text>
                  <Text color={text60} mb="5px" fontSize="13px">
                    {`${formatAmount(token?.max_supply)} ${token?.symbol}`}
                  </Text>
                </Flex>
                {token?.total_supply !== token?.max_supply ? (
                  <Flex justify="space-between" align="center" w="100%">
                    <Text
                      color={text80}
                      mb="5px"
                      fontSize="13px"
                      fontWeight="500"
                      mr="10px"
                    >
                      Total supply
                    </Text>
                    <Text color={text60} mb="5px" fontSize="13px">
                      {`${formatAmount(token?.total_supply)} ${token?.symbol}`}
                    </Text>
                  </Flex>
                ) : null}
                <Flex h="1px" w="100%" bg={text10} my="5px" />
                <Flex justify="space-between" align="center" w="100%">
                  <Text
                    color={text80}
                    mb="5px"
                    fontSize="13px"
                    fontWeight="500"
                  >
                    Percentage
                  </Text>
                  <Text color={text60} mb="5px" fontSize="13px">
                    {`${getTokenPercentage(
                      ((token?.circulating_supply || 0) * 100) /
                        (token?.max_supply || 0)
                    )}%`}
                  </Text>
                </Flex>
                <Flex w="100%" bg={text10} h="6px" borderRadius="full">
                  <Flex
                    w={`${getPercentage()}%`}
                    bg={text20}
                    h="100%"
                    borderRadius="full"
                  />
                </Flex>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      ) : (
        <TextSmall color={marketMoveColor()} fontWeight="500">
          {getMarketCapFromType()}
        </TextSmall>
      )}
    </Segment>
  );
};
