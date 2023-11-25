import React, { useContext, useEffect, useState } from "react";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";

interface BuySellSpreadProps {
  extraCss?: string;
}

export const BuySellSpread = ({ extraCss }: BuySellSpreadProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
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
    supabase.rpc("get_trade_stats", { p_token_id: baseAsset?.id }).then((r) => {
      if (r.data) setSpreadData(r.data[0]);
    });
  }, []);

  const getPercentage = (buy: number, sell: number) => {
    const total = buy + sell;
    const buyPercentage = (buy / total) * 100;
    const sellPercentage = (sell / total) * 100;
    return { buyPercentage, sellPercentage };
  };

  const hasData = spreadData?.buy_trades && spreadData?.sell_trades;

  return (
    <div
      className={cn(
        `${FlexBorderBox} mt-0 lg:mt-[25px] py-5 lg:py-[15px] rounded-2xl md:rounded-0 px-5 lg:px-[15px] ${
          hasData ? "flex" : "hidden"
        }`,
        extraCss
      )}
    >
      <div className="flex items-center justify-between w-full mb-5">
        <LargeFont>Buy/Sell Spread</LargeFont>
        <MediumFont>24h</MediumFont>
      </div>
      <div className="flex w-full h-[9px] rounded-full">
        <div
          className="flex h-full bg-green dark:bg-green rounded-l"
          style={{
            width: `${
              getPercentage(spreadData?.buy_trades, spreadData?.sell_trades)
                ?.buyPercentage
            }%`,
          }}
        />
        <div
          className="flex h-full bg-red dark:bg-red rounded-r"
          style={{
            width: `${
              getPercentage(spreadData?.buy_trades, spreadData?.sell_trades)
                ?.sellPercentage
            }%`,
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-[7.5px]">
        <div className="flex items-center">
          <SmallFont>{spreadData?.buy_trades}</SmallFont>
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 ml-[7.5px]">
            Buy
          </SmallFont>
        </div>
        <div className="flex items-center">
          <SmallFont>{spreadData?.sell_trades}</SmallFont>
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 ml-[7.5px]">
            Sell
          </SmallFont>
        </div>
      </div>
      <div className="flex w-full h-[9px] rounded-full mt-[30px]">
        <div
          className="flex h-full bg-green dark:bg-green rounded-l"
          style={{
            width: `${
              getPercentage(
                spreadData?.total_buy_volume_usd,
                spreadData?.total_sell_volume_usd
              )?.buyPercentage
            }%`,
          }}
        />
        <div
          className="flex h-full bg-red dark:bg-red rounded-r"
          style={{
            width: `${
              getPercentage(
                spreadData?.total_buy_volume_usd,
                spreadData?.total_sell_volume_usd
              )?.sellPercentage
            }%`,
          }}
        />
      </div>
      <div className="flex justify-between items-center mt-[7.5px]">
        <div className="flex items-center">
          <SmallFont>
            ${getFormattedAmount(spreadData.total_buy_volume_usd)}
          </SmallFont>
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 ml-[7.5px]">
            Volume
          </SmallFont>
        </div>
        <div className="flex items-center">
          <SmallFont>
            ${getFormattedAmount(spreadData.total_sell_volume_usd)}
          </SmallFont>
          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 ml-[7.5px]">
            Volume
          </SmallFont>
        </div>
      </div>
    </div>
  );
};
