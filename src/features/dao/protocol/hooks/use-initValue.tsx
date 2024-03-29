import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useContext } from "react";
import { createPublicClient, formatEther, getContract, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import { PROTOCOL_ADDRESS, VAULT_ADDRESS } from "../../../../constants";
import { createSupabaseDOClient } from "../../../../lib/supabase";
import { triggerAlert } from "../../../../lib/toastify";
import { OverviewContext } from "../../protocol/context-manager/overview";
import { PROTOCOL_ABI, VAULT_ABI } from "../constants/abi";

export const useInitValues = () => {
  const { address } = useAccount();
  const { setTokensOwed, tokensOwed, setCountdown, setClaimed, setUserRank } =
    useContext(OverviewContext);
  const initValues = async () => {
    try {
      const supabase = createSupabaseDOClient();
      const client = createPublicClient({
        chain: polygon,
        transport: http(blockchainsContent["Polygon"].rpcs[0]),
      });

      const contract: any = getContract({
        abi: PROTOCOL_ABI,
        address: PROTOCOL_ADDRESS as never,
        publicClient: client as any,
      });

      const vaultContract: any = getContract({
        abi: VAULT_ABI,
        address: VAULT_ADDRESS as never,
        publicClient: client as any,
      });

      const [
        tokenPerVoteRead,
        owedRewardRead,
        paidRewardsRead,
        totalClaimRead,
        lastClaimRead,
      ] = await Promise.all([
        contract?.read?.tokensPerVote(),
        contract?.read.owedRewards([address]),
        contract.read.paidRewards([address]),
        vaultContract.read.totalClaim([address]),
        vaultContract.read.lastClaim([address]),
      ]);

      const tokensPerVote = parseInt(formatEther(tokenPerVoteRead));
      const tokenOwed =
        ((Number(owedRewardRead) - Number(paidRewardsRead)) * tokensPerVote) /
        1000;

      setTokensOwed(tokenOwed < 0 ? 0 : tokenOwed);

      setClaimed(Number(totalClaimRead));
      if (
        Number(lastClaimRead) === 0 ||
        Number(lastClaimRead) + 7 * 24 * 60 * 60 <= Date.now() / 1000
      ) {
        setCountdown(0);
      } else {
        setCountdown((Number(lastClaimRead) + 7 * 24 * 60 * 60) * 1000);
      }

      supabase
        .from("members")
        .select("address")
        .order("good_decisions", { ascending: false })
        .then((r) => {
          if (r.data) {
            setUserRank(
              r.data.map((entry) => entry.address).indexOf(address) + 1
            );
          }
        });
    } catch (e) {
      triggerAlert(
        "Error",
        "You must connect your wallet to access your Dashboard."
      );
    }
  };

  return initValues;
};
