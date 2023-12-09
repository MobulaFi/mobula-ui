import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BiSolidChevronDown } from "react-icons/bi";
import { BsShare } from "react-icons/bs";
import { Button } from "../../../../../components/button";
import { LargeFont, SmallFont } from "../../../../../components/fonts";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { UserContext } from "../../../../../contexts/user";
import { pushData } from "../../../../../lib/mixpanel";
import { addressSlicer } from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { NetworkButton } from "../network-button";
import { SharePopup } from "../popup/share";

export const Header = () => {
  const {
    setShowManage,
    activePortfolio,
    setShowPortfolioSelector,
    setShowSelect,
    isWalletExplorer,
    isPortfolioExplorer,
    setShowCreatePortfolio,
    setPortfolioSettings,
    isMobile,
    activeStep,
  } = useContext(PortfolioV2Context);
  const [showShare, setShowShare] = useState(false);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { setConnect } = useContext(PopupUpdateContext);
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex">
        {isWalletExplorer ? (
          <LargeFont extraCss="font-medium md:text-base">
            {addressSlicer(isWalletExplorer)}
          </LargeFont>
        ) : (
          <button
            className={`flex items-center font-medium text-light-font-100 dark:text-dark-font-100 text-[24px] md:text-[16px] mr-0 sm:mr-[-5px] ${
              activeStep.nbr === 5 ? "z-[5]" : "z-[0]"
            }`}
            onClick={() => setShowPortfolioSelector(true)}
          >
            {isMobile ? "Portfolio" : activePortfolio.name}
            {activePortfolio && pathname === "/portfolio" && (
              <BiSolidChevronDown className="ml-[5px]" />
            )}
          </button>
        )}
        <Button
          extraCss="ml-2.5 mr-2.5 sm:mr-[5px]"
          onClick={() => setShowShare(true)}
        >
          <SmallFont extraCss="flex md:hidden mr-[5px]">Share</SmallFont>
          <BsShare className="text-light-font-100 dark:text-dark-font-100 text-sm" />
        </Button>
        <Button
          extraCss={`${activeStep.nbr === 3 ? "z-[5]" : "z-[0]"}`}
          onClick={() => setShowManage(true)}
        >
          <SmallFont extraCss="flex md:hidden mr-[5px]">Manage</SmallFont>
          <AiOutlineSetting className="text-light-font-100 dark:text-dark-font-100 text-sm" />
        </Button>
      </div>
      <div className="flex my-auto items-center">
        <NetworkButton extraCss="flex-wrap" />
        {isWalletExplorer || isPortfolioExplorer ? null : (
          <Button
            extraCss={`${activeStep.nbr === 2 ? "z-[5]" : "z-[0]"}`}
            onClick={() => setShowSelect(true)}
          >
            Add Asset +
          </Button>
        )}
        {isWalletExplorer ? (
          <Button
            extraCss={`${activeStep.nbr === 2 ? "z-[5]" : "z-[0]"}`}
            onClick={() => {
              if (!user) {
                setConnect(true);
              } else {
                router.push("/portfolio");
                setTimeout(() => {
                  setShowPortfolioSelector(true);
                  setShowCreatePortfolio(true);
                  setPortfolioSettings({
                    name: `${addressSlicer(isWalletExplorer)}'s Portfolio`,
                    public: false,
                    wallets: [isWalletExplorer],
                  });
                  pushData("Create Portfolio Clicked");
                }, 1000);
              }
            }}
          >
            Create Portfolio
          </Button>
        ) : null}
        <SharePopup show={showShare} setShow={setShowShare} />
      </div>
    </div>
  );
};
