import React from "react";
import { BsChevronDown } from "react-icons/bs";
import { SmallFont } from "../../../../../../components/fonts";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { PublicTransaction, TransactionAsset } from "./model";

interface CoreComponentProps {
  amount: number | undefined;
  amount_usd: number | undefined;
  symbol: string | undefined;
}

interface TransactionsAmountProps {
  transaction: PublicTransaction;
  tokens: TransactionAsset[];
}

const CoreComponent = ({ amount, symbol, amount_usd }: CoreComponentProps) => {
  return (
    <div className="flex flex-col">
      <SmallFont extraCss="whitespace-nowrap font-medium">
        {getFormattedAmount(amount)} {symbol}
      </SmallFont>
      {amount_usd ? (
        <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
          ${getFormattedAmount(amount_usd)}
        </SmallFont>
      ) : (
        <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
          {"--"}
        </SmallFont>
      )}
    </div>
  );
};

export const TransactionAmount = ({
  transaction,
  tokens,
}: TransactionsAmountProps) => {
  if (transaction.type === "swap") {
    const tokenIn = tokens.find((token) => token.id === transaction?.in?.id);
    const tokenOut = tokens.find((token) => token.id === transaction?.out?.id);
    return (
      <div className="flex items-center max-w-[120px]">
        <CoreComponent
          amount={transaction?.out?.amount}
          symbol={tokenOut?.symbol}
          amount_usd={transaction?.out?.amount_usd}
        />
        <BsChevronDown className="mx-2.5 sm:mx-2.5 rotate-90 text-light-font-100 dark:text-dark-font-100" />
        <CoreComponent
          amount={transaction?.in?.amount}
          symbol={tokenIn?.symbol}
          amount_usd={transaction?.in?.amount_usd}
        />
      </div>
    );
  }

  if (!transaction.amount) return null;
  return (
    <CoreComponent
      amount={transaction.amount}
      symbol={tokens[0]?.symbol}
      amount_usd={transaction.amount_usd}
    />
  );
};
