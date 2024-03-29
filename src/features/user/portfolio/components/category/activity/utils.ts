import { EventProps, LogProps } from "layouts/swap/model";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import { createPublicClient, getContract, http } from "viem";
import { erc20ABI } from "wagmi";
import { MultichainAsset } from "../../../../../../interfaces/holdings";
import { Coin } from "../../../../../../interfaces/swap";
import { Results } from "../../../../../../layouts/swap/popup/select/model";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { idToWagmiChain } from "../../../../../../utils/chains";
import { toNumber } from "../../../../../../utils/formaters";
import { Asset } from "../../../../../asset/models";

interface ContractResult {
  symbol?: string;
  blockchain?: string;
}

interface AssetResult {
  logo: string;
  contracts: string[];
  blockchains: string[];
  price: number;
  price_change_24h: number;
}
[];

type FetchPromiseResult = ContractResult | AssetResult | null;

export const wordingFromMethodId = {
  "0xa140ae23": "Mint",
  "0xbd075b84": "Mint",
  "0x095ea7b3": "Approve",
  "0x9a67dd2c": "Vote First Sort",
  "0x9c6059ec": "Vote Final Validation",
};

export const famousContractsLabel = {
  "0x6131b5fae19ea4f9d964eac0408e4408b66337b5": {
    name: "KyberSwap Aggregator",
    logo: "https://assets.coingecko.com/coins/images/14899/large/RwdVsGcw_400x400.jpg?1618923851",
    router: true,
  },
  "0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae": {
    name: "Li.Fi Aggregator",
    logo: "https://i.imgur.com/S5H28tq.png",
    router: true,
  },
  "0x9b11bc9fac17c058cab6286b0c785be6a65492ef": {
    name: "Li.fi Diamond",
    logo: "https://i.imgur.com/S5H28tq.png",
    router: true,
  },
  "0x10ed43c718714eb63d5aa57b78b54704e256024e": {
    name: "PancakeSwap",
    logo: "https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png?1629359065",
    router: true,
  },
  "0x13f4ea83d0bd40e75c8222255bc855a974568dd4": {
    name: "PancakeSwap V3",
    logo: "https://assets.coingecko.com/coins/images/12632/large/pancakeswap-cake-logo_%281%29.png?1629359065",
    router: true,
  },
  "0x1a1ec25dc08e98e5e93f1104b5e5cdd298707d31": {
    name: "Metamask Router",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    router: true,
  },
  "0x3a6d8ca21d1cf76f653a67577fa0d27453350dd8": {
    name: "BiSwap",
    logo: "https://assets.coingecko.com/coins/images/16845/large/biswap.png?1625388985",
    router: true,
  },
  "0xdef171fe48cf0115b1d80b88dc8eab59176fee57": {
    name: "Paraswap",
    logo: "https://assets.coingecko.com/coins/images/20403/small/ep7GqM19_400x400.jpg?1636979120",
    router: true,
  },
  "0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff": {
    name: "QuickSwap",
    logo: "https://assets.coingecko.com/coins/images/13970/large/1_pOU6pBMEmiL-ZJVb0CYRjQ.png?1613386659",
    router: true,
  },
  "0x1111111254fb6c44bac0bed2854e76f90643097d": {
    name: "1inch",
    logo: "https://assets.coingecko.com/coins/images/13469/large/1inch-token.png?1608803028",
    router: true,
  },
  "0x6352a56caadc4f1e25cd6c75970fa768a3304e64": {
    name: "OpenOcean",
    logo: "https://mobula.mypinata.cloud/ipfs/QmQY3FugrgPwrxQay1EWwRsBXBc43YHgcxWCi5wAFgc255?pinataGatewayToken=WQn5Yv-xwpvoa6O4Kc6yMwL4kG-UCFSmo0FL2pcIRAdN-V8XYVaL7udtsC7R3_Nm",
    router: true,
  },
};

export const fetchContract = (search: string) => {
  const supabase = createSupabaseDOClient();
  const fetchPromises: Promise<FetchPromiseResult>[] = [];

  fetchPromises.push(
    new Promise((r) => {
      let fails = 0;

      Object.values(blockchainsContent)
        .filter((entry) => entry.evmChainId)
        .forEach(async (blockchain) => {
          try {
            const publicClient = createPublicClient({
              // @ts-ignore
              chain: idToWagmiChain[blockchain.evmChainId],
              transport: http(blockchain.rpcs[0]),
            });

            const contract: any = getContract({
              address: search as never,
              abi: erc20ABI,
              publicClient: publicClient as any,
            });

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
      .contains("contracts", [search.toLowerCase()]) as never
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
  asset: (Asset | MultichainAsset | Coin) & Results,
  chainName: BlockchainName
) => {
  if ("coin" in asset) return asset;
  return {
    ...asset,
    logo: asset.logo || "/icon/unknown.png",
    address:
      asset.address ||
      asset.contracts[asset?.blockchain?.indexOf(chainName) || 0] ||
      asset.contracts[0],
    blockchain:
      (asset.blockchain as BlockchainName) ||
      chainName ||
      (asset?.blockchain?.[0] as BlockchainName),
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

  const event: EventProps | undefined = tx.logs
    .filter(
      (log: EventProps) =>
        log.topics[0] ===
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
        log?.topics?.[2]?.includes(address.slice(2, 42).toLowerCase())
    )
    .find(
      (log: EventProps) =>
        log.address.toLowerCase() === tokenAddress.toLowerCase()
    );

  const alternativeEvent =
    !event &&
    tx.logs.find(
      (log: EventProps) =>
        log.topics[0] ===
        "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65"
    );

  const finalEvent = event || alternativeEvent;

  if (!finalEvent) return 0;

  return toNumber(BigInt(finalEvent.data), decimals);
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
    hint: `Error message: ${error?.message?.split("(")[0] || "Unknown error"}`,
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
