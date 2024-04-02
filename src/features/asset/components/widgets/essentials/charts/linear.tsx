import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Spinner } from "../../../../../../components/spinner";
import { UserContext } from "../../../../../../contexts/user";
import { TransactionResponse } from "../../../../../../interfaces/transactions";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { GET } from "../../../../../../utils/fetch";
import { colors } from "../../../../constant";
import { BaseAssetContext } from "../../../../context-manager";
import { Countdown } from "../../../../models";
import { getInitalCountdown } from "../../../../utils";

const EChart = dynamic(() => import("../../../../../../lib/echart/line"), {
  ssr: false,
});

interface ChartLiteProps {
  isBalanceHide?: boolean;
  extraCss?: string;
  [key: string]: any;
}

export const ChartLite = ({
  isBalanceHide = false,
  extraCss,
  ...props
}: ChartLiteProps) => {
  const {
    timeSelected,
    baseAsset,
    unformattedHistoricalData,
    chartType: type,
    hideTx,
    transactions,
    setTransactions,
    comparedEntities,
    historyData,
    setUnformattedHistoricalData,
  } = useContext(BaseAssetContext);
  const supabase = createSupabaseDOClient();

  const [countdown, setCountdown] = useState<Countdown | null>(
    getInitalCountdown(baseAsset.launch?.date)
  );
  const params = useParams();
  const assetQuery = params.asset;

  const { user } = useContext(UserContext);
  const router = useRouter();

  const fetchTransactions = (refresh = false) => {
    if (!user || !baseAsset) return;
    const wallets = [...user.external_wallets, user.address];
    const lowerCaseWallets = wallets.map((newWallet) =>
      newWallet?.toLowerCase()
    );
    const txsLimit = assetQuery ? 200 : 20;
    const txRequest: any = {
      limit: txsLimit,
      offset: refresh ? 0 : transactions?.length,
      wallets: lowerCaseWallets.join(","),
      portfolio_id: user?.portfolios[0]?.id,
      added_transactions: true,
      cache: true,
      order: "desc",
    };
    if (baseAsset) txRequest.only_assets = baseAsset.id;

    GET(`/api/1/wallet/transactions`, txRequest)
      .then((r) => r.json())
      .then((r: TransactionResponse) => {
        if (r?.data) {
          const transactions =
            "transactions" in r.data ? r.data.transactions : r.data;

          if (!refresh && transactions?.length)
            setTransactions((oldTsx) => [...(oldTsx || []), ...transactions]);
          else setTransactions(transactions || []);
        }
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, baseAsset]);

  useEffect(() => {
    if (baseAsset?.launch?.date) {
      const interval = setInterval(() => {
        setCountdown(getInitalCountdown(baseAsset.launch?.date));
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {
      return;
    };
  }, []);

  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  return (
    <div className="flex relative w-full h-full">
      <div
        className={cn(
          `flex items-center justify-center ${
            isBalanceHide ? "blur-sm" : ""
          } relative w-full mb-0 lg:mb-2.5 mt-5 md:mt-[-30px]`,
          extraCss
        )}
      >
        {baseAsset?.price_history?.price ? (
          <EChart
            data={unformattedHistoricalData?.[type]?.ALL || []}
            timeframe={timeSelected}
            transactions={hideTx ? [] : transactions}
            height={isMobile ? 400 : 500}
            extraData={
              comparedEntities.filter((entity) => entity.data.length).length
                ? comparedEntities
                    .filter((entity) => entity.data.length)
                    .map((entity, i) => ({
                      data: entity.data,
                      name: entity.label,
                      color: colors[i],
                    }))
                : null
            }
            unit={comparedEntities.length ? "%" : "$"}
            unitPosition={comparedEntities.length ? "after" : "before"}
          />
        ) : (
          <div className="h-[500px] md:h-[400px] w-full flex items-center justify-center">
            <Spinner extraCss="min-w-[60px] w-[60px] h-[60px]" />
          </div>
        )}
      </div>
    </div>
  );
};
