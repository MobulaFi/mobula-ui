import { getFormattedAmount } from "@utils/formaters";
import { Spinner } from "components/spinner";
import dynamic from "next/dynamic";
import { useChains } from "../../context-manager";
import { getChainName } from "../../utils";
import { BoxTitle } from "../box-title";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const MiddleBox = () => {
  const { chain, pairs } = useChains();
  const chainName = getChainName(pairs?.[0]?.pair?.blockchain);
  const price = getFormattedAmount(
    chain?.tokens_history?.[chain?.tokens_history?.length - 1]?.[1] || 0
  );
  return (
    <div
      className={`flex flex-col h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
      border-light-border-primary dark:border-dark-border-primary py-2.5 relative  
      min-w-[407px] md:min-w-full w-[31.5%] lg:w-full transition duration-500 mx-2.5 md:mx-0`}
    >
      <BoxTitle title={`${chainName} Active Tokens`} price={price} />
      {chain?.tokens_history?.length > 0 ? (
        <div className="w-[95%] mx-auto h-[210px] -mt-9">
          <EChart
            data={chain?.tokens_history || []}
            timeframe="ALL"
            height="200px"
            noAxis
            noDataZoom
          />
        </div>
      ) : (
        <div className="h-[200px] w-full flex items-center justify-center">
          <Spinner extraCss="w-[30px] h-[30px]" />
        </div>
      )}
    </div>
  );
};
