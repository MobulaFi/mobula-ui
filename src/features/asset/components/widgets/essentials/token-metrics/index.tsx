import {ChevronDownIcon, ChevronUpIcon} from "@chakra-ui/icons";
import {
  Button,
  Collapse,
  Flex,
  PlacementWithLogical,
  ResponsiveValue,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import {useContext, useState} from "react";
// eslint-disable-next-line import/no-cycle
import {formatAmount} from "../../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../../UI/Text";
import {NextChakraLink} from "../../../../../../../common/components/links";
import {InfoPopup} from "../../../../../../../common/components/popup-hover";
import {pushData} from "../../../../../../../common/data/utils";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {Metrics} from "../../../../models";
import {FlexBorderBox} from "../../../../style";

export const TokenMetrics = ({
  isMobile,
  ...props
}: {
  isMobile?: boolean;
  [props: string]: any;
}) => {
  const [showMore, setShowMore] = useState(false);
  const {baseAsset} = useContext(BaseAssetContext);
  const {borders, text100, hover, boxBg6, boxBg3, text80, text60} = useColors();
  const metrics: Metrics[] = [
    {
      title: "Total Volume (24h)",
      value:
        (baseAsset?.off_chain_volume || 0) + (Number(baseAsset?.volume) || 0),
      info: "The Total Volume is the sum of the CEX & DEX Volume (24h)",
    },
    {
      title: "Market Cap",
      value: baseAsset?.market_cap,
      info: "The Market Cap is the product of the current price and the total supply of the asset.",
    },
    {
      title: "Fully Diluted Val.",
      value: baseAsset?.market_cap_diluted || "-",
      info: "The Diluted Market Cap is the Market Cap including all locked tokens.",
    },
    {
      title: "CEX Volume (24h)",
      value: baseAsset?.off_chain_volume,
      info: "The CEX Volume is the total amount worth of asset traded on centralized exchanges in the last 24 hours.",
    },
    {
      title: "DEX Volume (24h)",
      value: baseAsset?.volume,
      info: "The DEX Volume is the total amount worth of asset traded on decentralized exchanges (Uniswap V2-forks only yet) in the last 24 hours.",
    },
    {
      title: "Liquidity",
      value: baseAsset?.liquidity,
      info: "The Liquidity is the total amount locked in the asset's on-chain liquidity pools.",
    },
    {
      title: "Circ. Supply",
      value: baseAsset?.circulating_supply,
      info: "The Circulating Supply is the total amount of tokens in circulation.",
    },
    {
      title: "Total Supply",
      value: baseAsset?.total_supply || "-",
      info: "The Total Supply is the total amount of tokens that can be created.",
    },
    {
      title: "Rank",
      value: baseAsset?.rank,
      info: "The Rank is the position of the asset in the ranking of all assets by market cap.",
    },
  ];
  const [isLargerThan991] = useMediaQuery("(min-width: 991px)", {
    ssr: true,
    fallback: false,
  });
  return (
    <Flex
      {...FlexBorderBox}
      bg={[boxBg3]}
      border={["none", "none", "none", borders]}
      w="100%"
      mx="auto"
      borderRadius={["0px ", "0px ", "0px ", "16px"]}
      {...props}
    >
      <Flex
        fontSize={["16px", "16px", "16px", "18px"]}
        fontWeight="500"
        color={text80}
        mb="10px"
        align="center"
        px={["2.5%", "2.5%", "2.5%", "0px"]}
        pt={["15px", "15px", "0px"]}
      >
        Token Metrics
        <Flex ml="auto" fontSize="12px">
          Need data?
          <NextChakraLink
            href="https://developer.mobula.fi/reference/market-api?utm_source=website&utm_medium=asset&utm_campaign=asset"
            target="_blank"
            rel="noreferrer"
            ml="5px"
            color="blue"
            onClick={() => {
              pushData("API Clicked");
            }}
          >
            Our API
          </NextChakraLink>
        </Flex>
      </Flex>

      <Collapse startingHeight={isLargerThan991 ? "100%" : 129} in={showMore}>
        {metrics.map((entry, i) => {
          const isNotDollar =
            entry.title.includes("Supply") || entry.title.includes("Rank");
          const noLiquidity = entry.title === "Liquidity" && entry.value === 0;
          return (
            <Flex
              justify="space-between"
              align="center"
              borderTop={i === 0 ? "none" : borders}
              py="10px"
              px={["2.5%", "2.5%", "2.5%", "0px"]}
              pb={metrics.length - 1 === i ? "0px" : "10px"}
            >
              <Flex align="center">
                <TextSmall
                  color={text60}
                  fontWeight="500"
                  fontSize={["13px", "13px", "13px", "14px"]}
                  opacity={noLiquidity ? 0.5 : 1}
                >
                  {entry.title}
                </TextSmall>
                <InfoPopup
                  info={entry.info}
                  mb="3px"
                  cursor="pointer"
                  position={
                    "right" as PlacementWithLogical & ResponsiveValue<any>
                  }
                  noClose
                />
              </Flex>
              <Flex align="center" opacity={noLiquidity ? 0.5 : 1}>
                <Text fontSize="13px" fontWeight="500" color={text80}>
                  {(!isNotDollar ? "$" : "") + formatAmount(entry.value)}
                </Text>
              </Flex>
            </Flex>
          );
        })}
      </Collapse>

      {isMobile ? (
        <Button
          color={text80}
          fontWeight="500"
          bg={boxBg6}
          h="30px"
          mt={[showMore ? "10px" : "0px", showMore ? "10px" : "0px", "0px"]}
          borderRadius={["0px", "0px", "8px"]}
          fontSize={["12px", "12px", "13px", "14px"]}
          onClick={() => setShowMore(!showMore)}
          _hover={{bg: hover, color: text100}}
          transition="all 250ms ease-in-out"
          w="100%"
        >
          {showMore ? (
            <>
              Less Data
              <ChevronUpIcon fontSize="14px" ml="5px" />
            </>
          ) : (
            <>
              More Data
              <ChevronDownIcon fontSize="14px" ml="5px" />
            </>
          )}
        </Button>
      ) : null}
    </Flex>
  );
};
