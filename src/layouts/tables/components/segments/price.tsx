import { useMemo } from "react";
import { SmallFont } from "../../../../components/fonts";
import { useTop100 } from "../../../../features/data/top100/context-manager";
import { TableAsset } from "../../../../interfaces/assets";
import { getFormattedAmount } from "../../../../utils/formaters";
import { separator } from "../../utils";
import { Segment } from "../segment";

interface PriceSegmentProps {
  token: TableAsset;
  display: string;
  metricsChanges: {
    market_cap: boolean | null;
    price: boolean | null;
    rank: boolean | null;
    volume: boolean | null;
  };
}

export const PriceSegment = ({
  token,
  display,
  metricsChanges,
}: PriceSegmentProps) => {
  const { activeView, mainCurrenciesPrices } = useTop100();

  const marketMoveColor = () => {
    if (metricsChanges.price === true) return "text-green dark:text-green";
    if (metricsChanges.price === false) return "text-red dark:text-red";
    return "text-light-font-100 dark:text-dark-font-100";
  };
  const marketColor = marketMoveColor();

  const getPriceFromType = useMemo(() => {
    if (display === "Price USD" && token.price) {
      return `$${separator(getFormattedAmount(token.price) as number)}`;
    }

    if (mainCurrenciesPrices?.eth && mainCurrenciesPrices?.btc && token.price) {
      if (display === "Price ETH") {
        return `${getFormattedAmount(
          (token?.price as number) / (mainCurrenciesPrices.eth || 0)
        )} ETH`;
      }

      if (display === "Price BTC") {
        return `${getFormattedAmount(
          (token?.price as number) / (mainCurrenciesPrices.btc || 0)
        )} BTC`;
      }
    }
    return "-";
  }, [display, token]);

  return (
    <Segment extraCss="my-0 pl-5 py-2.5 lg:pl-[5px] sm:px-[5px]">
      <SmallFont
        extraCss={`${
          activeView?.name === "Portfolio" ? "md:text-xs" : "md:text-[13px]"
        } transition-all duration-250 ease-in-out font-medium ${marketColor}`}
      >
        {getPriceFromType}
      </SmallFont>
    </Segment>
  );
};
