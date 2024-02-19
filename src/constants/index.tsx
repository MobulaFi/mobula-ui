import { BlockchainName } from "mobula-lite/lib/model";

export const PROTOCOL_ADDRESS = "0xE6688BD7ca4D4B06a716aaee6b77c8c4017C0Fc3";
export const API_ADDRESS = "0x118f3e7DAE8B63601f8a51C853291805c76aAD64";
export const PROTOCOL_BNB_ADDRESS =
  "0x65d121150E03d02a00C362159383BF5860Ab8526";
export const MOBL_ADDRESS = "0x5FeF39b578DeEefa4485A7E5944c7691677d5dd4";
export const GOVERNOR_ADDRESS = "0x541ea62a8bf14ee04a68bc41be3823fb583206bf";
export const VAULT_ADDRESS = "0x788df29229dE76c085c3F904342e3B5770A213F2"; // "0x3785C5e55F13D3156Ca82E325acE83A97c4642A5";
export const VEMOBL_ADDRESS = "0x738BB24915A5F88103485844f5aD87EdEc102283";

// STABLE ADDRESS
export const USDC_MATIC_ADDRESS = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
export const USDT_MATIC_ADDRESS = "0xc2132d05d31c914a87c6611c10748aeb04b58e8f";
export const USDT_BNB_ADDRESS = "0x55d398326f99059ff775485246999027b3197955";
export const USDC_BNB_ADDRESS = "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d";

export const ONE_INCH_ROUTER = "0x1111111254fb6c44bAC0beD2854e76F90643097d";

export const NATIVE_ROUTER: Partial<Record<number, string>> = {
  1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  56: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  137: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff",
};

export const MOBL_BRIDGE = {
  137: "0xfc09cef3b0e08dbced9b3ea77f9ef9fe9a8a865e",
  56: "0x811a0795375a9b3efe3210edc2a5c9fd393b54cc",
  43114: "0x8e6bfa0562467124c1894631879241c7e7d8956d",
};

export const axelarChains = {
  Polygon: "Polygon",
  "BNB Smart Chain (BEP20)": "Binance",
  "Avalanche C-Chain": "Avalanche",
};

// export const HIDDEN_PROPOSALS = [0];

export const RPC_URL = "https://polygon-rpc.com";

// "https://mobula-app-6x64g.ondigitalocean.app";
export const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const getIPFSUrl = (hash: string) =>
  `https://mobula.mypinata.cloud/ipfs/${hash}?pinataGatewayToken=WQn5Yv-xwpvoa6O4Kc6yMwL4kG-UCFSmo0FL2pcIRAdN-V8XYVaL7udtsC7R3_Nm`;

export const supportedRPCs = [
  {
    name: "Avalanche C-Chain",
    url: "https://api.avax.network/ext/bc/C/rpc",
    explorer: "https://snowtrace.io",
  },
  {
    name: "BNB Smart Chain (BEP20)",
    url: "https://bsc-dataseed.binance.org/",
    explorer: "https://bscscan.com",
  },
  {
    name: "Ethereum",
    url: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    explorer: "https://etherscan.io",
  },
  {
    name: "Fantom",
    url: "https://rpc.ftm.tools/",
    explorer: "https://ftmscan.com",
  },
  {
    name: "Polygon",
    url: "https://polygon-rpc.com",
    explorer: "https://polygonscan.com",
  },
  {
    name: "Cronos",
    url: "https://evm-cronos.crypto.org",
    explorer: "https://cronoscan.com",
  },
  {
    name: "Metis Andromeda",
    url: "https://andromeda.metis.io/owner1088",
    explorer: "https://andromeda-explorer.metis.io",
  },
  {
    name: "Aurora",
    url: "https://mainnet.aurora.dev",
    explorer: "https://aurorascan.dev",
  },
  {
    name: "Arbitrum",
    url: "https://rpc.ankr.com/arbitrum",
    explorer: "https://arbiscan.io/",
  },
  {
    name: "SmartBCH",
    url: "https://smartbch.greyh.at",
  },
];

export const types = ["price", "volume", "liquidity", "rank"];

export const SAFU_CHAIN: Partial<Record<BlockchainName, string>> = {
  "BNB Smart Chain (BEP20)": "BSC",
  Ethereum: "ETH",
};
