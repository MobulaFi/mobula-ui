import {ChevronRightIcon} from "@chakra-ui/icons";
import {Flex} from "@chakra-ui/react";
import {getFormattedAmount} from "../../../../../../../utils/helpers/formaters";
import {TextSmall} from "../../../../../../UI/Text";
import {useColors} from "../../../../../../common/utils/color-mode";
import {PublicTransaction, TransactionAsset} from "./model";

const CoreComponent = ({
  amount,
  symbol,
  amount_usd,
}: {
  amount: number;
  amount_usd: number;
  symbol: string;
}) => {
  const {text40, text80} = useColors();

  return (
    <Flex direction="column">
      <TextSmall color={text80}>{`${getFormattedAmount(
        amount,
      )} ${symbol}`}</TextSmall>
      <TextSmall color={text40}>
        {amount_usd ? `$${getFormattedAmount(amount_usd)} ` : "--"}
      </TextSmall>
    </Flex>
  );
};

export const TransactionAmount = ({
  transaction,
  tokens,
}: {
  transaction: PublicTransaction;
  tokens: TransactionAsset[];
}) => {
  if (transaction.type === "swap") {
    const tokenIn = tokens.find(token => token.id === transaction.in.id);
    const tokenOut = tokens.find(token => token.id === transaction.out.id);
    return (
      <Flex align="center" maxW="120px">
        <CoreComponent
          amount={transaction.out.amount}
          symbol={tokenOut?.symbol}
          amount_usd={transaction.out.amount_usd}
        />
        <ChevronRightIcon mx={["0px", "10px"]} />
        <CoreComponent
          amount={transaction.in.amount}
          symbol={tokenIn?.symbol}
          amount_usd={transaction.in.amount_usd}
        />
      </Flex>
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
