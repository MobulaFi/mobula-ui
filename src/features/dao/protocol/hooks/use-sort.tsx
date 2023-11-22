import {useContext, useEffect} from "react";
import {createPublicClient, getContract, http} from "viem";
import {polygon} from "viem/chains";
import {useAccount} from "wagmi";
import {PROTOCOL_ADDRESS, getIPFSUrl} from "../../../../../utils/constants";
import {listingAbi} from "../../../Misc/Listing/constant";
import {SortContext} from "../context-manager";
import {TokenDivs} from "../models";
import {fetchOldData} from "../utils";

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
  const {address: account} = useAccount();
  const {setTokenDivs, isFirstSort, isPendingPool} = useContext(SortContext);

  function getSorts() {
    const client = createPublicClient({
      chain: polygon,
      transport: http("https://polygon-rpc.com"),
    });

    const protocolContract = getContract({
      address: PROTOCOL_ADDRESS,
      abi: listingAbi,
      publicClient: client,
    });

    const getNumberFromSort = () => {
      if (isPendingPool === true) return 1;
      if (isFirstSort === true) return 3;
      return 4;
    };

    protocolContract.read
      .getTokenListings()
      // .catch(() => [])
      .then(async (listings: IListingData[]) => {
        // TODO: check this
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let fails = 0;
        console.log(listings);
        listings.forEach(async (listing: IListingData, index) => {
          if (listing.status !== getNumberFromSort()) return;
          const [isAlreadyVoted, response, hashResult] =
            await Promise.allSettled([
              protocolContract.read[
                isFirstSort ? "sortingVotesPhase" : "validationVotesPhase"
              ]([index, account]),
              fetch(getIPFSUrl(listing.token.ipfsHash)),
              fetchOldData(BigInt(index)),
            ]);

          if (response.status !== "fulfilled") {
            fails += 1;
            return;
          }

          let oldResponse: Response | undefined;
          if (hashResult.status === "fulfilled" && hashResult.value[0]) {
            try {
              oldResponse = await fetch(getIPFSUrl(hashResult.value[0]));
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

            Object.keys(JSONrep).forEach(key => {
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
                : (false as any);
            JSONrep.isListing = oldResponse === undefined;
            JSONrep.edits = edits;
            JSONrep.oldToken = oldJSONrep;
            JSONrep.voteId = index;
            JSONrep.lastUpdate = Number(listing.token.lastUpdated);
            if (JSONrep.contracts) {
              setTokenDivs(tokenDivs => [...tokenDivs, JSONrep]);
            } else {
              fails += 1;
            }
          } catch (e) {
            fails += 1;
            console.log(e);
          }
        });
      });
  }

  useEffect(() => {
    getSorts();
  }, [isFirstSort, isPendingPool]);
};
