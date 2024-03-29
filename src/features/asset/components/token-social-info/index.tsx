import { Button } from "components/button";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import {
  BsDiscord,
  BsGlobe,
  BsLink45Deg,
  BsShieldCheck,
  BsTelegram,
  BsTwitter,
} from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { LuLink } from "react-icons/lu";
import { SlMagnifier } from "react-icons/sl";
import { useNetwork } from "wagmi";
import { SmallFont } from "../../../../components/fonts";
import { NextChakraLink } from "../../../../components/link";
import { useGeneralContext } from "../../../../contexts/general";
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
  const { editAssetReducer, setEditAssetReducer, setBaseEditAssetReducer } =
    useGeneralContext();
  const router = useRouter();

  const socials = [
    baseAsset?.twitter
      ? {
          name: "Twitter",
          icon: (
            <BsTwitter className="text-sm text-twitter dark:text-twitter mr-2" />
          ),
          url: baseAsset?.twitter,
          username: baseAsset?.twitter.split("https://twitter.com/")[1],
        }
      : null,
    baseAsset?.chat
      ? {
          name: "Telegram",
          icon: (
            <BsTelegram className="text-sm text-telegram dark:text-telegram mr-2" />
          ),
          url: baseAsset?.chat,
          username: baseAsset?.chat.split("https://t.me/")[1],
        }
      : null,
    baseAsset?.discord
      ? {
          name: "Discord",
          icon: (
            <BsDiscord className="text-sm text-discord dark:text-discord mr-2" />
          ),
          url: baseAsset?.discord,
        }
      : null,
  ];

  function reorganizeArrays(
    currentChain: string,
    chains: string[],
    contracts: string[]
  ) {
    let newChains: string[];
    let newContracts: string[];
    if (currentChain && chains && contracts) {
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

  function editPage() {
    const contracts = baseAsset.contracts.map((address, index) => ({
      address: address,
      blockchain: baseAsset.blockchains[index],
      blockchain_id: baseAsset.decimals[index], // Assuming decimals is meant to be the ID here
    }));

    const totalSupplyContracts = baseAsset.total_supply_contracts.map(
      (address, index) => ({
        address: address,
        blockchain: baseAsset.blockchains[index],
        blockchain_id: baseAsset.decimals[index], // Assuming decimals is meant to be the ID here
      })
    );

    const excludedFromCirculationAddresses =
      baseAsset.circulating_supply_addresses.map((address, index) => ({
        address: address,
        blockchain: baseAsset.blockchains[index],
        blockchain_id: baseAsset.decimals[index], // Assuming decimals is meant to be the ID here
      }));

    const asset = {
      name: baseAsset.name,
      symbol: baseAsset.symbol,
      type: "token",
      image: {
        loading: false,
        uploaded_logo: true,
        logo: baseAsset.logo,
      },
      description: baseAsset.description,
      categories: baseAsset.tags,
      completed: false,
      links: {
        website: baseAsset.website,
        twitter: baseAsset.twitter,
        telegram: baseAsset.telegram,
        discord: baseAsset.discord,
        github: baseAsset.github,
        audit: baseAsset.audit,
        kyc: baseAsset.kyc,
      },
      team: baseAsset.team || [],
      contracts: contracts,
      totalSupplyContracts: totalSupplyContracts,
      excludedFromCirculationAddresses: excludedFromCirculationAddresses,
      tokenomics: {
        distribution: baseAsset.distribution,
        launch: baseAsset.launch,
        sales: baseAsset.sales,
        vestingSchedule: baseAsset.release_schedule,
        fees: [
          {
            name: "",
            percentage: 0,
            details: "",
            side: "buy",
          },
        ],
      },
      protocol_id: baseAsset.protocol_id,
    };

    setEditAssetReducer(asset);

    setBaseEditAssetReducer(asset);

    router.push("/list");
  }

  const { newChains, newContracts } = reorganizeArrays(
    chain?.name as string,
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
        <div className="flex flex-col justify-between w-full">
          <div className="flex justify-between items-center w-full">
            {baseAsset?.tags?.length > 0 ? (
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 flex lg:hidden font-medium">
                Tags
              </SmallFont>
            ) : null}
            <Button
              onClick={editPage}
              extraCss="text-light-font-60 dark:text-dark-font-60 hover:underline ml-auto lg:ml-0"
            >
              Edit Page
            </Button>
          </div>
          <div className="flex items-center mt-2.5 lg:mt-0 w-full">
            <div className="flex justify-between items-center w-full">
              {baseAsset?.tags?.length > 0 ? (
                <div className="flex items-center flex-wrap">
                  {baseAsset?.tags.map((tag: string, i: number) => {
                    if (i < 3)
                      return (
                        <div
                          className="flex lg:hidden h-[28px] mt-2.5 px-2.5 mr-[7.5px] rounded-md items-center justify-center bg-light-bg-tags dark:bg-dark-bg-tags"
                          key={i}
                        >
                          <SmallFont extraCss="h-full text-light-font-100 dark:text-dark-font-100 truncate flex items-center text-sm font-medium">
                            {tag}
                          </SmallFont>
                        </div>
                      );
                    return null;
                  })}
                  {baseAsset?.tags.length <= 3 ? (
                    <div className="hidden lg:flex h-[28px] mt-2.5 px-2.5 mr-[7.5px] rounded-md items-center justify-center bg-light-bg-tags dark:bg-dark-bg-tags">
                      <SmallFont extraCss="h-full text-light-font-100 dark:text-dark-font-100 truncate flex items-center text-sm font-medium">
                        {baseAsset.tags[0].length > 10
                          ? `${baseAsset.tags[0].slice(0, 10)}...`
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
            {baseAsset?.website ? (
              <Button
                extraCss={`${mainButtonStyle} mb-[5px]`}
                onClick={() => openInNewTab(baseAsset.website as string)}
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
                `/logo/${newChains?.[0]?.toLowerCase().split(" ")[0]}.png`
              }
              position="left-1/2 -translate-x-1/2"
              isMobile
            >
              {newChains?.map((blockchain, index: number) =>
                blockchain ? (
                  <div
                    className={`flex text-light-font-100 dark:text-dark-font-100 ${
                      index > 0 ? "mt-2.5" : "mt-0"
                    }`}
                    key={(newContracts?.[index] || 0) + blockchain}
                  >
                    <Contracts
                      contract={newContracts?.[index]}
                      blockchain={blockchain as BlockchainName}
                    />
                  </div>
                ) : (
                  <></>
                )
              )}
            </CustomPopOver>
          </div>
          <div className="hidden lg:flex">
            {baseAsset?.website ? (
              <Button
                extraCss={`${mainButtonStyle} mb-[5px] px-[5px]`}
                onClick={() => openInNewTab(baseAsset.website as string)}
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
            <CustomPopOver
              title="Contracts"
              icon={
                <SlMagnifier className="flex md:hidden mr-[7.5px] text-xs" />
              }
              position="left-1/2 -translate-x-1/2"
            >
              {newChains
                ?.filter((element) => element !== null)
                ?.map((blockchain, index: number) => {
                  if (blockchain) {
                    return (
                      <div
                        className={`flex text-light-font-100 dark:text-dark-font-100 ${
                          index > 0 ? "mt-2.5" : "mt-0"
                        }`}
                        key={(newContracts?.[index] || 0) + blockchain}
                      >
                        <Contracts
                          contract={newContracts?.[index]}
                          blockchain={blockchain as BlockchainName}
                        />
                      </div>
                    );
                  }
                  return <></>;
                })}
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
              <CustomPopOver
                title="Community"
                position="left-1/2 -translate-x-1/2"
                icon={<FaRegUser className="flex md:hidden mr-[5px] text-xs" />}
              >
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
                           } w-full justify-between px-2.5 rounded-md h-[32px] flex items-center`}
                            key={entry.url}
                          >
                            <div className="flex items-center mr-[15px]">
                              {entry.icon}
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
                    return <></>;
                  })}
              </CustomPopOver>
            ) : null}{" "}
          </div>
          <div
            className={`${
              baseAsset?.audit || baseAsset?.kyc ? "flex" : "hidden"
            } lg:hidden`}
          >
            {(baseAsset?.audit && baseAsset?.audit !== "null") ||
            (baseAsset?.kyc && baseAsset?.kyc !== "null") ? (
              <CustomPopOver
                title="Audits"
                icon={
                  <BsShieldCheck className="flex md:hidden mr-[5px] text-xs" />
                }
                position="left-1/2 -translate-x-1/2"
              >
                {baseAsset?.audit !== "null" ? (
                  <div
                    className={`${PopOverLinesStyle}  border border-light-border-primary dark:border-dark-border-primary`}
                  >
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
                ) : (
                  <></>
                )}
                {baseAsset.kyc !== "null" ? (
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
                ) : (
                  <></>
                )}
              </CustomPopOver>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
