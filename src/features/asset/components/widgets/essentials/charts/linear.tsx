import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { Button } from "../../../../../../components/button";
import { MediumFont } from "../../../../../../components/fonts";
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

  const [isTracked, setIsTracked] = useState(false);
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
      should_fetch: false,
      limit: txsLimit,
      offset: refresh ? 0 : transactions?.length,
      wallets: lowerCaseWallets.join(","),
      portfolio_id: user?.portfolios[0]?.id,
      added_transactions: true,
    };
    if (baseAsset) txRequest.only_assets = baseAsset.id;

    GET(
      `${process.env.NEXT_PUBLIC_PORTFOLIO_ENDPOINT}/portfolio/rawtxs`,
      txRequest,
      true
    )
      .then((r) => r.json())
      .then((r: TransactionResponse) => {
        if (r) {
          if (!refresh)
            setTransactions((oldTsx) => [
              ...(oldTsx || []),
              ...r.data.transactions,
            ]);
          else setTransactions(r.data.transactions);
        }
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [user, baseAsset]);

  useEffect(() => {
    setIsTracked(baseAsset?.tracked);
  }, [baseAsset]);

  useEffect(() => {
    if (baseAsset?.launch?.date) {
      const interval = setInterval(() => {
        setCountdown(getInitalCountdown(baseAsset.launch?.date));
      }, 1000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, []);

  const getDateSinceUntracked = () => {
    if (baseAsset) {
      if (unformattedHistoricalData?.[type]?.ALL?.length === 0)
        return "a few minutes ago";
      const now = new Date().getTime();
      const lastData =
        unformattedHistoricalData?.[type]?.ALL?.[
          (unformattedHistoricalData?.[type]?.ALL?.length || 0) - 1
        ];
      const lastDataTime = new Date(lastData?.[0] || "").getTime();
      const diff = now - lastDataTime;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      if (days > 0) return `${days} days ago`;
      if (hours > 0) return `${hours} hours ago`;
      return "a few minutes ago";
    }
    return "a few minutes ago";
  };

  const renderChartMessage = () => {
    if (
      unformattedHistoricalData?.[type]?.[timeSelected]?.length === undefined
    ) {
      return <Spinner extraCss="min-w-[60px] w-[60px] h-[60px]" />;
    }

    // if ( baseAsset?.untrack_reason !== "pre-listing") {
    //   return (
    //     <Flex direction="column" align="center" justify="center">

    //       </Flex>
    //   )
    // }

    if (
      !isTracked &&
      baseAsset &&
      baseAsset?.untrack_reason !== "pre-listing" &&
      unformattedHistoricalData?.[type]?.ALL?.length
    ) {
      return (
        <div className="flex flex-col items-center justify-center">
          <AiOutlineInfoCircle className="text-[30px] mb-[15px] text-red dark:text-red rotate-180" />
          <MediumFont>
            {baseAsset?.name} has been untracked {getDateSinceUntracked()} due
            to low liquidity
          </MediumFont>
          {(unformattedHistoricalData?.price?.ALL?.length as number) > 0 && (
            <Button
              extraCss="mt-[15px] px-3 text-light-font-60 dark:text-dark-font-60"
              onClick={() => setIsTracked(true)}
            >
              Display old chart
            </Button>
          )}
        </div>
      );
    }
    if (!isTracked && baseAsset?.untrack_reason !== "pre-listing")
      return (
        <div className="flex flex-col items-center justify-center">
          <AiOutlineInfoCircle className="text-[30px] mb-[15px] text-yellow dark:text-yellow rotate-180" />
          <MediumFont>
            {baseAsset?.name} is untracked as it doesn&apos;t have any on-chain
            liquidity
          </MediumFont>
          <Button
            extraCss="mt-[15px] px-3 text-light-font-60 dark:text-dark-font-60"
            onClick={() => setIsTracked(true)}
          >
            Display old chart
          </Button>
        </div>
      );

    if (countdown) {
      const currentSale =
        baseAsset?.sales?.[(baseAsset?.sales?.length || 0) - 1];
      return (
        <div className="flex flex-col items-center justify-center">
          <AiOutlineInfoCircle className="text-[30px] mb-[15px] text-red dark:text-red rotate-180" />
          <MediumFont>{baseAsset?.name} isn&apos;t launched yet.</MediumFont>
          <div className="flex justify-around w-[180px] mt-5">
            <div className="flex flex-col items-center">
              <div
                className="bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] w-[35px] rounded
               border border-light-border-primary dark:border-dark-border-primary flex items-center justify-center"
              >
                {countdown.days}
              </div>
              <MediumFont>Days</MediumFont>
            </div>
            :
            <div className="flex items-center flex-col">
              <div
                className="bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] w-[35px] rounded
               border border-light-border-primary dark:border-dark-border-primary flex items-center justify-center"
              >
                {countdown.hours}
              </div>
              <MediumFont>Hours</MediumFont>
            </div>
            :
            <div className="flex items-center flex-col">
              <div
                className="bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] w-[35px] rounded
              border border-light-border-primary dark:border-dark-border-primary flex items-center justify-center"
              >
                {countdown.minutes}
              </div>
              <MediumFont>Min</MediumFont>
            </div>
            :
            <div className="flex items-center flex-col">
              <div
                className="bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] w-[35px] rounded
                border border-light-border-primary dark:border-dark-border-primary flex items-center justify-center"
              >
                {countdown.seconds}
              </div>
              <MediumFont>Sec</MediumFont>
            </div>
          </div>
          {currentSale?.link ? (
            <Button
              extraCss="mt-[15px] px-3 text-light-font-60 dark:text-dark-font-60"
              onClick={() => window.open(currentSale?.link, "_blank")}
            >
              Open presale
            </Button>
          ) : null}
        </div>
      );
    }
  };
  const chartMessage = renderChartMessage();
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
        {baseAsset?.price_history?.price && (
          <EChart
            data={unformattedHistoricalData?.[type]?.ALL || []}
            timeframe={timeSelected}
            transactions={hideTx ? [] : transactions}
            height={isMobile ? 400 : 500}
            extraData={
              (comparedEntities.filter((entity) => entity.data.length).length
                ? comparedEntities
                    .filter((entity) => entity.data.length)
                    .map((entity, i) => ({
                      data: entity.data,
                      name: entity.label,
                      color: colors[i],
                    }))
                : null) as never
            }
            unit={comparedEntities.length ? "%" : "$"}
            unitPosition={comparedEntities.length ? "after" : "before"}
          />
        )}
      </div>
      {!isTracked && baseAsset?.untrack_reason === "pre-listing" ? (
        <div
          className="absolute flex w-full h-full left-[50%] top-[50%] -translate-y-[50%] -translate-x-[50%] justify-center items-center 
        text-light-font-100 dark:text-dark-font-100 z-[2] flex-col bg-light-bg-secondary dark:bg-dark-bg-secondary
         rounded-2xl border border-light-border-primary dark:border-dark-border-primary"
        >
          {chartMessage}
        </div>
      ) : null}
    </div>
  );
};
