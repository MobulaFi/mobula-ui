import { useContext } from "react";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";

export const FundraisingStats = () => {
  const { baseAsset } = useContext(BaseAssetContext);
  const reduceResult = baseAsset?.sales
    ?.filter((entry) => entry.date)
    ?.map((sale) => ({
      token_sold: sale.amount,
      raised: sale.raised,
    }));
  const tokensSold = reduceResult?.reduce(
    (acc, curr) => acc + Number(curr.token_sold),
    0
  );
  const amountRaised = reduceResult?.reduce(
    (acc, curr) => acc + Number(curr.raised),
    0
  );

  const percentage = getFormattedAmount(
    (tokensSold / (baseAsset?.total_supply || 0)) * 100
  );

  return (
    <div
      className="flex p-5 rounded-2xl border border-light-border-primary dark:border-dark-border-primary 
    mb-2.5 w-full mx-auto flex-col bg-light-bg-secondary dark:bg-dark-bg-secondary"
    >
      <LargeFont>Fundraising Stats</LargeFont>{" "}
      <div className="flex items-center border-b border-light-border-primary dark:border-dark-border-primary py-2.5 mt-[5px] justify-between">
        <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
          {" "}
          Tokens Sold:
        </SmallFont>
        <SmallFont extraCss="font-medium">
          {getFormattedAmount(tokensSold)}
        </SmallFont>
      </div>
      <div
        className="flex items-center border-b border-light-border-primary dark:border-dark-border-primary 
      py-2.5 justify-between"
      >
        <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
          Amount Raised:
        </SmallFont>
        <SmallFont extraCss="font-medium">
          ${getFormattedAmount(amountRaised)}
        </SmallFont>
      </div>
      <div
        className="flex items-center border-b border-light-border-primary dark:border-dark-border-primary 
         py-2.5 justify-between"
      >
        <SmallFont extraCss="font-medium">Total % for sale</SmallFont>
        <SmallFont extraCss="font-medium">
          {getTokenPercentage(percentage as number)}%
        </SmallFont>
      </div>
      <div className="flex h-2 w-full rounded-full bg-light-bg-hover dark:bg-dark-bg-hover">
        <div
          className="flex bg-blue dark:bg-blue h-full rounded-full"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};
