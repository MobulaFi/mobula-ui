"use client";
import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import { useParams, usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { FaLink } from "react-icons/fa6";
import { FiExternalLink, FiSearch } from "react-icons/fi";
// import { User } from "react-feather";
import { BsCheckLg, BsChevronDown, BsCodeSlash } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa6";
import { createPublicClient, formatEther, getContract, http } from "viem";
import { polygon } from "viem/chains";
import { Collapse } from "../../../../../../../components/collapse";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { NextChakraLink } from "../../../../../../../components/link";
import { ModalContainer } from "../../../../../../../components/modal-container";
import { Popover } from "../../../../../../../components/popover";
import { Skeleton } from "../../../../../../../components/skeleton";
import { PROTOCOL_ADDRESS } from "../../../../../../../constants";
import { Asset } from "../../../../../../../interfaces/assets";
import { getUrlFromName } from "../../../../../../../utils/formaters";
import { Contracts } from "../../../../../../asset/components/contracts";
import { BoxContainer } from "../../../../../common/components/box-container";
import { PROTOCOL_ABI } from "../../../../constants/abi";
import { SortContext } from "../../../../context-manager";
import { getPricing } from "../../../../utils";
// @ts-ignore
import styles from "../box-prevote/Prevote.module.scss";
import { CommunityPopup } from "../popup-community";

interface BoxPreVoteProps {
  token: Asset;
  isFakeToken?: boolean;
}

const RenderContent = ({ token, handleToggle, show }) => {
  if (!token) {
    return (
      <Skeleton extraCss="mr-2.5 w-[80px] mt-[15px] h-[16px] lg:h-[15px] md:h-[14px]" />
    );
  }
  if (token?.description && token.description?.length < 190) {
    return null;
  }
  return (
    <button
      className="text-sm lg:text-[13px] md:text-xs text-light-font-100 dark:text-dark-font-100 mt-2.5"
      onClick={handleToggle}
    >
      Show {show ? "Less" : "More"}
    </button>
  );
};

export const BoxPreVote = ({ token, isFakeToken }: BoxPreVoteProps) => {
  const [showRawData, setShowRawData] = useState(false);
  const {
    setDisplayedToken,
    displayedToken,
    setDisplayedPool,
    displayedPool,
    isPendingPool,
  } = useContext(SortContext);
  const [show, setShow] = React.useState(false);
  const handleToggle = () => setShow(!show);
  const router = useRouter();
  const [tokenPerVote, setTokenPerVote] = useState(0);
  const pathname = usePathname();
  const params = useParams();
  const sortQuery = params.sort;
  const validationQuery = params.validation;
  const poolQuery = params.pool;
  const [showPopover, setShowPopover] = useState({
    kyc: false,
    audit: false,
    community: false,
    contract: false,
  });

  const buttonPopover =
    "flex items-center text-[13px] mb-2.5 h-[30px] transition-all duration-250 border border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100 rounded font-medium hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover";

  const calculateValue = (): string => {
    if (!displayedToken && !isFakeToken) return "60px";
    if (isFakeToken) return "20px";
    return "40px";
  };
  const descriptionHeight = calculateValue();

  const getMOBLForVote = async () => {
    const client = createPublicClient({
      chain: polygon,
      transport: http(blockchainsIdContent[137].rpcs[0]),
    });

    const contract: any = getContract({
      abi: PROTOCOL_ABI,
      address: PROTOCOL_ADDRESS as never,
      publicClient: client as any,
    });

    const rawTokensPerVote = (await contract.read.tokensPerVote()) as bigint;
    const tokensPerVote = parseInt(formatEther(rawTokensPerVote), 10);
    setTokenPerVote(tokensPerVote);
  };

  useEffect(() => {
    getMOBLForVote();
  }, []);

  const getClassNameFromRatio = () => {
    if (Number(token.coeff) / 1000 >= 10) return styles.best;
    if (Number(token.coeff) / 1000 >= 3 && Number(token.coeff) / 1000 < 10)
      return styles.good;
    return "";
  };

  const getTypeOfToken = () => {
    switch (token?.type) {
      case "token":
        return " is a token";
      case "nft":
        return " is an NFT";
      case "coin":
        return " has its own blockchain";
      default:
        return "";
    }
  };

  const getPercentageFromCoeff = (price: number) => {
    if (price) return (price * 100) / 30;
    return 0;
  };

  if (sortQuery || validationQuery || (poolQuery && token?.name)) {
    if (
      !isPendingPool &&
      sortQuery === getUrlFromName(token?.name) &&
      displayedToken !== token.name
    )
      setDisplayedToken(token.name);
    if (
      !isPendingPool &&
      validationQuery === getUrlFromName(token?.name) &&
      displayedToken !== token.name
    )
      setDisplayedToken(token.name);
    if (
      isPendingPool &&
      poolQuery === getUrlFromName(token?.name) &&
      displayedPool !== token.name
    ) {
      setDisplayedPool(token.name);
    }
  }

  return (
    <BoxContainer
      extraCss={`mb-5 relative min-h-[210px] md:min-h-auto transition-all duration-250 py-[15px] px-5 lg:px-[15px] 
    rounded-2xl sm:rounded-0 ${
      token?.alreadyVoted ? "cursor-not-allowed" : "cursor-pointer"
    }`}
      onClick={() => {
        if (true) {
          if (!isPendingPool) {
            if (pathname.includes("/sort"))
              router.push(`/dao/protocol/sort/${getUrlFromName(token.name)}`);
            if (pathname.includes("/validation"))
              router.push(
                `/dao/protocol/validation/${getUrlFromName(token.name)}`
              );
          } else {
            router.push(`/dao/protocol/pool/${getUrlFromName(token.name)}`);
          }
        }
      }}
    >
      <div
        className={`flex justify-between w-full mb-5 md:mb-2.5 items-center flex-row ${
          isPendingPool ? "sm:items-start sm:flex-col" : ""
        }`}
      >
        <div className="flex items-center">
          {token ? (
            <img
              className="w-[22px] h-[22px] rounded-full mr-2.5"
              src={token?.image?.logo || token?.logo}
              alt={`${token?.name} logo`}
            />
          ) : (
            <Skeleton extraCss="w-[22px] h-[22px] rounded-full mr-2.5" />
          )}
          {token ? (
            <MediumFont>{token?.name}</MediumFont>
          ) : (
            <Skeleton extraCss="w-[120px] h-[18px] lg:h-[17px] md:h-[16px] rounded-full mr-2.5" />
          )}
          {token ? (
            <MediumFont extraCss="text-light-font-40 dark:text-dark-font-40 ml-2.5">
              {token?.symbol}
            </MediumFont>
          ) : (
            <Skeleton extraCss="w-[60px] h-[18px] lg:h-[17px] md:h-[16px] rounded-full mr-2.5" />
          )}
          {token?.coeff ? (
            <div className="flex items-center ml-2.5 pl-2.5 border-l-2 border-light-border-primary dark:border-dark-border-primary">
              <img
                src="/mobula/coinMobula.png"
                className="w-4 h-4"
                alt="mobula logo"
              />
              <MediumFont extraCss="ml-[5px]">
                {token?.coeff ? Number(token.coeff) / 1000 : 0}
              </MediumFont>
            </div>
          ) : null}
        </div>
        {token?.name !== "Come back later!" &&
        token.coeff &&
        !isPendingPool &&
        token ? (
          <div className="flex sm:hidden">
            <MediumFont extraCss="border-l-2 pl-2.5 border-light-border-primary dark:border-dark-border-primary">
              {`${token.isListing ? "Listing" : "Edit"} request`}
            </MediumFont>
          </div>
        ) : null}
        {isPendingPool && token?.name !== "Come back later!" ? (
          <div
            className="flex items-center justify-end w-[250px] whitespace-nowrap mt-0 
          sm:mt-2.5 text-light-font-100 dark:text-dark-font-100"
          >
            {getPricing(token?.coeff) < 30
              ? `$${30 - getPricing(token?.coeff)} Left`
              : "Full"}
            <div className="flex h-2 rounded bg-light-bg-hover dark:bg-dark-bg-hover mt-0.5 w-full ml-2.5">
              <div
                className="rounded h-full bg-blue dark:bg-blue"
                style={{
                  width: `${getPercentageFromCoeff(getPricing(token?.coeff))}%`,
                }}
              />
            </div>
          </div>
        ) : null}
      </div>
      {sortQuery === getUrlFromName(token?.name) ||
      validationQuery === getUrlFromName(token?.name) ||
      poolQuery === getUrlFromName(token?.name) ? (
        <div className="flex items-center flex-wrap w-full">
          {token?.links?.website ? (
            <div
              className={`mr-2.5 max-w-[200px] justify-center ${buttonPopover}`}
            >
              <NextChakraLink
                href={token?.links.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center">
                  <FaLink className="mr-[7.5px] mb-[1px]" />
                  <SmallFont extraCss="truncate overflow-x-hidden max-w-[130px] mb-[1px]">
                    {token?.links.website}
                  </SmallFont>{" "}
                </div>
              </NextChakraLink>
              <FiExternalLink className="ml-[7.5px] text-[13px] mb-[1px] text-light-font-40 dark:text-dark-font-40" />
            </div>
          ) : null}
          {token?.links?.twitter ||
          token?.links?.telegram ||
          token?.links?.discord ? (
            <Popover
              visibleContent={
                <button
                  className={`${buttonPopover} mr-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary`}
                >
                  <FaRegUser className="text-[13px] mr-[5px]" />
                  Community
                  <BsChevronDown className="text-[15px] ml-[5px]" />
                </button>
              }
              hiddenContent={<CommunityPopup token={token as any} />}
              onToggle={() =>
                setShowPopover((prev) => ({
                  ...prev,
                  community: !prev.community,
                }))
              }
              isOpen={showPopover.community}
            />
          ) : null}
          {token?.contracts ? (
            <Popover
              visibleContent={
                <button
                  className={`${buttonPopover} mr-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary`}
                >
                  <FiSearch className="text-[13px] mr-[5px]" />
                  Contracts
                  <BsChevronDown className="text-[15px] ml-[5px]" />
                </button>
              }
              hiddenContent={token.contracts?.map(
                (contract: any, index: number) =>
                  contract.blockchain && (
                    <div
                      className={`text-light-font-100 dark:text-dark-font-100 ${
                        index > 0 ? "mt-2.5" : ""
                      }`}
                      key={contract.blockchain}
                    >
                      <Contracts
                        contract={contract.address}
                        blockchain={contract.blockchain}
                      />
                    </div>
                  )
              )}
              onToggle={() =>
                setShowPopover((prev) => ({
                  ...prev,
                  contract: !prev.contract,
                }))
              }
              isOpen={showPopover.contract}
            />
          ) : null}
          <button
            className={`${buttonPopover} mr-2.5 relative`}
            onClick={() => setShowRawData((prev) => !prev)}
          >
            <BsCodeSlash className="text-[15px] mr-[5px]" />
            Raw Data
          </button>
          <ModalContainer
            title="Raw Data"
            extraCss="w-[90vw] lg:w-[85vw] md:w-[90vw] h-fit"
            isOpen={showRawData}
            onClose={() => setShowRawData(false)}
          >
            <div className="flex w-full text-light-font-100 dark:text-dark-font-100 flex-wrap overflow-y-hidden">
              {token ? (
                <pre
                  style={{
                    width: "100%",
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {JSON.stringify(
                    token,
                    (_, v) => {
                      if (typeof v === "bigint") {
                        return v.toString();
                      }
                      return v;
                    },
                    2
                  )}
                </pre>
              ) : null}
            </div>
          </ModalContainer>
          {token?.links?.audits.length > 0 ? (
            <Popover
              visibleContent={
                <button
                  className={`${buttonPopover} mr-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary`}
                >
                  Audit
                  <BsChevronDown className="text-[15px] ml-[5px]" />
                </button>
              }
              hiddenContent={token.links?.audits
                ?.filter((entry) => entry)
                .map((audit, index: number) => (
                  <div
                    className={`flex text-light-font-100 dark:text-dark-font-100 border border-light-border-primary 
                dark:border-dark-border-primary bg-light-bg-terciary dark:bg-dark-bg-terciary rounded px-2.5 
                hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover transition-all duration-250 py-1 ${
                  index > 0 ? "mt-2.5" : ""
                }`}
                    key={audit}
                  >
                    <NextChakraLink
                      href={audit}
                      extraCss="text-[13px]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`${audit.slice(0, 20)}...`}
                      <FiExternalLink className="ml-[7.5px] text-[13px] text-light-font-60 dark:text-dark-font-60" />
                    </NextChakraLink>
                  </div>
                ))}
              onToggle={() =>
                setShowPopover((prev) => ({ ...prev, audit: !prev.audit }))
              }
              isOpen={showPopover.audit}
            />
          ) : null}
          {token?.links?.kycs.length > 0 ? (
            <Popover
              onToggle={() =>
                setShowPopover((prev) => ({ ...prev, kyc: !prev.kyc }))
              }
              isOpen={showPopover.kyc}
              visibleContent={
                <button
                  className={`${buttonPopover} mr-2.5 bg-light-bg-terciary dark:bg-dark-bg-terciary`}
                >
                  <FiSearch className="text-[13px] ml-[5px]" />
                  Kyc
                  <BsChevronDown className="text-[15px] ml-[5px]" />
                </button>
              }
              hiddenContent={token.links?.kycs
                ?.filter((entry) => entry)
                .map((kyc, index: number) => (
                  <div
                    className={`flex text-light-font-100 dark:text-dark-font-100 border border-light-border-primary 
                dark:border-dark-border-primary bg-light-bg-terciary dark:bg-dark-bg-terciary rounded px-2.5 
                hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover transition-all duration-250 py-1 ${
                  index > 0 ? "mt-2.5" : ""
                }`}
                    key={kyc}
                  >
                    <NextChakraLink
                      href={kyc}
                      extraCss="text-[13px]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {`${kyc.slice(0, 20)}...`}
                      <FiExternalLink className="ml-[7.5px] text-[13px] text-light-font-60 dark:text-dark-font-60" />
                    </NextChakraLink>
                  </div>
                ))}
            />
          ) : null}
        </div>
      ) : null}
      <p
        className={`text-sm text-light-font-60 dark:text-dark-font-60 pb-0 
        md:pb-2.5 transition-all duration-250 max-w-[600px] ${
          displayedToken ? "mt-[15px] max-h-auto" : "mt-2.5 max-h-[300px]"
        } text-start`}
      >
        <Collapse startingHeight={descriptionHeight} isOpen={show}>
          {token?.description}
        </Collapse>
        <RenderContent token={token} handleToggle={handleToggle} show={show} />
      </p>
      {displayedToken === token?.name || displayedPool === token?.name ? (
        <div className="flex w-full flex-wrap mt-5 sm:mt-2.5">
          {token?.categories?.map((entry) => (
            <div
              className="flex h-6 px-2.5 mr-2.5 rounded items-center justify-center w-fit mb-2.5
             lg:mb-0 bg-light-bg-tags dark:bg-dark-bg-tags"
              key={entry}
            >
              <SmallFont extraCss="h-full mt-[3px] lg:mt-[5.2px] md:mt-1.5 sm:mt-1 mb-0.5 lg:mb-0 truncate">
                {entry}
              </SmallFont>
            </div>
          ))}
        </div>
      ) : null}
      {isFakeToken && displayedToken !== token.name ? (
        <p className="text-light-font-40 dark:text-dark-font-40 text-sm mr-[5px]">
          Earn up to 100 $MOBL for pushing token creator to list their asset on
          Mobula! Learn more about it at{" "}
          <NextChakraLink href="https://docs.mobula.fi">
            docs.mobula.fi
          </NextChakraLink>
        </p>
      ) : null}
      {token?.alreadyVoted ? (
        <div
          className="flex text-green dark:text-green mt-auto px-3 rounded w-fit bg-light-bg-terciary
         dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary h-[28px] items-center"
        >
          <BsCheckLg />
          <SmallFont extraCss="font-bold text-green dark:text-green ml-[5px]">
            Reviewed
          </SmallFont>
        </div>
      ) : null}
      {(!token?.alreadyVoted && displayedToken) ||
      (!token?.alreadyVoted && displayedPool) ? (
        <div className="flex mt-5 items-center w-full pt-2.5 border-t border-light-border-primary dark:border-dark-border-primary">
          <SmallFont extraCss="font-medium ml-[5px]">
            {token?.name} {getTypeOfToken()}
          </SmallFont>
          <BsCheckLg className="text-green dark:text-green ml-2.5" />
        </div>
      ) : null}
      {!displayedToken ? (
        <div
          className={`${getClassNameFromRatio()} w-full h-full sm:h-5 absolute rounded sm:rounded-0 z-[-1]`}
        />
      ) : null}
    </BoxContainer>
  );
};
