import { useContext, useEffect } from "react";
import { createPublicClient, getContract, http } from "viem";
import { polygon } from "viem/chains";
import { useAccount } from "wagmi";
import { PROTOCOL_ADDRESS, getIPFSUrl } from "../../../../constants";
import { listingAbi } from "../../../misc/listing-form/constant";
import { SortContext } from "../context-manager";
import { TokenDivs } from "../models";
import { fetchOldData } from "../utils";

export interface IListingDataToken {
  id: bigint;
  ipfsHash: string;
  lastUpdated: bigint;
  socialScore: bigint;
  trustScore: bigint;
  utilityScore: bigint;
}
export interface IListingData {
  accruedSocialScore: bigint;
  accruedTrustScore: bigint;
  accruedUtilityScore: bigint;
  coeff: bigint;
  phase: bigint;
  status: number;
  statusIndex: bigint;
  submitter: string;
  token: IListingDataToken;
}

export const useSort = () => {
  const { address: account } = useAccount();
  const { setTokenDivs, isFirstSort, isPendingPool, setIsLoading } =
    useContext(SortContext);

  function getSorts() {
    const client = createPublicClient({
      chain: polygon,
      transport: http("https://polygon-rpc.com"),
    });

    const protocolContract: any = getContract({
      address: PROTOCOL_ADDRESS,
      abi: listingAbi,
      publicClient: client as any,
    });

    const getNumberFromSort = () => {
      if (isPendingPool === true) return 1;
      if (isFirstSort === true) return 3;
      return 4;
    };

    protocolContract.read
      .getTokenListings()
      .then(async (listings: IListingData[] | any) => {
        let fails = 0;
        listings.forEach(async (listing: IListingData, index) => {
          if (listing.status === getNumberFromSort()) {
            const [isAlreadyVoted, response, hashResult] =
              await Promise.allSettled([
                protocolContract.read[
                  isFirstSort ? "sortingVotesPhase" : "validationVotesPhase"
                ]([index, account]),
                fetch(getIPFSUrl(listing.token.ipfsHash)),
                fetchOldData(listing.token.id),
              ]);
            if (response.status !== "fulfilled") {
              setIsLoading(false);
              fails += 1;
              return;
            }

            let oldResponse: Response | undefined;
            if (hashResult.status === "fulfilled" && hashResult?.value) {
              try {
                oldResponse = await fetch(getIPFSUrl(hashResult.value));
              } catch (e) {
                console.error(e);
              }
            }

            try {
              const JSONrep: TokenDivs = await response.value.json();
              const oldJSONrep: TokenDivs = oldResponse
                ? await oldResponse.json()
                : undefined;
              const edits: string[] = [];

              Object.keys(JSONrep).forEach((key) => {
                // compare old and new JSON
                if (
                  oldJSONrep &&
                  oldJSONrep[key] !== JSONrep[key] &&
                  (typeof oldJSONrep[key] !== typeof JSONrep[key] ||
                    JSON.stringify(oldJSONrep[key]) !==
                      JSON.stringify(JSONrep[key])) &&
                  key !== "activeCoinType" &&
                  key !== "own_blockchain"
                ) {
                  edits.push(key);
                }
              });
              JSONrep.id = Number(listing.token.id);
              JSONrep.coeff = Number(listing.coeff);
              // JSONrep.contractAddresses = listing.contractAddresses;
              // JSONrep.excludedFromCirculation = listing.excludedFromCirculation;
              // JSONrep.totalSupply = listing.token.totalSupply;
              JSONrep.alreadyVoted =
                isAlreadyVoted.status === "fulfilled"
                  ? isAlreadyVoted.value
                  : false;
              JSONrep.isListing = oldResponse === undefined;
              JSONrep.edits = edits;
              JSONrep.oldToken = oldJSONrep;
              JSONrep.voteId = index;
              JSONrep.lastUpdate = Number(listing.token.lastUpdated);
              if (JSONrep.contracts) {
                setTokenDivs((tokenDivs) => [...tokenDivs, JSONrep]);
                setIsLoading(false);
              } else {
                fails += 1;
                setIsLoading(false);
              }
            } catch (e) {
              fails += 1;
              setIsLoading(false);
            }
          } else {
            fails += 1;
            setIsLoading(false);
          }
        });
      });
  }

  useEffect(() => {
    setIsLoading(true);
    getSorts();
  }, [isFirstSort, isPendingPool]);
};
