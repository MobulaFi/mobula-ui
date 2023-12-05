import { useCallback, useContext } from "react";
import { useAccount } from "wagmi";
import { PopupUpdateContext } from "../contexts/popup";

export const useShouldConnect = (callback: Function) => {
  const { isConnected } = useAccount();
  const { setConnect } = useContext(PopupUpdateContext);

  const checkConnectionAndExecute = useCallback(() => {
    if (isConnected) {
      callback();
    } else {
      setConnect(true);
    }
  }, [isConnected, setConnect, callback]);

  return checkConnectionAndExecute;
};
