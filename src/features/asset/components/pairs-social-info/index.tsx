import { Button } from "components/button";
import { NextChakraLink } from "components/link";
import { PopOverLinesStyle, mainButtonStyle } from "features/asset/style";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import Link from "next/link";
import React, { useContext } from "react";
import {
  BsDiscord,
  BsLink45Deg,
  BsShieldCheck,
  BsTelegram,
  BsTwitter,
} from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { LuLink } from "react-icons/lu";
import { SmallFont } from "../../../../components/fonts";
import { cn } from "../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../context-manager";
import { Contracts } from "../contracts";
import { CustomPopOver } from "../ui/popover";

export const PairsSocialInfo = () => {
  const {
    baseAsset,
    setShowPopupSocialMobile,
    switchedToNative,
    setSwitchedToNative,
  } = useContext(BaseAssetContext);
  const [isHoverStar, setIsHoverStar] = React.useState(false);
  const pairsContract = [
    {
      address: baseAsset?.address,
      title: "Pair",
    },
    {
      address: baseAsset?.token0?.address,
      title: baseAsset?.token0?.name,
    },
    {
      address: baseAsset?.token1?.address,
      title: baseAsset?.token1?.name,
    },
  ];

  const links = [
    baseAsset?.social?.twitter || null,
    baseAsset?.social?.chat || null,
    baseAsset?.social?.discord || null,
    baseAsset?.social?.white_paper || null,
    baseAsset?.social?.telegram || null,
    baseAsset?.social?.audit || null,
    baseAsset?.social?.kyc || null,
  ];

  const socials = [
    baseAsset?.social?.twitter
      ? {
          name: "Twitter",
          icon: (
            <BsTwitter className="text-sm text-twitter dark:text-twitter mr-2" />
          ),
          url: baseAsset?.social?.twitter,
          username: baseAsset?.social?.twitter.split("https://twitter.com/")[1],
        }
      : null,
    baseAsset?.social?.chat
      ? {
          name: "Telegram",
          icon: (
            <BsTelegram className="text-sm text-telegram dark:text-telegram mr-2" />
          ),
          url: baseAsset?.social?.chat,
          username: baseAsset?.social?.chat.split("https://t.me/")[1],
        }
      : null,
    baseAsset?.social?.discord
      ? {
          name: "Discord",
          icon: (
            <BsDiscord className="text-sm text-discord dark:text-discord mr-2" />
          ),
          url: baseAsset?.social?.discord,
        }
      : null,
  ];
  return (
    <div className="flex items-center justify-between lg:w-full">
      <div className="flex items-center lg:mt-2.5">
        <CustomPopOver
          title={"Contracts"}
          logo={
            blockchainsContent[baseAsset?.blockchain]?.logo ||
            `/logo/${
              baseAsset?.blockchain?.[0]?.toLowerCase().split(" ")[0]
            }.png`
          }
          position="left-1/2 -translate-x-1/2"
          isMobile
          isPair
        >
          {pairsContract?.map((pair, index: number) =>
            pair ? (
              <div
                className={`flex text-light-font-100 dark:text-dark-font-100 ${
                  index > 0 ? "mt-2.5" : "mt-0"
                }`}
                key={(pair?.address || 0) + index}
              >
                <Contracts
                  contract={pair?.address}
                  title={pair?.title || ""}
                  blockchain={baseAsset?.blockchain as BlockchainName}
                />
              </div>
            ) : (
              <></>
            )
          )}
        </CustomPopOver>
        <div className="flex md:hidden">
          {socials.filter((entry) => entry !== null).length > 0 ? (
            <CustomPopOver
              title="Socials"
              position="left-1/2 -translate-x-1/2"
              icon={<FaRegUser className="flex md:hidden mr-[5px] text-xs" />}
              isPair
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
                        extraCss="mb-2 md:mb-0"
                      >
                        <div
                          className={`${
                            i !== 0 || i !== socials.length ? "mb-0" : "mb-2.5"
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
          ) : null}
        </div>
        {baseAsset?.social?.website ? (
          <Button extraCss={`${mainButtonStyle} mb-0`}>
            <Link
              href={baseAsset?.social?.website as string}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-center">
                <BsLink45Deg className="mr-[5px] text-base text-light-font-100 dark:text-dark-font-100" />
                Web
                <FiExternalLink className="ml-[5px] text-sm text-light-font-60 dark:text-dark-font-60 sm:hidden" />
              </div>
            </Link>
          </Button>
        ) : null}
        <div className="flex lg:hidden">
          {(baseAsset?.social?.audit && baseAsset?.social?.audit !== "null") ||
          (baseAsset?.social?.kyc && baseAsset?.social?.kyc !== "null") ? (
            <CustomPopOver
              title="Audits"
              icon={
                <BsShieldCheck className="flex md:hidden mr-[5px] text-xs" />
              }
              position="left-1/2 -translate-x-1/2"
              isPair
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
          ) : null}{" "}
        </div>
        <Button
          extraCss={cn(`hidden lg:flex`, mainButtonStyle)}
          onClick={() => setShowPopupSocialMobile(true)}
        >
          <LuLink className="mr-[7.5px] ml-0.5" />
          <SmallFont>
            {links.filter((entry) => entry !== null).length > 0
              ? `+ ${links.filter((entry) => entry !== null).length}`
              : ""}
          </SmallFont>
        </Button>
      </div>
      <Button
        extraCss="mb-0 h-[30px] lg:mt-2.5 flex"
        onClick={() => setSwitchedToNative((prev) => !prev)}
      >
        <HiOutlineSwitchHorizontal className="mr-1.5 text-sm md:text-sm" />
        {switchedToNative ? "USD" : baseAsset?.[baseAsset?.quoteToken]?.symbol}
      </Button>

      {/* <Button
        extraCss={cn(
          `hidden lg:flex mb-0 mt-2.5 cursor-not-allowed px-2 relative`,
          mainButtonStyle
        )}
        onClick={() => setIsHoverStar((prev) => !prev)}
      >
        <SmallFont extraCss="opacity-50">Top Holders</SmallFont>

        <div
          className={`absolute right-0 top-[30px] bg-light-bg-terciary dark:bg-dark-bg-terciary p-1.5 shadow-2xl
           border border-light-border-primary dark:border-dark-border-primary rounded ${
             isHoverStar ? "opacity-100 scale-100" : "scale-90 opacity-0"
           } transition-all duration-100 ease-linear`}
        >
          <SmallFont>Coming soon! </SmallFont>
        </div>
      </Button> */}
    </div>
  );
};
