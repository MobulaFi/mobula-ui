// import {createConfig} from "wagmi/actions";
"use client";
import React, { ReactNode } from "react";
import { WagmiConfig, createConfig } from "wagmi";
import { connectors, publicClient } from ".";

const client = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
});

const WagmiProvider = ({ children }: { children: ReactNode }) => (
  // To Lazy Load Wagmi random push again
  // useEffect(() => {
  //   loadComponents();
  //   async function loadComponents() {
  //     const {WalletConnectConnector} = await import(
  //       "wagmi/connectors/walletConnect"
  //     );
  //     setClient(
  //       createClient({
  //         autoConnect: true,
  //         connectors: [
  //           ...connectors,
  //           new WalletConnectConnector({
  //             chains,
  //             options: {
  //               qrcode: true,
  //             },
  //           }),
  //         ],
  //         provider,
  //         webSocketProvider,
  //       }),
  //     );
  //   }
  // }, []);

  <WagmiConfig config={client}>{children}</WagmiConfig>
);
export default WagmiProvider;
