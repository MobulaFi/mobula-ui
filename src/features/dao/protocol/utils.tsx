import levenshtein from "js-levenshtein";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { createPublicClient, getContract, http } from "viem";
import { polygon } from "viem/chains";
import { PROTOCOL_ADDRESS } from "../../../constants";
import { PROTOCOL_ABI } from "./constants/abi";

export const getTimer = (
  format: { timeframe: string; time: number },
  postedDate: number
) => {
  let finalFormat = format;
  if (postedDate < 60) {
    finalFormat = { timeframe: "seconds", time: postedDate };
  } else if (postedDate >= 60 && postedDate < 120) {
    finalFormat = {
      timeframe: "minute",
      time: Math.floor(postedDate / 60),
    };
  } else if (postedDate >= 120 && postedDate < 3600) {
    finalFormat = {
      timeframe: "minutes",
      time: Math.floor(postedDate / 60),
    };
  } else if (postedDate >= 3600 && postedDate < 7200) {
    finalFormat = {
      timeframe: "hour",
      time: Math.floor(postedDate / 3600),
    };
  } else if (postedDate >= 7200 && postedDate < 86400) {
    finalFormat = {
      timeframe: "hours",
      time: Math.floor(postedDate / 3600),
    };
  } else if (postedDate >= 86400 && postedDate < 172800) {
    finalFormat = {
      timeframe: "day",
      time: Math.floor(postedDate / 86400),
    };
  } else if (postedDate >= 172800) {
    finalFormat = {
      timeframe: "days",
      time: Math.floor(postedDate / 86400),
    };
  }

  return finalFormat;
};

export const getPricing = (coeff) => {
  const floorPrice = 30;
  const baseCoeff = 1000;
  let listingPrice = (coeff / baseCoeff) * floorPrice;
  listingPrice = Math.floor(listingPrice);
  return listingPrice;
};

export const fetchOldData = (tokenId: bigint): Promise<string | undefined> =>
  new Promise((r) => {
    const client = createPublicClient({
      chain: polygon,
      transport: http(blockchainsContent["Polygon"].rpcs[0]),
    });

    const contract: any = getContract({
      abi: PROTOCOL_ABI,
      address: PROTOCOL_ADDRESS as never,
      publicClient: client as any,
    });

    contract.read
      .getTokenListingsWithStatus([5])
      .catch((e) => {
        // console.log(e, "e");
      })
      .then((res) => {
        const tokenData = res.find((token) => {
          const tokenIDValue = token.token.id;
          if (tokenIDValue === tokenId) return token;
        });
        r(tokenData?.token.ipfsHash);
      });
  });

export const getClosestSimilarToken = (data, setData, name, token) => {
  if (data.length > 0) {
    const arr: any = [];
    for (let i = 0; i < data.length; i += 1) {
      const distance = levenshtein(token[name], data[i][name]);
      arr.push({ distance, token: data[i] });
    }
    const sortedArray = arr.sort((a, b) => a.distance - b.distance);
    setData((prev) => ({
      ...prev,
      [name]: sortedArray[0].token,
    }));
  }
};
