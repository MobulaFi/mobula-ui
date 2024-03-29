import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
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
import { SharePopup } from "../popup/share";

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
    setShowWallet,
  } = useContext(PortfolioV2Context);
  const [showShare, setShowShare] = useState(false);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { setConnect } = useContext(PopupUpdateContext);
  const pathname = usePathname();

  const supportedChainsName = Object.keys(blockchainsContent).filter(
    (entry) => blockchainsContent[entry].apiType === "etherscan-like"
  );

  const getSupportedChains = () => {
    let chains = [];
    const entries = Object.entries(blockchainsContent);
    supportedChainsName.forEach((chain) => {
      entries.forEach((entry, i) => {
        if (entry[0] === chain) chains.push(entry[1]);
      });
    });
    // Filter to be remove when all chains are supported
    const unsupportedForNow = ["Avalanche C-Chain", "Fantom", "Mantle"];
    chains = chains.filter((chain) => !unsupportedForNow.includes(chain.name));
    return chains;
  };

  const supportedChains = getSupportedChains();

  const params = useParams();

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex">
        {isExplorer ? (
          <LargeFont extraCss="font-medium  font-normal text-light-font-100 dark:text-dark-font-100 text-[24px] md:text-[16px]">
            {addressSlicer(params?.address as string)}
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
        <Button
          extraCss="ml-2.5 mr-2.5 sm:mr-[5px]"
          onClick={() => setShowShare(true)}
        >
          <SmallFont extraCss="flex md:hidden mr-[5px]">Share</SmallFont>
          <BsShare className="text-light-font-100 dark:text-dark-font-100 text-sm" />
        </Button>
        {isExplorer ? null : (
          <Button
            extraCss={`${activeStep.nbr === 3 ? "z-[5]" : "z-[0]"}`}
            onClick={() => setShowManage(true)}
          >
            <SmallFont extraCss="flex md:hidden mr-[5px]">Manage</SmallFont>
            <AiOutlineSetting className="text-light-font-100 dark:text-dark-font-100 text-sm" />
          </Button>
        )}
      </div>
      <div className="flex my-auto items-center">
        {isExplorer ? null : (
          <Button
            extraCss={`mr-2.5 sm:mr-[5px] ${
              activeStep.nbr === 1 ? "z-[5]" : "z-[0]"
            }`}
            onClick={() => setShowWallet(true)}
          >
            {activePortfolio?.wallets?.length} Wallet(s)
            <BiSolidChevronDown className="ml-[2.5px] mr-[-2.5px] text-sm" />
          </Button>
        )}
        {/* <NetworkButton extraCss="flex-wrap" /> */}
        {isExplorer || isPortfolioExplorer ? null : (
          <Button
            extraCss={`${activeStep.nbr === 2 ? "z-[5]" : "z-[0]"}`}
            onClick={() => setShowSelect(true)}
          >
            Add Asset +
          </Button>
        )}
        {isExplorer ? (
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
                    name: `${addressSlicer(
                      params?.address as string
                    )}'s Portfolio`,
                    public: false,
                    wallets: [params?.address as string],
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
