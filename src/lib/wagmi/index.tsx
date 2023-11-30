"use client";
import { publicProvider } from "@wagmi/core/providers/public";
import { configureChains } from "wagmi";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import {
  arbitrum,
  aurora,
  avalanche,
  bittorrentchain,
  bnbChain,
  boba,
  celo,
  cronos,
  dfkSubnet,
  ethereum,
  fantom,
  gnosis,
  harmony,
  heco,
  klaytn,
  moonriver,
  oasis,
  okex,
  optimism,
  polygon,
  smartBCH,
  velas,
} from "../../utils/chains";

export const { chains, publicClient } = configureChains(
  [
    polygon,
    bnbChain,
    ethereum,
    avalanche,
    arbitrum,
    optimism,
    fantom,
    aurora,
    smartBCH,
    cronos,
    heco,
    dfkSubnet,
    velas,
    oasis,
    bittorrentchain,
    moonriver,
    okex,
    boba,
    harmony,
    klaytn,
    gnosis,
    celo,
  ],
  [publicProvider()]
);

export const connectors = [
  new MetaMaskConnector({ chains, options: { shimDisconnect: true } }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: "66f273755c831295d3179420693b4e97",
      qrModalOptions: {
        themeVariables: {
          "--wcm-z-index": "10000000000000000000",
        },
        explorerRecommendedWalletIds: [
          "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
          "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
          "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0",
        ],
        // mobileWallets: [
        //   "metamask",
        //   "trust",
        //   "rainbow",
        //   "argent",
        //   "imtoken",
        //   "pillar",
        //   "gnosisSafe",
        //   "opera",
        //   "operaTouch",
        //   "torus",
        // ],
      },
    },
  }),
  new CoinbaseWalletConnector({ chains, options: { appName: "Mobula" } }),
  new InjectedConnector({
    chains,
    options: {
      name: "Injected",
      shimDisconnect: true,
    },
  }),
];
