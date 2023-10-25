import {Flex, Image} from '@chakra-ui/react';
import {
  TextExtraSmall,
  TextLandingSmall,
  TextSmall,
} from '../../../../../../UI/Text';
import {useColors} from '../../../../../../common/utils/color-mode';
import CryptoFearAndGreedChart from '../fear-greed/crypto-fear-greed';

export const Test = ({showPage}) => {
  const {text80, boxBg3, hover, text40} = useColors();

  //   const colors = [
  //     "green",
  //     "orange",
  //     "pink",
  //     "purple",
  //     "red",
  //     "teal",
  //     "yellow",
  //     "blue",
  //     "cyan",
  //     "gray",
  //   ];

  const getColors = (i: number, note: number) => {
    if (i > note) return hover;
    if (i < 2) return 'red';
    if (i < 5) return 'orange';
    if (i < 7) return 'yellow';
    return 'green';
  };

  const notes = [2.3, 7, 3];

  return (
    <Flex
      minW="100%"
      direction="column"
      w="200px"
      transform={`translateX(-${showPage * 100}%)`}
      transition="all 250ms ease-in-out"
      p="10px">
      <TextLandingSmall color={text80} mb="5px">
        Top Traded Coins
      </TextLandingSmall>
      <Flex w="100%" mt="12px" h="100%" direction="column" mb="10px" px="10px">
        {notes.map(note => (
          <Flex w="100%" align="center" justify="space-between" mb="12.5px">
            <Flex align="center">
              <Image
                src="/logo/bitcoin.png"
                boxSize="24px"
                borderRadius="full"
              />
              <Flex direction="column">
                <TextExtraSmall ml="10px" color={text80} fontWeight="500">
                  BTC
                </TextExtraSmall>
                <TextExtraSmall
                  mt="-2px"
                  ml="7.5px"
                  color={text40}
                  fontWeight="500">
                  1200 Trades
                </TextExtraSmall>
              </Flex>
            </Flex>

            <Flex w="53%" ml="auto">
              {Array.from({length: 10}).map((_, index) => (
                <Flex position="relative" w="10%">
                  <Flex
                    w="8px"
                    h="50px"
                    bg={boxBg3}
                    position="absolute"
                    left="-16%"
                    // transform="rotate(-20deg)"
                    zIndex="30"
                    top="-10px"
                  />
                  <Flex
                    key={note}
                    w="100%"
                    h="20px"
                    bg={getColors(index, note)}
                  />{' '}
                  {index === 9 ? (
                    <Flex
                      w="8px"
                      h="50px"
                      bg={boxBg3}
                      position="absolute"
                      right="-38%"
                      //   transform="rotate(-20deg)"
                      zIndex={2}
                      top="-10px"
                    />
                  ) : null}
                </Flex>
              ))}
            </Flex>
            <TextSmall color={text80} fontWeight="500" w="30px" textAlign="end">
              {note}
            </TextSmall>
          </Flex>
        ))}

        {/* <EChart
        data={(totalMarketCap as []) || []}
        timeframe="24H"
        width="100%"
        //   leftMargin={["20%", "12%"]}
        leftMargin={["0%", "0%"]}
        height={height}
        bg={isDarkMode ? "#151929" : "#F7F7F7"}
        type="Total Market Cap"
        noDataZoom
        noAxis
      /> */}
      </Flex>
    </Flex>
  );
};

export default CryptoFearAndGreedChart;
