import { Button } from "components/button";
import { Collapse } from "components/collapse";
import { useContext, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BiChevronDown, BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../../../../../components/avatar";
import { SmallFont } from "../../../../../../components/fonts";
import { Input } from "../../../../../../components/input";
import { Modal } from "../../../../../../components/modal-container";
import { UserContext } from "../../../../../../contexts/user";
import { useSignerGuard } from "../../../../../../hooks/signer";
import { pushData } from "../../../../../../lib/mixpanel";
import { GET } from "../../../../../../utils/fetch";
import { addressSlicer } from "../../../../../../utils/formaters";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { buttonPopupStyle, buttonSquareStyle } from "../../../style";
import { copyText } from "../../../utils";

export const WalletsPopup = () => {
  const { user } = useContext(UserContext);
  const [isCopied, setIsCopied] = useState("");
  const { address } = useAccount();
  const signerGuard = useSignerGuard();
  const [newWalletAddress, setNewWalletAddress] = useState("");
  const [showAddWallet, setShowAddWallet] = useState(false);
  const { setShowWallet, showWallet, activePortfolio, setActivePortfolio } =
    useContext(PortfolioV2Context);
  const refreshPortfolio = useWebSocketResp();

  const removeWallet = (walletAddress: string) => {
    signerGuard(() => {
      pushData("Wallet Removed");
      const newPortfolio = {
        ...activePortfolio,
        wallets: activePortfolio.wallets.filter(
          (iteratedWallet) => iteratedWallet !== walletAddress
        ),
      };
      GET("/portfolio/edit", {
        id: activePortfolio.id,
        name: newPortfolio.name,
        public: newPortfolio.public,
        wallets: newPortfolio.wallets.join(","),
        removed_transactions: newPortfolio.removed_transactions.join(","),
        removed_assets: newPortfolio.removed_assets.join(","),
        reprocess: true,
        account: address as string,
      });

      setActivePortfolio(newPortfolio);
      setShowWallet(false);

      setTimeout(() => {
        refreshPortfolio();
      }, 2000);
    });
  };

  const addWallet = (newWalletAddress: string) => {
    signerGuard(() => {
      const newPortfolio = {
        ...activePortfolio,
        wallets: [...activePortfolio.wallets, newWalletAddress],
      };
      pushData("Wallet Added");
      GET("/portfolio/edit", {
        id: newPortfolio.id,
        name: newPortfolio.name,
        public: newPortfolio.public,
        reprocess: true,
        wallets: newPortfolio.wallets.join(","),
        removed_transactions: newPortfolio.removed_transactions.join(","),
        removed_assets: newPortfolio.removed_assets.join(","),
        account: address as string,
      });
      setActivePortfolio(newPortfolio);
      refreshPortfolio(newPortfolio);

      setShowAddWallet(false);
      setShowWallet(false);
      setNewWalletAddress("");
    });
  };

  return (
    <Modal
      isOpen={showWallet && activePortfolio?.id !== 0}
      onClose={() => setShowWallet(false)}
      extraCss="max-w-[400px]"
      title="Wallets"
    >
      {activePortfolio.wallets?.map((walletAddress) => (
        <div
          className="flex items-center mt-2.5 justify-between"
          key={walletAddress}
        >
          <div className="flex items-center">
            <AddressAvatar
              extraCss="min-w-[32px] w-[32px] h-[32px]"
              address={walletAddress}
            />
            <div className="flex flex-col ml-2.5">
              <SmallFont className="font-normal">
                {addressSlicer(walletAddress, 8)}
              </SmallFont>
            </div>
          </div>
          <div className="flex">
            <button
              className={`${buttonSquareStyle} bg-light-bg-hover dark:bg-dark-bg-hover`}
              onClick={() => {
                copyText(walletAddress, setIsCopied);
              }}
            >
              {isCopied === walletAddress ? (
                <BsCheckLg className="text-green dark:text-green" />
              ) : (
                <BiCopy className="text-light-font-60 dark:text-dark-font-60 hover:text-light-font-60 hover:dark:text-dark-font-100 transition-all" />
              )}
            </button>
            {activePortfolio?.user === user?.id && (
              <button
                className={`${buttonSquareStyle} bg-light-bg-hover dark:bg-dark-bg-hover ml-1.5`}
                onClick={() => removeWallet(walletAddress)}
              >
                <AiOutlineDelete className="text-light-font-60 dark:text-dark-font-60 hover:text-red hover:dark:text-red transition-all" />
              </button>
            )}
          </div>
        </div>
      ))}
      {activePortfolio?.user === user?.id && (
        <div className="flex mt-2.5 flex-col border-t border-light-border-primary dark:border-dark-border-primary pt-[15px]">
          <div className="flex flex-col w-full">
            {/* ADD A WALLET */}
            <div className="flex w-full justify-between items-center">
              <button
                className="text-sm lg:text-[13px] md:text-xs text-light-font-100 dark:text-dark-font-100 flex items-center justify-between w-full"
                onClick={() => setShowAddWallet((prev) => !prev)}
              >
                <SmallFont>Add a wallet</SmallFont>
                <BiChevronDown className="ml-1.5 text-light-font-100 dark:text-dark-font-100 text-lg" />
              </button>
            </div>
            <Collapse startingHeight="max-h-[0px]" isOpen={showAddWallet}>
              <div className="flex items-center justify-between mb-2.5 w-full mt-2.5">
                <div className="flex items-center">
                  <SmallFont>Wallet Address</SmallFont>
                </div>
              </div>
              <Input
                extraCss="mb-2.5 w-full"
                placeholder="0x"
                value={newWalletAddress}
                onChange={(e) => setNewWalletAddress(e.target.value)}
              />
              <div className="flex w-full">
                <Button
                  extraCss={`border-light-border-primary dark:border-dark-border-primary bg-light-bg-terciary
                   dark:bg-dark-bg-terciary transition-all duration-200 mr-2.5 hover:bg-light-bg-hover
                    hover:dark:bg-dark-bg-hover w-2/4 ${buttonPopupStyle}`}
                  onClick={() => setShowAddWallet(false)}
                >
                  Cancel
                </Button>
                <Button
                  extraCss={`border-darkblue dark:border-darkblue transition-all duration-200 hover:border-blue
                   hover:dark:border-blue w-2/4 ${buttonPopupStyle}`}
                  onClick={() => addWallet(newWalletAddress)}
                >
                  Import
                </Button>
              </div>
            </Collapse>
          </div>
        </div>
      )}
    </Modal>
  );
};
