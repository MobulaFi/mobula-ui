import { UserHoldingsAsset } from "../../models";

export const getChainsBreakdownFromPortfolio = (
  assets: UserHoldingsAsset[]
) => {
  const newBlockchains: { [key: string]: number } = {};

  assets?.forEach((token) => {
    let totalOnChain = 0;

    Object.entries(token.cross_chain_balances).forEach((entry) => {
      const balance: number = (entry[1] as { balance: number })?.balance;

      if (newBlockchains[entry[0]]) {
        newBlockchains[entry[0]] += balance * token.price;
      } else {
        newBlockchains[entry[0]] = balance * token.price;
      }
      totalOnChain += balance;
    });

    if (totalOnChain > 0 && totalOnChain !== token.token_balance) {
      if (newBlockchains.Other) {
        newBlockchains.Other +=
          (token.token_balance - totalOnChain) * token.price;
      } else {
        newBlockchains.Other =
          (token.token_balance - totalOnChain) * token.price;
      }
    }
  });
  return newBlockchains;
};
