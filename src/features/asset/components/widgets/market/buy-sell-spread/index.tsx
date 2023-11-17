import {Flex, Text} from "@chakra-ui/react";
import {useContext, useEffect, useState} from "react";
import {getFormattedAmount} from "../../../../../../../../utils/helpers/formaters";
import {createSupabaseDOClient} from "../../../../../../../../utils/supabase";
import {TextSmall} from "../../../../../../../UI/Text";
import {useColors} from "../../../../../../../common/utils/color-mode";
import {BaseAssetContext} from "../../../../context-manager";
import {FlexBorderBox} from "../../../../style";

export const BuySellSpread = ({...props}) => {
  const {baseAsset} = useContext(BaseAssetContext);
  const {text80, borders, boxBg3, text40} = useColors();
  const [spreadData, setSpreadData] = useState({
    buy_trades: 120,
    sell_trades: 100,
    total_buy_volume: 5000.0,
    total_sell_volume: 4500.0,
    total_buy_volume_usd: 25000.0,
    total_sell_volume_usd: 22500.0,
  });

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase.rpc("get_trade_stats", {p_token_id: baseAsset?.id}).then(r => {
      if (r.data) setSpreadData(r.data[0]);
    });
  }, []);

  const getPercentage = (buy, sell) => {
    const total = buy + sell;
    const buyPercentage = (buy / total) * 100;
    const sellPercentage = (sell / total) * 100;
    return {buyPercentage, sellPercentage};
  };

  const hasData = spreadData?.buy_trades && spreadData?.sell_trades;

  return (
    <Flex
      {...FlexBorderBox}
      bg={[boxBg3]}
      mt={["25px", "25px", "25px", "0px"]}
      py={["15px", "15px", "15px", "20px"]}
      borderRadius={["0px", "0px", "16px"]}
      px={["15px", "15px", "15px", "20px"]}
      display={hasData ? "flex" : "none"}
      border={["none", "none", "none", borders]}
      {...props}
    >
      <Flex align="center" justify="space-between" w="100%" mb="20px">
        <Text
          fontSize={["16px", "16px", "16px", "18px"]}
          fontWeight="500"
          color={text80}
        >
          Buy/Sell Spread
        </Text>
        <Text
          fontSize={["14px", "14px", "14px", "16px"]}
          fontWeight="400"
          color={text80}
        >
          24h
        </Text>
      </Flex>
      <Flex w="100%" h="9px" borderRadius="full">
        <Flex
          w={`${
            getPercentage(spreadData?.buy_trades, spreadData?.sell_trades)
              ?.buyPercentage
          }%`}
          h="100%"
          bg="green"
          borderRadius="8px 0px 0px 8px"
        />
        <Flex
          w={`${
            getPercentage(spreadData?.buy_trades, spreadData?.sell_trades)
              ?.sellPercentage
          }%`}
          h="100%"
          bg="red"
          borderRadius="0px 8px 8px 0px"
        />
      </Flex>
      <Flex justify="space-between" align="center" mt="7.5px">
        <Flex align="center">
          <TextSmall>{spreadData?.buy_trades}</TextSmall>
          <TextSmall ml="7.5px" color={text40}>
            Buy
          </TextSmall>
        </Flex>
        <Flex align="center">
          <TextSmall>{spreadData?.sell_trades}</TextSmall>
          <TextSmall ml="7.5px" color={text40}>
            Sell
          </TextSmall>
        </Flex>
      </Flex>
      <Flex w="100%" h="9px" borderRadius="full" mt="30px">
        <Flex
          w={`${
            getPercentage(
              spreadData?.total_buy_volume_usd,
              spreadData?.total_sell_volume_usd,
            )?.buyPercentage
          }%`}
          h="100%"
          bg="green"
          borderRadius="8px 0px 0px 8px"
        />
        <Flex
          w={`${
            getPercentage(
              spreadData?.total_buy_volume_usd,
              spreadData?.total_sell_volume_usd,
            )?.sellPercentage
          }%`}
          h="100%"
          bg="red"
          borderRadius="0px 8px 8px 0px"
        />
      </Flex>
      <Flex justify="space-between" align="center" mt="7.5px">
        <Flex align="center">
          <TextSmall>
            ${getFormattedAmount(spreadData.total_buy_volume_usd)}
          </TextSmall>
          <TextSmall ml="7.5px" color={text40}>
            Volume
          </TextSmall>
        </Flex>
        <Flex align="center">
          <TextSmall>
            ${getFormattedAmount(spreadData.total_sell_volume_usd)}
          </TextSmall>
          <TextSmall ml="7.5px" color={text40}>
            Volume
          </TextSmall>
        </Flex>
      </Flex>
    </Flex>
  );
};
