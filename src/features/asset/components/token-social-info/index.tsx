import { Button } from "components/button";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useContext } from "react";
import { BsGlobe, BsLink45Deg, BsShieldCheck } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { LuLink } from "react-icons/lu";
import { SlMagnifier } from "react-icons/sl";
import { useNetwork } from "wagmi";
import { SmallFont } from "../../../../components/fonts";
import { NextChakraLink } from "../../../../components/link";
import { useColors } from "../../../../lib/chakra/colorMode";
import { addressSlicer } from "../../../../utils/formaters";
import { BaseAssetContext } from "../../context-manager";
import { PopOverLinesStyle, mainButtonStyle } from "../../style";
import { openInNewTab } from "../../utils";
import { Contracts } from "../contracts";
import { CustomPopOver } from "../ui/popover";

export const TokenSocialsInfo = () => {
  const { baseAsset, setShowPopupSocialMobile, setShowSeeAllTags } =
    useContext(BaseAssetContext);
  const { chain } = useNetwork();
  const {
    text80,
    boxBg6,
    hover,
    boxBg3,
    borders,
    bordersActive,
    text40,
    text60,
    tags,
    borders2x,
  } = useColors();

  const socials = [
    baseAsset.twitter
      ? {
          name: "Twitter",
          logo: "/social/twitter.png",
          url: baseAsset?.twitter,
          username: baseAsset?.twitter.split("https://twitter.com/")[1],
        }
      : null,
    baseAsset.chat
      ? {
          name: "Telegram",
          logo: "/social/telegram.png",
          url: baseAsset?.chat,
          username: baseAsset?.chat.split("https://t.me/")[1],
        }
      : null,
    baseAsset.discord
      ? {
          name: "Discord",
          logo: "/social/discord.png",
          url: baseAsset?.discord,
        }
      : null,
  ];

  function reorganizeArrays(
    currentChain: string,
    chains: string[],
    contracts: string[]
  ) {
    console.log("currentChain", currentChain);
    console.log("chains", chains);
    console.log("contracts", contracts);
    let newChains: string[];
    let newContracts: string[];
    if (currentChain) {
      const currentIndex = chains.indexOf(currentChain);
      newChains = chains;
      newContracts = contracts;
      if (currentIndex === -1) return { newChains, newContracts };
      newChains = [
        currentChain,
        ...chains.filter((blockchain) => blockchain !== currentChain),
      ];
      newContracts = [
        contracts[currentIndex],
        ...contracts.slice(0, currentIndex),
        ...contracts.slice(currentIndex + 1),
      ];
      return { newChains, newContracts };
    }
    newChains = chains;
    newContracts = contracts;
    return { newChains, newContracts };
  }

  const { newChains, newContracts } = reorganizeArrays(
    chain?.name,
    baseAsset?.blockchains,
    baseAsset?.contracts
  );
  const links = [
    baseAsset?.twitter || null,
    baseAsset?.chat || null,
    baseAsset?.discord || null,
    baseAsset?.white_paper || null,
    baseAsset?.telegram || null,
    baseAsset?.audit || null,
    baseAsset?.kyc || null,
  ];

  return (
    <div className="flex flex-col w-[40%] lg:w-full">
      <div className="flex items-start lg:items-center justify-between flex-col lg:flex-row">
        <div className="flex flex-col w-full">
          {baseAsset.tags?.length > 0 ? (
            <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 flex lg:hidden font-medium">
              Tags
            </SmallFont>
          ) : null}
          <div className="flex items-center mt-2.5 lg:mt-0 w-full">
            <div className="flex justify-between items-center w-full">
              {baseAsset.tags?.length > 0 ? (
                <div className="flex items-center flex-wrap">
                  {baseAsset.tags.map((tag: string, i: number) => {
                    if (i < 3)
                      return (
                        <div className="flex lg:hidden h-[28px] mt-2.5 px-2.5 mr-[7.5px] rounded items-center justify-center bg-light-bg-tags dark:bg-dark-bg-tags">
                          <SmallFont extraCss="h-full text-light-font-100 dark:text-dark-font-100 truncate flex items-center text-sm font-medium">
                            {tag}
                          </SmallFont>
                        </div>
                      );
                    return null;
                  })}
                  {baseAsset?.tags.length <= 3 ? (
                    <div className="hidden lg:flex h-[28px] mt-2.5 px-2.5 mr-[7.5px] rounded items-center justify-center bg-light-bg-tags dark:bg-dark-bg-tags">
                      <SmallFont extraCss="h-full text-light-font-100 dark:text-dark-font-100 truncate flex items-center text-sm font-medium">
                        {baseAsset.tags[0].length > 14
                          ? `${baseAsset.tags[0].slice(0, 14)}...`
                          : baseAsset.tags[0]}
                      </SmallFont>
                    </div>
                  ) : null}
                  {baseAsset?.tags.length > 3 ? (
                    <Button
                      extraCss="h-[26px] mt-2.5 px-2.5 mr-[7.5px]"
                      onClick={() => setShowSeeAllTags(true)}
                    >
                      <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 flex sm:hidden">
                        See all
                      </SmallFont>
                      <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 hidden sm:flex">
                        Tags
                      </SmallFont>
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex items-center mt-5 lg:mt-[15px] flex-wrap lg:flex-nowrap">
          <div className="flex lg:hidden">
            {baseAsset.website ? (
              <Button
                extraCss={`${mainButtonStyle} mb-[5px]`}
                onClick={() => openInNewTab(baseAsset.website)}
              >
                <BsLink45Deg className="mr-[5px] text-base text-light-font-100 dark:text-dark-font-100" />
                Website
                <FiExternalLink className="ml-[5px] text-sm text-light-font-60 dark:text-dark-font-60" />
              </Button>
            ) : null}
          </div>
          {/* MOBILE START */}
          <div
            className={`hidden w-fit ${
              newContracts?.length > 0 ? "lg:flex" : "lg:hidden"
            }`}
          >
            <CustomPopOver
              title={addressSlicer(newContracts?.[0])}
              logo={
                blockchainsContent[newChains?.[0]]?.logo ||
                `/logo/${newChains[0]?.toLowerCase().split(" ")[0]}.png`
              }
              isMobile
            >
              {newChains?.map(
                (blockchain, index: number) =>
                  blockchain && (
                    <div
                      className={`flex text-light-font-100 dark:text-dark-font-100 ${
                        index > 0 ? "mt-2.5" : "mt-0"
                      }`}
                      key={(newContracts?.[index] || 0) + blockchain}
                    >
                      <Contracts
                        contract={newContracts?.[index]}
                        blockchain={blockchain}
                      />
                    </div>
                  )
              )}
            </CustomPopOver>
          </div>
          <div className="hidden lg:flex">
            {baseAsset.website ? (
              <Button
                extraCss={`${mainButtonStyle} mb-[5px] px-[5px]`}
                onClick={() => openInNewTab(baseAsset.website)}
              >
                <BsGlobe className="text-base text-light-font-100 dark:text-dark-font-100" />
              </Button>
            ) : null}{" "}
          </div>
          <Button
            extraCss={`${mainButtonStyle} mb-[5px] hidden lg:flex`}
            onClick={() => setShowPopupSocialMobile(true)}
          >
            <LuLink className="mr-[7.5px] ml-0.5" />
            <SmallFont>
              {links.filter((entry) => entry !== null).length > 0
                ? `+ ${links.filter((entry) => entry !== null).length}`
                : ""}
            </SmallFont>
          </Button>
          {/* MOBILE END */}
          <div
            className={`${
              newContracts?.length > 0 ? "flex" : "hidden"
            } lg:hidden`}
          >
            <CustomPopOver title="Contracts" icon={SlMagnifier}>
              {newChains?.map(
                (blockchain, index: number) =>
                  blockchain && (
                    <div
                      className={`flex text-light-font-100 dark:text-dark-font-100 ${
                        index > 0 ? "mt-2.5" : "mt-0"
                      }`}
                      key={(newContracts?.[index] || 0) + blockchain}
                    >
                      <Contracts
                        contract={newContracts?.[index]}
                        blockchain={blockchain}
                      />
                    </div>
                  )
              )}
            </CustomPopOver>{" "}
          </div>
          <div
            className={`${
              baseAsset?.twitter ||
              baseAsset?.discord ||
              baseAsset?.telegram ||
              baseAsset?.chat
                ? "flex"
                : "hidden"
            } lg:hidden`}
          >
            {socials.filter((entry) => entry !== null).length > 0 ? (
              <CustomPopOver title="Community" icon={FaRegUser}>
                {socials
                  .filter((entry) => entry !== null)
                  ?.map((entry, i) => {
                    if (entry) {
                      return (
                        <NextChakraLink
                          key={entry.url}
                          target="_blank"
                          href={entry.url}
                          rel="norefferer"
                          extraCss="mb-2"
                        >
                          <div
                            className={`${
                              i !== 0 || i !== socials.length
                                ? "mb-0"
                                : "mb-2.5"
                            } border border-light-border-primary dark:border-dark-border-primary
                           hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover bg-light-bg-terciary dark:bg-dark-bg-terciary ${
                             i !== 0 ? "mt-[7.5px]" : "mt-0"
                           } w-full justify-between px-2.5 rounded h-[32px] flex items-center`}
                            key={entry.url}
                          >
                            <div className="flex items-center mr-[15px]">
                              <img
                                className="w-[14px] h-[14px] min-w-[14px] mr-[5px]"
                                src={entry.logo}
                                alt={`${entry.name} logo`}
                              />
                              <SmallFont>{entry.name}</SmallFont>
                            </div>
                            <div className="flex items-center">
                              <SmallFont>
                                {entry.username ? entry.username : "N/A"}
                              </SmallFont>

                              <FiExternalLink className="ml-2.5 text-light-font-40 dark:text-dark-font-40" />
                            </div>
                          </div>
                        </NextChakraLink>
                      );
                    }
                    return null;
                  })}
              </CustomPopOver>
            ) : null}{" "}
          </div>
          <div
            className={`${
              baseAsset?.audit || baseAsset?.kyc ? "flex" : "hidden"
            } lg:hidden`}
          >
            {baseAsset?.audit || baseAsset?.kyc ? (
              <CustomPopOver
                title="Audits"
                icon={BsShieldCheck}
                position="right-0"
              >
                {baseAsset?.audit ? (
                  <div className={PopOverLinesStyle}>
                    <div className="flex items-center mr-[15px]">
                      <SmallFont>Audit</SmallFont>
                      <SmallFont extraCss="max-w-[200px] truncate ml-2.5">
                        {baseAsset.audit}
                      </SmallFont>
                    </div>
                    <div className="flex items-center">
                      <NextChakraLink
                        href={baseAsset.audit}
                        target="_blank"
                        rel="norefferer"
                        extraCss="mb-1"
                      >
                        <FiExternalLink className="ml-2.5 text-light-font-40 dark:text-dark-font-40" />
                      </NextChakraLink>
                    </div>
                  </div>
                ) : null}
                {baseAsset.kyc ? (
                  <div
                    className={`${PopOverLinesStyle} border border-light-border-primary dark:border-dark-border-primary mt-[7.5px] mb-0`}
                  >
                    <div className="flex items-center mr-[15px]">
                      <SmallFont>KYC</SmallFont>
                      <SmallFont extraCss="max-w-[200px] truncate ml-2.5">
                        {baseAsset.kyc}
                      </SmallFont>
                    </div>
                    <div className="flex items-center">
                      <NextChakraLink
                        href={baseAsset.kyc}
                        target="_blank"
                        rel="norefferer"
                        extraCss="mb-1"
                      >
                        <FiExternalLink className="ml-2.5 text-light-font-40 dark:text-dark-font-40" />
                      </NextChakraLink>
                    </div>
                  </div>
                ) : null}
              </CustomPopOver>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
