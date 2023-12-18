import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import { createPublicClient, getContract, http } from "viem";
import { erc20ABI } from "wagmi";
import { createSupabaseDOClient } from "../../lib/supabase";
import { idToWagmiChain } from "../../utils/chains";
import { toNumber } from "../../utils/formaters";
import { SearchTokenProps } from "./popup/select/model";

interface EventProps {
  topics: string[];
  data: string;
  address: string;
}
interface LogProps {
  address: `0x${string}`;
  blockHash: `0x${string}`;
  blockNumber: bigint;
  data: `0x${string}`;
  logIndex: number;
  transactionHash: `0x${string}`;
  transactionIndex: number;
  removed: boolean;
  logs: [];
}

export const fetchContract = (search: string) => {
  const supabase = createSupabaseDOClient();
  const fetchPromises: any[] = [];

  fetchPromises.push(
    new Promise((r) => {
      let fails = 0;

      Object.values(blockchainsContent).forEach(async (blockchain) => {
        try {
          const publicClient = createPublicClient({
            chain: idToWagmiChain[blockchain.chainId],
            transport: http(blockchain.rpcs[0]),
          });

          const contract = getContract({
            address: search as never,
            abi: erc20ABI,
            publicClient: publicClient as never,
          }) as any;

          const symbol = await contract.read.symbol();
          r({ symbol, blockchain: blockchain.name });
        } catch (e) {
          fails += 1;
          if (fails === Object.keys(blockchainsContent).length) {
            r(null);
          }
        }
      });
    })
  );

  fetchPromises.push(
    supabase
      .from("assets")
      .select("logo,contracts,blockchains,price,price_change_24h")
      .contains("contracts", [search.toLowerCase()])
  );

  return fetchPromises;
};

export const cleanNumber = (
  numberish?: bigint | number | null,
  decimals = 1
) => {
  if (!numberish) return 0;
  // numberish can also be number with decimals, so we need to convert it to string
  const number = numberish.toString();
  return parseFloat(number) / 10 ** decimals;
};

export const formatAsset = (
  asset: SearchTokenProps,
  chainName: BlockchainName
) => {
  if ("coin" in asset) return asset;
  return {
    ...asset,
    logo: asset.logo || "/empty/unknown.png",
    address:
      asset.address ||
      asset.contracts[(asset.blockchain || "").indexOf(chainName)] ||
      asset.contracts[0],
    blockchain:
      (asset.blockchain as BlockchainName) ||
      chainName ||
      ((asset.blockchain || "")[0] as BlockchainName),
  };
};

export const getAmountOut = (
  tx: LogProps,
  address: string,
  tokenAddress: string,
  decimals = 18
) => {
  if (!address) return 0;
  if (!tx) return 0;
  if (!tx.logs) return 0;
  // Search for the Transfer event that includes "address" as the recipient (the second topic)
  let event: EventProps[] = tx.logs.filter(
    (log: EventProps) =>
      log?.topics?.[0] ===
        "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
      log?.topics?.[2]?.includes(address.slice(2, 42).toLowerCase())
  );

  // If there are more than one Transfer events, filter the one that includes the token address (i.e. reward token)
  if (event.length > 1) {
    event = event.filter(
      (log: EventProps) =>
        log.address.toLowerCase() === tokenAddress.toLowerCase()
    );
  }

  [event] = event;

  if (!event) {
    event = tx?.logs?.find(
      (log: EventProps) =>
        log?.topics?.[0] ===
        "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65"
    );
  }

  if (!event) return 0;

  // The "amount" is the data of the event, so we need to convert it to a regular number string, then to a BigNumber and divide it by 10^decimals
  return toNumber(BigInt(event.data), decimals);
};

export const generateTxError = (
  error: { message?: string },
  callMessage?: string
) => {
  if (
    error.message?.includes("denied transaction signature") ||
    error.message?.includes("rejected transaction")
  ) {
    return {
      title: "Transaction rejected",
      hint: "Try to approve the transaction in your wallet.",
    };
  }
  if (error.message?.includes("insufficient funds")) {
    return {
      title: "Insufficient funds",
      hint: "Try to lower the amount or add more funds to your wallet.",
    };
  }

  if (callMessage) {
    if (callMessage.toLowerCase().includes("expired")) {
      return {
        title: "Transaction expired",
        hint: "Try to execute the transaction on a shorter time frame.",
      };
    }
    if (
      callMessage.toLowerCase().includes("enough") ||
      callMessage.toLowerCase().includes("insufficient")
    ) {
      return {
        title: "Return amount is too low",
        hint: "Try to lower the amount or increase the slippage.",
      };
    }
  }

  return {
    title: "Transaction failed",
    hint: `Error message: ${
      (error.message || "").split("(")[0] || "Unknown error"
    }`,
  };
};

export const famousContractsLabelFromName = {
  "KyberSwap Aggregator": {
    logo: "https://assets.coingecko.com/coins/images/14899/large/RwdVsGcw_400x400.jpg?1618923851",
    router: true,
  },
  "Li.Fi": {
    logo: "https://i.imgur.com/S5H28tq.png",
    router: true,
  },
  "Li.fi Diamond": {
    logo: "https://i.imgur.com/S5H28tq.png",
    router: true,
  },
  PancakeSwap: {
    logo: "https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png?1629359065",
    router: true,
  },
  "PancakeSwap V3": {
    logo: "https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png?1629359065",
    router: true,
  },
  "Metamask Router": {
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    router: true,
  },
  BiSwap: {
    logo: "https://assets.coingecko.com/coins/images/16845/large/biswap.png?1625388985",
    router: true,
  },
  Paraswap: {
    logo: "https://assets.coingecko.com/coins/images/20403/small/ep7GqM19_400x400.jpg?1636979120",
    router: true,
  },
  QuickSwap: {
    logo: "https://assets.coingecko.com/coins/images/13970/large/1_pOU6pBMEmiL-ZJVb0CYRjQ.png?1613386659",
    router: true,
  },
  "1inch": {
    logo: "https://assets.coingecko.com/coins/images/13469/large/1inch-token.png?1608803028",
    router: true,
  },
  OpenOcean: {
    logo: "https://mobula.mypinata.cloud/ipfs/QmQY3FugrgPwrxQay1EWwRsBXBc43YHgcxWCi5wAFgc255?pinataGatewayToken=WQn5Yv-xwpvoa6O4Kc6yMwL4kG-UCFSmo0FL2pcIRAdN-V8XYVaL7udtsC7R3_Nm",
    router: true,
  },
  SushiSwap: {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/6758.png",
    router: true,
  },
  ApeSwap: {
    logo: "https://static.crypto.com/token/icons/apeswap-finance/color_icon.png",
    router: true,
  },
  UniswapV2: {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
    router: true,
  },
  "Uniswap V3": {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/7083.png",
    router: true,
  },
  "VVS Finance": {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/14519.png",
    router: true,
  },
  "Wault Finance": {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/8588.png",
    router: true,
  },
  MDEX: {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/15977.png",
    router: true,
  },
  "Trader Joe": {
    logo: "https://s2.coinmarketcap.com/static/img/exchanges/64x64/1456.png",
    router: true,
  },
  MMFinance: {
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/16519.png",
    router: true,
  },
};
