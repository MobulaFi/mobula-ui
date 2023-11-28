import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Flex,
  Image,
  Table,
  TableContainer,
  Tbody,
  Text,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg } from "react-icons/bs";
import { MediumFont, SmallFont } from "../../../../../components/fonts";
import { NextImageFallback } from "../../../../../components/image";
import { ILaunchpad } from "../../../../../interfaces/launchpads";
import { useColors } from "../../../../../lib/chakra/colorMode";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import {
  addressSlicer,
  getFormattedAmount,
} from "../../../../../utils/formaters";
import { BaseAssetContext } from "../../../context-manager";
import { Distribution } from "./distribution";
import { Lines } from "./lines";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const Tokenomic = () => {
  const { baseAsset } = useContext(BaseAssetContext);
  const { text80, text40, borders, text60, text10 } = useColors();
  const [isCopied, setIsCopied] = useState("");
  const [launchpads, setLaunchpads] = useState<ILaunchpad[]>([]);

  const getPercentageOfSupply = () => {
    if (baseAsset)
      return (baseAsset.circulating_supply / baseAsset.total_supply) * 100;

    return 0;
  };

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setIsCopied(text);
    setTimeout(() => {
      setIsCopied("");
    }, 2000);
  }

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    supabase
      .from("launchpads")
      .select("logo,name")
      .then((r) => {
        if (r.data) setLaunchpads(r.data);
      });
  }, []);

  function timestampToDate(timestamp: number) {
    const date = new Date(timestamp);
    let day: string | number = date.getDate();
    let month: string | number = date.getMonth() + 1;
    const year = date.getFullYear();
    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;
    return `${day}/${month}/${year}`;
  }

  const getLogoFromLaunchpad = (name: string) => {
    const logo = launchpads?.find((l) => l.name === name)?.logo;
    return logo;
  };

  return (
    <div className="flex flex-row lg:flex-col-reverse w-full md:w-[95%] mx-auto mt-5 lg:mt-0">
      <div className="flex flex-col max-w-[990px] w-calc-full-345 lg:w-full mr-[25px] lg:mr-0">
        <div className="flex flex-col mt-0 lg:mt-5">
          <div className="flex items-center justify-between mb-[15px]">
            <MediumFont extraCss="mb-2.5 md:mb-0">Supply Breakdown</MediumFont>
            <div className="w-[350px] h-[30px] flex items-center lg:hidden">
              <div
                className="flex h-[7px] rounded-full bg-light-border-primary dark:bg-dark-border-primary max-w-calc-full-345"
                style={{
                  width: "calc(100% - 30px)",
                }}
              >
                <div
                  className="h-full bg-blue dark:bg-blue rounded-full"
                  style={{
                    width: `${getPercentageOfSupply().toFixed(2)}%`,
                  }}
                />
              </div>
              <SmallFont extraCss="ml-2.5">
                {getPercentageOfSupply().toFixed(2)}%
              </SmallFont>
            </div>
          </div>
          <div className="w-full flex flex-wrap">
            <Lines
              title="Total Supply"
              value={getFormattedAmount(baseAsset.total_supply) || 0}
              odd
            />
            <Lines
              title={`${baseAsset?.blockchains[0]} contract address`}
              value={
                getFormattedAmount(baseAsset.total_supply_contracts[0]) || "--"
              }
            />
            <Lines
              title="Circulating Supply"
              value={getFormattedAmount(baseAsset.circulating_supply) || 0}
              odd
            />
            <Lines
              title="Non-Circulating Supply"
              value={
                getFormattedAmount(
                  baseAsset.total_supply - baseAsset.circulating_supply
                ) || 0
              }
            />
          </div>
          <MediumFont extraCss="mt-[30px] mb-2.5 flex lg:hidden">
            Accounts excluded from circulation
          </MediumFont>
          <div className="flex w-full flex-wrap">
            {baseAsset?.blockchains?.map((entry, i) => (
              <div
                key={entry}
                className={`flex items-center justify-between w-2/4 md:w-full py-2.5 border-b
               border-light-border-primary dark:border-dark-border-primary px-[15px] ${
                 i % 2 === 0 ? "border-r" : ""
               }`}
              >
                <div className="flex items-center">
                  <NextImageFallback
                    width={25}
                    height={25}
                    className="mr-2.5 rounded-full"
                    src={blockchainsContent[entry]?.logo || "/icon/unknown.png"}
                    alt={`${entry} logo`}
                    fallbackSrc={""}
                  />
                  <SmallFont>{entry}</SmallFont>
                  <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 ml-[7.5px]">
                    {addressSlicer(baseAsset?.contracts[i])}
                  </SmallFont>
                  <button
                    className="text-[13px]"
                    onClick={() => copyToClipboard(baseAsset?.contracts[i])}
                  >
                    {isCopied === baseAsset?.contracts[i] ? (
                      <BsCheckLg className="text-green dark:text-green ml-[7.5px]" />
                    ) : (
                      <BiCopy className="text-light-font-40 dark:text-dark-font-40 ml-[7.5px]" />
                    )}
                  </button>
                </div>
                <SmallFont extraCss="text-end text-light-font-60 dark:text-dark-font-60">
                  543,654 {baseAsset?.symbol}
                </SmallFont>
              </div>
            ))}
          </div>
        </div>
        <Distribution display={["flex", "flex", "flex", "none"]} mt="20px" />
        <div className="flex flex-col mt-[30px] lg:mt-0">
          <Accordion allowToggle allowMultiple defaultIndex={0}>
            {baseAsset?.sales
              ?.sort((a, b) => a.date - b.date)
              ?.map((sale) => (
                <AccordionItem
                  p="0px"
                  border="none"
                  mb="0px"
                  borderRadius="12px"
                >
                  <AccordionButton
                    borderBottom={borders}
                    _hover={{ bg: "none" }}
                    py="15px"
                    px="0px"
                  >
                    <Text
                      fontSize={["14px", "14px", "16px", "18px"]}
                      color={text80}
                    >
                      {`${sale.name} (${timestampToDate(sale.date)})`}
                    </Text>
                    <AccordionIcon ml="auto" />
                  </AccordionButton>

                  <AccordionPanel pb="10px" p="0px">
                    <TableContainer className="scroll">
                      <Table variant="simple">
                        <Thead>
                          <Tr>
                            <Ths py="12.5px">Price</Ths>
                            <Ths py="12.5px">Tokens For Sale</Ths>
                            <Ths py="12.5px">Raised</Ths>
                            <Ths py="12.5px" isNumeric>
                              Platform
                            </Ths>
                          </Tr>
                        </Thead>
                        <Tbody>
                          <Tr>
                            <Tds
                              color={text80}
                              fontSize={["12px", "12px", "13px", "14px"]}
                              borderBottom={borders}
                            >
                              $
                              {getFormattedAmount(sale.valuation / sale.amount)}
                            </Tds>
                            <Tds
                              color={text80}
                              fontSize={["12px", "12px", "13px", "14px"]}
                              borderBottom={borders}
                            >
                              {`${getFormattedAmount(sale.amount)} ${
                                baseAsset?.symbol
                              }`}
                            </Tds>
                            <Tds
                              color={text80}
                              fontSize={["12px", "12px", "13px", "14px"]}
                              borderBottom={borders}
                            >
                              {`$${getFormattedAmount(sale.valuation)}`}
                            </Tds>
                            <Tds
                              fontSize={["12px", "12px", "13px", "14px"]}
                              borderBottom={borders}
                              color={text80}
                              isNumeric
                            >
                              {sale.platform ? (
                                <Flex align="center" justify="end">
                                  <Image
                                    src={
                                      getLogoFromLaunchpad(sale.platform) ||
                                      "/icon/unknown.png"
                                    }
                                    boxSize="20px"
                                    borderRadius="full"
                                    mr="7.5px"
                                  />
                                  {sale.platform}{" "}
                                </Flex>
                              ) : (
                                "N/A"
                              )}
                            </Tds>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </AccordionPanel>
                </AccordionItem>
              ))}{" "}
          </Accordion>
        </div>
        {baseAsset?.release_schedule?.length > 0 ? (
          <>
            <MediumFont extraCss="mt-[30px] mb-2.5 flex lg:hidden">
              Vesting schedules
            </MediumFont>
            <EChart
              data={baseAsset?.release_schedule || []}
              timeframe="ALL"
              leftMargin={["15%", "7%"]}
            />
          </>
        ) : null}
      </div>
      <div className="flex flex-col lg:hidden max-w-[345px] w-full">
        <Distribution />
        {/* <Fees /> */}
        {/* <ListingDetails /> */}
      </div>
    </div>
  );
};
