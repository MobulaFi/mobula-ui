export const getChainName = (chainName: string) => {
  if (chainName === "Avalanche C-Chain") return "Avalanche";
  if (chainName === "BNB Smart Chain (BEP20)") return "BNB Smart Chain";
  return chainName;
};
