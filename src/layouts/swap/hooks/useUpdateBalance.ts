import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useEffect } from "react";
import { createPublicClient, formatEther, getContract, http } from "viem";
import { erc20ABI, useAccount, useNetwork } from "wagmi";
import { idToWagmiChain } from "../../../utils/chains";
import { toNumber } from "../../../utils/formaters";
import { useMetaContext } from "./useSwapCommon";

export const useUpdateBalance = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { chainNeeded, tokenIn, setTokenIn, completedTx } = useMetaContext();

  const evmChainId = chainNeeded || chain?.id || 1;

  const updateBalance = () => {
    if (!address) return;

    const client = createPublicClient({
      chain: idToWagmiChain[evmChainId],
      transport: http(blockchainsIdContent[String(evmChainId)].rpcs[0]),
    });

    if (tokenIn && "coin" in tokenIn) {
      client
        .getBalance({ address })
        .then((balance) =>
          setTokenIn({ ...tokenIn, balance: formatEther(balance) as never })
        );
    } else if (tokenIn && "address" in tokenIn) {
      const contract = getContract({
        abi: erc20ABI,
        address: tokenIn.address as never,
        publicClient: client as never,
      }) as any;

      contract.read.balanceOf([address]).then((balance) => {
        setTokenIn({
          ...tokenIn,
          balance: toNumber(BigInt(balance), tokenIn.decimals) as never,
        });
      });
    }
  };

  useEffect(() => {
    if (blockchainsIdContent[String(evmChainId)]) updateBalance();
  }, [address]);

  useEffect(() => {
    if (completedTx) updateBalance();
  }, [completedTx]);
};
