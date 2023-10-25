import { useMemo } from "react";
import { TextSmall } from "../../../../components/fonts";
import { useTop100 } from "../../../../features/data/top100/context-manager";
import { useColors } from "../../../../lib/chakra/colorMode";
import { getFormattedAmount } from "../../../../utils/formaters";
import { separator } from "../../utils";
import { Segment } from "../segment";

export const PriceSegment = ({ token, display, metricsChanges }) => {
  const { text80 } = useColors();
  const { activeView, mainCurrenciesPrices } = useTop100();

  const marketMoveColor = () => {
    if (metricsChanges.price === true) return "green";
    if (metricsChanges.price === false) return "red";
    return text80;
  };
  const getPriceFromType = useMemo(() => {
    if (display === "Price USD" && token.price) {
      return `$${separator(getFormattedAmount(token.price) as number)}`;
    }

    if (mainCurrenciesPrices?.eth && mainCurrenciesPrices?.btc && token.price) {
      if (display === "Price ETH") {
        return `${getFormattedAmount(
          token.price / (mainCurrenciesPrices.eth || 0)
        )} ETH`;
      }

      if (display === "Price BTC") {
        return `${getFormattedAmount(
          token.price / (mainCurrenciesPrices.btc || 0)
        )} BTC`;
      }
    }
    return "-";
  }, [display, token]);

  return (
    <Segment py={["5px", "5px", "5px", "5px", "10px"]} my="0px" pl="20px">
      <TextSmall
        color={marketMoveColor()}
        fontWeight="500"
        transition="all 250ms ease-in-out"
        fontSize={[
          activeView?.name === "Portfolio" ? "12px" : "13px",
          "13px",
          "14px",
        ]}
      >
        {getPriceFromType}
      </TextSmall>
    </Segment>
  );
};
