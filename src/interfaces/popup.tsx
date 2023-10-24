import { TableAsset } from "./assets";
import { WalkthroughBuffer } from "./transactions";

export interface IPopupStateContext {
  connect: boolean;
  walkthroughBuffer: WalkthroughBuffer;
  showCard: string | undefined;
  showAddedToWatchlist: boolean;
  showConnectSocialPopup: string | undefined;
  showSwitchNetwork: number | boolean;
  showMenuTableMobile: boolean;
  showMenuTableMobileForToken: TableAsset;
  showAlert: string;
}

export interface IPopupUpdateContext {
  setConnect: React.Dispatch<React.SetStateAction<boolean>>;
  setWalkthroughBuffer: React.Dispatch<
    React.SetStateAction<WalkthroughBuffer | undefined>
  >;
  setShowCard: React.Dispatch<React.SetStateAction<string | undefined>>;
  setShowAddedToWatchlist: React.Dispatch<React.SetStateAction<boolean>>;
  setShowConnectSocialPopup: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setShowSwitchNetwork: React.Dispatch<React.SetStateAction<number | boolean>>;
  setShowMenuTableMobile: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMenuTableMobileForToken: React.Dispatch<
    React.SetStateAction<TableAsset>
  >;
  setShowAlert: React.Dispatch<React.SetStateAction<string>>;
}
