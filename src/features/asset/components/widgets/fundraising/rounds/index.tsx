import { getFormattedAmount, getTokenPercentage } from "@utils/formaters";
import { Popover } from "components/popover";
import { TagPercentage } from "components/tag-percentage";
import { useTheme } from "next-themes";
import React, { useContext, useState } from "react";
import { MdCurrencyExchange } from "react-icons/md";
import { Accordion } from "../../../../../../components/accordion";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { NextImageFallback } from "../../../../../../components/image";
import { BaseAssetContext } from "../../../../context-manager";

export const Rounds = () => {
  const { baseAsset } = useContext(BaseAssetContext);
  const [hasError, setHasError] = useState(false);
  const arr = [1, 2, 3, 4, 5, 5];
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showPopover, setShowPopover] = useState("");
  const getTokenomics = (sale) => [
    {
      name: "Tokens for Sale",
      value: getFormattedAmount(sale.amount || 0),
    },
    {
      name: "% of Total Supply",
      value: getTokenPercentage(sale.amount / (baseAsset?.total_supply || 0)),
    },
    {
      name: "Pre-valuation",
      value: getFormattedAmount(sale.valuation || 0),
    },
    {
      name: "Platform",
      value: sale.platform || "--",
    },
    {
      name: "Price",
      value: sale.price,
    },
    {
      name: "Fundraising Goal",
      value: sale.fundraisingGoal !== 0 ? sale.fundraisingGoal : "--",
    },
  ];

  const getPercentageFromVestingType = (vestingType: any): string | number => {
    if (vestingType?.includes("/")) {
      const [unlockedStr, totalStr] = vestingType.split("/");
      const extractNumber = (str) => parseInt(str.match(/\d+/)[0], 10);
      const unlocked = extractNumber(unlockedStr);
      const total = extractNumber(totalStr);
      return (unlocked / total) * 100;
    }
    if (vestingType?.includes("100%")) return 100;
    if (vestingType?.includes("No Lock")) return 100;
    return "?";
  };

  function formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { day: "numeric", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-US", options as any);
  }

  const getLogoFromLaunchPlatform = (name) => {
    if (name === ("Series A" || "Series B")) return "/";
    if (!name.includes("Public Sale (")) return "/mobula/unknown.png";
    const extractPlatform = (str) => str.match(/\(([^)]+)\)/)?.[1];
    const removeUselessValue = extractPlatform(name).split(" ")[2];
    switch (removeUselessValue) {
      case "KuCoin":
        return "https://assets.staticimg.com/cms/media/3gfl2DgVUqjJ8FnkC7QxhvPmXmPgpt42FrAqklVMr.png";
      case "BitForex":
        return "https://seeklogo.com/images/B/bitforex-logo-332849AE2A-seeklogo.com.png";
      case "OKX":
        return "https://altcoinsbox.com/wp-content/uploads/2023/03/okx-logo-black-and-white.jpg";
      case "Bybit":
        return "https://altcoinsbox.com/wp-content/uploads/2022/10/bybit-logo-white.jpg";
      case "Gate.io":
        return "https://altcoinsbox.com/wp-content/uploads/2022/10/gate-io-logo-white.jpg";
      case "Binance":
        return "https://altcoinsbox.com/wp-content/uploads/2022/10/binance-logo-white.jpg";
      case "Huobi":
        return "https://altcoinsbox.com/wp-content/uploads/2022/10/huobi-logo-white.jpg";
      default:
        return "/mobula/unknown.png";
    }
  };

  const getValue = (name, value) => {
    if (name === "Price") {
      if (value) return `$${getFormattedAmount(value)}`;
      return "--";
    }
    if (value && typeof value === "number")
      return `${getFormattedAmount(value)}`;
    if (value && typeof value === "string") return value;
    return "--";
  };

  return (
    <>
      <LargeFont extraCss="mb-[15px]">Fundraising Rounds</LargeFont>
      {baseAsset?.sales
        ?.sort((a, b) => b.date - a.date)
        ?.filter((entry) => entry.date)
        ?.map((sale) => {
          const leadInvestor = sale.investors?.find((entry) => entry.lead);
          const percentageOfVestingShare: any = getTokenPercentage(
            getPercentageFromVestingType(
              (sale?.unlockType as string) || ("0/0" as string)
            ) as any
          ) as any;
          const unlockedAmount =
            (Number(sale.amount) * Number(percentageOfVestingShare)) / 100 || 0;
          const platformImage = getLogoFromLaunchPlatform(sale.name);
          return (
            <Accordion
              key={sale.id}
              extraCss="rounded-lg bg-light-bg-secondary dark:bg-dark-bg-secondary p-2.5 mb-[15px] border 
                border-light-border-primary dark:border-dark-border-primary hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover 
                transition-all duration-300 ease-in-out"
              visibleContent={
                <>
                  <div className="flex items-center">
                    {hasError ? (
                      <div
                        className="flex w-[30px] h-[30px] rounded-full items-center justify-center border 
                       border-light-border-primary dark:border-dark-border-primary mr-[7.5px] bg-light-bg-hover  dark:bg-dark-bg-hover"
                      >
                        <MdCurrencyExchange className="text-light-font-100 dark:text-dark-font-100 text-lg" />
                      </div>
                    ) : (
                      <NextImageFallback
                        height={30}
                        width={30}
                        style={{
                          border: isDark
                            ? "1px solid rgba(255,255,255,0.03)"
                            : "1px solid rgba(0,0,0,0.03)",
                          borderRadius: "50%",
                          marginRight: "7.5px",
                        }}
                        className=""
                        fallbackSrc="/empty/unknown.png"
                        src={platformImage}
                        onError={() => setHasError(true)}
                        alt={"Platform Image"}
                      />
                    )}

                    <div className="flex flex-col items-start">
                      <div className="flex items-center flex-wrap mr-2.5">
                        <LargeFont extraCss="text-start mr-2.5">
                          {`${sale.name}`}
                        </LargeFont>
                        <MediumFont>{formatDate(sale.date)}</MediumFont>
                      </div>
                      <div className="flex">
                        <SmallFont extracss="mr-2.5 text-start">
                          Price:{" "}
                          <span className="font-medium">
                            {getFormattedAmount(sale.price)}$
                          </span>
                        </SmallFont>
                        <SmallFont extracss="text-start">
                          Raised:{" "}
                          <span className="font-medium">
                            ${getFormattedAmount(sale.raised)}
                          </span>
                        </SmallFont>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center ml-auto">
                    {sale.price !== 0 && sale.price ? (
                      <div className="flex items-center mr-2.5 text-end">
                        <SmallFont extraCss="flex md:hidden">ROI USD</SmallFont>{" "}
                        <TagPercentage
                          percentage={(baseAsset?.price || 0) / sale.price}
                          isUp={(baseAsset?.price || 0) / sale.price > 1}
                          isMultiple
                        />
                      </div>
                    ) : null}
                  </div>
                </>
              }
            >
              <div className={`p-2.5 ${sale.unlockType ? "pb-5" : "pb-0"}`}>
                <MediumFont extraCss="font-bold w-fit pb-0.5 my-[5px]">
                  Tokenomics:
                </MediumFont>
                <div className="flex flex-wrap">
                  {getTokenomics(sale).map((entry, i) => {
                    const even = i % 2 === 0;
                    const isLastTwo =
                      i === arr.length - 1 || i === arr.length - 2;

                    const newValue = getValue(entry.name, entry.value);
                    return (
                      <div
                        className={`w-2/4 sm:w-full p-2.5 justify-between items-center ${
                          isLastTwo ? "sm:border-b" : "border-b"
                        } ${
                          even ? "border-r sm:border-r-0" : ""
                        } border-light-border-primary dark:border-dark-border-primary`}
                        key={entry.name}
                      >
                        <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 font-medium">
                          {entry.name}
                        </SmallFont>
                        {entry.name === "Platform" ? (
                          <SmallFont extraCss="font-bold">
                            {entry.value}
                          </SmallFont>
                        ) : null}
                        {entry.name !== "% of Total Supply" &&
                        entry.name !== "Platform" ? (
                          <SmallFont extraCss="font-bold">{newValue}</SmallFont>
                        ) : null}
                        {entry.name === "% of Total Supply" ? (
                          <div className="flex items-center">
                            <SmallFont extraCss="font-bold">
                              {getTokenPercentage(entry.value)}%
                            </SmallFont>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
                <MediumFont extraCss="w-fit pb-0.5 mb-[15px] pt-5 font-bold">
                  Investors:
                </MediumFont>
                <div className="flex items-center sm:items-start justify-between sm:justify-start flex-row sm:flex-col">
                  <div className="flex items-center mb-0 sm:mb-2.5">
                    <NextImageFallback
                      style={{
                        borderRadius: "50%",
                        marginRight: "7.5px",
                        marginBottom: "-2px",
                      }}
                      height={34}
                      width={34}
                      src={leadInvestor?.image || "/empty/unknown.png"}
                      alt="lead investor logo"
                      fallbackSrc="/empty/unknown.png"
                    />
                    {leadInvestor ? (
                      <div className="flex flex-col">
                        <SmallFont extraCss="font-medium m-0">
                          {leadInvestor?.name}
                        </SmallFont>
                        <div className="flex items-center">
                          <p className="text-xs font-medium text-light-font-60 dark:text-dark-font-60 m-0">
                            {leadInvestor?.type}
                          </p>
                          <div className="bg-blue dark:bg-blue px-[5px] text-[11px] font-bold ml-[7.5px] text-dark-font-100 dark:text-dark-font-100 rounded">
                            Lead
                          </div>
                        </div>
                      </div>
                    ) : (
                      <SmallFont extraCss="font-medium m-0">
                        No Investors found yet
                      </SmallFont>
                    )}
                  </div>{" "}
                  <div className="flex items-center">
                    {sale?.investors
                      ?.filter((entry) => !entry.lead)
                      .map((investor, i) => {
                        if (i < 8)
                          return (
                            <img
                              className="w-[20px] h-[20px] rounded-full bg-light-bg-terciary dark:bg-dark-bg-terciary ml-[-5px]"
                              alt={`${investor?.name} logo`}
                              src={investor?.image || "/empty/unknown.png"}
                            />
                          );
                        return null;
                      })}
                  </div>
                </div>
                <div className="flex mt-5">
                  {sale.unlockType ? (
                    <div className="flex flex-col w-full">
                      <MediumFont extraCss="font-bold w-fit pb-0.5 mb-[5px] pt-2.5">
                        Vesting:
                      </MediumFont>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-light-font-60 dark:text-dark-font-60 font-medium mb-[5px] text-[13px]">
                            Unlock at launch:
                          </p>
                          <p className="text-light-font-100 dark:text-dark-font-100 font-medium mb-[5px] text-[13px] ml-2.5">
                            {sale?.unlockType
                              ? `${getFormattedAmount(unlockedAmount)} SUI`
                              : "--"}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <p className="text-light-font-60 dark:text-dark-font-60 font-medium mb-[5px] text-[13px]">
                            Locked:
                          </p>
                          <p className="text-light-font-100 dark:text-dark-font-100 font-medium mb-[5px] text-[13px] ml-2.5">
                            {sale?.unlockType
                              ? `${getFormattedAmount(
                                  sale.amount - unlockedAmount
                                )}SUI`
                              : "--"}{" "}
                          </p>
                        </div>
                      </div>
                      <Popover
                        extraCss="top-[15px] bg-light-bg-terciary dark:bg-dark-bg-terciary shadow-md"
                        isOpen={showPopover === sale.id}
                        onToggle={() => {
                          if (showPopover === sale.id) setShowPopover("");
                          else setShowPopover(sale.id);
                        }}
                        visibleContent={
                          <div
                            className={`flex w-full mt-[5px] h-[7px] rounded-full bg-light-font-10 dark:bg-dark-font-10 relative overflow-hidden`}
                          >
                            {/* {!sale?.unlockType
                              ? Array.from({length: 11})?.map((_, i) => (
                                  <Flex
                                    w="15%"
                                    h={["200%", "250%", "400%"]}
                                    mx="auto"
                                    top={["-10px", "-20px"]}
                                    position="absolute"
                                    left={`${(i - 1) * 10}%`}
                                    bg={hover}
                                    transform="rotate(-45deg)"
                                  />
                                ))
                              : null} */}
                            <div
                              className="h-full flex bg-light-font-40 dark:bg-dark-font-40 rounded-full"
                              style={{
                                width: `${percentageOfVestingShare}%`,
                              }}
                            />
                          </div>
                        }
                        hiddenContent={
                          <div className="flex flex-col items-center min-w-[200px]">
                            <div className="flex justify-between items-center w-full">
                              <p className="text-light-font-100 dark:text-dark-font-100 text-[13px] mb-[5px] font-medium mr-2.5">
                                Unlocked
                              </p>
                              {sale?.unlockType ? (
                                <p className="text-light-font-60 dark:text-dark-font-60 text-[13px] mb-[5px]">
                                  {getFormattedAmount(unlockedAmount)} SUI
                                </p>
                              ) : (
                                "No data"
                              )}
                            </div>
                            <div className="flex justify-between items-center w-full">
                              <p className="text-light-font-100 dark:text-dark-font-100 text-[13px] mb-[5px] font-medium mr-2.5">
                                Locked
                              </p>
                              <p className="text-light-font-60 dark:text-dark-font-60 text-[13px] mb-[5px]">
                                {getFormattedAmount(
                                  sale.amount - unlockedAmount
                                )}{" "}
                                SUI
                              </p>
                            </div>
                            <div className="h-[1px] w-full bg-light-border-primary dark:bg-dark-border-primary my-[5px]" />
                            <div className="flex justify-between items-center w-full">
                              <p className="text-light-font-100 dark:text-dark-font-100 text-[13px] mb-[5px] font-medium mr-2.5">
                                Percentage
                              </p>
                              <p className="text-light-font-60 dark:text-dark-font-60 text-[13px] mb-[5px]">
                                {`${percentageOfVestingShare}%`}
                              </p>
                            </div>
                            <div className="w-full bg-light-border-primary dark:bg-dark-border-primary h-1.5 rounded-full">
                              <div
                                className="bg-light-font-20 dark:bg-dark-font-20 h-full rounded-full"
                                style={{
                                  width: `${percentageOfVestingShare}%`,
                                }}
                              />
                            </div>
                          </div>
                        }
                      />
                    </div>
                  ) : null}
                  {/* <Flex w="50%" direction="column" ml="20px">
                      <TextLandingSmall
                        fontWeight="600"
                        color={text80}
                        w="fit-content"
                        pb="2px"
                        // borderBottom="1px solid #5C7DF9"
                        mb="5px"
                        pt="10px"
                      >
                        More Details Link:
                      </TextLandingSmall>
                      <NextChakraLink
                        color={text80}
                        href={sale.links?.[0]?.url}
                      >
                        <TextSmall
                          _hover={{color: "blue"}}
                          transition="all 250ms ease-in-out"
                          whiteSpace="nowrap"
                          overflowX="hidden"
                          textOverflow="ellipsis"
                        >
                          {" "}
                          {sale.links?.[0]?.url || "--"}
                        </TextSmall>
                      </NextChakraLink>
                    </Flex> */}
                </div>
              </div>
            </Accordion>
          );
        })}{" "}
    </>
  );
};
