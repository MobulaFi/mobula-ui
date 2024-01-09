import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { BiSolidChevronDown } from "react-icons/bi";
import { Button } from "../../../../../components/button";
import { LargeFont } from "../../../../../components/fonts";
import { PopupUpdateContext } from "../../../../../contexts/popup";
import { UserContext } from "../../../../../contexts/user";
import { pushData } from "../../../../../lib/mixpanel";
import { addressSlicer } from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";

interface HeaderProps {
  isExplorer: boolean;
}

export const Header = ({ isExplorer }: HeaderProps) => {
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
        {isExplorer ? (
          <LargeFont extraCss="font-medium  font-normal text-light-font-100 dark:text-dark-font-100 text-[24px] md:text-[16px]">
            {addressSlicer(isWalletExplorer as string)}
          </LargeFont>
        ) : (
          <button
            className={`flex items-center font-normal text-light-font-100 dark:text-dark-font-100 text-[24px] md:text-[16px] mr-0 sm:mr-[-5px] ${
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
      </div>
      <div className="flex my-auto items-center">
        {/* <NetworkButton extraCss="flex-wrap" /> */}
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
        <button
          className={`mx-2.5 ${activeStep.nbr === 3 ? "z-[5]" : "z-[0]"}`}
          onClick={() => setShowManage(true)}
        >
          <AiOutlineSetting className="text-light-font-100 dark:text-dark-font-100 text-2xl" />
        </button>
      </div>
    </div>
  );
};
