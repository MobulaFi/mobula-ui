import {UserHoldingsAsset} from "../../models";

export const getChainsBreakdownFromPortfolio = (
  assets: UserHoldingsAsset[],
) => {
  const newBlockchains: {[key: string]: number} = {};

  assets?.forEach(token => {
    let totalOnChain = 0;

    Object.entries(token.cross_chain_balances).forEach(entry => {
      if (newBlockchains[entry[0]]) {
        newBlockchains[entry[0]] += entry[1] * token.price;
      } else {
        newBlockchains[entry[0]] = entry[1] * token.price;
      }
      totalOnChain += entry[1];
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
