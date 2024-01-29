import { useAccount } from "wagmi";
// import { WalletConnectContext } from "../components/popup/wallet-reconnect/context";
// import { PopupUpdateContext } from "../context-manager/popup";

export const useSignerGuard = () => {
  const { address } = useAccount();
  // const { setStep } = useContext(WalletConnectContext);
  // const { setConnect } = useContext(PopupUpdateContext);

  const signerGuard = (callback: Function) => {
    callback();
    // if (
    //   localStorage.getItem("signatureAddress") === address &&
    //   localStorage.getItem("signature")
    // ) {
    //   callback();
    // } else if (!address) {
    //   setConnect(true);
    // } else {
    //   setConnect(true);
    //   setStep({
    //     nbr: 2,
    //     connector: {
    //       name: "",
    //       logo: localStorage.getItem("connect-image"),
    //     },
    //   });
    // }
  };
  return signerGuard;
};
