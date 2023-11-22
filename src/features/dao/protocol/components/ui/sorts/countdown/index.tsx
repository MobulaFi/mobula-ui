import {Box, BoxProps, Flex, Icon} from "@chakra-ui/react";
import {useState} from "react";
import {FaHourglassEnd, FaHourglassHalf} from "react-icons/fa";
import {TextLandingSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {TokenDivs} from "../../../../models";

export const Countdown = ({token, ...props}: {token: TokenDivs} & BoxProps) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const {text80} = useColors();

  setInterval(() => {
    const now = Date.now();
    const distance = Math.max((token.lastUpdate + 5 * 60) * 1000 - now, 0);
    setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
  }, 1000);

  return (
    <Box {...props}>
      <Flex align="center" justify="space-between" px="20px" pt="15px">
        <TextLandingSmall
          color={text80}
          fontWeight="500"
          fontSize={["14px", "14px", "16px"]}
        >
          Cast your vote
        </TextLandingSmall>
        <Flex align="center" ml="auto">
          {seconds + minutes === 0 ||
          (Number.isNaN(minutes) && Number.isNaN(seconds)) ? (
            <>
              <Icon
                as={FaHourglassEnd}
                mr="10px"
                fontSize="14px"
                color={text80}
              />
              <TextLandingSmall color={text80}>Vote now</TextLandingSmall>
            </>
          ) : (
            <>
              <Icon
                as={FaHourglassHalf}
                mr="10px"
                fontSize="14px"
                color={text80}
              />
              <TextLandingSmall color={text80}>
                {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
              </TextLandingSmall>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
