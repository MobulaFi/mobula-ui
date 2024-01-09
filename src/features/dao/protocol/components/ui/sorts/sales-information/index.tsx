import React from "react";
import { SiConvertio } from "react-icons/si";
import { MediumFont } from "../../../../../../../components/fonts";
import { Tds, Ths } from "../../../../../../../components/table";
import { getFormattedAmount } from "../../../../../../../utils/formaters";
import { BoxContainer } from "../../../../../common/components/box-container";
import { TokenDivs } from "../../../../models";
import { thStyles } from "../../../../style";

interface SalesInformationProps {
  token: TokenDivs;
}

export const SalesInformation = ({ token }: SalesInformationProps) => {
  const getDisplay = () => {
    const sales = token?.tokenomics?.sales;
    if (sales?.length > 0) return "flex";
    return "hidden";
  };
  const display = getDisplay();

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year))
      return "N/A";
    return `${day}/${month}/${year}`;
  };
  return (
    <BoxContainer
      extraCss={`mb-5 relative transition-all duration-200 py-[15px] md:py-2.5 px-5 lg:px-[15px] md:px-2.5 rounded-2xl sm:rounded-0 ${display}`}
    >
      <div className="flex items-center pb-5 lg:pb-[15px] md:pb-2.5">
        <SiConvertio className="text-blue dark:text-blue" />
        <MediumFont extraCss="ml-2.5"> Sales Information</MediumFont>
      </div>
      <div className="w-full overflow-x-scroll scroll">
        <table>
          <thead>
            <tr>
              <Ths extraCss={thStyles}>Name</Ths>
              <Ths extraCss={thStyles}>Amount Sold</Ths>
              <Ths extraCss={thStyles}>Price</Ths>
              <Ths extraCss={thStyles}>Platform</Ths>
              <Ths extraCss={thStyles}>Valuation</Ths>
              <Ths extraCss={`${thStyles} text-end`}>Date</Ths>
            </tr>
          </thead>
          <tbody>
            {token?.tokenomics.sales?.map((sale) => (
              <tr key={sale.name}>
                <Tds extraCss="px-2.5 py-[15px]">{sale.name}</Tds>
                <Tds extraCss="px-2.5 py-[15px]">
                  {`${sale.amount} ${token.symbol}`}
                </Tds>
                <Tds extraCss="px-2.5 py-[15px]">
                  ${getFormattedAmount(sale.price)}
                </Tds>
                <Tds extraCss="px-2.5 py-[15px]">{sale.platform}</Tds>
                <Tds extraCss="px-2.5 py-[15px]">{sale.valuation}%</Tds>
                <Tds extraCss="px-2.5 py-[15px] text-end">
                  {formatDate(Number(sale.date))}
                </Tds>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </BoxContainer>
  );
};

/* <Flex mt="15px" direction={["column", "column", "row"]}>
        <Flex
          direction="column"
          w={["100%", "100%", "50%"]}
          pr={["0px", "0px", "10px"]}
        >
          <TextSmall mb="10px" fontWeight="500">
            Excluded Addresses
          </TextSmall>
          {token?.excludedFromCirculationAddresses?.map(
            ({address, blockchain}) => (
              <Flex
                h="35px"
                bg={boxBg6}
                border={borders}
                color={text80}
                w="100%"
                mx="auto"
                borderRadius="8px"
                align="center"
                px="6px"
                mb="7.5px"
              >
                <Image
                  src={
                    blockchainsContent[blockchain]?.logo || "/icon/unknown.png"
                  }
                  boxSize="22px"
                  borderRadius="full"
                  mr="7.5px"
                />
                <TextLandingSmall>{addressSlicer(address)}</TextLandingSmall>
                <ExternalLinkIcon color={text40} ml="auto" />
              </Flex>
            ),
          )}
        </Flex>
        <Flex
          direction="column"
          w={["100%", "100%", "50%"]}
          pl={["0px", "0px", "10px"]}
          mt={["15px", "15px", "0px"]}
        >
          <TextSmall mb="10px" fontWeight="500">
            Share(s) & Initials Tokens
          </TextSmall>
          {token?.totalSupplyContracts?.map(({address, blockchain}) => (
            <Flex
              h="35px"
              bg={boxBg6}
              border={borders}
              color={text80}
              w="100%"
              mx="auto"
              borderRadius="8px"
              align="center"
              px="6px"
              mb="7.5px"
            >
              <Image
                src={
                  blockchainsContent[blockchain]?.logo || "/icon/unknown.png"
                }
                boxSize="22px"
                borderRadius="full"
                mr="7.5px"
              />
              <TextLandingSmall>{addressSlicer(address)}</TextLandingSmall>
              <ExternalLinkIcon color={text40} ml="auto" />
            </Flex>
          ))}
        </Flex>
      </Flex> */
