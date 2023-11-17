import {Flex} from "@chakra-ui/react";
import {useContext} from "react";
import {TextLandingMedium, TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../context-manager";
import {AllTime} from "./ath-atl";
import {BuySellSpread} from "./buy-sell-spread";
import {Liquidity} from "./liquidity";
import {PriceInTime} from "./price-time";
import {TokenVersusMarket} from "./token-versus-market";
import {TradingPairs} from "./trading-pair";

export const Market = () => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text60} = useColors();
  return (
    <Flex
      mt={["0px", "0px", "0px", "20px"]}
      direction={["column-reverse", "column-reverse", "column-reverse", "row"]}
    >
      <Flex
        direction="column"
        maxW="990px"
        w={["100%", "100%", "100%", "calc(100% - 345px)"]}
        mr={["0px", "0px", "0px", "25px"]}
      >
        <TradingPairs />
        <TokenVersusMarket />
        <Flex
          w={["95%", "95%", "100%", "100%"]}
          mx="auto"
          direction="column"
          mt={["30px", "30px", "50px"]}
        >
          <TextLandingMedium mb="10px">
            More about {baseAsset.name} trading pairs
          </TextLandingMedium>
          <TextSmall color={text60}>
            Mobula aggregates trading pairs directly from the blockchain as well
            as from all CEX to give you the most accurate and up to date
            information. Data is refreshed in real time.
          </TextSmall>
        </Flex>
        <Flex
          w={["95%", "95%", "100%", "100%"]}
          mx="auto"
          direction="column"
          mt={["30px", "30px", "50px"]}
        >
          <TextLandingMedium mb="10px">
            More about {baseAsset.name} vs Market
          </TextLandingMedium>

          <TextSmall color={text60}>
            {baseAsset.name} is compared to market categories & other crypto
            assets over time to give an overview of its performance relative to
            the overall market, and not just its price, especially useful during
            high volatility periods.
          </TextSmall>
        </Flex>
        <Flex display={["flex", "flex", "flex", "none"]} direction="column">
          <BuySellSpread mt="30px" />
          <PriceInTime mt="10px" />
          {Object.keys(baseAsset?.assets_raw_pairs?.pairs_data || {})?.length >
          0 ? (
            <Liquidity mt="10px" />
          ) : null}
        </Flex>
      </Flex>
      <Flex
        direction="column"
        display={["none", "none", "none", "flex"]}
        maxW="320px"
        w="100%"
      >
        <PriceInTime />
        <BuySellSpread />
        {Object.keys(baseAsset?.assets_raw_pairs?.pairs_data || {})?.length >
        0 ? (
          <Liquidity />
        ) : null}
        <AllTime />
      </Flex>
    </Flex>
  );
};
